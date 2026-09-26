import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, AuthResponse, ApiError } from '../../types';
import apiClient from '../../lib/api/client';

interface AuthState {
 user: User | null;
 isAuthenticated: boolean;
 isLoading: boolean;
 error: string | null;
}

const initialState: AuthState = {
 user: null,
 isAuthenticated: false,
 isLoading: false,
 error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, Record<string, string>, { rejectValue: ApiError }>(
 'auth/loginUser',
 async (credentials, { rejectWithValue }) => {
 try {
 const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
 localStorage.setItem('accessToken', response.data.accessToken);
 localStorage.setItem('refreshToken', response.data.refreshToken);
 return response.data;
 } catch (err: any) {
 return rejectWithValue(err.response?.data || { error: 'Login failed' });
 }
 }
);

export const registerUser = createAsyncThunk<{ success: boolean; email: string }, Record<string, string>, { rejectValue: ApiError }>(
 'auth/registerUser',
 async (userData, { rejectWithValue }) => {
 try {
 const response = await apiClient.post<{ success: boolean; email: string }>('/auth/register', userData);
 return response.data;
 } catch (err: any) {
 return rejectWithValue(err.response?.data || { error: 'Registration failed' });
 }
 }
);

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: ApiError }>(
 'auth/fetchCurrentUser',
 async (_, { rejectWithValue }) => {
 try {
 const response = await apiClient.get<User>('/auth/me');
 return response.data;
 } catch (err: any) {
 return rejectWithValue(err.response?.data || { error: 'Failed to fetch user' });
 }
 }
);

export const logoutUser = createAsyncThunk(
 'auth/logoutUser',
 async (_, { dispatch }) => {
 const refreshToken = localStorage.getItem('refreshToken');
 try {
 if (refreshToken) {
 await apiClient.post('/auth/logout', { refreshToken });
 }
 } finally {
 localStorage.removeItem('accessToken');
 localStorage.removeItem('refreshToken');
 dispatch(authSlice.actions.clearAuth());
 }
 }
);

const authSlice = createSlice({
 name: 'auth',
 initialState,
 reducers: {
 clearAuth(state) {
 state.user = null;
 state.isAuthenticated = false;
 state.error = null;
 },
 clearError(state) {
 state.error = null;
 }
 },
 extraReducers: (builder) => {
 builder
 // Login
 .addCase(loginUser.pending, (state) => {
 state.isLoading = true;
 state.error = null;
 })
 .addCase(loginUser.fulfilled, (state, action) => {
 state.isLoading = false;
 state.isAuthenticated = true;
 state.user = action.payload.user;
 })
 .addCase(loginUser.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload?.error || action.error.message || 'Login failed';
 })
 // Register
 .addCase(registerUser.pending, (state) => {
 state.isLoading = true;
 state.error = null;
 })
 .addCase(registerUser.fulfilled, (state, action) => {
 state.isLoading = false;
 state.isAuthenticated = false;
 state.user = null;
 })
 .addCase(registerUser.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload?.error || action.error.message || 'Registration failed';
 })
 // Fetch User
 .addCase(fetchCurrentUser.pending, (state) => {
 state.isLoading = true;
 })
 .addCase(fetchCurrentUser.fulfilled, (state, action) => {
 state.isLoading = false;
 state.isAuthenticated = true;
 state.user = action.payload;
 })
 .addCase(fetchCurrentUser.rejected, (state) => {
 state.isLoading = false;
 state.isAuthenticated = false;
 state.user = null;
 });
 },
});

export const { clearAuth, clearError } = authSlice.actions;
export default authSlice.reducer;
