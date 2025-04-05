import { model, models, Schema } from "mongoose";

const ProductSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    sku:{
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    vendor: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    collections: [
        {
            type: Schema.Types.ObjectId,
            ref: "Collection",
            default: null,
        }
    ],
    tags: {
        type: [String],
    },
    variants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Variant",
            default: null,
        },
    ],
}, {
    collection: "products",
    timestamps: true,
    toJSON: { getters: true },
    // toObject: { virtuals: true } // Add this line to make the virtual accessible when converting to plain JS
});

// ProductSchema.pre("save", function (next) {
//     this.updatedAt =new Date();
//     next();
// });


const Product = models.Product || model("Product", ProductSchema)
export default Product