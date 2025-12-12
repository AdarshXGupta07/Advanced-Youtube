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

    const video=Video.findById(videoId);
    if(!video){
        throw new ApiError(400, "Video not found ");throw 
    }
    const newComment=Comment.create({
        video: videoId,
        owner: userId,
        content: content
    });

    return res.
    status(200).
    json(200,newComment,"Comment done successfully")
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
    const comment=Video.findById(commentId);
    if(!comment){
        throw new ApiError(400, "Video not found ");throw 
    }
    if (comment.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this comment");
    }
    Comment.content=content;
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
    


});

const deleteComment=asyncHandler(async(req,res)=>{

});






















export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }