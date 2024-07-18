const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())

morgan.token("request-body", (request, response) => {
    const result = JSON.stringify(request.body)
    return (result === "{}") ? "empty-body" : result
}
)

const format = ":method :url :status :res[content-length] - :response-time ms :request-body"
app.use(morgan(format))

let people = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

function getRandomNumber(min, max) {
    return Math.ceil(Math.random() * (max - min)) + min - 1
}

function getNewId() {
    return getRandomNumber(1000, 9999).toString()
}

app.get("/", (request, response) => {
    response.send("<h1>Hello world!</h1>")
})

app.get("/info", (request, response) => {
    response.send(`
        <p>Phonebook has info for ${people.length} people</p>
        <p>${Date()}</p>
    `)
})

app.get("/api/people", (request, response) => {
    response.json(people)
})

app.get("/api/people/:id", (request, response) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post("/api/people", (request, response) => {
    const name = request.body.name
    const phoneNumber = request.body.phoneNumber
    const isNameRepeated = people.find(person => person.name === name)

    if (!(name || phoneNumber)) {
        return response.status(400).json({
            error: "Name and Phone number missing"
        })
    }
    
    if (!name) {
        return response.status(400).json({
            error: "Name missing"
        })
    }

    if (!phoneNumber) {
        return response.status(400).json({
            error: "Phone number missing"
        })
    }

    if (isNameRepeated) {
        return response.status(400).json({
            error: "Name must be unique"
        })
    }

    const person = {
        id: getNewId(),
        name,
        phoneNumber
    }

    people.push(person)
    response.json(person)
})

app.delete("/api/people/:id", (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})