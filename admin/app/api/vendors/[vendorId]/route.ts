import Product from "@/lib/models/Product";
import Vendor from "@/lib/models/Vendor";
import { connectToDB } from "@/lib/mongoDB";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const vendorUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\d{9,11}$/).optional(),
    address: z.string().min(1).optional(),
});


// get vendor by id
export const GET = async (req: NextRequest, { params }: { params: { vendorId: string } }) => {
    try {
        await connectToDB();
        const vendor = await Vendor.findById(params.vendorId);
        if (!vendor) {
            return NextResponse.json({ message: "No vendor found" }, { status: 404 });
        }
        return NextResponse.json(vendor, { status: 200 });
    } catch (error) {
        console.log("VENDOR_ID_GET", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// update vendor by id
export const PATCH = async (req: NextRequest, { params }: { params: { vendorId: string } }) => {
    try {

        await connectToDB();
        // let vendor = await Vendor.findById(params.vendorId);
        const vendor = await Vendor.findById(params.vendorId);
        if (!vendor) {
            return NextResponse.json({ message: "No vendor found" }, { status: 404 });
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

        return NextResponse.json({message: "Vendor updated successfully", data: vendor}, { status: 200 });
    } catch (error) {
        if(error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid data", error: error.errors }, { status: 400 });
        }
        console.log("VENDOR_ID_POST:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// delete vendor by id
export const DELETE = async (req: NextRequest, { params }: { params: { vendorId: string } }) => {
    try {
        await connectToDB();

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const vendor = await Vendor.findByIdAndDelete(params.vendorId, { session });
            if (!vendor) {
                return NextResponse.json({ message: "No vendor found" }, { status: 404 });
            }
            await Product.deleteMany({ vendor: params.vendorId }, { session });
            await session.commitTransaction();
            // Revalidate path for re-fetching data from the server and updating the cache accordingly when the vendor is deleted
            revalidatePath("/vendors");
            return NextResponse.json({ message: "Vendor deleted successfully" }, { status: 200 });
        } catch (error) {
            await session.abortTransaction();
            console.log("VENDOR_ID_DELETE:", error);
            return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.log("VENDOR_ID_DELETE:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}