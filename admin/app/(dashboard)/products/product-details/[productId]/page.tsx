'use client'
import Loader from '@/components/custom ui/Loader'
import ProductForm from '@/components/products/ProductForm'
import { useEffect, useState } from 'react'

const ProductDetails = ({ params }: { params: { productId: string } }) => {
    const [loading, setLoading] = useState(true)
    const [productDetails, setProductDetails] = useState<ProductType | null>(null)

    const getProductDetails = async () => {
        try {
            const res = await fetch(`/api/products/${params.productId}`, {
                method: 'GET',
            })
            const data = await res.json()
            setProductDetails(data)
            setLoading(false)
            document.title = `${data.title} | Products`
        } catch (error) {
            console.log("productDetails_GET", error);
        }
    }

    useEffect(() => {
        getProductDetails();
    }, []);


    return loading ? <Loader /> : (
        <ProductForm initialData={productDetails} />
    )
}

export default ProductDetails