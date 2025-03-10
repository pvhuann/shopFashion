
import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// const limiter= rateLimit;
//POST request collection
export const POST = async(req:NextRequest)=> {
    try {
        //check user with clerk authentication
        const {userId}= auth();
        if(!userId) {
            return new NextResponse("Unauthorized access", {status: 403});
        }

        await connectToDB();

        const {title, description, image}= await req.json()     ;  
        if(!title){
            return new NextResponse("Title is a required", {status:400});
        }
        const existingCollection = await Collection.findOne({title:{$regex: new RegExp(`^${title}$`, 'i')} });
        if(existingCollection){
            return NextResponse.json({error:{message:"Collection title already exists", fieldError:"title"}}, {status:400});
        }

        const newCollection = await Collection.create({title, description, image});
        await newCollection.save();
        return NextResponse.json(newCollection, { status: 200 });     
    } catch (error) {
        console.log("collections_POST",error);
        return new NextResponse("Internal Server Error", {status:500});        
    }
}


//GET all collections from the database 
export const GET = async(req: NextRequest)=>{
    try {
        await connectToDB();
        const collections= await Collection.find().sort({createdAt:'desc'})
        return NextResponse.json(collections,{status:200})
    } catch (error) {
        console.log("Collections_GET",error);
        return new NextResponse("Internal Server Error", {status:500})
        
    }
}
