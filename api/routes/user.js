const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config=require('../config/database');


// Calling User model
const User=require('../models/user');

// Signup post to create a new User
router.post('/signup',(req,res,next) => {

    User.find({email:req.body.email}).
    exec().
    then(newuser => {
        if(newuser.length >= 1){
        return res.status(422).json({
            message:"User already exist"
        });
    }
        else{
            bcrypt.hash(req.body.password, 10,(err,hash) => {
                if(err) {
                    return res.status(500).json({
                        error:err
                    });
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                  user.save((err,result)=>{
                        if(err)
                        {
                            console.log(err);
                            return res.status(500).json({
                                error:err
                            });
                        } 
                        else{
                            console.log(result);
                            return res.status(201).json({
                                message:'User successfully created'
                            });
                        }
                    }); 
                }
            });
        }
    }
    )
});

// login up post to login user
router.post('/login',(req,res,next)=> {
    User.find({email:req.body.email}).exec()
    .then(newuser => {
        if(newuser.length < 1) {
            return res.status(401).json({
                message:"An error occured"
            })
        }
        bcrypt.compare(req.body.password,newuser[0].password,(err,result) =>{
            if(err)
            {
                return res.status(401).json({
                    message:"An error occured"
                })
            }

            if(result){
                const token = jwt.sign({
                    email:newuser[0].email,
                    userId:newuser[0]._id
                },
                config.secret,
                {
                    expiresIn: "1h"
                }
                )
                return res.status(200).json({
                    message:"Success Login",
                    token: token
                });
            }

            res.status(401).json({
                message:"An error occured"
            })
        })
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
        error:err
    })
})
})

module.exports=router;