import React from 'react'
import { useSelector } from 'react-redux'
import VideoCard from './VideoCard';
import { useState } from 'react';
import { useEffect } from 'react';

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

const AllVideosPage = () => {

    const {allVideosData} = useSelector((state) => state.content);
    const [duration, setDuration] = useState('');

    useEffect(() => {
        if(Array.isArray(allVideosData) && allVideosData.length > 0) {
            allVideosData.forEach((videos) => {
                getVideoDuration(videos.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [allVideosData]);


  return (
    <div className='flex flex-wrap gap-6 mb-12 items-center justify-center md:justify-start mt-3'>
        {
            allVideosData?.map((video) => (
                <VideoCard
                    key={video?._id}
                    duration={duration[video?._id] || "0:00"}
                    thumbnail={video?.thumbnail}
                    title={video?.title}
                    channelLogo={video?.channel?.avatar}
                    channelName={video?.channel?.name}
                    views={video?.view}
                    id={video?._id}
                />
            ))
        }
    </div>
  )
}

export default AllVideosPage
