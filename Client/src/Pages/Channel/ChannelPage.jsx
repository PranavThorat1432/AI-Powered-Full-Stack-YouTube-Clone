import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { serverUrl } from '../../App';
import VideoCard from '../../Components/VideoCard';
import ShortCard from '../../Components/ShortCard';
import PlaylistCard from '../../Components/PlaylistCard';
import PostCard from '../../Components/PostCard';

const ChannelPage = () => {

    const {channelId} = useParams();

    const {allChannelData, userData} = useSelector((state) => state.user);

    const channelData = allChannelData?.find((c) => c._id === channelId);

    const [channel, setChannel] = useState(channelData);
    const [activeTab, setActiveTab] = useState('Videos');
    const [duration, setDuration] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(channel?.subscribers?.some((sub) => sub._id?.toString() === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()));

    const handleSubcribe = async () => {
        if(!channel._id) {
            return;
        }
    
        try {
            const result = await axios.post(`${serverUrl}/api/user/toggle-subscribe`, {channelId: channel?._id}, {
                withCredentials: true
            });
            setChannel((prev) => ({
                ...prev, subscribers: result?.data?.subscribers || prev?.subscribers
            }));
    
        } catch (error) {
            console.log(error);
        }
    };

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
        if(Array.isArray(channel?.videos) && channel?.videos?.length > 0) {
            channel?.videos.forEach((videos) => {
                getVideoDuration(videos?.videoUrl, (formatedTime) => {
                    setDuration((prev) => ({...prev, [videos._id]: formatedTime}));
                });
            });
        }
    }, [channel?.videos]);   


    useEffect(() => {
        setIsSubscribed(channel?.subscribers?.some((sub) => sub._id?.toString() === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()));

    }, [channel?.subscribers, userData?._id]);


  return (
    <div className='text-white min-h-screen pt-2.5 mt-10'>
        {/* Banner */}
        <div className='relative'>
            <img src={channel?.banner} className='w-full h-60 object-cover' alt="" />
            <div className='absolute inset-0 bg-linear-to-t from-black/70 to-transparent'></div>
        </div>

        {/* Channel Info */}
        <div className='relative flex items-center gap-6 p-6 rounded-xl bg-linear-to-r from-gray-900 via-black to-gray-900 shadow-xl flex-wrap '>
            <div>
                <img src={channel?.avatar} className='rounded-full w-28 h-28 shadow-lg hover:scale-105 transition-transform duration-500' alt="" />
            </div>

            <div className='flex-1'>
                <h1 className='text-3xl font-extrabold tracking-wide'>
                    {channel?.name}
                </h1>
                <p className='text-gray-400 mt-1'>
                    <span className='font-semibold text-white'>{channel?.subscribers?.length}</span> Subscribers 
                    <span> • </span> 
                    <span className='font-semibold text-white'>{channel?.videos?.length}</span> Videos
                </p>

                <p className='text-gray-300 text-sm mt-2 line-clamp-2'>{channel?.category}</p>
            </div>

            <button className={`px-5 py-2 rounded-4xl ml-5 text-md font-semibold ${isSubscribed ? 'bg-red-700 text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-red-600 hover:text-white'}  cursor-pointer transition-all ease-in-out`} onClick={handleSubcribe}>
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
            </button>
        </div>

        {/* Tabs */}
        <div className='flex gap-8 px-6 border-b border-gray-800 mb-6 relative mt-5 '>
            {['Videos', 'Shorts', 'Playlists', 'Community'].map((tab) => (
                <button 
                    key={tab}
                    className={`pb-3 relative font-medium transition ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'} cursor-pointer hover:scale-105`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab} 
                    {activeTab === tab && (
                        <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full'></span>
                    )}
                </button>
            ))}
        </div>

        <div className='px-6 space-y-8'>
            {activeTab === 'Videos' && (
                <div className='flex flex-wrap gap-5 pb-10'>
                    {channel?.videos?.map((v) => (
                        <VideoCard
                            key={v?._id}
                            id={v?._id}
                            thumbnail={v?.thumbnail}
                            duration={duration[v?._id] || "0:00"}
                            channelLogo={channel.avatar}
                            title={v?.title}
                            channelName={channel?.name}
                            views={v?.view}
                        />
                    ))}
                </div>
            )}

            {activeTab === 'Shorts' && (
                <div className='flex flex-wrap gap-5 pb-10'>
                    {channel?.shorts?.map((s) => (
                        <ShortCard
                            key={s?._id}
                            id={s?._id}
                            shortUrl={s?.shortUrl}
                            channelLogo={channel.avatar}
                            title={s?.title}
                            channelName={channel?.name}
                            views={s?.view}
                            avatar={channel?.avatar}
                        />
                    ))}
                </div>
            )}

            {activeTab === 'Playlists' && (
                <div className='flex flex-wrap gap-5 pb-10'>
                    {channel?.playlists?.map((p) => (
                        <PlaylistCard
                            key={p?._id}
                            id={p?._id}
                            title={p?.title}
                            videos={p?.videos}
                            savedBy={p?.savedBy}
                        />
                    ))}
                </div>
            )}

            {activeTab === 'Community' && (
                <div className='flex flex-wrap gap-5 pb-10'>
                    {channel?.communityPosts?.map((p) => (
                        <PostCard
                            key={p?._id}
                            post={p}
                        />
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default ChannelPage
