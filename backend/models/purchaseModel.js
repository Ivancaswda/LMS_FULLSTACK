import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: 'Course', required:true},
    userId: {type: String, ref: 'User', required: true},
    amount: {type:Number, required: true},
                // would be only pending, completed or failed
    status: {type:String, enum: ['pending', 'completed', 'failed'], default:'pending'}

}, {timestamps: true})

const purchaseModel = mongoose.models.purchase || mongoose.model('purchase', purchaseSchema)

export default purchaseModel