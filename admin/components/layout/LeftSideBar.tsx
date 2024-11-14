'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { navLinks } from '@/lib/constants'
import { ArrowLeftToLine, ChevronDown } from 'lucide-react'
import { useState } from 'react'


const LeftSideBar = () => {
    const pathName = usePathname();
    const [hideBar, setHideBar] = useState(false);
    const [showNavChild, setShowNavChild] = useState<number | null>(null);
    return (
        <div className=''>
            <div className={`min-h-svh flex flex-col gap-14 left-0 top-0 pt-8 pl-6 pb-8 border-r-[1px] max-lg:hidden sticky transition-all duration-300 ease-in-out ${hideBar ? 'w-[120px]' : 'w-[260px]'}`}>
                <ArrowLeftToLine
                    size={40}
                    className={`rounded-full border p-2 absolute top-8 right-[-20px] cursor-pointer z-20 bg-white transition-all duration-300 ease-in-out ${hideBar ? 'rotate-180' : ''}`}
                    // className='rounded-full border p-2 absolute top-8 right-[-20px] cursor-pointer z-20 bg-white transition-all duration-500 ease-in-out rotate-90'
                    onClick={() => setHideBar(!hideBar)} />

                <Link href={'/'}>
                    <Image src={'/logo.png'} alt='logo' width={150} height={70} className={`${hideBar?"w-[70px] h-[30px]":"w-[150px]"} transition-all duration-300 ease-in-out`} />
                </Link>
                {
                    hideBar ? (
                        <>
                            {/* <Link href={'/'} className='pt-4'>
                                <Image src={'/logo.png'} alt='logo' width={70} height={70} className='' />
                            </Link> */}
                            <div className=' flex flex-col gap-10 sticky max-h-[calc(100vh-200px)] overflow-y-auto w-full pr-6'>
                                {navLinks.map((link) => (
                                    <Link href={'/'} key={link.label}
                                        className={` p-2 flex justify-center items-center relative hover:bg-gray-200 rounded-lg text-body-medium ${pathName === link.url ? "text-blue-1" : "text-grey-1"}`}>
                                        <span className={`${pathName === link.url ? "bg-blue-1" : "hidden"} w-1 h-1 rounded-full absolute left-0`}></span>
                                        {link.icon}
                                    </Link>
                                ))}
                            </div>
                            {/* <div className='h-[70px]'>
                                <UserButton />
                            </div> */}

                        </>

                    ) : (
                        <>
                            {/* <Link href={'/'}>
                                <Image src={'/logo.png'} alt='logo' width={150} height={70} className='' />
                            </Link> */}
                            <div className=' flex flex-col gap-10 sticky max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden w-full pr-6'>
                                {navLinks.map((link, index) => (
                                    <>
                                        <div className='relative' key={link.label}>
                                            <div
                                                className={`flex justify-between  items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 ${pathName === link.url ? "text-blue-1 underline underline-offset-4" : "text-grey-1"} `}
                                                onClick={() => setShowNavChild(showNavChild === index ? null : index)}
                                            >
                                                <div
                                                    // href={link.url} key={link.label}
                                                    key={link.label}
                                                    className={`flex  gap-2 items-center text-body-medium `}
                                                >
                                                    {link.icon}
                                                    <p>{link.label}</p>
                                                </div>
                                                <ChevronDown className={`${showNavChild === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out}`} />
                                            </div>
                                            {showNavChild === index && link.navChild && (
                                                <div className={`mt-2 ml-4 space-y-1 border-l-2`}>
                                                    {link.navChild.map((childLink, index) => (
                                                        childLink.url ? ( // Check if childLink.url is defined
                                                            <Link
                                                                key={index}
                                                                href={`${childLink.url.toLowerCase().replace(/\s+/g, '-')}`}
                                                                className="block pl-8 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                                            >
                                                                {childLink.name}
                                                            </Link>
                                                        ) : null // Render nothing if childLink.url is undefined
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                    </>
                                ))}
                            </div>
                            {/* <div className='flex gap-4 items-center text-body-medium'>
                                <UserButton />
                                <p>Edit Profile</p>
                            </div> */}
                        </>
                    )
                }



            </div>
            {/* <div className=' h-10 border'>
                abc
            </div> */}
        </div>
    )
}

export default LeftSideBar
