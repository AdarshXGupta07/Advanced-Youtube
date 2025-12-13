import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId, Mongoose} from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import {Playlist} from "../models/playlist.models.js";
import {Video} from "../models/video.models.js";
const createPlaylist=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {name,video,description}=req.body;
    if (!mongoose.isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user ID");
    }
    if(!name && name.trim()===""){
        throw new ApiError(400, "Name is required");
    }
    let videoArray=[]
    if(videos){
        if(!Array.isArray(videos)){
            throw new ApiError(400,"Videos ID should be in array")
        }
        videoArray=videos;
    }

    const newPlaylist=await Playlist.create({
        name:name.trim(),
        videos:videoArray,
        owner:userId,
        description:description || ""
    })
    return res.
    status(200).
    json(new ApiResponse(200,newPlaylist,"Playlist created"));
});
const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Fetch playlists owned by user
    const playlists = await Playlist.find({ owner: userId })
        .populate("videos");

    return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched successfully")
    );
});
const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // Validate ID
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }

    // Fetch playlist with videos populated
    const playlist = await Playlist.findById(playlistId)
        .populate("videos");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist found successfully")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // 1. Check Playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // 2. Check Video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // 3. Check if video already in playlist
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in this playlist");
    }

    // 4. Push video to playlist
    playlist.videos.push(videoId);

    // 5. Save updated playlist
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist successfully")
    );
});

const removeVideoFromPlaylist=asyncHandler(async(req,res)=>{
    const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    // Validate IDs
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Check if video is in playlist
    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(404, "Video not found in playlist");
    }

    // Remove video from videos array
    playlist.videos.pull(videoId);

    // Save updated playlist
    await playlist.save();

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

});
const updatePlaylist=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {videos,description,name}=req.body;
    const {playlistId}=req.params;
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
    }
    const playlist=await findById(playlistId);
    if(!playlist){
        throw new ApiError(400, "Playlist doesn't exist");
    }
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }
    if(videos){
        playlist.videos=videos;
    }
    if(description){
        playlist.description=description;
    }
    if(name){
        playlist.name=name;
    }
    await playlist.save();
    return res.
    status(200).
    json(200,playlist,"Playlist is updated")

});
const deletePlaylist=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const {playlistId}=req.params;
    if (!mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID");
        const playlist=await findById(playlistId);
    }
    if(!playlist){
        throw new ApiError(400, "Playlist doesn't exist");
    }
    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    // 3. Delete playlist
    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
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