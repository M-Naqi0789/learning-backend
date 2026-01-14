import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Database Connected Successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/auth', userRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});