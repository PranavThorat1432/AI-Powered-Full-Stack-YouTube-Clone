import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiLogOut } from 'react-icons/fi';
import { MdOutlineSwitchAccount } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { TiUserAddOutline } from 'react-icons/ti';
import { SiYoutubestudio } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { showCustomAlert } from './CustomAlert';
import { setUserData } from '../Redux/userSlice';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';


const Profile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user);

    const handleSignout = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true
            });
            dispatch(setUserData(null));
            showCustomAlert('Signed Out!');

        } catch (error) {
            console.log(error);
        }
    };


    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth, provider);
            console.log(response);

            let user = response.user;
            let userName = user?.displayName;
            let email = user?.email;
            let photoUrl = user?.photoURL;

            const formData = new FormData();
            formData.append('userName', userName);
            formData.append('email', email);
            formData.append('photoUrl', photoUrl);

            const result = await axios.post(`${serverUrl}/api/auth/google-auth`, formData, {
                withCredentials: true
            });
            dispatch(setUserData(result.data));
            showCustomAlert('Signed In!');
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    };
    

  return (
    <div className=''>
        <div className='absolute right-5 top-10 mt-5 w-72 bg-[#212121] text-white rounded-xl shadow-lg z-50'>
            {userData && (
                <div className='flex items-start gap-3 p-4 border-b border-gray-700'>
                    <img src={userData?.photoUrl} className='w-12 h-12 flex items-center justify-center rounded-full object-cover border border-gray-700' alt="" />

                    <div>
                        <h4 className='font-semibold'>{userData?.userName}</h4>
                        <p className='text-sm text-gray-400'>{userData?.email}</p>
                        <p 
                            className='text-sm text-blue-400 cursor-pointer hover:underline mt-4' 
                            onClick={() => {userData?.channel ? navigate('/view-channel') : navigate('/create-channel')}}
                        >
                                {userData?.channel ? (
                                    'View your Channel'
                                ) : (
                                    'Create Channel'
                                )}
                        </p>
                    </div>
                </div>
            )}

            <div className='flex flex-col py-2'>
                <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer' onClick={handleGoogleAuth}>
                    <FcGoogle className='text-xl'/>
                    SignIn with Google Account
                </button>
                <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer' onClick={() => navigate('/signup')}>
                    <MdOutlineSwitchAccount className='text-xl'/>
                    Create New Account
                </button>
                <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer' onClick={() => navigate('/signin')}>
                    <TiUserAddOutline className='text-xl'/>
                    SignIn with Other Account
                </button>
                {userData?.channel && (
                    <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer' onClick={() => navigate('/yt-studio/dashboard')}>
                        <SiYoutubestudio className='w-5 h-5 text-red-500'/>
                        YT Studio
                    </button>
                )}
                {userData && (
                    <button className='flex items-center gap-3 px-4 py-2 hover:bg-gray-700 cursor-pointer' onClick={handleSignout}>
                        <FiLogOut className='text-xl'/>
                        SignOut
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}

export default Profile
