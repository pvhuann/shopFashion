import Category from "@/lib/models/Category";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const categories = await Category.find({})
        if (!categories) { return new NextResponse("Categories not found", { status: 404 }) }

        return new NextResponse(JSON.stringify(categories), { status: 200 })
    } catch (error) {
        console.log("categories_GET:", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}

export const POST = async (req: NextRequest) => {
    try {
        const { title, description, image } = await req.json();
        if (!title || !description || !image) {
            return new NextResponse("Title, Description and Image are required", { status: 400 })
        }
        await connectToDB();

        const existingCategory = await Category.findOne({ title })
        if (existingCategory) {
            return new NextResponse("Category already exists", { status: 400 })
        }

        const newCategory = await Category.create({ title, description, image })
        await newCategory.save()
        return new NextResponse(JSON.stringify(newCategory), { status: 200 })

    } catch (error) {
        console.log("categories_POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}