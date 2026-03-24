import React from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaComment, FaEye, FaThumbsUp } from 'react-icons/fa';

const Dashboard = () => {

    const navigate = useNavigate();
    const {channelData} = useSelector((state) => state.user);

    const totalVideoViews  = (channelData.videos || []).reduce(
        (acc, vid) => acc + (vid.view || 0), 0
    );

    const totalShortViews  = (channelData.shorts || []).reduce(
        (acc, short) => acc + (short.view || 0), 0
    );

    const totalViews = totalVideoViews + totalShortViews;

  return (
    <div className='w-full text-white min-h-screen p-4 sm:p-6 space-y-6 mb-13'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-4'>
            <img src={channelData?.avatar} className='w-16 h-16 rounded-full object-cover border border-gray-600' alt="" />

            <div className='text-center sm:text-left'>
                <h2 className='text-lg sm:text-xl font-bold'>{channelData.name}</h2>
                <p className='text-sm text-gray-400'>{channelData?.subscribers?.length || 0} Subscribers</p>
            </div>
        </div>

        <div>
            <h3 className='pl-1 text-start sm:text-lg font-semibold mb-3'>Channel Analytics</h3>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
                <AnalyticsCard
                    label='Views'
                    value={totalViews || '0'}
                    onClick={() => navigate('/yt-studio/analytics')}
                />
                <AnalyticsCard
                    label='Subscribers'
                    value={`+ ${channelData?.subscribers?.length || 0}`}
                />
            </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
                {channelData?.videos?.length > 0 && (
                    <h3 className='pl-1 text-start sm:text-lg font-semibold mb-3'>Latest Videos</h3>
                )}
                <div className='space-y-4'>
                    {(channelData.videos).slice().reverse().slice(0, 5).map((v, index) => (
                        <ContentCard
                            key={index}
                            content={v}
                            onClick={() => navigate(`/play-video/${v?._id}`)}
                        />
                    ))}
                </div>
            </div>

            <div>
                {channelData?.shorts?.length > 0 && (
                    <h3 className='pl-1 text-start sm:text-lg font-semibold mb-3'>Latest Shorts</h3>
                )}
                <div className='space-y-4'>
                    {(channelData.shorts).slice().reverse().slice(0, 5).map((s, index) => (
                        <ContentCard1
                            key={index}
                            content={s}
                            onClick={() => navigate(`/playshort/${s?._id}`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
};

function AnalyticsCard({ label, value, onClick }) {
    return (
        <div className='bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 shadow hover:shadow-lg transition' onClick={onClick}>
            <div className='flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-2'>
                {label}
            </div>
            <h4 className='text-lg sm:text-xl text-start font-bold'>{value}</h4>
        </div>
    )
};

function ContentCard({ content, onClick }) {
    return (
        <div className='flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition cursor-pointer' onClick={onClick}>
            {/* Thumbnail */}
            <img src={content.thumbnail} alt="thumbnail" className='w-full sm:w-46 h-40 sm:h-26 rounded-lg object-cover'/>

            {/* Content Info */}
            <div className='flex-1'>
                <div className='w-full flex flex-col items-start justify-center gap-2'>
                    <h4 className='font-semibold text-sm sm:text-base line-clamp-2'>{content.title}</h4>
                    <p className='text-xs text-gray-400 mt-1'>Published {new Date(content.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Stats */}
                <div className='flex flex-wrap gap-4 mt-2 text-gray-300 text-sm'>
                    <span className='flex items-center gap-1'><FaEye/> {content.view || 0}</span>
                    <span className='flex items-center gap-1'><FaThumbsUp/> {content.likes?.length || 0}</span>
                    <span className='flex items-center gap-1'><FaComment/> {content.comments?.length || 0}</span>
                </div>

            </div>
        </div>
    )
}

function ContentCard1({ content, onClick }) {
    return (
        <div className='flex flex-col sm:flex-row gap-4 items-start bg-[#0f0f0f] border border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-[#202020] transition cursor-pointer' onClick={onClick}>
            {/* Short */}
            <video 
                src={content?.shortUrl}
                className='w-20 h-24 object-cover'
                muted
                playsInline
                preload='metadata'
                onContextMenu={(e) => e.preventDefault()}
            />

            {/* Content Info */}
            <div className='flex-1'>
                <div className='w-full flex flex-col items-start justify-center gap-2'>
                    <h4 className='font-semibold text-sm sm:text-base line-clamp-2'>{content.title}</h4>
                    <p className='text-xs text-gray-400 mt-1'>Published {new Date(content.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Stats */}
                <div className='flex flex-wrap gap-4 mt-2 text-gray-300 text-sm'>
                    <span className='flex items-center gap-1'><FaEye/> {content.view || 0}</span>
                    <span className='flex items-center gap-1'><FaThumbsUp/> {content.likes?.length || 0}</span>
                    <span className='flex items-center gap-1'><FaComment/> {content.comments?.length || 0}</span>
                </div>

            </div>
        </div>
    )
}

export default Dashboard
