import React, { useRef, useState } from 'react'
import logo from '../assets/ytlogo.png';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiPlus, FiSearch } from "react-icons/fi";
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
import { IoIosAddCircle } from 'react-icons/io';
import {GoVideo} from 'react-icons/go';
import { SiYoutubeshorts } from "react-icons/si";
import {MdOutlineSubscriptions} from 'react-icons/md';
import { useSelector } from 'react-redux';
import Profile from '../Components/Profile';
import AllVideosPage from '../Components/AllVideosPage';
import AllShortsPage from '../Components/AllShortsPage';
import { showCustomAlert } from '../Components/CustomAlert';
import axios from 'axios';
import { serverUrl } from '../App';
import MoonLoader from 'react-spinners/MoonLoader';
import SearchResults from '../Components/SearchResults';
import FilterResults from '../Components/FilterResults';
import RecommendedContent from './RecommendedContent';


const Home = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const {userData, subscribedChannels} = useSelector((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState('Home');
  const [active, setActive] = useState('');
  const [popup, setPopup] = useState(false);
  const [searchPopup, setSearchPopup] = useState(false);
  const [listening, setListening] = useState();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState('');
  const [filterData, setFilterData] = useState('');


  function speak(message) {
    let utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };


  const recognitionRef = useRef();

  if(!recognitionRef.current && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuos = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';
  }

  const handleSearch = async () => {
    if(!recognitionRef) {
      showCustomAlert('Speech recognition not supports your browser!');
      return;
    }

    if(listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    
    setListening(true);
    recognitionRef.current.start();
    recognitionRef.current.onresult = async (e) => {
      const transcript = e?.results[0][0]?.transcript.trim();
      setInput(transcript);
      setListening(false);
      await handleSearchData(transcript);
    };

    recognitionRef.current.onerror = (err) => {
      setListening(false);

      if(err.error === 'no-speech') {
        showCustomAlert('No speech was detected. Please try again.');
      } else {
        showCustomAlert('Voice search failed. Try again.');
      }
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };
  };


  const handleSearchData = async (query) => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/content/search`, {input: query}, {
        withCredentials: true
      });
      setSearchData(result.data);
      setLoading(false);
      setInput('');
      setSearchPopup(false);

      const { videos = [], shorts = [], playlists = [], channels = [] } = result.data;

      if(
        videos?.length > 0 ||
        shorts?.length > 0 ||
        playlists?.length > 0 ||
        channels?.length > 0
      ) {
        speak('These are the top search results I found for you');
        
      } else {
        speak('No results found');

      }

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const categories = [
    'Music', 'Gaming', 'Movies', 'TV Shows', 'News', 'Trending', 'Entertainment', 'Education', 'Science & Technology', 'Sports', 'Travel', 'Fashion', 'Cooking', 'Pets', 'Art', 'Comedy', 'Vlogs'
  ];

  const handleCategoryFilter = async (category) => {
    try {
      const result = await axios.post(`${serverUrl}/api/content/filter`, {input: category}, {
        withCredentials: true
      });

      const { videos = [], shorts = [], channels = [] } = result.data;

      let channelVideos = [];
      let channelShorts = [];
      channels.forEach((ch) => {
        if(ch.videos?.length) {
          channelVideos.push(...ch.videos);
        }

        if(ch.shorts?.length) {
          channelShorts.push(...ch.shorts);
        }
      });

      setFilterData({
        ...result.data,
        videos: [...videos, ...channelVideos],
        shorts: [...shorts, ...channelShorts],
      });

      navigate('/');

      if(
        videos?.length > 0 ||
        shorts?.length > 0 ||
        channelVideos?.length > 0 ||
        channelShorts?.length > 0
      ) {
        speak(`Here are some ${category} related videos and shorts for you`);

      } else {
        speak('No result found!');
      }

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='bg-[#0f0f0f] text-white min-h-screen relative'>

      {searchPopup && (
        <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn'>
          <div className='bg-[#1f1f1f]/90 backdrop-blur-md rounded-2xl shadow-2xl w-[90%] max-w-md min-h-100 sm:min-h-120 p-8 flex flex-col items-center justify-between gap-8 relative border border-gray-700 transition-all duration-300'>
            <button className='absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer' onClick={() => setSearchPopup(false)}>
              <FaTimes size={22}/>
            </button>

            <div className='flex flex-col items-center gap-3'>
              {listening ? (
                <h1 className='text-xl sm:text-2xl font-semibold text-red-400 animate-pulse'>Listening...</h1>
              ) : (
                <h1 className='text-lg sm:text-xl font-medium text-gray-300'>Speak or type your query</h1>
              )}

              {/* Show Recognized Text */}
              {input && (
                <span className='text-center text-lg sm:text-xl text-gray-200 px-4 py-2 rounded-lg bg-[#2a2a2a]/60'>{input}</span>
              )}

              <div className='flex w-full gap-2 md:hidden mt-4'>
                <input 
                  type="text" 
                  className='flex-1 px-4 py-2 rounded-full bg-[#2a2a2a] text-white outline-none border border-gray-600 focus:border-red-400 focus:ring focus:ring-red-500 transition' 
                  placeholder='Type your query'
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                />

                <button 
                  className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-white font-semibold shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center' 
                  onClick={() => handleSearchData(input)}
                  disabled={loading}
                >
                  {loading ? <MoonLoader size={20} color="#ffffff" /> : <FaSearch/>}
                </button>
              </div>
            </div>

            <button className='p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 bg-red-500 hover:bg-red-600 shadow-red-500/40 cursor-pointer flex items-center justify-center' onClick={handleSearch} disabled={loading}>
                {loading ? <MoonLoader size={20} color="#ffffff" /> : <FaMicrophone size={24}/>}
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className='bg-[#0f0f0f] h-15 p-3 border-b border-gray-800 fixed top-0 left-0 right-0 z-50'>
        <div className='flex items-center justify-between'>
          {/* left */}
          <div className='flex items-center gap-3 pl-2'>
            <button className='text-xl hover:bg-[#272727] p-2.5 rounded-full hidden md:inline cursor-pointer' onClick={() => setSidebarOpen(!sidebarOpen)}>
              <FaBars/>
            </button>
            <div>
              <img src={logo} alt="" className=' h-8.5 cursor-pointer' onClick={() => navigate('/')}/>
            </div>
          </div>

          {/* search */}
          <div className='hidden md:flex items-center gap-2 flex-1 max-w-2xl'>
            <div className='flex flex-1 '>
              <input 
                type="text" 
                className='flex-1 bg-[#121212] px-4 py-2 rounded-l-full outline-none border border-gray-700' 
                placeholder='Search'
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <button className='bg-[#272727] px-6 py-1 rounded-r-full border-gray-700 cursor-pointer flex items-center justify-center' onClick={() => handleSearchData(input)} disabled={loading}>
                {loading ? <MoonLoader size={20} color="#ffffff" /> : <FiSearch className='w-6 h-6'/>}
              </button>
            </div>
            <button className='bg-[#272727] p-2.5 rounded-full cursor-pointer' onClick={() => setSearchPopup(!searchPopup)}>
              <FaMicrophone className='w-5 h-5'/>
            </button>
          </div>

          {/* right */}
          <div className='flex items-center gap-3'>
            {userData?.channel && <button className='hidden md:flex items-center gap-1 py-1 bg-[#272727] px-3 rounded-full cursor-pointer' onClick={() => navigate('/create-page')}>
              <span className='text-lg'><FiPlus  className='h-6.5 w-6.5'/></span>
              <span>Create</span>
            </button>}
            {userData?.photoUrl ? (
              <img src={userData?.photoUrl} alt="" className='mr-2 w-8 h-8 hidden md:flex cursor-pointer rounded-full object-cover' onClick={() => setPopup(!popup)}/>
            ) : (
              <FaUserCircle className='mr-2 w-8 h-8 hidden md:flex text-gray-400 cursor-pointer' size={20} onClick={() => setPopup(!popup)}/>
            )}
            <FiSearch className='md:hidden text-lg flex cursor-pointer' onClick={() => setSearchPopup(!searchPopup)}/>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 fixed top-15 bottom-0 z-40 ${sidebarOpen ? 'w-60' : 'w-20'} hidden md:flex flex-col overflow-y-auto`}>
        <nav className='space-y-1 mt-3'>
          <SidebarItem icon={<FaHome/>} text={'Home'} open={sidebarOpen} selected={selectedItem === "Home"} onClick={() => {setSelectedItem("Home"), navigate('/')}}/>

          <SidebarItem icon={<SiYoutubeshorts/>} text={'Shorts'} open={sidebarOpen} selected={selectedItem === "Shorts"} onClick={() => {setSelectedItem("Shorts"), navigate('/shorts')}}/>

          <SidebarItem icon={<MdOutlineSubscriptions/>} text={'Subscriptions'} open={sidebarOpen} selected={selectedItem === "Subscriptions"} onClick={() => {setSelectedItem("Subscriptions"); navigate('/subscriptions')}}/>
        </nav>

        <hr className='border-gray-800 my-3'/>

        {sidebarOpen && <p className='text-sm text-gray-400 px-2 ml-6 font-bold'>You</p>}
        <nav className='space-y-1 mt-3'>

          <SidebarItem icon={<FaHistory/>} text={'History'} open={sidebarOpen} selected={selectedItem === "History"} onClick={() => {setSelectedItem("History"); navigate('/history')}}/>

          <SidebarItem icon={<FaList/>} text={'Playlists'} open={sidebarOpen} selected={selectedItem === "Playlists"} onClick={() => {setSelectedItem("Playlists"); navigate('/saved-playlist')}}/>

          <SidebarItem icon={<GoVideo/>} text={'Saved Videos'} open={sidebarOpen} selected={selectedItem === "Saved Videos"} onClick={() => {setSelectedItem("Saved Videos"); navigate('/saved-content')}}/>

          <SidebarItem icon={<FaThumbsUp/>} text={'Liked Videos'} open={sidebarOpen} selected={selectedItem === "Liked Videos"} onClick={() => {setSelectedItem("Liked Videos"); navigate('/liked-content')}}/>
        </nav>

        <hr className='border-gray-800 my-3'/>

        {sidebarOpen && <p className='text-sm text-gray-400 px-2 ml-6 font-bold'>Subscriptions</p>}

        <div className='space-y-1 mt-1'>
          {subscribedChannels?.map((ch) => (
            <button 
              key={ch?._id}
              className={`flex items-center ${sidebarOpen ? 'gap-3 pl-7.5' : 'justify-center'} w-full text-left cursor-pointer p-2 transition ${selectedItem === ch._id ? 'bg-[#272727]' : 'hover:bg-gray-800'}`}
              onClick={() => {setSelectedItem(ch?._id); navigate(`/channel-page/${ch?._id}`)}}
            >
              <img src={ch?.avatar} className='w-6 h-6 rounded-full border border-gray-700 object-cover hover:scale-110 transition-transform duration-200' alt="" />
              {sidebarOpen && (<span className='text-sm text-white truncate'>{ch?.name}</span>)}
            </button>
          ))}
        </div>

      </aside>


      {/* Main Area */}
      <main className={`overflow-y-auto p-4 flex flex-col pb-16 transitio-all duration-300 ${sidebarOpen ? 'md:ml-60' : 'md:ml-20'}`}>

        {location.pathname === '/' && (
          <>
            <div className='flex items-center gap-3 overflow-x-auto scrollbar-hide pt-2 mt-15'>
              {categories?.map((category, index) => (
                <button key={index} className='whitespace-nowrap bg-[#272727] px-4 py-1 rounded-lg text-sm hover:bg-gray-700 cursor-pointer' onClick={() => handleCategoryFilter(category)}>{category}</button>
              ))}
            </div>

            <div className='mt-3'>
              {searchData && (
                <SearchResults searchResults={searchData}/>
              )}

              {filterData && (
                <FilterResults filterResults={filterData}/>
              )}

              {userData ? 
                <RecommendedContent/> 
              : 
                <>
                  <AllVideosPage/>
                  <AllShortsPage/>
                </>
              }

              
            </div>
          </>
        )}

        {popup && <Profile/>}

        <div className='mt-2'>
          <Outlet/>
        </div>
      </main>


      {/* Bottom Navbar */}
      <nav className='md:hidden fixed bottom-0 -left-5 -right-5 bg-[#0f0f0f] border-t border-gray-800 flex justify-around py-2 px-2.5 z-10'>
        <MobileNav icon={<FaHome/>} text={'Home'} active={active === 'Home'} onClick={() => {setActive('Home'), navigate('/')}}/>
        <MobileNav icon={<SiYoutubeshorts/>} text={'Shorts'} active={active === 'Shorts'} onClick={() => {setActive("Shorts"), navigate('/shorts')}}/>
        <MobileNav icon={<IoIosAddCircle/>} text={''} active={active === '+'} onClick={() => {setActive('+'), navigate('/create-page')}}/>
        <MobileNav icon={<MdOutlineSubscriptions/>} text={'Subscribes'} active={active === 'Subscribes'} onClick={() => {setActive('Subscribes'); navigate('/subscriptions')}}/>
        <MobileNav icon={userData?.photoUrl ? <img src={userData?.photoUrl} className='w-6.5 h-6.5 rounded-full
         object-cover'/> : <FaUserCircle/>} text={'You'} active={active === 'You'} onClick={() => {setActive('You'), navigate('/mobile-profile')}}/>
      </nav>

    </div>
  )
}

function SidebarItem({icon, text, open, selected, onClick}) {
  return (
    <button className={`flex items-center gap-4 p-2 rounded w-full transition-colors cursor-pointer ${open ? 'justify-start ml-6' : 'justify-center'} ${selected ? 'bg-[#272727] ' : 'hover:bg-[#272727]'}`} onClick={onClick}>
      <span className='text-lg'>{icon}</span>
      {open && <span className='text-sm'>{text}</span>}
    </button>
  )
};


function MobileNav({icon, text, onClick, active}) {
  return (
    <button className={`flex flex-col items-center justify-evenly px-3 py-2 rounded-lg transition-all duration-300 ${active ? 'text-white' : 'text-gray-400'} hover:scale-105`} onClick={onClick}>
      <span className='text-2xl'>{icon}</span>
      {text && <span className='text-xs truncate'>{text}</span>}
    </button>
  )
}

export default Home;