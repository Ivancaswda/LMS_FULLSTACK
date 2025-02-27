import mongoose from 'mongoose'

const connectDB = async () => {
    mongoose.connection.on( 'connected',() => {
        console.log('База данных подключена')
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/lms_fullstack`)
}
export default connectDB