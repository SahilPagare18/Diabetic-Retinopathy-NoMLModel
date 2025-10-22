import { createSlice } from '@reduxjs/toolkit';

// 1. Check localStorage for an existing user session
const storedUser = localStorage.getItem('user');

// 2. Define the initial state based on localStorage
const initialState = {
  // If storedUser exists, parse it from JSON, otherwise set to null
  user: storedUser ? JSON.parse(storedUser) : null,
  // Set isAuthenticated to true if user exists, otherwise false
  isAuthenticated: storedUser ? true : false,
};

export const authSlice = createSlice({
  // The name of this "slice" of state
  name: 'auth',
  initialState,
  
  // Reducers are functions that define how the state can be updated
  reducers: {
    
    /**
     * Login Reducer:
     * This is called when a user successfully logs in.
     * It receives the user object (with role, email, etc.) as 'action.payload'.
     */
    login: (state, action) => {
      const user = action.payload;
      
      // 1. Save user data to the Redux state
      state.user = user;
      state.isAuthenticated = true;
      
      // 2. Save user data to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
    },
    
    /**
     * Logout Reducer:
     * This is called when a user logs out.
     * It resets the state back to its initial (logged-out) values.
     */
    logout: (state) => {
      // 1. Clear the Redux state
      state.user = null;
      state.isAuthenticated = false;
      
      // 2. Remove the user from localStorage
      localStorage.removeItem('user');
    },
  },
});

// 3. Export the action creators (login, logout)
export const { login, logout } = authSlice.actions;

// 4. Export the reducer itself
export default authSlice.reducer;