import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Alert, Spin } from 'antd'

import { fetchUserLogIn, errorNull } from '../../store/userSlice'

import classes from './sign-in.module.scss'

export default function SignIn() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { error, status, userData } = useSelector((state) => state.user)

  useEffect(() => {
    try {
      if (userData !== null) {
        localStorage.setItem('token', JSON.stringify(userData.token))
      }
    } catch (err) {
      console.log(err)
    }
  }, [userData])

  const userAuthorize = (str) => {
    const data = {
      email: str.email.trim(),
      password: str.password.trim(),
    }
    dispatch(fetchUserLogIn(data))
  }

  const form = (
    <Form
      layout="vertical"
      name="normal_login"
      size="large"
      className={classes['ant-form']}
      initialValues={{
        remember: true,
      }}
      onFinish={(str) => {
        userAuthorize(str)
      }}
    >
      <div className={classes['form-title']}>
        <span>Sign In</span>
      </div>

      <Form.Item
        className={classes['ant-form-item']}
        label="Email address"
        name="email"
        rules={[
          {
            type: 'email',
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input placeholder="Email address" />
      </Form.Item>
      <Form.Item
        className={classes['ant-form-item']}
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input.Password type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item className={classes['ant-form-item-control-input-content']}>
        <Button type="primary" htmlType="submit" className={classes['login-form-button']}>
          Log in
        </Button>
        <span>
          Don’t have an account? <Link to="/sign-up">Sign Up</Link>.
        </span>
      </Form.Item>
    </Form>
  )

  const onClose = () => {
    dispatch(errorNull())
  }

  const spinner = (
    <Spin
      size="large"
      className={classes['form-spinner']}
      style={{ position: 'absolute', top: '200px', left: '300px' }}
    />
  )

  const errorMessage = (
    <Alert
      className={classes['form-alert']}
      description="Whoops, something went wrong :("
      type="error"
      showIcon
      closable
      onClose={onClose}
      style={{ position: 'absolute', top: '200px', left: '300px' }}
    />
  )

  const successMessage = (
    <Alert
      className={classes['form-alert']}
      description="Welcome to Realworld Blog!"
      closable
      onClose={() => history.push('/')}
      style={{ position: 'absolute', top: '200px', left: '300px' }}
    />
  )

  return (
    <>
      {form}
      {status === 'loading' && spinner}
      {error && errorMessage}
      {userData && successMessage}
    </>
  )
}
