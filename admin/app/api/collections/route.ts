
import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import setCorsHeaders from "@/lib/cors";

// const limiter= rateLimit;
//POST request collection
export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        //check user with clerk authentication
        const { userId } = auth();
        if (!userId) {
            res = NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
            return setCorsHeaders(res, "POST");
        }
        await connectToDB();
        const { title, description, image } = await req.json();
        if (!title) {
            res = NextResponse.json({ message: "Title is a required" }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        const existingCollection = await Collection.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        if (existingCollection) {
            res = NextResponse.json({ error: { message: "Collection title already exists", fieldError: "title" } }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }

        const newCollection = await Collection.create({ title, description, image });
        await newCollection.save();
        res = NextResponse.json(newCollection, { status: 200 });
        return setCorsHeaders(res, "POST");
    } catch (error) {
        console.log("collections_POST", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "POST");
    }
}


//GET all collections from the database 
export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        await connectToDB();
        const { searchParams } = new URL(req.url);
        const data = searchParams.get("data");
        const cacheSuffix = data ==="id-title"?"id-title":"all";
        const cacheKey = `collections:${cacheSuffix}`;
        let redis;
        try {
            
        } catch (error) {
            console.log("");
            
        }
        let query = Collection.find().sort({ createdAt: 'desc' });
        if (data === "id") {
            query = Collection.find({ _id: 1 }).sort({ createdAt: 'desc' });
        }
        else if (data === "id-title") {
            query = Collection.find({ _id: 1, title: 1 }).sort({ createdAt: 'desc' });
        }
        const collections = await query.exec();
        res = NextResponse.json(collections, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("Collections_GET", error);
        res = NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}
