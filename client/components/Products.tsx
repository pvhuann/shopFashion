import { getProducts } from '@/lib/actions/actions'
import ProductCard from './ProductCard'

const Products = async () => {
    const products = await getProducts()

    return (
        <div className='pt-10'>
            <p className='text-heading1-bold text-center'>Products</p>
            {!products || products.length === 0? (
                <div className='text-center text-body-bold pt-3'>No product found</div>
            ): (
                <div className='flex gap-4 flex-wrap justify-center'>
                    {products.map((product:ProductType)=> (
                        <ProductCard key={product._id} product={product}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Products