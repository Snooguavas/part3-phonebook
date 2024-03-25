const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]



app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    date.setDate(date.getDate())
    response.send(`<p>Phone book has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 10000)
    const body = request.body
    if (!body.name || !body.number) {
        console.log("missing")
        return response.status(400).json({error: "content missing"})
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({error: `${body.name} already exists in phonebook`})
    }   

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const unkownEndPoint = (request, response) => {
    response.status(404).send({error: "unkown endpoint"})
}

app.use(unkownEndPoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
