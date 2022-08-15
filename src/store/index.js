import { configureStore } from "@reduxjs/toolkit";
import exerciseCollectionReducer from "./exerciseCollectionSlice";
import authReducer from "./authReducerSlice";
import errorReducer from './errorReducderSlice'
import customWoListReducer from "./customWoListReducerSlice";
import dimensionsReducer from './dimensionsReducer';

const store = configureStore({
    reducer:{
        exerciseCollectionReducer: exerciseCollectionReducer,
        authReducer: authReducer,
        errorReducer: errorReducer,
        customWoListReducer: customWoListReducer,
        dimensionsReducer: dimensionsReducer
    }
})

export default store