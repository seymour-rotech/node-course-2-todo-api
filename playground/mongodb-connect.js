//const MongoClient = require('mongodb').MongoClient
const {MongoClient, ObjectID} = require('mongodb')

var obj = new ObjectID();
console.log(obj.getTimestamp())
console.log(obj)

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable to connect to MongoDB server')
    }

    console.log('Connected to MongoDB server')

    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
        
    //     console.log(JSON.stringify(result.ops, undefined,2))
    // })

    db.collection('Users').insertOne({
        name: 'Seymour Lee',
        age: 53,
        location: 'Auckland'
    }, (err, result) => {
        if (err) {
            return console.log('Unable to insert Users', err)
        }

        //console.log(JSON.stringify(result.ops, undefined, 2))
        console.log(result.ops[0]._id.getTimestamp())
    })

    

    db.close()
})
