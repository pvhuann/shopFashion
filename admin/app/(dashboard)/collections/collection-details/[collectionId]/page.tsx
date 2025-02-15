'use client'

import CollectionForm from '@/components/collections/CollectionForm'
import { DataTable } from '@/components/custom ui/DataTable'
import { ProductInCollectionColumns } from '@/components/products/ProductInCollectionColumns'
import { useEffect, useState } from 'react'

const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {
    const [loading, setLoading] = useState(true);
    const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);
    const [productsInCollection, setProductsInCollection] = useState<ProductType[]>([]);



    useEffect(() => {
        const getCollectionDetails = async () => {
            try {
                const res = await fetch(`/api/collections/${params.collectionId}`, {
                    method: 'GET',
                })

                if (res.ok) {
                    const data = await res.json();
                    setCollectionDetails(data);
                    setProductsInCollection(data.products);
                }
            } catch (error) {
                console.log("CollectionDetails_GET", error);
            } finally {
                setLoading(false); // Ensure loading is set to false even on error
            }
        }
        getCollectionDetails();
    }, [params.collectionId]); // Dependency added

    return (
        <div>
            <CollectionForm initialData={collectionDetails} />
            <div className='px-10'>
                <DataTable
                    columns={ProductInCollectionColumns}
                    data={productsInCollection}
                    searchKey='title'
                    hiddenSearchInput={false} />
            </div>
        </div>
    )
}

export default CollectionDetails
