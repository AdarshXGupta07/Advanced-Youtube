# YouTube Clone Backend API

A comprehensive backend API for a YouTube-like application built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Management**: Registration, Login, Authentication, Profile Management
- **Video Operations**: Upload, Update, Delete, Publish/Unpublish videos
- **Social Features**: Likes, Comments, Subscriptions
- **Playlists**: Create and manage video playlists
- **Tweets**: User tweet functionality
- **File Upload**: Cloudinary integration for media storage
- **Authentication**: JWT-based secure authentication

## 🛠 Tech Stack

- **Backend**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Password Hashing**: bcrypt
- **Validation**: Mongoose schemas

## 📁 Project Structure

```
src/
├── controllers/          # API controllers
│   ├── video.controllers.js
│   ├── user.controller.js
│   ├── subscription.controllers.js
│   ├── likes.controllers.js
│   ├── comment.controllers.js
│   ├── playlist.controllers.js
│   └── tweets.controllers.js
├── models/              # Mongoose models
│   ├── video.models.js
│   ├── user.models.js
│   ├── subscription.models.js
│   ├── likes.models.js
│   ├── comments.models.js
│   ├── playlist.models.js
│   └── tweet.models.js
├── routes/               # API routes
│   ├── video.routes.js
│   ├── user.routes.js
│   ├── subscription.routes.js
│   ├── likes.routes.js
│   ├── comments.routes.js
│   ├── playlist.routes.js
│   └── tweet.routes.js
├── middlewares/          # Custom middlewares
│   ├── auth.middlewares.js
│   └── multer.middlewares.js
├── utils/               # Utility functions
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
├── db/                  # Database connection
│   └── index.js
├── app.js               # Express app configuration
└── index.js             # Server entry point
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB
- Cloudinary account

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file with:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/youtube
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Server
```bash
npm run dev
```

Server will run on `http://localhost:8000`

## 📡 API Endpoints

### Authentication Routes (`/api/v1/users`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout (protected)
- `POST /refresh-token` - Refresh access token
- `POST /change-password` - Change password (protected)
- `GET /current-user` - Get current user (protected)
- `PATCH /update-details` - Update user details (protected)
- `PATCH /update-avatar` - Update avatar (protected)
- `PATCH /update-cover-image` - Update cover image (protected)
- `GET /channel/:username` - Get user channel profile
- `GET /watch-history` - Get watch history (protected)

### Video Routes (`/api/v1/videos`) - All protected
- `GET /` - Get all videos with pagination and filtering
- `POST /` - Upload new video
- `GET /:videoId` - Get video by ID
- `PATCH /:videoId` - Update video details
- `DELETE /:videoId` - Delete video
- `PATCH /toggle/publish/:videoId` - Toggle publish status

### Subscription Routes (`/api/v1/subscriptions`) - All protected
- `POST /c/:channelId` - Toggle subscription to channel
- `GET /c/:channelId` - Get channel subscribers
- `GET /u/:subscriberId` - Get subscribed channels

### Like Routes (`/api/v1/likes`) - All protected
- `POST /toggle/v/:videoId` - Toggle video like
- `POST /toggle/c/:commentId` - Toggle comment like
- `POST /toggle/t/:tweetId` - Toggle tweet like
- `GET /videos` - Get liked videos

### Comment Routes (`/api/v1/comments`) - All protected
- `GET /:videoId` - Get video comments
- `POST /:videoId` - Add comment to video
- `PATCH /c/:commentId` - Update comment
- `DELETE /c/:commentId` - Delete comment

### Playlist Routes (`/api/v1/playlists`) - All protected
- `POST /` - Create new playlist
- `GET /:playlistId` - Get playlist by ID
- `PATCH /:playlistId` - Update playlist
- `DELETE /:playlistId` - Delete playlist
- `PATCH /add/:videoId/:playlistId` - Add video to playlist
- `PATCH /remove/:videoId/:playlistId` - Remove video from playlist
- `GET /user/:userId` - Get user playlists

### Tweet Routes (`/api/v1/tweets`) - All protected
- `POST /` - Create new tweet
- `GET /user/:userId` - Get user tweets
- `PATCH /:tweetId` - Update tweet
- `DELETE /:tweetId` - Delete tweet

## 🔐 Authentication

All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": [ ... ]
}
```

## 🧪 Error Handling

The API uses centralized error handling with:
- **Validation Errors**: 400 Bad Request
- **Authentication Errors**: 401 Unauthorized
- **Authorization Errors**: 403 Forbidden
- **Not Found Errors**: 404 Not Found
- **Server Errors**: 500 Internal Server Error

## 📊 Database Models

### User Model
- username, email, fullName (unique)
- avatar, coverImage
- watchHistory (array of video references)
- password (hashed), refreshToken

### Video Model
- videoFile, thumbnail, title, description
- owner (user reference), views, isPublished
- videoFilePublicId (for Cloudinary)

### Like Model
- video, comment, tweet references
- likedBy (user reference)

### Comment Model
- content, video, owner (user reference)

### Subscription Model
- subscriber, channel (user references)

### Playlist Model
- name, description, videos (array)
- owner (user reference)

### Tweet Model
- content, owner (user reference)

## 🚀 Deployment

### Environment Setup
1. Set up MongoDB database
2. Configure Cloudinary account
3. Set all environment variables
4. Install dependencies

### Production Deployment
```bash
npm install
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For any issues or questions, please contact the development team.

---

**Built with ❤️ using Node.js, Express, and MongoDB**