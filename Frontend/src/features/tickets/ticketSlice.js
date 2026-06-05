import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTicketsAPI, createTicketAPI, updateTicketAPI, deleteTicketAPI, addCommentAPI } from
'../../api/ticketAPI';
export const fetchTickets = createAsyncThunk('tickets/fetchAll', async (params, { getState,
rejectWithValue }) => {
try {
const token = getState().auth.token;
const res = await fetchTicketsAPI(token, params);
return res.data.data;
} catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const createTicket = createAsyncThunk('tickets/create', async (data, { getState, rejectWithValue
}) => {
try {
const token = getState().auth.token;
const res = await createTicketAPI(token, data);
return res.data.data;
} catch (e) { return rejectWithValue(e.response?.data?.message); }
});
export const deleteTicket = createAsyncThunk('tickets/delete', async (id, { getState, rejectWithValue })
=> {
try {
const token = getState().auth.token;
await deleteTicketAPI(token, id);
return id;
} catch (e) { return rejectWithValue(e.response?.data?.message); }
});
const ticketSlice = createSlice({
name: 'tickets',
initialState: { list: [], current: null, total: 0, pages: 0, loading: false, error: null },
reducers: {},
extraReducers: (builder) => {
builder
.addCase(fetchTickets.pending, (s) => { s.loading = true; })
.addCase(fetchTickets.fulfilled, (s, a) => { s.loading=false; s.list=a.payload.tickets;
s.total=a.payload.total; s.pages=a.payload.pages; })
.addCase(fetchTickets.rejected, (s, a) => { s.loading=false; s.error=a.payload; })
.addCase(createTicket.fulfilled, (s, a) => { s.list.unshift(a.payload); })
.addCase(deleteTicket.fulfilled, (s, a) => { s.list = s.list.filter(t => t._id !== a.payload); });
},
});
export default ticketSlice.reducer;