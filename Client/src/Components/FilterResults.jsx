import React, { useEffect, useState } from 'react'
import VideoCard from './VideoCard';
import ShortCard from './ShortCard';


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

const FilterResults = ({filterResults}) => {

    const [duration, setDuration] = useState('');

    useEffect(() => {
        if(Array.isArray(filterResults?.videos) && filterResults?.videos?.length > 0) {
            filterResults?.videos.forEach((videos) => {
                getVideoDuration(videos.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [filterResults?.videos]);

    const isEmpty = 
    (!filterResults?.videos || filterResults?.videos?.length === 0) &&
    (!filterResults?.shorts || filterResults?.shorts?.length === 0);

  return (
    <div className='px-6 py-4 bg-[#00000051] border border-gray-800 mb-5'>
        <h2 className='text-2xl font-bold mb-4'>Filter Results:</h2>

        {isEmpty ? (
            <p className='text-gray-400 text-lg'>
                No results found!
            </p>
        ) : (
            <>
                {/* Videos Section */}
                {filterResults?.videos?.length > 0 && (
                    <div className='mt-8'>
                        <h3 className='text-xl font-bold mb-4'>Videos</h3>
                        <div className='flex flex-wrap gap-6 mb-12'>
                            {filterResults?.videos?.map((v) => (
                                <VideoCard
                                    key={v._id}
                                    thumbnail={v.thumbnail}
                                    duration={duration[v._id] || '0:00'}
                                    channelLogo={v.channel?.avatar}
                                    title={v.title}
                                    channelName={v.channel.name}
                                    views={`${v.view}`}
                                    time={new Date(v.createdAt).toLocaleDateString()}
                                    id={v._id}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Shorts Section */}
                {filterResults.shorts?.length > 0 && (
                    <div className='mt-8'>
                        <h3 className='text-xl font-bold mb-4'>Shorts</h3>
                        <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                            {filterResults?.shorts.map((s) => (
                                <div key={s?._id} className='shrink-0'>
                                    <ShortCard
                                        shortUrl={s?.shortUrl}
                                        title={s.title}
                                        channelName={s.channel.name}
                                        views={s.view}
                                        id={s._id}
                                        avatar={s.channel.avatar}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </>
        )}
    </div>
  )
}

export default FilterResults
