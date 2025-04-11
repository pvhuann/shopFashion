import Orders from "@/lib/models/Orders";
import { connectToDB } from "@/lib/db/init.mongoDB";
import {  NextResponse } from "next/server";
import { getDataFromRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
import setCorsHeaders from "@/lib/cors";

export const GET = async( res : NextResponse, {params}: {params: {customerId: string}})=> {
    try {
        //found data in redis cache
        const {cachedData, redis }= await getDataFromRedisCache(`orders:${params.customerId}`);
        //if found data
        if(cachedData){
            res = NextResponse.json(cachedData, {status:200});
            return setCorsHeaders(res, "GET");
        }

        // if not found data, fallback to database
        //connect mongodb
        await connectToDB();
        
        // find all order by customer id
        const orders= await Orders.find({customerClerkId: params.customerId});
        // if not order
        if(!orders){
            res= NextResponse.json({message:"Order not found"}, {status:404});
            return setCorsHeaders(res, "GET");
        }
        // if found order -> set data to cache redis-. return it
        // set data to redis cache with ttl=3600s
        await setDataToRedisCache(redis, `orders:${params.customerId}`, 3600, true, orders)
        .then(()=> {
            console.log("Redis cache invalidated successfully!");
        })
        .catch((err)=> {
            console.log("Error invalidating redis cache: ",err);
        });
        // return
        res = NextResponse.json(orders, {status:200});
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("customerId:GET_Order",error);
        res = NextResponse.json({message: "Internal Server Error"}, {status:500});
        return setCorsHeaders(res, "GET");
        
    }
}