import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Spin, Pagination } from 'antd'

import { fetchArticlesByPage, paginationChange } from '../../store/articleSlice'
import ArticleItem from '../ArticleItem/article-item'

import classes from './article-list.module.scss'

export default function ArticleList() {
  const dispatch = useDispatch()
  const { articles, currentPage, maxPages, status, error } = useSelector((state) => state.articles)

  const token = JSON.parse(localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')) : ''

  useEffect(() => {
    dispatch(fetchArticlesByPage([(currentPage - 1) * 5, token]))
  }, [currentPage])

  const articleList = articles && (
    <ul className={classes['articles-list']}>
      {articles.map((elem) => (
        <li key={elem.slug}>
          <ArticleItem item={elem} />
        </li>
      ))}
    </ul>
  )

  const onChangePage = (page) => {
    dispatch(paginationChange(page))
  }

  const pagination = (
    <Pagination
      className={classes['ant-pagination']}
      size="small"
      showSizeChanger={false}
      current={currentPage}
      total={maxPages * 10}
      onChange={onChangePage}
    />
  )

  const spinner = <Spin size="large" className={classes['form-spinner']} />

  const errorMessage = <Alert description="Whoops, something went wrong :(" type="error" showIcon />

  return (
    <>
      {status === 'loading' && spinner}
      {error && errorMessage}
      {articleList}
      {articles && pagination}
    </>
  )
}
