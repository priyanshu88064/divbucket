import { configureStore } from '@reduxjs/toolkit'
import treeReducer from './reducers/treeReducer';

const store = configureStore({
    devTools:true,
    reducer:{
        treeReducer
    },
});

export default store;