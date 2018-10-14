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


app.use('/goals',goalsRoutes);
app.use('/user',signupRoutes);

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


