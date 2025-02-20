import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
    sku: {
        type: String,
        unique: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    color: {
        type: String,
    },
    image: {
        type: String,
    },
    material: {
        type: String,
    },
    style: {
        type: String,
    },
    size: {
        type: String,
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
        required: true,
        min: 0,
        default: 0,
    },
    expense: {
        type: mongoose.Schema.Types.Decimal128,
        get: (v: mongoose.Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
        min: 0,
        default: 0,
    },
    inventory: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    availability_variant: {
        type: Boolean,
        required: true,
        default: false,
    },
}, { timestamps: true });

const Variant = mongoose.models.Variant || mongoose.model("Variant", VariantSchema);
export default Variant;