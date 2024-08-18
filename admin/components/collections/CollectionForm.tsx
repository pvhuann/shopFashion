'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "../ui/separator"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea"
import ImageUpload from "../custom ui/ImageUpload"
import toast from "react-hot-toast"
import { useState } from "react"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    title: z.string().trim().min(2).max(30),
    description: z.string().trim().min(2).max(600),
    image: z.string(),
})


const CollectionForm = () => {
    const [loading, setLoading]= useState(false)
    const router= useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            image: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values);
        try {
            setLoading(true);
            const res = await fetch('/api/collections', {
                method: 'POST',
                body: JSON.stringify(values),
            })

            if(res.ok){
                setLoading(false);
                toast.success("Collections created successfully")
                router.push("/collections")
            }
        } catch (error) {
            console.log("collection_POST",error);
            toast.error("Something went wrong! Please try again")
            
        }
    }

    return (
        <div className="p-10">
            <div className="text-heading2-bold">CollectionForm</div>
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
                                    <Input placeholder="title" {...field} />
                                </FormControl>
                                <FormMessage />
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
                                    <Textarea placeholder="Description" {...field} rows={6} />
                                </FormControl>
                                <FormMessage />
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                    <Button type="submit" variant={"outline"} className="bg-blue-2">Submit</Button>
                    <Button type="submit" variant={"outline"} className="bg-blue-2" onClick={()=> router.push("/collections")}>Discard</Button>
                    </div>

                </form>
            </Form>
        </div>
    )
}

export default CollectionForm