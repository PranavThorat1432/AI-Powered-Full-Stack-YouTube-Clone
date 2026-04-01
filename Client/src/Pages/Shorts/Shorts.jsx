import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
    FaPlay, 
    FaPause, 
    FaThumbsUp, 
    FaThumbsDown, 
    FaDownload, 
    FaBookmark, 
    FaRegBookmark ,
    FaArrowDown,
    FaComment
} from 'react-icons/fa';
import Description from '../../Components/Description';
import axios from 'axios';
import { serverUrl } from '../../App';
import { useNavigate } from 'react-router-dom';


const Shorts = () => {

  const navigate = useNavigate();

  const {allShortsData} = useSelector((state) => state.content);
  const {userData} = useSelector((state) => state.user);

  const [shortList, setShortList] = useState([]);
  const [playIndex, setPlayIndex] = useState(null);
  const [openComment, setOpenComment] = useState(false);
  const [viewedShort, setViewedShort] = useState([]);
  const [comment, setComment] = useState([]);
  const [newComment, setNewComment] = useState([]);
  const [reply, setReply] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  const shortRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries?.forEach((entry) => {
        const index = Number(entry.target.dataset.index);
        const video = shortRef.current[index];
        if(video ) {
          if(entry.isIntersecting) {
            video.muted = false
            video.play();
            setActiveIndex(index);

            const currentShortId = shortList[index]?._id;
            if(!viewedShort.includes(currentShortId)) {
              handleAddView(currentShortId);
              setViewedShort((prev) => [...prev, currentShortId]);
            }

          } else {
            video.muted = true
            video.pause();
          }
        }
      })
    }, {
      threshold: 1
    });

    shortRef.current?.forEach((video) => {
      if(video) {
        observer.observe(video);
      }
    })

    return () => {
      observer.disconnect();
    }
  }, [shortList]);

  useEffect(() => {
    if(!allShortsData || allShortsData?.length === 0) {
      return;
    }

    const shuffled = [...allShortsData].sort(() => Math.random() - 0.5);
    setShortList(shuffled);

  }, [allShortsData]);


  const togglePlay = (index) => {
    const video = shortRef.current[index];
    if(video) {
      if(video.paused) {
        video.play();
        setPlayIndex(null);
        
      } else {
        video.pause();
        setPlayIndex(index);
      }
    };
  };

  
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

  const handleSubscribe = async (channelId) => {
    try {
      const result = await axios.post(`${serverUrl}/api/user/toggle-subscribe`, {channelId}, {
        withCredentials: true
      });

      const updatedChannel = result.data;
      setShortList((prev) => prev.map((short) => short?.channel?._id === channelId ? {...short, channel: updatedChannel} : short));

    } catch (error) {
      console.log(error);
    }
  };

  const toggleLike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-like`, {}, {
        withCredentials: true
      });

      const updatedShort = result.data;
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short));

    } catch (error) {
      console.log(error);
    }
  };

  const toggleDislike = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-dislike`, {}, {
        withCredentials: true
      });

      const updatedShort = result.data;
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short));

    } catch (error) {
      console.log(error);
    }
  };

  const toggleSave = async (shortId) => {
    try {
      const result = await axios.put(`${serverUrl}/api/content/short/${shortId}/toggle-save`, {}, {
        withCredentials: true
      });

      const updatedShort = result.data;
      setShortList((prev) => prev.map((short) => short?._id === updatedShort?._id ? updatedShort : short));

    } catch (error) {
      console.log(error);
    }
  };


  const handleAddView = async (shortId) => {
    try {
      await axios.put(`${serverUrl}/api/content/short/${shortId}/add-view`, {}, {
        withCredentials: true
      });

    } catch (error) {
      console.log(error);
    }
  };


  const handleAddComment = async (shortId) => {
    if(!newComment) {
      return;
    }

    try {
      const result = await axios.post(`${serverUrl}/api/content/short/${shortId}/add-comment`, {message: newComment}, {
        withCredentials: true
      });
      setComment((prev) => ({...prev, [shortId]: result?.data?.comments || []}));
      setNewComment('');
            
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddReply = async ({commentId, replyText, shortId}) => {
    if(!replyText) {
      return;
    }
        
    try {
      const result = await axios.post(`${serverUrl}/api/content/short/${shortId}/add-reply/${commentId}`, {message: replyText}, {
        withCredentials: true
      });

      setComment((prev) => ({...prev, [shortId]: result?.data?.comments || []}));
      setReplyText((prev) => ({...prev, [commentId]: ''}));
      setNewComment('');
            
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    const addHistory = async () => {
      try {
        const shortId = shortList[activeIndex]?._id;
        if(!shortId) {
          return;
        }

        const result = await axios.post(`${serverUrl}/api/user/add-history`, {contentId: shortId, contentType: 'Short'}, {
          withCredentials: true
        });
                
      } catch (error) {
        console.log(error);
      }
    };

    if(shortList?.length > 0) {
      addHistory();
    }
  }, [activeIndex, shortList]);


  return (
    <div className='h-screen w-full overflow-y-scroll snap-y snap-mandatory'>
      {
        shortList?.map((short, index) => (
          <div key={short?._id} className='min-h-screen w-full flex md:items-center items-start  justify-center snap-start pt-10 md:pt-0'>
            <div className='relative w-105 md:w-87.5 aspect-9/16 bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer mt-10 md:mt-0' onClick={() => togglePlay(index)}>
              <video 
                src={short?.shortUrl} 
                ref={(el) => (shortRef.current[index] = el)}
                data-index={index}
                muted
                className='w-full h-full object-cover'
                loop
                playsInline
              />
              
              {
                playIndex === index && (
                  <div className='absolute top-3 right-3 bg-black/60 rounded-full p-2'>
                    <FaPlay className='text-white text-lg'/>
                  </div>
                )
              }

              {
                playIndex !== index && (
                  <div className='absolute top-3 right-3 bg-black/60 rounded-full p-2'>
                    <FaPause className='text-white text-lg'/>
                  </div>
                )
              }

              <div className='absolute bottom-0 left-0 right-0 p-4 md:bg-transparent bg-linear-to-t from-black/80 via-black/40 to-transparent text-white space-y-1'>
                <div className='flex items-center justify-start gap-2'>
                  <img src={short?.channel?.avatar} className='w-8 h-8 rounded-full' alt="" onClick={() => navigate(`/channel-page/${short?.channel?._id}`)}/>
                  <span className='text-sm text-gray-300' onClick={() => navigate(`/channel-page/${short?.channel?._id}`)}>
                    @{short?.channel?.name}
                  </span>
                  <button className={`${short?.channel?.subscribers?.includes(userData?._id) ? 'bg-[#000000a1] text-white ' : 'bg-white text-black'} text-xs px-2.5 py-2 rounded-full cursor-pointer`} onClick={() => handleSubscribe(short?.channel?._id)}>
                    {short?.channel?.subscribers?.includes(userData?._id) ? 'Unsubscribe' : 'Subscribe'}
                  </button>
                </div>

                <div className='flex items-center justify-start'>
                  <h3 className='font-bold text-lg line-clamp-2'>
                    {short?.title}
                  </h3>
                </div>

                <div>
                  {short?.tags?.map((tag, index) => (
                    <span key={index} className='bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded-full'>
                      {tag}
                    </span>
                  ))}
                </div>

                <Description text={short?.description}/>
              </div>

              <div className='absolute right-3 bottom-28 flex flex-col items-center gap-2.5 text-white'>
                  <IconButton 
                      icon={<FaThumbsUp/>} 
                      label={'Likes'} 
                      active={short?.likes?.includes(userData?._id)} 
                      count={short?.likes?.length} 
                      onClick={() => toggleLike(short?._id)}
                  />
                  <IconButton 
                      icon={<FaThumbsDown/>} 
                      label={'Dislikes'} 
                      active={short?.dislikes?.includes(userData?._id)} 
                      count={short?.dislikes?.length} 
                      onClick={() => toggleDislike(short?._id)}
                  />
                  <IconButton 
                      icon={<FaComment/>} 
                      label={'Comment'} 
                      count={short?.comments?.length} 
                      onClick={() => {setOpenComment(prev => !prev); setComment((prev) => ({...prev, [short._id]: short.comments}))}}
                  />
                  <IconButton 
                      icon={(short?.savedBy?.includes(userData?._id)) ? <FaBookmark /> : <FaRegBookmark />} 
                      label={(short?.savedBy?.includes(userData?._id)) ? 'Saved' : 'Save'} 
                      active={short?.savedBy?.includes(userData?._id)} 
                      onClick={() => toggleSave(short?._id)}
                  />
                  <IconButton 
                      icon={<FaDownload/>} 
                      label={'Download'} 
                      onClick={() => {
                      const link = document.createElement('a'); 
                      link.href = short?.shortUrl;
                      link.download = `${short?.title}.mp4`;
                      link.click(); 
                  }}/>
              </div>

              {
                openComment && (
                  <div className='absolute bottom-0 left-0 right-0 h-[60%] bg-black/95 text-white p-4 rounded-t-2xl overflow-y-auto'>
                    <div className='flex justify-between items-center mb-3'>
                      <h3 className='font-bold text-lg'>Comments</h3>
                      <button className='cursor-pointer' onClick={() => setOpenComment(prev => !prev)}>
                        <FaArrowDown size={20}/>
                      </button>
                    </div>

                    <div className='mt-4 flex gap-2'>
                      <input type="text" placeholder='Add a comment...' className='flex-1 bg-gray-900 text-white p-2 rounded outline-none border-none' onChange={(e) =>setNewComment(e.target.value)} value={newComment}/>
                      <button className='bg-black px-4 py-2 border border-gray-700 rounded-xl cursor-pointer' onClick={() => handleAddComment(short?._id)}>
                        Comment
                      </button>
                    </div>

                    <div className='space-y-3 mt-4'>
                      {
                        comment[short._id]?.length > 0 ? (
                          comment[short?._id]?.map((c) => (
                            <div key={c?._id} className='bg-gray-800/40 p-2 rounded-lg'>
                              <div className='flex items-center gap-2 mb-1'>
                                <img src={c?.author?.photoUrl} alt="" className='w-6 h-6 rounded-full'/>
                                <h3 className='text-sm font-semibold'>{c?.author?.userName}</h3>
                              </div>
                              <p className='text-sm ml-8'>{c?.message}</p>
                              <button onClick={() => setReply(!reply)} className='cursor-pointer text-sm ml-8 mt-2 text-red-500'>Reply</button>

                              {reply && (<div className='mt-2 ml-8 flex gap-1'>
                                <input type="text" className='w-full bg-gray-900 text-white text-sm p-2 rounded border-none outline-none' placeholder='Add a reply...' onChange={(e) => setReplyText((prev) => ({
                                  ...prev, [c._id]: e.target.value
                                }))} value={replyText[c._id] || ''}/>
                                <button 
                                  className='mt-1 px-3 py-1 rounded text-xs cursor-pointer bg-red-500' 
                                  onClick={() => {handleAddReply({shortId: short?._id, commentId: c._id, replyText:replyText[c._id]}); setReplyText((prev) => ({...prev, [c._id]: ''}))}}
                                >
                                  Reply
                                </button>
                              </div>)}


                              <div className='ml-12 mt-2 space-y-2'>
                                {comment?.replies?.map((r) => (
                                  <div key={r?._id} className='bg-gray-800/40 p-2 rounded-lg'>
                                    <div className='flex items-center gap-2 mb-1'>
                                      <img src={r?.author?.photoUrl} alt="" className='w-6 h-6 rounded-full'/>
                                      <h3 className='text-sm font-semibold'>{r?.author?.userName}</h3>
                                    </div>
                                    <p className='text-sm ml-8'>{r?.message}</p>
                                  </div>  
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className='text-sm text-gray-400 text-center'>No comments yet.</p>
                        )
                      }
                    </div>
                  </div>
                )
              }
            </div>

          </div>
        ))
      }
    </div>
  )
}

export default Shorts;