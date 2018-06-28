const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    email: {
        type : String,
        required: true,
        trim : true,
        minlength : 1,
        unique: true,
        validate: {
            validator : validator.isEmail,
            message : '{VALUE is not a valid email} '
            }
        },
    password: {
            type : String,
            require: true,
            minlength: 6
        },
    tokens: [{
                access: {
                    type : String,
                    required : true
                },
                token: {
                    type : String,
                    required: true
                }
            }]    
})

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {

    //console.log('Here')

    var user = this
    //console.log('user', user, user._id)

    var access = 'auth'
    var token = jwt.sign({ _id: user._id.toHexString(), access}, 
                         'abc123').toString()
    
    //console.log('token', token)                        

    user.tokens.concat([{access, token}])

    //console.log(user)

    return user.save().then(
        () => { return token }
    )
}

var User = mongoose.model('User', UserSchema )

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

