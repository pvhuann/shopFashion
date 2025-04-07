import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET =async (req: NextRequest)=> {
    try {
        await connectToDB();

        const customers= await Customer.find().sort({createdAt: "desc"});
        if(!customers){
            return new NextResponse("No customer", {status: 400});
        }
        return NextResponse.json(customers, {status: 200});
    } catch (error) {
        console.log("customers_GET: ",error);
        return new NextResponse("Internal Server Error", {status:500});
        
    }
}