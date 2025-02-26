import express from 'express'
import cors from 'cors'
import 'dotenv/config.js'
import connectDB from "./configs/mongodb.js";
import userRouter from "./routes/userRoute.js";
import educatorRouter from "./routes/educatorRoute.js";
import {clerkMiddleware} from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import {stripeWebhooks} from "./controllers/webhooks.js";

const app = express()

app.use(cors())
app.use(clerkMiddleware())
app.get('/', (request, response) => {
    response.send('BACKEND РАБОТАЕТ')
})
connectDB()
connectCloudinary()

app.use('/api/user', userRouter)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)
const PORT = process.env.PORT || 6666

app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`)
})