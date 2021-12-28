import { combineReducers } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import userReducer from "./User/user-reducer";
import todoReducer from './Todos/todo-reducer';

const persistConfig = {
  key: 'root',
  storage: storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  todos: todoReducer,
});

export default persistReducer(persistConfig, rootReducer);
