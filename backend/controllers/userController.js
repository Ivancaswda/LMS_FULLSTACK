import userModel from "../models/userModel.js";
import courseModel from "../models/courseModel.js";
import purchaseModel from "../models/purchaseModel.js";
import {Stripe} from "stripe";
import courseProgress from "../models/courseProgress.js";
import courseProgressModel from "../models/courseProgress.js";

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


// update user course progress

const updateUserCourseProgress = async (request, response) => {
    try {
        const userId = request.auth.userId
        const {courseId, lectureId} = request.body
        const progressData = courseProgressModel.findOne({userId, courseId})



        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return response.json({success:true, message: 'Лекция уже завершена'})
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        } else {
            await courseProgressModel.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        response.json({success:true, message: 'Progress Updated'})

    } catch (error) {
        response.json({success:false, message:error.message})
    }
}
const getUserCourseProgress = async (request, response) => {


    try {
        const userId = request.auth.userId
        const {courseId, lectureId} = request.body
        const progressData = courseProgressModel.findOne({userId, courseId})
        response.json({success:true, progressData})
    } catch (error) {
        response.json({success:false, message:error.message})
    }

}

// add user ratings to course

const addUserRating = async (request, response) => {
    const userId =request.auth.userId
    const {courseId, rating} = request.body

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return response.json({success:false, message: 'Invalid Details'})
    }
    try {
        const course = await courseModel.findById(courseId)

        if (!course) {
            return response.json({success:false, message: 'курс не найден.'})
        }

        const user = await userModel.findById(userId);
        if (!user || !user.enrolledCourses.includes(courseId)) {
            return  response.json({success:false, message: 'Пользователь не приобрёл этот курс'})
        }

        const existingRatingIndex = course.courseRatings.findIndex((rating) => {
            return rating.userId === userId
        })
        if (existingRatingIndex > -1) {
            course.courseRatings[existingRatingIndex].rating = rating
        } else {
            course.courseRatings.push({userId, rating})
        }
        await course.save()

        return  response.json({success:true, message: 'Rating added'})
    } catch (error) {
        return response.json({success:false, message:error.message})
    }

}

export {getUserData, userEnrolledCourses, purchaseCourse, updateUserCourseProgress, getUserCourseProgress, addUserRating}