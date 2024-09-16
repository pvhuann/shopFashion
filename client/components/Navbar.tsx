'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { CircleUserRound, Menu, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Navbar = () => {

    const { user } = useUser()
    const [dropDownMenu, setDropDownMenu] = useState(false)
    return (
        <div className='sticky flex top-0 px-10 py-4 justify-between items-center bg-white shadow-md'>
            <Link href={'/'}>
                <Image src={'/logo.png'} alt='logo' width={200} height={100} />
            </Link>
            <Link href={'/'} className='hidden md:block'>
                Home
            </Link>
            <div className='flex gap-2 items-center'>
                <Link href={'/'} className='flex gap-1 items-center rounded-md border p-[6px] hover:bg-white' onClick={() => setDropDownMenu(!dropDownMenu)}>
                    <ShoppingCart />
                    <p className='text-base-bold'>Cart<span>(0)</span></p>
                </Link>
                <Menu className='cursor-pointer lg:hidden' onClick={() => setDropDownMenu(!dropDownMenu)} />
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