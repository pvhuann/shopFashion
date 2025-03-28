'use client'

import { CategoryColumns } from '@/components/categories/CategoryColumns'
import { DataTable } from '@/components/custom ui/DataTable'
import Loader from '@/components/custom ui/Loader'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

const Categories = () => {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const getTitleCategory = async (parentId:string) => {
        try {
            const res = await fetch(`api/categories/${parentId}`, {
                method: "GET",
            })
            const data = await res.json();
            return data.title;
        } catch (error) {
            console.log("Error loading parent category title", error);
            return null;
        }
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const res = await fetch("api/categories", {
                    method: "GET",
                })
                const data = await res.json();
                // Fetch parent titles
                const updatedData = await Promise.all(data.map(async (category:CategoryType) => {
                    if (category.parent) {
                        category.parentTitle = await getTitleCategory(category.parent);
                    }
                    return category;
                }));
                setCategories(updatedData);
            } catch (error) {
                console.log("Error loading categories", error);
            } finally {
                setLoading(false)
            }
        }
        getCategories();
    }, []);

    return loading ? <Loader /> : (
        <div>
            <div className='flex items-center justify-between'>
                <p className='text-heading2-bold text-black'>Categories</p>
                <Button type='button' className='bg-blue-1 text-white' onClick={() => window.location.href = "/categories/add-category"}>Add category</Button>
            </div>

            <hr className='mt-2'/>
            <DataTable columns={CategoryColumns} data={categories} hiddenSearchInput={false} searchKey='title' />
        </div>
    )
}

export default Categories