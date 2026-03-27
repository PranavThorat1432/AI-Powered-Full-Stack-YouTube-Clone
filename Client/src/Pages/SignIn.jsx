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

const SignIn = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    };

    const handleNext = () => {
        if(step === 1) {
            if(!email) {
                showCustomAlert('Please Enter Email');
                return;
            }
            setStep(step + 1);
        }
        if(step === 2) {
            
            setStep(step + 1);
        }
    };

    const handleSignIn = async () => {
        setLoading(true); 

        if(!password) {
          showCustomAlert('Enter Password!');
          setLoading(false);
          return;
        }
            
        if(password?.length < 6) {
          showCustomAlert('Password must be at least 6 characters long!');
          setLoading(false);
          return;
        }

        const userData = {
            email,
            password
        };

        try {
            const result = await axios.post(`${serverUrl}/api/auth/signin`, userData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            dispatch(setUserData(result.data));
            setLoading(false);
            showCustomAlert('Signed In!');
            navigate('/');
            
          } catch (error) {
            console.log(error);
            setLoading(false);
            showCustomAlert(error.response?.data.message);
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
                <span className='text-white text-2xl font-medium'>YouTube</span>
            </div>

            {/* Step - 1 */}
            {step === 1 && (
                <>
                    <h1 className='text-3xl font-normal mb-1 text-white flex items-center gap-2'>
                        <img src={logo} alt="logo" className='w-10 h-10'/>
                        SignIn
                    </h1>
                    <p className='text-gray-400 text-sm mb-6'>With your Account to Continue with YouTube.</p>

                    <input type="email" placeholder='Email' className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-red-500 mb-4' onChange={(e) => setEmail(e.target.value)} value={email}/>

                    <div className='flex justify-end items-center gap-10 mt-10'>
                        <button className='text-red-400 text-sm hover:underline cursor-pointer' onClick={() => navigate('/signup')}>Create Account</button>

                        <button className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full cursor-pointer' onClick={handleNext}>Next</button>
                    </div>
                </>
            )}

            {/* Step - 2 */}
            {step === 2 && (
                <>
                    <h1 className='text-3xl font-normal mb-5 text-white flex items-center gap-2'>
                        <img src={logo} alt="logo" className='w-10 h-10'/>
                        Welcome
                    </h1>

                    <div className='flex items-center bg-[#3c4043] text-white px-3 py-2 rounded-full w-fit mb-6'>
                        <FaUserCircle className='mr-2' size={20}/>
                        {email}
                    </div>

                    <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='w-full bg-transparent border border-gray-500 rounded-md px-3 py-3 text-white focus:outline-none focus:border-red-500 mb-4' onChange={(e) => setPassword(e.target.value)} value={password}/>

                    <div className='flex items-center gap-2 mt-3'>
                        <input type="checkbox" id='showPass' checked={showPassword} onChange={() => setShowPassword(!showPassword)}/>
                        <label htmlFor="showPass" className='text-gray-300 cursor-pointer'>Show Password</label>
                    </div>

                    <div className='flex justify-end items-center gap-10 mt-10'>
                        <button className='text-red-400 text-sm hover:underline cursor-pointer' onClick={() => navigate('/forgot-password')}>Forgot Password?</button>

                        <button className='bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full cursor-pointer flex items-center justify-center gap-3' onClick={handleSignIn}>
                          {loading ? (
                            <>
                                <MoonLoader size={20} color="#ffffff" />
                                <span>Signing...</span>
                            </>
                          ) : 'SignIn'}
                        </button>
                    </div>
                </>
            )}

            
        </div>
    </div>
  )
}

export default SignIn
