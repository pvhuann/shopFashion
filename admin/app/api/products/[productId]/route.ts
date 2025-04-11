import { getDataFromRedisCache, invalidateKeyRedisCache, setDataToRedisCache } from '@/lib/actions/actions';
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server"
import setCorsHeaders from "@/lib/cors";

const PRODUCT_CACHE_TTL = 3600;
export const GET = async (req: NextRequest, res: NextResponse, { params }: { params: { productId: string } }) => {
    try {
        const { cachedData, redis } = await getDataFromRedisCache(`products:${params.productId}`);
        if (cachedData) {
            res = NextResponse.json(cachedData, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        await connectToDB();
        const product = await Product.findById(params.productId).populate({ path: "collections", model: Collection });
        // if products not found
        if (!product) {
            res = new NextResponse("Product not found", { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        // return product
        await setDataToRedisCache(redis, `products:${params.productId}`, PRODUCT_CACHE_TTL, true, product);
        res = new NextResponse(JSON.stringify(product), { status: 200, });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("productId_GET", error);
        res = NextResponse.json({ message: "Internal Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}


export const PUT = async (req: NextRequest,res : NextResponse, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()
        if (!userId) {
            res = NextResponse.json({message:"Internal Error"}, { status: 401 });
            return setCorsHeaders(res , "PUT");
        }

        await connectToDB()

        const product = await Product.findById(params.productId)
        if (!product) {
            res =  NextResponse.json({message:"Product not found"}, { status: 404 });
            return setCorsHeaders(res , "PUT");
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
            inventory,
        } = await req.json()

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
                inventory,
            },
            { new: true }
        ).populate({ path: "collections", model: Collection });
        await productUpdate.save();
        await invalidateKeyRedisCache(`products:all`);
        await invalidateKeyRedisCache(`products:${params.productId}`);
        await invalidateKeyRedisCache(`products:id-Title`);
        res = NextResponse.json(productUpdate, { status: 200 });
        return setCorsHeaders(res , "PUT");
    } catch (error) {
        console.log("productId_POST", error);
        res = NextResponse.json({message:"Internal Error"}, { status: 500 });
        return setCorsHeaders(res , "PUT");
    }
}



export const DELETE = async (req: NextRequest, res :NextResponse, { params }: { params: { productId: string } }) => {
    try {
        const { userId } = auth()
        if (!userId) {
            res =  NextResponse.json({message:"Unauthorized"}, { status: 401 });
            return setCorsHeaders(res , "DELETE");
        }
        await connectToDB();

        const product = await Product.findById(params.productId);
        if (!product) {
            res =  NextResponse.json({message:"Product not found"}, { status: 404 });
            return setCorsHeaders(res , "DELETE");
        }

        await Product.findByIdAndDelete(params.productId)

        // Update collections
        await Promise.all(
            product.collections.map((collectionId: string) =>
                Collection.findByIdAndUpdate(collectionId, {
                    $pull: { products: product._id },
                })
            )
        );

        // invalidate redis cache
        await invalidateKeyRedisCache([ 
            `products:all`,
            `products:${params.productId}`,
            `products:ids`,
            `products:id-Title`,
        ])
        .then(()=> {
            console.log("Redis cache invalidated successfully!");
        })
        .catch((err)=> {
            console.log("Error invalidating redis cache: ",err);
        })

        // return
        res = NextResponse.json({message:"Product deleted!"}, { status: 200 });
        return setCorsHeaders(res , "DELETE");
    } catch (error) {
        console.log("productId_DELETE", error);
        res = NextResponse.json({message:"Internal Error"}, { status: 500 });
        return setCorsHeaders(res , "DELETE");
    }
}