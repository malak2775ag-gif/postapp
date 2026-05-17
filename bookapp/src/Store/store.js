import { configureStore } from '@reduxjs/toolkit'
import usersReducer from "../Features/UserSlice";
import bookReducer from "../Features/BookSlice";
import commentReducer from "../Features/commentSlice";
import postReducer from "../Features/PostSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    books: bookReducer,
    comments: commentReducer,
    posts: postReducer,
  },
});
