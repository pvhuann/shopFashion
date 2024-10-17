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
        <div className='sticky flex top-0 px-20 max-md:px-4 py-4 max-md:py-2 justify-between items-center bg-white shadow-md relative'>
            <Link href={'/'} className='max-md:hidden'>
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
            <Menu className='cursor-pointer md:hidden' onClick={() => setDropDownMenu(!dropDownMenu)} />
            {dropDownMenu && (
                <div className='flex flex-col gap-2 top-0 left-0 absolute bg-white p-4 rounded-md'>
                    <Link href={'/'} className='hover:text-red-1' onClick={() => setDropDownMenu(!dropDownMenu)}>
                        Home
                    </Link>

                    <Link href={'/wishlist'} className='hover:text-red-1' onClick={() => setDropDownMenu(!dropDownMenu)}>
                        WishList
                    </Link>
                    <Link href={user ? '/orders' : 'sign-in'} className='hover:text-red-1' onClick={() => setDropDownMenu(!dropDownMenu)}>
                        Orders
                    </Link>
                </div>
            )}
            <div className='flex justify-between items-center gap-2 rounded-lg border p-2 max-md:p-1 max-md:w-2/3 max-sm:1/3'>
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
                    <ShoppingCart size={20} className='max-md:w-4 max-md:h-4' />
                    <p className='text-base-bold max-lg:hidden'>Cart<span>{`(${cart.cartItems.length})`}</span></p>
                </Link>

                {user ? (
                    <UserButton />
                ) : (
                    <Link href={'/sign-in'} className='flex gap-1 items-center'>
                        <CircleUserRound />
                        <span className='text-base-medium hidden md:block'>Sign-in</span>
                    </Link>
                )}

            </div>
        </div>
    )
}

export default Navbar