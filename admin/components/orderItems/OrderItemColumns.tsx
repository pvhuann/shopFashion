'use client'

import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import Link from 'next/link'

export const OrderItemColumns: ColumnDef<OrderItemType>[] = [
    {
        accessorKey: "product",
        header: "Product title",
        cell: ({ row }) =>
            <Link href={`/products/${row.original.product._id}`} className='hover:text-red-1'>
                <Image
                    src={row.original.product.media?.[0]?? "/No_Image_Available.jpg"}
                    alt={row.original.product.title}
                    width={100}
                    height={100}
                    className="w-20 h-20 object-cover rounded-lg"
                />
                <p>{row.original.product.title}</p>
            </Link>
    },
    {
        accessorKey: "color",
        header: "Color",
    },
    {
        accessorKey: "size",
        header: "Size",
    },
    {
        accessorKey: "price",
        header: "Price ($)",
        cell: ({ row }) => 0,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },

]