import { Webhook} from "svix";
import userModel from "../models/userModel.js";
import {Stripe} from "stripe";
import purchaseModel from "../models/purchaseModel.js";
import courseModel from "../models/courseModel.js";
// api controller function to manage clerk user with database

const clerkWebhooks = async (request, response) => {
    try {
        const whook = new Webhook(process.env.CLERk_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(request.body), {
            'svix-id': request.headers['svix-id'],
            'svix-timestamp': request.headers['svix-timestamp'],
            'svix-signature': request.headers['svix-signature']
        })
        const {data, type} = request.body

        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data._id,
                    email: data.email_address[0].email_address,
                    name: data.name + ' ' + data.lastName,
                    imageUrl: data.image_url
                }
                await userModel.create(userData)
                response.json({})


                break
            }
            case 'user.updated': {

                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.name + ' ' + data.lastName,
                    image: data.image_url
                }
                await userModel.findByIdAndUpdate(data._id, userData)
                response.json({})
                break
            }

            case 'user.deleted': {
                await userModel.findByIdAndDelete(data._id)
                response.json({})
                break
            }
            default: {
                break
            }

        }
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

const stripeInstance =  new Stripe(process.env.STRIPE_SECRET_KEY)

const stripeWebhooks = async (request,response) => {
    const sig = request.headers['stripe-signature']

    let event;
    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (error) {
        response.status(400).send(`Webhook error: ${error.message}`)
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':{

            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata;

            const purchaseData = await purchaseModel.findById(purchaseId)
            const userData = await userModel.findById(purchaseData.userId)
            const courseData = await courseModel.findById(userData.courseId.toString())

            courseData.enrolledStudents.push(userData)
            await courseData.save()

            userData.enrolledCourses.push(courseData._id)
            await userData.save()

            purchaseData.status = 'completed'
            await purchaseData.save()
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            const paymentIntentId = paymentIntent.id;
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId
            })
            const { purchaseId } = session.data[0].metadata;
            const purchaseData = await purchaseModel.findById(purchaseId)
            purchaseData.status = 'failed'

            await purchaseData.save()
            break;
        }

        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});

}

export {clerkWebhooks, stripeWebhooks}