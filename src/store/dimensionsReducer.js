import { createSlice } from "@reduxjs/toolkit";


const dimensionsState = { 
    screenInnerWidth: 0
}

const dimensionsReducer = createSlice({
    initialState: dimensionsState,
    name: 'dimensionsReducer',
    reducers:{
        setInnerWidth:(state, action)=>{
            state.screenInnerWidth = action.payload.screenInnerWidth
        }
    }
})

export const dimensionsActoins = dimensionsReducer.actions
export default dimensionsReducer.reducer