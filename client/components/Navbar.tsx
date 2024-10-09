'use client'

import { CircleUserRound, Menu, Search, ShoppingCart } from 'lucide-react'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useCart from '@/lib/hooks/useCart'

const Navbar = () => {
    const { user } = useUser()
    const [dropDownMenu, setDropDownMenu] = useState(false)
    const cart = useCart()
    const router = useRouter();
    const [valueQuery, setValueQuery] = useState('');

    const handleSearch = () => {
        router.push(`/search/${valueQuery.trim()}`);
        setValueQuery('');
    }

    const handleKeyDown = (event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            handleSearch();
            event.preventDefault();
        }
    }

    return (
        <div className='sticky flex top-0 px-10 py-4 justify-between items-center bg-white shadow-md'>
            <Link href={'/'}>
                <Image src={'/logo.png'} alt='logo' width={200} height={100} />
            </Link>
            <div className='flex justify-between items-center gap-4 max-md:hidden'>
                <Link href={'/'} className='hover:text-red-1'>
                    Home
                </Link>
                <Link href={user ? '/wishlist' : 'sign-in'} className='hover:text-red-1'>
                    WishList
                </Link>
                <Link href={user ? '/orders' : 'sign-in'} className='hover:text-red-1'>
                    Orders
                </Link>
            </div>
            <div className='flex justify-center items-center gap-2 rounded-lg border p-2'>
                <input
                    type='search'
                    placeholder='Search...'
                    className='outline-none'
                    value={valueQuery}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => setValueQuery(e.target.value)} />
                <button onClick={handleSearch}>
                    <Search />
                </button>
            </div>
            <div className='flex gap-2 items-center'>
                <Link href={'/cart'} className='flex gap-1 items-center rounded-md border p-[6px] hover:bg-white'>
                    <ShoppingCart />
                    <p className='text-base-bold'>Cart<span>{`(${cart.cartItems.length})`}</span></p>
                </Link>
                <Menu className='cursor-pointer md:hidden' onClick={() => setDropDownMenu(!dropDownMenu)} />
                {user ? (
                    <UserButton />
                ) : (
                    <Link href={'/sign-in'} className='flex gap-1 items-center'>
                        <CircleUserRound />
                        <span className='text-base-medium hidden md:block'>Sign-in</span>
                    </Link>
                )}
                {dropDownMenu && (
                    <div className='flex flex-col gap-2 top-16 right-4 absolute bg-white-1 p-4 rounded-md'>
                        <Link href={'/'} className='hover:text-red-1'>
                            Home
                        </Link>

                        <Link href={'/'} className='hover:text-red-1'>
                            WishList
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar