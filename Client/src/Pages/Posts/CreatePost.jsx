import axios from 'axios';
import React, { useState } from 'react'
import { FaImage } from 'react-icons/fa';
import MoonLoader from 'react-spinners/MoonLoader';
import { serverUrl } from '../../App';
import { showCustomAlert } from '../../Components/CustomAlert';
import { useDispatch, useSelector } from 'react-redux';
import { setChannelData } from '../../Redux/userSlice';
import { useNavigate } from 'react-router-dom';
const CreatePost = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const {channelData} = useSelector((state) => state.user);

  const handleCreatePost = async () => {
    if(!content) {
      showCustomAlert('Post content cannot be empty.');
      return;
    }

    const formData = new FormData();
    formData.append('channelId', channelData?._id);
    formData.append('content', content);
    if(image) formData.append('image', image);

    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/content/create-post`, formData, {
        withCredentials: true
      });
      console.log(result.data);
      const updateChannel = {
        ...channelData, posts: [...(channelData.posts || []), result.data]
      };
      dispatch(setChannelData(updateChannel));
      showCustomAlert('Post Created!');
      setLoading(false);
      setContent('');
      setImage('');
      navigate('/');

    } catch (error) {
      console.log(error);
      showCustomAlert('Failed to create post. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5 items-center justify-center'>
      <div className='bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-4'>
        <textarea 
          className='w-full p-3 rounded-lg bg-[#121212] border border-gray-700 text-white focus:ring focus:ring-red-500 focus:outline-none h-28' 
          placeholder='Write something for your community...'
          onChange={(e) => setContent(e.target.value)}
          value={content}
        />

        <label htmlFor="image" className='flex items-center space-x-3 cursor-pointer'>
          <FaImage className='text-2xl text-gray-300'/>
          <span className='text-gray-300'>Add Image (Optional)</span>
          <input 
            type="file" 
            className='hidden' 
            id='image' 
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>

        {image && (
          <div className='mt-3'>
            <img src={URL.createObjectURL(image)} className='rounded-lg max-h-64 object-cover' alt="" />
          </div>
        )}
        <button className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={loading || !content} onClick={handleCreatePost}>
          {loading ? (
              <>
                <MoonLoader size={20} color="#ffffff" />
                <span className='text-center text-gray-300 text-sm animate-pulse'>Creating Post...</span>
              </>
          ) : 'Create Post'}
        </button>
      </div>
    </div>
  )
}

export default CreatePost
