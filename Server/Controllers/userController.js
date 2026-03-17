import uploadOnCloudinary from "../Config/cloudinary.js";
import Channel from "../Models/channelModel.js";
import User from "../Models/userModel.js";
import Post from "../Models/postModel.js";
import Playlist from "../Models/playlistModel.js";
import Video from "../Models/videoModel.js";
import Short from "../Models/shortModel.js";

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        return res.status(200).json(user);
        
    } catch (error) {
        return res.status(500).json({
            message: `Get-Current-User Error: ${error}`
        });
    }
};


export const createChannel = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const userId = req.userId;
        const existingChannel = await Channel.findOne({owner: userId});
        if(existingChannel) {
            return res.status(404).json({
                message: 'You already have a channel!'
            });
        }

        const nameExists = await Channel.findOne({name});
        if(nameExists) {
            return res.status(404).json({
                message: 'Channel name already taken!'
            });
        }

        let avatarUrl = '';
        let bannerUrl = '';

        // Handle avatar upload
        if (req.files && req.files['avatar']) {
            const avatarFile = req.files['avatar'][0];
            try {
                const result = await uploadOnCloudinary(avatarFile.path);
                if (result) {
                    avatarUrl = result;
                    console.log('Avatar uploaded:', avatarUrl);
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                return res.status(500).json({
                    message: 'Error uploading avatar'
                });
            }
        }

        // Handle banner upload
        if (req.files && req.files['banner']) {
            const bannerFile = req.files['banner'][0];
            try {
                const result = await uploadOnCloudinary(bannerFile.path);
                if (result) {
                    bannerUrl = result;
                    console.log('Banner uploaded:', bannerUrl);
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                return res.status(500).json({
                    message: 'Error uploading banner'
                });
            }
        }

        const channel = await Channel.create({
            name,
            description,
            category,
            owner: userId,
            avatar: avatarUrl,
            banner: bannerUrl
        });

        // Update user's channel reference and profile
        await User.findByIdAndUpdate(userId, { 
            channel: channel._id,
            userName: name,
            photoUrl: avatarUrl || undefined
        });

        // Return the channel with the updated URLs
        return res.status(201).json({
            ...channel.toObject(),
            avatar: avatarUrl,
            banner: bannerUrl
        });

    } catch (error) {
        return res.status(500).json({
            message: `Create-Channel Error: ${error}`
        });
    }
};


export const getChannelData = async (req, res) => {
    try {
        const userId = req.userId;
        const channel = await Channel.findOne({ owner: userId })
        .populate('owner')
        .populate('videos')
        .populate('shorts')
        .populate('subscribers')
        .populate({
            path: 'communityPosts',
            populate: {
                path: 'channel',
                model: 'Channel'
            },
        })
        .populate({
            path: 'playlists',
            populate: {
                path: 'videos',
                model: 'Video',
                populate: {
                    path: 'channel',   // populates channel inside of the video
                    model: 'Channel'
                },
            },
        });

        if(!channel) {
            return res.status(404).json({
                message: 'Channel not found!'
            });
        }

        return res.status(200).json(channel);

    } catch (error) {
        console.error('Get channel data error:', error);
        return res.status(500).json({
            message: `Get-Channel-Data Error: ${error.message}`
        });
    }
};


