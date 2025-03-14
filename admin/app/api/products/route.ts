import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
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
        await connectToDB()
        const products = await Product.find()
            .sort({ createdAt: 'desc' })
            .populate({ path: "collections", model: Collection });

        return NextResponse.json(products, { status: 200 })
    } catch (error) {
        console.log("Products_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

