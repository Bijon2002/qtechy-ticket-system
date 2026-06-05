import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const fetchStats = createAsyncThunk('dashboard/stats', async (_, { getState, rejectWithValue }) =>
{
try {
const token = getState().auth.token;
const res = await axios.get(`${BASE}/dashboard/stats`, {
headers: { Authorization: `Bearer ${token}` }
});
return res.data.data;
} catch (e) { return rejectWithValue(e.response?.data?.message); }
});
const dashboardSlice = createSlice({
name: 'dashboard',
initialState: { stats: null, loading: false },
reducers: {},
extraReducers: (b) => {
b.addCase(fetchStats.pending, (s) => { s.loading = true; })
.addCase(fetchStats.fulfilled, (s, a) => { s.loading=false; s.stats=a.payload; })
.addCase(fetchStats.rejected, (s) => { s.loading = false; });
}
});
export default dashboardSlice.reducer;