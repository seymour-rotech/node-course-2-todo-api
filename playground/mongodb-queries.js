const {ObjectId} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')


var id = "5b2af63e9a3a9f1815077d4c"

if (!ObjectId.isValid(id)) {
    console.log('ID not Valid')
}


Todo.find({ _id : id}).then(
    (todos) => { console.log('Todos', todos) }
)

Todo.findOne({ _id: id}).then(
    (todos) => { console.log('Todos', todos)} )

Todo.findById(id).then(
    (todo) => { 
        return console.log('Todo by ID', todo)
    }
).catch(
    (error) => { console.log(error)}
)

User.findById("5b2b2128a48aca543913c456").then(
    (users) => { 
        if (!users) {
            return console.log('Unable to find user')
        }
        
        return console.log (JSON.stringify(users, undefined, 2))
    },
    (err) => {
        console.log(err)
    }
).catch(
    (err) => { console.log("User Error: ", err) }
)
