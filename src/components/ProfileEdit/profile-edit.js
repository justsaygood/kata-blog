import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Spin, Alert, notification } from 'antd'
import { LoadingOutlined, SmileTwoTone } from '@ant-design/icons'

import { fetchUserUpdate, errorNull } from '../../store/userSlice'
import classes from '../SignIn/sign-in.module.scss'

export default function ProfileEdit() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { error, status, userData, errorMessage } = useSelector((state) => state.user)

  const [email, setEmail] = useState(userData.email)
  const [username, setUsername] = useState(userData.username)
  const [token, setToken] = useState('')

  const [isSuccess, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  })

  useEffect(() => {
    if (userData) {
      setEmail(userData.email)
      setUsername(userData.username)
      setToken(userData.token)
    }

    if (status === 'loading') {
      setSuccess(false)
    }
  }, [status, userData])

  const successMessage = () => {
    notification.open({
      message: 'Your profile has been updated!',
      icon: <SmileTwoTone twoToneColor="#eb2f96" />,
      duration: 2,
      onClose: () => {
        history.push('/')
      },
    })
  }

  const editProfile = (val) => {
    const newUser = { ...userData }
    Object.keys(val).forEach((prop) => {
      newUser[prop] = val[prop]
    })

    dispatch(fetchUserUpdate({ newUser, token })).then((res) => {
      try {
        localStorage.removeItem('token')
        localStorage.setItem('token', JSON.stringify(res.payload.user.token))
        reset()
        setSuccess(true)
        successMessage()
      } catch (err) {
        setSuccess(false)
        console.log(err)
      }
    })
  }

  const profileForm = (
    <form className={classes['sign-form']} onSubmit={handleSubmit(editProfile)}>
      <div className={classes['form-title']}>
        <span>Create new account</span>
      </div>

      <label htmlFor="username" className={classes['form-label']}>
        Username
        <input
          type="text"
          placeholder="Username"
          defaultValue={username}
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
          defaultValue={email}
          {...register('email', {
            required: true,
            pattern: /^[a-z0-9._%+-]+@[a-z0-9-]+.+.[a-z]{2,4}$/g,
          })}
        />
        {errors?.email && <p className={classes['form-validate']}>{errors?.email?.message || 'Error!'}</p>}
        {errorMessage.email ? <p>This email is already taken</p> : null}
      </label>

      <label htmlFor="password" className={classes['form-label']}>
        New password
        <input
          type="new-password"
          placeholder="Password"
          className={errors?.password?.message || Object.keys(errorMessage).length ? classes.required : classes.input}
          {...register('password', {
            required: 'Enter your new password or use the old one.',
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

      <label htmlFor="image" className={classes['form-label']}>
        Avatar image (url)
        <input
          placeholder="Avatar image"
          className={classes.input}
          defaultValue={userData.image ? userData.image : null}
          {...register('image', {
            /* eslint-disable-next-line */
            pattern: /[-a-zA-Z0-9@:%_+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&\/=]*)?/gi,
          })}
        />
      </label>

      <button type="submit" className={classes['form-button']} disabled={status === 'loading'}>
        {status === 'loading' ? <LoadingOutlined /> : 'Save'}
      </button>
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
      description="Whoops, something went wrong :( Try again."
      type="error"
      showIcon
      closable
      onClose={onClose}
      style={{ position: 'relative', bottom: '500px', left: '200px', width: '50%' }}
    />
  )

  return (
    <>
      {profileForm}
      {status === 'loading' && spinner}
      {error && !Object.keys(errorMessage).length && errorAlert}
      {isSuccess}
    </>
  )
}
