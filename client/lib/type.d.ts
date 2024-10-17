

type CollectionType = {
    _id: string,
    title: string,
    description: string,
    image: string,
    products: ProductType[],
}

type ProductType = {
    _id: string,
    title: string,
    description: string,
    media: [string],
    category: string,
    collections: [CollectionType],
    tags: [string],
    sizes: [string],
    colors: [string],
    price: number,
    expense: number,
    inventory: number,
    // stock: number,
    createAt: Date,
    updateAt: Date,
}
type OrderType = {
    _id: string,
    shippingAddress: Object,
    customerClerkId: string,
    products: [OrderItemType],
    shippingRate: string,
    totalAmount: number,
    createdAt: Date,
}

type OrderItemType = {
    product: ProductType,
    color: string,
    size: string,
    quantity: number,
    _id: string,
}


type UserType={
    clerkId: string,
    wishList: [string],
    createdAt: string,
    updatedAt: string,
}