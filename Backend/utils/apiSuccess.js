const ApiSuccess = (res, statusCode, msg, ...dataParts) => {
    const status = statusCode || 200;
    const message = msg || 'request succeed';

    const data = Object.assign({}, ...dataParts);

    return res.status(status).json({ success: true, message, ...data });
};

export default ApiSuccess;
