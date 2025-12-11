import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import isPasswordCorrect from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { Subscription } from "../models/subscriptions.js";
const generateAccessAndRefereshTokens = async (userid) => {
  const user = await User.findById(userid);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
const register = asyncHandler(async (req, res, next) => {
  // 1. Take input data from req.body
  const { username, email, password, fullName } = req.body;

  // 2. Validate required fields
  if (!username || !email || !password || !fullName) {
    throw new ApiError(400, "All fields are required");
  }

  // 3. Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User already exists with the same email or username"
    );
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
    coverImage: coverImage?.url || "",
  });

  // 7. Remove sensitive data from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  // 8. Send success response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    throw new ApiError(400, "Username or email and password are required");
  }
  const user = await User.findOne($or, [{ email }, { username }]);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }
  const userData = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loginnedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});
export { register, loginUser };
const logoutUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: 1,
    },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});
const refreshAcessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.headers?.authorization?.replace("Bearer ", "");
  if (!incomingRefreshToken) {
    throw new ApiError(
      401,
      "Refresh token is missing. Please log in again to obtain a new access token."
    );
  }
  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(
      401,
      "Invalid refresh token. Please log in again to obtain a new access token."
    );
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
        },
        "Access token refreshed successfully"
      )
    );
});
const changecurrentPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
const updateUserDetails = asyncHandler(async (req, res, next) => {
  const { email, fullName } = req.body;
  if (!email && !fullName) {
    throw new ApiError(
      400,
      "At least one field (email or fullName) is required to update"
    );
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: { fullName, email: email },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details updated successfully"));
});
const updateUserAvatar = asyncHandler(async (req, res, next) => {
  const avatarLocalPath = req.files?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }
  const oldAvatar = req.user?.public_id;
  if (oldAvatar) {
    await cloudinary.uploader.destroy(oldAvatar);
  }
  const newavatar = await uploadToCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      avatar: newavatar.url,
      public_id: newavatar.public_id,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar updated successfully"));
});
const updateUserCoverImage = asyncHandler(async (req, res, next) => {
  const coverImageLocalPath = req.files?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }
  const oldcoverImage = req.user?.public_id;
  if (oldcoverImage) {
    await cloudinary.uploader.destroy(oldcoverImage);
  }
  const newcoverImage = await uploadToCloudinary(coverImageLocalPath);
  if (!newcoverImage) {
    throw new ApiError(500, "Failed to upload cover image");
  }
  const user = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      coverImage: newcoverImage.url,
      public_id: newcoverImage.public_id,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User cover image updated successfully"));
});
const getUserChannelProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params; //used for getting username from url
  const channel = await User.aggregate([
    {
      $match: { username: username.toLowerCase() },
    },
    {
      //subscribers to this channel
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      //kitne channels ko maine subscribe kiya hai
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        SubscribersCount: {
          $size: "$subscribersTo",
        },
        subscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $in: [req.user?._id || null, "$subscribers.subscriber"],
        },
        then: true,
        else: false,
      },
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        SubscribersCount: 1,
        subscribedToCount: 1,
        isSubscribed: 1,
      },
    },
  ]);
  if (!channel?.length) {
    throw new ApiError(404, "Channel not found");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channel[0],
        "User channel profile fetched successfully"
      )
    );
});
const getUserwatchHistory = asyncHandler(async (req, res, next) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
        $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
            pipeline:[
                {
                    lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    username:1,
                                    fullName:1,
                                    avatar:1
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(200, user[0].watchHistory, "User watch history fetched")
    );
});

export {
  register,
  loginUser,
  logoutUser,
  refreshAcessToken,
  changecurrentPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserwatchHistory,
};
