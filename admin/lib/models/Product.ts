
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
    media: {
        type: [String],
    },
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
            color: { type: String, default: null },
            image: { type: String, default: null },
            material: { type: String, default: null },
            style: { type: String, default: null },
            size: { type: String, default: null },
            price: {
                type: mongoose.Schema.Types.Decimal128,
                get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
                required: true,
                min: 0,
                default: 0,
            },
            expense: {
                type: mongoose.Schema.Types.Decimal128,
                get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
                min: 0,
                default: 0,
            },
            inventory: {
                type: Number,
                min: 0,
                default: 0,
            },
            availability_variant: {
                type: Boolean,
                required: true,
                default: false,
            },
        },
    ],

    createdAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now(),
    },

}, {
    toJSON: { getters: true },
    toObject: { virtuals: true } // Add this line to make the virtual accessible when converting to plain JS
});

ProductSchema.pre("save", function (next) {
    this.updatedAt =new Date();
    next();
});


const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
export default Product