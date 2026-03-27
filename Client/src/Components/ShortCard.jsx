import React from 'react'
import { useNavigate } from 'react-router-dom'

const ShortCard = ({shortUrl, title, channelName, avatar, views, id}) => {

    const navigate = useNavigate();

  return (
    <div className='w-45 sm:w-48 cursor-pointer relative' onClick={() => navigate(`/playshort/${id}`)}>
        <div className='rounded-xl overflow-hidden bg-black w-full h-70 border border-gray-700'>
            <video src={shortUrl} className='w-full h-full object-cover ' muted playsInline onContextMenu={(e) => e.preventDefault()} preload='metadata'/>
        </div>

        <div className='mt-2 space-y-2 w-full absolute bottom-0 p-3 bg-black/80 rounded-xl'>
            <h3 className='text-sm font-semibold text-white line-clamp-2'>{title}</h3>
            <div className='flex items-center justify-start gap-1'>
                <img src={avatar} className='w-4 h-4 rounded-full object-cover' alt="" />
                <p className='text-xs text-gray-300'>{channelName}</p>
            </div>
            <p className='text-xs text-gray-300'>{
                
                Number(views) >= 1_000_000
                ? Math.floor(Number(views) / 1_000_000) + 'M'
                : Number(views) >= 1_000
                ? Math.floor(Number(views) / 1_000) + 'K'
                : Number(views) || 0
            } views</p>
        </div>
    </div>
  )
}

export default ShortCard
