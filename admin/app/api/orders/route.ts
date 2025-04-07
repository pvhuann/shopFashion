import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format} from 'date-fns';
import Orders from "@/lib/models/Orders";

export const GET = async (req: NextRequest)=> {
    try {
        await connectToDB();
        const orders= await Orders.find().sort({createdAt:"desc"});
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

        return NextResponse.json(orderDetails, {status: 200}); 
    } catch (error) {
        console.log("orders_GET", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}