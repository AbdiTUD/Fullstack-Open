const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

// 4.8
test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// 4.9
test('blog has id as identifier', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  
  assert.strictEqual(typeof blog.id, 'string')
  assert.strictEqual(blog._id, undefined)
})

// 4.10
test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "test.com",
    likes: 12
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes(newBlog.title))
})

// 4.11
test('if likes is missing, it defaults to 0', async () => {
  const newBlog = {
    title: "Zero likes blog",
    author: "Unknown",
    url: "example.com"
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

// 4.12
test('blog without title is not added', async () => {
  const newBlog = {
    author: "No Title Author",
    url: "notitle.com",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: "No URL Blog",
    author: "URL Missing",
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

// 4.13
test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToDelete.title))
})

// 4.14
test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlogInDb.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})

test('adding a blog fails with proper status code if token is not provided', async () => {
  const newBlog = {
    title: "Test without token",
    author: "Tester",
    url: "test.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('adding a blog succeeds with valid token', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'secret' })

  const token = loginResponse.body.token

  const newBlog = {
    title: "Test with token",
    author: "Tester",
    url: "test.com",
    likes: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})