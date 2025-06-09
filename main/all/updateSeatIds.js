const mongoose = require('mongoose');
const fs = require('fs');

// Load your JSON data
const seatData = require('./dump/json files/ranga.seatingSandhya8AM24Oct.json');

// Function to convert `showId` and ensure data consistency
function convertSeatData(data) {
    return data.map(seat => {
        // Check if `_id` is a string and matches the `ObjectId` pattern
        if (typeof seat._id === 'string' && seat._id.includes('ObjectId')) {
            seat._id = new mongoose.Types.ObjectId(seat._id.match(/ObjectId\("(.+?)"\)/)[1]);
        } else if (typeof seat._id === 'object' && seat._id.$oid) {
            // Handle MongoDB extended JSON format
            seat._id = new mongoose.Types.ObjectId(seat._id.$oid);
        } else {
            // If it's already an ObjectId or valid format, leave it as is
            seat._id = new mongoose.Types.ObjectId(seat._id);
        }

        // Convert `showId` similarly
        if (typeof seat.showId === 'string' && seat.showId.includes('ObjectId')) {
            seat.showId = new mongoose.Types.ObjectId(seat.showId.match(/ObjectId\("(.+?)"\)/)[1]);
        } else if (typeof seat.showId === 'object' && seat.showId.$oid) {
            // Handle MongoDB extended JSON format
            seat.showId = new mongoose.Types.ObjectId(seat.showId.$oid);
        } else {
            // If it's already an ObjectId or valid format, leave it as is
            seat.showId = new mongoose.Types.ObjectId(seat.showId);
        }

        return seat;
    });
}

// Convert the data
const convertedData = convertSeatData(seatData);

// Log the converted data for verification
console.log('Converted Seat Data:', convertedData);

// If you need to save this data to the database:
async function saveToDatabase() {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ranga', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Use the existing Seat model from your SeatModel.js
    const Seat = require('./SeatModel');

    // Clear the existing collection (if necessary) before inserting new data
    await Seat.deleteMany({}); // This will remove all existing documents in the Seat collection

    // Save each seat to the database
    for (let seat of convertedData) {
        await Seat.create(seat);
    }

    console.log('Data successfully saved to the database!');
    mongoose.connection.close();
}

// Call the function to save the data
saveToDatabase().catch(err => console.error('Error saving data:', err));
