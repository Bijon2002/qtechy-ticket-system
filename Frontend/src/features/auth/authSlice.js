import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginAPI, registerAPI } from '../../api/authAPI';
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');
export const loginUser = createAsyncThunk('auth/login', async (creds, thunkAPI) => {
try {
const res = await loginAPI(creds);
localStorage.setItem('user', JSON.stringify(res.data.data.user));
localStorage.setItem('token', res.data.data.token);
return res.data.data;
} catch (err) {
return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
}
});
export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
try {
const res = await registerAPI(data);
localStorage.setItem('user', JSON.stringify(res.data.data.user));
localStorage.setItem('token', res.data.data.token);
return res.data.data;
} catch (err) {
return thunkAPI.rejectWithValue(err.response?.data?.message || 'Register failed');
}
});
const authSlice = createSlice({
name: 'auth',
initialState: { user: user || null, token: token || null, loading: false, error: null },
reducers: {
logout: (state) => {
state.user = null; state.token = null;
localStorage.removeItem('user');
localStorage.removeItem('token');
},
},
extraReducers: (builder) => {
builder
.addCase(loginUser.pending, (s) => { s.loading = true; s.error = null; })
.addCase(loginUser.fulfilled, (s, a) => { s.loading=false; s.user=a.payload.user;
s.token=a.payload.token; })
.addCase(loginUser.rejected, (s, a) => { s.loading=false; s.error=a.payload; })
.addCase(registerUser.pending, (s) => { s.loading = true; s.error = null; })
.addCase(registerUser.fulfilled, (s, a) => { s.loading=false; s.user=a.payload.user;
s.token=a.payload.token; })
.addCase(registerUser.rejected, (s, a) => { s.loading=false; s.error=a.payload; });
},
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;