import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server"


export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await connectToDB()

        const product = await Product.findById(params.productId)
            .populate({ path: "collections", model: Collection });
        if (!product) {
            return new NextResponse("Product not found", { status: 404 })
        }

        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.log("productId_GET", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}


export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB()

        const product = await Product.findById(params.productId)
        if (!product) {
            return new NextResponse("Product not found", { status: 404 })
        }

        const {
            title,
            description,
            media,
            category,
            collections,
            tags,
            sizes,
            colors,
            price,
            expense,
        }= await req.json()

        const productUpdate = await Product.findByIdAndUpdate(
            params.productId,
            {
                title,
                description,
                media,
                category,
                collections,
                tags,
                sizes,
                colors,
                price,
                expense,
            },
            { new: true }
        ).populate({ path: "collections" , model: Collection})

        await productUpdate.save()
        return NextResponse.json(productUpdate, {status: 200})

    } catch (error) {
        console.log("productId_POST", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}



export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB()

        const product = await Product.findById(params.productId)
        if (!product) {
            return new NextResponse("Product not found", { status: 404 })
        }

        await Product.findByIdAndDelete(params.productId)
        return new NextResponse("Product deleted", { status: 200 })

    } catch (error) {
        console.log("productId_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}