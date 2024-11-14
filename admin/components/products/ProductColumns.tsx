'use client'

import { ColumnDef } from '@tanstack/react-table'
import Delete from '../custom ui/Delete'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'



export const ProductColumns: ColumnDef<ProductType>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
            <div className='flex items-center gap-2'>

                <Image src={row.original.media?.[0] ?? "/No_Image_Available.jpg"} alt="" width={100} height={0} className='' />
                <Link href={`/products/product-details/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
            </div>
        )

    },
    {
        accessorKey: "collections",
        header: "Collections",
        cell: ({ row }) => row.original.collections?.map((collection) => collection.title).join(", "),
    },
    {
        accessorKey: "category",
        header: "Category",
        // cell: ({ row }) => (
        //     <Select>
        //         <SelectTrigger id="framework">
        //             <SelectValue placeholder="Select" />
        //         </SelectTrigger>
        //         <SelectContent position="popper" className="bg-white">
        //             <SelectItem value="color">Color</SelectItem>
        //             <SelectItem value="size">Size</SelectItem>
        //             <SelectItem value="style">Style</SelectItem>
        //             <SelectItem value="material">Material</SelectItem>
        //             <SelectItem value="image">Image</SelectItem>
        //         </SelectContent>
        //     </Select>
        // )
    },
    {
        accessorKey: "price",
        header: "Price($)",
        cell: ({ row }) => <Input value={row.original.price} disabled={true} />
    },
    {
        accessorKey: "expense",
        header: "Expense($)",
    },
    {
        accessorKey: "inventory",
        header: "Inventory",
    },
    {
        header: "Created At",
        accessorKey: "createAt"
    },
    // {
    //     accessorKey: "media",
    //     header: "Media",
    //     cell: ({ row }) => (
    //         <Link href={row.original.media[0]}>
    //             <Image src={row.original.media[0]} alt="" width={100} height={0} className='' />
    //         </Link>
    //     ),
    // },
    {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => <Delete id={row.original._id} title={row.original.title} item='product' />,
    }

]