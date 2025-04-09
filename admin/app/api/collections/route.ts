
import Collection from "@/lib/models/Collection";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import setCorsHeaders from "@/lib/cors";
import { getRedisClient } from "@/lib/db/init.redis";

const COLLECTIONS_CACHE_TTL = 60 * 60 * 24; // 1 day in seconds
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
        const { searchParams } = new URL(req.url);
        const data = searchParams.get("data");
        const cacheSuffix = data === "id-title" ? "id-title" : "all";
        const cacheKey = `collections:${cacheSuffix}`;
        let redis;
        // get data from redis cache
        try {
            redis = await getRedisClient();
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                console.log("Redis cache hit: ", cacheKey);
                const collections = JSON.parse(cachedData);
                res = NextResponse.json(collections, { status: 200 });
                return setCorsHeaders(res, "GET");
            }
            console.log("Redis cache miss: ", cacheKey);
        } catch (error) {
            console.log("Redis error: ", error);
            redis = null;
        }

        //if redis is not available get data from database and set data to redis cache
        try {
            await connectToDB();
            let query = Collection.find().sort({ createdAt: 'desc' });
            if(!data){
                query = Collection.find().sort({ createdAt: 'desc' });
            }else if (data === "id") {
                query = Collection.find({ _id: 1 }).sort({ createdAt: 'desc' });
            }
            else if (data === "id-title") {
                query = Collection.find({ _id: 1, title: 1 }).sort({ createdAt: 'desc' });
            }
            const collections = await query.exec();
            // if not found or collections list is empty
            if(!collections || collections.length ===0){
                res = NextResponse.json({ message: "No collections found" }, { status: 404 });
                return setCorsHeaders(res, "GET");
            }
            // set data to redis cache
            if(redis){
                try {
                    await redis.set(cacheKey, JSON.stringify(collections), {
                        EX: COLLECTIONS_CACHE_TTL, // 1 day in seconds
                        NX: true,
                    });
                    console.log(`Redis cache set for ${cacheKey} with ${COLLECTIONS_CACHE_TTL} seconds`);
                } catch (error) {
                    console.log("Error setting cache: ", error);
                }
            }
            res = NextResponse.json(collections, { status: 200 });
            return setCorsHeaders(res, "GET");
        } catch (error) {
            console.log("Collections_GET", error);
            res = NextResponse.json({ error: { message: "Internal Server Error" } }, { status: 500 });
            return setCorsHeaders(res, "GET");
        }
}
