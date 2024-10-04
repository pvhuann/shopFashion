// x

import { Gallery } from '@/components/Gallery';
import ProductInformation from '@/components/ProductInformation';
import { getProductDetails } from '@/lib/actions/actions'



const ProductDetail = async ({ params }: { params: { productId: string } }) => {
    const productDetails = await getProductDetails(params.productId)
    console.log(productDetails);

    return (
        
            <div className='flex gap-32 justify-center pt-10'>
                <Gallery productMedia={productDetails.media} />
                <ProductInformation productInformation= {productDetails}/>
            </div>
    
    )
}

export default ProductDetail