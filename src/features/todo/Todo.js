import React from 'react';
import {addTodo} from './todoSlice.js';
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
    const handleClick = () => {
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

    //Select Data
    const data = useSelector((state)=>state.todo)

    const printState = () =>{
      
       console.log(data);
    }

return(
    <div>
        <div>
            <input type="text" id="todo_input"></input>
            <button onClick={handleClick}>+</button>
            <button onClick={printState}>PRINT</button>
        </div>
        <div>
            <ul>
                {data.length > 0 && data.map((data)=>(
                    <div>
                        <li>{data.text}</li>
                        <li>{data.id}</li>
                        <button>DONE</button>
                    </div>
                ))}
            </ul>
        </div>
    </div>
    )
}