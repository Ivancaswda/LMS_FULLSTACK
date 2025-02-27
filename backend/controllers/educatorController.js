

import {clerkClient} from "@clerk/express";
import courseModel from "../models/courseModel.js";
import {v2 as cloudinary} from "cloudinary";
import purchaseModel from "../models/purchaseModel.js";
import userModel from "../models/userModel.js";
// regular user can became educator
const updateRoleToEducator = async (request, response) => {
    try {
        const userId = request.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator'
            }
        })

        response.json({success:true, message: 'Вы теперь можете добавлять курсы'})

    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

const addCourse = async (request, response) => {
    try {
        const { courseData } = request.body
        const imageFile = request.file
        const educatorId = request.auth.userId
        if (!imageFile) {
            return response.json({success: false, message: 'Изображение не найдено!'})
        }
        const parsedCourseData = await JSON.parse(courseData)
        // creating new data
        parsedCourseData.educator = educatorId
        //creating new course
        const newCourse = await courseModel.create(parsedCourseData)

        // uploading the image via cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        // getting in secure url
        newCourse.courseThumnail = imageUpload.secure_url
        await newCourse.save()

        response.json({success:true, message: 'Курс добавлен'})
    } catch (error) {
        response.json({success:false, message: error.message})
    }
}

// Get educator courses

const getEducatorCourses = async (request, response) => {
    try {
        const educator = request.auth.userId

        const courses = await courseModel.find({educator}) // getting all courses of the singed educator

        response.json({success: true, courses})
    } catch (error) {
        response.json({success: false, message: error.message})
    }
}

// get educator dashboard data (Total earning, enrolled students, № of Courses)

const educatorDashboardData = async (request, response) => {
        try {

            const educator = request.auth.userId;
            const courses = await courseModel.find({educator})
            // getting total № of courses
            const totalCourses = courses.length;

            const courseIds = courses.map((course) => {
                return course._id
            });

            // total earning, we need id of each courses
            const purchases = await purchaseModel.find({
                courseId: {$in: courseIds},
                status: 'completed'
            })
            const totalEarnings = purchases.reduce((sum, purchase) =>  {
                return sum + purchase.amount
            }, 0)

            const enrolledStudentsData = []

            for (const course of courses) {
                const students = await userModel.find({
                    _id: {$in: course.enrolledStudents},

                }, 'name imageUrl')

                students.forEach((student) => {
                    enrolledStudentsData.push({
                        courseTitle: course.courseTitle,
                        student
                    })
                })
            }

            response.json({success: true, dashboardData: {
                    totalEarnings, enrolledStudentsData, totalCourses
                }})



        } catch (error) {
            response.json({success: false, message: error.message})
        }
}
const getEnrolledStudentsData = async (request,response) => {
    try {
        const educator = request.auth.userId
        const courses = await courseModel.find({educator})
        const courseIds = courses.map(course => course._id)
        const purchases = await purchaseModel.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }))

        response.json({success:true, enrolledStudents})

    } catch (error) {
        response.json({success: false, message: error.message})
    }
}



export {updateRoleToEducator, addCourse, getEducatorCourses, educatorDashboardData, getEnrolledStudentsData}