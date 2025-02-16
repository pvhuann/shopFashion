import ProductForm from '@/components/products/ProductForm'

export const metadata = {
    title: "Add Product",
    description: "Add product page",
}

const CreateProduct = () => {
    return (
        <ProductForm/>
    )
}

export default CreateProduct