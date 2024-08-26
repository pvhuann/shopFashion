import Product from "@/lib/models/products";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { userId } = auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB()

        const {
            title,
            description,
            media,
            category,
            collections,
            tags,
            colors,
            sizes,
            prices,
            expense } = await req.json()

        if (!title || !description || !media || !category  || !prices ||!expense ) {
            return new NextResponse("Not enough data to create a new product", { status: 400 })
        }

        const newProduct = await Product.create(
            {
                title,
                description,
                media,
                category,
                collections,
                tags,
                sizes,
                colors,
                prices,
                expense,
            }
        )

        await newProduct.save()

        return NextResponse.json(newProduct, { status: 200 })
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}