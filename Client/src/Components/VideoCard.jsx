import React from 'react'
import { useNavigate } from 'react-router-dom'

const VideoCard = ({thumbnail, duration, channelLogo, title, channelName, views, id}) => {

    const navigate = useNavigate();
    
  return (
    <div className='w-90 cursor-pointer' onClick={() => navigate(`/play-video/${id}`)}>
        <div className='relative'>
            <img src={thumbnail} alt={title} className='rounded-xl w-full h-50 border border-gray-800 object-cover'/>
            <span className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded'>{duration}</span>
        </div>

        <div className='flex mt-3'>
            <img src={channelLogo} alt={channelName} className='w-10 h-10 rounded-full mr-3'/>

            <div>
                <h3 className='text-sm font-semibold leading-snug line-clamp-2'>{title}</h3>
                <p className='text-xs text-gray-400 mt-1' >{channelName}</p>
                <p className='text-xs text-gray-400'>{
                    Number(views) >= 1_000_000
                    ? Math.floor(Number(views) / 1_000_000) + 'M'
                    : Number(views) >= 1_000
                    ? Math.floor(Number(views) / 1_000) + 'K'
                    : Number(views) || 0
                } views</p>
            </div>
        </div>
    </div>
  )
}

export default VideoCard
