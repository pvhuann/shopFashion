import { model, models, Schema } from "mongoose";

const saleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    variant_id: [
        {
            type: Schema.Types.ObjectId,
            ref: "Variant",
            required: true,
        }
    ],
    discountValue: {
        type: Number,
        required: true,
    },
    discountType: {
        type: String,
        required: true,
        enum: ["percentage", "fixed", "loyalty", "order_threshold"],
    },
    orderThreshold: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false,
    },
},
    {
        collection: "sales",
        timestamps: true,
        toJSON: { getters: true },
        toObject: { virtuals: true } // Add this line to make the virtual accessible when converting to plain JS
    });

const Sale = models.Sale || model("Sale", saleSchema);
export default Sale;