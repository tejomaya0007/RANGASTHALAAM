// Sidebar functionality
function showSidebar() {
    document.getElementById('mobileSidebar').style.display = 'flex';
}

function hideSidebar() {
    document.getElementById('mobileSidebar').style.display = 'none';
}

// Carousel functionality
let currentIndex = 0;

function moveCarousel(direction) {
    const container = document.querySelector('.container');
    const items = container.querySelectorAll('.box');
    const totalItems = items.length;

    let visibleItems;
    if (window.innerWidth <= 480) {
        visibleItems = 1;
    } else if (window.innerWidth <= 768) {
        visibleItems = 2;
    } else {
        visibleItems = 5;
    }

    const maxIndex = totalItems - visibleItems;
    const itemWidthPercentage = 100 / visibleItems;

    let newIndex = currentIndex + direction;

    if (newIndex < 0) {
        newIndex = 0;
    } else if (newIndex > maxIndex) {
        newIndex = maxIndex;
    }

    currentIndex = newIndex;

    container.style.transform = `translateX(${-currentIndex * itemWidthPercentage}%)`;
}

document.querySelector('.carousel-button.prev').addEventListener('click', function() {
    moveCarousel(-1);
});

document.querySelector('.carousel-button.next').addEventListener('click', function() {
    moveCarousel(1);
});

window.addEventListener('resize', function() {
    moveCarousel(0);
});
