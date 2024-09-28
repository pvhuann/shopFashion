import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        required: true,
    },
    name: String,
    email: String,
    orders: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer; 