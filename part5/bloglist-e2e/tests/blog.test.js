const { test, expect } = require('@playwright/test')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpass'
      }
    })

    await page.goto('http://localhost:5173')
  })

  // 5.17
  test('front page shows login form', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  // 5.18
  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('testpass')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.locator('.error')).toContainText('wrong username or password')
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('input[name="Username"]').fill('testuser')
      await page.locator('input[name="Password"]').fill('testpass')
      await page.getByRole('button', { name: 'login' }).click()
    })

    // 5.19
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input').nth(0).fill('Test Title')
      await page.locator('input').nth(1).fill('Test Author')
      await page.locator('input').nth(2).fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Title Test Author')).toBeVisible()
    })

    // 5.20
    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input').nth(0).fill('Like Test Blog')
      await page.locator('input').nth(1).fill('Like Author')
      await page.locator('input').nth(2).fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Like Test Blog').locator('..').getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    // 5.21
    test('user can delete own blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input').nth(0).fill('Delete Test Blog')
      await page.locator('input').nth(1).fill('Delete Author')
      await page.locator('input').nth(2).fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByText('Delete Test Blog').locator('..').getByRole('button', { name: 'view' }).first().click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Delete Test Blog')).not.toBeVisible()
    })

    // 5.22
    test('only creator can see delete button', async ({ page, request }) => {
      // Create blog as first user
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.locator('input').nth(0).fill('Creator Blog')
      await page.locator('input').nth(1).fill('Creator')
      await page.locator('input').nth(2).fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'logout' }).click()

      // Create and login as another user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'another',
          password: 'password'
        }
      })

      await page.locator('input[name="Username"]').fill('another')
      await page.locator('input[name="Password"]').fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByText('Creator Blog').locator('..').getByRole('button', { name: 'view' }).first().click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    // 5.23
    test('blogs are ordered by likes', async ({ page }) => {
      // Create three blogs
      const blogs = [
        { title: 'First Blog', likes: 2 },
        { title: 'Second Blog', likes: 4 },
        { title: 'Third Blog', likes: 3 }
      ]

      for (const blog of blogs) {
        await page.getByRole('button', { name: 'create new blog' }).first().click()
        await page.locator('input').nth(0).fill(blog.title)
        await page.locator('input').nth(1).fill('Test Author')
        await page.locator('input').nth(2).fill('http://test.com')
        await page.getByRole('button', { name: 'create' }).click()

        await page.getByText(blog.title).locator('..').getByRole('button', { name: 'view' }).first().click()
        
        for (let i = 0; i < blog.likes; i++) {
          await page.getByRole('button', { name: 'like' }).click()
          await expect(page.getByText(`likes ${i + 1}`)).toBeVisible()
        }
      }

      const blogs_elements = await page.locator('.blog').all()
      const titles = await Promise.all(
        blogs_elements.map(async (element) => {
          return await element.textContent()
        })
      )

      expect(titles[0]).toContain('Second Blog')
      expect(titles[1]).toContain('Third Blog')
      expect(titles[2]).toContain('First Blog')
    })
  })
})