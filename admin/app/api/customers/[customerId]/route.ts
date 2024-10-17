import Orders from "@/lib/models/Orders";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest, {params}: {params: {customerId: string}})=> {
    try {
        await connectToDB();
        
        const orders= await Orders.find({customerClerkId: params.customerId});
        if(!orders){
            return new NextResponse("Order not found", {status:404});
        }

        return NextResponse.json(orders, {status:200});
    } catch (error) {
        console.log("customerId:GET_Order",error);
        return new NextResponse("Internal Server Error", {status:500});
        
    }
}