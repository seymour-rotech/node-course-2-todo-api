const {MongoClient, ObjectId} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017/TodoApp',
(error, db)=>{
    if (error) 
    {
        return console.log("Unable to connect to database")
    }
    console.log("Connected to MongoDB Server")

    db.collection('Todos').find({completed:false}).toArray().then(
        (docs) => {
          console.log('Todos');
          console.log(JSON.stringify(docs, undefined, 2))  
        }
    )
    //db.close();  
    
    db.collection('Todos')
        .find({
                _id: new ObjectId('5b24491f5373aa18145626ba')
            })
        .toArray()
        .then((docs) => {
                console.log('Todos')
                console.log(JSON.stringify(docs, undefined, 2))
            }, 
            (err) => {
                console.log('Unable to fetch todos', err)
            }
        )

    db.collection('Todos')
        .find()
        .count()
        .then((count)=>{
            console.log(`Todos count: ${count}`)
        }, (err) => {
            console.log('Unable to fetch todos', err)
        })

    db.collection('Users')
        .find({name: 'Seymour Lee'})
        .count()
        .then((count)=>{
            console.log(`Todos count: ${count}`)
        }, (err) => {
            console.log('Unable to fetch todos', err)
        })

    db.collection('Users')
        .find({name: 'Seymour Lee'})
        .toArray()
        .then(
            (docs) => {
                console.log(docs, undefined, 2)
            }
        )
})