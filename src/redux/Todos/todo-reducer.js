import { ADD_TODOS } from "./todo-actions";

const INITIAL_STATE = {
  todos: [],
}

const todoReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TODOS:
      return {
        ...state,
        todos: action.payload,
      };  

    default:
      return state;
  }
}

export default todoReducer;