'use client'

import Image from 'next/image'
import { useState } from 'react'


export const Gallery = ({ productMedia }: { productMedia: string[] }) => {
    const [mainImage, setMainImage]= useState(productMedia[0])
    return (
        <div className='flex flex-col gap-3 items-center'>
            <Image
                src={mainImage}
                alt='product'
                width={400} 
                height={400}
                className='rounded-lg shadow-xl max-h-[400px] max-w-[400px] min-h-[400px] min-w-[400px]'
            />
            <div className='flex gap-2 overflow-auto tailwind-scrollbar-hide'>
                {productMedia.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        alt='product'
                        width={100}
                        height={100}
                        className={`object-cover rounded-lg cursor-pointer ${mainImage=== image ? "border-[2px] border-gray-200" : ""}`}
                        onClick={()=> setMainImage(image)}
                    />
                ))}
            </div>
        </div>
    )
}
