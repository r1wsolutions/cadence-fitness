import { createSlice } from "@reduxjs/toolkit";

const initialErrorState = {
    hasError: false, 
    message: ''
}
 
const errorReducerSlice = createSlice({
    name: 'errorReducerSlice',
    initialState: initialErrorState,
    reducers: {
        setError(state,action){
            state.hasError = true
            state.message = action.payload.message
        },
        clearError(state){
            state.hasError = false
            state.message = ''
        }
    }
})

export const errorActions = errorReducerSlice.actions
export default errorReducerSlice.reducer