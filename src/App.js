import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { auth, getItems, insert, login, logout, update } from './firebase-util';
import { setCurrentUser } from './redux/User/user-actions';
import { getUUID } from './utils/getUUID';
import { addTodos } from './redux/Todos/todo-actions';

function App() {

  const currentUserValues = useSelector(state => state.user.currentUser);
  const todos = useSelector(state => state.todos.todos);
  const dispatch = useDispatch();

  let inputText;

  loadTodos()

  const passCurrentUser = () => { // COMPROBAR LOGIN
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log('User logged:', user.displayName)
        dispatch(setCurrentUser(user))
      } else {
        console.log('No user logged')
      }
    });
  }

  const buttonLogin = async () => {
    try {
      let currentUser;  
      currentUser = await login();
      passCurrentUser();
    } catch (error) {console.log(error)}
  };

  const buttonLogout = async () => {
    logout();
    dispatch(setCurrentUser(''))
  };

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (inputText) {
      addTodo(inputText);
      loadTodos()
    }
  }

  async function addTodo(text) {
    try {
      const todo = {
        id: getUUID(),
        text: text,
        completed: false,
        userid: currentUserValues.uid
      }
      const response = await insert(todo);
    } catch (error) {
      console.error(error)
    }
  }

  async function loadTodos() {
    try {
      const response = await getItems(currentUserValues.uid);
      dispatch(addTodos(response))
    } catch (error) {
      console.error();
    }
  }

  const handlerCheck = (e) => {
    const id = e.target.id;
    const todo = todos.find((todo) => todo.id === id);
    todo.completed = e.target.checked;
    try {
      update(id, todo)
    } catch (error) {
      console.error(error);
    }
  }

  return (   
    <div className="App">
      <button id="button-login" onClick={() => buttonLogin()} hidden={currentUserValues}>Login with Google</button>
      <button id="button-logout" onClick={() => buttonLogout()} hidden={!currentUserValues}>Logout</button>
      <form id="todo-form" hidden={!currentUserValues} onSubmit={(e) => handlerSubmit(e)}>
        <div id="user-info">
          {currentUserValues ?
          <>
            <img src={currentUserValues.photoURL} width={'32px'} alt='img'/>
            <span>{currentUserValues.displayName}</span>
          </>
          : ""
        }
        </div>
        <input
          id="todo-input"
          type="text"
          placeholder="Todo"
          autoComplete="off"
          onChange={(e) => {inputText = e.target.value}}
        />
      </form>

      <div id="todos-container">
        { currentUserValues ?
          Object.entries(todos).map(([iN, todo]) => { 
            console.log(todo)
            return (
            <li><input type="checkbox" id={todo.id} onClick={handlerCheck}/><span>{todo.text}</span></li>
          )
          }) : ""
        }  
      </div>
    </div>
  );
}

export default App;


