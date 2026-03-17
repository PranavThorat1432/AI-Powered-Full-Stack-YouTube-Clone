import Channel from "../Models/channelModel.js";
import Playlist from "../Models/playlistModel.js";
import Video from "../Models/videoModel.js";


export const createPlaylist = async (req, res) => {
    try {
        const {title, description, channelId, videoIds} = req.body;

        if(!title || !channelId) {
            return res.status(400).json({
                message: 'To create playlist, title and channelId are required!'
            });
        }

        const channel = await Channel.findById(channelId);
        if(!channel) {
            return res.status(404).json({
                message: 'Channel not found!'
            });
        }

        const videos = await Video.find({
            _id: { $in: videoIds },
            channel: channelId
        });

        if(videos?.length !== videoIds?.length) {
            return res.status(404).json({
                message: 'Some videos are not found!'
            });
        }

        const playlist = await Playlist.create({
            title, 
            description,
            channel: channelId,
            videos: videoIds
        });

        await Channel.findByIdAndUpdate(channelId, {
            $push: { playlists: playlist._id}
        });

        return res.status(201).json(playlist);

    } catch (error) {
        return res.status(500).json({
            message: `Create-Playlist Error: ${error}`
        });
    }
};


export const fetchPlaylists = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const playlist = await Playlist.findById(playlistId)
        .populate('channel', 'name avatar')
        .populate({
            path: 'videos',
            populate: {
                path: 'channel',
                select: 'name avatar'
            },
        });

        if(!playlist) {
            return res.status(404).json({
                message: 'Playlist not found!'
            });
        }

        return res.status(200).json(playlist);

    } catch (error) {
        return res.status(500).json({
            message: `Fetch-Playlist Error: ${error}`
        });
    }
};


export const updatePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { title, description, addVideos = [], removeVideos = [] } = req.body;

        const playlist = await Playlist.findById(playlistId);
        if(!playlist) {
            return res.status(404).json({
                message: 'Playlist not found!'
            });
        }

        if(title) {
            playlist.title = title;
        }
        if(description) {
            playlist.description = description;
        }

        // add videos (avoid duplicates)
        playlist.videos.push(...addVideos);
        playlist.videos = [...new Set(playlist.videos.map(v => v.toString()))];

        // remove videos
        playlist.videos = playlist.videos.filter(
            v => !removeVideos.includes(v.toString())
        );

        await playlist.save();

        res.status(200).json(playlist);

    } catch (error) {
        return res.status(500).json({
            message: `Update-Playlist Error: ${error}`
        });
    }
};


export const deletePlaylist = async (req, res) => {
    try {
        const { playlistId } = req.params;

        const playlist = await Playlist.findById(playlistId);
        if(!playlist) {
            return res.status(404).json({
                message: 'Playlist not found!'
            });
        }

        // remove playlist reference from channel
        await Channel.findByIdAndUpdate(playlist.channel, {
            $pull: { playlists: playlist?._id },
        });

        // delete playlist
        await Playlist.findByIdAndDelete(playlistId);

        return res.status(200).json({
            mesage: 'Playlist Deleted!'
        });

    } catch (error) {
        return res.status(500).json({
            message: `Delete-Playlist Error: ${error}`
        });
    }
};


export const toggleSavePlaylist = async (req, res) => {
    try {
        const {playlistId} = req.body;
        const userId = req.userId;
        const playlist = await Playlist.findById(playlistId);
        if(!playlist) {
            return res.status(404).json({
                message: 'Playlist not found!'
            });
        }

        if(playlist?.savedBy?.includes(userId)) {
            playlist?.savedBy?.pull(userId);

        } else {
            playlist?.savedBy?.push(userId);

        }

        await playlist.save();
        return res.status(200).json(playlist);

    } catch (error) {
        return res.status(500).json({
            message: `Save-Playlist Error: ${error}`
        });
    }
};


export const getSavedPlaylists = async (req, res) => {
    try {
        const userId = req.userId
        const savedPlaylist = await Playlist.find({savedBy: userId})
        .populate('videos')
        .populate({
            path: 'videos',
            populate: {path: 'channel'}
        });


        if(!savedPlaylist || savedPlaylist?.length === 0) {
            return res.status(400).json({
                message: 'No saved playlists found!'
            });
        }

        return res.status(200).json(savedPlaylist);

    } catch (error) {
        return res.status(500).json({
            message: `Get-Saved-Playlists Error: ${error}`
        });
    }
}