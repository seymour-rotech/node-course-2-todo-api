var express = require('express')
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('mongodb')

var app = express()

app.use(bodyParser.json())
app.post('/todos',
    (req, res) => {
        //console.log(req.body)
        var todo = new Todo({
            text: req.body.text
        })

        todo.save().then(
            (doc) => { res.send(doc) }, 
            (e)   => { res.status(400).send(e) })
    }
)

app.get('/todos',
    (req, res) => {
        Todo.find().then(
            (todos) => { res.send({todos}) },
            (e) => {res.status(400).send(e)}
        )
    }
)

app.get('/todos/:id', 
    (req, res) =>{
        //res.send(req.params) 
        var id = req.params.id;

        if (!ObjectID.isValid(id)) {
            return res.status(404).send("Id is invalid")
        }

        Todo.findById(id).then(
            (todo) => {
                if (!todo)
                    {
                        return res.status(404).send()
                    }
                //res.send(JSON.stringify(todo, undefined, 2))
                res.send({todo})
                }
        ).catch(
            (err) => {
                res.status(404).send(err)
            }
        )
    }
)


app.listen(3000, () => {
    console.log('Starting on Port 3000')
})

module.exports = {app}


