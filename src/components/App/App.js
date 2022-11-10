import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import { fetchUserSave } from '../../store/userSlice'
import Header from '../Header/header'
import ArticleList from '../ArticleList/article-list'
import ArticleFull from '../ArticleItem/ArticleFull/article-full'
import ArticleCreate from '../ArticleForm/ArticleCreate/article-create'
import ArticleEdit from '../ArticleForm/ArticleEdit/article-edit'
import SignUp from '../SignUp/sign-up'
import SignIn from '../SignIn/sign-in'
import ProfileEdit from '../ProfileEdit/profile-edit'
import NetworkDetector from '../../utils/network'

import 'antd/dist/antd.min.css'
import classes from './app.module.scss'

function App() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const [connection, setConnection] = useState(true)

  const detectConnection = () => {
    if (connection) {
      setConnection(false)
    } else {
      setConnection(true)
    }
  }

  useEffect(() => {
    try {
      if (JSON.parse(localStorage.getItem('token'))) {
        dispatch(fetchUserSave(JSON.parse(localStorage.getItem('token'))))
      }
    } catch (err) {
      console.log(err)
    }
  }, [dispatch])

  return (
    <div>
      <Header connection={connection} />
      <section className={classes.main}>
        <NetworkDetector detectConnection={detectConnection} />
        <Switch>
          <Route path="/articles/:slug/edit">{userData ? <ArticleEdit /> : <Redirect to="/sign-in" />}</Route>
          <Route path="/articles/:slug" exact component={ArticleFull} />
          <Route path="/articles" exact component={ArticleList} />
          <Route path="/" exact component={ArticleList} />
          <Route path="/new-article">{userData ? <ArticleCreate /> : <Redirect to="/sign-in" />}</Route>
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/profile">{userData ? <ProfileEdit /> : <Redirect to="/sign-in" />}</Route>
        </Switch>
      </section>
    </div>
  )
}

export default App
