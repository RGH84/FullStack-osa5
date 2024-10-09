import React, { useState } from 'react'
import PropTypes from 'prop-types'

const CreateUser = ({ createUser }) => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const handleCreateUser = (event) => {
    event.preventDefault()
    createUser({ username, name, password })
    setUsername('')
    setName('')
    setPassword('')
  }

  return (
    <div>
      <h2>Create a new user</h2>

      <form onSubmit={handleCreateUser}>
        <div>
          Username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

CreateUser.propTypes = {
  createUser: PropTypes.func.isRequired
}

export default CreateUser
