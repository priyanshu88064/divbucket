import { configureStore } from '@reduxjs/toolkit'
import treeReducer from './reducers/treeReducer';

const store = configureStore({
    reducer:{
        treeReducer
    }
});

export default store;