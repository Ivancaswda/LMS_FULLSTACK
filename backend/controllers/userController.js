import userModel from "../models/userModel.js";
import courseModel from "../models/courseModel.js";
import purchaseModel from "../models/purchaseModel.js";
import {Stripe} from "stripe";

const getUserData = async (request, response) => {
    try {
        const userId = request.auth.userId
        const user = await userModel.findById(userId)

        if (!user) {
            return response.json({success:false, message: 'user not found'})
        }

        request.json({success:true, user})
    } catch (error) {
        response.json({success:false, message:error.message})
    }
}

// Users enrolled courses with lecture links

const userEnrolledCourses = async (request, response) => {
    try {
        const userId = request.auth.userId
        const userData = await userModel.findById(userId).populate('enrolledCourses')

        response.json({success:true, enrolledCourses: userData.enrolledCourses})

    } catch (error) {
        response.json({success:false, message:error.message})
    }
}


const purchaseCourse = async (request, response) => {
    try {
        const {courseId} = request.body
        const {origin} = request.headers
        const userId = request.auth.userId
        const userData = await userModel.findById(userId)
        const courseData = await courseModel.findById(userId)

        if (userData || courseData) {
            return response.json({success:false, message: 'Данные не найдены'})
        }
        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)

        }

        const newPurchase = await purchaseModel.create(purchaseData) // astoring purchase data in db
        // initialize stripe gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLowerCase()

        // creating name, quantity and e.t.c for stripe payments
        const line_items = [{
            price_data:{
                currency,
                product_data: {
                    name:courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        response.json({success:true, session_url: session.url})

    } catch (error) {
        response.json({success: false, message: error.message})
    }
}
export {getUserData, userEnrolledCourses, purchaseCourse}