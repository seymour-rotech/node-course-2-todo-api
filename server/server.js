const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('mongodb')

var app = express()

const port = process.env.PORT || 3000 

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

app.delete ('/todos/:id',
    (req, res) =>{
        var id = req.params.id
        
        console.log(id)
        if (!ObjectID.isValid(id)) {
            return res.status(404).send("Id is Invalid")
        }

        //Todo.findByIdAndRemove({_id : id}).then(
        Todo.findByIdAndRemove(id).then(
            (todo) => {
                if (!todo) {
                    return res.status(404).send()
                }

                res.send({todo})
            }
        ).catch(
            (err) => {
                res.status(400).send(err)
            }
        )
    }
)

app.patch('/todos/:id', 
    (req, res) => {
        var id = req.params.id
        console.log(id)
        var body = _.pick(req.body, ['text', 'completed'])

        if (!ObjectID.isValid(id)) {
            return res.status(404).send('ID inValid')
        }

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime()
        } else {
            body.completed = false
            body.completedAt = null
        }

        Todo.findByIdAndUpdate(
            id,
            {$set: body},
            {new: true}
        ).then (
            (todo) => {
                if (!todo) {
                    return res.status(404).send()
                }
                res.send({todo})
            }            
        ).catch(
            (e) => { res.status(404).send(e)}
        )
    }
)

app.listen(port, () => {
    console.log(`Starting on Port ${port}`)
})

module.exports = {app}


