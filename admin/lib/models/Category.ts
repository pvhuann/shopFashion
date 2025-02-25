import { model, models, Schema } from "mongoose";

const categorySchema = new Schema({
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
        type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
            ref:"Product",
            default: null, // Top-level products have no parent
        }
    ],
},{
    collection: "categories",
    timestamps: true
});

const Category = models.Category || model("Category", categorySchema);
export default Category