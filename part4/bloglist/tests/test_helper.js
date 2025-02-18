// tests/test_helper.js
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "reactpatterns.com",
    likes: 7
  },
  {
    title: "Go Tutorial",
    author: "Google",
    url: "go.dev",
    likes: 5
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ 
    title: 'willremovethissoon', 
    url: 'willremovethissoon.com' 
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}