import User from "@/lib/models/User";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        await connectToDB()
        
        const user= await User.findOne({clerkId: userId})
        if(!user) {
            return new NextResponse("user not found", { status: 404 })            
        }
        const {productId}= await req.json()
        if(!productId){
            return new NextResponse("ProductId is required", { status: 400 })
        }

        const isLiked= user.wishList.includes(productId)

        if(isLiked){
            // Dislike product
            user.wishList= user.wishList.filter((id:string)=> id!==productId)
        }else{
            // Like product
            user.wishList.push(productId)
        }

        await user.save()
        return NextResponse.json(user, {status:200})

    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}