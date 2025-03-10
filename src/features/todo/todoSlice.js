const initialTodo = []
//addTodo action creator
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