const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

//Todo.remove
// Todo.remove({}).then(
//     (result) => {
//         console.log(result)
//     }
// )

Todo.findOneAndRemove({_id : '5b2ed7b2bad9b807fc7f69b7'}).then(
    (todo) => {

    },
    (err) => {

    }
)

Todo.findByIdAndRemove("5b2ed7b2bad9b807fc7f69b7").then(
    (todo) => {
        console.log(todo)
    }, (e) => {
        console.log(e)
    }
)