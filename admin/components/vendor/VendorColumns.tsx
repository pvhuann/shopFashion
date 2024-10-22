import { ColumnDef } from "@tanstack/react-table";


export const vendorColumns: ColumnDef<VendorType>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => <p>{row.original.products?.length ?? 0}</p>,
    },

    {
        header: "Created At",
        accessorKey: "createAt"
    },
    {
        header: "Updated At",
        accessorKey: "updateAt"
    },

]