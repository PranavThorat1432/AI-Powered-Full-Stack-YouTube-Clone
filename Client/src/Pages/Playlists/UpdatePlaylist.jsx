import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { showCustomAlert } from '../../Components/CustomAlert';
import axios from 'axios';
import { serverUrl } from '../../App';
import { useNavigate, useParams } from 'react-router-dom';
import { setChannelData } from '../../Redux/userSlice';
import MoonLoader from 'react-spinners/MoonLoader';


const UpdatePlaylist = () => {
 
    const {channelData} = useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { playlistId } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoData, setVideoData] = useState([]);
    const [playlist, setPlaylist] = useState('');
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);

    const toggleVideoSelection = (videoId) => {
        setSelectedVideos((prev) => prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]);
    };

    useEffect(() => {
        if(channelData && channelData?.videos) {
            setVideoData(channelData?.videos);
        }
    }, [channelData]);


    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/content/fetch-playlists/${playlistId}`, {
                    withCredentials: true
                });
                setPlaylist(result.data);
                setTitle(result.data.title);
                setDescription(result.data.description);
                setSelectedVideos(result.data.videos.map((v) => v._id));

            } catch (error) {
                console.log(error);
                showCustomAlert('Error fetching playlist. Please try again.', 'error');
            }
        };
        fetchPlaylist();
    }, [playlistId]);


    const toggleVideoSelect = (videoId) => {
        setSelectedVideos((prev) => prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]);
    };

    const handleUpdate = async () => {

        setLoading(true);
        try {
            // find difference b/w old playlist.videos and new selectedVideos
            const currentVideos = playlist.videos?.map((v) => v._id.toString());
            const newVideos = selectedVideos?.map((v) => v.toString());

            const addVideos = newVideos.filter((id) => !currentVideos.includes(id));
            const removeVideos = currentVideos.filter((id) => !newVideos.includes(id));

            const result = await axios.post(`${serverUrl}/api/content/update-playlist/${playlistId}`, {
                title, description, addVideos, removeVideos
            }, {withCredentials: true});

            // update redux channelData
            const updatedPlaylists = channelData.playlist?.map((p) => 
                p._id === playlistId ? result.data : p
            );
            dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

            showCustomAlert('Playlist Updated!');
            navigate('/yt-studio/content');
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
            showCustomAlert('Error updating playlist. Please try again.', 'error');
        }
    };


    const handleDelete = async () => {
        if(!window.confirm('Are you sure want to delete this playlist?')) {
            return;
        }

        setLoading1(true);
        try {
            const result = await axios.delete(`${serverUrl}/api/content/delete-playlist/${playlistId}`, {
                withCredentials: true
            });

            // remove playlist from redux
            const updatedPlaylists = channelData.playlists.filter((p) => p._id !== playlistId);
            dispatch(setChannelData({ ...channelData, playlists: updatedPlaylists }));

            showCustomAlert('Playlist Deleted!');
            navigate('/yt-studio/content');
            setLoading1(false);

        } catch (error) {
            console.log(error);
            setLoading1(false);
            showCustomAlert('Error deleting playlist. Please try again.', 'error');
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

                    <div className='flex items-center justify-center gap-4'>
                        <button disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer gap-3' onClick={handleUpdate}>
                            {loading ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span className='text-center text-gray-300 text-sm animate-pulse'>Updating Playlist...</span>
                            </>
                            ) : 'Update Playlist'}
                        </button>

                        <button disabled={loading1} className='w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium disabled:bg-gray-600 flex items-center justify-center cursor-pointer gap-3' onClick={handleDelete}>
                            {loading1 ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span className='text-center text-gray-300 text-sm animate-pulse'>Deleting Playlist...</span>
                            </>
                            ) : 'Delete Playlist'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
};
      


export default UpdatePlaylist;
