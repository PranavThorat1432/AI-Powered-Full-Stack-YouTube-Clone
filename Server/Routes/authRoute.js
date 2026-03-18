import express from 'express';
import { googleAuth, resetPassword, sendOTP, signIn, signOut, signUp, verifyOTP } from '../Controllers/authController.js';
import upload from '../Middlewares/multer.js';

const authRouter = express.Router();


authRouter.post('/signup', upload.single('photoUrl'), signUp);
authRouter.post('/signin', signIn);
authRouter.get('/signout', signOut);
authRouter.post('/google-auth', upload.single('photoUrl'), googleAuth);

authRouter.post('/send-otp', sendOTP);
authRouter.post('/verify-otp', verifyOTP);
authRouter.post('/reset-password', resetPassword);

export default authRouter;