require ('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {ObjectID} = require('mongodb')

var {authenicate} = require('./middleware/authenticate')

var app = express()

//const port = process.env.PORT || 3000
const port = process.env.PORT

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


app.post('/users',
    (req, res) => {
        var body = _.pick(req.body, ['email', 'password'])
        // var user = new User({
        //     email: body.email,
        //     password: body.password            
        // })

        console.log('body :', body)
        var user = new User(body)

        user.save().then( () => {
                return user.generateAuthToken()
            }).then( (token) => {
                res.header('x-auth', token).send(user)
            }).catch( (e) => {
                //console.log('Error : ', e.errmsg)
                res.status(400).send(e)
            })
    }
)

app.get('/users',
    (req, res) => {
        User.find().then(
            (user) => { res.send({user}) },
            (e) => {res.status(400).send(e)}
        )
    }
)

//Middleware => Move to authenticate.js
// var authenicate = (req, res, next) => {
//     var token = req.header('x-auth')

//     User.findByToken(token).then(
//         (user) => {
//             if (!user) {
//                 return Promise.reject()
//             }
//             //res.send(user)
//             req.user = user
//             req.token = token
//             next()
//         }
//     ).catch( 
//         (e) => {
//             res.status(401).send()
//         }
//     )
// }

app.get('/users/me', authenicate, (req, res) => {

        res.send(req.user)

        //Replace By Middle ware
        // var token = req.header('x-auth')

        // User.findByToken(token).then(
        //     (user) => {
        //         if (!user) {
        //             return Promise.reject()
        //         }
        //         res.send(user)
        //     }
        // ).catch( 
        //     (e) => {
        //         res.status(401).send()
        //     }
        // )
    }
)

app.listen(port, () => {
    console.log(`Starting on Port ${port}`)
})

module.exports = {app}


