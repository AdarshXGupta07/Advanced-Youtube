import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { upload } from '../middlewares/multer.middlewares.js';
const register=asyncHandler(async (req, res) => {
    // 1.Take input data from req.body
    // 2.validation if the data is not empty
    //3.check if user already exists with the same email
    //4 .check for images and avatar
    //5.upload them into cloudinary
    //6.save user into the database
    //7.remove password and refresh token from the user object
    //8.send response to the client
    const {username,email,password}=req.body;//1.
    if([username,fullName,email,password].some((field)=>field.trim()==="")){//2.
        throw new ApiError(400,"All fields are required");
    }
    const existingUser=await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(existingUser){//3.
        throw new ApiError(409,"User already exists with the same email or username");
    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path;
    const coverImageLocalPath=req.files?.coverImage?.[0]?.path;
    if(!avatarLocalPath){//4.
        throw new ApiError(400,"Avatar image is required");
    }
    const avatar=await uploadToCloudinary(avatarLocalPath);//5.
    const coverImage=await uploadToCloudinary(coverImageLocalPath);//5.
    const newUser = new User({
        username:username.toLowerCase(),
        fullName,
        email,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url
    });
    const createdUser=await newUser.select("-password -refreshToken");
    if(!createdUser){//6.
        throw new ApiError(500,"Failed to create user");
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    })
    




export {register};