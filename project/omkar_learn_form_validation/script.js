const express=require('express')
const mongoose=require('mongoose')
const db=require('./db')
const Person=require('./users')
const cors = require('cors'); 
const { check, validationResult } = require('express-validator')

// const { validateForm, handleValidationErrors } = require('./validation');
// const bodyParser = require('body-parser');



const app=express();
const port = 5000;
app.use(express.json());
app.use(cors()); 
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/form.html');
  });

const validateForm = [
    check('firstname')
        .trim()
        .isLength({ min: 2 }).withMessage('First name must be at least 2 characters long')
        .isAlpha().withMessage('First name must contain only letters'),
    check('lastname')
        .trim()
        .isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long')
        .isAlpha().withMessage('Last name must contain only letters'),
    check('email')
        .trim()
        .isEmail().withMessage('Invalid email address'),
    check('number')
        .trim()
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be 10 digits')
        .isNumeric().withMessage('Mobile number must contain only numbers'),
    check('dob')
        .trim()
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('Date of Birth must be a valid date in YYYY-MM-DD format'),
    check('maritalstatus')
        .notEmpty().withMessage('Marital status is required'),
    check('gender')
        .notEmpty().withMessage('Gender is required'),
    check('occupation')
        .notEmpty().withMessage('Occupation is required'),
    check('salary')
        .notEmpty().withMessage('Salary is required'),
    // check('education')
        // .notEmpty().withMessage('Education is required'),
];

app.post('/submitForm', validateForm, async (req, res) => {
  // const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //       return res.status(400).json({ errors: errors.mapped() });

  //   }
  const {firstname,lastname,email,number,dob,maritalstatus,occupation,salary,education} = req.body;
 if(!email){
  res.json({message:"Email required!"})
 }
  try {

      // const data = {
      //   firstname: req.body.firstname,
      //   lastname: req.body.lastname,
      //   email: req.body.email,
      //   number: req.body.number,
      //   dob: req.body.dob,
      //   maritalstatus: req.body.maritalstatus,
      //   gender: req.body.gender,
      //   occupation: req.body.occupation,
      //   salary: req.body.salary,
      //   education: req.body.education,
      // };



    //   const userdata = await Person.create(data); 
  
      // const newPerson=new Person(data);
      // const response= await newPerson.save();
    

      // console.log("Data Saved");
      // res.status(201).json(response)
    } catch (error) {
      res.status(500).json(error);
    }
  });

  
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});