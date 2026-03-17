import uploadOnCloudinary from "../Config/cloudinary.js";
import Channel from "../Models/channelModel.js";
import Post from "../Models/postModel.js";


export const createPost = async (req, res) => {
    try {
        const {channelId, content} = req.body;
        const file = req.file;

        if(!channelId || !content) {
            return res.status(400).json({
                message: 'ChannelId and Content are required to create a post!'
            });
        }

        let imageUrl = '';

        if(file) {
            imageUrl = await uploadOnCloudinary(file.path);
        }

        const post = await Post.create({
            channel: channelId,
            content,
            image: imageUrl
        });

        await Channel.findByIdAndUpdate(channelId, {
            $push: { communityPosts: post._id }
        });

        return res.status(201).json(post);

    } catch (error) {
        return res.status(500).json({
            message: `Create-Post Error: ${error}`
        });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1})
        .populate('channel')
        .populate({
            path: 'comments.author',
            select: 'userName photoUrl email'
        })
        .populate({
            path: 'comments.replies.author',
            select: 'userName photoUrl email'
        });

        if(!posts) {
            return res.status(404).json({
                message: 'No Post Found!'
            });
        }

        return res.status(200).json(posts);

    } catch (error) {
        return res.status(500).json({
            message: `Get-All-Posts Error: ${error}`
        });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!'
            });
        }

        // remove post reference from channel
        await Channel.findByIdAndUpdate(post.channel, {
            $pull: { communityPosts: post._id }
        });

        // delete post itself
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            message: 'Post Deleted!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Delete-Post Error: ${error}`
        });
    }
};


export const likePost = async (req, res) => {
    try {
        const {postId} = req.body;
        const userId = req.userId;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!'
            });
        }
        if(post.likes.includes(userId)) {
            post?.likes?.pull(userId);
            
        } else {
            post?.likes?.push(userId); 
        }

        await post.save();
        return res.status(200).json(post);
        
    } catch (error) {
        return res.status(500).json({
            message: `Like-Post Error: ${error}`
        });
    }
};


export const addCommentForPost = async (req, res) => {
    try {
        const {postId} = req.body;
        const {message} = req.body;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!'
            });
        }

        await post?.comments?.push({
            author: userId,
            message
        });

        await post.save();

        const populatedPost = await Post.findById(postId)
        .populate({
            path: 'comments.author',
            select: 'userName photoUrl email'
        })
        .populate({
            path: 'comments.replies.author',
            select: 'userName photoUrl email'
        });

        return res.status(200).json(populatedPost);

    } catch (error) {
        return res.status(500).json({
            message: `Add-Comment-For-Post Error: ${error}`
        });
    }
};


export const addReplyForPost = async (req, res) => {
    try {
        const {postId, commentId} = req.body;
        const {message} = req.body;
        const userId = req.userId;

        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).json({
                message: 'Post not found!'
            });
        }

        const comment = await post.comments?.id(commentId);
        if(!comment) {
            return res.status(404).json({
                message: 'Comment not found!'
            });
        }

        comment?.replies?.push({
            author: userId,
            message
        });

        await post.save();

        const populatedPost = await Post.findById(postId)
        .populate({
            path: 'comments.author',
            select: 'userName photoUrl email'
        })
        .populate({
            path: 'comments.replies.author',
            select: 'userName photoUrl email'
        });

        return res.status(200).json(populatedPost);

    } catch (error) {
        return res.status(500).json({
            message: `Add-Reply-For-Post Error: ${error}`
        });
    }
};