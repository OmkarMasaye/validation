const mongoose = require('mongoose');

const mobileschema = new mongoose.Schema({
    number: {
        type: String,
        require:true
    },
    otp:{
        type:Number
    },
    otpExpiry:{
         type: Date,
          required: true 
    },
    otpAttempts: [{ type: Date }],  
    cooldownEnd: { type: Date } 
})

const Mobile = mongoose.model("Mobile", mobileschema)
module.exports = Mobile;