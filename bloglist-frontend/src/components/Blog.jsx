import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} data-testid={`blog-${blog.id}`}>
      <div>
        {blog.title} by {blog.author}
        <button onClick={toggleVisibility} data-testid={`view-button-${blog.id}`}>
          {visible ? 'Hide' : 'View'}
        </button>
      </div>

      {visible && (
        <div>
          <p>URL: {blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button onClick={() => handleLike(blog)}>Like</button>
          </p>
          <p>User: {blog.user.name}</p>
          {user.username === blog.user.username && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
