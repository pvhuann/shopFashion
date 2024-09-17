// x

import { Gallery } from '@/components/Gallery';
import ProductInformation from '@/components/ProductInformation';
import { getProductsDetails } from '@/lib/actions/actions'



const ProductDetail = async ({ params }: { params: { productId: string } }) => {
    const productDetails = await getProductsDetails(params.productId)
    console.log(productDetails);

    return (
        <>
            <div className='flex gap-32 justify-center pt-10'>
                <Gallery productMedia={productDetails.media} />
                <ProductInformation productInformation= {productDetails}/>
            </div>
        </>
    )
}

export default ProductDetail