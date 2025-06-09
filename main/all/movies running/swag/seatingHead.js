// Define seat prices by section
const SEAT_PRICES = {
    "upper-balcony-section": 150,
    "lower-balcony-section": 150,
    "first-class-section": 110,
    "third-class-section": 50
};

// Select dropdown, seats, and payment button
const ticketDropdown = document.getElementById("ticket-dropdown");
const seats = document.querySelectorAll(".seat");
const payButton = document.getElementById("pay-button");
const paymentContainer = document.getElementById("payment-container");

// Hide the payment container initially
paymentContainer.style.display = "none";

let selectedSeatsCount = 0;
let ticketCount = 0;  // Initialize ticket count

// Update ticket count based on dropdown selection
ticketDropdown.addEventListener("change", (event) => {
    ticketCount = parseInt(event.target.value) || 0;
    selectedSeatsCount = 0;  // Reset selected seats count
    // Deselect all seats if ticket count changes
    document.querySelectorAll(".seat.selected").forEach(seat => seat.classList.remove("selected"));
    updateTotalAmount();  // Reset the total amount to 0
    paymentContainer.style.display = "none";  // Hide payment container until a seat is selected
});

// Function to handle seat selection
seats.forEach((seat) => {
    seat.addEventListener("click", () => {
        const maxSelection = ticketCount;

        if (seat.classList.contains("selected")) {
            // Deselect the seat if already selected
            seat.classList.remove("selected");
            selectedSeatsCount--;
        } else if (selectedSeatsCount < maxSelection) {
            // Select the seat if within the ticket count limit
            seat.classList.add("selected");
            selectedSeatsCount++;

            // Show payment container when the first seat is selected
            if (selectedSeatsCount === 1) {
                paymentContainer.style.display = "block";
            }
        } else {
            alert(`You can only select up to ${maxSelection} seats.`);
        }
        updateTotalAmount();
    });
});

// Function to calculate and update the total amount
function updateTotalAmount() {
    let totalAmount = 0;

    // Loop through all selected seats and add up their prices based on section
    document.querySelectorAll(".seat.selected").forEach((seat) => {
        // Get the section from the data-section attribute
        const seatSection = seat.getAttribute("data-section");
        
        // Add the appropriate price based on the seat's section
        totalAmount += SEAT_PRICES[seatSection] || 0;
    });

    // Update the Pay button with the calculated total amount
    payButton.textContent = `Pay Rs.${totalAmount}`;
}
