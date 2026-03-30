import React, { useState } from 'react'
import logo from '../../assets/ytlogo.png';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {FaUserCircle} from 'react-icons/fa';
import { IoReturnDownBack } from 'react-icons/io5';
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from 'axios';
import { serverUrl } from '../../App';
import { showCustomAlert } from '../../Components/CustomAlert';
import MoonLoader from 'react-spinners/MoonLoader';


const CreateChannel = () => {

    const navigate = useNavigate();
    const {userData} = useSelector((state) => state.user);

    const [step, setStep] = useState(1);
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [channelName, setChannelName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

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


    const handleCreateChannel = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('name', channelName);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('avatar', avatar);
        formData.append('banner', banner);

        try {
            const result = await axios.post(`${serverUrl}/api/user/create-channel`, formData, {
                withCredentials: true
            });
            setLoading(false);
            showCustomAlert('Channel Created!');
            navigate('/');

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

  return (
    <div className='w-full min-h-screen bg-[#0f0f0f] text-white flex flex-col'>
        <header className='flex justify-between items-center px-6 py-3 border-b border-gray-800'>
            <div>
                <img src={logo} alt="" className=' h-8.5 cursor-pointer' onClick={() => navigate('/')}/>
            </div>
            <div className='flex items-center gap-3'>
                <img src={userData?.photoUrl} alt="" className='w-8 h-8 rounded-full object-cover'/>
            </div>
        </header>

        <main className='flex flex-1 justify-center items-center px-4'>
            <div className='bg-[#212121] p-6 rounded-xl w-full max-w-lg shadow-lg'>
                {/* Step - 1 */}
                {step === 1 && (
                    <div>
                        <h2 className='text-2xl font-semibold mb-4'>How you'll appear?</h2>
                        <p className='test-sm text-gray-400 mb-6'>Choose your Profile Picture and Channel Name</p>

                        <div className='flex flex-col items-center mb-6'>
                            <label htmlFor="avatar" className='cursor-pointer flex flex-col items-center'>
                                {avatar ? (
                                    <img src={URL.createObjectURL(avatar)} alt="" className='w-20 h-20 rounded-full flex items-center justify-center object-cover border-gray-400'/>
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
                            Your Channel
                        </h2>

                        <div className='flex flex-col items-center mb-6'>
                            <label className='cursor-pointer flex flex-col items-center'>
                                {avatar ? (
                                    <img src={URL.createObjectURL(avatar)} alt="" className='w-20 h-20 rounded-full flex items-center justify-center object-cover border-gray-400'/>
                                ) : (
                                    <div className='w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-gray-400'>
                                        <FaUserCircle size={70}/>
                                    </div>
                                )}
                            
                            </label>

                            <h2 className='mt-3 text-lg font-semibold'>{channelName}</h2>
                        </div>

                        <button className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer' disabled={!channelName} onClick={nextStep}>
                            Continue and Create Channel
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
                            Create Channel
                        </h2>

                        <div className='flex flex-col items-center mb-6'>
                            <label htmlFor="banner" className='cursor-pointer block mb-4 w-full'>
                                {banner ? (
                                    <img src={URL.createObjectURL(banner)} alt="" className='w-full h-32 object-cover rounded-lg mb-2 border border-gray-700'/>
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

                        <button className='w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition py-3 rounded-lg font-medium disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer' disabled={!description || !category || loading} onClick={handleCreateChannel}>
                            {loading ? (
                                <>
                                    <MoonLoader size={20} color="#ffffff" />
                                    <span>Creating Channel...</span>
                                </>
                            ) : 'Create Channel'}
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

export default CreateChannel
