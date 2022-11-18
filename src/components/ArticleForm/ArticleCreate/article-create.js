import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Spin, Alert, notification } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

import ArticleForm from '../article-form'
import { apiService } from '../../../services/apiService'

import classes from './article-create.module.scss'

export default function ArticleCreate() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

  const successMessage = () => {
    notification.open({
      message: 'A new article has been created successfully!',
      icon: (
        <SmileOutlined
          style={{
            color: 'yellow',
          }}
        />
      ),
      duration: 2,
      onClose: () => {
        setSuccess(false)
        history.push('/')
      },
    })
  }

  const createArticle = (str) => {
    const filteredTags = str.tagList === undefined ? [] : str.tagList.filter((item) => item)
    const newArticle = {
      title: str.title.trim(),
      description: str.description.trim(),
      body: str.body,
      tagList: filteredTags,
    }
    setLoading(true)

    try {
      apiService
        .postCreateArticle(newArticle, JSON.parse(localStorage.getItem('token')))
        .then((res) => {
          if (res.article) {
            setSuccess(true)
            setLoading(false)
            successMessage()
            setError(false)
          }

          if (res.errors) {
            setLoading(false)
            setError(true)
            console.log(`${res.errors.error.status} ${res.errors.message}`)
          }
        })
        .catch(() => {
          setLoading(false)
          setError(true)
        })
    } catch (err) {
      setLoading(false)
      // console.log(err)
    }
  }

  const onClose = () => {
    setError(false)
  }

  const article = <ArticleForm transferData={createArticle} title="Create new article" loading={loading} />

  const spinner = <Spin size="large" className={classes['form-spinner']} />

  const errorMessage = (
    <Alert
      description="Data loading error. Please try reloading the page."
      type="error"
      showIcon
      closable
      onClose={onClose}
    />
  )

  return (
    <>
      {loading && spinner}
      {article}
      {error && errorMessage}
      {isSuccess}
    </>
  )
}
