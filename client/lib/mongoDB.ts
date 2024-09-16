import mongoose from "mongoose";


let isConnected: boolean = false;


export const connectToDB =async (): Promise<void> => {
    mongoose.set("strictQuery", true)
    if(isConnected){
        console.log("MongoDb is already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL || "", {
            dbName: "Shop_Store"
        })

        isConnected= true;
        console.log("MongoDb is connected");
        
    } catch (error) {
        console.log(error);
        
    }
}