import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({phone, password}, {rejectWithValue}) => {
    try {
      const res = await axios.post('http://10.0.2.2:5000/user/login', {
        phone,
        password,
      });

      const {token, user} = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return {token, user};
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({name, phone, password}, {rejectWithValue}) => {
    try {
      const res = await axios.post('http://10.0.2.2:5000/user/register', {
        name,
        phone,
        password,
      });


   
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  },
);

// Restore user from AsyncStorage
export const restoreUser = createAsyncThunk(
  'auth/restore',
  async (_, {rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const user = JSON.parse(await AsyncStorage.getItem('user'));

      axios.defaults.headers.common['Authorization'] = token
        ? `Bearer ${token}`
        : '';

      return {token, user};
    } catch (err) {
      return rejectWithValue('Failed to restore user from storage.');
    }
  },
);

// Logout
export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.clear();
  delete axios.defaults.headers.common['Authorization'];
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAuthError: state => {
      state.error = null;
    },
    resetAuthState: state => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.user = null;
        state.token = null;
      })

      // Register
      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.user = null;
        state.token = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.user = null;
        state.token = null;
      })

      // Restore
      .addCase(restoreUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.user = null;
        state.token = null;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
        state.error = null;
        if (action.payload.token) {
          axios.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${action.payload.token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
        state.user = null;
        state.token = null;
      })

      // Logout
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = null;
        state.success = false;
        delete axios.defaults.headers.common['Authorization'];
        AsyncStorage.clear().catch(err => {
          console.error('Failed to clear AsyncStorage on logout:', err);
        });
       
      });
  },
});

export const {resetAuthError, resetAuthState} = authSlice.actions;
export default authSlice.reducer;
