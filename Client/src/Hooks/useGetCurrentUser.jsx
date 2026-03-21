import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../Redux/userSlice';

const useGetCurrentUser = () => {

    const dispatch = useDispatch();
    const {channelData} = useSelector((state) => state.user);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/get-user`, {
                    withCredentials: true
                });
                console.log(result.data);
                dispatch(setUserData(result.data));
                
            } catch (error) {
                console.log(error);
                dispatch(setUserData(null));
            }
        }
        fetchUser();
    }, [channelData]);
}

export default useGetCurrentUser;
