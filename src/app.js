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
import userRoutes from "./routes/user.routes.js";
app.use("/users", userRoutes);
export default app;