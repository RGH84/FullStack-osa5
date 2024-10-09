import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import CreateUser from './components/CreateUser'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/createUser'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        const sortedBlogs = initialBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sortedBlogs)
      })
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    if (!blogObject.title || !blogObject.author) {
      setErrorMessage('Title and author are required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return
    }
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        const updatedBlogs = blogs.concat(returnedBlog)
        setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes))
        setSuccessMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      })
  }

  const createUser = async ({ username, name, password }) => {
    try {
      await userService.create({ username, name, password })
      setSuccessMessage(`User ${username} created successfully!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage(`Welcome, ${user.name}!`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setSuccessMessage('Logged out successfully')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlog = {
        user: blog.user,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlog)

      const updatedBlogs = blogs
        .map(b => b.id !== blog.id ? b : returnedBlog)
        .sort((a, b) => b.likes - a.likes)

      setBlogs(updatedBlogs)

      setSuccessMessage(`You liked '${returnedBlog.title}'`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000)
    } catch (exception) {
      setErrorMessage('Failed to like the blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        const updatedBlogs = blogs.filter(b => b.id !== blog.id)
        setBlogs(updatedBlogs)
        setSuccessMessage(`Blog '${blog.title}' by ${blog.author} removed`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      } catch (exception) {
        setErrorMessage('Failed to remove the blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      }
    }
  }

  return (
    <div>
      <h1>Blogs app</h1>
      <Notification message={successMessage} isSuccess={true} />
      <Notification message={errorMessage} isSuccess={false} />

      {!user &&
      <>
        <Togglable buttonLabel="log in">
          <LoginForm createLogin={handleLogin} />
        </Togglable>
        <Togglable buttonLabel="create user">
          <CreateUser createUser={createUser} />
        </Togglable>
      </>
      }
      {user && <div>
        <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>

        <h2>Blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={handleLike} handleRemove={handleRemove} user={user}/>
        )}
      </div>
      }
    </div>
  )
}

export default App