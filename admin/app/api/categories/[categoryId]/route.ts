import Category from "@/lib/models/Category";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";
import setCorsHeaders from "@/lib/cors";
import { invalidateKeyRedisCache } from "@/lib/actions/actions";



// update category
export const PUT = async (req: NextRequest, res: NextResponse, { params }: { params: { categoryId: string } }) => {
    try {
        await connectToDB();
        let category = await Category.findById(params.categoryId);
        if (!category) {
            res = NextResponse.json({ message: "Category not found" }, { status: 404 });
            return setCorsHeaders(res, "PUT");
        }
        const { title, description, image } = await req.json();
        if (!title || !description || !image) {
            res = NextResponse.json({ message: "All fields are required" }, { status: 400 });
            return setCorsHeaders(res, "PUT");
        }
        category = await Category.findByIdAndUpdate(
            params.categoryId,
            { title, description, image },
            { new: true }
        )
        await category.save()
        res = NextResponse.json(JSON.stringify(category), { status: 200 });
        // Invalidate the cache for categories
        await invalidateKeyRedisCache([`categories:all`, `categories:id-title`])
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            })
        return setCorsHeaders(res, "PUT");
    } catch (error) {
        console.log("category_POST:", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        return setCorsHeaders(res, "PUT");
    }
}

// delete category 
export const DELETE = async (req: NextRequest, res: NextResponse, { params }: { params: { categoryId: string } }) => {
    try {
        await connectToDB();
        const result = await Category.findByIdAndDelete(params.categoryId);
        if (!result) {
            res = NextResponse.json({ message: "Category not found" }, { status: 404 });
            return setCorsHeaders(res, "DELETE");
        }
        await Product.updateMany({ category: params.categoryId }, { $pull: { category: params.categoryId } });
        // Invalidate the cache for categories
        await invalidateKeyRedisCache([`categories:all`, `categories:id-title`])
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            })
        res = NextResponse.json({ message: "Category deleted" }, { status: 200 });
        return setCorsHeaders(res, "DELETE");
    } catch (error) {
        console.log("category_DELETE:", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        return setCorsHeaders(res, "DELETE");
    }
}

// get category
export const GET = async (req: NextRequest, res: NextResponse, { params }: { params: { categoryId: string } }) => {
    try {
        await connectToDB();
        const category = await Category.findById(params.categoryId);
        if (!category) {
            res = NextResponse.json({ message: "Category not found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        res = NextResponse.json(JSON.stringify(category), { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("category_GET:", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        return setCorsHeaders(res, "GET");
    }
}