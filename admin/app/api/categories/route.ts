import Category from "@/lib/models/Category";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest) => {
    try {
        await connectToDB()

        const categories = await Category.find({})
        if (!categories) { return new NextResponse("Categories not found", { status: 404 }) }

        const res=  NextResponse.json((categories), { status: 200 });
        res.headers.set("Access-Control-Allow-Origin", "http://localhost:4000");
        res.headers.set("Access-Control-Allow-Methods", "GET");
        res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.headers.set("Access-Control-Allow-Credentials", "true");
        return res;
    } catch (error) {
        console.log("categories_GET:", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}

export const POST = async (req: NextRequest) => {
    try {
        const { title, description, image , parent} = await req.json();
        if (!title) {
            return new NextResponse("Title is required", { status: 400 })
        }
        await connectToDB();

        const existingCategory = await Category.findOne({ title , parent})
        if (existingCategory) {
            return new NextResponse("Category already exists", { status: 400 })
        }

        const newCategory = await Category.create({ title, description, image, parent })
        await newCategory.save()
        return new NextResponse(JSON.stringify(newCategory), { status: 200 })

    } catch (error) {
        console.log("categories_POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}