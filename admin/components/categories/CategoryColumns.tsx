'use client'

import { ColumnDef } from '@tanstack/react-table'
import Delete from '../custom ui/Delete'
import Image from 'next/image'
import Link from 'next/link'
import { getTitleCategory } from '@/lib/actions/actions'

export const CategoryColumns: ColumnDef<CategoryType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <Link href={`/categories/category-details/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => <p>{row.original.products?.length ?? 0}</p>,
    },
    {
        accessorKey: "parent",
        header: "Parent",
        // cell: async ({ row }) => {
        //     const parentTitle = row.original.parent ? await getTitleCategory(row.original.parent) : "null";
        //     return <p>{parentTitle}</p>;
        // },
        cell:({row})=> (<p>{row.original.parentTitle?? "null"}</p>),
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
            <Link href={row.original.image ?? ""}>
                <Image src={row.original.image ?? ""} 
                alt={row.original.title} 
                width={100} height={100} className='w-[100px] h-[50px]' />
            </Link>
        ),
    },
    {
        header: "Created At",
        accessorKey: "createdAt"
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt"
    },

    {
        id: "actions",
        cell: ({ row }) => <Delete id={row.original._id} title={row.original.title} item='category' />,
    }

]