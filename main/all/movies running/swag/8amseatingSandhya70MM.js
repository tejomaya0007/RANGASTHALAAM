// Define seat prices by section
const SEAT_PRICES = {
    "upper-balcony-section": 150,
    "lower-balcony-section": 150,
    "first-class-section": 110,
    "third-class-section": 50
};

const ticketDropdown = document.getElementById("ticket-dropdown");
const seats = document.querySelectorAll(".seat");
const payButton = document.getElementById("pay-button");
const paymentContainer = document.getElementById("payment-container");

paymentContainer.style.display = "none";

let selectedSeatsCount = 0;
let ticketCount = 0;

// Update ticket count based on dropdown selection
ticketDropdown.addEventListener("change", (event) => {
    ticketCount = parseInt(event.target.value) || 0;
    selectedSeatsCount = 0;
    document.querySelectorAll(".seat.selected").forEach(seat => seat.classList.remove("selected"));
    updateTotalAmount();
    paymentContainer.style.display = "none";
});

// Handle seat selection
seats.forEach((seat) => {
    seat.addEventListener("click", () => {
        handleSeatSelection(seat);
    });
});

// Function to handle seat selection
function handleSeatSelection(seat) {
    const maxSelection = ticketCount;

    if (seat.classList.contains("booked")) {
        alert("This seat is already booked.");
        return;
    }

    if (seat.classList.contains("selected")) {
        seat.classList.remove("selected");
        selectedSeatsCount--;
    } else if (selectedSeatsCount < maxSelection) {
        seat.classList.add("selected");
        selectedSeatsCount++;

        if (selectedSeatsCount === 1) {
            paymentContainer.style.display = "block";
        }
    } else {
        alert(`You can only select up to ${maxSelection} seats.`);
    }
    updateTotalAmount();
}

// Update total amount
function updateTotalAmount() {
    let totalAmount = 0;
    document.querySelectorAll(".seat.selected").forEach((seat) => {
        const seatSection = seat.getAttribute("data-section");
        totalAmount += SEAT_PRICES[seatSection] || 0;
    });
    payButton.textContent = `Pay Rs.${totalAmount}`;
}

// Book seats function
async function bookSeats(selectedSeats) {
    try {
        const response = await fetch('/book-seats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seatIds: selectedSeats, userId: 'null' })
        });
        const data = await response.json();
        if (data.message === 'Seats booked successfully.') {
            window.location.href = '/payment.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error booking seats:', error);
    }
}

// Proceed to payment
async function proceedToPayment() {
    const selectedSeats = Array.from(document.querySelectorAll(".seat.selected")).map(seat => {
        const rowLabel = seat.parentElement.querySelector('.row-label')?.textContent.trim();
        const seatNumber = seat.textContent.trim();
        return rowLabel && seatNumber ? `${rowLabel}${seatNumber}` : null;
    }).filter(seat => seat !== null);

    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    const seatSectionElement = document.querySelector(".seat.selected");
    if (!seatSectionElement) {
        alert("Error: Unable to determine seat section. Please try again.");
        return;
    }

    const seatSection = seatSectionElement.getAttribute("data-section");
    const totalAmount = selectedSeats.length * (SEAT_PRICES[seatSection] || 0);

    if (totalAmount <= 0) {
        alert("Invalid total amount. Please try again.");
        return;
    }

    localStorage.setItem('selectedSeats', JSON.stringify({
        section: seatSection,
        seats: selectedSeats,
        amount: totalAmount
    }));

    try {
        await bookSeats(selectedSeats);
    } catch (error) {
        console.error("Error booking seats:", error);
        alert("An error occurred while booking seats. Please try again.");
    }
}

payButton.addEventListener("click", proceedToPayment);

// Fetch and disable booked seats
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const showId = '64d2a1a93827c0e512f1d1b0'; // Replace with your actual show ID
        const response = await fetch(`/booked-seats/${showId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const bookedSeats = await response.json();
        console.log('Booked Seats in Frontend:', bookedSeats);

        // Update the UI to mark seats as booked
        bookedSeats.forEach(seat => {
            const seatElement = document.querySelector(
                `.seat[data-section="${seat.section}"][data-seat-number="${seat.seatNumber}"]`
            );
            if (seatElement) {
                seatElement.classList.add('booked');
                seatElement.removeEventListener('click', () => handleSeatSelection(seatElement));
            } else {
                console.warn(`Seat not found in DOM for section: ${seat.section}, number: ${seat.seatNumber}`);
            }
        });
    } catch (error) {
        console.error('Error loading booked seats:', error);
    }
});

async function fetchBookedSeats() {
    const showId = '64d2a1a93827c0e512f1d1b0'; // Correct Show ID
    try {
        const response = await fetch(`/booked-seats/${showId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const bookedSeats = await response.json();
        console.log('Booked Seats in Frontend:', bookedSeats);

        // Now handle the booked seats
        bookedSeats.forEach(seat => {
            const seatElement = document.querySelector(
                `.seat[data-section="${seat.section}"][data-seat-number="${seat.seatNumber}"]`
            );
            if (seatElement) {
                seatElement.classList.add('booked');
                seatElement.removeEventListener('click', handleSeatSelection);
            }
        });
    } catch (error) {
        console.error('Error loading booked seats:', error);
    }
}

// Call the function to fetch and mark booked seats
fetchBookedSeats();

