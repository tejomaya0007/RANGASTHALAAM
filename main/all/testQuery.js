const mongoose = require('mongoose');
const Seat = require('./SeatModel'); // Make sure the path to SeatModel is correct

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/ranga')
    .then(() => {
        console.log('Connected to MongoDB');
        runQuery(); // Call the function to run the query
    })
    .catch(err => console.error('MongoDB connection error:', err));

async function runQuery() {
    try {
        // Example convertedSeatNumbers for testing
        const convertedSeatNumbers = [1]; // Adjust this to match your test data

        // Run the Seat.find query
        const availableSeats = await Seat.find({
            seatNumber: { $in: convertedSeatNumbers },
            status: 'available'
        });
        console.log('Available Seats from DB:', availableSeats);

        // Close the database connection
        mongoose.disconnect();
    } catch (error) {
        console.error('Error running query:', error);
        mongoose.disconnect();
    }
}
