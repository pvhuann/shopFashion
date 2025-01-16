'use client'

import { z } from "zod"
import toast from "react-hot-toast"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
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
import Delete from "../custom ui/Delete"
import { Separator } from "../ui/separator"
import { Button } from "@/components/ui/button"
import MultiSelect from "../custom ui/MultiSelect"
import MultiTag from "../custom ui/MultiTag"
import Loader from "../custom ui/Loader"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"
import { CircleHelp, X } from "lucide-react"
// import DynamicVariantsForm from "../variants/VariantForm"

const optionSchema = z.object({
    colors: z.array(z.string()).optional(),
    sizes: z.array(z.string()).optional(),
    styles: z.array(z.string()).optional(),
    materials: z.array(z.string()).optional(),
})
const variantSchema = z.object({
    color: z.string().optional(),
    material: z.string().optional(),
    size: z.string().optional(),
    style: z.string().optional(),
    image: z.string().url("Invalid URL").optional(),
    price: z.coerce.number().min(0, "Price must be at least 0").optional(),
    expense: z.coerce.number().min(0, "Expense must be at least 0").optional(),
    inventory: z.coerce.number().min(0, "Inventory must be at least 0").optional(),
})

const formSchema = z.object({
    title: z.string().trim().min(2).max(30),
    description: z.string().trim().min(2).max(600),
    sku: z.string().trim().min(2).max(30),
    weight: z.coerce.number().min(0.1),
    media: z.array(z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
    })),
    vendor: z.string(),
    category: z.string().nullable(),
    collections: z.array(z.string()),
    variants: z.array(variantSchema),
    tags: z.array(z.string()),
    price: z.coerce.number().min(0.1),
    expense: z.coerce.number().min(0.1),
    inventory: z.coerce.number().min(0),
    availability: z.boolean(),
})

interface VariantProps {
    initialDataVariant?: VariantType | null,
}

interface ProductProps {
    initialData?: ProductType | null,
}

