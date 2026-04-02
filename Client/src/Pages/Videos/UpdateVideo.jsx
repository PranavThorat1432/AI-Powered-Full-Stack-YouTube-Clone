import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MoonLoader from 'react-spinners/MoonLoader';
import { serverUrl } from '../../App';
import { showCustomAlert } from '../../Components/CustomAlert';
import { setAllVideosData } from '../../Redux/contentSlice';
import { setChannelData } from '../../Redux/userSlice';



const UpdateVideo = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {videoId} = useParams();

    const {allVideosData} = useSelector((state) => state.content);
    const {channelData} = useSelector((state) => state.user);

    const [thumbnail, setThumbnail] = useState('');
    const [video, setVideo] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);


    const handleThumbnail = (e) => {
        setThumbnail(e.target.files[0]);
    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/content/fetch-videos/${videoId}`, {
                    withCredentials: true
                });
                setTitle(result.data.title);
                setDescription(result.data.description);
                setTags(result.data.tags.join(', '));

            } catch (error) {
                console.log(error);
                showCustomAlert(error?.response?.data?.message || 'Failed to load video');
            }
        };
        fetchVideo();
    }, [videoId]);


    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('tags', JSON.stringify(tags.split(',').map((t) => t.trim())));

            if(thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            const result = await axios.post(`${serverUrl}/api/content/update-video/${videoId}`, formData, {
                withCredentials: true
            });

            // update redux
            const updatedVideos = allVideosData.map((v) => {
                v?._id === videoId ? result.data.video : v
            });
            dispatch(setAllVideosData(updatedVideos));
            showCustomAlert('Video Updated!');
            setLoading(false);
            navigate('/yt-studio/content');

        } catch (error) {
            console.log(error);
            showCustomAlert(error?.response?.data?.message || 'Failed to update video');
            setLoading(false);
        }
    };


    const deleteVideo = async () => {
        if(!window.confirm('Are you sure you want to delete this video?')) {
            return;
        }

        setLoading1(true);
        try {
            await axios.delete(`${serverUrl}/api/content/delete-video/${videoId}`, {
                withCredentials: true
            });

            // remove this from redux
            dispatch(setAllVideosData(allVideosData.filter((v) => v._id !== videoId)));
            
            showCustomAlert('Video Deleted!');
            setLoading1(false);
            navigate('/yt-studio/content');
            
        } catch (error) {
            console.log(error);
            showCustomAlert(error?.response?.data?.message || 'Failed to delete video!');
            setLoading1(false);
        }
    };


  return (
    <div className='w-full min-h-[80vh] bg-[#0f0f0f] text-white flex flex-col pt-5'>
        <div className='flex flex-1 justify-center items-center px-4 py-6'>

            <div className='bg-[#212121] p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6'>

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

                <div className='flex items-center justify-center gap-6'>
                    <button className='w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={loading} onClick={handleUpdate}>
                        {loading ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span className='text-center text-gray-300 text-sm animate-pulse'>Updating Video...</span>
                            </>
                        ) : 'Update Video'}
                    </button>

                    <button className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={loading1} onClick={deleteVideo}>
                        {loading1 ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span className='text-center text-gray-300 text-sm animate-pulse'>Deleting Video...</span>
                            </>
                        ) : 'Delete Video'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateVideo;