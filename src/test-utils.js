import {configureStore} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import {todoReducer} from './features/todo/todoSlice.js';

export const renderWithProvider = (component) => {
    const store = configureStore({
        reducer:{
            todo: todoReducer
        }
    });
    render(
        <Provider store={store}>
            {component}
        </Provider>
    );
    return store;
}