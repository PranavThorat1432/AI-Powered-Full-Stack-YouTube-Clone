import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showCustomAlert } from '../../Components/CustomAlert';
import axios from 'axios';
import { serverUrl } from '../../App';
import { useNavigate } from 'react-router-dom';
import { setChannelData } from '../../Redux/userSlice';
import MoonLoader from 'react-spinners/MoonLoader';


const CreatePlaylist = () => {
  
  const {channelData} = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoData, setVideoData] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleVideoSelection = (videoId) => {
    setSelectedVideos((prev) => prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]);
  };

  useEffect(() => {
    if(channelData && channelData?.videos) {
      setVideoData(channelData?.videos);
    }
  }, [channelData]);


  const handleCreatePlaylist = async () => {
    setLoading(true);

    if(selectedVideos?.length === 0) {
      showCustomAlert('Please select at least one video to create a playlist.');
      setLoading(false);
      return;
    }
    
    try {
      const result = await axios.post(`${serverUrl}/api/content/create-playlist`, {
        title, 
        description, 
        videoIds: selectedVideos,
        channelId: channelData?._id
      }, {
        withCredentials: true
      });
      const updateChannel = {
        ...channelData, playlists: [...(channelData.playlists || []), result.data]
      };
      dispatch(setChannelData(updateChannel));
      setLoading(false);
      showCustomAlert('Playlist Created!');
      navigate('/');

    } catch (error) {
      console.log(error);
      setLoading(false);
      showCustomAlert('Error creating playlist. Please try again.', 'error');
    }
  };


  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <main className='flex flex-1 justify-center items-center px-4 py-6'>
        <div className='bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6'>
          <label htmlFor="title">Title <span className='text-red-500'>*</span></label>
          <input type="text" id='title' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none' placeholder='Playlist Title' onChange={(e) => setTitle(e.target.value)} value={title}/>
          
          <label htmlFor="description">Description <span className='text-red-500'>*</span></label>
          <textarea type="text" id='description' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none' placeholder='Playlist Description' onChange={(e) => setDescription(e.target.value)} value={description}/> 

          <div>
            <p className='mb-3 text-lg font-semibold'>Select Videos</p>

            {videoData?.length === 0 ? (
              <p className='text-sm text-gray-400'>No videos found.</p>
            ) : (
              <div className='grid grid-cols-2 gap-4 max-h-72 overflow-y-auto'>
                {videoData?.map((video) => (
                  <div key={video._id} onClick={() => toggleVideoSelection(video._id)} className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedVideos.includes(video._id) ? 'border-red-500' : 'border-gray-700'} `}>
                    <img src={video?.thumbnail} className='w-full h-42 object-cover' alt="" />
                    <p className='p-2 text-sm truncate'>{video?.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button disabled={!title || !description || loading} className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer gap-3' onClick={handleCreatePlaylist}>
            {loading ? (
              <>
                <MoonLoader size={20} color="#ffffff" />
                <span className='text-center text-gray-300 text-sm animate-pulse'>Creating Playlist...</span>
              </>
            ) : 'Create Playlist'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default CreatePlaylist
