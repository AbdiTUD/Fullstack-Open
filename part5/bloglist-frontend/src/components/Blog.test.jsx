import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'Test blog title',
    author: 'Test Author',
    url: 'https://testurl.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '123'
    }
  }

  const user = {
    username: 'testuser'
  }

  // Exercise 5.13
  test('renders blog title and author but not url or likes by default', () => {
    const { container } = render(<Blog blog={blog} user={user} />)

    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeDefined()

    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).toBeNull()
  })

  // Exercise 5.14
  test('url and likes are shown when view button is clicked', async () => {
    const { container } = render(<Blog blog={blog} user={user} />)

    const user2 = userEvent.setup()
    const button = screen.getByText('view')
    await user2.click(button)

    const detailsDiv = container.querySelector('.blog-details')
    expect(detailsDiv).not.toHaveStyle('display: none')
    expect(screen.getByText(blog.url)).toBeDefined()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeDefined()
  })

  // Exercise 5.15
  test('like button calls event handler twice when clicked twice', async () => {
    const mockUpdateBlog = vi.fn()
    const user2 = userEvent.setup()

    render(<Blog blog={blog} updateBlog={mockUpdateBlog} user={user} />)

    const viewButton = screen.getByText('view')
    await user2.click(viewButton)

    const likeButton = screen.getByText('like')
    await user2.click(likeButton)
    await user2.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})