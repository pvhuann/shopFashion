'use client'

import { capitalizeWords } from "@/utils/capitalizeWords"
import { useUser } from "@clerk/nextjs"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


const ProductCard = ({ product }: { product: ProductType }) => {

    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(false)
    const getUser = async () => {
        try {
            setLoading(true)
            const res= await fetch('/api/users')
            const data = await res.json()
            setIsLiked(data.wishList.includes(product._id))
            setLoading(false)
        } catch (error) {
            console.log("[users_GET]", error);
        }
    }

    useEffect(() => {
        if (user) {
            getUser()
        }
    }, [user])

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try {
            if (!user) {
                router.push('/sing-in')
                return;
            } else {
                const res = await fetch('/api/users/wishList', {
                    method: 'POST',
                    body: JSON.stringify({ productId: product._id })
                })

                const updateUser = await res.json();
                setIsLiked(updateUser.wishList.includes(product._id))
            }
        } catch (error) {
            console.log("wishList_POST",error);
        }
    }
    return (
        <Link href={`/products/${product._id}`} className="flex flex-col gap-2 border rounded-lg">
            <Image
                src={product.media?.[0]}
                alt={product.title}
                width={300}
                height={400}
                className="object-cover h-[300px]"
            />
            <div className="px-2">
                <p className="text-base-bold">{capitalizeWords(product.title )}</p>
                <p className
                    ="">{capitalizeWords(product.category)}</p>
            </div>
            <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-base-bold">${product.price}</p>
                <button
                    onClick={handleLike}
                >
                    <Heart className="hover:scale-125" fill={`${isLiked ? 'red' : "white"}`} />
                </button>
            </div>
        </Link>
    )
}

export default ProductCard