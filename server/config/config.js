var env = process.env.NODE_ENV || 'development'

if (env === 'development' || env === 'test'){
    var config = require('./config.json')
    //console.log(config);
    var envConfig = config[env]
    
    //console.log(Object.keys(envConfig))
    Object.keys(envConfig).forEach( (key) => {
        process.env[key] = envConfig[key]
    })
}

// if (env === 'development') {
//      console.log('--- Development Environment---')
//      process.env.port = 3000
//      process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } else if (env === 'test') {
//     console.log('---Test Environment ---')
//     process.env.PORT = 3000
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }