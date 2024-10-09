import Image from 'next/image'
import Link from 'next/link'
import { getCollections } from '@/lib/actions/actions'

const Collections = async () => {
    const collections = await getCollections()
    return (
        <div className='pt-6'>
            <div className='text-heading1-bold py-3 text-center'>Collections</div>
            {
                (!collections || collections.length === 0)
                    ? (
                        <p className='text-body-bold text-center'>No collections founds</p>
                    ) : (
                        <div className='flex items-center justify-center gap-4 pt-3'>
                            {
                                collections.map((collection: CollectionType) => (
                                    <Link
                                        href={`/collections/${collection._id}`}
                                        className='' key={collection._id}>
                                        <Image
                                            src={collection.image}
                                            alt={collection.title}
                                            width={350}
                                            height={200}
                                            className='rounded-lg cursor-pointer'
                                        />
                                    </Link>
                                ))
                            }
                        </div>
                    )
            }
        </div>
    )
}

export default Collections