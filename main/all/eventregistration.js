const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    user: [{
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        dob: { type: Date, required: true },
        mobile: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    }]
}, { timestamps: true });

module.exports = mongoose.model('Registration', RegistrationSchema);
