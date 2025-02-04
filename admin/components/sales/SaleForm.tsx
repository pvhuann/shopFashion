import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';


interface SaleProps{
    initialData?: SaleType | null,
}

const formSchema = z.object({
    product: z.array(z.object({id:z.string(), name:z.string()})),
    timeStart: z.date(),
    timeEnd: z.date(),
    discountValue: z.number(),
    discountType: z.string(),
    orderThreshold: z.number(),
    isActive: z.boolean(),
    quantity: z.number(),
    totalAmount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
const SaleForm:React.FC<SaleProps> = ({initialData}) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? initialData : {
            product: [],
            timeStart: new Date(),
            timeEnd: new Date(),
            discountValue: 0,
            discountType: "",
            orderThreshold: 0,
            isActive: false,
            quantity: 0,
            totalAmount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
    return (
        <div>
            <h1>Sale Form</h1>

        </div>
    )
}

export default SaleForm