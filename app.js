const express = require('express');
const bodyParser=require("body-parser");
const config=require('./api/config/database');
const mongoose=require('mongoose');

mongoose.connect(config.database,{useNewUrlParser: true});

const db = mongoose.connection;

// Check DB connection
db.once('open',() => {
  console.log('Connected Successfully to MongoDB');
})

// Check for DB error
db.on('error', (err) => {
  console.log(err);
});


const app=express();

const goalsRoutes = require('./api/routes/goals');
const signupRoutes = require('./api/routes/user');

mongoose.set('useCreateIndex', true);

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS errors
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Orign, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes handling requests
app.use('/goals',goalsRoutes);
app.use('/user',signupRoutes);


// Error handling 
app.use((req,res,next) => {
    const error = new Error("Not Authorized");
    error.status=404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        message:error.message
    })
});

module.exports = app;


