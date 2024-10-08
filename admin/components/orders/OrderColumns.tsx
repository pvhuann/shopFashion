'use client'

import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'

export const OrderColumns: ColumnDef<OrderColumnType>[] = [
    {
        accessorKey: "_id",
        header: "Order",
        cell: ({ row }) => <Link href={`/orders/${row.original._id}`} className='hover:text-red-1'>{row.original._id}</Link>
    },
    {
        accessorKey: "customer",
        header: "Customer",
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({row})=> <p>{row.original.products.length}</p>
    },
    {
        accessorKey: "totalAmount",
        header: "Total Amount",
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
    },

]