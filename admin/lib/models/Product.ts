import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    media: {
        type: [String],
    },
    category: {
        type: String,
    },
    collections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
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
    // variants: [
    //     {
    //         color: { type: String, },
    //         image: { type: String, },
    //         size: { type: String, },
    //         price: {
    //             type: mongoose.Schema.Types.Decimal128,
    //             get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }
    //         },
    //         inventory: {
    //             type: mongoose.Schema.Types.Decimal128,
    //             get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }
    //         },
    //         sale: {
    //             type: mongoose.Schema.Types.Decimal128,
    //             get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
    //             default: 0,
    //         },
    //     },
    // ],
    price: {
        type: mongoose.Schema.Types.Decimal128,
        get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }
    },
    expense: {
        type: mongoose.Schema.Types.Decimal128,
        get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) }
    },
    // stock: {
    //     type:Number, 
    //     min:0,
    // },
    createAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },

}, {
    toJSON: { getters: true }
}
)

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema)
export default Product