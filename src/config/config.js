require('dotenv').config()
module.exports = {
    HOST: process.env.HOST,
    USER: process.env.DBUSER,
    PASSWORD: process.env.DBPASSWORD,
    DB: process.env.DATABASE,
    PORT:process.env.PORT,
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
        typeCast: true,
        ssl: {
            require: true,
            rejectUnauthorized: false,
          },
    },
    timezone: '-05:00'
    }

