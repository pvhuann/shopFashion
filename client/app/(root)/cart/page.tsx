'use client'

import { useUser } from "@clerk/nextjs"
import { MinusCircle, PlusCircle, Trash } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

import useCart from "@/lib/hooks/useCart"




const Cart = () => {
    const { user } = useUser();

    const customer = {
        clerkId: user?.id,
        email: user?.emailAddresses[0].emailAddress,
        fullName: user?.fullName,
    }
    const router = useRouter()
    const cart = useCart();

    // const [value, setValue] = useState<number>(1);
    // const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log("onChange called");
    //     setValue(parseInt(event.target.value));
    // };

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
                // console.log(data);
            }
        } catch (error) {
            console.log("checkout_POST", error);
        }
    }

    return (
        <div className="p-10 max-md:p-4">
            <p className="text-heading3-bold">Shopping Cart</p>
            <hr className="my-2" />
            <div className="flex gap-20 max-md:flex-col max-lg:gap-2">
                {/* left */}
                <div className="w-3/5 max-md:w-full">
                    {cart.cartItems.length === 0 ? (
                        <p className="text-body-bold">No item in cart</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {cart.cartItems.map((cartItem, index) => (
                                // <ItemCart key={index} cartItem={cartItem} />
                                <div
                                    key={index}
                                    className="w-full flex p-4 hover:bg-grey-1 justify-between max-md:flex-col max-md:gap-4"
                                >
                                    <div className="flex items-center gap-4 max-md:items-start">
                                        <Link href={`/products/${cartItem.item._id}`} className="flex flex-col gap-2 hover:text-red-1">
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
                                        {/* select option colors and sizes */}
                                        <div className="flex gap-3">
                                            <select
                                                className="max-md:min-w-[80px]"
                                                name="colors"
                                                id="colors"
                                                onChange={(e) => cart.updateColorItem(cartItem.item._id, cartItem.color, e.target.value, cartItem.size)}>
                                                {cartItem.item.colors.map((color, index: number) => (
                                                    <option
                                                        className=""
                                                        disabled={
                                                            cart.cartItems.some(
                                                                (otherCartItem) => otherCartItem.item._id === cartItem.item._id && otherCartItem.color === color && otherCartItem.size === cartItem.size
                                                            )
                                                        }
                                                        key={index}
                                                        value={color}
                                                        selected={color === cartItem.color}>
                                                        {color}
                                                    </option>
                                                ))}
                                            </select>

                                            <select
                                                className="max-md:min-w-[80px]"

                                                name="Sizes"
                                                id="sizes"
                                                onChange={(e) => cart.updateSizeItem(cartItem.item._id, cartItem.color, cartItem.size, e.target.value)}>
                                                {cartItem.item.sizes.map((size, index: number) => (
                                                    <option
                                                        disabled={
                                                            cart.cartItems.some(
                                                                (otherCartItem) => otherCartItem.item._id === cartItem.item._id && otherCartItem.size === size && otherCartItem.color === cartItem.color
                                                            )
                                                        }
                                                        key={index}
                                                        value={size}
                                                        selected={size === cartItem.size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-center justify-between">
                                        <div className='flex items-center gap-4'>
                                            <MinusCircle
                                                size={30}
                                                className={`${cartItem.quantity > 1 ? "hover:text-red-1 cursor-pointer" : "cursor-not-allowed"}`}
                                                onClick={() => cartItem.quantity > 1 && cart.decreaseQuantity(cartItem.item._id, cartItem.color, cartItem.size)} />

                                            <input
                                                type="number"
                                                value={cartItem.quantity}
                                                // onChange={onChange}
                                                onChange={(e) => {
                                                    const newQuantity = parseInt(e.target.value);
                                                    if (newQuantity >= 1 && newQuantity <= cartItem.item.inventory) {
                                                        cart.updateQuantity(cartItem.item._id, cartItem.color, cartItem.size, newQuantity);
                                                    }
                                                }}
                                                className="text-center w-16 border border-gray-300 rounded-md px-2 py-1"
                                            />
                                            {/* <p className="text-body-bold">{cartItem.quantity}</p> */}
                                            <PlusCircle
                                                size={30}
                                                className='hover:text-red-1 cursor-pointer'
                                                onClick={() => cartItem.quantity < cartItem.item.inventory && cart.increaseQuantity(cartItem.item._id, cartItem.color, cartItem.size)} />
                                        </div>


                                        <u onClick={() => cart.removeItem(cartItem.item._id, cartItem.color, cartItem.size)}
                                            className="text-body-bold text-red-1 cursor-pointer">
                                            Remove
                                        </u>
                                        {/* <Trash
                                            size={30}
                                            className="hover:text-red-1 cursor-pointer"
                                            onClick={() => cart.removeItem(cartItem.item._id, cartItem.color, cartItem.size)}
                                        /> */}
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => cart.clearCart()} type="reset" className="p-2 max-w-[200px] rounded-lg hover:bg-black hover:text-white border">Clear Cart</button>
                        </div>
                    )}
                </div>

                {/* right */}
                <div className="w-2/5 max-md:w-full flex flex-col gap-6 p-4 max-md:p-0">
                    <p>Summary{' '}<span>{`(${cart.cartItems.length} ${cart.cartItems.length > 1 ? "items" : "item"})`}</span></p>
                    <div className="flex justify-between text-body-semibold">
                        <p>Total Amount</p>
                        <p>${' ' + parseFloat(totalCart.toFixed(2))}</p>
                    </div>
                    <button
                        className="border rounded-lg w-full p-3 hover:text-white hover:bg-black w-full"
                        onClick={handleCheckout}
                    >
                        Process to checkout
                    </button>
                </div>
            </div>
        </div>
    )
}

export const dynamic = "force-dynamic";
export default Cart
