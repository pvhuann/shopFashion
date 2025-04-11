import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import setCorsHeaders from "@/lib/cors";
import { getDataFromRedisCache, setDataToRedisCache } from "@/lib/actions/actions";

const  PRODUCTS_CACHE_TTL = 86400;
//create one product with requested to the database
// export const POST = async (req: NextRequest) => {
//     try {
//         const { userId } = auth()
//         if (!userId) {
//             return new NextResponse("Unauthorized", { status: 401 })
//         }

//         await connectToDB()

//         const {
//             title,
//             description,
//             media,
//             vendor,
//             category,
//             collections,
//             tags,
//             colors,
//             sizes,
//             price,
//             variants,
//             expense,
//             inventory } = await req.json()

//         if (!title || !description || !media || !category || !price || !expense) {
//             return new NextResponse("Not enough data to create a new product", { status: 400 })
//         }

//         const newProduct = await Product.create(
//             {
//                 title,
//                 description,
//                 media,
//                 vendor,
//                 category,
//                 collections,
//                 tags,
//                 sizes,
//                 colors,
//                 price,
//                 variants,
//                 expense,
//                 inventory,
//             }
//         )

//         await newProduct.save();

//         for (const collectionId of collections) {
//             const collection = await Collection.findById(collectionId);
//             if (collection) {
//                 await collection.products.push(newProduct._id);
//                 await collection.save();
//             }
//         }

//         return NextResponse.json(newProduct, { status: 200 })
//     } catch (error) {
//         console.log("product_POST", error);
//         return new NextResponse("Internal Server Error", { status: 500 })
//     }
// }


export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        await connectToDB();
        // const prs :ProductType[] = await getAllProducts();
        // // await redis.hdel('products');
        // return NextResponse.json(prs, { status: 200 });
        const { searchParams } = new URL(req.url);
        // get the params from the request
        const productParams = searchParams.get("data");
        const cacheSuffix = () => {
            if (productParams === "ids") {
                return "ids";
            } else if (productParams === "id-Title") {
                return "id-Title";
            } else {
                return "all";
            }
        }
        const cacheKey = `products:${cacheSuffix}`;
        const {cachedData,redis} = await getDataFromRedisCache(cacheKey);
        // found data in redis cache, return it
        if(cachedData){
            res = NextResponse.json(cachedData, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        // if redis is not available, fallback to database
        // get all products
        if (!productParams) {
            const allProducts = await Product.find().sort({ createdAt: 'desc' }).populate({ path: "collections", model: Collection });
            await setDataToRedisCache(redis,cacheKey,PRODUCTS_CACHE_TTL,true,allProducts);
            res = NextResponse.json(allProducts, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        // get all products with only ids
        if (productParams === "ids") {
            const productIds = await Product.find().select("_id").sort({ createdAt: 'desc' });
            await setDataToRedisCache(redis,`products:ids`,PRODUCTS_CACHE_TTL,true,productIds);
            res = NextResponse.json(productIds, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        // get all products with both ids and titles
        if (productParams === "id-Title") {
            const productIdsAndTitles = await Product.find({}, "title _id").sort({ createdAt: 'desc' });
            await setDataToRedisCache(redis,`products:id-Title`,PRODUCTS_CACHE_TTL,true,productIdsAndTitles);
            res = NextResponse.json(productIdsAndTitles, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        // get all products with array of ids
        // check if productParams is a string of ids separated by commas
        const productIds = productParams.includes(",") ? productParams.split(",") : [productParams];
        const validProductIds = productIds.filter((id: string) => mongoose.isValidObjectId(id));
        //check if all productIds are valid
        if (validProductIds.length !== productIds.length || validProductIds.length === 0) {
            res = NextResponse.json({ error: "Invalid product ID(s)" }, { status: 400 });
            return setCorsHeaders(res, "GET");
        }
        const products: ProductType[] = await Product.find({ _id: { $in: validProductIds } }).sort({ createdAt: 'desc' }).populate({ path: "collections", model: Collection });
        if (products.length === 0) {
            res = NextResponse.json({ error: "No products found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        res = NextResponse.json(products, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("Products_GET", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}

