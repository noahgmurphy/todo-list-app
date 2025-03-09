import {createStore, combineReducers} from 'redux';
import {todoReducer} from './features/todo/todoSlice.js';



const rootReducer = combineReducers({
    todo: todoReducer
});
const store = createStore(rootReducer);

export default store;

