import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { serverUrl } from '../../App';
import { FaList } from 'react-icons/fa';
import PlaylistCard from '../../Components/PlaylistCard';

const SavedPlaylist = () => {

    const [savedPlaylist, setSavedPlaylist] = useState([]);

    useEffect(() => {
        const fetchSavedPlaylists = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/content/get-saved-playlists`, {
                    withCredentials: true
                });
                setSavedPlaylist(result.data);

            } catch (error) {
                console.log(error);
            }
        }
        fetchSavedPlaylists();
    }, []);


    if(!savedPlaylist || savedPlaylist?.length === 0) {
        return (
            <div className='flex justify-center items-center h-[70vh] text-gray-400 text-xl'>
                No Saved Playlist Found!
            </div>
        )
    }

  return (
    <div className='p-6 min-h-screen bg-black text-white mt-10 lg:mt-5'>
        <h2 className='text-2xl font-bold mb-6 pt-12 border-b border-gray-300 pb-2 flex items-center gap-2'><FaList className='w-7 h-7 text-red-500'/> Saved Playlists</h2>

        <div className='flex gap-4 flex-wrap '>
            {savedPlaylist?.map((playlist) => (
                <PlaylistCard
                    key={playlist?._id}
                    id={playlist?._id}
                    title={playlist?.title}
                    videos={playlist?.videos}
                    savedBy={playlist?.savedBy}
                />
            ))}
        </div>
    </div>
  )
}

export default SavedPlaylist
