import { model, models, Schema } from "mongoose";

const vendorSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
},{
    collection: "vendors",
    timestamps: true,
})

const Vendor = models.Vendor || model("Vendor", vendorSchema);
export default Vendor;