'use client'

import { ColumnDef } from '@tanstack/react-table'
import Delete from '../custom ui/Delete'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '../ui/input'




export const ProductColumns: ColumnDef<ProductType>[] = [
    {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
            <div className='flex items-center gap-2'>

                <Image src={row.original.media[0].url ?? "/No_Image_Available.jpg"} alt="" width={100} height={0} className='' />
                <Link href={`/products/product-details/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
            </div>
        ),
        // cell : ({row}) => {
        //     return (
        //         <div className='flex items-center gap-2'>
        //             <Image src={row.original.media[0] ?? "/No_Image_Available.jpg"} alt="" width={100} height={0} className='' />
        //             <Link href={`/products/product-details/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
        //         </div>
        //     )
        // }

    },
    {
        header: "Collections",
        accessorKey: "collections",
        cell: ({ row }) => row.original.collections?.map((collection) => collection.title).join(", "),
    },
    {
        header: "Category",
        accessorKey: "category",
    },
    {
        header: "Vendor",
        accessorKey: "vendor",
    },
    {
        header: "Price($)",
        accessorKey: "price",
        cell: ({ row }) => <Input value={row.original.variants[0]?.price ?? 0} disabled={true} />,
    },
    {
        header: "Expense($)",
        accessorKey: "expense",
        cell: ({ row }) => <Input value={row.original.variants[0]?.expense ?? 0} disabled={true} />,
    },
    {
        header: "Variants",
        accessorKey: "variants",
        cell: ({ row }) =>  {row.original.variants.length},
    },
    {
        header: "Inventory",
        accessorKey: "inventory",
    },
    {
        header: "Created At",
        accessorKey: "createdAt",
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt",
    },
    {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => <Delete id={row.original._id} title={row.original.title} item='product' />,
    }

]