const express = require('express')
const cors = require('cors')

const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())

app.use(logger)

/* const http = require('http') */

let todos = [
    {
        'id': 1,
        'content': 'Compras Mercadona',
        'isFinished': false
    },
    {
        'id': 2,
        'content': 'lavar el coche',
        'isFinished': true
    },
    {
        'id': 3,
        'content': 'hacer los deberes',
        'isFinished': false
    }
]

/* const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(notes))
}) */

app.get('/', (request, response) => {
    response.send('<h1>hello wolrd</h1>')
})

app.get('/api/todo', (request, response) => {
    response.json(todos)
})

app.get('/api/todo/:id', (request, response) => {
    const id = Number(request.params.id)
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
        response.json(todo)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/todo/:id', (request, response) => {
    const id = Number(request.params.id)
    todos = todos.filter(todo => todo.id != id)
    response.status(204).end()
})

app.post('/api/todo', (request, response) => {
    const todo = request.body

    if (!todo || !todo.content) {
        return response.status(400).json({
            error: 'todo.content is missing'
        })
    }

    const ids = todos.map(todo => todo.id)
    const maxId = Math.max(...ids)

    const newTodo = {
        id: maxId + 1,
        content: todo.content,
        isFinished: typeof todo.isFinished != 'undefined' ? todo.important : false
    }

    todos = [...todos, newTodo]

    response.status(201).json(newTodo)
})

app.use((request, response) => {
    console.log(request.path)
    response.status(404).json({
        error: 'Not found'
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

