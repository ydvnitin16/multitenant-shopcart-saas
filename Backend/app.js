import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/database.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import stripeRoutes from "./routes/stripe.routes.js";
import { stripeWebhookHandler } from "./controllers/stripe.controller.js";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

const app = express();
dotenv.config();
connectDB();

app.use(morgan("dev"));
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    }),
);

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 5,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    },
});
const generalLimiter = rateLimit({
    windowMs: 1000 * 60 * 15,
    max: 100,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many requests. Please try again later.",
        });
    },
});

// Rate limiters
app.use("/api", generalLimiter);
app.use("/api/auth", authLimiter);

// Raw request of stripe webhook
app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookHandler,
);

// Global Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// NoSQL Sanitization
app.use((req, res, next) => {
    if (req.body) req.body = mongoSanitize.sanitize(req.body);
    if (req.params) req.params = mongoSanitize.sanitize(req.params);
    next();
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", stripeRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
