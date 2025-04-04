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
            serverSelectionTimeoutMS: 10000, 
            connectTimeoutMS: 10000, 
        })
        isConnected = true;
        console.log("Mongodb is connected");

    } catch (error) {
        console.log(error);
    }
}