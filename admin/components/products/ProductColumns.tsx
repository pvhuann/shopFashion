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

                <Image src={row.original.media?.[0] ?? "/No_Image_Available.jpg"} alt="" width={100} height={0} className='' />
                <Link href={`/products/product-details/${row.original._id}`} className='hover:text-red-1'>{row.original.title}</Link>
            </div>
        )

    },
    {
        header: "Collections",
        accessorKey: "collections",
        cell: ({ row }) => row.original.collections?.map((collection) => collection.title).join(", "),
    },
    {
        header: "Category",
        accessorKey: "category",
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
        header: "Vendor",
        accessorKey: "vendor",
    },
    {
        header: "Price($)",
        accessorKey: "price",
        cell: ({ row }) => <Input value={row.original.price} disabled={true} />
    },
    {
        header: "Expense($)",
        accessorKey: "expense",
    },
    {
        header: "Variants",
        accessorKey: "variants",
        cell: ({ row }) =>  {row.original.variants.length}
    },
    {
        header: "Inventory",
        accessorKey: "inventory",
    },
    {
        header: "Created At",
        accessorKey: "createdAt"
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt"
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