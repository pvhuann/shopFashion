'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import useCart from '@/lib/hooks/useCart'
const page = () => {
    const cart= useCart();
    useEffect(()=> cart.clearCart(), [])
    return (
        <div className='flex flex-col gap-4 justify-center items-center h-screen'>
            <p className='text-heading3-bold'>Successful Payment!</p>
            <p>Thanks for your purchase</p>
            <Link href={'/'} className='border rounded-lg text-base-bold p-4 hover:bg-black hover:text-white'>
                Continue Shopping
            </Link>
        </div>
    )
}
export default page