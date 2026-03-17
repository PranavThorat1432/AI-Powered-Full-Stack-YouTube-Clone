import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import Video from '../Models/videoModel.js';
import Short from '../Models/shortModel.js';
import Playlist from '../Models/playlistModel.js';
import Channel from '../Models/channelModel.js';


export const searchWithAI = async (req, res) => {
    try {
        const { input } = req.body;
        if(!input) {
            return res.status(400).json({
                message: 'Seach query is required!'
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `You are a search assistant for a video streaming platform like YouTube. The user query is: "${input}"
        
        Your Job: 
        - If query has typos, correct them.
        - If query has multiple words, break them into meaningful keywords.
        - Return only the corrected words, comma-separated.
        - Do not explain, only return keywords. `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        let keyword = (response.text || input).trim().replace(/[\n\r]+/g, '');

        const searchWords = keyword.split(',').map((w) => w.trim()).filter(Boolean);

        const buildRegexQuery = (fields) => {
            return {
                $or: searchWords.map((word) => ({
                    $or: fields.map((field) => ({
                        [field]: { $regex: word, $options: 'i'},
                    })),
                })),
            };
        };

        const matchedChannels = await Channel.find(buildRegexQuery(['name'])).select("_id name avatar");

        const channelIds = matchedChannels.map((c) => c._id);

        // Videos
        const videos = await Video.find({
            $or: [
                buildRegexQuery(['title', 'desription', 'tags']),
                { channel: { $in: channelIds } },
            ]
        }).populate('channel comments.author comments.replies.author');

        // Shorts
        const shorts = await Short.find({
            $or: [
                buildRegexQuery(['title', 'description', 'tags']),
                { channel: { $in: channelIds } },
            ],
        })
        .populate('channel', 'name avatar')
        .populate('likes', 'userName photUrl');

        // Playlists
        const playlists = await Playlist.find({
            $or: [
                buildRegexQuery(['title', 'description']),
                { channel: { $in: channelIds } },
            ],
        })
        .populate('channel', 'name avatar')
        .populate({
            path: 'videos',
            populate: {
                path: 'channel',
                select: 'name avatar'
            },
        });

        return res.status(200).json({
            keyword,
            channels: matchedChannels,
            videos,
            shorts,
            playlists
        });

    } catch (error) {
        return res.status(500).json({
            message: `Search With AI: ${error}`
        });
    }
};


export const filterCategoryWithAi = async (req, res) => {
    try {
        const {input} = req.body;
        if(!input) {
            return res.status(400).json({
                message: 'Seach query is required!'
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const categories = [
            'Music', 'Gaming', 'Movies', 'TV Shows', 'News', 'Trending', 'Entertainment', 'Education', 'Science & Technology', 'Sports', 'Travel', 'Fashion', 'Cooking', 'Pets', 'Art', 'Comedy', 'Vlogs'
        ];

        const prompt = `You are a category classifier for a video streaming platform.
        Tne query is: "${input}"
        
        Your Job: 
        - Match this query with the most relevant categories from this list: ${categories.join(", ")}
        - If more than one category fits, return them comma-separated.
        - If nothing fits, return the single closest category.
        - Do not explain. Do not return JSON. Only return category names.

        Examples:
        - 'arijit singh songs: → 'Music'
        - 'pubg gameplay: → 'Gaming'
        - 'netflix web series: → 'TV Shows'
        - 'indias latest news: → 'News'
        - 'funny animals videos: → 'Comedy, Pets'
        - 'fitness tips videos: → 'Education, Sports'
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        const keywordText = response.text.trim();
        const keywords = keywordText.split(',').map(k => k.trim());

        const videoConditions = [];
        const shortConditions = [];
        const channelConditions = [];

        keywords.forEach(kw => {
            videoConditions.push(
                {title: { $regex: kw, $options: 'i' }},
                {description: { $regex: kw, $options: 'i' }},
                {tags: { $regex: kw, $options: 'i' }},
            );
            shortConditions.push(
                {title: { $regex: kw, $options: 'i' }},
                {tags: { $regex: kw, $options: 'i' }},
            );
            channelConditions.push(
                {name: { $regex: kw, $options: 'i' }},
                {category: { $regex: kw, $options: 'i' }},
                {description: { $regex: kw, $options: 'i' }},
            );
        });

        // Find Videos
        const videos = await Video.find({ $or: videoConditions })
        .populate('channel comments.author comments.replies.author');

        // Find Shorts
        const shorts = await Short.find({ $or: shortConditions })
        .populate('channel', 'name avatar')
        .populate('likes', 'userName photoUrl');
        
        // Find Channels
        const channels = await Channel.find({ $or: channelConditions })
        .populate('subscribers', 'userName photoUrl')
        .populate({
            path: 'videos',
            populate: {
                path: 'channel',
                select: 'name avatar'
            },
        })
        .populate({
            path: 'shorts',
            populate: {
                path: 'channel',
                select: 'name avatar'
            }
        });

        return res.status(200).json({
            videos,
            shorts,
            channels,
            keywords,
        });
        

    } catch (error) {
        return res.status(500).json({
            message: `Filter Category With AI: ${error}`
        });
    }
};