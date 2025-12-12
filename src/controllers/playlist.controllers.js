import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId, Mongoose} from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import {Playlist} from "../models/playlist.models.js"
const createPlaylist=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {name,video,description}=req.body;
    if (!mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID");
    }
    if(!name && name.trim()===""){
        throw new ApiError(400, "Name is required");
    }
    const newPlaylist=Pla
});
const getUserPlaylists=asyncHandler(async(req,res)=>{

});
const getPlaylistById=asyncHandler(async(req,res)=>{

});
const addVideoToPlaylist=asyncHandler(async(req,res)=>{

});
const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{

});
const updatePlaylist=asyncHandler(async(req,res)=>{

});
const deletePlaylist=asyncHandler(async(req,res)=>{

});



















export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}