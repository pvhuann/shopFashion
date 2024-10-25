import mongoose from "mongoose";

const  categorySchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    description: String,

    image :{
        type: String,
    },

    // products:[
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Product"
    //     }
    // ],
    subCategory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
        }
    ],
    createdAt: {
        type:Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now,
    }
})

const Category= mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category