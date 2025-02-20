import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant", required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
});

const PaymentSchema = new mongoose.Schema({
    method: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer","Stripe"], required: true },
    transactionId: { type: String, unique: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
});

const ShippingSchema = new mongoose.Schema({
    address: { type: String, required: true },
    trackingNumber: { type: String, unique: true },
    carrier: { type: String },
});

const TestOrderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [OrderItemSchema],
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
        payment: PaymentSchema,
        shipping: ShippingSchema,
    },
    { timestamps: true }
);

export default mongoose.models.TestOrder || mongoose.model("TestOrder", TestOrderSchema);
