import uploadOnCloudinary from "../Config/cloudinary.js";
import Channel from "../Models/channelModel.js";
import Short from "../Models/shortModel.js";
import Video from "../Models/videoModel.js";


export const createVideo = async (req, res) => {
    try {
        const { title, description, tags, channelId } = req.body;
        if(!title || !req.files.video || !req.files.thumbnail || !channelId) {
            return res.status(400).json({
                message: 'Title, VideoUrl, Thumbnail, and ChannelId are required!'
            });
        } 

        const channelData = await Channel.findById(channelId);
        if(!channelData) {
            return res.status(404).json({
                message: 'Channel not found!'
            });
        }

        const uploadVideo = await uploadOnCloudinary(req.files.video[0].path);
        const uploadThumbnail = await uploadOnCloudinary(req.files.thumbnail[0].path);

        let parsedTag = [];
        if(tags) {
            try {
                parsedTag = JSON.parse(tags);
                
            } catch (error) {
                parsedTag = [];
            }
        }

        const newVideo = await Video.create({
            title,
            channel: channelData._id,
            description,
            tags: parsedTag,
            videoUrl: uploadVideo,
            thumbnail: uploadThumbnail 
        });

        await Channel.findByIdAndUpdate(channelData._id, {
            $push: {videos: newVideo._id},
            $new: true,
        }); 

        return res.status(201).json(newVideo);

    } catch (error) {
        return res.status(500).json({
            message: `Create-Video Error: ${error}`
        });
    } 
};


export const fetchVideos = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId)
        .populate('channel', 'name avatar')
        .populate('likes', 'userName photoUrl');

        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        return res.status(200).json(video);

    } catch (error) {
        return res.status(500).json({
            message: 'Fetch-Videos Error: ' + error
        });
    }
};

export const updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, description, tags } = req.body;

        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        if(title) {
            video.title = title;
        }
        if(description) {
            video.description = description;
        }

        if(tags) {
            try {
                video.tags = JSON.parse(tags);
            } catch (error) {
                video.tags = [];
            }
        }

        if(req.file) {
            const uploadedThumbnail = await uploadOnCloudinary(req.file.path);
            video.thumbnail = uploadedThumbnail;
        }

        await video.save();
        return res.status(200).json(video);


    } catch (error) {
        return res.status(500).json({
            message: 'Update-Video Error: ' + error
        });
    }
};


export const deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        // remove video reference from channel
        await Channel.findByIdAndUpdate(video.channel, {
            $pull: {videos: video._id}
        });

        // remove video
        await Video.findByIdAndDelete(videoId);

        return res.status(200).json({
            message: 'Video Deleted!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Delete-Video Error: ${error}`
        });
    }
};


export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().sort({createdAt: -1}).populate('channel comments.author comments.replies.author');
        if(!videos) {
            return res.status(404).json({
                message: 'No Video Found!'
            });
        }

        return res.status(200).json(videos);

    } catch (error) {
        return res.status(500).json({
            message: `Get-All-Videos Error: ${error}`
        });
    }
};


export const toggleLikes = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId;
        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }
        if(video.likes.includes(userId)) {
            video?.likes?.pull(userId);
            
        } else {
            video?.likes?.push(userId);
            video?.dislikes?.pull(userId);  
        }

        await video.save();
        return res.status(200).json(video);
        
    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Like Error: ${error}`
        });
    }
};


export const toggleDislikes = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId;
        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }
        if(video.dislikes.includes(userId)) {
            video?.dislikes?.pull(userId);
            
        } else {
            video?.dislikes?.push(userId);
            video?.likes?.pull(userId);  
        }

        await video.save();
        return res.status(200).json(video);
        
    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Dislike Error: ${error}`
        });
    }
};


export const toggleSave = async (req, res) => {
    try {
        const {videoId} = req.params;
        const userId = req.userId;
        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        if(video?.savedBy?.includes(userId)) {
            video?.savedBy?.pull(userId);

        } else {
            video?.savedBy?.push(userId);

        }

        await video.save();
        return res.status(200).json(video);

    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Save Error: ${error}`
        });
    }
};


export const getViews = async (req, res) => {
    try {
        const {videoId} = req.params;
        const video = await Video.findByIdAndUpdate(videoId, {
            $inc: {view: 1},
            $new: true
        });

        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        return res.status(200).json(video);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Views Error: ${error}`
        });
    }
};


export const addComment = async (req, res) => {
    try {
        const {videoId} = req.params;
        const {message} = req.body;
        const userId = req.userId;

        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        await video?.comments?.push({
            author: userId,
            message
        });

        await video.save();

        const populatedVideo = await Video.findById(videoId)
        .populate({
            path: 'comments.author',
            select: 'userName photoUrl email'
        })
        .populate({
            path: 'comments.replies.author',
            select: 'userName photoUrl email'
        });

        return res.status(200).json(populatedVideo);

    } catch (error) {
        return res.status(500).json({
            message: `Add-Comment Error: ${error}`
        });
    }
};


export const addReply = async (req, res) => {
    try {
        const {videoId, commentId} = req.params;
        const {message} = req.body;
        const userId = req.userId;

        const video = await Video.findById(videoId);
        if(!video) {
            return res.status(404).json({
                message: 'Video not found!'
            });
        }

        const comment = await video.comments.id(commentId);
        if(!comment) {
            return res.status(404).json({
                message: 'Comment not found!'
            });
        }

        comment?.replies?.push({
            author: userId,
            message
        });

        await video.save();

        const populatedVideo = await Video.findById(videoId)
        .populate({
            path: 'comments.author',
            select: 'userName photoUrl email'
        })
        .populate({
            path: 'comments.replies.author',
            select: 'userName photoUrl email'
        });

        return res.status(200).json(populatedVideo);

    } catch (error) {
        return res.status(500).json({
            message: `Add-Reply Error: ${error}`
        });
    }
};


export const getLikedVideos = async (req, res) => {
    try {
        const userId = req.userId
        const likedVideo = await Video.find({likes: userId}).populate('channel', 'name avatar').populate('likes', 'userName');
        if(!likedVideo) {
            return res.status(400).json({
                message: 'No liked video found!'
            });
        }

        return res.status(200).json(likedVideo);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Liked-Videos Error: ${error}`
        });
    }
};


export const getSavedVideos = async (req, res) => {
    try {
        const userId = req.userId
        const savedVideo = await Video.find({savedBy: userId}).populate('channel', 'name avatar').populate('savedBy', 'userName');
        if(!savedVideo) {
            return res.status(400).json({
                message: 'No saved video found!'
            });
        }

        return res.status(200).json(savedVideo);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Saved-Videos Error: ${error}`
        });
    }
};