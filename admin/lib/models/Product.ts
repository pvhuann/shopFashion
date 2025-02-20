
import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        default: null,
    },
    media: [
        {
            url:{
                type: String,
            },
            type: {
                type: String,
                enum: ["image", "video"],
            }
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
            default: null,
        }
    ],
    tags: {
        type: [String],
    },
    variants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Variant",
            default: null,
        },
    ],
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { virtuals: true } // Add this line to make the virtual accessible when converting to plain JS
});

ProductSchema.pre("save", function (next) {
    this.updatedAt =new Date();
    next();
});


const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
export default Product