'use client'

import useCart from "@/lib/hooks/useCart"
import Image from "next/image"


const Cart = () => {
    const cart = useCart()
    return (
        <div className="flex gap-20 p-10">
            <div className="">
                <p className="text-heading3-bold">Shopping Cart</p>
                <hr />

                {cart.cartItems.length === 0 ? (
                    <p className="text-body-bold">No item in cart</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {cart.cartItems.map((cartItem, index) => (
                            <div className="flex hover:bg-grey-1 p-5 justify-center items-center">
                                <Image
                                    key={index}
                                    src={cartItem.item.media[0]}
                                    width={100}
                                    height={100}
                                    alt="product"
                                    className="rounded-md object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart