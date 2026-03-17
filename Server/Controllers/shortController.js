import uploadOnCloudinary from "../Config/cloudinary.js";
import Channel from "../Models/channelModel.js";
import Short from "../Models/shortModel.js";


export const createShort = async (req, res) => {
    try {
        const { channelId, title, description, tags } = req.body;
        if(!title || !channelId) { 
            return res.status(400).json({
                message: 'Title and ChannelId are required!'
            });
        }

        let shortUrl;
        if(req.file) {
            shortUrl = await uploadOnCloudinary(req.file.path);
        }

        const channelData = await Channel.findById(channelId);
        if(!channelData) {
            return res.status(404).json({
                message: 'Channel not found!'
            });
        }

        const newShort = await Short.create({
            channel: channelData._id,
            title,
            description,
            tags: tags ? JSON.parse(tags) : [],
            shortUrl
        });

        await Channel.findByIdAndUpdate(channelData._id, {
            $push: {shorts: newShort._id},
            $new: true
        });

        return res.status(201).json(newShort);


    } catch (error) {
        return res.status(500).json({
            message: `Create-Short Error: ${error}`
        });
    }
};




export const fetchShorts = async (req, res) => {
    try {
        const { shortId } = req.params;

        const short = await Short.findById(shortId)
        .populate('channel', 'name avatar')
        .populate('likes', 'userName photoUrl');

        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }

        return res.status(200).json(short);

    } catch (error) {
        return res.status(500).json({
            message: 'Fetch-Shorts Error: ' + error
        });
    }
};

export const updateShort = async (req, res) => {
    try {
        const { shortId } = req.params;
        const { title, description, tags } = req.body;

        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }

        if(title) {
            short.title = title;
        }
        if(description) {
            short.description = description;
        }

        if(tags) {
            try {
                short.tags = JSON.parse(tags);
            } catch (error) {
                short.tags = [];
            }
        }

        await short.save();
        return res.status(200).json(short);


    } catch (error) {
        return res.status(500).json({
            message: 'Update-Short Error: ' + error
        });
    }
};


export const deleteShort = async (req, res) => {
    try {
        const { shortId } = req.params;

        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'short not found!'
            });
        }

        // remove short reference from channel
        await Channel.findByIdAndUpdate(short.channel, {
            $pull: {shorts: short._id}
        });

        // remove short
        await Short.findByIdAndDelete(shortId);

        return res.status(200).json({
            message: 'Short Deleted!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Delete-Short Error: ${error}`
        });
    }
};


export const getAllShorts = async (req, res) => {
    try {
        const shorts = await Short.find().sort({createdAt: -1}).populate('channel comments.author comments.author.replies');
        if(!shorts) {
            return res.status(404).json({
                message: 'No Short Found!'
            });
        }
        
        return res.status(200).json(shorts);

    } catch (error) {
        return res.status(500).json({
            message: `Get-All-Shorts Error: ${error}`
        });
    }
};



export const toggleLikes1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId;
        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }
        if(short.likes.includes(userId)) {
            short?.likes?.pull(userId);
            
        } else {
            short?.likes?.push(userId);
            short?.dislikes?.pull(userId);  
        }

        await short.populate('comments.author', 'userName photoUrl');
        await short.populate('channel');
        await short.populate('comments.replies.author', 'userName photoUrl');

        await short.save();
        return res.status(200).json(short);
        
    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Like Error: ${error}`
        });
    }
};


export const toggleDislikes1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId;
        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }
        if(short.dislikes.includes(userId)) {
            short?.dislikes?.pull(userId);
            
        } else {
            short?.dislikes?.push(userId);
            short?.likes?.pull(userId);  
        }

        await short.populate('comments.author', 'userName photoUrl');
        await short.populate('channel');
        await short.populate('comments.replies.author', 'userName photoUrl');

        await short.save();
        return res.status(200).json(short);
        
    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Dislike Error: ${error}`
        });
    }
};


export const toggleSave1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const userId = req.userId;
        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }

        if(short?.savedBy?.includes(userId)) {
            short?.savedBy?.pull(userId);

        } else {
            short?.savedBy?.push(userId);

        }

        await short.populate('comments.author', 'userName photoUrl');
        await short.populate('channel');
        await short.populate('comments.replies.author', 'userName photoUrl');

        await short.save();
        return res.status(200).json(short);

    } catch (error) {
        return res.status(500).json({
            message: `Toggle-Save Error: ${error}`
        });
    }
};


export const getViews1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const short = await Short.findByIdAndUpdate(shortId, {
            $inc: {view: 1},
            $new: true
        });

        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }

        await short.populate('comments.author', 'userName photoUrl');
        await short.populate('channel');
        await short.populate('comments.replies.author', 'userName photoUrl');

        return res.status(200).json(short);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Views Error: ${error}`
        });
    }
};


export const addComment1 = async (req, res) => {
    try {
        const {shortId} = req.params;
        const {message} = req.body;
        const userId = req.userId;

        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }

        await short?.comments?.push({
            author: userId,
            message
        });

        await short.save();

        await short.populate('comments.author', 'userName photoUrl');
        await short.populate('channel');
        await short.populate('comments.replies.author', 'userName photoUrl');

        return res.status(200).json(short);

    } catch (error) {
        return res.status(500).json({
            message: `Add-Comment Error: ${error}`
        });
    }
};


export const addReply1 = async (req, res) => {
    try {
        const {shortId, commentId} = req.params;
        const {message} = req.body;
        const userId = req.userId;

        const short = await Short.findById(shortId);
        if(!short) {
            return res.status(404).json({
                message: 'Short not found!'
            });
        }

        const comment = await short.comments.id(commentId);
        if(!comment) {
            return res.status(404).json({
                message: 'Comment not found!'
            });
        }

        comment?.replies?.push({
            author: userId,
            message
        });

        await short.save();

        await short.populate('comments.author', 'userName photoUrl');
        await short.populate('channel');
        await short.populate('comments.replies.author', 'userName photoUrl');

        return res.status(200).json(short);

    } catch (error) {
        return res.status(500).json({
            message: `Add-Reply Error: ${error}`
        });
    }
};


export const getLikedShorts = async (req, res) => {
    try {
        const userId = req.userId
        const likedShort = await Short.find({likes: userId}).populate('channel', 'name avatar').populate('likes', 'userName');
        if(!likedShort) {
            return res.status(400).json({
                message: 'No liked short found!'
            });
        }

        return res.status(200).json(likedShort);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Liked-Shorts Error: ${error}`
        });
    }
};



export const getSavedShorts = async (req, res) => {
    try {
        const userId = req.userId
        const savedShort = await Short.find({savedBy: userId}).populate('channel', 'name avatar').populate('savedBy', 'userName');
        if(!savedShort || savedShort?.length === 0) {
            return res.status(400).json({
                message: 'No saved short found!'
            });
        }

        return res.status(200).json(savedShort);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Saved-Shorts Error: ${error}`
        });
    }
};