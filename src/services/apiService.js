class ApiService {
  baseURL = 'https://blog.kata.academy/api'

  async getArticleFull(slug, token) {
    const url = new URL(`${this.baseURL}/articles/${slug}`)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => err.message)

    return response.json()
  }

  async addLike(slug, token) {
    const url = new URL(`${this.baseURL}/articles/${slug}/favorite`)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
    })

    return response.json()
  }

  async removeLike(slug, token) {
    const url = new URL(`${this.baseURL}/articles/${slug}/favorite`)

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => err.message)

    return response.json()
  }

  async deleteArticle(slug, token) {
    const url = new URL(`${this.baseURL}/articles/${slug}`)

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => err.message)

    return response
  }

  async postCreateArticle(newArticle, token) {
    const url = new URL(`${this.baseURL}/articles`)

    const body = { article: newArticle }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    }).catch((err) => err.message)

    return response.json()
  }

  async putArticleUpdate(slug, modifiedArticle, token) {
    const url = new URL(`${this.baseURL}/articles/${slug}`)

    const body = {
      article: modifiedArticle,
    }

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    })

    return response.json()
  }
}

const apiService = new ApiService()

// eslint-disable-next-line import/prefer-default-export
export { apiService }
