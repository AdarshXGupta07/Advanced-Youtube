import mongoose,{isValidObjectId, Mongoose} from "mongoose";
import { Video } from "../models/Video.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/User.js";
import {ApiResponse} from "../utils/ApiResponse.js";   
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {v2 as cloudinary} from "cloudinary"
const getAllVideos = asyncHandler(async (req, res) => {
    const {page=1,limit=10,query,sortBy,sortType,userId}=req.query;
    if(userId && !isValidObjectId(userId)){
        throw new ApiError(400,'Invalid userId');
    }
    const matchStage={isPublished:true};
    if(query){
        const regex=new RegExp(query,'i');
        matchStage.$or=[
            {title:{$regex:regex}},
            {description:{$regex:regex}}
        ];
    }
    const sortOrder=sortType==='desc'?-1:1;
    const video=Video.aggregate(
        [
            {
                $match:matchStage
            },
            {
                $lookup:{
                    from:'users',
                    localField:'owner',
                    foreignField:'_id',
                    as:'ownerDetails',
                    pipeline:[
                        {
                            $project:{
                                username:1,
                                email:1,
                                thumbnail:1
                            }   
                        }
                    ]
                }
            },
            {
                $unwind:'$ownerDetails',
                preserveNullAndEmptyArrays:true
            },
            {
                [sortBy]:{sortOrder}
            },
            {
                $skip:(Number(page) - 1) * Number(limit),
            },
            {
                $paginate:{
                    Number:limit
                }
            },
            {
                $project:{
                videoFile:1,
                thumbnail:1,
                title:1,
                description:1,
                views:1,
                owner:'$ownerDetails',
                createdAt:1,
                updatedAt:1
            }
        }
        ]
    );
    return res.
    status(200).
    json(new ApiResponse(200,'Videos fetched successfully',video));
    });
const PublishedVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;
  const videoId = req.params.videoId;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (title) video.title = title;
  if (description) video.description = description;
  if (typeof isPublished === "boolean") video.isPublished = isPublished;

  await video.save();

  // Upload to cloudinary if local path
  if (video.videoFile && !video.videoFile.startsWith("http")) {
    const cloudinaryResponse = await cloudinary.uploader.upload_large(video.videoFile, {
      resource_type: "video",
      folder: "videos",
    });

    video.videoFile = cloudinaryResponse.secure_url;
    video.videoFilePublicId = cloudinaryResponse.public_id; // <-- IMPORTANT
    await video.save();
  }

  const updatedVideo = await Video.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
      },
    },
    { $unwind: { path: "$owner", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        title: 1,
        description: 1,
        isPublished: 1,
        videoFile: 1,
        videoFilePublicId: 1,   // <-- OPTIONAL BUT USEFUL
        thumbnail: 1,
        owner: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, updatedVideo[0], "Video published successfully")
  );
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const videos = await Video.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          { $project: { username: 1, fullName: 1, avatar: 1 } },
        ],
      },
    },
    {
      $unwind: { path: "$owner", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        title: 1,
        description: 1,
        isPublished: 1,
        videoFile: 1,
        thumbnail: 1,
        owner: 1,
      },
    },
  ]);

  if (!videos.length) {
    return res.status(404).json(new ApiResponse(404, null, "Video not found"));
  }

  return res.status(200).json(new ApiResponse(200, videos[0], "Video found successfully"));
});
const upDateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    const {title,description,isPublished,thumbnail}=req.body;
    if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  // Find existing video
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  //use aggregate pipelines to perform updates
  if(title){
    video.title=title;
  }
  if(description){
    video.description=description;
  }
  if (typeof isPublished === "boolean") video.isPublished = isPublished;
  if(req.file?.thumbnail){
    const thumbupload=await uploadToCloudinary(req.file.thumbnail.path,
        {
            resource_type:"auto"
        }
    )
    video.thumbnail=thumbnail;
  }
  if(req.files?.videoFile){
    const videoupload=await uploadToCloudinary(req.file.video.videoFile,{
        resource_type:"video"
    })
  }
  video.videoFile=videoFile;
  await video.save();
  const updatedVideo=Video.aggregate([
     {
      $match: { _id: new mongoose.Types.ObjectId(videoId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          { $project: { username: 1, fullName: 1, avatar: 1 } },
        ],
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        title: 1,
        description: 1,
        isPublished: 1,
        videoFile: 1,
        thumbnail: 1,
        createdAt: 1,
        owner: 1,
      },
    },
  ]);
  return res.
  status(200).
  json(new ApiResponse(200,upDateVideo[0],"Video Updated Successfully"));
});
const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
    }

  // Find existing video
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  if (video.videoFilePublicId) {
    await cloudinary.uploader.destroy(video.videoFilePublicId, {
      resource_type: "video",
    });
  }

  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(
    new ApiResponse(200, null, "Video deleted successfully")
  );
});
const togglePublish=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
    }
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
     video.isPublished = !video.isPublished;

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, `Video has been ${video.isPublished ? "published" : "unpublished"}`)
  );
});

export {
getAllVideos,
PublishedVideo,
getVideoById,
upDateVideo,
deleteVideo,
togglePublish
};