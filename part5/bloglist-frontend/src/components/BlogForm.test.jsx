import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { vi } from 'vitest'

test('<BlogForm /> calls createBlog with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')
  const submitButton = screen.getByText('create')

  await user.type(inputs[0], 'Test Title')
  await user.type(inputs[1], 'Test Author')
  await user.type(inputs[2], 'http://test.com')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com'
  })
})