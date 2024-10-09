import React, { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">title:</label>
          <input
            id="title"
            type="text"
            value={newBlog.title}
            onChange={event => setNewBlog({ ...newBlog, title: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="author">author:</label>
          <input
            id="author"
            type="text"
            value={newBlog.author}
            onChange={event => setNewBlog({ ...newBlog, author: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="url">url:</label>
          <input
            id="url"
            type="text"
            value={newBlog.url}
            onChange={event => setNewBlog({ ...newBlog, url: event.target.value })}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
