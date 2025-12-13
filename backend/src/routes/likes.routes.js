import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/likes.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// 🛡 Apply JWT authentication to ALL routes
router.use(verifyJWT);

// 🔥 Toggle Like Routes
router.post("/toggle/v/:videoId", toggleVideoLike);
router.post("/toggle/c/:commentId", toggleCommentLike);
router.post("/toggle/t/:tweetId", toggleTweetLike);

// 🔥 Get Liked Videos
router.get("/videos", getLikedVideos);

export default router;
