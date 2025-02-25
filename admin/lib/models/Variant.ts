import { model, models, Schema } from "mongoose";

const VariantSchema = new Schema({
    sku: {
        type: String,
        unique: true,
    },
    product_id: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.Decimal128,
        get: (v: Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
        required: true,
        min: 0,
        default: 0,
    },
    expense: {
        type: Schema.Types.Decimal128,
        get: (v: Schema.Types.Decimal128) => { return parseFloat(v.toString()) },
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

const Variant = models.Variant || model("Variant", VariantSchema);
export default Variant;