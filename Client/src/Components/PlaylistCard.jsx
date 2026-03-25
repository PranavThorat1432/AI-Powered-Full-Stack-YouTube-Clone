import React, { useEffect, useState } from 'react'
import { FaListUl, FaTimes, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import VideoCard from './VideoCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

const PlaylistCard = ({id, title, videos, savedBy}) => {

    const thumbnail = videos[0]?.thumbnail;

    const {allVideosData} = useSelector((state) => state.content);
    const {userData} = useSelector((state) => state.user);

    const [showVideos, setShowVideos] = useState(false);
    const [duration, setDuration] = useState('');
    const [isSaved, setIsSaved] = useState(savedBy?.some((userId) => userId.toString() === userData?._id?.toString()) || false);



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

    useEffect(() => {
        if(Array.isArray(allVideosData) && allVideosData?.length > 0) {
            allVideosData.forEach((videos) => {
                getVideoDuration(videos?.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [allVideosData]); 


    const handleSave = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/content/save-playlist`, {playlistId: id}, {
                withCredentials: true
            });
            
            const updateSave = result.data.savedBy?.some((userId) => userId.toString() === userData?._id?.toString() || false);
            setIsSaved(updateSave);

        } catch (error) {
            console.log(error);
        }
    };


  return (
    <>
        <div className='relative w-60 h-40 rounded-xl overflow-hidden group shadow-lg bg-gray-900 cursor-pointer'>
            <img src={thumbnail} className='w-full h-full object-cover group-hover:scale-105 transition duration-300 cursor-pointer' alt="" />

            <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-3'>
                <h3 className='font-semibold text-white truncate'>{title}</h3>
                <p>{videos?.length} videos</p>
            </div>
            <button className='absolute bottom-2 right-4 p-2 rounded-full cursor-pointer bg-black/70 hover:bg-black transition ' onClick={handleSave}>
                {isSaved ? (<FaBookmark size={16}/>) : (<FaRegBookmark size={16}/>)}
                
            </button>

            <button className='absolute bottom-2 right-15 bg-black/70 p-2 rounded-full text-white hover:bg-black transition cursor-pointer' onClick={() => setShowVideos(true)}>
                <FaListUl size={16}/>
            </button>
        </div>  

        {showVideos && (
            <div className='fixed inset-0 bg-[#00000032] flex justify-center items-center z-50 backdrop-blur-sm'>
                <div className='bg-linear-to-br from-gray-900 via-black to-gray-900 rounded-2xl w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 max-h-[85vh] overflow-y-auto shadow-2xl p-6 border border-gray-700'>
                    <button className='absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer'>
                        <FaTimes size={24} onClick={() => setShowVideos(false)}/>
                    </button>

                    <h2 className='text-2xl font-extrabold mb-3 text-white flex items-center gap-2'>
                        {title} <span className='text-gray-400 font-normal'>- videos</span>
                    </h2>
                    <div className='h-0.5 bg-red-600 mb-6 rounded-full'></div>

                    <div className='flex items-center justify-around gap-5 flex-wrap'>
                        {videos?.map((v) => (
                            <VideoCard
                                key={v?._id}
                                id={v?._id}
                                thumbnail={v?.thumbnail}
                                duration={duration[v?._id] || "0:00"}
                                channelLogo={v?.channel.avatar}
                                title={v?.title}
                                channelName={v?.channel?.name}
                                views={v?.view}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )}
    </>
  )
}

export default PlaylistCard
