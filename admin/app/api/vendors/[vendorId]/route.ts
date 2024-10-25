import Product from "@/lib/models/Product";
import Vendor from "@/lib/models/Vendor";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";


// get vendor by id
export const GET= async(req:NextRequest, {params}:{params:{vendorId:string}})=> {

    try {
        
        await connectToDB();

        const vendor= await Vendor.findById(params.vendorId);
        if(!vendor){
            return new NextResponse("No vendor found", {status:404})
        }

        return NextResponse.json(vendor, {status:200});
    } catch (error) {
        console.log("VENDOR_ID_GET", error);
        return new NextResponse("Internal Server Error", {status:500});
    
    }
}

// update vendor by id
export const POST = async(req:NextRequest, {params}:{params:{vendorId: string}})=> {
    try {
        
        await connectToDB();

        let vendor= await Vendor.findById(params.vendorId);
        if(!vendor){
            return new NextResponse("No vendor found", {status:404});
        }

        const {name, email, phone, address} = await req.json();
        if(!name || !email || !phone || !address){
            return new NextResponse("All fields are required", {status:400})
        }

        vendor= await Vendor.findByIdAndUpdate(params.vendorId, {name, email, phone, address}, {new:true});
        await vendor.save();

        return NextResponse.json(vendor, {status:200});
    } catch (error) {
        console.log("VENDOR_ID_POST:",error);
        return new NextResponse("Internal Server Error", {status:500});
    }
}

// delete vendor by id
export const DELETE = async(req:NextRequest, {params}:{params:{vendorId: string}})=> {
    try {
        await connectToDB();
        
        const result= await Vendor.findByIdAndDelete(params.vendorId);

        if(!result){
            return new NextResponse("No vendor found", {status:404});
        }
        await Product.updateMany({vendor: params.vendorId}, { $pull: { vendor: params.vendorId }});

        return new NextResponse("Vendor deleted", {status:200});

    } catch (error) {
        console.log("VENDOR_ID_DELETE:",error);
        return new NextResponse("Internal Server Error", {status:500});
        
    
    }
}