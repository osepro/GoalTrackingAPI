const mongoose=require('mongoose');

const goalSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    goal:{
        type: String, 
        required:true
    },
    email:{
        type: String, 
        required:true
     },
     milestone:{
        type: Array, 
        required:false
    }
});

module.exports = mongoose.model('Goal',goalSchema);