import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    product: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            // required: true,
            variants: [{
                color: {
                    type: String,
                },
                size: {
                    type: String,
                },
                style: {
                    type: String,
                },
                material: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            }]
        }
    ],
    discountValue: {
        type: Number,
        required: true,
    },
    discountType:{
        type: String,
        required: true,
        enum: ["percentage", "fixed","loyalty", "order_threshold"],
    },
    orderThreshold: {
        type: Number,
        default:0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive:{
        type: Boolean,
        required: true,
        default: false,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now(),
    }
},
    {
        toJSON: { getters: true },
        toObject: { virtuals: true } // Add this line to make the virtual accessible when converting to plain JS
    });

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
export default Sale;