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

const SavedContent = () => {

    const [savedVideos, setSavedVideos] = useState([]);
    const [savedShorts, setSavedShorts] = useState([]);
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if(Array.isArray(savedVideos) && savedVideos.length > 0) {
            savedVideos.forEach((videos) => {
                getVideoDuration(videos.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [savedVideos]);


    useEffect(() => {
        const fetchSavedContent = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/content/saved-videos`, {
                    withCredentials: true
                });
                setSavedVideos(result.data);

                const result1 = await axios.get(`${serverUrl}/api/content/saved-shorts`, {
                    withCredentials: true
                });
                setSavedShorts(result1.data);

            } catch (error) {
                console.log(error);
            }
        }
        fetchSavedContent();
    }, []);


    
    if((!savedVideos || savedVideos?.length === 0) && (!savedShorts || savedShorts?.length === 0)) {
        return (
            <div className='flex justify-center items-center h-[70vh] text-gray-400 text-xl'>
                No Saved Content Found!
            </div>
        )
    }
    
    
  return (
    <div className='px-6 py-4 min-h-screen mt-12 lg:mt-5'>
        {/* Shorts */}
        {savedShorts?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 pt-12 border-b border-gray-300 pb-2 flex items-center gap-2'><SiYoutubeshorts className='w-7 h-7 text-red-500'/> Saved Shorts</h2>
                <div className='flex gap-4 flex-wrap '>
                    {savedShorts?.map((short) => (
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
        {savedVideos?.length > 0 && (
            <>
                <h2 className='text-2xl font-bold mb-6 pt-12 border-b border-gray-300 pb-2 flex items-center gap-2'><GoVideo className='w-7 h-7 text-red-500'/> Saved Videos</h2>
                <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                    {savedVideos?.map((v) => (
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

export default SavedContent;
