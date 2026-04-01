import React, { useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa';
import MoonLoader from 'react-spinners/MoonLoader';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { data, useNavigate } from 'react-router-dom';
import { showCustomAlert } from '../../Components/CustomAlert';
import { setAllShortsData } from '../../Redux/contentSlice';
import { setChannelData } from '../../Redux/userSlice';


const CreateShort = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {allShortsData} = useSelector((state) => state.content);
  const {channelData} = useSelector((state) => state.user);
  

  const [shortUrl, setShortUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);


  const handleUploadShort = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));
    formData.append('shortUrl', shortUrl);
    formData.append('channelId', channelData?._id);

    try {
      const result = await axios.post(`${serverUrl}/api/content/create-short`, formData, {
        withCredentials: true
      });
      dispatch(setAllShortsData([...allShortsData, result.data]));

      const updateChannel = {
        ...channelData, shorts: [...(channelData.shorts || []), result.data]
      };
      dispatch(setChannelData(updateChannel));

      setLoading(false);
      showCustomAlert('Short Uploaded Successfully!', 'success');
      navigate('/');

    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Failed to upload short. Please try again.';
      showCustomAlert(errorMessage, 'error');
    }
  };


  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
      <main className='flex flex-1 justify-center items-center px-4 py-6'>
        <div className='bg-[#212121] p-6 rounded-xl w-full max-w-3xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Left Side */}
          <div className='flex justify-center items-start'>
            <label htmlFor="short" className='flex flex-col items-center justify-center border-2 border-dashed hover:border-red-400 border-gray-500 rounded-lg cursor-pointer bg-[#181818] overflow-hidden w-55 aspect-9/16'>
              {
                shortUrl ? (
                  <video src={URL.createObjectURL(shortUrl)} className='w-full h-full object-cover' controls/>
                ) : (
                  <div className='flex flex-col justify-center items-center gap-1'>
                    <FaCloudUploadAlt className='text-4xl text-gray-400 mb-2'/>
                    <p className='text-gray-300 text-xs text-center px-2'>Click here to upload a short video</p>
                    <span className='text-[11px] text-center text-gray-500'>MP4 or MOV - Max 60s</span>
                  </div>
                )
              }
              <input type="file" id='short' onChange={(e) => setShortUrl(e.target.files[0])} className='hidden' accept='video/mp4, video/quicktime'/>
            </label>
          </div>

          {/* Right Side */}
          <div className='flex flex-col space-y-4'>
            {/* Title */}
            <label htmlFor="title">Title <span className='text-red-500'>*</span></label>
            <input type="text" id='title' placeholder='Title' className='w-full p-3 bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none rounded-lg' onChange={(e) => setTitle(e.target.value)} value={title}/>

            {/* Description */}
            <label htmlFor="description">Description </label>
            <textarea id='description' placeholder='Description' className='w-full p-3 bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none rounded-lg' onChange={(e) => setDescription(e.target.value)} value={description}/>

            {/* Tags */}
            <label htmlFor="tags">Tags (Comma ' , ' separated) <span className='text-red-500'>*</span></label>
            <input type='text' id='tags' placeholder='Tags' className='w-full p-3 bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none rounded-lg' onChange={(e) => setTags(e.target.value)} value={tags}/>

            <button className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={!title || !shortUrl || !tags || loading} onClick={handleUploadShort}>
            {loading ? (
                <>
                    <MoonLoader size={20} color="#ffffff" />
                    <span className='text-center text-gray-300 text-sm animate-pulse'>Uploading Short...</span>
                </>
            ) : 'Upload Short'}
          </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CreateShort
