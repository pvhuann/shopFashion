import { model, models, Schema } from "mongoose";
const customerSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    orders: {
        type: [
            {
                type:Schema.Types.ObjectId,
                ref: "Orders",
            }
        ]
    },
},{
    timestamps: true,
});

const Customer = models.Customer || model("Customer", customerSchema);
export default Customer; 