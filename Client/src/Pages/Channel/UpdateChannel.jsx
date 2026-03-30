import React, { useState } from 'react'
import logo from '../../assets/ytlogo.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setChannelData } from '../../Redux/userSlice';
import {FaUserCircle} from 'react-icons/fa';
import { IoReturnDownBack } from 'react-icons/io5';
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../../App';
import { showCustomAlert } from '../../Components/CustomAlert';
import MoonLoader from 'react-spinners/MoonLoader';

const UpdateChannel = () => {

    const navigate = useNavigate();
    const {channelData} = useSelector((state) => state.user);
    const [step, setStep] = useState(1);
    const [avatar, setAvatar] = useState(channelData?.avatar || null);
    const [banner, setBanner] = useState(channelData?.banner || null);
    const [channelName, setChannelName] = useState(channelData?.name);
    const [description, setDescription] = useState(channelData?.description);
    const [category, setCategory] = useState(channelData?.category);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleAvatar = (e) => {
        setAvatar(e.target.files[0]);
    };
    const handleBanner = (e) => {
        setBanner(e.target.files[0]);
    };

    const nextStep = () => {
        setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };


    const handleUpdateChannel = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', channelName);
        formData.append('description', description);
        formData.append('category', category);
        if (avatar) formData.append('avatar', avatar);
        if (banner) formData.append('banner', banner);

        try {
            const { data } = await axios.post(`${serverUrl}/api/user/update-channel`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            // Update Redux store with the updated channel data
            dispatch(setChannelData(data.channel));
            showCustomAlert('Channel Updated!');
            navigate('/view-channel');
            
        } catch (error) {
            console.error('Update error:', error);
            showCustomAlert(error.response?.data?.message || 'Error updating channel', 'error');
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col'>
        <main className='flex flex-1 justify-center items-center px-4'>
            <div className='bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg'>
                {/* Step - 1 */}
                {step === 1 && (
                    <div>
                        <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
                            <IoIosArrowRoundBack className='h-8 w-8 cursor-pointer' onClick={() => navigate('/view-channel')}/>
                            Customize Channel
                        </h2>
                        <p className='test-sm text-gray-400 mb-6'>Choose your Profile Picture and Channel Name</p>

                        <div className='flex flex-col items-center mb-6'>
                            <label htmlFor="avatar" className='cursor-pointer flex flex-col items-center'>
                                {avatar ? (
                                    <img src={channelData?.avatar} alt="" className='w-20 h-20 rounded-full flex items-center justify-center object-cover border-gray-400'/>
                                ) : (
                                    <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400'>
                                        <FaUserCircle size={70}/>
                                    </div>
                                )}
                                <span className='text-red-400 text-sm mt-2'>Upload Avatar</span>
                                <input type="file" className='hidden' id='avatar' accept='image/*' onChange={handleAvatar}/>
                            </label>
                        </div>

                        <input type="text" placeholder='Channel Name' className='w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring focus:ring-red-500' onChange={(e) => setChannelName(e.target.value)} value={channelName}/>

                        <button className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600 cursor-pointer' disabled={!channelName} onClick={nextStep}>
                            Continue
                        </button>

                        <span className='w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2 gap-2' onClick={() => navigate('/')}>
                            <IoReturnDownBack />
                            Back to Home
                        </span>
                    </div>
                )}


                {/* Step - 2 */}
                {step === 2 && (
                    <div>
                        <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
                            <IoIosArrowRoundBack className='h-8 w-8 cursor-pointer' onClick={prevStep}/>
                            Your Updated Channel
                        </h2>

                        <div className='flex flex-col items-center mb-6'>
                            <label className='cursor-pointer flex flex-col items-center'>
                                {avatar ? (
                                    <img src={channelData?.avatar} alt="" className='w-20 h-20 rounded-full flex items-center justify-center object-cover border-gray-400'/>
                                ) : (
                                    <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400'>
                                        <FaUserCircle size={70}/>
                                    </div>
                                )}
                            
                            </label>

                            <h2 className='mt-3 text-lg font-semibold'>{channelName}</h2>
                        </div>

                        <button className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer' disabled={!channelName} onClick={nextStep}>
                            Continue and Customize Channel
                        </button>

                        <span className='w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2 gap-2' onClick={() => navigate('/')}>
                            <IoReturnDownBack />
                            Back to Home
                        </span>
                    </div>
                )}


                {/* Step - 3 */}
                {step === 3 && (
                    <div>
                        <h2 className='text-2xl font-semibold mb-4 flex items-center gap-2'>
                            <IoIosArrowRoundBack className='h-8 w-8 cursor-pointer' onClick={prevStep}/>
                            Customize Channel
                        </h2>

                        <div className='flex flex-col items-center mb-6'>
                            <label htmlFor="banner" className='cursor-pointer block mb-4 w-full'>
                                {banner ? (
                                    <img src={channelData?.banner} alt="" className='w-full h-32 object-cover rounded-lg mb-2 border border-gray-700'/>
                                ) : (
                                    <div className='w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 border border-gray-700 mb-2'>
                                        Click to upload banner
                                    </div>
                                )}
                                <span className='text-red-400 text-sm mt-2'>Upload Banner</span>
                                <input type="file" className='hidden' id='banner' accept='image/*' onChange={handleBanner}/>
                            </label>
                        </div>

                        <textarea name="" id="" className='w-full p-3 mb-4 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring focus:ring-red-500' placeholder='Channel Description' onChange={(e) => setDescription(e.target.value)} value={description}/>

                        <input type="text" placeholder='Channel Category' className='w-full p-3 mb-6 rounded-lg bg-[#121212] border border-gray-700 text-white focus:outline-none focus:ring focus:ring-red-500' onChange={(e) => setCategory(e.target.value)} value={category}/>

                        <button className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer' disabled={!description || !category || loading} onClick={handleUpdateChannel}>
                            {loading ? (
                                <>
                                    <MoonLoader size={20} color="#ffffff" />
                                    <span>Updating Channel...</span>
                                </>
                            ) : 'Save and Customize Channel'}
                        </button>

                        <span className='w-full flex items-center justify-center text-sm text-blue-400 cursor-pointer hover:underline mt-2 gap-2' onClick={() => navigate('/')}>
                            <IoReturnDownBack />
                            Back to Home
                        </span>
                    </div>
                )}
            </div>
        </main>
    </div>
  )
}

export default UpdateChannel
