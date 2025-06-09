const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Registration = require('./RegistrationModel');
const Seat = require('./SeatModel');

const app = express();
const PORT = 5000;

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Configure session
app.use(session({
    secret: 'your-secret-key', // Replace with a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set 'secure: true' if using HTTPS
}));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/ranga', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Serve the homepage HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html')); // Ensure the path is correct
});

// Serve the payment and confirmation pages
app.get('/payment.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'movies running/swag/payment.html'));
});

app.get('/conformation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'movies running/swag/conformation.html'));
});

// Registration route with validation
app.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, dob, mobile, password } = req.body;
    console.log('Registration attempt:', { username, email, dob, mobile });

    try {
        const existingUser = await Registration.findOne({
            $or: [
                { 'user.email': email },
                { 'user.mobile': mobile },
                { 'user.username': username }
            ]
        });

        if (existingUser) {
            const errorMessages = [];
            if (existingUser.user[0]?.email === email) errorMessages.push('Email already registered.');
            if (existingUser.user[0]?.mobile === mobile) errorMessages.push('Mobile number already registered.');
            if (existingUser.user[0]?.username === username) errorMessages.push('Username already taken.');
            return res.status(400).json({ message: errorMessages.join(' ') });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully.');

        const newUser = new Registration({
            user: [{
                username,
                email,
                dob,
                mobile,
                password: hashedPassword
            }]
        });

        await newUser.save();
        console.log(`User registered successfully: ${username}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(`Login attempt with username: ${username}`);

    try {
        const user = await Registration.findOne({ 'user.username': username });
        if (!user || !user.user[0]) {
            console.log(`Username not found: ${username}`);
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.user[0].password);
        if (!isMatch) {
            console.log(`Password is invalid for username: ${username}`);
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        console.log(`Password is valid for username: ${username}`);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed. Please try again.' });
    }
});

// Book seats route
app.post('/book-seats', async (req, res) => {
    const { seatIds, userId, email, mobile } = req.body;
    console.log(`Seat booking attempt:`, { seatIds, userId, email, mobile });

    try {
        // Step 1: Convert seat numbers from strings to integers
        const convertedSeatNumbers = seatIds
            .map(seatId => parseInt(seatId.match(/\d+/)?.[0], 10))
            .filter(num => !isNaN(num));
        console.log('Converted Seat Numbers:', convertedSeatNumbers);

        // Step 2: Check for any already booked seats
        const alreadyBookedSeats = await Seat.find({
            seatNumber: { $in: convertedSeatNumbers },
            status: 'booked'
        });

        if (alreadyBookedSeats.length > 0) {
            const bookedSeatNumbers = alreadyBookedSeats.map(seat => seat.seatNumber).join(', ');
            return res.status(400).json({
                message: `The following seats are already booked: ${bookedSeatNumbers}.`
            });
        }

        // Step 3: Check for all available seats
        const availableSeats = await Seat.find({
            seatNumber: { $in: convertedSeatNumbers },
            status: 'available'
        });

        if (availableSeats.length !== convertedSeatNumbers.length) {
            return res.status(400).json({
                message: 'Some of the requested seats are not available for booking.'
            });
        }

        // Step 4: Determine the user who is booking
        const bookedBy = userId && mongoose.Types.ObjectId.isValid(userId)
            ? mongoose.Types.ObjectId(userId)
            : null;

        // Step 5: Update seat status to 'booked' and associate the user
        await Seat.updateMany(
            { seatNumber: { $in: convertedSeatNumbers }, status: 'available' },
            { $set: { status: 'booked', bookedBy } }
        );

        // Step 6: Store booking details in the session
        req.session.bookingDetails = {
            seatIds,
            email,
            mobile,
            section: availableSeats[0].section, // Assuming all seats are in the same section
            amount: availableSeats.reduce((total, seat) => total + seat.price, 0),
            date: "Thu, 24 Oct 2024",
            time: "08:00 AM"
        };

        console.log(`Seats booked successfully for user: ${userId || 'guest'}`);
        res.status(200).json({
            message: 'Seats booked successfully.',
            redirectUrl: '/confirmation.html'
        });
    } catch (error) {
        // Step 7: Handle errors gracefully
        console.error('Error booking seats:', error);
        res.status(500).json({
            message: 'Booking failed due to a server error. Please try again later.'
        });
    }
});

app.get('/booked-seats/:showId', async (req, res) => {
    const { showId } = req.params;

    try {
        // Ensure you are using the 'new' keyword when creating an ObjectId
        if (!mongoose.Types.ObjectId.isValid(showId)) {
            return res.status(400).json({ message: 'Invalid show ID' });
        }

        // Correctly create a new ObjectId
        const objectId = new mongoose.Types.ObjectId(showId);

        const bookedSeats = await Seat.find({
            showId: objectId,
            status: 'booked'
        });

        // Log booked seats for debugging
        console.log('Booked Seats:', bookedSeats);

        res.status(200).json(bookedSeats);
    } catch (error) {
        console.error('Error fetching booked seats:', error);
        res.status(500).json({ message: 'Failed to fetch booked seats' });
    }
});





// Endpoint to get booking details for confirmation
app.get('/get-booking-details', (req, res) => {
    if (req.session.bookingDetails) {
        res.status(200).json(req.session.bookingDetails);
    } else {
        res.status(404).json({ message: 'No booking details found.' });
    }
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://<your-ip>:${PORT}`);
});