export const updateChannel = async (req, res) => {
    try {
        const { name, description, category } = req.body;
        const userId = req.userId;
        let avatarUrl = '';
        let bannerUrl = '';

        const channel = await Channel.findOne({ owner: userId });
        if (!channel) {
            return res.status(404).json({
                message: 'Channel not found!'
            });
        }

        if(name !== undefined) {
            // Check if name is already taken by another channel
            const nameExists = await Channel.findOne({ name, _id: { $ne: channel._id } });
            if(nameExists) {
                return res.status(400).json({
                    message: 'Channel name already taken!'
                });
            }
            channel.name = name;
        }

        if(description !== undefined) {
            channel.description = description;
        }
        if(category !== undefined) {
            channel.category = category;
        }

        // Handle avatar upload
        if (req.files && req.files['avatar']) {
            const avatarFile = req.files['avatar'][0];
            try {
                const result = await uploadOnCloudinary(avatarFile.path);
                if (result) {
                    avatarUrl = result;
                    channel.avatar = avatarUrl;
                }
            } catch (error) {
                console.error('Error uploading avatar:', error);
                return res.status(500).json({
                    message: 'Error uploading avatar'
                });
            }
        }

        // Handle banner upload
        if (req.files && req.files['banner']) {
            const bannerFile = req.files['banner'][0];
            try {
                const result = await uploadOnCloudinary(bannerFile.path);
                if (result) {
                    bannerUrl = result;
                    channel.banner = bannerUrl;
                }
            } catch (error) {
                console.error('Error uploading banner:', error);
                return res.status(500).json({
                    message: 'Error uploading banner'
                });
            }
        }

        const updatedChannel = await channel.save();

        // Update user's channel reference and profile
        const updateData = {
            userName: name || undefined
        };
        
        // Only update photoUrl if avatar was uploaded
        if (avatarUrl) {
            updateData.photoUrl = avatarUrl;
        }

        await User.findByIdAndUpdate(userId, updateData, { new: true });

        return res.status(200).json({
            message: 'Channel updated successfully!',
            channel: updatedChannel
        });

    } catch (error) {
        console.error('Update channel error:', error);
        return res.status(500).json({
            message: `Update-Channel Error: ${error.message}`
        });
    }
};


