import {createSlice} from '@reduxjs/toolkit';

const initialTodo = []

///REFACTORING///
const todoSlice = createSlice({
    name: 'todo' ,
    initialState: initialTodo,
    reducers:{
        addTodo: (state, action) => {state.push(action.payload)},
        completeTodo: (state, action) => {
            console.log(action.payload)
            return state.map((item)=>item.id===action.payload.id ? {
                ...item,
                completed: true 
            } : item)
        }
    }
})

export const todoReducer = todoSlice.reducer;
export const {addTodo, completeTodo} = todoSlice.actions;




//addTodo action creator
/*
export const addTodo = (obj) =>{
    return{
        type: 'todo/addTodo',
        payload: {
            id: obj.id,
            text: obj.text,
            completed: false
        }
    }
}

// completeTodo action creator 
export const completeTodo = (id) => {
    return {
        type:'todo/completeTodo',
        payload:{
            id:id
        }
    }
}
*/
/*
export const todoReducer = (todo = initialTodo, action) => {
    switch(action.type){
        
        case 'todo/addTodo':{
            return[...todo, action.payload]
        }

        case 'todo/completeTodo':{
            return todo.map((item)=>item.id===action.payload.id ? {
                ...item,
                completed: true 
            } : item)
        }


        default: return todo;
    }
}
*/