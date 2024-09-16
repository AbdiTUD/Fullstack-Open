const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors())

const morgan = require('morgan') //3.7.

app.use(morgan('tiny'))
app.use(express.static('dist'))

let persons = [

    {
        "id": "bcc1",
        "name": "dsadasadsa",
        "number": "2132131"
    },
    {
        "id": "5",
        "name": "dsadasadsa23131",
        "number": "2132131"
    },
    {
        "id": "2fea",
        "name": "sdsa321",
        "number": "2132131"
    },
    {
        "id": "12f9",
        "name": "sdsa32121321",
        "number": "2132131"
    },
    {
        "id": "a27d",
        "name": "sdsa32121321321",
        "number": "2132131"
    },
    {
        "id": "2",
        "name": "123131",
        "number": "2132131"
}
]
    


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

/*app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })*/

 //3.4: puhelinluettelon backend step4

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
})




/*app.post('/api/persons', (request, response) => {
    const person = request.body
    console.log(person)
    response.json(person)
    })*/

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    const nameExists = persons.find(person => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})
    

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>The current time is ${date.toString()}</p>`)
})


const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})