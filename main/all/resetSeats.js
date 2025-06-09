const mongoose = require('mongoose');
const Seat = require('./SeatModel'); // Make sure to use the correct path to your Seat model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ranga', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        
        // Update all seats to set status to 'available' and bookedBy to null
        Seat.updateMany({}, { $set: { status: 'available', bookedBy: null } })
            .then(result => {
                console.log(`All seats have been reset. Modified count: ${result.modifiedCount}`);
                mongoose.disconnect(); // Disconnect from MongoDB after the update
            })
            .catch(error => {
                console.error('Error updating seats:', error);
                mongoose.disconnect(); // Disconnect from MongoDB in case of error
            });
    })
    .catch(err => console.error('MongoDB connection error:', err));
