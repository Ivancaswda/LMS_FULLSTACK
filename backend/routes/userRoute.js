import express from 'express'
import {clerkWebhooks} from "../controllers/webhooks.js";
import {getUserData, purchaseCourse, userEnrolledCourses} from "../controllers/userController.js";
const userRouter = express.Router()

userRouter.post('/clerk', clerkWebhooks)
userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)
export default userRouter