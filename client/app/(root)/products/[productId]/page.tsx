import { Gallery } from '@/components/Gallery';
import ProductCard from '@/components/ProductCard';
import ProductInformation from '@/components/ProductInformation';
import { getProductDetails, getRelatedProducts } from '@/lib/actions/actions'
const ProductDetail = async ({ params }: { params: { productId: string } }) => {
    const productDetails = await getProductDetails(params.productId);
    console.log(productDetails);
    
    const relatedProducts = await getRelatedProducts(params.productId);

    return (
        <div className='flex flex-col gap-10 p-10 max-md:p-4'>
            <div className='flex gap-32 justify-center pt-10 max-md:flex-col max-md:gap-4'>
                <Gallery productMedia={productDetails.media} />
                <ProductInformation productInformation={productDetails} />
            </div>

            <div className='flex flex-col gap-6'>
                <p className='text-body-bold'>Related Products</p>
                <div className='flex gap-6 flex-wrap justify-center'>
                    {relatedProducts?.map((product: ProductType) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
export default ProductDetail;
export const dynamic = "force-dynamic";
