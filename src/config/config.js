module.exports = {
    HOST: 'localhost',
    USER: 'me',
    PASSWORD: 'password',
    DB: 'fundb',
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000
    },
    dialectOptions: {
        useUTC: false, //for reading from database
        dateStrings: true,
        typeCast: true
    },
    timezone: '-05:00'
    }


