import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setRecommendedContent } from '../Redux/userSlice';

const useGetRecommendedContent = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchRecommendedContent = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/recommendation`, {
                    withCredentials: true
                });
                dispatch(setRecommendedContent(result.data));
                
            } catch (error) {
                console.log(error);
                dispatch(setRecommendedContent(null));
            }
        }
        fetchRecommendedContent();
    }, []);
}

export default useGetRecommendedContent;
