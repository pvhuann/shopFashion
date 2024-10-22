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
import Loader from "../custom ui/Loader"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DataTable } from "../custom ui/DataTable"
// import { VariantColumns } from "../variants/VariantColumns"

const variantSchema = z.object({
    color: z.string().min(1, "Color is required"),
    image: z.string().url("Invalid URL"),
    size: z.string().min(1, "Size is required"),
    price: z.number().min(0, "Price must be at least 0"),
    inventory: z.number().min(0, "Inventory must be at least 0"),
    // sale: z.number().min(0).max(100, "Sale must be between 0 and 100"),
})

// const productSchema = z.object({
//     title: z.string().min(1, "Title is required").max(50, "Title must be at least 50"),
//     description: z.string().min(1, "Description is required").max(500, "Description must be at least 500"),
//     media: z.array(z.string().url()).nonempty("Media is required"),
//     category: z.string().min(1, "Category is required").max(50, "Category must be at least 50"),
//     // store: z.string().min(1, "Store is required"),
//     totalInventory: z.number().min(0, "Total inventory must be at least 0"),
//     mainImages: z.array(z.string().url()).nonempty("Main images are required"),
//     variants: z.array(variantSchema).nonempty("At least one variant is required"),
// })

const formSchema = z.object({
    title: z.string().trim().min(2).max(30),
    description: z.string().trim().min(2).max(600),
    media: z.array(z.string().url()),
    category: z.string(),
    collections: z.array(z.string()),
    tags: z.array(z.string()),
    sizes: z.array(z.string()),
    colors: z.array(z.string()),
    price: z.coerce.number().min(0.1),
    expense: z.coerce.number().min(0.1),
    inventory: z.coerce.number().min(0),
})

// interface VariantProps{
//     color: string;
//     size:string;
//     image:string;
//     price:number;
//     inventory:number;
//     sale:number;
// }

interface ProductProps {
    initialData?: ProductType | null,
}

