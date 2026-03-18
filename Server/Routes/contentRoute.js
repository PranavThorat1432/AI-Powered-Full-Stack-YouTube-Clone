import express from 'express';
import { isAuth } from '../Middlewares/isAuth.js';
import upload from '../Middlewares/multer.js';
import { addComment, addReply, createVideo, deleteVideo, fetchVideos, getAllVideos, getLikedVideos, getSavedVideos, getViews, toggleDislikes, toggleLikes, toggleSave, updateVideo } from '../Controllers/videoController.js';
import { createShort, getAllShorts, addComment1, addReply1, getViews1, toggleDislikes1, toggleLikes1, toggleSave1, getLikedShorts, getSavedShorts, fetchShorts, updateShort, deleteShort } from '../Controllers/shortController.js';
import { createPlaylist, deletePlaylist, fetchPlaylists, getSavedPlaylists, toggleSavePlaylist, updatePlaylist } from '../Controllers/playlistController.js';
import { addCommentForPost, addReplyForPost, createPost, deletePost, getAllPosts, likePost } from '../Controllers/postController.js';
import { filterCategoryWithAi, searchWithAI } from '../Controllers/aiController.js';


const contentRouter = express.Router();

// For Uploading Videos
contentRouter.post('/create-video', isAuth, upload.fields([
    {name: 'video', maxCount: 1},
    {name: 'thumbnail', maxCount: 1}
]), createVideo);
contentRouter.get('/get-videos', isAuth, getAllVideos);
contentRouter.get('/videos/public', getAllVideos);
contentRouter.put('/video/:videoId/toggle-like', isAuth, toggleLikes);
contentRouter.put('/video/:videoId/toggle-dislike', isAuth, toggleDislikes);
contentRouter.put('/video/:videoId/toggle-save', isAuth, toggleSave);
contentRouter.put('/video/:videoId/add-view', getViews);
contentRouter.post('/video/:videoId/add-comment', isAuth, addComment);
contentRouter.post('/video/:videoId/add-reply/:commentId', isAuth, addReply);
contentRouter.get('/liked-videos', isAuth, getLikedVideos);
contentRouter.get('/saved-videos', isAuth, getSavedVideos);
contentRouter.get('/fetch-videos/:videoId', isAuth, fetchVideos);
contentRouter.post('/update-video/:videoId', isAuth, upload.single('thumbnail'), updateVideo);
contentRouter.delete('/delete-video/:videoId', isAuth, deleteVideo);


// For Uploading Shorts
contentRouter.post('/create-short', isAuth, upload.single('shortUrl'), createShort);
contentRouter.get('/get-shorts', isAuth, getAllShorts);
contentRouter.get('/shorts/public', getAllShorts);
contentRouter.put('/short/:shortId/toggle-like', isAuth, toggleLikes1);
contentRouter.put('/short/:shortId/toggle-dislike', isAuth, toggleDislikes1);
contentRouter.put('/short/:shortId/toggle-save', isAuth, toggleSave1);
contentRouter.put('/short/:shortId/add-view', getViews1);
contentRouter.post('/short/:shortId/add-comment', isAuth, addComment1);
contentRouter.post('/short/:shortId/add-reply/:commentId', isAuth, addReply1)
contentRouter.get('/liked-shorts', isAuth, getLikedShorts);
contentRouter.get('/saved-shorts', isAuth, getSavedShorts);
contentRouter.get('/fetch-shorts/:shortId', isAuth, fetchShorts);
contentRouter.post('/update-short/:shortId', isAuth, updateShort);
contentRouter.delete('/delete-short/:shortId', isAuth, deleteShort);


// Playlist Routes
contentRouter.post('/create-playlist', isAuth, createPlaylist);
contentRouter.post('/save-playlist', isAuth, toggleSavePlaylist);
contentRouter.get('/get-saved-playlists', isAuth, getSavedPlaylists);
contentRouter.get('/fetch-playlists/:playlistId', isAuth, fetchPlaylists);
contentRouter.post('/update-playlist/:playlistId', isAuth, updatePlaylist);
contentRouter.delete('/delete-playlist/:playlistId', isAuth, deletePlaylist);


// Post Routes
contentRouter.post('/create-post', isAuth, upload.single('image'), createPost);
contentRouter.get('/get-posts', isAuth, getAllPosts);
contentRouter.post('/post/toggle-like', isAuth, likePost);
contentRouter.post('/post/add-comment', isAuth, addCommentForPost);
contentRouter.post('/post/add-reply', isAuth, addReplyForPost);
contentRouter.delete('/delete-post/:postId', isAuth, deletePost);


// AI Routes
contentRouter.post('/search', isAuth, searchWithAI);
contentRouter.post('/filter', isAuth, filterCategoryWithAi);


export default contentRouter;   