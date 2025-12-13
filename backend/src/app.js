import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use( express.urlencoded({ extended: true }) );

// Import all routes
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import healthRoutes from "./routes/healthcheckup.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

// Route declarations
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/likes", likesRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/playlists", playlistRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

export default app;