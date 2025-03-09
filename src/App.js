
import './App.css';

import {Todo} from './features/todo/Todo.js'
import React from 'react';
import {useDispatch} from 'react-redux';

function App(props) {
  const dispatch = useDispatch();
  
  return (
    <div>
      <Todo state={props.store} dispatch={dispatch}></Todo>
    </div>
  );
}

export default App;
