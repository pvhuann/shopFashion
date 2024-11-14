

type CollectionType={
    _id: string,
    title: string,
    description: string,
    image: string,
    products?: ProductType[],
}
// type SubCategoryType = {
//     _id: string,
//     title: string,
//     description: string,
//     mainCategory?: CategoryType,
//     products?: ProductType[],
// }

type CategoryType={
    _id: string,
    title: string,
    description: string,
    image: string,
    parent?: string |null ,
    products?: ProductType[],
    createdAt: Date,
    updatedAt: Date,
}

type VariantType= {
    color?: string,
    image?: string,
    size?: string,
    material?:string,
    style?:string,
    weight?:number,

    price: number|0,
    inventory: number|0,
    // sale: number|0,
}
type VendorType= {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    products?: ProductType[],
    createAt: Date,
    updateAt: Date,
}
type ProductType= {
    _id: string,
    title: string,
    description: string,
    vendor:string | null,
    media:[string],
    category?: [CategoryType],
    collections?:[CollectionType],
    tags?: [string],
    weight?:number|0,
    // sizes?: [string],
    // colors?: [string],
    expense?: number|0,
    sellingPrice?: number|0,
    variants:[VariantType],
    inventory?: number|0,
    createAt: Date,
    updateAt : Date,
    // stock: number,
}

type OrderColumnType={
    _id: string,
    customer: string,
    products: [string],
    totalAmount: number,
    createdAt: Date,
}

type OrderItemType={
    product: ProductType,
    color: string,
    size: string,
    price: number,
    quantity: number,
}

type CustomerType={
    clerkId: string,
    name: string,
    email: string,
    createdAt: Date,
}

type CartItemType={
    productId: string,
    color: string,
    size: string,
    quantity: number,
}


