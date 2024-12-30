import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    orders: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Orders",
            }
        ]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer; 