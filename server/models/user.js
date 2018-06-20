var mongoose = require('mongoose')

var User = mongoose.model('User', {
    email: {
        type : String,
        required: true,
        trim : true,
        minlength : 1
    }
})

module.exports = {User}

// var newUser = new User (
//     {
//         email : 'Seymour@rotech.nz'
//     }
// )

// newUser.save().then(
//     (doc) => { console.log(doc)},
//     (err) => { console.log(err)}
// )

