import Customer from '@/lib/models/Customer';
import Orders from '@/lib/models/Orders';
import Product from '@/lib/models/Product';
import { connectToDB } from '@/lib/mongoDB';
import { stripe } from '@/lib/stripe';

import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("Stripe-Signature") as string;

        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET_KEY!
        )

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            console.log("[webhook_POST]", session);

            const customerInfo = {
                clerkId: session?.client_reference_id,
                name: session?.customer_details?.name,
                email: session?.customer_details?.email,
            };

            const shippingAddress = {
                streetNumber: session?.shipping_details?.address?.line1,
                streetName: session?.shipping_details?.address?.line2,
                city: session?.shipping_details?.address?.city,
                state: session?.shipping_details?.address?.state,
                postalCode: session?.shipping_details?.address?.postal_code,
                country: session?.shipping_details?.address?.country,
            };

            const retrieveSession = await stripe.checkout.sessions.retrieve(
                session.id,
                { expand: ["line_items.data.price.product"] },
            );

            const lineItems = await retrieveSession?.line_items?.data;

            const orderItems = lineItems?.map((item: any) => {
                return {
                    product: item.price.product.metadata.productId,
                    color: item.price.product.metadata.color || "N/A",
                    size: item.price.product.metadata.size || "N/A",
                    quantity: item.quantity,
                }
            });

            if (orderItems) {
                await connectToDB();

                const newOrder = new Orders({
                    customerClerkId: customerInfo.clerkId,
                    products: orderItems,
                    shippingAddress: shippingAddress,
                    shippingRate: session?.shipping_cost?.shipping_rate,
                    totalAmount: session.amount_total ? (session.amount_total) / 100 : 0,
                });

                if (!newOrder) {
                    console.log(newOrder);
                    return new NextResponse("Order is not created", { status: 400 });
                }
                await newOrder.save();

                for (const item of orderItems) {
                    const productId = item.product;
                    const quantityOrdered = item.quantity;
                    await Product.findByIdAndUpdate({ _id: productId }, { $inc: { inventory: -quantityOrdered } })
                }

                let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });
                if (customer) {
                    customer.orders.push(newOrder._id);
                } else {
                    customer = new Customer({
                        ...customerInfo,
                        orders: [newOrder._id],
                    })
                }
                await customer.save();
            } else {
                return new NextResponse("Order is not created", { status: 400 });
            }
        }
        return new NextResponse("Order created successfully", { status: 200 });
    } catch (error) {
        console.log("webhook_POST", error);
        return new NextResponse("Failed to create the order", { status: 500 });

    }
}