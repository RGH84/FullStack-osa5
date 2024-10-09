import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing is fun',
    author: 'Juho K',
    url: 'www',
    likes: 5,
    user: {
      name: 'Test User',
      username: 'testuser'
    }
  }

  const loggedInUser = {
    username: 'testuser'
  }

  test('renders title and author, but does not render url and likes by default', () => {
    const { container } = render(<Blog blog={blog} />)

    expect(screen.getByText('Testing is fun by Juho K')).toBeDefined()

    const urlElement = container.querySelector('.url')
    const likesElement = container.querySelector('.likes')

    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('renders url, likes, and user after the view button is clicked', async () => {
    render(<Blog blog={blog} user={loggedInUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    expect(screen.getByText('URL: www')).toBeDefined()
    expect(screen.getByText('Likes: 5')).toBeDefined()
    expect(screen.getByText('User: Test User')).toBeDefined()
  })

  test('renders likes are handled', async () => {
    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} handleLike={mockLikeHandler} user={loggedInUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })

  test('calls the remove event handler when the remove button is clicked', async () => {
    const mockRemoveHandler = vi.fn()

    render(<Blog blog={blog} handleRemove={mockRemoveHandler} user={loggedInUser} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('View')
    await user.click(viewButton)

    const removeButton = screen.getByText('remove')
    await user.click(removeButton)

    expect(mockRemoveHandler).toHaveBeenCalledTimes(1)
  })
})
