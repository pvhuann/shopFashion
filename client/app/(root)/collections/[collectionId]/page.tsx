import ProductCard from '@/components/ProductCard';
import { getCollectionDetails } from '@/lib/actions/actions'
import Image from 'next/image';
import React from 'react'

const CollectionInformation = async({params}: {params: {collectionId: string}}) => {
  
  const collectionDetails =await getCollectionDetails(params.collectionId);
  console.log(collectionDetails);
  
  return (
    <div className='flex flex-col gap-10'>
      <Image
        src={collectionDetails.image}
        width={1500}
        height={1000}
        alt='collection'
        className='w-full h-[600px] object-cover'
      />
      <div className='flex flex-col items-center gap-6'>
        <p className='text-heading2-bold'>{collectionDetails.title}</p>
        <p className='text-base-medium max-w-[600px]'>{collectionDetails.description}</p>
      </div>
      <div className='flex gap-6 justify-center'>
        {collectionDetails.products.map((product: ProductType)=>(
          <ProductCard product={product} key={product._id}/>
        ))}
      </div>
    </div>
  )
}

export default CollectionInformation