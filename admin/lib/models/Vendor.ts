import mongoose from "mongoose";


const vendorSchema = new mongoose.Schema({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
},{
    timestamps: true,
})

const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
export default Vendor;