import React, {useState, useEffect} from 'react';
import {addTodo, completeTodo, addSubtask, completeSubtask} from './todoSlice.js';
import {useDispatch, useSelector} from 'react-redux';

let counter = 0; //Global counter for id


export const Todo = (props) => {
    const dispatch = useDispatch();

    const[priority, setPriority] = useState();
    const[text, setText] = useState("");
    const[time, setTime] = useState("");
    const[subtask, setSubtask] = useState();
    
    //Genertae id from counter
    
    const generateId = () =>{
        counter++;
        return counter;
    }
   
    const handlePriority = ({target}) =>{
        setPriority(target.value);
    }


    //Handle add button click
    const handleSubmit = (e) => {
        e.preventDefault();
        if(text){
        const id = generateId()
        dispatch(addTodo({
            id: id,
            text: text,
            completed: false,
            priority: priority,
            time: time

        }));
        setText("");
    }
    }

    const handleAddSubtask = (id) =>{
        const input = document.getElementById("subtaskInput");
        const subtaskId = generateId();
        console.log(subtask);
        if(subtask){
        dispatch(addSubtask({
            id: id,
            task: {
                text: subtask,
                id: subtaskId,
                completed: false
            }
        }))}
        console.log(subtaskId);
        setSubtask("");
        //input.value = "";
    }
    const handleCompleteSubtask = (id, subtaskId) => {
        dispatch(completeSubtask({
            id:id,
            subtaskId: subtaskId

        }));
    }

    const handleDoneClick = (id) => {
            console.log(id);
            dispatch(completeTodo({id:id}))
    }

    //Select Data
    const data = useSelector((state)=>state.todo)
    //useEffect Progress bar
    const printState = () =>{
      
       console.log(data);
    }

return(
    <div>
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" id="todo_input" value={text} onChange={(e)=>setText(e.target.value)}></input>
                <input type="time" value={time} onChange={(e)=>setTime(e.target.value)}></input>
                <select value={priority} onChange={(e)=>{setPriority(e.target.value)}}>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM" selected>MEDIUM</option>
                    <option value="LOW">LOW</option>
                </select>
                <button type="submit">+</button>
            </form>
            
            <button onClick={printState}>PRINT</button>
        </div>
        <div>
            <ul>
                {data.length > 0 && data.map((item, index)=>{
                if(item.completed===false){
                    return(
                    <div key={index}>
                        <li style={{backgroundColor: item.priority==='HIGH'? 'red': item.priority==='MEDIUM'? 'orange' : 'green'}} id={item.id}>
                            {item.text}
                            {item.time}
                        </li>
                        <button onClick={()=>{handleDoneClick(item.id)}}>DONE</button>  
                        <input type="text" id="subtaskInput" value={subtask} onChange={(e)=>{setSubtask(e.target.value)}}></input>
                        <button onClick={()=>{handleAddSubtask(item.id)}}></button>
                        {item.subtasks && item.subtasks.map((subtask, index)=>{
                            if (subtask.completed===false){
                        return(
                           <div>
                                <p>{subtask.text}</p>
                                <button onClick={()=>{handleCompleteSubtask(item.id, subtask.id)}}>CHECK</button>
                            </div>
                        )}
                        })}
                        
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