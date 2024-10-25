'use client'

import { ColumnDef } from "@tanstack/react-table"


export const VariantColumns: ColumnDef<VariantType>[] = [
    // {
    //     header: 'Name',
    //     accessorKey: 'name',
    //     cell: info => info.getValue(),

    // }
    {
        header:'Price',
        accessorKey: 'price',
        cell: info => info.getValue(),
    },
    {
        header: 'Quantity',
        accessorKey: 'quantity',
        cell: info => info.getValue(),
    },
    {
        header: 'SKU',
        accessorKey: 'sku',
        cell: info => info.getValue(),
    },
    {
        header: 'Image',
        accessorKey: 'image',
        cell: info => info.getValue(),
    }
]
