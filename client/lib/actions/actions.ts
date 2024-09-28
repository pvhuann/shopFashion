
export const getCollections = async()=> {
    const collections= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`,{method:"GET"});
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

export const getProductsDetails= async(productId: string)=> {
    const productDetails= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`);
    return await productDetails.json();
}

export const getProductsByCollection= async(collectionId: string)=> {
    const products= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/}`)
}


export const getSearchedProducts= async(query: string)=> {
    const result= await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`);
    return await result.json();
}