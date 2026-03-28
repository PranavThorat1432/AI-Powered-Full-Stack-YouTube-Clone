import React, { useState } from 'react'
import logo from '../assets/yt.png';
import MoonLoader from 'react-spinners/MoonLoader';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBack } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { showCustomAlert } from '../Components/CustomAlert';


const ForgotPassword = () => {

    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleSendOTP = async () => {
        setLoading(true);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, {email}, {
                withCredentials: true
            });
            setLoading(false);
            showCustomAlert('OTP Sent!');
            setStep(2);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);

        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, {email, otp}, {
                withCredentials: true
            });
            setLoading(false);
            showCustomAlert('OTP Verified!');
            setStep(3);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setLoading(true);

        if(password !== confirmPassword) {
            showCustomAlert('Password does not matched!');
            setLoading(false);
            return;
        }

        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, {email, password} ,{
                withCredentials: true
            });
            setLoading(false);
            showCustomAlert('Password Reset!');
            navigate('/signin');

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };


  return (
    <div className='min-h-screen flex flex-col bg-[#202124] text-white'>
        
        <header className='flex items-center gap-2 p-4 border-b border-gray-700'>
            <img src={logo} alt="" className='w-8 h-8'/>
            <span className='text-white font-bold text-xl tracking-tight font-roboto'>YouTube</span>
        </header>

        <main className='flex flex-1 items-center justify-center px-4'>
            
            {/* Step - 1 */}
            {step === 1 && (
                <div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl '>Forgot Your Password</h2>

                    <form action="" className='space-y-4 mt-5' onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="email" className='block text-sm mb-1 text-gray-300'>Enter your email</label>
                            <input 
                                type="email" 
                                id='email' 
                                placeholder='your@yt.com' 
                                className='mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring focus:ring-red-500' 
                                required 
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <button
                            className='w-full bg-red-600 hover:bg-red-700 transition py-2 px-4 rounded-md font-medium cursor-pointer flex items-center justify-center gap-3'
                            disabled={loading}
                            onClick={handleSendOTP}
                        >
                            {loading ? (
                                <>
                                    <MoonLoader size={20} color="#ffffff" />
                                    <span>Sending OTP...</span>
                                </>
                            ) : 'Send OTP'}
                        </button>
                    </form>

                    <div className='text-sm text-blue-400 hover:text-blue-500 text-center mt-4 cursor-pointer flex items-center justify-center gap-2' onClick={() => navigate('/signin')}>
                        <IoReturnDownBack />
                        Back to SignIn
                    </div>
                </div>
            )}

            {/* Step - 2 */}
            {step === 2 && (
                <div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl '>Enter OTP</h2>

                    <form action="" className='space-y-4 mt-5' onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label htmlFor="otp" className='block text-sm mb-1 text-gray-300'>Please Enter the 4-digit code sent to your email.</label>
                            <input 
                                type="text" 
                                id='otp' 
                                placeholder='****' 
                                className='mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring focus:ring-red-500' 
                                required 
                                onChange={(e) => setOTP(e.target.value)}
                                value={otp}
                            />
                        </div>

                        <button
                            className='w-full bg-red-600 hover:bg-red-700 transition py-2 px-4 rounded-md font-medium cursor-pointer flex items-center justify-center gap-3'
                            disabled={loading}
                            onClick={handleVerifyOTP}
                        >
                            {loading ? (
                                <>
                                    <MoonLoader size={20} color="#ffffff" />
                                    <span>Verifying OTP...</span>
                                </>
                            ) : 'Verify OTP'}
                        </button>
                    </form>

                    <div className='text-sm text-blue-400 hover:text-blue-500 text-center mt-4 cursor-pointer flex items-center justify-center gap-2' onClick={() => navigate('/signin')}>
                        <IoReturnDownBack />
                        Back to SignIn
                    </div>
                </div>
            )}

            {/* Step - 3 */}
            {step === 3 && (
                <div className='bg-[#171717] shadow-lg rounded-2xl p-8 max-w-md w-full'>
                    <h2 className='text-2xl '>Reset Your Password</h2>
                    <p className='text-sm text-gray-400 mb-6'>Enter a New Password below to regain access to your account.</p>

                    <form action="" className='space-y-4 mt-5' onSubmit={(e) => e.preventDefault()}>
                        <div>
                            {/* New Password */}
                            <label htmlFor="new-password" className='block text-sm mb-1 text-gray-300'>New Password</label>
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                id='new-password' 
                                placeholder='* * * * * *' 
                                className='mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring focus:ring-red-500' 
                                required 
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />

                            {/* Confirm Password */}
                            <label htmlFor="confirm-password" className='block text-sm mb-1 text-gray-300 mt-5'>Confirm Password</label>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                id='confirm-password' 
                                placeholder='* * * * * *' 
                                className='mt-1 w-full px-4 py-3 border border-gray-600 rounded-md bg-transparent text-white focus:outline-none focus:ring focus:ring-red-500' 
                                required 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            />
                        </div>

                        <div className='flex items-center gap-2 mt-3'>
                            <input type="checkbox" id='showPass' checked={showPassword} onChange={() => setShowPassword(!showPassword)}/>
                            <label htmlFor="showPass" className='text-gray-300 cursor-pointer'>Show Password</label>
                        </div>

                        <button
                            className='w-full bg-red-600 hover:bg-red-700 transition py-2 px-4 rounded-md font-medium cursor-pointer flex items-center justify-center gap-3'
                            disabled={loading}
                            onClick={handleResetPassword}
                        >
                            {loading ? (
                                <>
                                    <MoonLoader size={20} color="#ffffff" />
                                    <span>Reseting Password...</span>
                                </>
                            ) : 'Reset Password'}
                        </button>
                    </form>

                    <div className='text-sm text-blue-400 hover:text-blue-500 text-center mt-4 cursor-pointer flex items-center justify-center gap-2' onClick={() => navigate('/signin')}>
                        <IoReturnDownBack />
                        Back to SignIn
                    </div>
                </div>
            )}
        </main>
    </div>
  )
}

export default ForgotPassword
