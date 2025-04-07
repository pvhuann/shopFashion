import { set, connect,connection } from "mongoose";
let isConnected: boolean = false;


// * Connect to MongoDB database using Mongoose
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

// * Disconnect from MongoDB database
export const disconnectDB = async () => {
    if (isConnected) {
        await connection.close();
        isConnected = false;
        console.log("MongoDB is disconnected");
    }
    console.log("MongoDB is already disconnected");
}