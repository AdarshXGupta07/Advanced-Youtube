import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId, Mongoose} from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Comment } from "../models/comments.models.js";
import {Video} from "../models/video.models.js"
const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const comments = await Comment.find({ video: videoId })
        .populate("owner", "username fullName avatar")  // only select needed fields

    return res.status(200).json(
        new ApiResponse(200, comments, "Video comments fetched successfully")
    );
});

const addComment=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const {content}=req.body;
    const userId=req.user._id;
    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }

    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "Video not found"); 
    }
    const newComment=await Comment.create({
        video: videoId,
        owner: userId,
        content: content
    });

    return res.
    status(200).
    json(new ApiResponse(200,newComment,"Comment done successfully"))
});

const updateComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const {content}=req.body;
    const userId=req.user._id;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Content is required");
    }
    const comment=await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400, "Comment not found"); 
    }
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }
    comment.content=content;
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
    


});

const deleteComment=asyncHandler(async(req,res)=>{
    const {commentId}=req.params;
    const userId=req.user._id;
    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }
    const comment=await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400, "Comment not found");
    }
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this comment");
    }
    await comment.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
});






















export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }