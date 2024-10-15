'use client'

import { useUser } from "@clerk/nextjs"
import { MinusCircle, PlusCircle, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import useCart from "@/lib/hooks/useCart"
import { useState } from "react"


const Cart = () => {
    const { user } = useUser();


    const customer = {
        clerkId: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        fullName: user?.fullName,
    }

    const router = useRouter()
    const cart = useCart();

    const totalCart = cart.cartItems.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0)
    const handleCheckout = async () => {
        try {
            if (!user) {
                router.push('/sign-in')
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                    method: 'POST',
                    body: JSON.stringify({ cartItems: cart.cartItems, customer }),
                });
                const data = await res.json();
                window.location.href = data.url;
                console.log(data);
            }
        } catch (error) {
            console.log("checkout_POST", error);
        }
    }

    return (
        <div className="flex gap-20 p-10">
            <div className="w-3/5">
                <p className="text-heading3-bold">Shopping Cart</p>
                <hr className="my-2" />
                {cart.cartItems.length === 0 ? (
                    <p className="text-body-bold">No item in cart</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cart.cartItems.map((cartItem, index) => (
                            // <ItemCart key={index} cartItem={cartItem} />
                            <div
                                key={index}
                                className="w-full flex p-4 hover:bg-grey-1 justify-between"
                            >
                                <div className="flex items-center">
                                    <Link href={`/products/${cartItem.item._id}`} className="flex flex-col gap-2">
                                        <Image
                                            src={cartItem.item.media[0]}
                                            width={100}
                                            height={100}
                                            alt="product"
                                            className="rounded-md object-cover"
                                        />
                                        <p className="text-body-bold">{cartItem.item.title}</p>
                                        <p className="text-body-bold">${cartItem.item.price}</p>
                                    </Link>
                                    <div className="flex gap-3">
                                        <select name="" id="colors" onChange={(e)=> cart.updateItem(cartItem.item._id, e.target.value, cartItem.size)}>
                                            {cartItem.item.colors.map((color, index: number) => (
                                                <option key={index} value={color} selected={color === cartItem.color}>{color}</option>
                                            ))}
                                        </select>
                                        <select name="" id="sizes" onChange={(e) => cart.updateItem(cartItem.item._id, cartItem.color, e.target.value)}>
                                            {cartItem.item.sizes.map((size, index: number) => (
                                                <option key={index} value={size} selected={size === cartItem.size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <MinusCircle
                                        size={30}
                                        className={`${cartItem.quantity >1 ? "hover:text-red-1 cursor-pointer" :"cursor-not-allowed" }`}
                                        onClick={() => cartItem.quantity > 1 && cart.decreaseQuantity(cartItem.item._id, cartItem.color, cartItem.size)} />
                                    <p className='text-body-medium'>{cartItem.quantity}</p>
                                    <PlusCircle
                                        size={30}
                                        className='hover:text-red-1 cursor-pointer'
                                        onClick={() => cart.increaseQuantity(cartItem.item._id, cartItem.color, cartItem.size)} />
                                </div>

                                <div className="flex items-center">
                                    <Trash
                                        size={30}
                                        className="hover:text-red-1 cursor-pointer"
                                        onClick={() => cart.removeItem(cartItem.item._id, cartItem.color, cartItem.size)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-2/5 flex flex-col gap-6 p-4">
                <p>Summary{' '}<span>{`(${cart.cartItems.length} ${cart.cartItems.length > 1 ? "items" : "item"})`}</span></p>
                <div className="flex justify-between text-body-semibold">
                    <p>Total Amount</p>
                    <p>${' ' + parseFloat(totalCart.toFixed(2))}</p>
                </div>
                <button
                    className="border rounded-lg w-full p-3 hover:text-white hover:bg-black"
                    onClick={handleCheckout}
                >
                    Process to checkout
                </button>
            </div>
        </div>
    )
}

export const dynamic = "force-dynamic";
export default Cart
