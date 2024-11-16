import React from 'react'
import { z } from 'zod'


const variantSchema = z.object({
    color: z.string().nullable().optional(),
    material: z.string().nullable().optional(),
    size: z.string().nullable().optional(),
    style: z.string().nullable().optional(),
    image: z.string().url("Invalid URL"),
    price: z.number().min(0, "Price must be at least 0"),
    inventory: z.number().min(0, "Inventory must be at least 0"),
    // sale: z.number().min(0).max(100, "Sale must be between 0 and 100"),
})
const VariantForm = () => {
    return (
        <div>VariantForm</div>
    )
}

export default VariantForm