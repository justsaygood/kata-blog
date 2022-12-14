import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { format } from 'date-fns'
import { Button } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'

import { apiService } from '../../services/apiService'
import selfie from '../../assets/user.png'

import classes from './article-item.module.scss'

export default function ArticleItem({ item, confirmation, showSettings }) {
  const { userData } = useSelector((state) => state.user)
  const token = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')) : ''

  const { slug, title, tagList, author, description, createdAt, favorited, favoritesCount } = item
  const { username, image } = author

  const [like, setLike] = useState(favorited)
  const [likeCount, setLikeCount] = useState(favoritesCount)
  const [likeDisabled, setLikeDisabled] = useState(true)

  useEffect(() => {
    if (userData && token !== '') {
      setLikeDisabled(false)
    }
    if (token === '') {
      setLikeDisabled(true)
    }
  }, [userData, favorited])

  const likeHandler = () => {
    if (!like) {
      apiService.addLike(slug, token).then((res) => {
        if (res.article.favorited) {
          setLike(true)
          setLikeCount(res.article.favoritesCount)
        }
      })
    } else {
      apiService.removeLike(slug, token).then((res) => {
        if (!res.article.favorited) {
          setLike(false)
          setLikeCount(res.article.favoritesCount)
        }
      })
    }
  }

  const articleButtons = (
    <div className={classes['article-controls']}>
      <Button type="default" className="red" onClick={confirmation}>
        Delete
      </Button>
      <Button type="default" className="green">
        <Link to={`/articles/${slug}/edit`}>Edit</Link>
      </Button>
    </div>
  )

  const avatar = image === 'null' ? selfie : image

  return (
    <div className={classes.article}>
      <div className={classes['article-cap']}>
        <div className={classes['article-title']}>
          <div className="flex-container">
            <h2>
              <Link to={`/articles/${slug}`}>{title}</Link>
            </h2>
            <button className={classes['article-rating']} type="button" onClick={likeHandler} disabled={likeDisabled}>
              {like && token !== '' ? (
                <HeartFilled
                  style={{ fontSize: '18px', width: '20px', height: '20px', marginRight: '4px', color: '#ed553b' }}
                />
              ) : (
                <HeartOutlined style={{ fontSize: '18px', width: '20px', height: '20px', marginRight: '4px' }} />
              )}
              <span>{likeCount}</span>
            </button>
          </div>
          <div className={classes['article-tags']}>
            {tagList.map((tag) => (
              <div key={nanoid()} className={classes['article-tag']}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-container-column">
          <div className={classes['article-info']}>
            <div className={classes['article-meta']}>
              <h3>{username}</h3>
              <span>{format(new Date(createdAt), 'MMMM d, yyyy')}</span>
            </div>
            <img src={avatar} alt="user selfie" />
          </div>
          {userData && showSettings ? articleButtons : null}
        </div>
      </div>
      <p className={classes['article-description']}>{description}</p>
    </div>
  )
}

ArticleItem.defaultProps = {
  showSettings: false,
  confirmation: PropTypes.func,
  item: {
    title: '',
    favorited: false,
    favoritesCount: null,
    description: '',
    createdAt: '',
    slug: '',
    author: PropTypes.shape({
      username: '',
      image: null,
    }),
  },
}

ArticleItem.propTypes = {
  showSettings: PropTypes.bool,
  confirmation: PropTypes.func,
  item: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    slug: PropTypes.string,
    favorited: PropTypes.bool,
    favoritesCount: PropTypes.number,
    author: PropTypes.shape({
      username: PropTypes.string,
      image: PropTypes.string,
    }),
  }),
}
