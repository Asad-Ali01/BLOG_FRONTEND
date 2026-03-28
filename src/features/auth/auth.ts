import {createSlice,type PayloadAction} from '@reduxjs/toolkit';
import type { IUser,IAuthState, IAvatar } from './auth.types';
const initialState: IAuthState = {
    user: null,
    accessToken:null,
    isAuthenticated:false,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login: (
            state,
            action: PayloadAction<{user: IUser; accessToken: string;}>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },

        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false;
        },

        register: (
            state,
            action: PayloadAction<{user: IUser; accessToken:string;}>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true;
        },

        updateUserName: (
            state,
            action: PayloadAction<{username:string}>
        ) => {
            console.log("USername is: ",action.payload.username);
            if(state.user){
                state.user = {
                    ...state.user,
                    username:action.payload.username
                }
            }
        },
        updateAvatar: (
            state,
            action:PayloadAction<{avatar: IAvatar}>
        ) => {
            if(state.user){
                state.user = {
                    ...state.user,
                    avatar: action.payload.avatar
                }
            }
        }
    }
})


export const{
    login,
    logout,
    updateUserName,
    updateAvatar,
    register
} = authSlice.actions;

export default authSlice.reducer;