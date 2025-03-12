import {createStore, combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit'
import {todoReducer} from './features/todo/todoSlice.js';


const store = configureStore({
    reducer:{
        todo: todoReducer
    }
})
/*
const rootReducer = combineReducers({
    todo: todoReducer
});
const store = createStore(rootReducer);
*/
export default store;

