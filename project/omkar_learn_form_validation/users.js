const mongoose = require('mongoose');

const personschema = new mongoose.Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    number: {
        type: String,
    },
    email: {
        type: String,
    },
    dob: {
        type: String,
    },
    maritalstatus: {
        type: String,
        // enum: ['Married', 'Unmarried']
    },
    gender: {
        type: String,
        // enum: ['Male', 'Female', 'Other']
    },
    occupation: {
        type: String,
        // enum: ['Salaried', 'Business', 'Student']
    },
    salary: {
        type: String,
        // enum: ['Less than 25,000', '25000 to 50,000', '50,000 to 1,00,000', '1,00,000 Above']
    },
    education: {
        type: String,
        // enum: ['H.S.C', 'Diploma', 'Degree', 'Post Graduate', 'Other']
    }
})

const Person = mongoose.model("Person", personschema)
module.exports = Person;