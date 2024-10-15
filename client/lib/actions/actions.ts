
export const getCollections = async()=> {
    const collections= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`);
    return await collections.json();
}


export const getCollectionDetails= async(collectionId: string)=> {
    const collectionDetails= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`);
    return await collectionDetails.json();
}

export const getProducts= async()=> {
    const products= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    return await products.json();
}

export const getProductDetails= async(productId: string)=> {
    const productDetails= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
    return await productDetails.json();
}

export const getProductsByCollection= async(collectionId: string)=> {
    const products= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/}`);
    return await products.json();
}


export const getSearchedProducts= async(query: string)=> {
    const result= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`);
    return await result.json();
}

export const getOrdersByCustomerId= async(customerId: string)=> {
    const orders= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}`);
    return await orders.json();
}

export const getProductInOrderItem= async(productId: string)=> {
    const res= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
    const data= await res.json();
    return {
        title:data.title,
        imageUrl: data.media[0],
        price: data.price,
    }
}

export const getRelatedProducts =async (productId:string)=> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`);
    return await res.json();
}