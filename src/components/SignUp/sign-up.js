import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Checkbox, Divider, Alert, Spin } from 'antd'

import { errorNull, fetchUserRegistration } from '../../store/userSlice'
import classes from '../SignIn/sign-in.module.scss'

export default function SignUp() {
  const dispatch = useDispatch()
  const { error, status, userData } = useSelector((state) => state.user)
  // console.log(status, error)

  const userRegistration = (str) => {
    const newUser = {
      username: str.username.trim(),
      email: str.email.trim(),
      password: str.password.trim(),
    }
    dispatch(fetchUserRegistration(newUser))
  }

  const form = (
    <Form
      layout="vertical"
      size="large"
      className={classes['ant-form']}
      initialValues={{
        remember: true,
      }}
      onFinish={(str) => {
        userRegistration(str)
      }}
    >
      <div className={classes['form-title']}>
        <span>Create new account</span>
      </div>

      <Form.Item
        className={classes['ant-form-item']}
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Your username must be 3 to 20 characters long.',
            min: 3,
            max: 20,
          },
        ]}
      >
        <Input type="text" placeholder="Username" />
      </Form.Item>

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
            message: 'Your password must be 6 to 40 characters long.',
            min: 6,
            max: 40,
          },
        ]}
      >
        <Input.Password type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item
        className={classes['ant-form-item']}
        name="confirm"
        label="Repeat Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Passwords must match',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }

              return Promise.reject(new Error('The passwords aren`t the same'))
            },
          }),
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Divider className={classes['ant-divider']} />

      <Form.Item
        className={classes['ant-form-item']}
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('The agreement isn`t accepted')),
          },
        ]}
      >
        <Checkbox>I agree to the processing of my personal information</Checkbox>
      </Form.Item>
      <Form.Item className={classes['ant-form-item-control-input-content']}>
        <Button type="primary" htmlType="submit" className={classes['login-form-button']}>
          Create
        </Button>
        <span>
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </span>
      </Form.Item>
    </Form>
  )

  const onClose = () => {
    dispatch(errorNull())
  }

  const spinner = <Spin size="large" className={classes['form-spinner']} />

  const errorMessage = (
    <Alert
      description="Whoops, something went wrong :("
      type="error"
      className={classes['form-alert']}
      showIcon
      closable
      onClose={onClose}
    />
  )

  const successMessage = <Alert description="Welcome to Realworld Blog!" closable onClose={onClose} />

  return (
    <div>
      {form}
      {status === 'loading' && spinner}
      {error && errorMessage}
      {userData && successMessage}
    </div>
  )
}
