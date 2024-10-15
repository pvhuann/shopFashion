import { getProductDetails } from '@/lib/actions/actions'
type Props= {
    productId: string;
}
const ItemCart = async (props: Props) => {
    const productDetails = await getProductDetails(props.productId);
    return (
        <div className='flex gap-3'>
            <select name="" id="colors">
                {productDetails.colors.map((color:string, index:number) => (
                    <option key={index} value={color}>{color}</option>
                ))}
            </select>

            <select name="" id="sizes">
                {productDetails.sizes.map((size:string, index:number) => (
                    <option key={index} value={size}>{size}</option>
                ))}
            </select>
        </div>
    )
}

export default ItemCart