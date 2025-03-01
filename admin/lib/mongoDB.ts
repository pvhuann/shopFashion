// import mongoose from "mongoose";
import { set,connect } from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
    set("strictQuery", true);
    if (isConnected) {
        console.log("MongoDB is already connected");
        return;
    }
    try {
        await connect(process.env.MONGODB_URL || "", {
            dbName: "Shop_Admin",
            serverSelectionTimeoutMS: 20000, // 20 giây
            connectTimeoutMS: 20000, // 20 giây
        })
        isConnected = true;
        console.log("Mongodb is connected");

    } catch (error) {
        console.log(error);
    }
}