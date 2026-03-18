import express from 'express';
import { addHistory, createChannel, getAllChannelsData, getChannelData, getCurrentUser, getHistory, getRecommendedContent, getSubscribedData, toggleSubscribe, updateChannel } from '../Controllers/userController.js';
import { isAuth } from '../Middlewares/isAuth.js';
import upload from '../Middlewares/multer.js';


const userRouter = express.Router();


userRouter.get('/get-user', isAuth, getCurrentUser);

userRouter.post('/create-channel', isAuth, upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'banner', maxCount: 1},
]), createChannel);

userRouter.get('/get-channel', isAuth, getChannelData);

userRouter.post('/update-channel', isAuth, upload.fields([
    {name: 'avatar', maxCount: 1},
    {name: 'banner', maxCount: 1},
]), updateChannel);

userRouter.post('/toggle-subscribe', isAuth, toggleSubscribe);
userRouter.get('/all-channels', isAuth, getAllChannelsData);
userRouter.get('/get-subscribed-data', isAuth, getSubscribedData); 
userRouter.post('/add-history', isAuth, addHistory);
userRouter.get('/get-history', isAuth, getHistory);
userRouter.get('/recommendation', isAuth, getRecommendedContent);


export default userRouter;