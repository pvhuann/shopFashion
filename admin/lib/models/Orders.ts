import { model, models, Schema } from "mongoose";

const ordersSchema = new Schema({
    customerClerkId: {
        type: String,
        required: true,
    },

    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            // Properties of the variant
            variant: {
                color: {
                    type: String,
                    default: null,
                }, 
                size: {
                    type: String,
                    default: null,
                },
                style: {
                    type: String,
                    default: null,
                },
                material: {
                    type: String,
                    default: null,
                },
                price: Number, //price at time order
            }, 
            quantity: {
                type: Number,
                min: 1,
                required: true,
            }, // quantity of the product in the order
        },
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
    }, // shipping rates of the order
    totalAmount: {
        type: Number,
        required: true,
    }, // total amount of the order
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending',
        required: true,
    }, // payment status of the order
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Orders = models.Orders || model("Orders", ordersSchema);
export default Orders;
