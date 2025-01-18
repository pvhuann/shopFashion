import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "../ui/button";


export const VendorColumns: ColumnDef<VendorType>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell:({row})=> <Link href={`/vendors/vendor-details/${row.original._id}`} className='hover:text-red-1'>{row.original.name}</Link>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({row})=> <Link href={`mailto:${row.original.email}`} className='hover:text-red-1'> {row.original.email}</Link>
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
        accessorKey: "createdAt"
    },
    {
        header: "Updated At",
        accessorKey: "updatedAt"
    },
    {
        header: "Action",
        cell: ({ row }) => {
            return (
                <div className="flex">
                    <Link href={`/vendors/edit-vendor/${row.original._id}`} className=''>
                        <Button className=" text-black px-2 py-1 rounded-md" variant={"destructive"} size={"lg"}>Edit</Button>
                    </Link>
                    <Button className=" text-white px-2 py-1 rounded-md ml-2">Delete</Button>
                </div>
            );
        },
    },

]