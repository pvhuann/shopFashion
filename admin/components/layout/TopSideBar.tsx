'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, SquareX } from "lucide-react";
import { useState } from 'react'

import { navLinks } from '@/lib/constants'

const TopSideBar = () => {
    const pathName = usePathname()
    const [dropDownMenu, setDropDownMenu] = useState(false)
    const handleIconMenu = () => {
        setDropDownMenu(!dropDownMenu)
    }

    return (
        <div className='w-screen lg:hidden top-0 flex justify-between items-center sticky p-8 bg-blue-2 shadow-xl'>
            <Link href={'/'}>
                <Image src={'/logo.png'} alt='logo' width={150} height={70} />
            </Link>
            <div className='flex gap-4 max-md:hidden'>
                {navLinks.map((link) => (
                    <Link href={link.url} key={link.label}
                        className={`text-body-medium ${pathName === link.url ? "text-blue-1 underline underline-offset-4" : "text-grey-1"}`}>
                        <p>{link.label}</p>
                    </Link>
                ))}
            </div>

            <div className='relative flex gap-4 items-center text-body-medium'>
                {dropDownMenu ? (
                    <div>
                        <SquareX className="cursor-pointer md:hidden" onClick={handleIconMenu} />
                        <div className='flex flex-col gap-4 absolute top-10 right-4 bg-white p-5 shadow-xl md:hidden'>
                            {navLinks.map((link) => (
                                <Link href={link.url}
                                    key={link.label}
                                    className={`flex gap-4 text-body-medium ${pathName === link.url ? "text-blue-1 underline underline-offset-4" : "text-grey-1"}`}
                                    onClick={handleIconMenu}
                                >
                                    {link.icon} <p>{link.label}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Menu className="cursor-pointer md:hidden" onClick={handleIconMenu} />
                )

                }
                <UserButton />
            </div>
        </div>
    )
}

export default TopSideBar