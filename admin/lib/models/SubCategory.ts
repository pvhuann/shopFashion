import mongoose from "mongoose";


const subCategorySchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type:String,
    },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
})

const SubCategory = mongoose.models.SubCategory || mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;