const initialTodo = []
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



export const todoReducer = (todo = initialTodo, action) => {
    switch(action.type){
        case 'todo/addTodo':{
            return[...todo, action.payload]
        }
        default: return todo;
    }
}