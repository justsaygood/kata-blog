import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const baseURL = 'https://blog.kata.academy/api'

export const fetchUserRegistration = createAsyncThunk(
  'user/fetchUserRegistration',
  async (newUser, { rejectWithValue }) => {
    const url = new URL(`${baseURL}/users`)
    try {
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
      }
      let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ user: newUser }),
        headers,
      })

      if (response.status === 422) {
        return await response.json().then((result) => rejectWithValue(result))
      }

      if (!response.ok) {
        throw new Error('Data fetching failed')
      }

      response = await response.json()
      return response
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchUserLogIn = createAsyncThunk('user/fetchUserLogIn', async (newUser, { rejectWithValue }) => {
  const url = new URL(`${baseURL}/users/login`)
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ user: newUser }),
    })
    if (response.status === 422) {
      return await response.json().then((result) => rejectWithValue(result))
    }

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
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({ user: newUser }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      })

      if (response.status === 422) {
        return await response.json().then((result) => rejectWithValue(result))
      }

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
    errorMessage: {},
  },
  reducers: {
    logOutUser(state) {
      state.userData = null
      state.status = null
      state.error = null
    },
    errorNull(state) {
      state.error = null
      state.errorMessage = {}
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
        state.errorMessage = action.payload.errors

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
      state.errorMessage = action.payload.errors
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

        state.errorMessage = action.payload.errors

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
      state.errorMessage = action.payload.errors
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
        state.errorMessage = action.payload.errors
      }
    },
    [fetchUserUpdate.rejected]: (state, action) => {
      state.status = 'rejected'
      state.error = action.payload
      state.errorMessage = action.payload.errors
    },
  },
})

export const { logOutUser, errorNull } = userSlice.actions

export default userSlice.reducer
