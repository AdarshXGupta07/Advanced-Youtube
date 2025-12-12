import jwt from "jsonwebtoken";
const { verify } = jwt;
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "You are not logged in. Please log in to access this resource.");
    }
    try {
        const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "The user belonging to this token no longer exists.");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid token. Please log in again.");
    }
});
