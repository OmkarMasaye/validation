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

        let existingUser = await Mobile.findOne({ number });

        if (existingUser) {
            // Check if cooldown period is still active
            if (existingUser.cooldownEnd && new Date() < new Date(existingUser.cooldownEnd)) {
                return res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
            }

            // Check the number of OTP attempts in the last 5 minutes
            const recentAttempts = existingUser.otpAttempts.filter(attempt =>
                (new Date() - new Date(attempt)) <  20 * 1000
            );

            if (recentAttempts.length >= 3) {
                // Start a new cooldown period
                existingUser.cooldownEnd = new Date(Date.now() + 20 * 1000);  // 5 minutes from now
                existingUser.otpAttempts = [];  // Clear OTP attempts
                await existingUser.save();
                return res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
            }

            // Add the current attempt timestamp
            existingUser.otpAttempts.push(new Date());

            // Update OTP and expiry time
            existingUser.otp = otp;
            existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 
            await existingUser.save();
        } else {
            // Create a new user document with initial OTP attempt
            const newUser = {
                number,
                otp,
                otpAttempts: [new Date()],
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000), 
                cooldownEnd: null  
            };
            existingUser = new Mobile(newUser);
            await existingUser.save();
        }


        // Respond with success message and the newly registered user
        console.log("Data Saved");
        res.status(201).json({ message: 'OTP sent successfully',otp:otp});
        

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

});

app.post("/verifyotp", async (req, res) => {
    try {
        const {  otp } = req.body;
        if ( !otp) {
            return res.status(400).json({ message: 'Number and OTP are required' });
        }

        const user = await Mobile.findOne({ otp });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        

        // Check if the OTP matches and is not expired
        if (user.otp  && new Date() < new Date(user.otpExpiry)) {
            return res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
        }

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});





  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
