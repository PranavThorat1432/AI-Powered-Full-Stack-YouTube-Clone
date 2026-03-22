import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setShortHistory, setVideoHistory } from '../Redux/userSlice';

const useGetHistory = () => {
    
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/get-history`, {
                    withCredentials: true
                });

                const history = result.data;

                const videos = history.filter((v) => v.contentType === 'Video');
                const shorts = history.filter((s) => s.contentType === 'Short');

                dispatch(setVideoHistory(videos));
                dispatch(setShortHistory(shorts));
                
            } catch (error) {
                console.log(error);
                dispatch(setVideoHistory(null));
                dispatch(setShortHistory(null));
            }
        }
        fetchHistory();
    }, []);
}

export default useGetHistory;
