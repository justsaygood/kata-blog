import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Checkbox, Divider, Alert, Spin, notification } from 'antd'
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'

import { errorNull, fetchUserRegistration } from '../../store/userSlice'
import classes from '../SignIn/sign-in.module.scss'

export default function SignUp() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { error, status, userData, errorMessage } = useSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onBlur',
  })

  const userRegistration = (str) => {
    const newUser = {
      username: str.username.trim(),
      email: str.email.trim(),
      password: str.password.trim(),
    }
    dispatch(fetchUserRegistration(newUser))
  }

  const successMessage = () => {
    notification.open({
      message: 'Welcome to the Realworld Blog!',
      icon: (
        <UserOutlined
          style={{
            color: '#1890FF',
          }}
        />
      ),
      duration: 3,
    })
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    try {
      if (userData) {
        localStorage.setItem('token', JSON.stringify(userData.token))
        successMessage()
        const timeout = setTimeout(() => {
          history.push('/')
        }, 3000)
        return () => clearTimeout(timeout)
      }
    } catch (err) {
      console.log(err)
    }
  }, [userData])

  const form = (
    <form className={classes['sign-form']} onSubmit={handleSubmit(userRegistration)}>
      <div className={classes['form-title']}>
        <span>Create new account</span>
      </div>

      <label htmlFor="username" className={classes['form-label']}>
        Username
        <input
          type="text"
          placeholder="Username"
          className={errors?.username?.message || Object.keys(errorMessage).length ? classes.required : classes.input}
          {...register('username', {
            required: true,
            minLength: {
              value: 3,
              message: 'Your username must be 3 to 20 characters long.',
            },
            maxLength: {
              value: 20,
              message: 'Your username must be 3 to 20 characters long.',
            },
          })}
        />
        {errors?.username && <p className={classes['form-validate']}>{errors?.username?.message || 'Error!'}</p>}
        {errorMessage.username ? <p>This username already exists</p> : null}
      </label>

      <label htmlFor="email" className={classes['form-label']}>
        Email address
        <input
          className={errors?.email?.message || Object.keys(errorMessage).length ? classes.required : classes.input}
          placeholder="Email"
          {...register('email', {
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/g,
          })}
        />
        {errors?.email && <p className={classes['form-validate']}>{errors?.email?.message || 'Error!'}</p>}
        {errorMessage.email ? <p>This email is already taken</p> : null}
      </label>

      <label htmlFor="password" className={classes['form-label']}>
        Password
        <input
          type="password"
          placeholder="Password"
          className={errors?.password?.message || Object.keys(errorMessage).length ? classes.required : classes.input}
          {...register('password', {
            required: true,
            minLength: {
              value: 6,
              message: 'Your password must be 6 to 40 characters long.',
            },
            maxLength: {
              value: 40,
              message: 'Your password must be 6 to 40 characters long.',
            },
          })}
        />
        {errors.password ? <p className={classes['form-validate']}>{errors.password.message}</p> : null}
      </label>

      <label htmlFor="repeat" className={classes['form-label']}>
        Repeat Password
        <input
          className={errors?.email?.message || Object.keys(errorMessage).length ? classes.required : classes.input}
          placeholder="Repeat password"
          {...register('repeatPassword', {
            required: 'You must repeat your password',
            validate: (value) => getValues('password') === value || 'Passwords must match',
          })}
        />
        {errors.repeatPassword ? <p className={classes['form-validate']}>Passwords must match</p> : null}
      </label>

      <Divider className={classes['ant-divider']} />

      <Checkbox checked>I agree to the processing of my personal information</Checkbox>

      <button type="submit" className={classes['form-button']} disabled={!isValid || status === 'loading'}>
        {status === 'loading' ? <LoadingOutlined /> : 'Create'}
      </button>
      <span>
        Already have an account? <Link to="/sign-in">Sign In</Link>.
      </span>
    </form>
  )

  const onClose = () => {
    dispatch(errorNull())
  }

  const spinner = (
    <Spin
      size="large"
      className={classes['form-spinner']}
      style={{ position: 'relative', bottom: '500px', left: '200px', width: '50%' }}
    />
  )

  const errorAlert = (
    <Alert
      description="Whoops, something went wrong :("
      type="error"
      className={classes['form-alert']}
      showIcon
      closable
      onClose={onClose}
      style={{ position: 'relative', bottom: '470px', left: '200px', width: '50%' }}
    />
  )

  return (
    <div>
      {form}
      {status === 'loading' && spinner}
      {error && !Object.keys(errorMessage).length && errorAlert}
    </div>
  )
}
