import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextResponse } from "next/server";
import { getDataFromRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
import setCorsHeaders from "@/lib/cors";

export const GET = async (res: NextResponse) => {
    try {
        // found data in redis cache
        const { cachedData, redis } = await getDataFromRedisCache("customers:all");
        //if found data
        if (cachedData) {
            res = NextResponse.json(cachedData, { status: 200 });
            return setCorsHeaders(res, "GET");
        }

        //if not found, fallback to database
        //connect mongodb
        await connectToDB();

        //  find all customer and sort by created date
        const customers = await Customer.find().sort({ createdAt: "desc" });
        //  if not found customers
        if (!customers) {
            res = NextResponse.json({ message: "No customer" }, { status: 400 });
            return setCorsHeaders(res, "GET");
        }
        //if found, set data to redis cache an return it
        // set data to redis cache with ttl = 3600s
        await setDataToRedisCache(redis, "customers:all", 3600, true, customers)
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            });
        // return
        res = NextResponse.json(customers, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("customers_GET: ", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}