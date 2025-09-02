import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed' | 'in-progress';
  createdAt: string;
}

interface TicketState {
  tickets: Ticket[];
  ticket: Ticket | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
}

const initialState: TicketState = {
  tickets: [],
  ticket: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },
    setTicket: (state, action: PayloadAction<Ticket>) => {
      state.ticket = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { reset, setTickets, setTicket, setLoading } = ticketSlice.actions;
export default ticketSlice.reducer;
