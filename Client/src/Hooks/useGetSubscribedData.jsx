import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscribedChannels, setSubscribedPlaylists, setSubscribedPosts, setSubscribedShorts, setSubscribedVideos, setUserData } from '../Redux/userSlice';

const useGetSubscribedData = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSubscribedData = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/get-subscribed-data`, {
                    withCredentials: true
                });
                dispatch(setSubscribedChannels(result.data.subscribedChannels));
                dispatch(setSubscribedVideos(result.data.videos));
                dispatch(setSubscribedShorts(result.data.shorts));
                dispatch(setSubscribedPlaylists(result.data.playlists));
                dispatch(setSubscribedPosts(result.data.posts));
                
            } catch (error) {
                console.log(error);
                dispatch(setSubscribedChannels(null));
                dispatch(setSubscribedVideos(null));
                dispatch(setSubscribedShorts(null));
                dispatch(setSubscribedPlaylists(null));
                dispatch(setSubscribedPosts(null));
            }
        }
        fetchSubscribedData();
    }, []);
}

export default useGetSubscribedData;
