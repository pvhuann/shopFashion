import Vendor from "@/lib/models/Vendor";
import { connectToDB } from "@/lib/db/init.mongoDB";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromRedisCache, invalidateKeyRedisCache, setDataToRedisCache } from "@/lib/actions/actions";
import setCorsHeaders from "@/lib/cors";


const VENDORS_CACHE_TTL = 60 * 60 * 24; // 1 day in seconds

// create a new vendor
export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { name, email, phone, address } = await req.json();
        // check the requirements
        if (!name || !email || !phone || !address) {
            res = NextResponse.json({ error: { message: "All fields are required", fieldErrors: {} } }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        await connectToDB();
        // check name already exists
        const existingVendor = await Vendor.findOne({ name: { $regex: new RegExp(`${name}$`, 'i') } });
        if (existingVendor) {
            res = NextResponse.json({ error: { message: "Vendor name already exists", fieldError: "name" } }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        // check email already exists
        const existingEmail = await Vendor.findOne({ email });
        if (existingEmail) {
            res = NextResponse.json({ error: { message: "Vendor email already exists", fieldError: "email" } }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        // check phone already exists
        const existingPhone = await Vendor.findOne({ phone });
        if (existingPhone) {
            res = NextResponse.json({ error: { message: "Vendor phone already exists", fieldError: "phone" } }, { status: 400 });
            return setCorsHeaders(res, "POST");
        }
        // create new vendor
        const newVendor = await Vendor.create({ name, email, phone, address });
        await newVendor.save();
        // invalidate cache redis
        await invalidateKeyRedisCache(`vendors:all`);
        // revalidate path for re-fetching data from the server and updating the cache accordingly when the vendor is created
        revalidatePath("/vendors");
        res = NextResponse.json({ message: "Vendor created successfully", data: newVendor }, { status: 200 });
        return setCorsHeaders(res, "POST");
    } catch (error) {
        console.log("VENDOR_POST:", error);
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}


// get vendors
export const GET = async (req: NextRequest, res: NextResponse) => {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data");
    const dataSuffix = data === "id-name" ? "id-name" : "all";
    const cacheKey = `vendors:${dataSuffix}`;
    const { cachedData, redis } = await getDataFromRedisCache(cacheKey);
    // if data in redis cache is found, return it
    if (cacheKey) {
        res = NextResponse.json(cachedData, { status: 200 });
        return setCorsHeaders(res, "GET");
    }
    // if redis is not available, fallback to database
    try {
        await connectToDB();
        let query = Vendor.find().sort({ createdAt: "desc" });
        if (data === "id-name") {
            query = query.select("_id name");
        }
        const vendors: VendorType[] = await query.exec();
        if (!vendors) {
            res = NextResponse.json({ message: "No vendors found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        // set data to redis cache
        await setDataToRedisCache(redis, cacheKey, VENDORS_CACHE_TTL, true, JSON.stringify(vendors));
        res = NextResponse.json(vendors, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("VENDOR_GET:", error);
        res = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}