import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const baseURL = 'https://blog.kata.academy/api'

export const fetchArticlesByPage = createAsyncThunk(
  'articles/fetchArticlesByPage',
  async ([pageNum, token], { rejectWithValue }) => {
    const url = new URL(`${baseURL}/articles?limit=5&offset=${pageNum}`)
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch with ${response.status}!`)
      }

      return response.json()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const articleSlice = createSlice({
  name: 'articles',
  initialState: {
    articles: [],
    currentPage: 1,
    maxPages: null,
    status: null,
    error: null,
  },

  reducers: {
    paginationChange(state, action) {
      state.currentPage = action.payload
    },
  },

  extraReducers: {
    [fetchArticlesByPage.pending]: (state) => {
      state.articles = []
      state.status = 'loading'
      state.error = null
    },

    [fetchArticlesByPage.fulfilled]: (state, action) => {
      state.status = 'resolved'
      state.error = null

      state.articles = action.payload.articles
      state.maxPages = Math.ceil(action.payload.articlesCount / 5)
    },

    [fetchArticlesByPage.rejected]: (state, action) => {
      state.status = 'rejected'
      state.error = action.payload
    },
  },
})

export const { paginationChange } = articleSlice.actions

export default articleSlice.reducer
