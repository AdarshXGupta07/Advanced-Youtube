import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose,{isValidObjectId, Mongoose} from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Subscription } from "../models/subscriptions.models.js";
const toggleSubscription=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    const userId=req.user._id;
    if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
    }
    const existingUser=Subscription.findOne({
        subscriber:userId,
        channel:channelId
    })
    if(existingUser){
        await Subscription.findByIdAndDelete(existingUser._id);
        return res.
        status(200).
        json(ApiResponse(200,null,"unsubscibed successfully"));
    }
    const newSub=await Subscription.create({
        subscriber:userId,
        channel:channelId
    });
    return res.
    status(200).
    json(ApiResponse(200,newSub,"Subscribed successfully"))
});
const getChannelSubscribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    const userId=req.user._id;
    if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
    }
    const subscribers=Subscription.aggregate([
        {
            $match:Mongoose.Types.ObjectId(channelId)
        },
        {
            $lookup:{
                from:"users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
                pipeline:[{
                    $project:{
                         username: 1,   // include username
                         fullName: 1,   // include fullName
                         avatar: 1,     // include avatar
                         email: 0  
                    }
                }]
            }
        },
        {
            $addFields: {
            subscribersCount: {
                 $cond: {
                     if: { $isArray: "$subscribers" },  // check if subscribers is an array
                     then: { $size: "$subscribers" },   // if yes, get its size
                     else: 0                            // else count is 0
    }
  }
}
        },
        {
            $project:{
                _id: 0,
                subscriberId: "$subscriberDetails._id",
                username: "$subscriberDetails.username",
                fullName: "$subscriberDetails.fullName",
                avatar: "$subscriberDetails.avatar"
            }
        }
    ])
    return res.
    status(200).
    json(ApiResponse(200,subscribersCount,"Subscriber fetched Successfully"));
});
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!mongoose.isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const userSubscribers = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "usersubscriber",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                usersubscriberCount: {
                    $cond: {
                        if: { $isArray: "$usersubscriber" },
                        then: { $size: "$usersubscriber" },
                        else: 0
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                channelId: "$usersubscriber._id",
                username: "$usersubscriber.username",
                fullName: "$usersubscriber.fullName",
                avatar: "$usersubscriber.avatar"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, userSubscribers, "Subscribed channels fetched successfully")
    );
});
export {
    toggleSubscription,
    getChannelSubscribers,
    getSubscribedChannels
}