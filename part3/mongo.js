require('dotenv').config() // Load .env variables
const mongoose = require('mongoose')
const Person = require('./models/person')

const args = process.argv.slice(2)

if (args.length === 0) {
  // List all persons
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error listing persons:', error)
    mongoose.connection.close()
  })
} else if (args.length === 2) {
  // Add a new person: node mongo.js "Name" "Number"
  const [name, number] = args

  const person = new Person({ name, number })
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error saving person:', error)
    mongoose.connection.close()
  })
} else {
  console.log('Invalid arguments. Use:')
  console.log('  To list all persons: node mongo.js')
  console.log('  To add a person: node mongo.js "Name" "Number"')
  process.exit(1)
}