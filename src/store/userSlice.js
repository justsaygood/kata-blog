import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const baseURL = 'https://blog.kata.academy/api'

export const fetchUserRegistration = createAsyncThunk(
  'user/fetchUserRegistration',
  async (newUser, { rejectWithValue }) => {
    const url = new URL(`${baseURL}/users`) // register a new user
    try {
      const body = {
        user: newUser,
      }
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
      }
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
      })

      return response.json()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchUserLogIn = createAsyncThunk('user/fetchUserLogIn', async (newUser, { rejectWithValue }) => {
  const url = new URL(`${baseURL}/users/login`) // existing user login
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: newUser }),
    })
    if (!response.ok) {
      throw new Error('Data fetching failed')
    }

    response = await response.json()
    return response
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchUserSave = createAsyncThunk('user/fetchUserSave', async (token, { rejectWithValue }) => {
  const url = new URL(`${baseURL}/user`)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    })

    return response.json()
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchUserUpdate = createAsyncThunk(
  'user/fetchUserUpdate',
  async ({ newUser, token }, { rejectWithValue }) => {
    const url = new URL(`${baseURL}/user`)
    try {
      const body = {
        user: newUser,
      }
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })

      return response.json()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    status: null,
    error: null,
  },
  reducers: {
    logOutUser(state) {
      state.userData = null
      state.status = null
      state.error = null
    },
    errorNull(state) {
      state.error = null
    },
  },
  extraReducers: {
    [fetchUserRegistration.pending]: (state) => {
      state.status = 'loading'
      state.error = null
    },
    [fetchUserRegistration.fulfilled]: (state, action) => {
      if (action.payload.user) {
        state.status = 'resolved'
        state.userData = action.payload.user
        return
      }
      if (action.payload.errors) {
        state.status = 'rejected'

        let errStatus = ''

        if (action.payload.errors.error) {
          errStatus += action.payload.errors.error.status
        } else {
          const errArr = Object.entries(action.payload.errors)

          errArr.forEach((item) => {
            errStatus += `${item[0]}: ${item[1]} `
          })
        }
        state.error = errStatus
      }
    },
    [fetchUserRegistration.rejected]: (state, action) => {
      state.status = 'rejected'
      state.error = action.payload
    },
    [fetchUserLogIn.pending]: (state) => {
      state.status = 'loading'
      state.error = null
    },
    [fetchUserLogIn.fulfilled]: (state, action) => {
      if (action.payload.user) {
        state.status = 'resolved'
        state.userData = action.payload.user
        return
      }
      if (action.payload.errors) {
        state.status = 'rejected'

        let errStatus = ''

        if (action.payload.errors.error) {
          errStatus += action.payload.errors.error.status
        } else {
          const errArr = Object.entries(action.payload.errors)
          errStatus = `${errArr[0][0]}: ${errArr[0][1]}`
        }
        state.error = errStatus
      }
    },
    [fetchUserLogIn.rejected]: (state, action) => {
      state.status = 'rejected'
      state.error = action.payload
    },
    [fetchUserSave.pending]: (state) => {
      state.status = 'loading'
      state.error = null
    },
    [fetchUserSave.fulfilled]: (state, action) => {
      state.status = 'resolved'
      state.userData = action.payload.user
    },
    [fetchUserSave.rejected]: (state, action) => {
      state.status = 'rejected'
      state.error = action.payload
    },
    [fetchUserUpdate.pending]: (state) => {
      state.status = 'loading'
      state.error = null
    },
    [fetchUserUpdate.fulfilled]: (state, action) => {
      if (action.payload.user) {
        state.status = 'resolved'
        state.userData = action.payload.user
        return
      }
      if (action.payload.errors) {
        state.status = 'rejected'
      }
    },
    [fetchUserUpdate.rejected]: (state, action) => {
      state.status = 'rejected'
      state.error = action.payload
    },
  },
})

export const { logOutUser, errorNull } = userSlice.actions

export default userSlice.reducer
