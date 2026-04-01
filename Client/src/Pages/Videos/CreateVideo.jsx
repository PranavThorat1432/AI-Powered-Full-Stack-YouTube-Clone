import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MoonLoader from 'react-spinners/MoonLoader';
import { serverUrl } from '../../App';
import { showCustomAlert } from '../../Components/CustomAlert';
import { setAllVideosData } from '../../Redux/contentSlice';
import { setChannelData } from '../../Redux/userSlice';

const CreateVideo = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {allVideosData} = useSelector((state) => state.content);
  const {channelData} = useSelector((state) => state.user);

  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVideo = (e) => {
    setVideoUrl(e.target.files[0]);
  };

  const handleThumbnail = (e) => {
    setThumbnail(e.target.files[0]);
  };


  const handleUploadVideo = async () => {
    if (!channelData?._id) {
      CustomAlert('Channel not found. Please create a channel first!', 'error');
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
    formData.append('video', videoUrl);
    formData.append('thumbnail', thumbnail);
    formData.append('channelId', channelData?._id);
    
    try {
      const result = await axios.post(`${serverUrl}/api/content/create-video`, formData, {
        withCredentials: true,
      });
      dispatch(setAllVideosData([...allVideosData, result.data]));

      const updateChannel = {
        ...channelData, videos: [...(channelData.videos || []), result.data]
      };
      dispatch(setChannelData(updateChannel));

      setLoading(false);
      showCustomAlert('Video Uploaded Successfully!', 'success');
      navigate('/');
      
    } catch (error) {
      console.log(error);
      showCustomAlert('Video not supported, upload another video!');
      setLoading(false);
    }
  };


  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <div className='flex flex-1 justify-center items-center px-4 py-6'>

        <div className='bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6'>
          {/* Upload Video */}
          <label htmlFor="video" className='cursor-pointer border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center p-1 hover:border-red-500 transition'>
            <input type="file" id='video' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none' accept='video/*' onChange={handleVideo}/>
          </label>

          {/* Title */}
          <label htmlFor="title">Title <span className='text-red-500'>*</span></label>
          <input type="text" id='title' placeholder='Title of the Video' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none' onChange={(e) => setTitle(e.target.value)} value={title}/>

          {/* Description */}
          <label htmlFor="description">Description <span className='text-red-500'>*</span></label>
          <textarea placeholder='Description of the Video' id='description' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none' onChange={(e) => setDescription(e.target.value)} value={description}/>

          {/* Tags */}
          <label htmlFor="tags">Tags <span className='text-red-500'>*</span></label>
          <input type="text" placeholder='Tags' id='tags' className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none' onChange={(e) => setTags(e.target.value)} value={tags}/>

          {/* Upload Thumbnail */}
          <label htmlFor="thumbnail" className='block cursor-pointer'>
            Thumbnail <span className='text-red-500'>*</span>
            {
              thumbnail ? (
                <img src={URL.createObjectURL(thumbnail)} className='w-full  border rounded-lg border-gray-700 mb-2 object-cover' alt="thumbnail" />
              ) : (
                <div className='w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2'>
                  Click to Upload Thumbnail
                </div>
              )
            }
            <input type="file" id='thumbnail'className='hidden' accept='image/*' onChange={handleThumbnail}/>
          </label>

          <button className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={!title || !description || !tags || loading || !videoUrl || !thumbnail} onClick={handleUploadVideo}>
            {loading ? (
                <>
                    <MoonLoader size={20} color="#ffffff" />
                    <span className='text-center text-gray-300 text-sm animate-pulse'>Uploading Video...</span>
                </>
            ) : 'Upload Video'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateVideo
