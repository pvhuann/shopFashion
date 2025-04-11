import Customer from "@/lib/models/Customer";
import Orders from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
import setCorsHeaders from "@/lib/cors";

export const GET = async (req: NextRequest, res: NextResponse, { params }: { params: { orderId: string } }) => {
    try {

        // found data in redis cache
        const { cachedData, redis } = await getDataFromRedisCache(`orders:${params.orderId}`);
        if (cachedData) {
            res = NextResponse.json(cachedData, { status: 200 });
            return setCorsHeaders(res, "GET");
        }

        //if not found, fallback to database
        // connect to mongodb
        await connectToDB();
        // find order by id
        const orderDetails = await Orders.findById(params.orderId)
            .populate({
                path: "products.product",
                model: Product,
            });

        // if order not found
        if (!orderDetails) {
            res = NextResponse.json("Order not found", { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        // if found order, find customer of the order 
        const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId });
        // if not found customer
        if (!customer) {
            res = NextResponse.json({ message: "Customer not found by ClerkId from OrderDetails" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        // if found, set data in cache redis and return it
        //set data to cache redis with ttl = 3600s
        await setDataToRedisCache(redis, `orders:${params.orderId}`, 3600, true, { orderDetails, customer })
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            });
        // return 
        res = NextResponse.json({ orderDetails, customer }, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("orderId_GET", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}