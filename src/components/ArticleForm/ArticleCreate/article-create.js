import React, { useState } from 'react'
import { Spin, Alert } from 'antd'

import ArticleForm from '../article-form'
import { apiService } from '../../../services/apiService'

import classes from './article-create.module.scss'

export default function ArticleCreate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

  const createArticle = (str) => {
    const newArticle = {
      title: str.title.trim(),
      description: str.description.trim(),
      body: str.body,
      tagList: str.tagList.map((item) => item.trim()).filter((item) => item && item !== ''),
    }
    setLoading(true)

    try {
      apiService
        .postCreateArticle(newArticle, JSON.parse(localStorage.getItem('token')))
        .then((res) => {
          if (res.article) {
            setLoading(false)
            setSuccess(true)
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
    console.log(isSuccess)
  }

  const onClose = () => {
    setSuccess(false)
    setError(false)
  }

  const article = <ArticleForm transferData={createArticle} title="Create new article" />
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

  const successMessage = <Alert description="A new article was created successfully!" closable onClose={onClose} />

  return (
    <>
      {loading && spinner}
      {article}
      {error && errorMessage}
      {isSuccess && successMessage}
    </>
  )
}
