import React, { useEffect, useState } from 'react'
import { SiYoutubeshorts } from 'react-icons/si';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import ShortCard from '../Components/ShortCard';
import VideoCard from '../Components/VideoCard';
import { GoVideo } from 'react-icons/go';
import PlaylistCard from '../Components/PlaylistCard';
import { FaList } from 'react-icons/fa';
import PostCard from '../Components/PostCard';
import { RiUserCommunityFill } from "react-icons/ri";


const getVideoDuration = (url, callback) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    video.onloadedmetadata = () => {
        const totalSeconds = Math.floor(video.duration);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        callback(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    video.onerror = () => {
        callback('0:00');
    };
};

const Subscriptions = () => {

    const navigate = useNavigate();

    const [duration, setDuration] = useState('');

    const {subscribedChannels, subscribedVideos, subscribedShorts, subscribedPlaylists, subscribedPosts} = useSelector((state) => state.user);

    useEffect(() => {
        if(Array.isArray(subscribedVideos) && subscribedVideos.length > 0) {
            subscribedVideos.forEach((videos) => {
                getVideoDuration(videos.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [subscribedVideos]);

    
    if(!subscribedChannels ) {
        return (
            <div className='flex justify-center items-center h-[70vh] text-gray-400 text-xl'>
                No Subscribed Content Found!
            </div>
        )
    }

  return (
    <div className='px-6 py-4 min-h-screen'>
        {/* Subscribed Channels */}
        <div className='flex gap-6 overflow-x-auto pb-6 scrollbar-hide pt-10'>
            {subscribedChannels?.map((ch) => (
                <div
                    key={ch?._id}
                    className='flex flex-col items-center shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200 p-2'
                    onClick={() => navigate(`/channel-page/${ch?._id}`)}
                >
                    <img src={ch?.avatar} className='w-18 h-18 rounded-full border border-gray-600 object-cover shadow-md' alt="" />
                    <span className='mt-2 text-sm text-gray-300 font-medium text-center truncate w-20'>{ch?.name}</span>
                </div>
            ))}
        </div>

        {/* Shorts Section */}
        {subscribedShorts?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 border-b border-gray-600 pb-2 flex items-center gap-2'>
                    <SiYoutubeshorts className='w-7 h-7 text-red-500'/> Subscribed Shorts
                </h2>

                <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                    {subscribedShorts?.map((short) => (
                        <div key={short?._id} className='shrink-0'>
                            <ShortCard 
                                shortUrl={short?.shortUrl}
                                title={short?.title}
                                channelName={short?.channel?.name}
                                views={short?.view}
                                id={short?._id}
                                avatar={short?.channel?.avatar}
                            />
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* Videos Section */}
        {subscribedVideos?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 border-b border-gray-600 pb-2 flex items-center gap-2 mt-5'>
                    <GoVideo className='w-7 h-7 text-red-500'/> Subscribed Videos
                </h2>

                <div className='flex gap-4 flex-wrap '>
                    {subscribedVideos?.map((v) => (
                        <div key={v?._id} className='shrink-0'>
                            <VideoCard 
                                thumbnail={v?.thumbnail}
                                title={v?.title}
                                channelName={v?.channel?.name}
                                duration={duration[v?._id] || '0:00'}
                                channelLogo={v?.channel?.avatar}
                                views={v?.view}
                                id={v?._id}
                            />
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* Playlists Section */}
        {subscribedPlaylists?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 pt-5 border-b border-gray-600 pb-2 flex items-center gap-2'><FaList className='w-7 h-7 text-red-500'/> Subscribed Playlists</h2>
                
                <div className='flex gap-4 flex-wrap '>
                    {subscribedPlaylists?.map((playlist) => (
                        <PlaylistCard
                            key={playlist?._id}
                            id={playlist?._id}
                            title={playlist?.title}
                            videos={playlist?.videos}
                            savedBy={playlist?.savedBy}
                        />
                    ))}
                </div>       
            </>
        )}

        {/* Posts Section */}
        {subscribedPosts?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 pt-10 border-b border-gray-600 pb-2 flex items-center gap-2'><RiUserCommunityFill className='w-7 h-7 text-red-500'/> Subscribed Posts</h2>
                
                <div className='flex gap-4 flex-wrap '>
                    {subscribedPosts?.map((p) => (
                        <PostCard
                            key={p?._id}
                            post={p}
                        />
                    ))}
                </div>       
            </>
        )}
    </div>
  )
}

export default Subscriptions
