import { createClient } from "redis";

let client = null;
let isConnected = false;

const isRedisEnabled = () => process.env.REDIS_ENABLED !== "false";

export const connectRedis = async () => {
    if (!isRedisEnabled()) {
        console.log("Redis caching disabled via REDIS_ENABLED=false");
        return null;
    }

    try {
        const host = process.env.REDIS_HOST || "127.0.0.1";
        const port = parseInt(process.env.REDIS_PORT || "6379", 10);
        const password = process.env.REDIS_PASSWORD || undefined;

        client = createClient({
            socket: {
                host,
                port,
                connectTimeout: 5000,
                reconnectStrategy: (retries) => {
                    if (retries >= 3) {
                        return false;
                    }
                    return Math.min(retries * 200, 1000);
                },
            },
            password,
        });

        client.on("error", (err) => {
            console.error("Redis client error:", err.message);
            isConnected = false;
        });

        const connectTimeoutMs = parseInt(process.env.REDIS_CONNECT_TIMEOUT || "5000", 10);

        await Promise.race([
            client.connect(),
            new Promise((_, reject) =>
                setTimeout(
                    () => reject(new Error(`Redis connection timed out after ${connectTimeoutMs}ms`)),
                    connectTimeoutMs
                )
            ),
        ]);
        isConnected = true;
        console.log(`Redis connected at ${host}:${port}`);
        return client;
    } catch (err) {
        console.error("Redis connection failed, continuing without cache:", err.message);
        try {
            if (client?.isOpen) {
                await client.quit();
            }
        } catch {
            // Client may already be closed after a failed connect attempt.
        }
        client = null;
        isConnected = false;
        return null;
    }
};

export const getRedisClient = () => client;

export const isRedisConnected = () =>
    Boolean(isRedisEnabled() && isConnected && client?.isOpen);

export const disconnectRedis = async () => {
    if (client?.isOpen) {
        await client.quit();
    }
    client = null;
    isConnected = false;
};
