import React from 'react'

const BlogForm = ({
  addBlog,
  newTitle,
  newAuthor,
  newUrl,
  setNewTitle,
  setNewAuthor,
  setNewUrl
}) => (
  <form onSubmit={addBlog}>
    <div>
      title:
      <input
        type="text"
        value={newTitle}
        onChange={({ target }) => setNewTitle(target.value)}
      />
    </div>
    <div>
      author:
      <input
        type="text"
        value={newAuthor}
        onChange={({ target }) => setNewAuthor(target.value)}
      />
    </div>
    <div>
      url:
      <input
        type="text"
        value={newUrl}
        onChange={({ target }) => setNewUrl(target.value)}
      />
    </div>
    <button type="submit">create</button>
  </form>
)

export default BlogForm