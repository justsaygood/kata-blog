import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Spin } from 'antd'

import ArticleForm from '../article-form'
import { apiService } from '../../../services/apiService'
import classes from '../ArticleCreate/article-create.module.scss'

function ArticleEdit() {
  const { slug } = useParams()

  const [articleTitle, setArticleTitle] = useState('')
  const [description, setDescription] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [tagList, setTagList] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [isSuccess, setSuccess] = useState(false)

  const token = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')) : ''

  const updateFormData = () => {
    apiService.getArticleFull(slug, token).then((res) => {
      setTagList(res.article.tagList)
      setDescription(res.article.description)
      setArticleTitle(res.article.title)
      setArticleBody(res.article.body)
    })
  }

  useEffect(() => {
    updateFormData()
  }, [])

  const articleUpdate = (str) => {
    const modifiedArticle = {
      title: str.title.trim(),
      description: str.description.trim(),
      body: str.body,
      tagList: str.tagList.map((item) => item.trim()).filter((item) => item && item !== ''),
    }

    setLoading(true)

    apiService
      .putArticleUpdate(slug, modifiedArticle, token)
      .then((res) => {
        if (res.article) {
          setLoading(false)
          setSuccess(true)

          updateFormData()
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
  }

  const newFields = [
    {
      name: ['title'],
      value: articleTitle || null,
    },
    {
      name: ['description'],
      value: description || null,
    },
    {
      name: ['body'],
      value: articleBody || null,
    },
    {
      name: ['tagList'],
      value: tagList && tagList.length ? tagList : [''],
    },
  ]

  const [fields, setFields] = useState(newFields)

  useEffect(() => {
    setFields(newFields)
  }, [description, articleTitle, articleBody, tagList])

  const onClose = () => {
    setSuccess(false)
    setError(false)
  }

  const form = <ArticleForm title="Edit Article" fields={fields} transferData={articleUpdate} />

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
      {form}
      {error && errorMessage}
      {isSuccess && successMessage}
    </>
  )
}

export default ArticleEdit
