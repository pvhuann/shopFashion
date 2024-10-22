'use client'

import { ColumnDef } from '@tanstack/react-table'

import Link from 'next/link'


export const CustomerColumns: ColumnDef<CustomerType>[] = [
    {
        accessorKey: "clerkId",
        header: "Clerk Id",
        cell: ({ row }) => <Link href={`/customers/customer-details/${row.original.clerkId}`} className='hover:text-red-1'>{row.original.clerkId}</Link>
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <p>{row.original.name}</p>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <p>{row.original.email}</p>,
    },
    {
        accessorKey:"createdAt",
        header:"Created At",
        cell: ({row})=> row.original.createdAt,
    }

]