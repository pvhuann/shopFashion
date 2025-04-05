import Collection from "../models/Collection";
import Product from "../models/Product";
import redis from "./connectRedis";

/**
 * Retrieves all products from Redis, or from MongoDB if not cached.
 * @returns Array of products
 */
export async function getAllProducts(): Promise<ProductType[] | []> {
    try {
        const productsData = await redis.hgetall("products");
        if (productsData && Object.keys(productsData).length > 0) {
            const products: ProductType[] = Object.values(productsData).map((data) => {
                try {
                    return JSON.parse(data as string) as ProductType;
                } catch (error) {
                    console.error("Error parsing product data:", error);
                    return null; // Return null if parsing fails
                }
            }).filter((product) => product !== null)
            return products;
        } else {
            // If no products are found in Redis, fetch from MongoDB (not implemented here)
            // const products = await fetchProductsFromMongoDB(); // Implement this function to fetch from MongoDB
            // return products;
            const products: ProductType[] = await Product.find().sort({ createdAt: -1 }).populate({ path: "collections", model: Collection });
            if (products.length > 0) {
                //Cache the products in Redis
                const pipeline = redis.pipeline();

                // Set the products in Redis with an expiration time of 24 hours
                // Using pipeline to set multiple keys at once
                // and set expiration for the entire pipeline
                // const cachedProducts = products.map((product)=>({
                //     ...product,
                //     _id : product._id.toString(),
                // }))
                products.forEach((product) => {
                    pipeline.hset("products", { [product._id.toString()]: JSON.stringify(product) });
                });
                // Set expiration for the entire pipeline
                pipeline.expire("products", 60 * 60); // Set expiration to 24 hours
                await pipeline.exec();
            }
            return products; // Return an empty array if no products are found
        }
    } catch (error) {
        console.error("Error retrieving products:", error);
        return [] as ProductType[]; // Return an empty array in case of error   
    }
}