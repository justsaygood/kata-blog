import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Alert, Modal, Spin, notification } from 'antd'
import { ExclamationCircleFilled, DeleteOutlined } from '@ant-design/icons'

import ArticleItem from '../article-item'
import { apiService } from '../../../services/apiService'

import classes from './article-full.module.scss'

export default function ArticleFull() {
  const { userData } = useSelector((state) => state.user)
  const history = useHistory()
  const { slug } = useParams()

  const token = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')) : ''

  const [item, setItem] = useState({})
  const [showSettings, setShowSettings] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    apiService
      .getArticleFull(slug, token)
      .then((res) => {
        if (userData && userData.username === res.article.author.username) {
          setShowSettings(true)
        }
        setItem(res.article)
        setLoading(false)
        setError(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [slug, loading, userData, token])

  const successMessage = () => {
    notification.open({
      message: 'The article has been deleted successfully!',
      icon: (
        <DeleteOutlined
          style={{
            color: 'yellow',
          }}
        />
      ),
      duration: 2,
      onClose: () => history.push('/articles'),
    })
  }

  const confirmation = () => {
    Modal.confirm({
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure you want to delete this article?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        apiService.deleteArticle(slug, token).then((res) => {
          if (String(res.status)[0] === '2') {
            setIsSuccess(true)
            successMessage()
          } else {
            setError(true)
            // console.log(`error: ${res.status}`)
          }
        })
      },
    })
  }

  const article = Object.keys(item).length !== 0 && !isSuccess && (
    <article className={classes['article-wrapper']}>
      <ArticleItem item={item} confirmation={confirmation} showSettings={showSettings} />
      <div className={classes['article-body']}>
        <ReactMarkdown className={classes['item-body']}>{item.body}</ReactMarkdown>
      </div>
    </article>
  )

  const spinner = (
    <Spin size="large" className={classes['form-spinner']} style={{ display: 'flex', justifyContent: 'center' }} />
  )

  const errorMessage = error === true && (
    <Alert description="Data loading error. Please try reloading the page." type="error" showIcon />
  )

  return (
    <>
      {article}
      {loading === true && spinner}
      {errorMessage}
      {isSuccess}
    </>
  )
}
