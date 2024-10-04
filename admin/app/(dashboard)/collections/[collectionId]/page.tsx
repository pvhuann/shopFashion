'use client'

import CollectionForm from '@/components/collections/CollectionForm'
import { DataTable } from '@/components/custom ui/DataTable'
import Loader from '@/components/custom ui/Loader'
import { ProductColumns } from '@/components/products/ProductColumns'
import { useEffect, useState } from 'react'

const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {

    const [loading, setLoading] = useState(true)
    const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)

    const getCollectionDetails = async () => {
        try {
            const res = await fetch(`/api/collections/${params.collectionId}`, {
                method: 'GET',
            })

            if (res.ok) {
                const data = await res.json();
                setCollectionDetails(data);
                setLoading(false);
                
            }
        } catch (error) {
            console.log("CollectionDetails_GET", error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getCollectionDetails();
    }, []);
    console.log(collectionDetails?.products);



    return loading ? <Loader /> : (
        <div>
            <CollectionForm initialData={collectionDetails} />
            <div className='px-10'>
                <DataTable columns={ProductColumns} data={collectionDetails?.products} searchKey='title' hiddenSearchInput={false} />
            </div>

        </div>
    )
}

export default CollectionDetails