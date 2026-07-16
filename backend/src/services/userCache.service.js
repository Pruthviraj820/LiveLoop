import { getRedisClient, isRedisConnected } from "../config/redis.config.js";
import { User } from "../models/user.model.js";

const DEFAULT_TTL = 300;

const getCacheTtl = () => {
    const ttl = parseInt(process.env.REDIS_TTL || String(DEFAULT_TTL), 10);
    return Number.isFinite(ttl) && ttl > 0 ? ttl : DEFAULT_TTL;
};

const cacheKeys = {
    byUsername: (username) => `user:username:${username}`,
    byToken: (token) => `user:token:${token}`,
};

const serializeUser = (user) => {
    const plainUser = user?.toObject ? user.toObject() : user;
    return JSON.stringify(plainUser);
};

const deserializeUser = (cachedValue) => {
    const plainUser = JSON.parse(cachedValue);
    return User.hydrate(plainUser);
};

const logCacheEvent = (event, key) => {
    console.log(`[UserCache] ${event} key=${key}`);
};

const cacheGet = async (key) => {
    try {
        if (!isRedisConnected()) {
            return null;
        }

        const cachedValue = await getRedisClient().get(key);

        if (cachedValue) {
            logCacheEvent("HIT", key);
            return cachedValue;
        }

        logCacheEvent("MISS", key);
        return null;
    } catch (err) {
        console.error(`[UserCache] GET error for key=${key}:`, err.message);
        return null;
    }
};

const cacheSet = async (key, user) => {
    try {
        if (!isRedisConnected() || !user) {
            return;
        }

        await getRedisClient().setEx(key, getCacheTtl(), serializeUser(user));
    } catch (err) {
        console.error(`[UserCache] SET error for key=${key}:`, err.message);
    }
};

export const invalidateUserCache = async (username, token) => {
    try {
        if (!isRedisConnected()) {
            return;
        }

        const keysToDelete = [cacheKeys.byUsername(username)];

        if (token) {
            keysToDelete.push(cacheKeys.byToken(token));
        }

        await getRedisClient().del(keysToDelete);
        logCacheEvent("INVALIDATE", keysToDelete.join(", "));
    } catch (err) {
        console.error("[UserCache] INVALIDATE error:", err.message);
    }
};

const storeUserInCache = async (user) => {
    if (!user) {
        return;
    }

    await cacheSet(cacheKeys.byUsername(user.username), user);

    if (user.token) {
        await cacheSet(cacheKeys.byToken(user.token), user);
    }
};

export const findUserByUsername = async (username) => {
    const key = cacheKeys.byUsername(username);
    const cachedValue = await cacheGet(key);

    if (cachedValue) {
        return deserializeUser(cachedValue);
    }

    const user = await User.findOne({ username });
    await storeUserInCache(user);
    return user;
};

export const findUserByToken = async (token) => {
    const key = cacheKeys.byToken(token);
    const cachedValue = await cacheGet(key);

    if (cachedValue) {
        return deserializeUser(cachedValue);
    }

    const user = await User.findOne({ token });
    await storeUserInCache(user);
    return user;
};
