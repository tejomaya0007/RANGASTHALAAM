


const seats = document.querySelectorAll(".seat");
seats.forEach(seat => {
  seat.addEventListener("click", () => {
    seat.classList.toggle("selected");
  });
});
