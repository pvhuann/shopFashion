import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import setCorsHeaders from "@/lib/cors";
import { getDataFromRedisCache, invalidateKeyRedisCache, setDataToRedisCache } from "@/lib/actions/actions";


//DELETE one collection by _id collection
export const DELETE = async (req: NextRequest, res: NextResponse, { params }: { params: { collectionId: string } }) => {

    try {
        //connect to clerk auth server
        const { userId } = auth();
        //check if user is not authenticated
        if (!userId) {
            res = NextResponse.json({ message: "Unauthorized access" }, { status: 403 });
            return setCorsHeaders(res, "DELETE");
        }

        //connect to mongo database
        await connectToDB();

        //find and delete one collection by _id
        await Collection.findByIdAndDelete(params.collectionId);

        //  delete collection id in many product
        await Product.updateMany(
            { collections: params.collectionId },
            { $pull: { collections: params.collectionId } }
        );

        // invalidate array caches redis
        await invalidateKeyRedisCache(['collections:all', 'collections:id-title', `collections:${params.collectionId}`])
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            });

        //return
        res = NextResponse.json({ message: "Collection deleted" }, { status: 200 })
        return setCorsHeaders(res, "DELETE");
    } catch (error) {
        console.log("CollectionId_DELETE", error);
        res = NextResponse.json({ meaage: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "DELETE");
    }
}

//GET one collection by _id collection
export const GET = async (res: NextResponse, { params }: { params: { collectionId: string } }) => {
    try {
        //check if user is not authenticated

        // found data in redis cache
        const { cachedData, redis } = await getDataFromRedisCache(`collections:${params.collectionId}`);
        // if data is found
        if (cachedData) {
            res = NextResponse.json(cachedData, { status: 200 });
            return setCorsHeaders(res, "GET");
        }
        // if not found data in redis cache, fallback to database
        //connect to mongo database
        await connectToDB();

        //find one collection by _id
        const collection = await Collection.findById(params.collectionId)
            .populate({ path: "products", model: Product });

        //not found collection
        if (!collection) {
            res = NextResponse.json({ message: "Collection Not Found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }

        //found collection
        // set data to redis cache
        await setDataToRedisCache(redis, `collections:${params.collectionId}`, 86400, true, collection);
        //return
        res = NextResponse.json(collection, { status: 200 });
        return setCorsHeaders(res, "GET");

    } catch (error) {
        console.log("CollectionId_GET", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}


//PUT one collection by _id collection
export const PUT = async (req: NextRequest, res: NextResponse, { params }: { params: { collectionId: string } }) => {
    try {
        //connect to clerk auth server
        const { userId } = auth();
        //check if user is not authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        await connectToDB();

        let collection = await Collection.findById(params.collectionId)
        if (!collection) {
            res = NextResponse.json({ message: "Collection not found" }, { status: 404 });
        }

        const { title, description, image } = await req.json()
        if (!title || !image) {
            res = NextResponse.json({ message: "Title and Image is required" }, { status: 400 });
            return setCorsHeaders(res, "PUT");
        }

        // update collection in database
        collection = await Collection.findByIdAndUpdate(
            params.collectionId,
            { title, description, image },
            { new: true }
        )
        // save
        await collection.save();

        // invalidate array caches redis 
        await invalidateKeyRedisCache([`collections:all`, `collections:id-title`, `collections:${params.collectionId}`])
            .then(() => {
                console.log("Redis cache invalidated successfully!");
            })
            .catch((err) => {
                console.log("Error invalidating redis cache: ", err);
            });

        // return
        res = NextResponse.json(collection, { status: 200 });
        return setCorsHeaders(res, "PUT");
    } catch (error) {
        console.log("CollectionId_PUT", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "PUT");
    }
}