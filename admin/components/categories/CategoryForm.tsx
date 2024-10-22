'use client'

import { z } from "zod"
import toast from "react-hot-toast"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import ImageUpload from "../custom ui/ImageUpload"
import Delete from "../custom ui/Delete"
import { Separator } from "../ui/separator"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    title: z.string().trim().min(2).max(30),
    description: z.string().trim().min(2).max(600),
    image: z.string().url(),
})

interface CategoryProps {
    initialData?: CategoryType | null,
}

const CategoryForm: React.FC<CategoryProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    // const params = useParams()


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? initialData : {
            title: "",
            description: "",
            image: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values);
        try {
            setLoading(true);
            const url = initialData ? `/api/category/${initialData._id}` : "/api/category"
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(values),
            })

            if (res.ok) {
                setLoading(false);
                toast.success(`Category ${initialData ? "updated" : "created"} successfully`)
                // window.location.href = "/collections";
                router.push("/category")
            }
        } catch (error) {
            console.log("Category_POST", error);
            toast.error("Something went wrong! Please try again")
        }
    }

    //block "Submit" when "Enter" is clicked
    const handleKeyPress = (event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
        }
    }

    return (
        <div className="p-10">

            {initialData ? (
                <div className=" flex justify-between items-center">
                    <div className="text-heading2-bold">Update Category</div>
                    <Delete id={initialData._id} title={initialData.title} item="category" />
                </div>
            ) : (
                <div className="text-heading2-bold">Create Category</div>
            )}

            <Separator className="bg-grey-1 my-4" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="title" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Description" {...field} rows={6} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                        <Button type="submit" variant={"outline"} className="bg-blue-2">Submit</Button>
                        <Button type="button" variant={"outline"} className="bg-blue-2" onClick={() => router.push("/collections")}>Discard</Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default CategoryForm