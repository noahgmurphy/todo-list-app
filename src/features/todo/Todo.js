import React from 'react';
import {addTodo, completeTodo} from './todoSlice.js';
import {useDispatch, useSelector} from 'react-redux';
let counter = 0; //Global counter for id

export const Todo = (props) => {
    const dispatch = useDispatch();
    
    //Genertae id from counter
    
    const generateId = () =>{
        counter++;
        return counter;
    }
    

    //Handle add button click
    const handleAddClick = () => {
       const text = document.getElementById('todo_input').value;
        if(text){
        const id = generateId()
        dispatch(addTodo({
            id: id,
            text: text,
            completed: false,

        }));
    }
    }

    const handleDoneClick = (id) => {
            console.log(id);
            dispatch(completeTodo({id:id}))
    }

    //Select Data
    const data = useSelector((state)=>state.todo)

    const printState = () =>{
      
       console.log(data);
    }

return(
    <div>
        <div>
            <input type="text" id="todo_input"></input>
            <button onClick={handleAddClick}>+</button>
            <button onClick={printState}>PRINT</button>
        </div>
        <div>
            <ul>
                {data.length > 0 && data.map((item, index)=>{
                if(item.completed===false){
                    return(
                    <div key={index}>
                        <li id={item.id}>
                            {item.text}
                        </li>
                        
                        <button onClick={()=>{handleDoneClick(item.id)}}>DONE</button>  
                    </div>
                    )
                }}
                )
            }
            </ul>
        </div>
        <div>
            <h2>COMPLETED</h2>
            <ul>
                {data.length > 0 && data.map((item, index)=>{
                if(item.completed===true){
                    return(
                    <div key={index}>
                        <li id={item.id}>
                            {item.text}
                        </li>
                        
                         
                    </div>
                    )
                }}
                )
            }
            </ul>
        </div>
    </div>
    )
}