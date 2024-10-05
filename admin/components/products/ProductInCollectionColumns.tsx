'use client'

import { ColumnDef } from '@tanstack/react-table'
import Delete from '../custom ui/Delete'
import Image from 'next/image'
import Link from 'next/link'



export const ProductInCollectionColumns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <Link href={`/products/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "price",
        header: "Price($)",
    },
    {
        accessorKey: "expense",
        header: "Expense($)",
    },
    {
        accessorKey: "media",
        header: "Media",
        cell: ({ row }) => (
            <Link href={row.original.media[0]}>
                <Image src={row.original.media[0]} alt="" width={100} height={0} className='' />
            </Link>
        ),
    },
    {
        header: "Delete product",
        id: "actions",
        cell: ({ row }) => <Delete id={row.original._id} title={row.original.title} item='product' />,
    },
    {
        header: "Remove product from collection",
        id: "actions",
        cell: ({ row }) =><Delete id={row.original._id} title={row.original.title} item='product' />,
    }

]