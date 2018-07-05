var mongoose = require('mongoose')

var Todo = mongoose.model('Todo', {
    text: {
        type : String,
        required : true,
        minlength : 1,
        trim : true
    },
    completed: {
        type : Boolean,
        default : false
    },
    completedAt : {
        type : Number,
        default : null
    },
    _creator : {
        type : mongoose.Schema.Types.ObjectId,
        required : true        
    }
})

module.exports = {Todo}

// var Todo = mongoose.model('TodosMG', {
//     text: {
//         type : String,
//         required: true,
//         trim: true,
//         minlenght: 1
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default : null
//     }
// })

// var newTodo = new Todo(
//     {
//         text: 'Cook Dinner'
//     }
// )

// newTodo.save().then(
//     (doc) => {console.log('Save Doc', doc)}, 
//     (e)   => {console.log('Unable to save todo', e)}
// )

// var otherTodo = new Todo (
//     {
//         text: 'Feed the cat',
//         completed: true,
//         completedAt: 123
//     }
// )

// otherTodo.save().then(
//     (doc)=> {console.log(JSON.stringify(doc, undefined, 2))}, 
//     (e)  => {console.log('Unsave to save', e)}
// )

