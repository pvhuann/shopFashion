import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';


const corsHeaders = {
    // "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_SHOP_URL}`,
    // "Access-Control-Allow-Credentials" : "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
    typescript: true,
});

export async function POST(req: NextRequest) {
    try {
        const { cartItems, customer } = await req.json();
        if (!cartItems || !customer) {
            return new NextResponse("Not enough data to checkout", { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["US", "CA"],
            },
            shipping_options: [
                { shipping_rate: "shr_1Q1JsPRqDmAZjfwmAHVCR2E2" },
                { shipping_rate: "shr_1Q1JtTRqDmAZjfwm4lNGYv6U" },
            ],
            line_items: cartItems.map((cartItem: any) => ({
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: cartItem.item.title,
                        metadata: {
                            productId: cartItem.item._id,
                            ...(cartItem.size && { size: cartItem.size }),
                            ...(cartItem.color && { color: cartItem.color }),
                        },
                    },
                    unit_amount: cartItem.item.price * 100,
                },
                quantity: cartItem.quantity,
            })),
            client_reference_id: customer.clerkId,
            success_url: `${process.env.ECOMMERCE_SHOP_URL}/payment_success`,
            cancel_url: `${process.env.ECOMMERCE_SHOP_URL}/cart`,
        });

        return NextResponse.json(session, { headers: corsHeaders });
    } catch (error) {
        console.log("checkout_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

