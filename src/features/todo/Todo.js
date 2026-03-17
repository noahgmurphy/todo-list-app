import React, {useState, useEffect, useRef} from 'react';
import {addTodo, completeTodo, deleteTodo, addSubtask, completeSubtask, changeFilter, rearrangeList} from './todoSlice.js';
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
        if(subtask){
            dispatch(addSubtask({
                id: id,
                task: {
                    text: subtask,
                    id: subtaskId,
                    completed: false
                }
            }))
        }
        input.value="";
        setSubtask("");
    }

    const handleCompleteSubtask = (id, subtaskId) => {
        dispatch(completeSubtask({
            id:id,
            subtaskId: subtaskId
        }));
    }

    const handleDoneClick = (id) => {
        dispatch(completeTodo({id:id}))
    }

    const handleDelete = (id) =>{
        dispatch(deleteTodo({id:id}));
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
        }
        //FILTER
        /*
        dispatch(changeFilter({ 
            priority: priority
        }))
        */
    }, [data])
    
    //Filter
    const handleFilter = (filter) => {
        dispatch(changeFilter({ 
            priority: filter
        }))
    }

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
                    <input data-testid="textInput" className={styles.textInput} type="text" id="todo_input" value={text} onChange={(e)=>setText(e.target.value)}></input>
                    <input className={styles.timeInput} type="time" value={time} onChange={(e)=>setTime(e.target.value)}></input>
                    <select data-testid="priorityOption" className={styles.priorityInput} value={priority} onChange={(e)=>{setPriority(e.target.value)}}>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                    </select>
                    <button data-testid="submitButton"className={styles.submitButton} type="submit">+ADD</button>
                </form>
            </div>
            <div id="list-container" className={styles.list}>
                {data.length > 0 && data.map((item, index)=>{
                    if(item.completed===false){
                        return(
                            <div key={item.id}  className={` ${classForListItem} ${styles.todoItem}`} style={{backgroundColor: item.priority==='HIGH'? '#F57070': item.priority==='MEDIUM'? '#FFA463' : '#80F570'}}
                            onDragStart={drag} onDrop={drop} onDragOver={allowDrop} draggable="true"  id={item.id}>
                                <p className={styles.dragSymbol}>&#x2630;</p>
                                <div className={styles.taskContainer}>
                                    <p data-testid="addedItemText" className={styles.taskText}>{item.text}</p>
                                </div>
                                <div className={styles.timeContainer}>
                                    <p className={styles.taskTime}>{item.time && formatTime(item.time)}</p>
                                </div>
                                <div  className={styles.buttonContainer}>
                                    <button data-testid="completeTaskButton" className={styles.doneButton} onClick={()=>{handleDoneClick(item.id)}}>DONE</button>
                                    <button data-testid="displayInputButton" className={styles.addSubtaskButton} onClick={()=>{
                                    const subElement = document.getElementById("subtask-container"+index)
                                    if (subElement.style.display === "none"){
                                        subElement.style.display="block";
                                    }
                                    else subElement.style.display="none";
                                    }
                                    }>ADD SUBTASK</button>
                                    <button data-testid="deleteTaskButton" className={styles.deleteTaskButton} onClick = {()=>{
                                        handleDelete(item.id)
                                    }}>DELETE</button>
                                </div>
                                {item.subtasks && item.subtasks.map((subtask)=>{
                                    if (subtask.completed===false){
                                        return(
                                            <div key="subtask.id" className={styles.subtaskContainer}>
                                                <button data-testid="completeSubtaskButton" className={styles.completeSubtaskButton} onClick={()=>{handleCompleteSubtask(item.id, subtask.id)}}>&#x2713;</button>
                                                <p data-testid="subtaskText" className={styles.subtaskText}>|----{subtask.text}</p>
                                            </div>
                                        )
                                    }
                                })}
                                <div className={styles.subtaskInputContainer} id={"subtask-container"+index} style={{display: "none"}}>
                                    <input data-testid="subtaskTextInput" placeholder="ADD SUBTASK" className={styles.subtaskInput} type="text" id={"subtaskInput"+index} onChange={(e)=>{setSubtask(e.target.value)}}></input>
                                    <button data-testid="addSubtaskButton" onClick={()=>{
                                        handleAddSubtask(item.id, index);
                                        document.getElementById("subtask-container"+index).style.display="none";
                                    }}>+</button>
                                </div> 
                            </div>
                        )
                    }
                })}
            </div>
            <div className={styles.percentContainer}>
                <div className={styles.percentFill} style={{width:`${percentCompleted}%`}}>
                </div>
            </div>
            <div>
                <div className={styles.filterContainer}>
                    <h3 className={styles.filterText}>FILTER:</h3>
                    <select data-testid="priorityFilter" defaultValue="FILTER_NONE"className={styles.filterOptions} onChange={(e)=>{handleFilter(e.target.value)}}>
                        <option value="FILTER_NONE">NONE</option>
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
                        }
                    })}
                </div>
            </div>
        </div>
    )
}