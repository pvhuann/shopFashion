import Vendor from "@/lib/models/Vendor";
import { connectToDB } from "@/lib/mongoDB";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";



// create a new vendor
export const POST = async(req:NextRequest)=> {
    try {
        const {name, email, phone, address} = await req.json();
        // check the requirements
        if(!name || !email || !phone || !address){
            return  NextResponse.json({error:{message: "All fields are required", fieldErrors:{}}}, {status:400});
        }
        await connectToDB();
        // check name already exists
        const existingVendor = await Vendor.findOne({name:{$regex: new RegExp(`${name}$`, 'i')}});
        if(existingVendor){
            return NextResponse.json({error:{message:"Vendor name already exists", fieldError:"name"}}, {status:400});
        }
        // check email already exists
        const existingEmail = await Vendor.findOne({email});
        if(existingEmail){
            return NextResponse.json({error:{message:"Vendor email already exists", fieldError:"email"}}, {status:400});
            
        }
        // check phone already exists
        const existingPhone = await Vendor.findOne({phone});
        if(existingPhone){
            return NextResponse.json({error:{message:"Vendor phone already exists", fieldError:"phone"}}, {status:400});
        }
        // create new vendor
        const newVendor= await Vendor.create({name, email, phone, address});
        await newVendor.save();

        return NextResponse.json(newVendor, {status:200});

    } catch (error) {
        console.log("VENDOR_POST:", error);
        return new NextResponse("Internal Server Error", {status:500})
        
    }
}


// get all vendors
export const GET= async(req:NextRequest)=>{
    try {
        
        await connectToDB();
        const vendor= await Vendor.find().sort({createdAt:"desc"});
        if(!vendor){
            return NextResponse.json({error:"No vendors found"}, {status:404});
        }
        return NextResponse.json(vendor, {status:200});
    } catch (error) {
        console.log("VENDOR_GET:", error);
        return new NextResponse("Internal Server Error", {status:500})
    }
}