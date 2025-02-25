import { model, models, Schema } from "mongoose";
const  collectionSchema= new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
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
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
},{
    collection: "collections",
    timestamps:true});

const Collection= models.Collection || model("Collection", collectionSchema);
export default Collection