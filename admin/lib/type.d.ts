

type CollectionType={
    _id: string,
    title: string,
    description: string,
    image: string,
    products?: ProductType[],
}

type CategoryType={
    _id: string,
    title: string,
    description: string,
    image: string,
    products?: ProductType[],
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
    description?: string,
    vendor?:string | null,
    media?:[string],
    category?: [CategoryType],
    collections?:[CollectionType],
    tags?: [string],
    // sizes?: [string],
    // colors?: [string],
    originalPrice?: number|0,
    sellingPrice?: number|0,
    inventory?: number|0,
    createAt: Date,
    updateAt : Date,
    variants:[VariantType],
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


