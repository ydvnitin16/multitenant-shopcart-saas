export const errorHandler = (err, req, res, next) => {
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    console.error(message);
    return res.status(status).json({ success: false, message });
};
