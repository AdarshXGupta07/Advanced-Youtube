import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { User } from '../models/user.models.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const register = asyncHandler(async (req, res, next) => {
    // 1. Take input data from req.body
    const { username, email, password, fullName } = req.body;

    // 2. Validate required fields
    if (!username || !email || !password || !fullName) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists with the same email or username");
    }

    // 4. Check for avatar file
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // 5. Upload files to Cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    if (!avatar || !avatar.url) {
        throw new Error("Failed to upload avatar to Cloudinary");
    }

    // Upload cover image if provided
    let coverImage;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (coverImageLocalPath) {
        coverImage = await uploadToCloudinary(coverImageLocalPath);
    }

    // 6. Create user in database
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    });

    // 7. Remove sensitive data from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user");
    }

    // 8. Send success response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export { register };