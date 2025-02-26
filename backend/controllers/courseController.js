import courseModel from '../models/courseModel.js'
import userModel from "../models/userModel.js";
import purchaseModel from "../models/purchaseModel.js";
import {Stripe} from "stripe";

// get all courses
const getAllCourse = async (request, response) => {
    try {
        const courses = await courseModel.find({isPublished: true})
            .select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})

        response.json({success: true, courses})

    } catch (error) {
        response.json({success: false, message: error.message})
    }

}
// Get Course by Id
const getCourseId = async (request, response) => {
    const {id} = request.params

    try {
        const courseData = await courseModel.findById(id).populate({path: 'educator'})

        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                        lecture.lectureUrl = ""
                }
            })
        })
        response.json({success: true, courseData})
    } catch (error) {
        response.json({success: false, message: error.message})
    }
}



export {getAllCourse, getCourseId, }