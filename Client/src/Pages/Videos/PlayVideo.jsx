import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/ytlogo.png';
import {
    FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute, FaExpand, FaThumbsUp, FaThumbsDown, FaDownload, FaBookmark, FaRegBookmark ,
    FaMicrophone,
    FaUserCircle
} from 'react-icons/fa';
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from '../../Components/ShortCard';
import Description from '../../Components/Description';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { serverUrl } from '../../App';
import axios from 'axios';
import Profile from '../../Components/Profile';



const IconButton = ({ icon, active, label, count, onClick }) => {
    // Ensure the icon is a valid React element
    const IconComponent = icon;
    
    return (
        <button className='flex flex-col items-center cursor-pointer' onClick={onClick}>
            <div className={`${active ? 'bg-white text-black' : 'bg-[#00000065] border border-gray-700'} p-3 rounded-full hover:bg-gray-700 transition-all ease-in-out`}>
                {React.isValidElement(icon) ? icon : <IconComponent size={20} className={`${active ? 'text-black' : 'text-white'}`} />}
            </div>
            <span className='text-xs mt-1'>{count !== undefined && `${count}`} {label}</span>
        </button>
    );
};

const PlayVideo = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const videoRef = useRef(null);
    const {videoId} = useParams();

    const {userData} = useSelector((state) => state.user);


    const [video, setVideo] = useState(null);
    const [channel, setChannel] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [vol, setVol] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [popup, setPopup] = useState(false);
    const [comment, setComment] = useState([]);
    const [newComment, setNewComment] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(channel?.subscribers?.some((sub) => sub._id?.toString() === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()));

    const {allVideosData, allShortsData} = useSelector((state) => state.content);

    const suggestedVideos = allVideosData?.filter((v) => v._id !== videoId)?.slice(0, 10);
    const suggestedShorts = allShortsData?.slice(0, 10) || [];

    useEffect(() => {
        if(!allVideosData) {
            return;
        }

        const currentVideo = allVideosData?.find((v) => v._id === videoId);

        if(currentVideo) {
            setVideo(currentVideo);
            setChannel(currentVideo?.channel);
            setComment(currentVideo?.comments);
        }

        const addViews = async () => {
            try {
                const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/add-view`, {}, {
                    withCredentials: true
                });
                setVideo((prev) => prev ? {...prev, view: result?.data?.view} : prev);

                // const updatedVideo = allVideosData?.find((v) => v._id === videoId ? {...prev, view: result?.data?.view} : v);
                // dispatch(setAllVideosData(updatedVideo));

            } catch (error) {
                console.log(error);
            }
        };
        addViews();

    }, [videoId, allVideosData]);

    const togglePlay = () => {
        if(!videoRef.current) {   
            return;
        }

        if(isPlaying) {
            videoRef.current.pause();

        } else {
            videoRef.current.play();
        }
    };

    const skipForward = () => {
        if(videoRef.current) {
            videoRef.current.currentTime += 5;
        }
    };
    const skipBackward = () => {
        if(videoRef.current) {
            videoRef.current.currentTime -= 5;
        }
    };

    const handleVolume = (e) => {
        const volume = parseFloat(e.target.value)
        setVol(volume);
        setIsMuted(volume === 0);
        if(videoRef.current) {
            videoRef.current.volume = volume;
        }
    };

    const handleMute = () => {
        if(!videoRef.current) {
            return;
        }
        setIsMuted(!isMuted);
        videoRef.current.muted = !isMuted;
    };

    const handleUpdateTime = () => {
        if(!videoRef.current) {
            return;
        }
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    };

    const formatTime = (time) => {
        if(isNaN(time)) {
            return '0:00';
        }
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const handleSeek = (e) => {
        if(!videoRef.current) {
            return;
        }
        const seekTime = (e.target.value / 100) * duration;
        videoRef.current.currentTime = seekTime;
        setProgress(e.target.value);
    };

    const handleFullScreen = () => {
        if(!videoRef.current) {
            return;
        }
        if(videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
        }
    };

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

    const toggleLike = async () => {
        try {
            const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-like`, {}, {
                withCredentials: true
            });
            setVideo(result.data);

        } catch (error) {
            console.log(error);
        }
    };

    const toggleDislike = async () => {
        try {
            const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-dislike`, {}, {
                withCredentials: true
            });
            setVideo(result.data);

        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = async () => {
        try {
            const result = await axios.put(`${serverUrl}/api/content/video/${videoId}/toggle-save`, {}, {
                withCredentials: true
            });
            setVideo(result.data);

        } catch (error) {
            console.log(error);

        }
    };

    const handleAddComment = async () => {
        if(!newComment) {
            return;
        }

        try {
            const result = await axios.post(`${serverUrl}/api/content/video/${videoId}/add-comment`, {message: newComment}, {
                withCredentials: true
            });
            setComment(prev => [result?.data?.comments?.slice(-1)[0], ...prev]);
            setNewComment('');
            
        } catch (error) {
            console.log(error);
        }
    };

    const handleReply = async ({commentId, replyText}) => {
        if(!replyText) {
            return;
        }
        try {
            const result = await axios.post(`${serverUrl}/api/content/video/${videoId}/add-reply/${commentId}`, {message: replyText}, {
                withCredentials: true
            });
            setComment(result.data?.comments);
            setNewComment('');
            
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        const addHistory = async () => {
            try {
                const result = await axios.post(`${serverUrl}/api/user/add-history`, {contentId: videoId, contentType: 'Video'}, {
                    withCredentials: true
                });
                
            } catch (error) {
                console.log(error);
            }
        };

        if(videoId) {
            addHistory();
        }
    }, [videoId]);


    useEffect(() => {
        setIsSubscribed(channel?.subscribers?.some((sub) => sub._id?.toString() === userData?._id?.toString() || sub?.toString() === userData?._id?.toString()));

    }, [channel?.subscribers, userData?._id]);


  return (
    <div className='flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6'>
        {/* Navbar */}
        <header className='bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50'>
            <div className='flex items-center justify-between'>
                 {/* left */}
                <div className='flex items-center gap-3 pl-2'>
                    <div>
                        <img src={logo} alt="" className=' h-8.5 cursor-pointer' onClick={() => navigate('/')}/>
                    </div>
                </div>
            
                {/* search */}
                <div className='hidden md:flex items-center gap-2 flex-1 max-w-2xl'>
                    <div className='flex flex-1 '>
                        <input type="text" className='flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700' placeholder='Search'/>
                        <button className='bg-[#272727] px-6 py-1 rounded-r-full border-gray-700 cursor-pointer'>
                            <FiSearch className='w-6 h-6'/>
                        </button>
                    </div>
                    <button className='bg-[#272727] p-2.5 rounded-full cursor-pointer'>
                        <FaMicrophone className='w-5 h-5'/>
                    </button>
                </div>
            
                {/* right */}
                <div className='flex items-center gap-3'>
                    {userData?.channel && <button className='hidden md:flex items-center gap-1 py-1 bg-[#272727] px-3 rounded-full cursor-pointer' onClick={() => navigate('/create-page')}>
                        <span className='text-lg'><FiPlus  className='h-6.5 w-6.5'/></span>
                        <span>Create</span>
                    </button>}
                    {userData?.photoUrl ? (
                        <img src={userData?.photoUrl} alt="" className='mr-2 w-8 h-8 hidden md:flex cursor-pointer rounded-full object-cover' onClick={() => setPopup(!popup)}/>
                    ) : (
                        <FaUserCircle className='mr-2 w-8 h-8 hidden md:flex text-gray-400 cursor-pointer' size={20} onClick={() => setPopup(!popup)}/>
                    )}
                    <FiSearch className='md:hidden text-lg flex cursor-pointer'/>
                </div>
            </div>

            {popup && <Profile/>}
        </header>

        <div className='flex-1'>

            {/* Video Player */}
            <div onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)} className='w-full aspect-video bg-black rounded-lg overflow-hidden relative mt-12'>
                <video 
                    src={video?.videoUrl} 
                    className='w-full h-full object-contain' 
                    controls={false} 
                    autoPlay   
                    ref={videoRef} 
                    onPlay={() => setIsPlaying(true)} 
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleUpdateTime}
                />
                {showControls && (
                    <div className='absolute inset-0 hidden lg:flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-300 z-20'>
                        <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-black/90 transition cursor-pointer' onClick={skipBackward}>
                            <FaBackward size={24}/>
                        </button>

                        <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-black/90 transition cursor-pointer' onClick={togglePlay}>
                            {isPlaying ? (
                                <FaPause size={28}/>
                            ) : (
                                <FaPlay size={28}/>
                            )}
                        </button>

                        <button className='bg-black/70 p-3 sm:p-4 rounded-full hover:bg-black/90 transition cursor-pointer' onClick={skipForward}>
                            <FaForward size={24}/>
                        </button>
                    </div>
                )}

                <div className='absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/60 to-transparent px-2 sm:px-4 py-2 z-30' onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
                    {showControls &&
                    <>
                        <input type="range" min={0} max={100} onChange={handleSeek} value={progress} className='w-full accent-red-500 h-1 cursor-pointer'/>

                        <div className='flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200'>
                            <div className='flex items-center gap-3'>
                                <button 
                                    className='bg-black/70 p-2.5 cursor-pointer rounded-full hover:bg-gray-900 transition-all ease-in-out' 
                                    onClick={skipBackward}
                                >
                                    <FaBackward size={15}/>
                                </button>

                                <button 
                                    className='bg-black/70 p-2.5 cursor-pointer rounded-full hover:bg-gray-900 transition-all ease-in-out' 
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? (
                                        <FaPause size={15}/>
                                    ) : (
                                        <FaPlay size={15}/>
                                    )}
                                </button>

                                <button 
                                    className='bg-black/70 p-2.5 cursor-pointer rounded-full hover:bg-gray-900 transition-all ease-in-out' 
                                    onClick={skipForward}
                                >
                                    <FaForward size={15}/>
                                </button>

                                <span className='bg-black/70 px-3 py-2 cursor-pointer rounded-full hover:bg-gray-900 transition-all ease-in-out'>
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>


                            <div className='flex items-center gap-2 sm:gap-3'>
                                <div className='hover:bg-gray-900 px-2 py-2 rounded-full flex items-center gap-2 sm:gap-3'>
                                    <button onClick={handleMute} className='cursor-pointer'>
                                        {isMuted ? (
                                            <FaVolumeMute size={15}/>
                                        ) : (
                                            <FaVolumeUp size={15}/>
                                        )}
                                    </button>

                                    <input type="range" value={isMuted ? 0 : vol} onChange={handleVolume} className='accent-white h-0.5 w-16 sm:w-24 cursor-pointer' min={0} max={1} step={0.1}/>
                                </div>

                                <button onClick={handleFullScreen} className='hover:bg-gray-900 px-3 py-2 rounded-full cursor-pointer'>
                                    <FaExpand size={15}/> 
                                </button>
                            </div>
                        </div>
                    </>
                    }
                </div>
            </div>

            <h1 className='mt-4 text-lg sm:text-xl font-bold text-white flex'>{video?.title}</h1>
            <div className='flex flex-wrap items-center justify-between sm:-mt-1.5 mt-1.5'>
                <div className='flex items-center justify-start gap-4'>
                    <img src={channel?.avatar} alt="" className='w-12 h-12 rounded-full' onClick={() => navigate(`/channel-page/${channel?._id}`)}/>
                    <div>
                        <h1 className='text-md font-bold' onClick={() => navigate(`/channel-page/${channel?._id}`)}>{channel?.name}</h1>
                        <h3 className='text-[13px] text-gray-400'>{channel?.subscribers?.length} subscribers</h3>
                    </div>

                    <button className={`px-5 py-2 rounded-4xl ml-5 text-md font-semibold ${isSubscribed ? 'bg-red-700 text-white hover:bg-white hover:text-black' : 'bg-white text-black hover:bg-red-600 hover:text-white'}  cursor-pointer transition-all ease-in-out`} onClick={handleSubcribe}>
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                    </button>
                </div>

                <div className='flex items-center gap-6 mt-3'>
                    <IconButton 
                        icon={<FaThumbsUp/>} 
                        label={'Likes'} 
                        active={video?.likes?.includes(userData?._id)} 
                        count={video?.likes?.length} 
                        onClick={toggleLike}
                    />
                    <IconButton 
                        icon={<FaThumbsDown/>} 
                        label={'Dislikes'} 
                        active={video?.dislikes?.includes(userData?._id)} 
                        count={video?.dislikes?.length} 
                        onClick={toggleDislike}
                    />
                    <IconButton 
                        icon={(video?.savedBy?.includes(userData?._id)) ? <FaBookmark /> : <FaRegBookmark />} 
                        label={(video?.savedBy?.includes(userData?._id)) ? 'Saved' : 'Save'} 
                        active={video?.savedBy?.includes(userData?._id)} 
                        onClick={handleSave}
                    />
                    <IconButton 
                        icon={<FaDownload/>} 
                        label={'Download'} 
                        onClick={() => {
                        const link = document.createElement('a'); 
                        link.href = video?.videoUrl;
                        link.download = `${video?.title}.mp4`;
                        link.click(); 
                    }}/>
                </div>
            </div>

            {/* Description */}
            <div className='sm:mt-1.5 mt-4 bg-[#1a1a1a] p-3 rounded-lg'>
                <h2 className='text-md font-semibold mb-2'>Description</h2>
                <p className='text-sm text-gray-400 mb-2'>{video?.view} views • {new Date(video?.createdAt)?.toLocaleDateString()}  </p>
                <Description text={video?.description}/>
            </div>

            {/* Comment Section */}
            <div className='mt-6'>
                <h2 className='text-lg font-semibold mb-3'>Comments</h2>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-4'>
                    <input type="text" placeholder='Add a comment...' className='flex-1 min-w-0 border border-gray-700 bg-[#1a1a1a] text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/70 focus:border-transparent' onChange={(e) => setNewComment(e.target.value)} value={newComment}/>
                    <button className='shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full cursor-pointer text-sm font-medium' onClick={handleAddComment}>
                        Comment
                    </button>
                </div>

                <div className='space-y-4 max-h-[min(28rem,50vh)] overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(75,85,99,0.6)_transparent]'>
                    {comment?.map((c) => (
                        <div key={c?._id} className='rounded-lg border border-gray-800/80 bg-[#1a1a1a] p-3 sm:p-4 text-sm'>
                            <div className='flex gap-3'>
                                <img src={c?.author?.photoUrl} alt="" className='h-10 w-10 shrink-0 rounded-full object-cover'/>
                                <div className='min-w-0 flex-1'>
                                    <h3 className='text-[13px] font-semibold text-gray-200'>@{c?.author?.userName}</h3>
                                    <p className='mt-1 text-[15px] leading-relaxed text-gray-100 wrap-break-words'>{c?.message}</p>
                                    <ReplySection comment={c} handleReply={handleReply}/>
                                </div>
                            </div>

                            {c?.replies?.length > 0 && (
                                <div className='mt-3 ml-0 border-l border-gray-700 pl-3 sm:ml-13 sm:pl-4'>
                                    <div className='space-y-3'>
                                        {c?.replies?.map((reply) => (
                                            <div key={reply?._id} className='flex gap-2.5 rounded-md bg-[#252525] px-2.5 py-2'>
                                                <img src={reply?.author?.photoUrl} alt="" className='h-8 w-8 shrink-0 rounded-full object-cover'/>
                                                <div className='min-w-0 flex-1'>
                                                    <h4 className='text-[12px] font-semibold text-gray-300'>@{reply?.author?.userName}</h4>
                                                    <p className='mt-0.5 text-[14px] leading-relaxed text-gray-100 wrap-break-words'>{reply?.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        

        <div className='w-full lg:w-95 px-4 py-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto mt-10'>
            <h2 className='flex items-center gap-2 font-bold text-lg mb-3'>
                <SiYoutubeshorts className='text-red-600'/>
                Shorts
            </h2>

            <div className='flex gap-3 overflow-x-auto scrollbar-hide pb-3'>
                {suggestedShorts?.map((short) => (
                    <div key={short?._id}>
                        <ShortCard 
                            shortUrl={short?.shortUrl}
                            title={short?.title}
                            channelName={short?.channel?.name}
                            avatar={short?.channel?.avatar}
                            id={short?._id}
                            views={short?.view}
                        />
                    </div>
                ))}
            </div>

            <div className='font-bold text-lg mt-4 mb-3'>
                Up Next
            </div>

            <div className='space-y-3'>
                {suggestedVideos?.map((video) => (
                    <div 
                        key={video._id} className='flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition'
                        onClick={() => navigate(`/play-video/${video._id}`)}
                    >
                        <img src={video?.thumbnail} className='w-32 sm:w-40 h-20 sm:h-24 rounded-lg object-cover' alt="" />
                        <div>
                            <p className='font-semibold line-clamp-2 test-sm sm:text-base text-white'>{video?.title}</p>
                            <p className='text-xs sm:text-sm text-gray-400'>{video?.channel?.name}</p>
                            <p className='text-xs sm:text-sm text-gray-400'>{video?.view} views</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
};


const ReplySection = ({comment, handleReply}) => {

    const [replyText, setReplyText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);

    return (
        <div className='mt-2 w-full'>
            <button
                type='button'
                onClick={() => setShowReplyInput(!showReplyInput)}
                className='text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-700/60 rounded-full py-1.5 px-3 -ml-1 transition-colors cursor-pointer'
            >
                Reply
            </button>

            {showReplyInput && (
                <div className='mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2'>
                    <input
                        type='text'
                        placeholder='Add a reply...'
                        onChange={(e) => setReplyText(e.target.value)}
                        value={replyText}
                        className='min-w-0 flex-1 rounded-lg border border-gray-600 bg-[#121212] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70'
                    />
                    <button
                        type='button'
                        onClick={() => {handleReply({commentId: comment?._id, replyText: replyText}); setShowReplyInput(false); setReplyText('')}}
                        className='shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-500 cursor-pointer'
                        disabled={!replyText?.trim()}
                    >
                        Reply
                    </button>
                </div>
            )}
        </div>
    )
};

export default PlayVideo;