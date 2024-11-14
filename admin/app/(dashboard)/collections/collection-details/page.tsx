'use client'

import CollectionForm from '@/components/collections/CollectionForm'
import { DataTable } from '@/components/custom ui/DataTable'
import Loader from '@/components/custom ui/Loader'
import { ProductInCollectionColumns } from '@/components/products/ProductInCollectionColumns'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Collection = () => {

    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [collectionDetails, setCollectionDetails] = useState<CollectionType | null>(null);
    const [productsInCollection, setProductsInCollection] = useState<ProductType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);



    const getCollections = async () => {
        try {
            const res = await fetch("/api/collections", {
                method: "GET",
            })

            const data = await res.json();
            setCollections(data);
            setCollectionDetails(data[0]);
            setProductsInCollection(data[0].products);

            // if (data.length > 0) {
            //     await fetchCollectionDetails(0);
            // }

        } catch (error) {
            console.log("Error fetching collections", error);

        } finally {
            setLoading(false);
        }
    }



    const fetchCollectionDetails = async (index: number) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/collections/${collections?.[index]._id}`, {
                method: 'GET',
            })

            const dataCollection = await response.json();
            setCollectionDetails(dataCollection);
            setProductsInCollection(dataCollection.products);
        } catch (error) {
            console.log("Error fetching collection details", error);
        } finally {
            setLoading(false);
        }
    }



    useEffect(() => {
        getCollections();
    }, []);

    const handleNextCollection = () => {
        const nextIndex = (currentIndex + 1) % collections.length;
        setCurrentIndex(nextIndex);
        fetchCollectionDetails(nextIndex);
    }

    const handlePreviousCollection = () => {
        const previousIndex = (currentIndex - 1 + collections.length) % collections.length;
        setCurrentIndex(previousIndex);
        fetchCollectionDetails(previousIndex);
    }


    return loading ? <Loader /> : (
        <div>
            <div className='flex justify-between items-center'>
                {/* title */}
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-1'>
                        <Link href={'/collections'} className='hover:text-blue-1'>Collections</Link>
                        <span> / </span>
                        <p className='text-black'>Collection details</p>
                    </div>
                    <p className='text-heading3-bold text-black'>{collectionDetails?.title || "No collection"}</p>
                </div>

                {/* button next or previous */}
                <div className='flex text-blue-1 text-[12px]'>
                    <Button onClick={handlePreviousCollection} disabled={currentIndex === 0 ? true : false}>
                        <ArrowLeft size={12} />
                        <span>Previous</span>
                        </Button>
                    <Button onClick={handleNextCollection} disabled={currentIndex === (collections.length - 1) ? true : false}>
                        <span>Next</span>
                        <ArrowRight size={12} />
                        </Button>
                </div>
            </div>
            <hr className='mt-6' />

            {
                collectionDetails && (
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
        </div>

    )


}

export default Collection