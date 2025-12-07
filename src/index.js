import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/index.js';

dotenv.config({
    path: './.env'  // Fixed path to include the dot
});

const PORT = process.env.PORT || 8000;

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    });
