import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId} from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Like } from "../models/likes.models.js";
const getLikedVideos=asyncHandler(async(req,res)=>{
    const userId=req._id;
    const likedVideos=Like.findOne({likedBy:userId})
    .populate("video");
    return res.
    status(200).
    json(ApiResponse(200,likedVideos,"All videos fetched properly"))
});
const toggleVideoLike=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {videoId}=req.params;
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
        }
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
        }
    const existingLike=Video.findOne({
        video:videoId,
        likedBy:userId
    });
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res.
        status(200).
        json(ApiResponse(200,null,"Disliked Successfully"));
    }
    const newLike=await Like.create({
        video:videoId,
        likedBy:userId
    })
    return res.status(200).json(
        new ApiResponse(200, null, "Video liked successfully")
    );
});
const toggleTweetLike=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {tweetId}=req.params;
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
        }
    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
        }
    const existingLike=Video.findOne({
        tweet:tweetId,
        likedBy:userId
    });
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res.
        status(200).
        json(ApiResponse(200,null,"Disliked Successfully"));
    }
    const newLike=await Like.create({
         tweet:tweetId,
        likedBy:userId
    })
    return res.status(200).json(
        new ApiResponse(200, null, "Video liked successfully")
    );
});
const toggleCommentLike=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {comment}=req.params;
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
        }
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
        }
    const existingLike=Video.findOne({
        comment:commentId,
        likedBy:userId
    });
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        return res.
        status(200).
        json(ApiResponse(200,null,"Disliked Successfully"));
    }
    const newLike=await Like.create({
        comment:commentId,
        likedBy:userId
    })
    return res.status(200).json(
        new ApiResponse(200, null, "Video liked successfully")
    );
});













export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