const ProductForm: React.FC<ProductProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(true)
    const [collections, setCollections] = useState<CollectionType[]>([])
    const router = useRouter()

    // create form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                collections: initialData.collections.map((collection) => collection._id),
            }
            : {
                title: "",
                description: "",
                media: [],
                category: "",
                collections: [],
                tags: [],
                // variants: [],
                sizes: [],
                colors: [],
                price: 0,
                expense: 0,
                inventory: 0,
            },
    })


    //get all collections
    const getCollections = async () => {
        try {
            const res = await fetch('/api/collections', {
                method: 'GET',
            })
            const data = await res.json()
            setCollections(data)
            setLoading(false)
        } catch (error) {
            console.log("collections_GET", error);
            toast.error("Something went wrong! Please try again")
        }
    }

    useEffect(() => {
        getCollections()
    }, [])


    //handle submit form
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const url = initialData ? `/api/products/${initialData._id}` : "/api/products"
            // const url ="/api/products"
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


    //block "Submit" when "Enter" is clicked
    const handleKeyPress = (event:
        | React.KeyboardEvent<HTMLInputElement>
        | React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
        }
    }

    return loading ? <Loader /> : (
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
                    {/* <FormField
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
                    /> */}

                    {/* <FormField
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
                    /> */}

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

                    {/* product information  */}
                    <Card className="w-full shadow-lg">
                        <CardHeader>
                            <CardTitle>Product information</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent className='m-10 p-2 flex flex-col gap-4'>
                            {/* product title */}
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

                            {/* product code and product weight */}
                            {/* <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
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
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weight</FormLabel>
                                            <FormControl>
                                                <Input placeholder="title" {...field} onKeyDown={handleKeyPress} />
                                            </FormControl>
                                            <FormMessage className="text-red-1" />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            {/* test */}
                            {/* <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" placeholder="Name of your project" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="framework">Framework</Label>
                                        <Select>
                                            <SelectTrigger id="framework">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="next">Next.js</SelectItem>
                                                <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                                <SelectItem value="astro">Astro</SelectItem>
                                                <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </form> */}

                            {/* product description */}
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
                        </CardContent>
                    </Card>

                    {/*product media */}
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle>Product media</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent className="bg-gray-100 m-10 p-2 rounded-lg border-dashed border-2 flex flex-col gap-2 items-center">
                            <img src="/oc-browse.svg" alt="" className="w-[150px] h-[200px]" />
                            <p className="text-base-bold text-black">Drag and drop your file here</p>
                            <p>or</p>
                            <button type="button" className="p-2 bg-white rounded-lg">Browser file</button>
                        </CardContent>
                    </Card>

                    {/* product variant */}
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle>Product variants</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent className="p-2 m-10">
                            <div>
                                <p>OPTION</p>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="framework">Framework</Label>
                                    <Select>
                                        <SelectTrigger id="framework">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="next">Next.js</SelectItem>
                                            <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                            <SelectItem value="astro">Astro</SelectItem>
                                            <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* <DataTable columns={VariantColumns} data={variantSchema}/> */}
                            {/* <VariantColumns/> */}

                        </CardContent>
                    </Card>

                    {/* product price */}
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle>Pricing</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent className="m-10 p-2 flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Original price($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="" {...field} onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Selling price($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="" {...field} onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profit(%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="%" {...field} onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* product organization */}
                    <Card className='shadow-lg'>
                        <CardHeader>
                            <CardTitle>Organization</CardTitle>
                        </CardHeader>
                        <hr />
                        <CardContent className="m-10 p-2 flex flex-col gap-6">

                            {/* product vendor */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-between">
                                            <p>Vendor</p>
                                            <Button type="button" className="text-blue-1" onClick={() => router.push('/vendor/add-vendor')}>+Add vendor</Button>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="price" {...field} onKeyDown={handleKeyPress} />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />

                            {/* product category */}
                            <FormField
                                control={form.control}
                                name="collections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-between">
                                            <p>Category</p>
                                            <Button type="button" className="text-blue-1" onClick={() => router.push('/category/add-category')}>+Add category</Button>
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                collections={collections}
                                                value={field.value}
                                                onChange={(_id) => {
                                                    field.onChange([...field.value, _id])
                                                }}
                                                onRemove={(idToRemove) => {
                                                    field.onChange([
                                                        ...field.value.filter((id) => id !== idToRemove)
                                                    ])
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />

                            {/* product collections */}
                            <FormField
                                control={form.control}
                                name="collections"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex justify-between">
                                            <p>Collections</p>
                                            <Button type="button" className="text-blue-1" onClick={() => router.push('/collections/add-collection')}>+Add collection</Button>
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                collections={collections}
                                                value={field.value}
                                                onChange={(_id) => {
                                                    field.onChange([...field.value, _id])
                                                }}
                                                onRemove={(idToRemove) => {
                                                    field.onChange([
                                                        ...field.value.filter((id) => id !== idToRemove)
                                                    ])
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-1" />
                                    </FormItem>
                                )}
                            />

                            {/* product tags */}
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
                        </CardContent>
                    </Card>



                    <div className="md:grid md:grid-cols-3 gap-8">
                        {/* <FormField
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
                        /> */}

                        {/* <FormField
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
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="inventory"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Inventory</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="inventory" {...field} onKeyDown={handleKeyPress} />
                                    </FormControl>
                                    <FormMessage className="text-red-1" />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
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
                        /> */}

                        {/* <FormField
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
                        /> */}

                        {/* <FormField
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
                        /> */}


                        {/* <FormField
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
                        /> */}



                    </div>

                    {/* <FormField
                        control={form.control}
                        name="collections"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Collections</FormLabel>
                                <FormControl>
                                    <MultiSelect
                                        collections={collections}
                                        value={field.value}
                                        onChange={(_id) => {
                                            field.onChange([...field.value, _id])
                                        }}
                                        onRemove={(idToRemove) => {
                                            field.onChange([
                                                ...field.value.filter((id) => id !== idToRemove)
                                            ])
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    /> */}
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