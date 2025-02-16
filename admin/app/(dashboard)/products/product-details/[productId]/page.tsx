// 'use client'
// import Loader from '@/components/custom ui/Loader'
// import ProductForm from '@/components/products/ProductForm'
// import { useEffect, useState } from 'react'

// const ProductDetails = ({ params }: { params: { productId: string } }) => {
//     const [loading, setLoading] = useState(true)
//     const [productDetails, setProductDetails] = useState<ProductType | null>(null)

//     useEffect(() => {
//         const getProductDetails = async () => {
//             try {
//                 const res = await fetch(`/api/products/${params.productId}`, {
//                     method: 'GET',
//                 })
//                 const data = await res.json()
//                 setProductDetails(data)
//                 setLoading(false)
//                 console.log(data.title);
//             } catch (error) {
//                 console.log("productDetails_GET", error);
//             }
//         }
//         getProductDetails();
//     }, [params.productId]);


//     return loading ? <Loader /> : (
//         <ProductForm initialData={productDetails} />
//     )
// }

// export default ProductDetails


import ProductForm from '@/components/products/ProductForm';
import { Metadata } from 'next';

// fetch product details from product endpoint by productId
async function getProductDetails(productId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
            method: 'GET',
            cache: 'no-store' // Đảm bảo dữ liệu luôn mới
        });
        if (!res.ok) throw new Error('Failed to fetch product details');
        return await res.json();
    } catch (error) {
        console.error("productDetails_GET", error);
        return null;
    }
}

// Generate metadata SEO
export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
    const product = await getProductDetails(params.productId);
    const title = product?.title ?? 'Unknown Product';
    return {
        title: `${title} | Products | Admin Dashboard`,
        description: product
            ? `Thông tin chi tiết sản phẩm: ${title}.`
            : 'Không tìm thấy sản phẩm.'
    };
}
// product details page
export default async function ProductDetails({ params }: { params: { productId: string } }) {
    const productDetails = await getProductDetails(params.productId);

    if (!productDetails) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                <h1 className="text-2xl font-bold">No found product!</h1>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-600">🛒 {productDetails.title}</h1>
            <ProductForm initialData={productDetails} />
        </div>
    );
}
