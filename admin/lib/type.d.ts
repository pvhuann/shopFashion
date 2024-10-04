

type CollectionType={
    _id: string,
    title: string,
    description: string,
    image: string,
    products: ProductType[],
}

type ProductType= {
    _id: string,
    title: string,
    description: string,
    media:[string],
    category: string,
    collections:[CollectionType],
    tags: [string],
    sizes: [string],
    colors: [string],
    price: number,
    expense: number,
    // stock: number,
    createAt: Date,
    updateAt : Date,
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