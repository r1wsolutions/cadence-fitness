import { createSlice } from "@reduxjs/toolkit";

const initialCustomWoListState = {
    customWorkouts: [
        {name: 'PUSHUPS'},
        {name: 'DIPS'},
        {name: 'PULLUPS'},
        {name: 'SIT-UPS'},
        {name: 'PLANKS'},
        {name: 'CRUNCHES'},
        {name: 'MOUNTAIN CLIMBERS'},
        {name: 'HANGING ABS EX'},
        {name: 'LUNGES'},
        {name: 'BURPEES'},
        {name: 'SQUATS'},
        {name: 'JUMP SQUATS'},
        {name: 'PISTOL SQUATS'},
    ],
    listUpdated: false
}

const customWoListReducerSlice = createSlice({
    name:'customWoReducer',
    initialState: initialCustomWoListState,
    reducers:{
        addWorkoutName(state,action){
            state.customWorkouts.push({name: action.payload.name})
        },
        addList(state,action){

        },
        setListUpdated(state,action){
            state.listUpdated = action.payload.listUpdated
        }
    }
})

export const customWoListReducerSliceActions = customWoListReducerSlice.actions

export default customWoListReducerSlice.reducer