'use client'

import { Trash } from 'lucide-react'

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import toast from 'react-hot-toast'

interface DeleteProps {
    id: string,
    title: string,
    item: string
}

const Delete: React.FC<DeleteProps> = ({ id, title, item }) => {

    const onDelete = async () => {
        try {
            // const itemType= item==="collection"? "collections" : ("product" ? "products": "categories")
            let itemType;
            if (item == "collection") {
                itemType = "collections";
            } else if (item == "products") {
                itemType = "products";
            } else {
                itemType = "categories";
            }
            const res = await fetch(`/api/${itemType}/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                window.location.href = (`/${itemType}`)
                toast.success(`${item} deleted!`)
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className='bg-red-1 text-white relative group w-10 h-10 rounded-xl'>
                <Trash size={16} className='absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition duration-150 group-hover:ease-in-out' />
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-white text-grey-1'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-red-1'>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span>{item}</span> <i className='text-red-1'>{title}</i>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-red-1 text-white' onClick={onDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Delete