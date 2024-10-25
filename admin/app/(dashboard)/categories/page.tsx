'use client'

import { CategoryColumns } from '@/components/categories/CategoryColumns'
import { DataTable } from '@/components/custom ui/DataTable'
import React, { useEffect, useState } from 'react'

const Categories = () => {

    const [loading, setLoading]= useState(true)
    const [categories, setCategories] = useState([])

    const getCategories = async () => {
        try {
            const res= await fetch("api/categories", {
                method: "GET",
                // headers: {
                //     "Content-Type": "application/json",
                // },
                // credentials: "include",
                // cache: "no-store",
            })

            const data = await res.json();
            setCategories(data);
            console.log("success");
        } catch (error) {
            console.log("Error loading categories",error);
            
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    return loading ? <p>Loading...</p> : (
        <div>
            <p>Categories</p>
            <hr />
            <DataTable columns={CategoryColumns} data={categories} hiddenSearchInput={false} searchKey='title' />
        </div>
    )
}

export default Categories