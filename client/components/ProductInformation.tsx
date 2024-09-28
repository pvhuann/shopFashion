
'use client'
import useCart from '@/lib/hooks/useCart'
import { capitalizeWords } from '@/utils/capitalizeWords'
import { MinusCircle, PlusCircle } from 'lucide-react'
import React, { useState } from 'react'

const ProductInformation = ({ productInformation }: { productInformation: ProductType }) => {
    const [selectedColor, setSelectedColor] = useState<string>(productInformation.colors[0] || '')
    const [selectedSize, setSelectedSize] = useState<string>(productInformation.sizes[0] || '')
    const [quantity, setQuantity] = useState<number>(1)
    const cart = useCart()
    return (
        <div className='flex flex-col gap-4 max-w-[400px]'>

            <p className='text-heading2-bold'>{capitalizeWords(productInformation.title)}</p>
            <div className='flex gap-2 items-center'>
                <p className='text-base-medium text-grey-2'>Category: </p>
                <p className='text-small-medium'>{capitalizeWords(productInformation.category)}</p>
            </div>
            <p className='text-heading3-bold'>$ {productInformation.price}</p>
            <div className='flex flex-col gap-2'>
                <p className='text-base-medium text-grey-2'>Description:</p>
                <p>{productInformation.description}</p>
            </div>
            {productInformation.colors?.length && (
                <div className='flex flex-col gap-2'>
                    <p className='text-base-medium text-grey-2'>Colors:</p>
                    <div className='flex gap-3'>
                        {productInformation.colors.map((color, index) => (
                            <p
                                className={`border rounded-lg cursor-pointer p-2 ${selectedColor === color && "bg-black text-white"}`}
                                key={index}
                                onClick={() => setSelectedColor(color)}
                            >{color}</p>
                        ))}
                    </div>
                </div>
            )}

            {productInformation.sizes?.length && (
                <div className='flex flex-col gap-2'>
                    <p className='text-base-medium text-grey-2'>Sizes:</p>
                    <div className='flex gap-3'>
                        {productInformation.sizes.map((size, index) => (
                            <p
                                className={`border rounded-lg cursor-pointer p-2 ${selectedSize === size && "bg-black text-white"}`}
                                key={index}
                                onClick={() => setSelectedSize(size)}
                            >{size}</p>
                        ))}
                    </div>
                </div>
            )}

            <div className='flex flex-col gap-2'>
                <p className='text-base-medium text-grey-2'>Quantity:</p>
                <div className='flex items-center gap-4'>
                    <MinusCircle
                        size={30}
                        className='hover:text-red-1 cursor-pointer'
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)} />
                    <p className='text-body-medium'>{quantity}</p>
                    <PlusCircle
                        size={30}
                        className='hover:text-red-1 cursor-pointer'
                        onClick={() => setQuantity(quantity + 1)} />
                </div>
            </div>

            <button
                className='text-base-bold outline rounded-full py-4 hover:bg-black hover:text-white'
                onClick={() => {
                    cart.addItem({
                        item: productInformation,
                        quantity,
                        color: selectedColor,
                        size: selectedSize
                    })
                }}
            >Add to cart
            </button>

        </div>
    )
}

export default ProductInformation