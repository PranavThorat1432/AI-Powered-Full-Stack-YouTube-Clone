import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import logo from '../assets/yt.png';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import MoonLoader from 'react-spinners/MoonLoader';
import { showCustomAlert } from '../Components/CustomAlert';
import { useDispatch } from 'react-redux';
import { setUserData } from '../Redux/userSlice';

const SignUp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [backendImage, setBackendImage] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    const handleNext = () => {
        if(step === 1) {
            if(!userName || !email) {
                showCustomAlert('Please fill all the fields');
                return;
            }
            setStep(step + 1);
        }
        if(step === 2) {
            if(!password || !confirmPassword) {
                showCustomAlert('Please fill all the fields');
                return;
            }
            
            if(password !== confirmPassword) {
                showCustomAlert('Password does not match');
                return;
            }
            setStep(step + 1);
        }
    };

    const handleSignup = async () => {
        setLoading(true); 
        
        if(!backendImage) {
            showCustomAlert('Please Choose Profile Image');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('photoUrl', backendImage);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signup`, formData, {
                withCredentials: true
            });
            dispatch(setUserData(result.data));
            setLoading(false);
            showCustomAlert('Account Created!');
            navigate('/');
            
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#181818]'>
        <div className='bg-[#202124] rounded-2xl p-10 w-full max-w-md shadow-lg'>
            <div className='flex items-center mb-6'>
                <button className='text-gray-300 mr-3 hover:text-white cursor-pointer font-bold' onClick={() => {
                    if(step > 1) {
                        setStep(step - 1);
                    } else {
                        navigate('/');
                    }
                }}>
                    <IoIosArrowRoundBack size={30}/>
                </button>
                <span className='text-white text-2xl font-medium'>Create Account</span>
            </div>

            {/* Step - 1 */}
            {step === 1 && (
                <>
                    <h1 className='text-3xl font-normal mb-5 text-white flex items-center gap-2'>
                        <img src={logo} alt="logo" className='w-10 h-10'/>
                        Basic Info
                    </h1>

                    <input type="text" placeholder='Username' className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-red-500 mb-4' onChange={(e) => setUserName(e.target.value)} value={userName}/>

                    <input type="email" placeholder='Email' className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-red-500 mb-4' onChange={(e) => setEmail(e.target.value)} value={email}/>

                    <div className='flex justify-end mt-10'>
                        <button className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full cursor-pointer' onClick={handleNext}>Next</button>
                    </div>
                </>
            )}

            {/* Step - 2 */}
            {step === 2 && (
                <>
                    <h1 className='text-3xl font-normal mb-5 text-white flex items-center gap-2'>
                        <img src={logo} alt="logo" className='w-10 h-10'/>
                        Security
                    </h1>

                    <div className='flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6'>
                        <FaUserCircle className='mr-2' size={20}/>
                        {email}
                    </div>

                    <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-red-500 mb-4' onChange={(e) => setPassword(e.target.value)} value={password}/>

                    <input type={showPassword ? 'text' : 'password'} placeholder='Confirm Password' className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-red-500 mb-4' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>

                    <div className='flex items-center gap-2 mt-3'>
                        <input type="checkbox" id='showPass' checked={showPassword} onChange={() => setShowPassword(!showPassword)}/>
                        <label htmlFor="showPass" className='text-gray-300 cursor-pointer'>Show Password</label>
                    </div>

                    <div className='flex justify-end mt-10'>
                        <button className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full cursor-pointer' onClick={handleNext}>Next</button>
                    </div>
                </>
            )}

            {/* Step - 3 */}
            {step === 3 && (
                <>
                    <h1 className='text-3xl font-normal mb-5 text-white flex items-center gap-2'>
                        <img src={logo} alt="logo" className='w-10 h-10'/>
                        Choose Avatar
                    </h1>

                   <div className='flex items-center gap-6 mb-6'>
                        <div className='w-31 h-28 rounded-full border-2 border-gray-500 overflow-hidden shadow-lg'>
                            {frontendImage ? (
                                <img src={frontendImage} alt="" />
                            ): (
                                <FaUserCircle className='text-gray-500 w-full h-full p-1' size={20}/>
                            )}
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="" className='text-gray-300 font-medium'>Choose Profile Picture</label>
                            <input type="file" accept='image/*' className='block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file-rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer' onChange={handleImage

                            }/>
                        </div>
                   </div>

                    <div className='flex justify-end mt-10'>
                        <button className='bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full cursor-pointer flex items-center justify-center gap-3' disabled={loading}  onClick={handleSignup}>
                            {loading ? (
                                <>
                                    <MoonLoader size={20} color="#ffffff" />
                                    <span>Creating Account...</span>
                                </>
                            ) : 'Create Account'}
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
  )
}

export default SignUp
