import Vendor from "@/lib/models/Vendor";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";


export const POST = async(req:NextRequest)=> {
    try {
        const {name, email, phone, address} = await req.json();
        if(!name || !email || !phone || !address){
            return new NextResponse("All fields are required", {status:400})
        }
        await connectToDB();
        const existingVendor = await Vendor.findOne({name});
        if(existingVendor){
            return new NextResponse("Vendor already exists", {status:400})
        }

        const newVendor= await Vendor.create({name, email, phone, address})
        await newVendor.save();

        return NextResponse.json(newVendor, {status:200});

    } catch (error) {
        console.log("VENDOR_POST:", error);
        return new Response("Internal Server Error", {status:500})
        
    }
}

export const GET= async(req:NextRequest)=>{
    try {
        
        await connectToDB();
        const vendor= await Vendor.find().sort({createdAt:"desc"});
        return NextResponse.json(vendor, {status:200});
    } catch (error) {
        console.log("VENDOR_GET:", error);
        return new NextResponse("Internal Server Error", {status:500})
        
    }
}