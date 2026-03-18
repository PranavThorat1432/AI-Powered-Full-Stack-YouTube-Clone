import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './Config/mongoDB.js';
import authRouter from './Routes/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './Routes/userRoute.js';
import contentRouter from './Routes/contentRoute.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Server is running...');
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/content', contentRouter);


app.listen(PORT, () => {
    console.log(`Server is listening on port: http://localhost:${PORT}`);
    connectDB();
});