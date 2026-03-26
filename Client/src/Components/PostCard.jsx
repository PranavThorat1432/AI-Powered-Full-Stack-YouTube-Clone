import axios from 'axios';
import React, { useState } from 'react'
import { FaHeart, FaReply, FaComment, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { serverUrl } from '../App';

const PostCard = ({post}) => {

    const {userData} = useSelector((state) => state.user);

    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comment, setComment] = useState(post?.comments || []);
    const [like, setLike] = useState(post?.likes?.some((userId) => userId.toString() === userData?._id?.toString()) || false);
    const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);


    const handleLike = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/content/post/toggle-like`, {postId: post?._id}, {
                withCredentials: true
            });
            setLikeCount(result.data?.likes?.length);
            setLike(result.data?.likes?.includes(userData?._id));

        } catch (error) {
            console.log(error);
        }
    };


    const handleAddComment = async () => {
        if(!newComment) {
            return;
        }

        try {
            const result = await axios.post(`${serverUrl}/api/content/post/add-comment`, {message: newComment, postId: post?._id}, {
                withCredentials: true
            });
            setComment(prev => [result?.data?.comments?.slice(-1)[0], ...prev]);
            setNewComment('');
            
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddReply = async ({replyText, commentId}) => {
        if(!replyText) {
            return;
        }

        try {
            const result = await axios.post(`${serverUrl}/api/content/post/add-reply`, {message: replyText, postId: post?._id, commentId}, {
                withCredentials: true
            });
            setComment(result.data.comments);
            
        } catch (error) {
            console.log(error);
        }
    };


  return (
    <div className='w-100 bg-linear-to-br from-gray-900 via-black to-gray-900 rounded p-5 shadow-lg border border-gray-700 mb-12 relative'>
        <p className='text-base text-gray-200'>{post?.content}</p>
        {post?.image && (
            <img src={post.image} className='w-90 h-50 object-cover rounded-xl mt-4 shadow-md' alt="" />
        )}

        <div className='flex justify-between items-center mt-4 text-gray-400 text-sm'>
            <span className='italic text-gray-500'>{new Date(post?.createdAt).toDateString()}</span>
            <div className='flex gap-6'>
                <button 
                    className={`cursor-pointer flex items-center gap-1 transition ${like ? 'text-red-600' : 'hover:text-red-500'}`} 
                    onClick={handleLike}
                >
                    <FaHeart size={20}/> <span className='text-gray-400'>{likeCount}</span>
                </button>
                <button 
                    className='cursor-pointer flex items-center gap-1 hover:text-blue-400 transition'
                    onClick={() => setShowComments(true)}
                >
                    <FaComment size={20}/>
                    {comment?.length}
                </button>
            </div>
        </div>

        {showComments && (
            <div className='absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-4 rounded-t-xl border-t border-gray-700 max-h-[50%] overflow-y-auto space-y-2'>
                <div className='flex items-center w-full justify-between py-2.5'>
                    <h3 className='text-gray-300 font-semibold mb-2'>Comments</h3>
                    <button className='text-gray-400 hover:text-red-500 transition cursor-pointer' onClick={() => setShowComments(false)}><FaTimes size={18}/></button>
                </div>

                <div className='flex gap-2 mt-3 items-center'>
                    <img src={userData?.photoUrl} className='w-8 h-8 rounded-full' alt="" />

                    <input 
                        type="text" 
                        className='flex-1 px-3 py-2 rounded-lg bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring focus:ring-red-500' 
                        placeholder='Add a comment...' 
                        onChange={(e) => setNewComment(e.target.value)} 
                        value={newComment}
                    />
                    <button className='px-4 py-2 bg-red-600 rounded-lg text-white text-sm hover:bg-red-700 cursor-pointer transition-all' onClick={handleAddComment}>Comment</button>
                </div>

                <div className='space-y-3'>
                    {comment?.length > 0 ? (
                        comment?.map((c) => (
                            <div key={c?._id} className='bg-gray-700 p-3 rounded-lg'>
                                <div className='flex items-center gap-2 mb-1'>
                                    <img src={c?.author?.photoUrl} className='w-6 h-6 rounded-full' alt="" />
                                    <span className='text-sm font-semibold text-gray-200'>{c?.author?.userName}</span>
                                </div>
                                <p className='text-gray-200 text-sm ml-8'>{c?.message}</p>

                                <div className='ml-4 mt-2 space-y-2'>
                                    {c?.replies?.map((reply) => (
                                        <div key={reply?._id} className='p-2 bg-[#2a2a2a] rounded'>
                                            <div className='flex items-center justify-start gap-1'>
                                                <img src={reply?.author?.photoUrl} alt="" className='w-8 h-8 rounded-full object-cover'/>
                                                <div className='flex flex-col gap-1'>
                                                    <h2 className=' pt-1.5 text-[12px] font-semibold'>
                                                        @{reply?.author?.userName}
                                                    </h2>
                                                    <p className='text-[15px]'>{reply?.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>  

                                <ReplySection comment={c} handleReply={handleAddReply}/>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500 text-sm text-center my-4'>No comments yet</p>
                    )}
                </div>
            </div>
        )}

    </div>
  )
}


const ReplySection = ({comment, handleReply}) => {

    const [replyText, setReplyText] = useState('');
    const [showReplyInput, setShowReplyInput] = useState(false);

    return (
        <div className=''>
            
            {showReplyInput && (
                <div className='flex gap-2 mt-1 ml-4'>
                    <input 
                        type="text" 
                        placeholder='Add a reply...' 
                        onChange={(e) => setReplyText(e.target.value)} 
                        value={replyText} 
                        className='flex-1 border-b border-b-gray-700 bg-[#1a1a1a] text-white px-2 py-2 focus:outline-none focus:border-b-white text-sm'
                    />
                    <button 
                        onClick={() => {handleReply({commentId: comment?._id, replyText: replyText}); setShowReplyInput(false); setReplyText('')}}
                        className='disabled:bg-gray-700 disabled:text-gray-400 bg-blue-500 text-white px-4 rounded-full cursor-pointer text-sm' disabled={!replyText}
                    >
                        Reply
                    </button>
                </div>
            )}

            <button onClick={() => setShowReplyInput(!showReplyInput)} className='mt-3 ml-7 text-xs hover:bg-gray-500 text-white py-1 px-2 rounded-full cursor-pointer'>Reply</button>
            
        </div>
    )
};

export default PostCard;
