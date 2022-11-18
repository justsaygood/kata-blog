import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Alert, notification, Spin } from 'antd'
import { SmileOutlined } from '@ant-design/icons'

import ArticleForm from '../article-form'
import { apiService } from '../../../services/apiService'
import classes from '../ArticleCreate/article-create.module.scss'

function ArticleEdit() {
  const { slug } = useParams()
  const history = useHistory()

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

  const successMessage = () => {
    notification.open({
      message: 'Your article has been updated successfully!',
      icon: (
        <SmileOutlined
          style={{
            color: 'green',
          }}
        />
      ),
      duration: 2,
      onClose: () => {
        setSuccess(false)
        history.goBack()
      },
    })
  }

  const articleUpdate = (str) => {
    const modifiedArticle = {
      title: str.title.trim(),
      description: str.description.trim(),
      body: str.body,
      tagList: str.tagList.filter((item) => item),
    }

    setLoading(true)

    apiService
      .putArticleUpdate(slug, modifiedArticle, token)
      .then((res) => {
        if (res.article) {
          setLoading(false)
          setSuccess(true)
          successMessage()

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
    setError(false)
  }

  const form = <ArticleForm title="Edit Article" fields={fields} transferData={articleUpdate} loading={loading} />

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
      {form}
      {error && errorMessage}
      {isSuccess}
    </>
  )
}

export default ArticleEdit
