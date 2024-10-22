'use client'

import { ColumnDef } from '@tanstack/react-table'
import Delete from '../custom ui/Delete'
import Image from 'next/image'
import Link from 'next/link'


export const CategoryColumns: ColumnDef<CategoryType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <Link href={`/category/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => <p>{row.original.products?.length ?? 0}</p>,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
            <Link href={row.original.image}>
                <Image src={row.original.image} alt={row.original.title} width={100} height={0} className='' />
            </Link>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <Delete id={row.original._id} title={row.original.title} item='category' />,
    }

]