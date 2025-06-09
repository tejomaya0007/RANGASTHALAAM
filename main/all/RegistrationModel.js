const mongoose = require('mongoose');
const registrationSchema = new mongoose.Schema({
    user: [
        {
            username: String,
            email: String,
            dob: String,
            mobile: String,
            password: String
        }
    ]
});

// Explicitly specify the collection name as "registration"
module.exports = mongoose.model('Registration', registrationSchema, 'registration');
