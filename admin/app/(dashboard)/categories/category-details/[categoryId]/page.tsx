'use client'

import CategoryForm from '@/components/categories/CategoryForm'
import Loader from '@/components/custom ui/Loader';
import React, { useEffect, useState } from 'react'

const CategoryDetails = ({ params }: { params: { categoryId: string } }) => {

    const [loading, setLoading] = useState(true);
    const [categoryDetails, setCategoryDetails] = useState<CategoryType | null>(null);

    const getCategoryDetails = async () => {
        try {
            const res = await fetch(`/api/categories/${params.categoryId}`, {
                method: 'GET',
            })

            if (res.ok) {
                const data = await res.json();
                setCategoryDetails(data);
            }

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getCategoryDetails();
    }, [])


    return loading? <Loader/>: (
        <div>
            <p>Category details</p>
            <hr />
            <CategoryForm initialData={categoryDetails} />
        </div>
    )
}

export default CategoryDetails