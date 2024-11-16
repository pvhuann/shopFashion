

type CollectionType={
    _id: string,
    title: string,
    description: string,
    image: string,
    products?: ProductType[],
    createdAt: Date,
    updatedAt: Date,
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
    description?: string| null,
    image?: string| null,
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
    price: number|0,
    expense: number|0,
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
    createdAt: Date,
    updatedAt: Date,
}
type ProductType= {
    _id: string,
    title: string,
    description: string,
    vendor:string | null,
    media:[string],
    category?:CartItemType | null,
    collections?:[CollectionType]| [],
    tags?: [string]| [],
    weight?:number|0,
    // sizes?: [string],
    // colors?: [string],
    expense?: number|0,
    price?: number|0,
    variants:[VariantType],
    inventory?: number|0,
    createdAt: Date,
    updatedAt : Date,
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
    updatedAt: Date,
}

type CartItemType={
    productId: string,
    color: string,
    size: string,
    quantity: number,
}


