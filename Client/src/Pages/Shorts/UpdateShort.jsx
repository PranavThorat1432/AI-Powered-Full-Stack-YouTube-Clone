import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MoonLoader from 'react-spinners/MoonLoader';
import { serverUrl } from '../../App';
import { showCustomAlert } from '../../Components/CustomAlert';
import { setAllShortsData, setAllVideosData } from '../../Redux/contentSlice';
import { setChannelData } from '../../Redux/userSlice';



const UpdateShort = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {shortId} = useParams();

    const {allShortsData} = useSelector((state) => state.content);
    const {channelData} = useSelector((state) => state.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);



    useEffect(() => {
        const fetchShort = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/content/fetch-shorts/${shortId}`, {
                    withCredentials: true
                });
                setTitle(result.data.title);
                setDescription(result.data.description);
                setTags(result.data.tags.join(', '));

            } catch (error) {
                console.log(error);
                showCustomAlert(error?.response?.data?.message || 'Failed to load short');
            }
        };
        fetchShort();
    }, [shortId]);


    const handleUpdate = async () => {
        setLoading(true);
        try {
            const updateData = {
                title,
                description,
                tags: JSON.stringify(tags.split(',').map((t) => t.trim()))
            };

            const result = await axios.post(`${serverUrl}/api/content/update-short/${shortId}`, updateData, {
                withCredentials: true
            });

            // update redux
            const updatedShorts = allShortsData.map((s) => {
                s?._id === shortId ? result.data.short : s
            });
            dispatch(setAllVideosData(updatedShorts));
            showCustomAlert('Short Updated!');
            setLoading(false);
            navigate('/yt-studio/content');

        } catch (error) {
            console.log(error);
            showCustomAlert(error?.response?.data?.message || 'Failed to update short');
            setLoading(false);
        }
    };


    const deleteShort = async () => {
        if(!window.confirm('Are you sure you want to delete this short?')) {
            return;
        }

        setLoading1(true);
        try {
            await axios.delete(`${serverUrl}/api/content/delete-short/${shortId}`, {
                withCredentials: true
            });

            // remove this from redux
            dispatch(setAllShortsData(allShortsData.filter((s) => s._id !== shortId)));
            
            showCustomAlert('Short Deleted!');
            setLoading1(false);
            navigate('/yt-studio/content');
            
        } catch (error) {
            console.log(error);
            showCustomAlert(error?.response?.data?.message || 'Failed to delete short!');
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

                <div className='flex items-center justify-center gap-6'>
                    <button className='w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={loading} onClick={handleUpdate}>
                        {loading ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span className='text-center text-gray-300 text-sm animate-pulse'>Updating Short...</span>
                            </>
                        ) : 'Update Short'}
                    </button>

                    <button className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center gap-3 cursor-pointer' disabled={loading1} onClick={deleteShort}>
                        {loading1 ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span className='text-center text-gray-300 text-sm animate-pulse'>Deleting Short...</span>
                            </>
                        ) : 'Delete Short'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateShort;