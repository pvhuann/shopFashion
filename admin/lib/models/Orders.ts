import mongoose from "mongoose";


const ordersSchema = new mongoose.Schema({
    customerClerkId: {
        type: String,
        required: true,
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            price:Number,
            color: String,
            size: String,
            quantity: Number,
        }
    ],

    shippingAddress: {
        streetNumber: String,
        streetName: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    shippingRate: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Orders= mongoose.models.Orders || mongoose.model("Orders", ordersSchema);
export default Orders;
