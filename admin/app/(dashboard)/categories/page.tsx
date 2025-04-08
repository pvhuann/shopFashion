// 'use client'

// import { CategoryColumns } from '@/components/categories/CategoryColumns'
// import { DataTable } from '@/components/custom ui/DataTable'
// import Loader from '@/components/custom ui/Loader'
// import { Button } from '@/components/ui/button'
// import React, { useEffect, useState } from 'react'

// const Categories = () => {
//     const [loading, setLoading] = useState(true);
//     const [categories, setCategories] = useState<CategoryType[]>([]);
//     const getTitleCategory = async (parentId: string): Promise<string | null> => {
//         try {
//             const res = await fetch(`${process.env.INTERNAL_API_URL}}/categories/${parentId}`, {
//                 method: "GET",
//                 cache: "no-store",
//             })
//             const data : CategoryType = await res.json();
//             return data.title;
//         } catch (error) {
//             console.log("Error loading parent category title", error);
//             return null;
//         }
//     }
//     useEffect(() => {
//         const getCategories = async () => {
//             try {
//                 const res = await fetch("api/categories", {
//                     method: "GET",
//                 })
//                 const data = await res.json();
//                 // Fetch parent titles
//                 const updatedData = await Promise.all(data.map(async (category:CategoryType) => {
//                     if (category.parent) {
//                         category.parentTitle = await getTitleCategory(category.parent);
//                         // category.parentTitle = "abc";
//                     }
//                     return category;
//                 }));
//                 setCategories(updatedData);
//                 console.log("Categories", updatedData);
//             } catch (error) {
//                 console.log("Error loading categories", error);
//             } finally {
//                 setLoading(false)
//             }
//         }
//         getCategories();
//     }, []);
//         return loading ? <Loader /> : (
//         <div>
//             <div className='flex items-center justify-between'>
//                 <p className='text-heading2-bold text-black'>Categories</p>
//                 <Button type='button' className='bg-blue-1 text-white' onClick={() => window.location.href = "/categories/add-category"}>Add category</Button>
//             </div>

//             <hr className='mt-2'/>
//             <DataTable columns={CategoryColumns} data={categories} hiddenSearchInput={false} searchKey='title' />
//         </div>
//     )
// }


import { CategoryColumns } from '@/components/categories/CategoryColumns';
import ActionsItemButton from '@/components/custom ui/ActionsItemButton';
import { DataTable } from '@/components/custom ui/DataTable';
import { Metadata } from 'next';
const getTitleCategory = async (parentId: string) : Promise<string | null> => {
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/categories/${parentId}`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        })
        const data : CategoryType = await res.json();
        return data.title;
    } catch (error) {
        console.log("Error loading parent category title", error);
        return null;
    }
}
const getCategories = async () : Promise<CategoryType[]> => {
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/categories`, {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        })
        const data: CategoryType[] = await res.json();
        // Fetch parent titles
        const categories = await Promise.all(
            data.map(async (category : CategoryType) => {
                if (category.parent !== null ) {
                    category.parentTitle = await getTitleCategory(category.parent);
                }
                return category;
            })
        );
        return categories;
    } catch (error) {
        console.log("Error loading categories", error);
        return [];
    }
}

export const generateMetadata = async():Promise<Metadata> => {
    const categories:CategoryType[] = await getCategories();
    return {
        title:"Categories | Admin Dashboard",
        description:`List of ${categories?.length ?? 0} categories`,
    }
}

export const revalidate = 3600; // Revalidate every hour

const Categories = async () => {
    const categories = await getCategories();
    console.log("Categories", categories);
    return (
        <div className="p-6">
            {/* Header */}      
                <div className="flex flex-col gap-2 w-full">
                    {/* Title and quantity */}
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-black">Categories</h1>
                        <span className="px-2 py-1 text-lg font-semibold bg-gray-200 rounded-lg shadow">
                            {categories?.length ?? 0}
                        </span>
                    </div>
                    {/* Actions */}
                    <ActionsItemButton itemType="categories" basePath="category" arrayItem={categories} />
                </div>
            <hr className="my-4" />
            {/* Table vendor */}
            <DataTable columns={CategoryColumns} data={categories} hiddenSearchInput={false} searchKey="name" />
        </div>
    )
}
export default Categories