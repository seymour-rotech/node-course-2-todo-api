const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', 
    (err, db) => {
        if (err) {
            return console.log('Unable to connect Mongo Database')
        }

        // db.collection('Todos').deleteMany({Text: "Eat Lunch"}).then(
        //     (result) => {
        //         console.log(result)
        //     }
        // )

        db.collection('Todos').findOneAndDelete({Text: "Eat Lunch"}).then(
            (result) => {
                console.log(result)
            }
        )

        db.collection('Todos').deleteOne({Text: "Eat Lunch"}).then(
            (result) => {
                console.log(result)
            }
        )

        
        // db.collection('Users').find({name: "Seymour Lee"}).toArray()
        //     .then(
        //         (docs) => {
        //             console.log(JSON.stringify(docs, undefined, 2))
        //         }
        //     )

    }
)