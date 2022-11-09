import { configureStore } from '@reduxjs/toolkit'

import userReducer from './userSlice'
import articlesReducer from './articleSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    articles: articlesReducer,
  },
})
