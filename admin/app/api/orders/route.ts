import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format} from 'date-fns';
import Orders from "@/lib/models/Orders";
import { getDataFromRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
import setCorsHeaders from "@/lib/cors";

export const GET = async (req: NextRequest, res :NextResponse)=> {
    try {
        // found data in redis cache
        const {cachedData, redis} = await getDataFromRedisCache("orders:all");
        //if found data
        if(cachedData){
            res = NextResponse.json(cachedData, {status: 200});
            return setCorsHeaders(res, "GET");
        }

        // if not found data in redis cache, fallback to database
        //connect mongodb
        await connectToDB();
        // find all orders
        const orders= await Orders.find().sort({createdAt:"desc"});
        // match order into customer
        const orderDetails= await Promise.all(orders.map( async (order)=> {
            const customer= await Customer.findOne({clerkId: order.customerClerkId});
            return {
                _id: order._id,
                customer: customer.name,
                products: order.products,
                totalAmount: order.totalAmount,
                createdAt: format(order.createdAt, "HH:mm:ss MMM do, yyyy"),
            }
        }));

        // set data to redis cache with ttl =3600s
        await setDataToRedisCache(redis, "orders:all", 3600, true, orderDetails);

        //return
        res = NextResponse.json(orderDetails, {status: 200}); 
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("orders_GET", error);
        res =  NextResponse.json({message:"Internal Server Error"}, {status: 500});
        return setCorsHeaders(res, "GET");
    }
}