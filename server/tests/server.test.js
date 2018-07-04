const expect  = require('expect')
const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {ObjectID} = require('mongodb')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateTodos)
beforeEach(populateUsers)

describe ('POST /todos' , () => {

    it ('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect( (res) => {
            expect(res.body.text).toBe(text);
        })
        .end(            
            (err, res) => {
                 if (err) {
                  return done(err)
                 }

                 Todo.find({text}).then(
                     (todos) => {
                         //console.log('d: todo length :', todo.length)
                         expect(todos.length).toBe(1)
                         expect(todos[0].text).toBe(text)
                         done()
                     }
                 )
                 .catch( 
                     (e) => done(e)
                 )
            }            
        )
    })

    it ('should not create todo with invalid body data', (done) => {
        var text = ""

        request(app)
        .post('/todos')
        .send(text)
        .expect(400)
        .end( 
            (err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then(
                    (todos) => {
                        expect(todos.length).toBe(2)
                        done()
                    }
                ).catch(
                    (e) => done(e)
                )
            }    
        )
    })
})

describe ('Get /todos', () => {
        it('should get all todos', 
            (done) => {
                request(app)
                .get('/todos')
                .expect(200)
                .expect(
                    (res) => {
                        //console.log(res.body.todo.text)
                        expect((res.body.todos.length)).toBe(2)
                    }
                )
                .end(done)
            }
        )
})

describe ('GET /todos/:id', () => 
{
        it('should return todo doc', 
        (done) =>{
            request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                console.log(res.body.todo.text)
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
        })

        it('should return 404 if todo not found', 
            (done) => {
                request(app)
                .get(`/todos/${(new ObjectID()).toHexString()}`)
                .expect(404)
                .end(done)
            } 
        )

        it('should return 404 if non-object id',
            (done) => {
                request(app)
                .get('/todos/12345')
                .expect(404)
                .end(done)
            }
        )

})

describe ('DELETE /todos/:id', () => {

     it ('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString()

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
                })
            .end ( (err, res) => {
                    if (err) {
                        return done(err)
                    }
                
                Todo.findById(hexId).then(
                    (todo) => {
                        expect(todo).toNotExist()
                        done()
                    }
                ).catch(
                    (e) => { done(e) }
                )
            })
    })

    it ('shoudd return 404 if todo not found', 
        (done) => {
            request(app)
            .delete(`/todos/${(new ObjectID()).toHexString()}`)
            .expect(404)
            .end(done)
        }
    )

    it('should return 404 if non-object id', 
        (done) => {
            request(app)
            .delete('/todo/31234132')
            .expect(404)
            .end(done)
        }
    )

})

describe ('PATCH /todos/:id', () => {

    it ('should update a todo', (done) => {
       var hexId = todos[0]._id.toHexString()

       request(app)
           .patch(`/todos/${hexId}`)
           .send({
               completed : true,
               text : 'Patch Test'
           })
           .expect(200)
           .expect((res) => {
               expect(res.body.todo.text).toBe('Patch Test')
               expect(res.body.todo.completed).toBe(true)
               expect(res.body.todo.completedAt).toBeA('number')
               })
           .end ((err, res) => {
            if (err) {
                return done(err)
            }
        
            Todo.findById(hexId).then(
                (todo) => {
                    expect(todo).toExist()
                    done() 
                    }
                ).catch(
                    (e) => { done(e) }
                )
        })
   })


   it ('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString()

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed : false,
                text : 'Patch Test'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('Patch Test')
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBeNull
                })
            .end ((err, res) => {
            if (err) {
                return done(err)
            }
        
            Todo.findById(hexId).then(
                (todo) => {
                    expect(todo).toExist()
                    done() 
                    }
                ).catch(
                    (e) => { done(e) }
                )
        })
    })
})
    
describe ('GET /users/me', () => {
    it ('should return user if authenticated', (done) =>{
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })

    it ('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({})
        })
        .end(done)
    })
})

describe ('POST /users', () => {
    it ('should create a user', (done) => {
        var email = 'example@example.com'
        var password = '123abc!'

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toExist()
            expect(res.body._id).toExist()
            expect(res.body.email).toExist()
        })
        .end((err) => {
            if (err) {
                return done(err)
            }  

            User.find({email}).then(
                (user) => {
                    expect(user).toExist()
                    expect(user.password).toNotBe(password)
                    done()
                }
            ).catch((e)=>done(e))
        })

    })

    it ('should return validation errors if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({email: 'email', password : '123'})
        .expect(400)
        .end((err) => {
            console.log(err)
            done()
        })
    })

    it ('should not create user if email in use', (done) => {
        //var email = 'seymour@rotech.nz'
        //var password = '123abc'

        request(app)
        .post('/users')
        .send({email : users[0].email, password : 'Password123'})
        .expect(400)
        .end(done)
    })

})

describe('POST /users/login', () => {
    it ('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({email : users[1].email, 
              password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist() 
        })
        .end((err, res)=>{
            if (err) {
                return done(err) 
            }

            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                })
                done()
            }).catch((e)=>done(e))
        })
    })

    it ('should reject invalid login', (done)=> {
        request(app)
        .post('/users/login')
        .send({ email: users[1].email, 
                password: users[1].password + '1'})
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist()
        })
        .end( (err, res) => {
                if (err) { 
                    done(err) 
                }

               User.findById(users[1]._id).then( (user) => {
                       expect(user.tokens.length).toBe(0)
                       done()                
                }).catch((e) => done(e))               
        })        
    })
})