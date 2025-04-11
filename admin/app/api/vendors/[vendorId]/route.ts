import Product from "@/lib/models/Product";
import Vendor from "@/lib/models/Vendor";
import { connectToDB } from "@/lib/db/init.mongoDB";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import setCorsHeaders from "@/lib/cors";
import { invalidateKeyRedisCache } from "@/lib/actions/actions";

const vendorUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\d{9,11}$/).optional(),
    address: z.string().min(1).optional(),
});


// get vendor by id
export const GET = async (req: NextRequest, res: NextResponse, { params }: { params: { vendorId: string } }) => {
    try {
        await connectToDB();
        const vendor = await Vendor.findById(params.vendorId);
        if (!vendor) {
            res = NextResponse.json({ message: "No vendor found" }, { status: 404 });
            return setCorsHeaders(res, "GET");
        }
        res = NextResponse.json(vendor, { status: 200 });
        return setCorsHeaders(res, "GET");
    } catch (error) {
        console.log("VENDOR_ID_GET", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "GET");
    }
}

// update vendor by id
export const PATCH = async (req: NextRequest, res: NextResponse, { params }: { params: { vendorId: string } }) => {
    try {
        await connectToDB();
        // let vendor = await Vendor.findById(params.vendorId);
        const vendor = await Vendor.findById(params.vendorId);
        if (!vendor) {
            res = NextResponse.json({ message: "No vendor found" }, { status: 404 });
            return setCorsHeaders(res, "PATCH");
        }

        const body = await req.json();
        const validatedData = vendorUpdateSchema.parse(body);
        Object.assign(vendor, validatedData);
        await vendor.save();
        // Revalidate path for re-fetching data from the server and updating the cache accordingly when the vendor is updated
        revalidatePath("/vendors");

        // const { name, email, phone, address } = await req.json();
        // if (!name || !email || !phone || !address) {
        //     return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        // }

        // vendor = await Vendor.findByIdAndUpdate(params.vendorId, { name, email, phone, address }, { new: true });
        // await vendor.save();

        // invalidate key redis cache
        await invalidateKeyRedisCache("vendors:all");
        res = NextResponse.json({ message: "Vendor updated successfully", data: vendor }, { status: 200 });
        return setCorsHeaders(res, "PATCH");
    } catch (error) {
        if (error instanceof z.ZodError) {
            res = NextResponse.json({ message: "Invalid data", error: error.errors }, { status: 400 });
            return setCorsHeaders(res, "PATCH");
        }
        console.log("VENDOR_ID_POST:", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "PATCH");
    }
}

// delete vendor by id
export const DELETE = async (req: NextRequest, res: NextResponse, { params }: { params: { vendorId: string } }) => {
    try {
        await connectToDB();
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const vendor = await Vendor.findByIdAndDelete(params.vendorId, { session });
            if (!vendor) {
                res = NextResponse.json({ message: "No vendor found" }, { status: 404 });
                return setCorsHeaders(res, "DELETE");
            }
            await Product.deleteMany({ vendor: params.vendorId }, { session });
            await session.commitTransaction();
            // Revalidate path for re-fetching data from the server and updating the cache accordingly when the vendor is deleted
            revalidatePath("/vendors");
            // invalidate key redis cache
            await invalidateKeyRedisCache("vendors:all");

            res = NextResponse.json({ message: "Vendor deleted successfully" }, { status: 200 });
            return setCorsHeaders(res, "DELETE");
        } catch (error) {
            await session.abortTransaction();
            console.log("VENDOR_ID_DELETE:", error);
            res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
            return setCorsHeaders(res, "DELETE");
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.log("VENDOR_ID_DELETE:", error);
        res = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        return setCorsHeaders(res, "DELETE");
    }
}