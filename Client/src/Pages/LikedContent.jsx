import React, { useEffect, useState } from 'react'
import { serverUrl } from '../App';
import { SiYoutubeshorts } from "react-icons/si";
import {GoVideo} from 'react-icons/go';
import ShortCard from '../Components/ShortCard';
import axios from 'axios';
import VideoCard from '../Components/VideoCard';

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

const LikedContent = () => {

    const [likedVideos, setLikedVideos] = useState([]);
    const [likedShorts, setLikedShorts] = useState([]);
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if(Array.isArray(likedVideos) && likedVideos.length > 0) {
            likedVideos.forEach((videos) => {
                getVideoDuration(videos.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [likedVideos]);


    useEffect(() => {
        const fetchLikedContent = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/content/liked-videos`, {
                    withCredentials: true
                });
                setLikedVideos(result.data);

                const result1 = await axios.get(`${serverUrl}/api/content/liked-shorts`, {
                    withCredentials: true
                });
                setLikedShorts(result1.data);

            } catch (error) {
                console.log(error);
            }
        }
        fetchLikedContent();
    }, []);

    
    if((!likedVideos || likedVideos?.length === 0) && (!likedShorts || likedShorts?.length === 0)) {
        return (
            <div className='flex justify-center items-center h-[70vh] text-gray-400 text-xl'>
                No Liked Content Found!
            </div>
        )
    }
    
  return (
    <div className='px-6 py-4 min-h-screen mt-12 lg:mt-5'>
        {/* Shorts */}
        {likedShorts?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 pt-12 border-b border-gray-300 pb-2 flex items-center gap-2'><SiYoutubeshorts className='w-7 h-7 text-red-500'/> Liked Shorts</h2>
                <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                    {likedShorts?.map((short) => (
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

        {/* Videos */}
        {likedVideos?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 pt-12 border-b border-gray-300 pb-2 flex items-center gap-2'><GoVideo className='w-7 h-7 text-red-500'/> Liked Videos</h2>
                <div className='flex gap-4 flex-wrap '>
                    {likedVideos?.map((v) => (
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
    </div>
  )
}

export default LikedContent;
