'use client'

import CollectionForm from '@/components/collections/CollectionForm'
import { DataTable } from '@/components/custom ui/DataTable'
import Loader from '@/components/custom ui/Loader'
import { ProductInCollectionColumns } from '@/components/products/ProductInCollectionColumns'
import { useEffect, useState } from 'react'

const CollectionDetails = ({ params }: { params: { collectionId: string } }) => {

    const [loading, setLoading] = useState(true)
    const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null)
    const[productsInCollection, setProductsInCollection] = useState<ProductType[]| null>(null)

    const getCollectionDetails = async () => {
        try {
            const res = await fetch(`/api/collections/${params.collectionId}`, {
                method: 'GET',
            })

            if (res.ok) {
                const data = await res.json();
                console.log(data);
                
                setCollectionDetails(data);
                setProductsInCollection(data.products);
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
    



    return loading ? <Loader /> : (
        <div>
            <CollectionForm initialData={collectionDetails} />
            <div className='px-10'>
                {/* {collectionDetails?.products.map((product)=> (
                    <div className='' key={product._id}>    
                        <p>{product.title}</p>
                    </div>
                ))} */}
                <DataTable
                    columns={ProductInCollectionColumns}
                    data={productsInCollection??[]}
                    searchKey='title'
                    hiddenSearchInput={false} />
            </div>

        </div>
    )
}

export default CollectionDetails