const ProductForm: React.FC<ProductProps> = ({ initialData }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [hasVideo, setHasVideo] = useState<boolean>(false);
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [vendors, setVendors] = useState<VendorType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [selectedParentCategory, setSelectedParentCategory] = useState<string | null>(null);
    const router = useRouter();

    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [styles, setStyles] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [available, setAvailable] = useState<boolean>(initialData?.availability ?? false);

    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [availableListOptions, setAvailableListOptions] = useState<string[]>(['Color', 'Size', 'Style', 'Material']);

    const handleAddOption = () => {
        setOptions([...options, selectedOption ?? ""]);
        console.log('handleAddOption', options);

    }

    const handleOptionChange = (option: string | null) => {
        setSelectedOption(option);
    }


    const formVariant = useForm<z.infer<typeof variantSchema>>({
        resolver: zodResolver(variantSchema),
        defaultValues: {
            color: "",
            material: "",
            size: "",
            style: "",
            image: "",
            price: 0,
            inventory: 0,
            // sale: 0,
        }
    });

    // create form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                category: "",
                collections: initialData.collections?.map((collection) => collection._id),
                // vendor: initialData.vendor?.ma,
            }
            : {
                title: "",
                description: "",
                vendor: "",
                media: [],
                category: null,
                collections: [],
                tags: [],
                variants: [],
                sizes: [],
                colors: [],
                price: 0,
                expense: 0,
                inventory: 0,
                availability: false,
            },
    });
    // const { handleSubmit, register, formState: { errors } } = form;

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

    // get all vendors
    const getVendors = async () => {
        try {
            const res = await fetch('/api/vendors', {
                method: "GET",
            })
            const data = await res.json();
            // const vendorNames = data.map((vendor: { name: string }) => vendor.name);
            // const vendorNames = data.map((vendor: VendorType) => vendor.name);
            setVendors(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again")
        }
    }
    useEffect(() => {
        getVendors()
    }, [])

    // get all categories
    const getCategories = async () => {
        try {
            const res = await fetch(`/api/categories`, {
                method: "GET",
            })
            const data = await res.json();
            // const vendorNames= data.map((vendor: {name:string})=> vendor.name);
            // const categoryTitles = data.map((category: { title: string }) => category.title);
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong! Please try again")
        }
    }
    useEffect(() => {
        getCategories()
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

    const handleOnnSuccess = (result: any) => {
        const media = form.getValues("media");
        const url = result.info.secure_url;
        const typeMedia = result.info.resource_type;
        if (typeMedia == "video") {
            setHasVideo(true);
        }
        form.setValue("media", [...media, { url, type: typeMedia }])
        console.log('Upload finished:', { url, type: typeMedia });
        console.log('stage:', hasVideo);
    }

    // useEffect(() => {
    //     if (hasVideo) {
    //         console.log('hasVideo:', hasVideo);
    //     }
    // }, [hasVideo]);


    const handleCategoryChange = (categoryId: string | null) => {
        form.setValue("category", categoryId);
    }

    const handleParentCategoryChange = (parentId: string | null) => {
        setSelectedParentCategory(parentId);
        form.setValue("category", null);
    }

    const filteredCategories = categories.filter((category) => {
        if (selectedParentCategory === null) {
            return []
        } else {
            return category.parent === selectedParentCategory;
        }
    })



    return loading ? <Loader /> : (
        <div className="">
            {initialData ? (
                <div className=" flex justify-between items-center">
                    <div className="text-heading2-bold">Update Product</div>
                    <Delete id={initialData._id} title={initialData.title} item="product" />
                </div>
            ) : (
                <div className="text-heading2-bold">Create Product</div>
            )}

            <Separator className="bg-grey-1 mt-4" />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="flex gap-6 max-lg:flex-col">
                        {/* left */}
                        <div className="space-y-10 w-2/3 max-lg:w-full">
                            {/* product information  */}
                            <Card className="w-full mt-10 hover:shadow-lg hover:shadow-blue-200 border-blue-200 border-2">
                                <CardHeader>
                                    <CardTitle>Product information</CardTitle>
                                </CardHeader>
                                <hr />
                                <CardContent className='mt-4 flex flex-col gap-4'>
                                    {/* product title */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    <p>Title</p>
                                                    <CircleHelp size={12} />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="title" {...field} onKeyDown={handleKeyPress} />
                                                </FormControl>
                                                <FormMessage className="text-red-1" />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
                                        <FormField
                                            control={form.control}
                                            name="title"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SKU</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="eg. 89622878" {...field} onKeyDown={handleKeyPress} />
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
                                                    <FormLabel>Weight(kg)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="0.1" {...field} onKeyDown={handleKeyPress} />
                                                    </FormControl>
                                                    <FormMessage className="text-gray-400 text-[12px]">Used to calculate shipping rates at checkout and label prices during fulfillment.</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* product description */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Description" {...field} rows={5} onKeyDown={handleKeyPress} />
                                                </FormControl>
                                                <FormMessage className="text-red-1" />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                            {/*product media */}
                            <Card >
                                <CardHeader>
                                    <CardTitle>Product media</CardTitle>
                                </CardHeader>
                                <hr />
                                <CardContent className="bg-gray-100 m-6 py-10 rounded-lg border-dashed border-2 flex flex-col gap-2 items-center " >
                                    <Image src="/oc-browse.svg" alt="browse" width={30} height={40} className="w-[60px] h-[80px]" />
                                    <p className="text-base-bold text-black">Drag and drop your file here</p>
                                    {/* upload more images */}
                                    <CldUploadWidget
                                        uploadPreset="kyysqcj8"
                                        options={{
                                            resourceType: "auto",
                                            clientAllowedFormats: ["image"],
                                        }}
                                        onSuccess={handleOnnSuccess}
                                    >
                                        {({ open }) => {
                                            return (

                                                <Button
                                                    onClick={() => open()}
                                                    type="button"
                                                    className=" w-[120px] bg-white rounded-lg shadow  hover:text-blue-1 hover:shadow-lg"
                                                >Images</Button>

                                            )
                                        }}
                                    </CldUploadWidget>
                                    <span>or</span>
                                    {/* upload one video */}
                                    <CldUploadWidget
                                        uploadPreset="kyysqcj8"
                                        options={{
                                            resourceType: "auto",
                                            clientAllowedFormats: ["video"],
                                        }}
                                        onSuccess={handleOnnSuccess}
                                    >
                                        {({ open }) => {
                                            const handleVideoUploadClick = () => {
                                                if (hasVideo) {
                                                    toast.error("Only one video is allowed.");
                                                    return; // Prevent opening the widget
                                                }
                                                open();
                                            };
                                            return (
                                                <Button
                                                    onClick={() => handleVideoUploadClick()}
                                                    type="button"
                                                    className={`w-[120px] bg-white rounded-lg shadow  hover:text-blue-1 hover:shadow-lg ${hasVideo ? "cursor-not-allowed" : ""}`}
                                                    // disabled={hasVideo}
                                                >Just one video</Button>
                                            )
                                        }}
                                    </CldUploadWidget>
                                    <FormField
                                        control={form.control}
                                        name="media"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className='flex flex-wrap gap-2 mt-4'>
                                                        {
                                                            field.value.map((itemMedia, index) => (
                                                                <div key={index} className="relative max-w-[200px] max-h-[200px]">
                                                                    <div className="absolute top-0 right-0 z-10">
                                                                        {/* button delete an image or a video */}
                                                                        <Button type="button"
                                                                            onClick={() => {
                                                                                if (itemMedia.type === "video") {
                                                                                    setHasVideo(false);
                                                                                };
                                                                                field.onChange([...field.value.filter((_, i) => i !== index)]);
                                                                            }}
                                                                            size="sm" className="bg-red-1 text-white relative group w-6 h-6 rounded-lg">
                                                                            <X className="h-2 w-2 absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition duration-150 group-hover:ease-in-out" />
                                                                        </Button>
                                                                    </div>
                                                                    {itemMedia.type === "video" ? (
                                                                        <video
                                                                            src={itemMedia.url}
                                                                            controls
                                                                            width={320}
                                                                            height={240}
                                                                            className="rounded-lg object-cover" />
                                                                    ) : (
                                                                        <Image
                                                                            src={itemMedia.url}
                                                                            alt="image"
                                                                            className="rounded-lg object-cover w-[300px] h-[150px] max-md:w-[100px] max-md:h-[50px]"
                                                                            width={200}
                                                                            height={200} />
                                                                    )
                                                                    }

                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-red-1" />
                                            </FormItem>
                                        )}
                                    />
                                    {/* <div >
                                            <Image src={form.getValues("media")[0]} alt="" width={100} height={100} className='' />
                                        </div> */}

                                </CardContent>
                            </Card>
                            {/* <Card>
                                <DynamicVariantsForm />
                            </Card> */}

                            {/* product variant */}
                            <Card className="">
                                <CardHeader>
                                    <CardTitle>Product variants</CardTitle>
                                </CardHeader>
                                <hr />
                                <CardContent className="mt-4 flex flex-col items-start gap-4">
                                    <div className="w-full">
                                        <Label htmlFor="option" className="text-black ">OPTIONS</Label>
                                    </div>
                                    <Button type="button" className="text-blue-1 p-0" onClick={handleAddOption}>+Add another option</Button>
                                    <Button className="text-blue-1 p-0">Generate variants table</Button>
                                </CardContent>
                            </Card>

                        </div>

                        {/* right */}
                        <div className="w-1/3 space-y-10 mt-10 max-lg::mt-4 max-lg:w-full">
                            {/* product price */}
                            <Card className=''>
                                <CardHeader>
                                    <CardTitle>Pricing</CardTitle>
                                </CardHeader>
                                <hr />
                                <CardContent className="mt-4 flex flex-col gap-6">
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
                                <CardFooter className="border-t pt-4">
                                    <FormField
                                        control={form.control}
                                        name="availability"
                                        render={({ field }) => (
                                            <FormItem className="flex w-full items-center justify-between">
                                                <FormLabel className="flex items-center gap-1">
                                                    <p>Availability</p>
                                                    <CircleHelp size={12} />
                                                </FormLabel>
                                                <FormControl>
                                                    <Button
                                                        className={`rounded-full min-w-[50px] h-8 flex items-center p-1  ${available ? "justify-end bg-blue-500" : "justify-start bg-gray-200"}`}
                                                        onClick={() => setAvailable(!available)}
                                                    >
                                                        <span className="bg-white w-6 h-6 rounded-full " />
                                                    </Button>
                                                </FormControl>
                                                <FormMessage className="text-red-1" />
                                            </FormItem>
                                        )}
                                    />
                                </CardFooter>
                            </Card>

                            {/* product organization */}
                            <Card className=''>
                                <CardHeader>
                                    <CardTitle>Organization</CardTitle>
                                </CardHeader>
                                <hr />
                                <CardContent className=" flex flex-col gap-6">

                                    {/* product vendor */}
                                    <FormField
                                        control={form.control}
                                        name="vendor"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex justify-between items-center">
                                                    <p>Vendor</p>
                                                    <Button type="button" className="text-blue-1" onClick={() => router.push('/vendors/add-vendor')}>+Add vendor</Button>
                                                </FormLabel>
                                                <FormControl>
                                                    {/* <Input type="text" placeholder="price" {...field} onKeyDown={handleKeyPress} /> */}
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a vendor" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            {vendors.map((vendor, index) => (
                                                                <SelectItem key={index} value={vendor._id}>
                                                                    {vendor.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage className="text-red-1" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* product category */}

                                    {/* parent category */}
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex justify-between items-center">
                                                    <p>Category</p>
                                                    <Button type="button" className="text-blue-1" onClick={() => router.push('/categories/add-category')}>+Add category</Button>
                                                </FormLabel>
                                                <FormControl>
                                                    {/* <Input type="text" placeholder="price" {...field} onKeyDown={handleKeyPress} /> */}
                                                    <Select
                                                        onValueChange={(value) => handleParentCategoryChange(value)}
                                                        value={selectedParentCategory || ""}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a parent category" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            {categories.filter(cat => cat.parent === null).map((category, index) => (
                                                                <SelectItem key={index} value={category._id}>
                                                                    {category.title}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage className="text-red-1" />
                                            </FormItem>
                                        )}
                                    />

                                    {/* subcategory */}
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* ... FormLabel and Button */}
                                                <FormLabel>Sub category</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        disabled={selectedParentCategory === null}
                                                        onValueChange={(value) => handleCategoryChange(value)} // Correct usage of onValueChange
                                                        value={field.value || ""}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a sub category" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-white">
                                                            {filteredCategories.length === 0 ? (
                                                                <SelectItem disabled value="null">No results</SelectItem> // Display "No results" if no categories

                                                            ) : (
                                                                filteredCategories.map((category) => (
                                                                    <SelectItem key={category._id} value={category._id}>
                                                                        {category.title}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
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
                                                <FormLabel className="flex justify-between items-center">
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
                                        name="tags"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tags</FormLabel>
                                                <FormControl>
                                                    <MultiTag
                                                        placeholder="Create tags"
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
                        </div>

                    </div>

                    <div className="flex gap-10 mt-10">
                        <Button type="submit" className="bg-blue-600  px-4 py-2 rounded-lg text-white hover:shadow-md ">
                            {initialData?._id ? "Update" : "Create"}
                        </Button>
                        <Button type="button" className="bg-blue-600  px-4 py-2 rounded-lg text-white hover:shadow-md " onClick={() => router.push("/products")}>Discard</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default ProductForm