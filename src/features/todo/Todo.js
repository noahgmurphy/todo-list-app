import React, {useState, useEffect, useRef} from 'react';
import {addTodo, completeTodo, addSubtask, completeSubtask, changeFilter, rearrangeList} from './todoSlice.js';
import {useDispatch, useSelector} from 'react-redux';
import styles from './Todo.module.css';

let counter = 0; //Global counter for id


export const Todo = (props) => {
    
    const classForListItem = 'list-item';
    const dispatch = useDispatch();

    const[priority, setPriority] = useState("MEDIUM");
    const[text, setText] = useState("");
    const[time, setTime] = useState("");
    const[subtask, setSubtask] = useState();
    const[percentCompleted, setPercentCompleted] = useState(0);
    
    
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
        setSubtask("");
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
        setPercentCompleted ((completed/data.length)*100);
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
        if (event.target.matches(".list-item")){
            const id1 = event.dataTransfer.getData("text");
            const id2 = event.target.id;
            dispatch(rearrangeList({id1: id1, id2: id2}))
        }
        else if(event.target.closest(".list-item")){
            const id1 = event.dataTransfer.getData("text");
            const id2 = event.target.closest(".list-item").id;
            dispatch(rearrangeList({id1: id1, id2: id2}))
        }
    }
    function allowDrop(event){
        
        event.preventDefault();
    }

    function formatTime(time){
    const parts = time.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);
    const timeObject = new Date();
    timeObject.setHours(hours);
    timeObject.setMinutes(minutes);

    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours?hours:12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return(hours+':'+minutes+ ' ' + ampm);
    }

return(
    <div className={styles.parentContainer}>
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <input className={styles.textInput} type="text" id="todo_input" value={text} onChange={(e)=>setText(e.target.value)}></input>
                <input className={styles.timeInput} type="time" value={time} onChange={(e)=>setTime(e.target.value)}></input>
                <select className={styles.priorityInput} value={priority} onChange={(e)=>{setPriority(e.target.value)}}>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM" selected>MEDIUM</option>
                    <option value="LOW">LOW</option>
                </select>
                <button className={styles.submitButton} type="submit">+ADD</button>
            </form>
            
            
        </div>
        <div id="list-container" className={styles.list}>
            
                {data.length > 0 && data.map((item, index)=>{
                if(item.completed===false){
                    return(
                    <div key={index}  className={` ${classForListItem} ${styles.todoItem}`} style={{backgroundColor: item.priority==='HIGH'? '#F57070': item.priority==='MEDIUM'? '#FFA463' : '#80F570'}}
                    onDragStart={drag} onDrop={drop} onDragOver={allowDrop} draggable="true"  id={item.id} 
                    >
                        <p className={styles.dragSymbol}>&#x2630;</p>
                        <div className={styles.taskContainer}>
                            
                            <p className={styles.taskText}>{item.text}</p>
                        </div>
                        <div className={styles.timeContainer}>
                            <p className={styles.taskTime}>{item.time && formatTime(item.time)}</p>
                        </div>

                        <div  className={styles.buttonContainer}>
                        <button className={styles.doneButton} onClick={()=>{handleDoneClick(item.id)}}>DONE</button>
                        <button className={styles.addSubtaskButton} onClick={()=>{
                           const subElement = document.getElementById("subtask-container"+index)
                           if (subElement.style.display === "none"){
                            subElement.style.display="block";
                           }
                           else subElement.style.display="none";
                        }
                        }>ADD SUBTASK</button>
                        </div>
                        {item.subtasks && item.subtasks.map((subtask, index)=>{
                            if (subtask.completed===false){
                        return(
                           <div className={styles.subtaskContainer}>
                                 <button className={styles.completeSubtaskButton} onClick={()=>{handleCompleteSubtask(item.id, subtask.id)}}>&#x2713;</button>
                                <p className={styles.subtaskText}>|----{subtask.text}</p>
                               
                            </div>
                        )}
                        })}
                        <div className={styles.subtaskInputContainer} id={"subtask-container"+index} style={{display: "none"}}>
                            <input placeholder="ADD SUBTASK" className={styles.subtaskInput} type="text" id={"subtaskInput"+index} onChange={(e)=>{setSubtask(e.target.value)}}></input>
                            <button onClick={()=>{
                                handleAddSubtask(item.id, index);
                                
                                document.getElementById("subtask-container"+index).style.display="none";
                            }}>+</button>
                        </div> 
                    </div>
                    )
                }}
                )
            }
            
            
        </div>
        <div className={styles.percentContainer}>
            <div className={styles.percentFill} style={{width:`${percentCompleted}%`}}>
            </div>
        </div>
        <div>
            <div className={styles.filterContainer}>
                <h3 className={styles.filterText}>FILTER:</h3>
                <select className={styles.filterOptions} onChange={(e)=>{handleFilter(e.target.value)}}>
                    <option value="FILTER_NONE" selected>NONE</option>
                    <option value="FILTER_HIGH_PRIORITY">HIGH PRIORITY FILTER</option>
                    <option value="FILTER_LOW_PRIORITY"> LOW PRIORITY FILTER</option>
                </select>
            </div>
            <div className={styles.completedContainer}>
                <h3>COMPLETED</h3>
                
                    {data.length > 0 && data.map((item, index)=>{
                    if(item.completed===true){
                        return(
                        <div key={index}>
                            <p id={item.id}>
                                {item.text}
                            </p>
                            
                            
                        </div>
                        )
                    }}
                    )
                }
                
            </div>
        </div>
        
        <button onClick={printState}>PRINT</button>
    </div>
    )
}