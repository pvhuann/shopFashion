import Customer from "@/lib/models/Customer";
import Orders from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
    try {
        await connectToDB();

        const orderDetails = await Orders.findById(params.orderId)
            .populate({
                path: "products.product",
                model: Product,
            });

        if (!orderDetails) {
            return new NextResponse("Order not found", { status: 404 });
        }
        const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId });
        if (!customer) {
            return new NextResponse("Customer not found by ClerkId from OrderDetails", { status: 404 });
        }

        return NextResponse.json({ orderDetails, customer }, { status: 200 });
    } catch (error) {
        console.log("orderId_GET", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}