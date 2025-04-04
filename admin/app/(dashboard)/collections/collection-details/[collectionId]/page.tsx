// 'use client'



// import CollectionForm from '@/components/collections/CollectionForm'
// import { DataTable } from '@/components/custom ui/DataTable'
// import { ProductInCollectionColumns } from '@/components/products/ProductInCollectionColumns'
// import { useEffect, useState } from 'react'

// const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {
//     const [loading, setLoading] = useState(true);
//     const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);
//     const [productsInCollection, setProductsInCollection] = useState<ProductType[]>([]);

//     useEffect(() => {
//         const getCollectionDetails = async () => {
//             try {
//                 const res = await fetch(`/api/collections/${params.collectionId}`, {
//                     method: 'GET',
//                 })

//                 if (res.ok) {
//                     const data = await res.json();
//                     setCollectionDetails(data);
//                     setProductsInCollection(data.products);
//                 }
//             } catch (error) {
//                 console.log("CollectionDetails_GET", error);
//             } finally {
//                 setLoading(false); // Ensure loading is set to false even on error
//             }
//         }
//         getCollectionDetails();
//     }, [params.collectionId]); // Dependency added

//     return (
//         <div>
//             <CollectionForm initialData={collectionDetails} />
//             <div className='px-10'>
//                 <DataTable
//                     columns={ProductInCollectionColumns}
//                     data={productsInCollection}
//                     searchKey='title'
//                     hiddenSearchInput={false} />
//             </div>
//         </div>
//     )
// }

// export default CollectionDetails



import CollectionForm from "@/components/collections/CollectionForm";
import { DataTable } from "@/components/custom ui/DataTable";
import { ProductColumns } from "@/components/products/ProductColumns";
import { Metadata } from "next";

// get collection details from the server
const getCollectionDetails = async (collectionId: string): Promise<CollectionType | null> => {
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/collections/${collectionId}`, {
            method: "GET",
            cache: "no-store",
        });
        if (!res.ok) throw new Error('Failed to fetch collection details');
        const data: CollectionType = await res.json();
        return data;
    } catch (error) {
        console.log("CollectionDetails_GET", error);
        return null;
    }
}

//get products in collection
const getProductsInCollection = async (productIds: string[]): Promise<ProductType[] | []> => {
    try {
        const res = await fetch(`${process.env.INTERNAL_API_URL}/products?data=${productIds.join(",")}`, {
            method: "GET",
            cache: "no-store",
        })
        if (!res.ok) throw new Error('Failed to fetch products in collection');
        const data: ProductType[] = await res.json();
        return data;
    } catch (error) {
        console.log("getProductsByCollection", error);
        return [];
    }
}

// metadata of the page
export const generateMetadata = async ({ params }: { params: { collectionId: string } }): Promise<Metadata> => {
    const collectionDetails = await getCollectionDetails(params.collectionId);
    if (!collectionDetails) {
        return {
            title: "Collection not found",
            description: "Collection not found",
        }
    }
    return {
        title: `${collectionDetails.title} | Admin Dashboard`,
        description: `Details of ${collectionDetails.title}`,
    }
}

// CollectionDetails component
// This component fetches the collection details and displays the form and products in the collection
const CollectionDetails = async ({params} : {params : {collectionId :string}}) => {
    const collectionDetails = await getCollectionDetails(params.collectionId);
    const productsInCollection: ProductType[] = [];
    if (collectionDetails && collectionDetails.products && collectionDetails.products.length > 0) {
        const productIds : string[] = collectionDetails.products.map((product) => product._id);
        const products : ProductType[] = await getProductsInCollection(productIds);
        productsInCollection.push(...products);
    }
    if (!collectionDetails) {
        return (
            <div className='flex items-center justify-center min-h-screen text-red-500'>
                <h1 className='text-2xl font-bold'>No collection found!</h1>
            </div>
        )
    }
    return (
        <div>
            <CollectionForm initialData={collectionDetails} />
            <div className='px-10'>
                <DataTable
                    columns={ProductColumns}
                    data={productsInCollection}
                    searchKey='title'
                    hiddenSearchInput={false} />
            </div>
        </div>
    )
}

export default CollectionDetails
