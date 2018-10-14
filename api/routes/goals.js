const express = require('express');
const router = express.Router();
const authorize=require('../middle_ware/check-auth');
const Goal=require('../models/goals');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

router.get('/',authorize,(req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded=jwt.decode(token,{
        complete:true
    });
    const emp=decoded.payload.email;

    Goal.find({"email":emp})
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            message:"No goals Found For User"
        })
    });
});

router.get('/:goalId',authorize,(req,res,next) => {
    const token = req.headers.authorization.split(" ")[1];
    const decoded=jwt.decode(token,{
        complete:true
    });
    const emp=decoded.payload.email;

    Goal.find({'_id':req.params.goalId,'email':emp})
    .exec()
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({
            message:"No goals Found"
        })
    });
});


router.post('/add',authorize,(req,res,next) => {

    const token = req.headers.authorization.split(" ")[1];
    const decoded=jwt.decode(token,{
        complete:true
    });
    const emp=decoded.payload.email;

    const goal = new Goal({
        _id: new mongoose.Types.ObjectId(),
        goal: req.body.goal,
        email:emp
    });

    goal.save((err,result) => {
        if(err){
            console.log(err);
            return res.status(500).json({
                message:"An error occured"
            })
        }
        else
        {
            return res.status(200).json({
                message:'Goal successfully added'
            });
        }
    });
});


router.patch('/update/:goalId',authorize,(req,res,next)=>{
    
    const token = req.headers.authorization.split(" ")[1];
    const decoded=jwt.decode(token,{
        complete:true
    });
    const emp=decoded.payload.email;

    Goal.updateOne({'_id':req.params.goalId,'email':emp},{$push:{'milestone':req.body.milestone}}).
    exec()
    .then(result => {
        if(result){
        console.log(result);
        res.status(200).json({
            message:'Milestone Successfully Added'
        });
    }
        else
        {
            res.status(404).json({
                message:"An error occured"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});

router.delete('/delete/:goalId',authorize,(req,res,next)=>{
        
    const token = req.headers.authorization.split(" ")[1];
    const decoded=jwt.decode(token,{
        complete:true
    });
    const emp=decoded.payload.email;

    Goal.deleteOne({_id:req.params.goalId,'email':emp})
    .exec()
    .then(results => {
        if(result){
        res.status(200).json({
            message:"Goal succssfully deleted"
        });
    }
    else{
        res.status(404).json({
            message:"An error occured"
        });
    }
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).json({
        error:err
    })
})      
});
//});


module.exports=router;