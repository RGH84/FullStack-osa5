import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message, isSuccess }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={isSuccess ? 'success' : 'error'}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  isSuccess: PropTypes.bool.isRequired
}

export default Notification