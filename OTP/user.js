const mongoose = require('mongoose');

const mobileschema = new mongoose.Schema({
    number: {
        type: String,
        require:true
    },
    otp:{
        type:Number
    }
})

const Mobile = mongoose.model("Mobile", mobileschema)
module.exports = Mobile;