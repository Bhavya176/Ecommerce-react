import handleCart from "./handleCart";
import { combineReducers } from "redux";
const initialUserState = {
  userInfo: null, // You can set it to null or an empty object initially
};
const userReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        userInfo: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        userInfo: action.payload,
      };

    default:
      return state;
  }
};

// Combine your original handleCart reducer and userReducer
const rootReducer = combineReducers({
  handleCart,
  userReducer,
});

export default rootReducer;
