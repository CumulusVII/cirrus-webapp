const express = require('express');
const app = express();
// CUSTOM ROUTES
const healthz = require('./routes/routes')


app.get("/",(req,res)=>{
    res.send("Hello World");
})

//MIDDLEWARES
app.use('/healthz',healthz)

// PORT
const PORT = 3000;

// STARTING A SERVER
app.listen(PORT , () => console.log(`app listening on port ${PORT}`));