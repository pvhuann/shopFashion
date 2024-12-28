import mongoose from "mongoose";

const  collectionSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String,
        // default:null,
    },

    image :{
        type: String,
        // default:null,
        required: true,
    },

    products:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
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

const Collection= mongoose.models.Collection || mongoose.model("Collection", collectionSchema);
export default Collection