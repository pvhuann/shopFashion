'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navLinks } from '@/lib/constants'

const LeftSideBar = () => {
    const pathName= usePathname()
    return (
        <div className='h-screen flex flex-col gap-20 sticky left-0 top-0 p-10 bg-blue-2 shadow-xl max-lg:hidden'>
            <Link href={'/'}>
                <Image src={'/logo.png'} alt='logo' width={150} height={70} />
            </Link>
            <div className='flex flex-col gap-12'>
                {navLinks.map((link)=>(
                    <Link href={link.url} key={link.label} 
                    className={`flex gap-4 text-body-medium ${pathName===link.url? "text-blue-1 underline underline-offset-4":"text-grey-1"}`}>
                        {link.icon} <p>{link.label}</p>
                    </Link>
                ))}
            </div>

            <div className='flex gap-4 items-center text-body-medium'>
                <UserButton/>
                <p>Edit Profile</p>
            </div>
        </div>
    )
}

export default LeftSideBar