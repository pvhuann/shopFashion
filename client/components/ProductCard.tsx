'use client'

import { useUser } from "@clerk/nextjs"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { capitalizeWords } from "@/utils/capitalizeWords"
import useCart from "@/lib/hooks/useCart"


const ProductCard = ({ product }: { product: ProductType }) => {

    const { user } = useUser();
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(false)
    const cart = useCart()
    const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
    const [quantity, setQuantity] = useState<number>(1);

    const getUser = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/users')
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
            console.log("wishList_POST", error);
        }
    }
    return (
        <div className="flex flex-col gap-2 border rounded-lg">
            <Link href={`/products/${product._id}`} className="flex flex-col gap-2">
                <Image
                    src={product.media?.[0]}
                    alt={product.title}
                    width={300}
                    height={400}
                    className="object-cover h-[300px] rounded-t-lg"
                />
                <div className="px-2 hover:text-red-1">
                    <p className="text-base-bold">{capitalizeWords(product.title)}</p>
                    <p className="">{capitalizeWords(product.category)}</p>
                </div>
            </Link>
            <div className="flex items-center justify-between px-2 pb-2">
                <p className="text-base-bold">${product.price}</p>
                <ShoppingCart className="cursor-pointer" onClick={() => {
                    cart.addItem({
                        item: product,
                        quantity,
                        color: selectedColor,
                        size: selectedSize
                    })
                }} />
                <button
                    onClick={handleLike}
                >
                    <Heart className="hover:scale-125" fill={`${isLiked ? 'red' : "white"}`} />
                </button>
            </div>
        </div>
    )
}

export default ProductCard;