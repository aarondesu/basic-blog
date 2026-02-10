import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit/react";
import { getSupabaseServerClient } from "~/lib/supabase";

interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

// Async Thunks
export const checkAuth = createAsyncThunk(
  "auth/isAuthenticated",
  async (request: Request, thunkApi) => {
    const client = getSupabaseServerClient(request);
    const user = await client.auth.getUser();

    return user.data.user !== null;
  },
);

export const authSlice = createSlice({
  name: "authSlice",
  initialState: initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.isAuthenticated = false;
    });
  },
});

export const { setAuthenticated } = authSlice.actions;

export default authSlice.reducer;
