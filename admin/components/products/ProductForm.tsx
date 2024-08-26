'use client'

import { z } from "zod"
import toast from "react-hot-toast"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

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
import MultiSelect from "../custom ui/MultiSelect"
import MultiTag from "../custom ui/MultiTag"


const formSchema = z.object({
    title: z.string().trim().min(2).max(30),
    description: z.string().trim().min(2).max(600),
    media: z.array(z.string()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    colors: z.array(z.string()),
    sizes: z.array(z.string()),
    price: z.coerce.number().min(0.1),
    expense: z.coerce.number().min(0.1),
})

interface ProductProps {
    initialData?: ProductType | null,
}

const ProductForm: React.FC<ProductProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false)
    const [collections, setCollections] = useState<CollectionType[]>([])
    const router = useRouter()

    const getCollections = async () => {
        try {
            const res = await fetch('/api/collections', {
                method: 'GET',
            })
            const data = await res.json()
            setCollections(data)
            setLoading(true)
        } catch (error) {
            console.log("collections_GET", error);
            toast.error("Something went wrong! Please try again")
        }
    }

    useEffect(() => {
        getCollections()
    },[])


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData 
        ? {...initialData,
            collections: initialData.collections.map(collections=> collections._id)
        }
        : {
            title: "",
            description: "",
            media: [],
            category: "",
            collections: [],
            tags: [],
            colors: [],
            sizes: [],
            price: 0.1,
            expense: 0.1,
        },
    })

    //block "Submit" when "Enter" is clicked
    const handleKeyPress = (event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
        }
    }
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // console.log(values);
        try {
            setLoading(true);
            const url = initialData ? `/api/products/${initialData._id}` : "/api/products"
            const res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(values),
            })

            if (res.ok) {
                setLoading(false);
                toast.success(`Product ${initialData ? "updated" : "created"} successfully`)
                // window.location.href = "/collections";
                router.push("/products")
            }
        } catch (error) {
            console.log("collection_POST", error);
            toast.error("Something went wrong! Please try again")

        }
    }

    return (
        <div className="p-10">

            {initialData ? (
                <div className=" flex justify-between items-center">
                    <div className="text-heading2-bold">Update Product</div>
                    <Delete id={initialData._id} title={initialData.title} item="product" />
                </div>
            ) : (
                <div className="text-heading2-bold">Create Product</div>
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
                        name="media"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Media</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value}
                                        onChange={(url) => {
                                            field.onChange([...field.value, url])
                                        }}
                                        onRemove={(url) => {
                                            field.onChange(
                                                [...field.value.filter((item) => item !== url)]
                                            )
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="price" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="expense"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expense($)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="expense" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Category" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags</FormLabel>
                                    <FormControl>
                                        <MultiTag
                                        placeholder="Tag"
                                            value={field.value}
                                            onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tagRemove) => {
                                                field.onChange([...field.value.filter((item) => item !== tagRemove)])
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colors"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Colors</FormLabel>
                                    <FormControl>
                                        <MultiTag
                                        placeholder="Color"
                                            value={field.value}
                                            onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tagRemove) => {
                                                field.onChange([...field.value.filter((item) => item !== tagRemove)])
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sizes</FormLabel>
                                    <FormControl>
                                        <MultiTag
                                            placeholder="Size"
                                            value={field.value}
                                            onChange={(tag) => field.onChange([...field.value, tag])}
                                            onRemove={(tagRemove) => {
                                                field.onChange([...field.value.filter((item) => item !== tagRemove)])
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                        
                        

                    </div>

                    <FormField
                            control={form.control}
                            name="collections"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Collections</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            collections={collections}
                                            value={field.value}
                                            onChange={(_id)=> {
                                                field.onChange([...field.value,_id])
                                            }}
                                            onRemove={(idToRemove)=> {
                                                field.onChange([
                                                    ...field.value.filter((id)=> id!== idToRemove)
                                                ])
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        />
                    <div className="flex gap-10">
                        <Button type="submit" variant={"outline"} className="bg-blue-2">Submit</Button>
                        <Button type="button" variant={"outline"} className="bg-blue-2" onClick={() => router.push("/products")}>Discard</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default ProductForm