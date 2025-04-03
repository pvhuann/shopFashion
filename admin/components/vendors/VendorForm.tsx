'use client'

import { z } from "zod"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
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
import Delete from "../custom ui/Delete"
import { Button } from "@/components/ui/button"
import Loader from "../custom ui/Loader"
import { DataTable } from "../custom ui/DataTable"
import { ProductColumns } from "../products/ProductColumns"

const formSchema = z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().email(),
    phone: z.string().min(6).max(15),
    address: z.string().trim().min(2).max(600),
    products: z.array(z.string()),
})

interface VendorProps {
    initialData?: VendorType | null,
}

const VendorForm: React.FC<VendorProps> = ({ initialData }) => {
    const [loading, setLoading] = useState(false);
    const [productsByVendor, setProductsByVendor] = useState<ProductType[]>([]);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            products: initialData.products?.map((product) => product._id)
        } : {
            name: "",
            email: "",
            phone: "",
            address: "",
            products: [],
        },
    })

    // get all products by vendor
    useEffect(() => {
        const getProductsByVendor = async ( {productId : string}) => {
            try {
                const res = await fetch(`api/products/`, {
                    method: "GET",
                });
                const data = await res.json();
                setProductsByVendor(data);
                console.log(data);
            } catch (error) {
                console.log("VendorForm_getProducts:", error);
            }
        }
        getProductsByVendor();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            // POST request to create a new vendor
            if (initialData) {
                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                })
                if (res.ok) {
                    setLoading(false);
                    toast.success("Product created successfully");
                    router.push("/products");
                } else {
                    setLoading(false);
                    const errorData = await res.json();
                    form.setError(errorData.error.fieldError, {
                        type: "server",
                        message: errorData.error.message
                    })
                    console.log(errorData);
                    return;
                }
            } else {
                // PATCH request to update an existing vendor
                const res = await fetch("/api/products", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                })
                if (res.ok) {
                    setLoading(false);
                    toast.success("Product updated successfully");
                    router.push("/products");
                } else {
                    setLoading(false);
                    const errorData = await res.json();
                    form.setError(errorData.error.fieldError, {
                        type: "server",
                        message: errorData.error.message
                    })
                    console.log(errorData);
                    return;
                }
            }
        } catch (error) {
            console.log(`Vendor ${initialData ? "PATCH" : "POST"}`, error);
            toast.error("Something went wrong! Please try again");
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
        <div className="">

            {initialData ? (
                <div className=" flex justify-between items-center">
                    <div className="flex flex-col">

                        <p className="">Vendors/ <span className="text-black">Vendor details</span></p>
                        <p className="text-heading2-bold text-black">{initialData.name}</p>
                    </div>
                    <Delete id={initialData._id} title={initialData.name} item="vendors" />
                    {/* <Button type="button">Delete</Button> */}
                </div>
            ) : (
                <div className="text-heading2-bold text-black">Vendors/ Create vendor</div>
            )}

            <hr className="text-black my-4" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="name" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                    <Input type="tel" placeholder="Phone number" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Address" {...field} onKeyDown={handleKeyPress} />
                                </FormControl>
                                <FormMessage className="text-red-1" />
                            </FormItem>
                        )}
                    />
                    <div className="flex gap-10">
                        <Button type="submit" variant={"outline"} className="bg-blue-2">Submit</Button>
                        <Button type="button" variant={"outline"} className="bg-blue-2" onClick={() => router.back()}>Discard</Button>
                    </div>

                </form>
            </Form>
            {initialData?.products && (
                <div>
                    <DataTable columns={ProductColumns} data={productsByVendor} searchKey="product name" />
                </div>
            )}
        </div>
    )
}

export default VendorForm