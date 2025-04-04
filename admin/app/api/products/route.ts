import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


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


export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const {searchParams} = new URL(req.url);
        // get the params from the request
        const productParams = searchParams.get("data");
        // get all products
        if(!productParams) {
            const allProducts = await Product.find().sort({ createdAt: 'desc' }).populate({ path: "collections", model: Collection });
            return NextResponse.json(allProducts, { status: 200 });
        }
        // get all products with ids
        if(productParams==="ids") {
            const productIds = await Product.find({}, "_id").sort({ createdAt: 'desc' });
            return NextResponse.json(productIds, { status: 200 });
        }
        // get all products with ids and titles
        if(productParams === "idsAndTitles"){
            const productIdsAndTitles = await Product.find({}, "_id title").sort({ createdAt: 'desc' });
            return NextResponse.json(productIdsAndTitles, { status: 200 });
        }
        // get all products with array of ids
        // check if productParams is a string of ids separated by commas
        const productIds = productParams.includes(",") ? productParams.split(",") : [productParams];
        const validProductIds = productIds.filter((id:string) => mongoose.isValidObjectId(id));
        //check if all productIds are valid
        if(validProductIds.length !== productIds.length || validProductIds.length === 0) {
            return NextResponse.json({error: "Invalid product ID(s)"}, { status: 400 });
        }
        const products = await Product.find({ _id: { $in: validProductIds } }).sort({ createdAt: 'desc' }).populate({ path: "collections", model: Collection });
        if(products.length === 0) {
            return NextResponse.json({error: "No products found"}, { status: 404 });
        }
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.log("Products_GET", error);
        return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
    }
}

