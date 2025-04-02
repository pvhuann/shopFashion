// 'use client'
// import CategoryForm from '@/components/categories/CategoryForm'
// import Loader from '@/components/custom ui/Loader';
// import React, { useEffect, useState } from 'react'
// const CategoryDetails = ({ params }: { params: { categoryId: string } }) => {
//     const [loading, setLoading] = useState(true);
//     const [categoryDetails, setCategoryDetails] = useState<CategoryType | null>(null);
//     useEffect(() => {
//         const getCategoryDetails = async () => {
//             try {
//                 const res = await fetch(`/api/categories/${params.categoryId}`, {
//                     method: 'GET',
//                 })
//                 if (res.ok) {
//                     const data = await res.json();
//                     setCategoryDetails(data);
//                 }
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         getCategoryDetails();
//     }, [params.categoryId]);

import CategoryForm from "@/components/categories/CategoryForm";
import { DataTable } from "@/components/custom ui/DataTable";
import { Metadata } from "next";

//     return loading ? <Loader /> : (
//         <div>
//             <p>Category details</p>
//             <hr />
//             <CategoryForm initialData={categoryDetails} />
//         </div>
//     )
// }
// export default CategoryDetails

const getCategoryDetails = async (categoryId : string): Promise<CategoryType | null> => {
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/categories/${categoryId}`, {
            method: "GET",
            cache: "no-store",
        });
        const data : CategoryType = await res.json();
        return data;
    } catch (error) {
        console.log("Error loading category details", error);
        return null;
    }
}

export const generateMetadata = async ({params} : {params : {categoryId : string }}) : Promise<Metadata> => {
    const categoryDetails = await getCategoryDetails(params.categoryId);
    if (!categoryDetails) {
        return {
            title: "Category not found",
            description: "Category not found",
        }
    }
    return {
        title: `${categoryDetails.title} | Admin Dashboard`,
        description: `Details of ${categoryDetails.title}`,
    }
}

const CategoryDetails = async ({params}: {params : {categoryId : string}}) => {
    const categoryDetails = await getCategoryDetails(params.categoryId);
    console.log(categoryDetails);
    return (
        <div>
            <CategoryForm initialData={categoryDetails} />
            <div className='px-10'>
                {/* <DataTable
                    columns={ProductInCollectionColumns}
                    data={productsInCollection}
                    searchKey='title'
                    hiddenSearchInput={false} /> */}
            </div>
        </div>
    )
}

export default CategoryDetails