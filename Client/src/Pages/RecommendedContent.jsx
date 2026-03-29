import React from 'react'
import { useSelector } from 'react-redux'
import VideoCard from '../Components/VideoCard';
import ShortCard from '../Components/ShortCard';
import { SiYoutubeshorts } from 'react-icons/si';
import { useEffect } from 'react';
import { useState } from 'react';


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

const RecommendedContent = () => {


    const {recommendedContent} = useSelector((state) => state.user);

    const [duration, setDuration] = useState('');

    const allVideos = [
        ...(recommendedContent?.recommendedVideos || []),
        ...(recommendedContent?.remainingVideos || []),
    ];

    const allShorts = [
        ...(recommendedContent?.recommendedShorts || []),
        ...(recommendedContent?.remainingShorts || []),
    ];

    useEffect(() => {
        allVideos.forEach((video) => {
            if(!duration[video._id]) {
                getVideoDuration(video.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [video._id]: formatedTime}));
                });
            };
        });
    }, [recommendedContent]);

    if(!allVideos?.length && !allShorts?.length) {
        return null;
    }

  return (
    <div className='py-4 mb-5'>
        {/* Video Section */}
        {allVideos?.length > 0 && (
            <div>
                <div className='flex flex-wrap gap-6 mb-12'>
                    {allVideos.map((video) => (
                        <VideoCard
                            key={video._id}
                            thumbnail={video.thumbnail}
                            duration={duration[video._id] || "0:00"}
                            channelLogo={video.channel?.avatar}
                            title={video.title}
                            channelName={video.channel?.name}
                            views={video.view}
                            id={video._id}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* Shorts Section */}
        {allShorts?.length > 0 && (
            <div className='mt-8'>
                <h3 className='text-xl font-bold mb-4 flex items-center gap-1'><SiYoutubeshorts className='w-6 h-6 text-red-600'/> Shorts</h3>
                <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                    {allShorts.map((s) => (
                        <div key={s._id} className='shrink-0'>
                            <ShortCard
                                shortUrl={s.shortUrl}
                                title={s.title}
                                channelName={s.channel?.name}
                                avatar={s.channel?.avatar}
                                views={s.view}
                                id={s._id}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  )
};

export default RecommendedContent;