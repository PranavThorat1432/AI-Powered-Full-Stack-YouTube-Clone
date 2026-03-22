import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setAllShortsData, setAllVideosData } from '../Redux/contentSlice';

const useGetContentData = () => {

    const dispatch = useDispatch();
    const {userData} = useSelector((state) => state.user);

    // For Videos
    useEffect(() => {
        const fetchAllVideos = async () => {
            try {
                // Use public endpoint if user is not authenticated, otherwise use authenticated endpoint
                const endpoint = userData ? '/api/content/get-videos' : '/api/content/videos/public';
                const result = await axios.get(`${serverUrl}${endpoint}`, {
                    withCredentials: true
                });
                dispatch(setAllVideosData(result.data));
                
            } catch (error) {
                console.log(error);
                dispatch(setAllVideosData(null));
            }
        }
        fetchAllVideos();
    }, [userData]);

    // For Shorts
    useEffect(() => {
        const fetchAllShorts = async () => {
            try {
                // Use public endpoint if user is not authenticated, otherwise use authenticated endpoint
                const endpoint = userData ? '/api/content/get-shorts' : '/api/content/shorts/public';
                const result = await axios.get(`${serverUrl}${endpoint}`, {
                    withCredentials: true
                });
                dispatch(setAllShortsData(result.data));
                
            } catch (error) {
                console.log(error);
                dispatch(setAllShortsData(null));
            }
        }
        fetchAllShorts();
    }, [userData]);
}

export default useGetContentData;
