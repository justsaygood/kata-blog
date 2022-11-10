import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Result } from 'antd'

import { logOutUser } from '../../store/userSlice'
import classes from '../App/app.module.scss'
import selfie from '../../assets/user.png'

export default function Header({ connection }) {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.user)

  const avatar = userData === null || !userData.image ? selfie : userData.image

  const logOut = () => {
    try {
      localStorage.removeItem('token')
      dispatch(logOutUser())
    } catch (err) {
      console.log(err)
    }
  }

  const buttonsUser = (
    <div>
      <Button type="default" className="green">
        <Link to="/new-article">Create article</Link>
      </Button>
      <Link to="/profile">
        <div className={classes.user}>
          <span>{userData ? userData.username : '[loading]'}</span>
          <img src={avatar} alt="user selfie" />
        </div>
      </Link>
      <Button type="default" size="large" onClick={logOut}>
        <Link to="/">Log Out</Link>
      </Button>
    </div>
  )

  const buttons = (
    <div>
      <Button type="text" size="large">
        <Link to="/sign-in">Sign In</Link>
      </Button>
      <Button type="default" size="large" className="green">
        <Link to="/sign-up">Sign Up</Link>
      </Button>
    </div>
  )

  const errorResults = (
    <Result status="error" title="Internet disconnected" subTitle="Check your connection and reload the page!" />
  )

  return (
    <>
      <header className={classes.header}>
        <h1>
          <Link to="/">Realworld Blog</Link>
        </h1>
        {userData ? buttonsUser : buttons}
      </header>
      {!connection ? errorResults : null}
    </>
  )
}
