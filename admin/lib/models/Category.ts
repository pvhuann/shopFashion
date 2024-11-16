import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        default: null
    },

    image: {
        type: String,
        default: null,
    },

    parent: { // Reference to the parent category (if any)
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // Reference to itself
        default: null, // Top-level categories have no parent
    },
    // subcategories: [ // Array to store direct children categories
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Category",
    //     },
    // ],
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
            default: null, // Top-level products have no parent
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category