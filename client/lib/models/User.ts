import { Schema ,models,model} from "mongoose"
const userSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true,
    },
    wishList: {
        type: Array,
        default: [],
    },
},{
    timestamps: true,
});

const User = models.User || model("User", userSchema);
export default User;
