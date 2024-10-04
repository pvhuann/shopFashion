import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


//DELETE one collection by _id collection
export const DELETE = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {

    try {
        //connect to clerk auth server
        const { userId } = auth();


        //check if user is not authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        //connect to mongo database
        await connectToDB()
        //find and delete one collection by _id
        await Collection.findByIdAndDelete(params.collectionId)

        return new NextResponse("Collection deleted", { status: 200 })

    } catch (error) {
        console.log("CollectionId_DELETE", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

//GET one collection by _id collection
export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        //connect to mongo database
        await connectToDB()

        //find one collection by _id
        const collection = await Collection.findById(params.collectionId)
            .populate({ path: "products", model: Product });

        //not found collection
        if (!collection) {
            return new NextResponse("Collection Not Found", { status: 404 })
        }

        //found collection
        return NextResponse.json(collection, { status: 200 })

    } catch (error) {
        console.log("CollectionId_GET", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}


//POST one collection by _id collection
export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {
        //connect to clerk auth server
        const { userId } = auth();
        //check if user is not authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB()

        let collection = await Collection.findById(params.collectionId)
        if (!collection) {
            return new NextResponse("Collection not found", { status: 404 })
        }

        const { title, description, image } = await req.json()
        if (!title || !image) {
            return new NextResponse(JSON.stringify({ message: "Title and Image is required" }), { status: 400 })
        }

        collection = await Collection.findByIdAndUpdate(
            params.collectionId,
            { title, description, image },
            { new: true }
        )

        await collection.save()

        return NextResponse.json(collection, { status: 200 })
    } catch (error) {
        console.log("CollectionId_POST", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}