import Category from "@/lib/models/Category";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getRedisClient } from "@/lib/db/init.redis";
import { setCorsHeaders } from "@/lib/cors";
import { getDataFromRedisCache, invalidateKeyRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
// time to live cache
const CATEGORIES_CACHE_TTL = 60 * 60 * 24; // 1 day in seconds
export const GET = async (req: NextRequest, res: NextResponse) => {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");
    const cacheSuffix = data === "id-title" ? "id-title" : "all";
    const cacheKey = `categories:${cacheSuffix}`;
    const { cachedData, redis } = await getDataFromRedisCache(cacheKey);
    // If data is found in redis cache, return it
    if (cachedData) {
        res = NextResponse.json(cachedData, { status: 200 });
        return setCorsHeaders(res, "GET");
    }
    // If redis is not available, fallback to database
    try {
        await connectToDB();
        let query;
        if (data === "id-title") {
            query = Category.find({}, { _id: 1, title: 1 }).sort({ title: 1 });
        } else {
            query = Category.find().sort({ title: 1 });
        }
        const categories = await query.exec();
        // Set data to redis cache
        await setDataToRedisCache(redis, cacheKey, CATEGORIES_CACHE_TTL, true, categories);
        // if not found or categories list is empty
        if (!categories || categories.length === 0) {
            res = NextResponse.json({ message: "No categories found" }, { status: 404 })
            return setCorsHeaders(res, "GET");
        }
        // return data from mongodb
        res = NextResponse.json((categories), { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("categories_GET:", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}


export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { title, description, image, parent } = await req.json();
        if (!title) {
            res = NextResponse.json({ message: "Title is required" }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        await connectToDB();

        const existingCategory = await Category.findOne({ title, parent });
        if (existingCategory) {
            res = NextResponse.json({ message: "Category already exists" }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        const newCategory = await Category.create({ title, description, image, parent });
        await newCategory.save();
        res = NextResponse.json(JSON.stringify(newCategory), { status: 201 });
        // Invalidate the cache for categories
        await invalidateKeyRedisCache(`categories:all`);
        return setCorsHeaders(res, "POST");
    } catch (error) {
        console.log("categories_POST:", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "POST");
    }
}