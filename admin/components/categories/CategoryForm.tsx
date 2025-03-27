// 'use client'

// import { z } from "zod"
// import toast from "react-hot-toast"
// import { useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useParams, useRouter } from "next/navigation"

// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "../ui/textarea"
// import ImageUpload from "../custom ui/ImageUpload"
// import Delete from "../custom ui/Delete"
// import { Separator } from "../ui/separator"
// import { Button } from "@/components/ui/button"

// const formSchema = z.object({
//     title: z.string().trim().min(2).max(30),
//     description: z.string().trim().min(2).max(600),
//     image: z.string().url(),
//     parent: z.string().trim(),
// })

// interface CategoryProps {
//     initialData?: CategoryType | null,
// }

// const CategoryForm: React.FC<CategoryProps> = ({ initialData }) => {
//     const [loading, setLoading] = useState(false)
//     const router = useRouter()
//     // const params = useParams()


//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: initialData ? initialData : {
//             title: "",
//             description: "",
//             image: "",
//             parent:"",
//         },
//     })

//     const onSubmit = async (values: z.infer<typeof formSchema>) => {
//         // console.log(values);
//         try {
//             setLoading(true);
//             const url = initialData ? `/api/categories/${initialData._id}` : "/api/categories"
//             const res = await fetch(url, {
//                 method: 'POST',
//                 body: JSON.stringify(values),
//             })

//             if (res.ok) {
//                 setLoading(false);
//                 toast.success(`Category ${initialData ? "updated" : "created"} successfully`)
//                 // window.location.href = "/collections";
//                 router.push("/categories")
//             }
//         } catch (error) {
//             console.log("Category_POST", error);
//             toast.error("Something went wrong! Please try again")
//         }
//     }

//     //block "Submit" when "Enter" is clicked
//     const handleKeyPress = (event:
//         | React.KeyboardEvent<HTMLInputElement>
//         | React.KeyboardEvent<HTMLTextAreaElement>) => {
//         if (event.key === "Enter") {
//             event.preventDefault()
//         }
//     }

//     return (
//         <div className="p-10">

//             {initialData ? (
//                 <div className=" flex justify-between items-center">
//                     <div className="text-heading2-bold">Update Category</div>
//                     <Delete id={initialData._id} title={initialData.title} item="category" />
//                 </div>
//             ) : (
//                 <div className="text-heading2-bold">Create Category</div>
//             )}

//             <Separator className="bg-grey-1 my-4" />
//             <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                     <FormField
//                         control={form.control}
//                         name="title"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Title</FormLabel>
//                                 <FormControl>
//                                     <Input placeholder="title" {...field} onKeyDown={handleKeyPress} />
//                                 </FormControl>
//                                 <FormMessage className="text-red-1" />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         control={form.control}
//                         name="description"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Description</FormLabel>
//                                 <FormControl>
//                                     <Textarea placeholder="Description" {...field} rows={6} onKeyDown={handleKeyPress} />
//                                 </FormControl>
//                                 <FormMessage className="text-red-1" />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         control={form.control}
//                         name="image"
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Image</FormLabel>
//                                 <FormControl>
//                                     <ImageUpload
//                                         value={field.value ? [field.value] : []}
//                                         onChange={(url) => field.onChange(url)}
//                                         onRemove={() => field.onChange('')}
//                                     />
//                                 </FormControl>
//                                 <FormMessage className="text-red-1" />
//                             </FormItem>
//                         )}
//                     />
//                     <div className="flex gap-10">
//                         <Button type="submit" variant={"outline"} className="bg-blue-2">Submit</Button>
//                         <Button type="button" variant={"outline"} className="bg-blue-2" onClick={() => router.push("/collections")}>Discard</Button>
//                     </div>

//                 </form>
//             </Form>
//         </div>
//     )
// }

// export default CategoryForm


"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "../custom ui/ImageUpload";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().trim().min(2).max(30),
    description: z.string().trim().max(600).optional(),
    image: z.string().nullable().optional(),
    parent: z.string().trim().nullable().optional(),
})

interface CategoryProps {
    initialData?: CategoryType | null;
}

const CategoryForm: React.FC<CategoryProps> = ({ initialData }) => {
    const router = useRouter();

    // State to manage all categories (for the parent category dropdown)
    const [allCategories, setAllCategories] = useState<CategoryIdTitleType[] | []>([]);

    // Form setup using react-hook-form and Zod for validation
    const form = useForm<CategoryType>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? initialData :  {
            title: "",
            description: undefined,
            image: "",
            parent: null, // Default to top-level category
        },
    });

    // Fetch all categories when the component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories?data=id-title");
                if (!res.ok) {
                    throw new Error("Failed to fetch categories");
                }
                const data = await res.json();
                setAllCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Handle error (e.g., display an error message)
            }
        };
        fetchCategories();
    }, []);

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Determine the request method (POST for create, PUT for update)
            const method = initialData?._id ? "PUT" : "POST";
            const url = initialData?._id
                ? `/api/categories/${initialData._id}`
                : "/api/categories";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                const newCategory = await res.json();
                toast.success(
                    initialData?._id
                        ? "Category updated successfully!"
                        : "Category created successfully!"
                );
                form.reset();
                router.push("/categories");
            } else {
                // Handle errors (e.g., display error messages)
                toast.error(
                    initialData?._id
                        ? "Failed to update category."
                        : "Failed to create category."
                );
            }
        } catch (error) {
            console.error("Error submitting category:", error);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="">
            <div className="text-heading2-bold">
                {initialData?._id ? "Edit Category" : "Create Category"}
            </div>
            <Separator className="bg-grey-1 mt-4" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        // disabled={false}
                                        onChange={field.onChange}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Category title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parent"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Parent Category</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="bg-background px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={field.value || ""}
                                        >
                                            <option value="">None (Top-level)</option>
                                            {allCategories
                                                .filter(
                                                    (cat) =>
                                                        !initialData?._id || cat._id !== initialData._id // Exclude the current category from the parent options
                                                )
                                                .map((cat) => (
                                                    <option key={cat._id} value={cat._id}>
                                                        {cat.title}
                                                    </option>
                                                ))}
                                        </select>
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
                                    <Textarea
                                        rows={6}
                                        placeholder="Category description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-10">
                        <Button
                            type="submit"
                            className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:shadow-md "
                        >
                            {initialData?._id ? "Update Category" : "Create Category"}
                        </Button>
                        <Button
                            type="button"
                            className="bg-blue-600 px-4 py-2 rounded-lg text-white hover:shadow-md "
                            onClick={() => router.push("/categories")}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CategoryForm;
