import { min } from "date-fns";
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
        ref: "Product",
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
    sizes: {
        type: [String],
    },
    colors: {
        type: [String],
    },
    variants: [
        {
            color: { type: String, default: null },
            image: { type: String, default: null },
            material: { type: String,  default: null},
            style: { type: String,  default: null},
            size: { type: String,  default: null},
            price: {
                type: mongoose.Schema.Types.Decimal128,
                get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
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
            }
        },
    ],
    price: {
        type: mongoose.Schema.Types.Decimal128,
        get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }
    },
    expense: {
        type: mongoose.Schema.Types.Decimal128,
        get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }
    },
    inventory: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },

}, {
    toJSON: { getters: true }
}
)

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
export default Product