export const toggleSubscribe = async (req, res) => {
    try {
        const {channelId} = req.body;
        const userId = req.userId;
        if(!channelId) {
            return res.status(400).json({
                message: 'ChannelId is required!'
            });
        }

        const channel = await Channel.findById(channelId);
        if(!channel) {
            return res.status(404).json({
                message: 'Channel not found!'
            });
        }

        const isSubscribed = channel?.subscribers?.includes(userId);
        if(isSubscribed) {
            channel?.subscribers?.pull(userId);

        } else {
            channel?.subscribers?.push(userId);
        }
        await channel.save();

        const updatedChannel = await Channel.findById(channelId).populate('owner').populate('videos').populate('shorts');

        return res.status(200).json(updatedChannel);

    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Subscribers Error: ${error}`
        });
    }
};


export const getAllChannelsData = async (req, res) => {
    try {
        const channel = await Channel.find()
        .populate('owner')
        .populate('videos')
        .populate('shorts')
        .populate({
            path: 'communityPosts',
            model: 'Post',
            populate: [
                {
                    path: 'channel',
                    model: 'Channel'
                },
                {
                    path: 'comments.author',
                    model: 'User',
                    select: 'userName photoUrl'
                },
                {
                    path: 'comments.replies.author',
                    model: 'User',
                    select: 'userName photoUrl'
                },
            ]
        })
        .populate({
            path: 'playlists',
            model: 'Playlist',
            populate: {
                path: 'videos',
                model: 'Video',
                populate: {
                    path: 'channel',
                    model: 'Channel'
                }
            }
        });

        if(!channel) {
            return res.status(404).json({
                message: 'No channel found!'
            });
        }

        return res.status(200).json(channel);

    } catch (error) {
        return res.status(500).json({
            message: `Get-All-Channels-Data Error: ${error}`
        });
    }
};


export const getSubscribedData = async (req, res) => {
    try {
        const userId = req.userId;
        
        const subscribedChannels = await Channel.find({subscribers: userId})
        .populate({
            path: 'videos',
            populate: {path: 'channel', select: 'name avatar'}
        })
        .populate({
            path: 'shorts',
            populate: {path: 'channel', select: 'name avatar'}
        })
        .populate({
            path: 'playlists',
            populate: {path: 'channel', select: 'name avatar'},
            populate: {
                path: 'videos',
                populate: {path: 'channel'}
            }
        })
        .populate({
            path: 'communityPosts',
            populate: [
                { path: 'channel', select: 'name avatar' },
                { path: 'comments.author', select: 'userName photoUrl email' },
                { path: 'comments.replies.author', select: 'userName photoUrl email' }
            ]
        });


        if(!subscribedChannels || subscribedChannels?.length === 0) {
            return res.status(404).json({
                message: 'No Subscribed Channels Found!'
            });
        }

        const videos = subscribedChannels.flatMap((channel) => channel.videos);
        const shorts = subscribedChannels.flatMap((channel) => channel.shorts);
        const playlists = subscribedChannels.flatMap((channel) => channel.playlists);
        const posts = subscribedChannels.flatMap((channel) => channel.communityPosts);

        return res.status(200).json({
            subscribedChannels,
            videos,
            shorts,
            playlists,
            posts
        });

    } catch (error) {
        return res.status(500).json({
            message: `Get-Subscribed-Data Error: ${error}`
        });
    }
};


export const addHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const {contentId, contentType} = req.body;

        if(!['Video', 'Short'].includes(contentType)) {
            return res.status(400).json({
                message: 'Invalid Content Type!'
            });
        }

        let content;
        if(contentType === 'Video') {
            content = await Video.findById(contentId);
        } else {
            content = await Short.findById(contentId);
        }

        if(!content) {
            return res.status(404).json({
                message: `${contentType} not found!`
            });
        }

        await User.findByIdAndUpdate(userId, {
            $pull: {history: {contentId, contentType}}
        });

        await User.findByIdAndUpdate(userId, {
            $push: {history: {contentId, contentType, watchedAt: new Date()}}
        });

        res.status(200).json({
            message: 'Added to History'
        });


    } catch (error) {
        return res.status(500).json({
            message: `Add To History Error: ${error}`
        });
    }
};


export const getHistory = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId)
        .populate({
            path: 'history.contentId',
            populate: {
                path: 'channel',
                select: 'name avatar'
            },
        })
        .select('history');

        if(!user) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        const sortedHistory = [...user.history].sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));

        res.status(200).json(sortedHistory);


    } catch (error) {
        return res.status(500).json({
            message: `Get-History Error: ${error}`
        });
    }
};


export const getRecommendedContent = async (req, res) => {
    try {
        const userId = req.userId;
        if(!userId) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        // Get User with History
        const user = await User.findById(userId)
        .populate('history.contentId')
        .lean();

        if(!user) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        // Collect keywords from history
        const historyKeywords = user.history?.map(h => h.contentId?.title || '');

        // Collect liked & saved content
        const likedVideos = await Video.find({ likes: userId });
        const likedShorts = await Short.find({ likes: userId });
        const savedVideos = await Video.find({ savedBy: userId });
        const savedShorts = await Short.find({ savedBy: userId });

        const likedSavedKeywords = [
            ...likedVideos.map(v => v.title),
            ...likedShorts.map(s => s.title),
            ...savedVideos.map(v => v.title),
            ...savedShorts.map(s => s.title),
        ];

        // Merge all keywords
        const allKeywords = [...historyKeywords, ...likedSavedKeywords]
        .filter(Boolean)
        .map(k => k.split(' '))  // split words
        .flat();

        // Build regex conditions
        const videoConditions = [];
        const shortConditions = [];

        allKeywords.forEach(kw => {
            videoConditions.push({
                title: { $regex: kw, $options: 'i' },
                description: { $regex: kw, $options: 'i' },
                tags: { $regex: kw, $options: 'i' },
            });
            shortConditions.push({
                title: { $regex: kw, $options: 'i' },
                tags: { $regex: kw, $options: 'i' },
            });
        });

        // Recommended Content
        const recommendedVideos = await Video.find({ $or: videoConditions })
        .populate('channel comments.author comments.replies.author');

        const recommendedShorts = await Short.find({ $or: shortConditions })
        .populate('channel', 'name avatar')
        .populate('likes', 'userName photoUrl');


        // Remaining Content (exclude recommended)
        const recommendedVideoIds = recommendedVideos?.map(v => v._id);
        const recommendedShortIds = recommendedShorts?.map(s => s._id);

        const remainingVideos = await Video.find({
            _id: { $nin: recommendedVideoIds }
        })
        .sort({ createdAt: -1 })
        .populate('channel');
        
        const remainingShorts = await Short.find({
            _id: { $nin: recommendedShortIds }
        })
        .sort({ createdAt: -1 })
        .populate('channel');

        return res.status(200).json({
            recommendedVideos,
            recommendedShorts,
            remainingVideos,
            remainingShorts,
            usedKeywords: allKeywords,
        });

    } catch (error) {
        return res.status(500).json({
            message: `Get-Recommended-Content Error: ${error}`
        });
    }
};