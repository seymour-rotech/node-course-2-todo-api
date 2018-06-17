const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp', 
    (error, db) => 
    {
        if (error) {
            return console.log('unable  to connect to mongodb')
        }

        console.log('Connected to MongoDB')

        db.collection('Todos').findOneAndUpdate(
            { 
                _id: new ObjectID("5b24491f5373aa18145626ba")
            }, {
                $set : {
                    completed: true
                    }
            }, {
                returnOriginal : false
            }).then(
                (result) => {
                    console.log(result)
                }
            )

        db.collection('Users').findOneAndUpdate(
            { _id : new ObjectID("5b244a7595c3fb203863de61") },
            { $set : {name : "Seymour Lee"},
              $inc : {age : 1}
            },
            { returnOriginal : false} )
            .then (
                (result) => {
                    console.log(result)
                }
            )        
    }
)


