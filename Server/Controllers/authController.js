import uploadOnCloudinary from "../Config/cloudinary.js";
import User from "../Models/userModel.js";
import validator from 'validator';
import bcrypt from 'bcryptjs';
import genToken from "../Config/token.js";
import sendMail from "../Config/sendMail.js";


export const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        let photoUrl;
        if(req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path);
        }

        const existUser = await User.findOne({email});
        if(existUser) {
            return res.status(400).json({
                message: 'User already exists!'
            });
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({
                message: 'Invalid email!'
            });
        }

        if(password?.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters!'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            userName,
            email,
            password: hashPassword,
            photoUrl
        });

        const token = await genToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `Signup Error: ${error}`
        });
    }
};


export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: 'User not found!'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                message: 'Invalid Credentials!'
            });
        }

        const token = await genToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `SignIn Error: ${error}`
        });
    }
};


export const signOut = async (req, res) => {
    try {
        await res.clearCookie('token');

        return res.status(200).json({
            message: 'Logged Out!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `SignIn Error: ${error}`
        });
    }
};


export const googleAuth = async (req, res) => {
    try {
        const { userName, email, photoUrl } = req.body;
        let googlePhoto = photoUrl;
        
        // Only try to upload to Cloudinary if it's a local file path
        if (photoUrl && !photoUrl.startsWith('http')) {
            try {
                googlePhoto = await uploadOnCloudinary(photoUrl);
            } catch (error) {
                console.log('Cloudinary Upload Failed: ', error);
            }
        }

        // Generate a random password for Google-authenticated users
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const user = await User.findOne({email});
        if(!user) {
            await User.create({
                userName,
                email,
                password: hashedPassword,
                photoUrl: googlePhoto
            });
        } else {
            if(user?.photoUrl !== googlePhoto) {
                user.photoUrl = googlePhoto;
                await user.save();
            }
        }

        const token = await genToken(user?._id);
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `Google-Auth Error: ${error}`
        });
    }
};


export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                message: 'User not found!'
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        user.resetOTP = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();

        await sendMail(email, otp)

        return res.status(200).json({
            message: 'OTP Send Successfully!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Send OTP Error: ${error}`
        });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({email});
        if(!user || user.resetOTP != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: 'Invalid OTP!'
            });
        }

        user.resetOTP = undefined;
        user.otpExpires = undefined;
        user.isOtpVerified = true;

        await user.save();

        return res.status(200).json({
            message: 'OTP Verified Successfully!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Verify OTP Error: ${error}`
        });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user || !user.isOtpVerified) {
            return res.status(400).json({
                message: 'OTP not verified!'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.isOtpVerified = false;

        await user.save();

        return res.status(200).json({
            message: 'Password Resets Successfully!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Reset Password Error: ${error}`
        });
    }
};