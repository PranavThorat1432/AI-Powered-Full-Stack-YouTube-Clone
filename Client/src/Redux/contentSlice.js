import { createSlice } from "@reduxjs/toolkit";


const contentSlice = createSlice({
    name: 'content',
    initialState: {
        allVideosData: null,
        allShortsData: null,
        contentRevenue: null,
    },
    reducers: {
        setAllVideosData: (state, action) => {
            state.allVideosData = action.payload;
        },
        setAllShortsData: (state, action) => {
            state.allShortsData = action.payload;
        },
        setContentRevenue: (state, action) => {
            state.contentRevenue = action.payload;
        },
    }
});

export const { setAllShortsData, setAllVideosData, setContentRevenue } = contentSlice.actions;
export default contentSlice.reducer; 