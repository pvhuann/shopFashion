// let client = {}, statusConnectRedis = () => {

// }
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType> | null = null;

declare global {
    var __redisClient: RedisClientType | null | undefined;
    var __redisClientPromise: Promise<RedisClientType> | null | undefined;
}

const redisURL = process.env.REDIS_URL;
if (!redisURL && process.env.NODE_ENV !== "development") {
    console.warn("Redis URL not found. Redis client will not be initialized.");
    // production mode, do not initialize redis client
    // throw new Error("REDIS_URL environment variable is required in production.")
}

async function createAndConnectRedisClient(): Promise<RedisClientType> {
    if (!redisURL) {
        throw new Error("REDIS_URL environment variable is required in production.")
    }
    console.log("Creating Redis client...");
    const client = createClient({
        // password: process.env.REDIS_PASSWORD,
        // username: process.env.REDIS_USERNAME,
        url: redisURL,
        socket: {
            // host: process.env.REDIS_HOST,
            // port: Number(process.env.REDIS_PORT),
            connectTimeout: 10000,
        }
    })

    client.on("error", (error) => console.log("Redis Client Error", error));
    client.on("connect", () => console.log("Redis client connected."));
    client.on("reconnecting", () => console.log("Redis client reconnecting..."));
    client.on("ready", () => console.log("Redis client ready."));
    client.on("end", () => console.log("Redis client disconnected."));

    try {
        await client.connect();
        console.log("Redis client connected successfully.");
        return client as RedisClientType;
    } catch (error) {
        console.error("Error creating Redis client:", error);
        await client.quit().catch((err) => console.error("Error quitting Redis client:", err));
        throw error;
    }
}

/**
 * Get instance redis client connected.
 * Use Singleton pattern to ensure only one connection is created.
 * Handling development environment with host-reloading .
 * @returns Promise<RedisClientType> - 
 */

export async function getRedisClient(): Promise<RedisClientType> {
    if (process.env.NODE_ENV === "development") {
        // In development mode, use global variable to store redis client
        if (!globalThis.__redisClientPromise) {
            console.log("[DEV] Creating Redis client in development mode...");
            globalThis.__redisClientPromise = createAndConnectRedisClient();
            globalThis.__redisClientPromise
                .then((client) => {
                    globalThis.__redisClient = client;
                    console.log("[DEV] Global Redis client ready.");
                })
                .catch((error) => {
                    globalThis.__redisClientPromise = null;
                    globalThis.__redisClient = null;
                    console.error("[DEV] Error creating global Redis client:", error);
                });
        }
        // If client is ready, return it
        if (globalThis.__redisClient && globalThis.__redisClient.isReady) {
            console.log("[DEV] Global Redis client is ready.");
            return globalThis.__redisClient;
        }

        // If connection is lost, reconnect
        console.log("[DEV] Returning existing global Redis client promise (awaiting connection)");
        return globalThis.__redisClientPromise;
    }
    // Handle production environment
    if (!redisClient) {
        console.log("[PROD] Creating Redis client in production mode...");
        connectPromise = createAndConnectRedisClient();
        connectPromise
            .then((client) => {
                redisClient = client;
                console.log("[PROD] Redis client ready.");
            })
            .catch((error) => {
                connectPromise = null;
                redisClient = null;
                console.error("[PROD] Error creating Redis client:", error);
            })

    }

    // If client is ready, return it
    if (redisClient && redisClient.isReady) {
        console.log("[PROD] Returning existing Redis client.");
        return redisClient;
    }

    // If connection is not complete, return the pending promise
    // The caller will `await` this promise
    console.log("[PROD] Returning existing Redis client promise (awaiting connection)");
    return connectPromise as Promise<RedisClientType>;
}

// Disconnect the Redis client connection
export async function disconnectRedisClient() {
    const clientToDisconnect = process.env.NODE_ENV === "development"? globalThis.__redisClient : redisClient;
    if (clientToDisconnect && clientToDisconnect.isOpen) {
        console.log("Disconnecting Redis client...");
        await clientToDisconnect.quit().catch((error) => {
            console.error("Error disconnecting Redis client:", error);
        });
        if(process.env.NODE_ENV === "development") {
            globalThis.__redisClient = null;
            globalThis.__redisClientPromise = null;
        }else{
            redisClient = null;
            connectPromise = null;
        }
        console.log("Redis client disconnected.");
    }else{
        console.log("No active Redis client connection to disconnect.");
    }
}


