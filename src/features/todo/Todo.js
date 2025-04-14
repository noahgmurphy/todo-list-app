import React, {useState, useEffect, useRef} from 'react';
import {addTodo, completeTodo, addSubtask, completeSubtask, changeFilter, rearrangeList} from './todoSlice.js';
import {useDispatch, useSelector} from 'react-redux';

let counter = 0; //Global counter for id


export const Todo = (props) => {

    
    const dispatch = useDispatch();

    const[priority, setPriority] = useState("MEDIUM");
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

    const handleAddSubtask = (id, index) =>{
        const input = document.getElementById("subtaskInput"+index);
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
        input.value="";
        //setSubtask("");
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
    useEffect(()=>{
        //COMPLETEION BAR
        if(data){
            let completed = 0;
            data.map((item)=>{
            if (item.completed){
                completed++;
            }
        })
        const percentCompleted = completed/data.length;
            console.log(percentCompleted); 
        }
        //FILTER
        dispatch(changeFilter({ 
            priority: "FILTER_PRIORITY"
        }))
       
    }, [data])
    //
    //Filter
       const handleFilter = (filter) => {
        console.log(filter);
        dispatch(changeFilter({ 
            priority: filter
        }))
       }
    //
    const printState = () =>{
      
       console.log(data);
       
    }
    //SHOW SUBTASK INPUT
    /* 
    const handleOffClick = (element, callback) =>{
        document.addEventListener('click', function(event){
            if(!element.contains(event.target)){
                callback(event);
            }
        });
    }
    */
    /*
    const handleShowInput = (e, index) =>{
        
        
        myElement.current.style.display = "block";
    }
    */
    //HANDLE OUTSIDE INPUT CLICK
    /*
    useEffect(()=>{
        function handleClickOutside(event){
            if (myElement && myElement.current && !myElement.current.contains(event.target)){
                console.log("CLICKED OUTSIDE");
                
                
                
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
    return () => {
        
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, [])
    */
    
    /*REARANGE DRAG AND DROP*/
    /*const parentContainer = document.getElementById("list-container");
    if(parentContainer){
    parentContainer.addEventListener("dragstart", function(event){
        if (event.target.matches(".list-item")){
            console.log("DRAG STARTED");
            event.dataTransfer.setData("text", event.target.id);
        }
    })}
    */
    function drag(event){
        if (event.target.matches(".list-item")){
            console.log("DRAG STARTED");
            event.dataTransfer.setData("text", event.target.id);
        }
    }
    function drop(event){
        event.preventDefault();
        const id1 = event.dataTransfer.getData("text");
        
        const id2 = event.target.id;
        dispatch(rearrangeList({id1: id1, id2: id2}))
    }
    function allowDrop(event){
        event.target.style.color="blue";
        event.preventDefault();;
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
        <div id="list-container">
            <ul>
                {data.length > 0 && data.map((item, index)=>{
                if(item.completed===false){
                    return(
                    <div key={index} >
                        <li className="list-item" onDragStart={drag} onDrop={drop} onDragOver={allowDrop} draggable="true" style={{backgroundColor: item.priority==='HIGH'? 'red': item.priority==='MEDIUM'? 'orange' : 'green'}} id={item.id}>
                            {item.text}
                            {item.time}
                        </li>
                        <button onClick={()=>{handleDoneClick(item.id)}}>DONE</button>
                        <button onClick={()=>{
                           const subElement = document.getElementById("subtask-container"+index)
                           if (subElement.style.display === "none"){
                            subElement.style.display="block";
                           }
                           else subElement.style.display="none";
                        }
                        }>ADD SUBTASK</button>
                        <div id={"subtask-container"+index} style={{display: "none"}}>
                            <input type="text" id={"subtaskInput"+index} onChange={(e)=>{setSubtask(e.target.value)}}></input>
                        </div>  
                        <button onClick={()=>{
                                handleAddSubtask(item.id, index);
                                
                                document.getElementById("subtask-container"+index).style.display="none";
                            }}></button>
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
            <h3>FILTER:</h3>
            <select onChange={(e)=>{handleFilter(e.target.value)}}>
                <option value="FILTER_NONE" selected>NONE</option>
                <option value="FILTER_HIGH_PRIORITY">HIGH PRIORITY FILTER</option>
                <option value="FILTER_LOW_PRIORITY"> LOW PRIORITY FILTER</option>
            </select>
        </div>
        <div>
            <h3>COMPLETED</h3>
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