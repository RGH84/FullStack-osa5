const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/tests/reset')
    await request.post('/api/users', {
      data: {
        username: 'Testing',
        name: 'Juho K',
        password: 'sekret'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'Testing2',
        name: 'Juho K2',
        password: 'sekret2'
      }
    })

    await page.goto('/')
  })

  test('front page can be opened and login form is shown', async ({ page }) => {
    const locator = await page.getByText('Blogs')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Blogs app')).toBeVisible()

    await page.getByRole('button', { name: 'log in' }).click()

    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  test('login fails with wrong password', async ({ page }) =>{
    await loginWith(page, 'KalleP', 'wrong')
    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong username or password')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Juho K logged in')).not.toBeVisible()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'Testing', 'sekret')
    await expect(page.getByText('Juho K logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'Testing', 'sekret')
      await createBlog(page, 'TestingT', 'TestingA', 'www' )
    })

    test('a new blog can be created', async ({ page }) => {
      const blogItem = page.locator('div', { hasText: 'TestingT by TestingA' }).last()
      await expect(blogItem).toBeVisible()
    })

    test('like button works correctly', async ({ page }) => {
      await page.getByRole('button', { name: 'View' }).click()

      const likeText = await page.locator('text=Likes: 0')
      await expect(likeText).toBeVisible()

      await page.getByRole('button', { name: 'Like' }).click()

      const updatedLikeText = await page.locator('text=Likes: 1')
      await expect(updatedLikeText).toBeVisible()
    })

    test('the user who added the blog can remove it', async ({ page }) => {
      await page.getByRole('button', { name: 'View' }).click()

      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('Remove blog TestingT by TestingA?')
        await dialog.accept()
      })

      const removeButton = page.getByRole('button', { name: 'remove' })
      await expect(removeButton).toBeVisible()

      await removeButton.click()

      const blogListItem = page.locator('div').filter({ hasText: 'TestingT by TestingA' })

      await expect(blogListItem).toHaveCount(0)
      await page.waitForTimeout(500)
    })

    test('only the user who added the blog sees the remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'Testing2', 'sekret2')

      await page.getByRole('button', { name: 'View' }).click();

      const removeButtonForOtherUser = page.getByRole('button', { name: 'remove' });
      await expect(removeButtonForOtherUser).not.toBeVisible();
    })
  })
})