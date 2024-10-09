'use client'

import { useUser } from "@clerk/nextjs"
import { MinusCircle, PlusCircle, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import useCart from "@/lib/hooks/useCart"

const Cart = () => {
    const { user } = useUser()

    const customer = {
        clerkId: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        fullName: user?.fullName,
    }

    const router = useRouter()
    const cart = useCart()
    const total = cart.cartItems.reduce((acc, cartItem) => acc + cartItem.item.price * cartItem.quantity, 0)

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
                            <div
                                key={index}
                                className="w-full flex p-4 hover:bg-grey-1 justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Link href={`/products/${cartItem.item._id}`}>
                                        <Image
                                            src={cartItem.item.media[0]}
                                            width={100}
                                            height={100}
                                            alt="product"
                                            className="rounded-md object-cover"
                                        />
                                    </Link>
                                    <div className="flex flex-col gap-3">
                                        <p className="text-body-bold">{cartItem.item.title}</p>
                                        {cartItem.color && (
                                            <p className="text-small-medium">{cartItem.color}</p>
                                        )}

                                        {cartItem.size && (
                                            <p className="text-small-medium">{cartItem.size}</p>
                                        )}
                                    </div>
                                </div>

                                <div className='flex items-center gap-4'>
                                    <MinusCircle
                                        size={30}
                                        className='hover:text-red-1 cursor-pointer'
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
                    <p>${' ' + parseFloat(total.toFixed(2))}</p>
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
