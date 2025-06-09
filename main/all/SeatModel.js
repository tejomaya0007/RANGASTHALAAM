const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    showId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ensure ObjectId type
    section: { type: String, required: true },
    row: { type: String, required: true },
    seatNumber: { type: Number, required: true },
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    price: { type: Number, required: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});
// Use the correct collection name: 'seatingSandhya8AM24Oct'
const Seat = mongoose.model('Seat', seatSchema, 'seatingSandhya8AM24Oct');

module.exports = Seat;
