import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { setChannelData } from '../Redux/userSlice';
import { showCustomAlert } from './CustomAlert';

const Content = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {channelData} = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('Videos');

  const handleDeletePost = async (postId) => {
    if(!window.confirm('Are you sure want to delete this post?'));

    try {
      await axios.delete(`${serverUrl}/api/content/delete-post/${postId}`, {
        withCredentials: true
      });

      // update redux state by filtering out deleted posts
      const updatedPosts = channelData.communityPosts.filter((p) => p._id !== postId);
      dispatch(setChannelData({ ...channelData, communityPosts: updatedPosts }));
      
      showCustomAlert('Post Deleted!');

    } catch (error) {
      console.log(error);
      showCustomAlert('Error deleting post. Please try again.', 'error');
    }
  };

  return (
    <div className='text-white min-h-screen pt-5 px-4 sm:px-6 mb-16'>
      <div className='flex flex-wrap gap-6 border-b border-gray-800 mb-6'>
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

      <div className='space-y-8'>
        {/* Videos */}
        {activeTab === 'Videos' && (
          <div>
            {/* For Large Devices / Screens */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='min-w-full border border-gray-700 rounded-lg'>
                <thead className='bg-gray-800 text-sm'>
                  <tr>
                    <th className='p-3 text-left'>Thumbnail</th>
                    <th className='p-3 text-left'>Title</th>
                    <th className='p-3 text-left'>Views</th>
                    <th className='p-3 text-left'>Edits</th>
                  </tr>
                </thead>

                <tbody>
                  {channelData?.videos?.map((v) => (
                    <tr key={v?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                      <td className='p-3'>
                        <img src={v?.thumbnail} className='w-22 h-12 rounded object-cover' alt="" />
                      </td>
                      <td className='p-3 text-start'>{v?.title}</td>
                      <td className='p-3 text-start'>{v?.view}</td>
                      <td className='p-3' onClick={() => navigate(`/yt-studio/update-video/${v?._id}`)}><FaEdit className='cursor-pointer hover:text-red-500'/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* For Smaller Devices / Screens */}
            <div className='grid gap-4 md:hidden'>
              {channelData?.videos?.map((v) => (
                <div 
                  key={v?._id}
                  className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border border-gray-600'
                >
                  <img src={v?.thumbnail} className='w-full h-44 object-cover' alt={v.title} />

                  <div className='flex-1  py-4'>
                    <h3 className='text-base font-semibold text-start pl-1.5'>{v.title}</h3>
                  </div>

                  <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                    <span>{v.view} views</span>
                    <FaEdit className='cursor-pointer hover:text-red-500' onClick={() => navigate(`/yt-studio/update-video/${v?._id}`)}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Shorts */}
        {activeTab === 'Shorts' && (
          <div>
            {/* For Large Devices / Screens */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='min-w-full border border-gray-700 rounded-lg'>
                <thead className='bg-gray-800 text-sm'>
                  <tr>
                    <th className='p-3 text-left'>Preview</th>
                    <th className='p-3 text-left'>Title</th>
                    <th className='p-3 text-left'>Views</th>
                    <th className='p-3 text-left'>Edits</th>
                  </tr>
                </thead>

                <tbody>
                  {channelData?.shorts?.map((s) => (
                    <tr key={s?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                      <td className='p-3'>
                        <video src={s?.shortUrl} className='w-16 h-24 bg-black rounded' muted playsInline alt="" />
                      </td>
                      <td className='p-3 text-start'>{s?.title}</td>
                      <td className='p-3 text-start'>{s?.view}</td>
                      <td className='p-3' onClick={() => navigate(`/yt-studio/update-short/${s?._id}`)}><FaEdit className='cursor-pointer hover:text-red-500'/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* For Smaller Devices / Screens */}
            <div className='grid gap-4 md:hidden'>
              {channelData?.shorts?.map((s) => (
                <div 
                  key={s?._id}
                  className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border border-gray-600'
                >
                  <video src={s?.shortUrl} className='w-full aspect-9/16 object-cover' muted playsInline controls alt="" />

                  <div className='flex-1  py-4'>
                    <h3 className='text-base font-semibold text-start pl-2'>{s.title}</h3>
                  </div>

                  <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                    <span>{s.view} views</span>
                    <FaEdit className='cursor-pointer hover:text-red-500' onClick={() => navigate(`/yt-studio/update-short/${s?._id}`)}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Playlists */}
        {activeTab === 'Playlists' && (
          <div>
            {/* For Large Devices / Screens */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='min-w-full border border-gray-700 rounded-lg'>
                <thead className='bg-gray-800 text-sm'>
                  <tr>
                    <th className='p-3 text-left'>Preview</th>
                    <th className='p-3 text-left'>Title</th>
                    <th className='p-3 text-left'>Total Videos</th>
                    <th className='p-3 text-left'>Edits</th>
                  </tr>
                </thead>

                <tbody>
                  {channelData?.playlists?.map((pl) => (
                    <tr key={pl?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                      <td className='p-3'>
                        <img src={pl?.videos[0]?.thumbnail} className='w-22 h-12 rounded object-cover' alt="" />
                      </td>
                      <td className='p-3 text-start'>{pl?.title}</td>
                      <td className='p-3 text-start'>{pl?.videos?.length}</td>
                      <td className='p-3' onClick={() => navigate(`/yt-studio/update-playlist/${pl?._id}`)}><FaEdit className='cursor-pointer hover:text-red-500'/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* For Smaller Devices / Screens */}
            <div className='grid gap-4 md:hidden'>
              {channelData?.playlists?.map((pl) => (
                <div 
                  key={pl?._id}
                  className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border border-gray-500'
                >
                  <img src={pl?.videos[0]?.thumbnail} className='w-full h-44 object-cover' alt="" />

                  <div className='flex-1  py-4'>
                    <h3 className='text-base font-semibold text-start pl-2'>{pl.title}</h3>
                  </div>

                  <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                    <span>{pl.videos.length} {pl.videos.length > 1 ? 'videos' : 'video'}</span>
                    <FaEdit className='cursor-pointer hover:text-red-500' onClick={() => navigate(`/yt-studio/update-playlist/${pl?._id}`)}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Community Posts */}
        {activeTab === 'Community' && (
          <div>
            {/* For Large Devices / Screens */}
            <div className='hidden md:block overflow-x-auto'>
              <table className='min-w-full border border-gray-700 rounded-lg'>
                <thead className='bg-gray-800 text-sm'>
                  <tr>
                    <th className='p-3 text-left'>Image</th>
                    <th className='p-3 text-left'>Post</th>
                    <th className='p-3 text-left'>Date</th>
                    <th className='p-3 text-left'>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {channelData?.communityPosts?.map((p) => (
                    <tr key={p?._id} className='border-t border-gray-700 hover:bg-gray-800/40'>
                      <td className='p-3'>
                        <img src={p?.image} className='w-22 h-12 rounded object-cover' alt="Post Image" />
                      </td>
                      <td className='p-3 text-start'>{p?.content}</td>
                      <td className='p-3 text-start'>{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className='p-3'><MdDelete className='cursor-pointer hover:text-red-500 h-5 w-5' onClick={() => handleDeletePost(p._id)}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* For Smaller Devices / Screens */}
            <div className='grid gap-4 md:hidden'>
              {channelData?.communityPosts?.map((p) => (
                <div 
                  key={p?._id}
                  className='bg-[#1c1c1c] rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col border border-gray-500'
                >
                  <img src={p?.image} className='w-full h-44 object-cover' alt="Post Image" />

                  <div className='flex-1  py-4'>
                    <h3 className='text-base font-semibold text-start pl-2'>{p.content}</h3>
                  </div>

                  <div className='px-4 py-3 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400'>
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    <MdDelete className='cursor-pointer hover:text-red-500 w-5 h-5' onClick={() => handleDeletePost(p._id)}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>   
    </div>
  )
};

export default Content;