import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";



// update category
export const POST = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {

    try {
        await connectToDB();
        let category = await Category.findById(params.categoryId);
        if (!category) {
            return new NextResponse("Category not found", { status: 404 })
        }

        const { title, description, image } = await req.json();
        if (!title || !description || !image) {
            return new NextResponse("Title, Description and Image are required", { status: 400 })
        }

        category = await Category.findByIdAndUpdate(
            params.categoryId,
            { title, description, image },
            { new: true }
        )

        await category.save()

        return new NextResponse(JSON.stringify(category), { status: 200 })

    } catch (error) {
        console.log("category_POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

// delete category 
export const DELETE = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
    try {
        await connectToDB();

        const result = await Category.findByIdAndDelete(params.categoryId);
        if (!result) {
            return new NextResponse("Category not found", { status: 404 })
        }
        await Product.updateMany({ category: params.categoryId }, { $pull: { category: params.categoryId } });
        
        return new NextResponse("Category deleted", { status: 200 })

    } catch (error) {
        console.log("category_DELETE:", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

// get category
export const GET = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
    try {
        await connectToDB();
        const category = await Category.findById(params.categoryId);
        if (!category) {
            return new NextResponse("Category not found", { status: 404 })
        }
        return new NextResponse(JSON.stringify(category), { status: 200 })
    } catch (error) {
        console.log("category_GET:", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}