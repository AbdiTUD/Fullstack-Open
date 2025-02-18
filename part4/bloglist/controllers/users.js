const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// 4.15 
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // 4.16 
  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

// 4.15 
usersRouter.get('/', async (request, response) => {
  // 4.17 populate
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

module.exports = usersRouter