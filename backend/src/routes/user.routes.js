import { Router } from "express";
import { register, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getUserWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Register route with file upload middleware
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    register
);

// Login route
router.route("/login").post(loginUser);

// Logout route (protected)
router.route("/logout").post(verifyJWT, logoutUser);

// Refresh access token
router.route("/refresh-token").post(refreshAccessToken);

// Change current password (protected)
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// Get current user (protected)
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Update user details (protected)
router.route("/update-details").patch(verifyJWT, updateUserDetails);

// Update avatar (protected)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// Update cover image (protected)
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// Get user channel profile
router.route("/channel/:username").get(getUserChannelProfile);

// Get user watch history (protected)
router.route("/watch-history").get(verifyJWT, getUserWatchHistory);

export default router;
