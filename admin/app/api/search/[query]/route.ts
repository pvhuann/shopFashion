import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextResponse } from "next/server";
import setCorsHeaders from "@/lib/cors";

export const GET= async(res: NextResponse,{params}:{params: {query: string}})=> {
    try {
        await connectToDB();

        const searchProducts= await Product.find({
            $or:[
                {title: {$regex:params.query, $options:'i' }},
                {category:{$regex:params.query, $options:'i'}},
                {tags:{$in: [new RegExp(params.query, 'i')]}},
            ]
        })

        res = NextResponse.json(searchProducts,{status: 200});
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("search_query", error);
        res = NextResponse.json({message:"Internal server error"}, {status: 500});
        return setCorsHeaders(res, "GET");
    }
}