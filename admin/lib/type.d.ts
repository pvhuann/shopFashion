type CollectionType={
    _id: string,
    title: string,
    description: string,
    image: string,
    products?: ProductType[],
    createdAt: Date,
    updatedAt: Date,
}
type SubCategoryType = {
    _id: string,
    title: string,
    description: string,
    mainCategory?: CategoryType,
    products?: ProductType[],
}

type CategoryType={
    _id: string,
    title: string,
    description?: string,
    image?: string,
    parent?: string | null,
    parentTitle?: string | null, // Add this line
    products?: ProductType[]| [],
    createdAt: Date,
    updatedAt: Date,
}

type VariantType= {
    color?: string,
    image?: number,
    size?: string,
    material?:string,
    style?:string,
    price?: number,
    expense?: number,
    inventory?: number,
    availability?: boolean,
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
type ProductType  = {
    _id: string,
    title: string,
    description: string,
    media:[MediaType],
    weight?:number,
    sku:string,
    vendor:string,
    category?:CategoryType,
    collections?:[CollectionType],
    tags?: [string],
    variants:[VariantType],
    inventory?: number,
    availability: boolean,
    createdAt: Date,
    updatedAt : Date,
    // stock: number,
}

type MediaType= {
    url: string,
    type:"image"  | "video",
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

type SaleType={
    _id: string,
    product: [ProductType],
    timeStart: Date,
    timeEnd: Date,
    discountValue: number,
    discountType: string,
    orderThreshold: number,
    isActive: boolean,
    quantity: number,
    totalAmount: number,
    createdAt: Date,
    updatedAt: Date,
}


