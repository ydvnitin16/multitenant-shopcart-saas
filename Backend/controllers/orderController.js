import Order from '../models/order.js';
import Product from '../models/product.js';

// User place order -> save in the DB
const placeOrder = async (req, res) => {
    const { items, address, paymentMethod } = req.body;

    try {
        let totalPrice = 0;
        const validatedItems = [];

        for (const item of items) {
            console.log(item);
            const product = await Product.findById(item.productId);

            if (!product)
                return res.status(400).json({ message: 'Product not found' });

            if (!product.inStock)
                return res
                    .status(400)
                    .json({ message: 'Product Out of Stock' });

            const quantity = item.quantity;
            if (quantity < 1)
                return res.status(400).json({
                    message: `Invalid quantity for product ${product.name}`,
                });

            totalPrice += product.price * quantity;

            validatedItems.push({
                product: {
                    _id: product._id,
                    name: product.name,
                    description: product.description,
                    image: product.image,
                    price: product.price,
                },
                quantity,
            });
        }

        const order = await Order({
            userId: req.user.id,
            items: validatedItems,
            address,
            totalPrice,
            paymentMethod,
        });

        await order.save();
        res.status(200).json({ message: 'Order Placed' });
    } catch (error) {
        res.status(500).json({
            message: 'Server error, please try again later.',
        });
    }
};

// User history to check order -> get orders for that user
const userOrders = async (req, res) => {
    const { id } = req.user;
    try {
        const orders = await Order.find({ userId: id });
        if (!orders) return res.status(404).json({ message: 'No Orders' });

        res.status(200).json({ message: 'Your Orders', orders });
    } catch (error) {
        res.status(500).json({
            message: 'Server error, please try again later.',
        });
    }
};

// Admin -> get all orders to manage
const allOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email');

        if (!orders) return res.status(404).json({ message: 'No Orders' });

        res.status(200).json({ message: 'User Orders', orders });
    } catch (error) {
        res.status(500).json({
            message: 'Server error, please try again later.',
        });
    }
};

// Admin -> Updates status of delivery
const updateStatus = async (req, res) => {
    const { id } = req.params;
    const allowedStatus = [
        'pending',
        'shipped',
        'out for delivery',
        'delivered',
    ];
    const { status } = req.body;
    try {
        const order = await Order.findById(id);
        console.log(order.items[0].product._id);
        if (!order)
            return res.status(404).json({
                message: 'Order not found',
            });

        if (!allowedStatus.includes(status))
            return res.status(404).json({
                message: 'Please select valid status',
            });

        if (status === 'delivered') {
            for (let item of order.items) {
                try {
                    const id = item.product._id;
                    const product = await Product.findById(id);
                    product.itemSold = product.itemSold + item.quantity;
                    product.save();
                } catch (error) {
                    res.status(500).json({
                        message: 'Server error, please try again later.',
                    });
                }
            }
        }

        order.status = status;
        await order.save();
        res.status(200).json({ message: 'Status Updated' });
    } catch (error) {
        res.status(500).json({
            message: 'Server error, please try again later.',
        });
    }
};

export { placeOrder, userOrders, allOrders, updateStatus };
