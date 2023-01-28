import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

export interface AuthState {
  user: {
    email: string | null;
    name: string;
    role: string | null;
  };
}

interface User {
  email: string;
  name: string;
  role: string;
}

const initialState: AuthState = {
  user: { email: "", name: "", role: "" },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<User>) => {
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      state.user.role = action.payload.role;
    },

    removeUser: (state) => {
      state.user.email = null;
      state.user.name = "";
      state.user.role = "";
    },
  },
});

// Action creators are generated for each case reducer function
export const { registerUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
