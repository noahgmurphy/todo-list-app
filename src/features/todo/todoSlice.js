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
        },
        addSubtask: (state, action) => {
            console.log("called");
            const foundObject = state.find((obj)=>obj.id===action.payload.id);
            console.log(action.payload);
            if(!foundObject.subtasks){
            foundObject.subtasks = [];
            }
            foundObject.subtasks.push(action.payload.task); // pushes object from task key NOT OBJECT CONTAINING ANOTHER **TASK** OBJECT
        },
        completeSubtask: (state, action) =>{
            const foundTaskObject = state.find((obj)=>obj.id===action.payload.id);
            const foundSubtaskObject = foundTaskObject.subtasks.find((obj)=>obj.id===action.payload.subtaskId);
            foundSubtaskObject.completed = true;
        }
    }
})

export const todoReducer = todoSlice.reducer;
export const {addTodo, completeTodo, addSubtask, completeSubtask} = todoSlice.actions;




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