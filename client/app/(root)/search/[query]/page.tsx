import { getSearchedProducts } from '@/lib/actions/actions'
import ProductCard from '@/components/ProductCard';

const page = async ({ params }: { params: { query: string } }) => {
    const resultSearchedProducts = await getSearchedProducts(params.query);
    return (
        <div className='flex flex-col gap-10 mt-10 ml-10'>
            <div className='text-heading3-bold'>Results search product for <i className='text-red-1'>{decodeURI(params.query)}</i></div>
            {resultSearchedProducts.length === 0 ? (
                <div className='text-center'>No product by search!</div>
            ) : (
                <div className='flex gap-6'>
                    {resultSearchedProducts?.map((item:ProductType) => (
                        <ProductCard product={item} key={item._id} />
                    ))}
                </div>
            )}
        </div>
    )
}
export default page;
export const dynamic = "force-dynamic";
