import bcrypt from "bcrypt";
import { createUserService, getUserService } from "../services/auth.service.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import ApiSuccess from "../utils/apiSuccess.js";
import ApiError from "../utils/apiError.js";

// Register User
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const hashPwd = await bcrypt.hash(password, 10);
    const user = await createUserService({
        name,
        email,
        password: hashPwd,
    });

    generateTokenAndSetCookie(res, user);

    ApiSuccess(res, 201, "User registered successfully", {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || null,
        },
    });
};

// Login User
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await getUserService({ email });
    console.log(user)
    if (!user) throw new ApiError(404, "Invalid Credentials");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new ApiError(404, "Invalid Credentials");
    generateTokenAndSetCookie(res, user);

    ApiSuccess(res, 201, "User Logged successfully", {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || null,
        },
    });
};

// Logout User
export const logoutUser = (req, res) => {
    res.clearCookie("authHeader");
    ApiSuccess(res, 200, "Logout successfull");
};
