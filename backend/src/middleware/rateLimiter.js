import { rateLimit } from "express-rate-limit";

const rateLimitResponse = (message) => (req, res) => {
    res.status(429).json({ message });
};

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitResponse("Too many requests from this IP, please try again after 15 minutes."),
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitResponse("Too many login attempts from this IP, please try again after 15 minutes."),
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitResponse("Too many registration attempts from this IP, please try again after 1 hour."),
});
