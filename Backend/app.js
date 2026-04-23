import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/database.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/auth.routes.js';
import storeRoutes from './routes/store.routes.js'
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import addressRoutes from './routes/address.routes.js';
import { errorHandler } from './middlewares/error.middlewares.js';

const app = express();
dotenv.config();
connectDB();

// Global Middlewares
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', userRoutes);
app.use('/stores', storeRoutes)
app.use('/', productRoutes);
app.use('/admin', adminRoutes);
app.use('/orders', orderRoutes);
app.use('/addresses', addressRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
