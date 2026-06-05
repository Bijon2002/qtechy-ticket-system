/**
 * Redux Store Configuration
 * Combines all feature reducers into a single global store.
 */

import { configureStore } from "@reduxjs/toolkit";

// Import Reducers
import authReducer from "../features/auth/authSlice";
import ticketReducer from "../features/tickets/ticketSlice";
import userReducer from "../features/users/userSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

// Configure and export the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    users: userReducer,
    dashboard: dashboardReducer,
  },
});
