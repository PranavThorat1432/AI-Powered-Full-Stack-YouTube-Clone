import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import Home from './Pages/Home'
import CustomAlert, { showCustomAlert } from './Components/CustomAlert'
import Shorts from './Pages/Shorts/Shorts'
import useGetCurrentUser from './Hooks/useGetCurrentUser'
import MobileProfile from './Components/MobileProfile'
import ForgotPassword from './Pages/ForgotPassword'
import CreateChannel from './Pages/Channel/CreateChannel'
import ViewChannel from './Pages/Channel/ViewChannel'
import useGetChannelData from './Hooks/useGetChannelData'
import UpdateChannel from './Pages/Channel/UpdateChannel'
import { useSelector } from 'react-redux'
import CreatePage from './Pages/CreatePage'
import CreateVideo from './Pages/Videos/CreateVideo'
import CreateShort from './Pages/Shorts/CreateShort'
import CreatePost from './Pages/Posts/CreatePost'
import CreatePlaylist from './Pages/Playlists/CreatePlaylist'
import useGetContentData from './Hooks/useGetContentData'
import PlayVideo from './Pages/Videos/PlayVideo'
import PlayShort from './Pages/Shorts/PlayShort'
import ChannelPage from './Pages/Channel/ChannelPage'
import LikedContent from './Pages/LikedContent'
import SavedContent from './Pages/SavedContent'
import SavedPlaylist from './Pages/Playlists/SavedPlaylist'
import useGetSubscribedData from './Hooks/useGetSubscribedData'
import Subscriptions from './Pages/Subscriptions'
import useGetHistory from './Hooks/useGetHistory'
import HistoryContent from './Pages/HistoryContent'
import useGetRecommendedContent from './Hooks/useGetRecommendedContent'
import YTStudio from './Pages/YTStudio'
import Dashboard from './Components/Dashboard'
import Analytics from './Components/Analytics'
import Content from './Components/Content'
import Revenue from './Components/Revenue'
import UpdateVideo from './Pages/Videos/UpdateVideo'
import UpdateShort from './Pages/Shorts/UpdateShort'
import UpdatePlaylist from './Pages/Playlists/UpdatePlaylist'

export const serverUrl = import.meta.env.VITE_SERVER_URL;

const ProtectRoute = ({userData, children}) => {
  if(!userData) {
    showCustomAlert('Please SignUp First!');
    return <Navigate to={'/'} replace/>
  }
  return children;
};

const App = () => {

  useGetCurrentUser();
  useGetChannelData();
  useGetContentData();
  useGetSubscribedData();
  useGetHistory();
  useGetRecommendedContent();

  const {userData} = useSelector((state) => state.user);

  function ChannelPageWrapper() {
    const location = useLocation();
    return <ChannelPage key={location?.pathname}/>
  }
  
  return (
    <>
      <CustomAlert/>
      
      <Routes>
        <Route path='/' element={<Home/>}>
          <Route path='/shorts' element={<Shorts/>}/>
          <Route path='/playshort/:shortId' element={<PlayShort/>}/>
          <Route path='/mobile-profile' element={<ProtectRoute userData={userData}><MobileProfile/></ProtectRoute>}/>
          <Route path='/view-channel' element={<ProtectRoute userData={userData}><ViewChannel/></ProtectRoute>}/>
          <Route path='/update-channel' element={<ProtectRoute userData={userData}><UpdateChannel/></ProtectRoute>}/>
          <Route path='/create-page' element={<ProtectRoute userData={userData}><CreatePage/></ProtectRoute>}/>
          <Route path='/create-video' element={<ProtectRoute userData={userData}><CreateVideo/></ProtectRoute>}/>
          <Route path='/create-short' element={<ProtectRoute userData={userData}><CreateShort/></ProtectRoute>}/>
          <Route path='/create-post' element={<ProtectRoute userData={userData}><CreatePost/></ProtectRoute>}/>
          <Route path='/create-playlist' element={<ProtectRoute userData={userData}><CreatePlaylist/></ProtectRoute>}/>
          <Route path='/channel-page/:channelId' element={<ProtectRoute userData={userData}><ChannelPageWrapper/></ProtectRoute>}/>
          <Route path='/liked-content' element={<ProtectRoute userData={userData}><LikedContent/></ProtectRoute>}/>
          <Route path='/saved-content' element={<ProtectRoute userData={userData}><SavedContent/></ProtectRoute>}/>
          <Route path='/saved-playlist' element={<ProtectRoute userData={userData}><SavedPlaylist/></ProtectRoute>}/>
          <Route path='/subscriptions' element={<ProtectRoute userData={userData}><Subscriptions/></ProtectRoute>}/>
          <Route path='/history' element={<ProtectRoute userData={userData}><HistoryContent/></ProtectRoute>}/>
        </Route>

        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/create-channel' element={<ProtectRoute userData={userData}><CreateChannel/></ProtectRoute>}/>
        <Route path='/play-video/:videoId' element={<PlayVideo/>}/>

        <Route path='/yt-studio' element={<ProtectRoute userData={userData}><YTStudio/></ProtectRoute>}>
          <Route path='/yt-studio/dashboard' element={<ProtectRoute userData={userData}><Dashboard/></ProtectRoute>}/>
          <Route path='/yt-studio/analytics' element={<ProtectRoute userData={userData}><Analytics/></ProtectRoute>}/>
          <Route path='/yt-studio/content' element={<ProtectRoute userData={userData}><Content/></ProtectRoute>}/>
          <Route path='/yt-studio/revenue' element={<ProtectRoute userData={userData}><Revenue/></ProtectRoute>}/>
          <Route path='/yt-studio/update-video/:videoId' element={<ProtectRoute userData={userData}><UpdateVideo/></ProtectRoute>}/>
          <Route path='/yt-studio/update-short/:shortId' element={<ProtectRoute userData={userData}><UpdateShort/></ProtectRoute>}/>
          <Route path='/yt-studio/update-playlist/:playlistId' element={<ProtectRoute userData={userData}><UpdatePlaylist/></ProtectRoute>}/>

        </Route>
      </Routes>
    </>
  )
}

export default App;
