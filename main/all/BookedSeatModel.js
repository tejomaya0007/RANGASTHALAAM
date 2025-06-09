const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    showId: { type: mongoose.Schema.Types.ObjectId, required: true },
    section: { type: String, required: true },
    row: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    price: { type: Number, required: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

// Make sure to export the model correctly
const Seat = mongoose.model('Seat', seatSchema, 'seatingSandhya8AM24Oct');
module.exports = Seat;
