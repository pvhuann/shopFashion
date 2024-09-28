'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const OrderItemColumns: ColumnDef<OrderItemType>[] = [
    {
        accessorKey: "product",
        header: "Product Name",
        cell: ({ row }) => <Link href={`/products/${row.original.product._id}`} className='hover:text-red-1'>{row.original.product.title}</Link>
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
        header: "Price",
        cell: ({row})=> row.original.product.price,
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },

]