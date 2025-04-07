import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET= async(request:NextRequest, {params}:{params: {query: string}})=> {
    try {
        await connectToDB();

        const searchProducts= await Product.find({
            $or:[
                {title: {$regex:params.query, $options:'i' }},
                {category:{$regex:params.query, $options:'i'}},
                {tags:{$in: [new RegExp(params.query, 'i')]}},
            ]
        })

        return NextResponse.json(searchProducts,{status: 200});
        
    } catch (error) {
        console.log("search_query", error);
        return new NextResponse("Internal server error", {status: 500});
    }
}