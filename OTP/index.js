const express=require('express')
const mongoose=require('mongoose')
const db=require('./db')
const Mobile=require('./user')
const cors = require('cors'); 
const bcrypt=require('bcrypt')

const app=express();
const port = 2000;
app.use(express.json());
app.use(cors()); 
app.use(express.static('public'));

app.post("/getotp",async (req,res)=>{
    try {
        const {number}=req.body;
        if (!number) {
            return res.status(400).json({ message: 'Number is required' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(otp)
        const newUser = {number,otp};
        let result = new Mobile(newUser);
        result = await result.save();

        // Respond with success message and the newly registered user
        console.log("Data Saved");
        res.status(201).json({ message: 'OTP sent successfully',otp:otp});
        

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

});

app.post("/submitotp", async (req, res) => {
    try {
        const { otp } = req.body;
        const mobileRecord = await Mobile.findOne({ otp });

        if (mobileRecord) {
            res.status(201).json({ message: 'OTP verified successfully' });
        } else {
            res.status(400).json({ message: 'Incorrect OTP' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});










  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
