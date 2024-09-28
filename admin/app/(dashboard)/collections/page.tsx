'use client'

import { CollectionColumns } from '@/components/collections/CollectionColumns'
import { DataTable } from '@/components/custom ui/DataTable'
import Loader from '@/components/custom ui/Loader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Collections = () => {
    const [loading, setLoading] = useState(true)
    const [collections, setCollections] = useState([])
    const router= useRouter()

    const getCollections = async () => {
        try {
            const res = await fetch('/api/collections', {
                method: 'GET',
            })

            const data = await res.json()
            setCollections(data)
            setLoading(false)

        } catch (error) {
            console.log("Collections_GET", error);
            setLoading(false)
        }
    }

    useEffect(()=>{
        getCollections()       
    },[]);


    return loading? <Loader/>: (
        <div className='p-10'>
            <div className='flex justify-between items-center  mb-4'>
                <p className='text-heading2-bold'>Collections</p>
                <Button type='button' className='bg-blue-1 text-white' onClick={()=> router.push('collections/new')}>
                    <Plus className='w-4 h-4'/>
                    <p>Create collection</p>
                </Button>
            </div>
            <DataTable columns={CollectionColumns} data={collections} hiddenSearchInput={false} searchKey='title'/>
        </div>
    )
}

export default Collections