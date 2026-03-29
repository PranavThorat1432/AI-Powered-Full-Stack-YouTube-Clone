import React, { useState } from 'react'
import { FaVideo, FaPlay, FaPen, FaList } from 'react-icons/fa';
import { GiFilmProjector } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';


const CreatePage = () => {

    const navigate = useNavigate();
    const [selected, setSelected] = useState(false);

    const options = [
        {
            id: 'video', 
            icon: <FaVideo size={28}/>,
            title: 'Upload Video'
        },
        {
            id: 'short', 
            icon: <FaPlay size={28}/>,
            title: 'Create Short'
        },
        {
            id: 'post', 
            icon: <FaPen size={28}/>,
            title: 'Create Community Post'
        },
        {
            id: 'playlist', 
            icon: <FaList size={28}/>,
            title: 'New Playlist'
        },
    ];

    const handleRoute = () => {
        const routes = {
            video: '/create-video',
            short: '/create-short',
            post: '/create-post',
            playlist: '/create-playlist',
        };

        if(selected && routes[selected]) {
            navigate(routes[selected]);
        }
    };


  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen px-6 py-8 mt-10 flex flex-col'>
        <header className='mb-12 border-b border-[#3f3f3f] pb-4'>
            <h1 className='text-4xl font-bold tracking-tight'>Create</h1>
            <p className='text-gray-400 mt-1 text-sm'>Choose what type of content you want to create for your audience.</p>
        </header>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 flex-1'>
            {
                options?.map((option) => (
                    <div className={`bg-[#1f1f1f] border border-[#3f3f3f] rounded-lg p-6 flex flex-col items-center text-center justify-center cursor-pointer transition h-70 ${selected === option.id ? 'ring ring-red-500' : 'hover:bg-[#272727]'}`} onClick={() => setSelected(option.id)}>
                        <div className='bg-[#272727] p-4 rounded-full mb-4'>
                            {option.icon}
                        </div>
                        <h2 className='text-lg font-semibold'>{option.title}</h2>
                    </div>
                ))
            }
        </div>

        <div className='flex flex-col items-center mt-16'>
            <GiFilmProjector className='w-28 h-28 text-red-500'/>
            {!selected ? (
                <div >
                    <p className='mt-4 font-medium text-center'>Create content on any device</p>
                    <p className='text-gray-400 text-sm text-center'>Upload and record at home or on the go. Everything will make public will appear here.</p>
                </div>
            ) : (
                <div className='flex items-center justify-center flex-col'>
                    <p className='mt-4 font-medium text-center'>Ready to Create</p>
                    <p className='text-gray-400 text-sm text-center'>Click below to start your {options.find((opt) => opt.id === selected)?.title}</p>
                    <button className='bg-white text-black mt-4 px-5 py-1 rounded-full font-medium cursor-pointer hover:bg-gray-200' onClick={handleRoute}>+ Create</button>
                </div>
            )}
        </div>
    </div>
  )
}

export default CreatePage
