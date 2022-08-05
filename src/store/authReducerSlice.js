import { createSlice } from "@reduxjs/toolkit";


const initailAuthState = {
    authToken: '',
    uid: null,
    isSignedIn: false,
    signInFailed: false,
    autoSignOutTime: null,
    profile: null
}

const authReducer = createSlice({
    name: 'authReducer',
    initialState: initailAuthState,
    reducers: {
        registerSignInAction(state, action){
            if(action.payload.error)
            {
                state.signInFailed = true
                return
            }
            
            state.signInFailed = false
            state.authToken = action.payload.idToken
            state.uid = action.payload.localId
            state.isSignedIn = true
            state.autoSignOutTime = new Date(Date.now()).getTime() + (parseInt(action.payload.expiresIn) * 1000) 
            //state.autoSignOutTime = new Date(Date.now()).getTime() + (120000)
            
            if(localStorage.getItem('authToken'))
            {
                localStorage.clear()
            }
            
            localStorage.setItem('authToken', action.payload.idToken)
            localStorage.setItem('uid', action.payload.localId)
            localStorage.setItem('authExpireTiime', new Date(state.autoSignOutTime).getTime())
        },
        signOut(state, action){ 

            if(!state)
            {
                console.log('signing out')
            }

            localStorage.clear()
            state.authToken = ''
            state.uid = ''
            state.autoSignOutTime = null
            state.isSignedIn = false
        },
        checkAuthStatus(state, action){

            const currentTime = new Date(Date.now())
    
            if(localStorage.getItem('authExpireTiime'))
            {
                state.autoSignOutTime = parseInt(localStorage.getItem('authExpireTiime'))
            }
            
            if(state.autoSignOutTime != null)
            {
                const expireTimeString = new Date(state.autoSignOutTime).getTime().toString()
                
                if(parseInt(expireTimeString) > parseInt(currentTime.getTime()))
                {
                    state.authToken = localStorage.getItem('authToken')
                    state.isSignedIn = true
                    state.uid = localStorage.getItem('uid')
                    return
                }
            }

            localStorage.clear()
            state.authToken = ''
            state.uid = ''
            state.autoSignOutTime = null
            state.isSignedIn = false
            
        },
        setProfile(state, action)
        {
            if(action.payload.error)
            {
                return
            }

            state.profile = action.payload.profile
        }   
    }
})

export const authReducerActions = authReducer.actions

export default authReducer.reducer