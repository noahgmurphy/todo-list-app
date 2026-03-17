import {createSlice} from '@reduxjs/toolkit';
import { current } from '@reduxjs/toolkit';

const initialTodo = []

const todoSlice = createSlice({
    name: 'todo' ,
    initialState: initialTodo,
    reducers:{
        addTodo: (state, action) => {state.push(action.payload)},
        completeTodo: (state, action) => {
            return state.map((item)=>item.id===action.payload.id ? {
                ...item,
                completed: true 
            } : item)
        },
        deleteTodo: (state, action) =>{
            return state.filter((item)=>item.id != action.payload.id);
        },
        addSubtask: (state, action) => {
            const foundObject = state.find((obj)=>obj.id===action.payload.id);
            if(!foundObject.subtasks){
                foundObject.subtasks = [];
            }
            foundObject.subtasks.push(action.payload.task);
        },
        completeSubtask: (state, action) =>{
            const foundTaskObject = state.find((obj)=>obj.id===action.payload.id);
            const foundSubtaskObject = foundTaskObject.subtasks.find((obj)=>obj.id===action.payload.subtaskId);
            foundSubtaskObject.completed = true;
        },
        changeFilter: (state, action) =>{
            if (action.payload.priority==="FILTER_HIGH_PRIORITY"){
                state.sort((a, b)=>{
                  if (a.priority==="HIGH" && (b.priority==="MEDIUM" || b.priority==="LOW")){
                      return -1;
                  }
                  if (a.priority==="MEDIUM" && b.priority==="LOW"){
                      return -1;
                  }
                  if(b.priority==="HIGH"&&(a.priority==="MEDIUM"||a.priority==="LOW")){
                      return 1;
                  }
                  if(b.priority==="MEDIUM"&&a.priority==="LOW"){
                      return 1;
                  }
                  return 0;
                })  
              }
            if (action.payload.priority==="FILTER_LOW_PRIORITY"){
                state.sort((a, b)=>{
                    if (a.priority==="HIGH" && (b.priority==="MEDIUM" || b.priority==="LOW")){
                        return  1;
                    }
                    if (a.priority==="MEDIUM" && b.priority==="LOW"){
                        return 1;
                    }
                    if(b.priority==="HIGH"&&(a.priority==="MEDIUM"||a.priority==="LOW")){
                        return -1;
                    }
                    if(b.priority==="MEDIUM"&&a.priority==="LOW"){
                        return -1;
                    }
                    return 0;
                })  
            }
        },
        rearrangeList:(state,action)=>{
            const {id1, id2} = action.payload;
            const index1 = state.findIndex(obj=>obj.id==id1);
            const index2 = state.findIndex(obj=>obj.id==id2);
            [state[index1], state[index2]] = [state[index2], state[index1]];
        }

    }
})

export const todoReducer = todoSlice.reducer;
export const {addTodo, completeTodo, deleteTodo, addSubtask, completeSubtask, changeFilter, rearrangeList} = todoSlice.actions;