import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
import setCorsHeaders from "@/lib/cors";

export const GET = async (req: NextRequest, res: NextResponse, { params }: { params: { productId: string } }) => {
    try {

        //  find data in redis cache
        const { cachedData, redis } = await getDataFromRedisCache(`products:related:${params.productId}`);
        if (cachedData) {
            res = NextResponse.json(cachedData, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        // if not found, fallback to database
        // connect to mongodb
        await connectToDB();
        // find product by id
        const product = await Product.findById(params.productId);

        // if not found product
        if (!product) {
            res = NextResponse.json({ message: "No products found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }

        // if found product-> find product related order by id and category and collection 
        const relatedProducts = await Product.find({
            $or: [
                { category: product.category },
                { collections: { $in: product.collections } },
            ],
            _id: { $ne: product._id },
        })

        // if not found data
        if (!relatedProducts) {
            res = NextResponse.json({ message: "No related products found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }

        // if found data-> set data to redis cache -> return it
        // set data to redis cache with ttl =3600s
        await setDataToRedisCache(redis, `products:related:${params.productId}`, 3600, true, relatedProducts)
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            });

        // return
        res = NextResponse.json(relatedProducts, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("related error: " + error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}

export const dynamic = "force-dynamic";
