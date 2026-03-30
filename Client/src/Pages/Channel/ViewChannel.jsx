import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { GiFilmProjector } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';


const ViewChannel = () => {

  const navigate = useNavigate();
  const { channelData } = useSelector((state) => state.user);

  return (
    <div className='w-full'>
      {/* Banner */}
      <div className='w-full h-32 md:h-48 lg:h-60 bg-linear-to-r from-gray-800 to-gray-900 rounded-lg mt-15'>
        {channelData?.banner ? (
          <img 
            src={channelData.banner} 
            alt="Channel Banner" 
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className='w-full h-full bg-linear-to-r from-gray-800 to-gray-900 rounded-lg' />
        )}
      </div>

      {/* Channel Info */}
      <div className='px-4 sm:px-6 lg:px-10 py-6 max-w-7xl mx-auto'>
        <div className='flex flex-col sm:flex-row gap-6 items-start'>
          {/* Channel Avatar */}
          <div className='shrink-0 -ml-5'>
            <div className='w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-gray-900'>
              <img 
                src={channelData?.avatar} 
                className='w-full h-full object-cover'
                alt="Channel Avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.jpg';
                }}
              />
            </div>
          </div>

          {/* Channel Details */}
          <div className='flex-1 -mt-4 -ml-3 sm:mt-0 sm:ml-0'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
              <div>
                <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold'>{channelData?.name || 'Channel Name'}</h1>
                <p className='text-gray-400 text-sm sm:text-base'>{channelData?.owner?.email || 'email@example.com'}</p>
                <p className='text-sm text-gray-400 mt-1'>
                  More about this channel... 
                  {channelData?.category && (
                    <span className='text-red-400 ml-1 cursor-pointer'>{channelData.category}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3 mt-4'>
              <button className='bg-[#3f3f3f] hover:bg-[#4f4f4f] text-white px-4 py-1.5 rounded-full font-medium text-sm sm:text-base transition-colors cursor-pointer' onClick={() => navigate('/update-channel')}>
                Customize channel
              </button>
              <button className='bg-[#3f3f3f] hover:bg-[#4f4f4f] text-white px-4 py-1.5 rounded-full font-medium text-sm sm:text-base transition-colors cursor-pointer' onClick={() => navigate('/yt-studio/dashboard')}>
                Manage Videos
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col items-center mt-10'>
          <GiFilmProjector className='w-28 h-28'/>
          <p className='mt-4 font-medium'>Create Content on any device</p>
          <p className='text-gray-400 text-sm text-center'>Upload and record at home or on the go. Everything will make public will appear here.</p>
          <button className='flex items-center justify-center gap-1 bg-[#3f3f3f] hover:bg-[#4f4f4f] text-white mt-4 px-5 py-1.5 rounded-full font-medium cursor-pointer' onClick={() => navigate('/create-page')}>
            <span className='text-lg'><FiPlus className='h-6 w-6'/></span>
            <span>Create</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewChannel;
