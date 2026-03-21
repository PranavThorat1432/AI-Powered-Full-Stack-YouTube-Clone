import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setAllChannelData, setChannelData } from '../Redux/userSlice';

const useGetChannelData = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/get-channel`, {
                    withCredentials: true
                });
                console.log(result.data);
                dispatch(setChannelData(result.data));
                
            } catch (error) {
                console.log(error);
                dispatch(setChannelData(null));
            }
        }
        fetchChannelData();
    }, []);

    useEffect(() => {
        const fetchAllChannelData = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/all-channels`, {
                    withCredentials: true
                });
                console.log(result.data);
                dispatch(setAllChannelData(result.data));
                
            } catch (error) {
                console.log(error);
                dispatch(setAllChannelData(null));
            }
        }
        fetchAllChannelData();
    }, []);
}

export default useGetChannelData;
