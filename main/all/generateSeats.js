const fs = require('fs');

// Function to generate ObjectId-like strings
const generateObjectId = () => {
  return `ObjectId("64d2a1b7${Math.random().toString(16).slice(2, 10)}")`;
};

// Array to hold the seat data
let seats = [];

// Loop to generate 47 seats
for (let i = 0; i < 47; i++) {
  seats.push({
    _id: generateObjectId(),
    showId: 'ObjectId("64d2a1a93827c0e512f1d1b0")',
    section: 'upperBalcony',
    row: 'A',
    seatNumber: i + 1, // Make sure this is a Number
    status: 'available',
    price: 150,
    bookedBy: null, // Default to null if not booked
  });
}

// Write the generated data to a JSON file
fs.writeFileSync('upperBalconySeats.json', JSON.stringify(seats, null, 2));

console.log("JSON data generated successfully!");
