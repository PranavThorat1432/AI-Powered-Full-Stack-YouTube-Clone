import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiLogOut, FiThumbsUp } from 'react-icons/fi';
import { MdOutlineSwitchAccount } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { TiUserAddOutline } from 'react-icons/ti';
import { SiYoutubestudio } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import {
  FaBars, 
  FaUserCircle,
  FaHome,
  FaHistory,
  FaList,
  FaThumbsUp,
  FaSearch,
  FaMicrophone,
  FaTimes
} from 'react-icons/fa';
import { GoVideo } from 'react-icons/go';
import { serverUrl } from '../App';
import axios from 'axios';
import { setUserData } from '../Redux/userSlice';
import { showCustomAlert } from './CustomAlert';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Utils/firebase';


const MobileProfile = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user);

    const handleSignout = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, {
                withCredentials: true
            });
            console.log(result.data);
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
    <div className='md:hidden bg-[#0f0f0f] text-white h-full w-full top-[3%] flex flex-col pt-25 p-2.5 '>
        
        {/* Top Profile Section */}
        {userData && (
            <div className='p-4 flex items-center gap-4 border-b border-gray-800'>
                {userData?.photoUrl && (
                    <img src={userData?.photoUrl} alt="" className='w-16 h-16 rounded-full object-cover '/>
                )}

                <div className='flex flex-col'>
                    <span className='font-semibold text-lg'>{userData?.userName}</span>
                    <span className='text-gray-400 text-sm'>{userData?.email}</span>
                    <p 
                        className='text-sm text-blue-400 cursor-pointer hover:underline'
                        onClick={() => {userData?.channel ? navigate('/view-channel') : navigate('/create-channel')}}
                    >
                            {userData?.channel ? 'View your Channel' : 'Create Channel'}
                    </p>
                </div>
            </div>
        )}

        {/* Auth Buttons */}
        <div className='flex gap-2 p-4 border-b border-gray-800 overflow-auto'>
            <button onClick={handleGoogleAuth} className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'>
                <FcGoogle className='text-xl'/>
                SignIn with Google Account
            </button>
            <button onClick={() => navigate('/signup')} className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'>
                <TiUserAddOutline className='text-xl'/>
                Create New Account
            </button>
            <button onClick={() => navigate('/signin')} className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'>
                <MdOutlineSwitchAccount className='text-xl'/>
                SignIn with Another Account
            </button>
            <button onClick={handleSignout} className='bg-gray-800 text-nowrap px-3 py-1 rounded-2xl text-sm flex items-center justify-center gap-2'>
                <FiLogOut className='text-xl'/>
                SignOut
            </button>
        </div>


        {/*  */}
        <div className='flex flex-col mt-5'>
            <ProfileMenuItem icon={<FaHistory/>} text={'History'} onClick={() => navigate('/history')}/>
            <ProfileMenuItem icon={<FaList/>} text={'Playlists'} onClick={() => navigate('/saved-playlist')}/>
            <ProfileMenuItem icon={<GoVideo/>} text={'Saved Videos'} onClick={() => navigate('/saved-content')}/>
            <ProfileMenuItem icon={<FiThumbsUp/>} text={'Liked Videos'} onClick={() => navigate('/liked-content')}/>
            <ProfileMenuItem icon={<SiYoutubestudio/>} text={'YT Studio'} onClick={() => navigate('/yt-studio/dashboard')}/>
        </div>

    </div>
  )
}

function ProfileMenuItem({icon, text, onClick}) {
    return (
        <button className='flex items-center gap-3 p-4 active:bg-[#272727] text-left' onClick={onClick}>
            <span className='text-lg'>{icon}</span>
            <span className='text-sm'>{text}</span>
        </button>
    )
}

export default MobileProfile
