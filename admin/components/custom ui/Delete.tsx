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

    // const arrOptions=["collections", "products", "categories","vendors","orders", "customers"];
    const onDelete = async () => {
        try {
            const res = await fetch(`/api/${item}s/${id}`, {
                method: "DELETE",
            })

            if (res.ok) {
                window.location.href = (`/${item}s`)
                toast.success(`${item} deleted!`)
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again")
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className='flex items-center gap-1 p-2 bg-red-1 text-white relative group rounded-xl'>
                {/* <Trash size={16} className='absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition duration-150 group-hover:ease-in-out' /> */}
                <span>Delete</span>
                <Trash size={16}/>
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