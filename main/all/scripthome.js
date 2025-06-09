// Sidebar and menu button elements
const sidebar = document.querySelector('.sidebar');
const menuButton = document.querySelector('.menu-button');

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const userAuthElement = document.getElementById('userAuth');
    const userSidebar = document.getElementById('userSidebar'); // Sidebar element for user actions
    const logoutButton = document.getElementById('logoutButton');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    // Ensure navigation sidebar is hidden on initial load
    if (sidebar) {
        sidebar.style.display = 'none';
    }

    // Function to toggle user sidebar visibility
    function toggleUserSidebar() {
        if (userSidebar) {
            userSidebar.classList.toggle('open');
        }
    }

    // Check login status on page load
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        updateHeader(isLoggedIn);
    }

    // Update header based on login status
    function updateHeader(isLoggedIn) {
        if (isLoggedIn && userAuthElement) {
            userAuthElement.innerHTML = '<i id="userIcon" class="fas fa-user-circle" style="font-size:24px;color:#ffcc00; cursor: pointer;"></i>';
            const userIcon = document.getElementById('userIcon');
            if (userIcon) {
                userIcon.addEventListener('click', toggleUserSidebar);
            }
        } else if (userAuthElement) {
            userAuthElement.innerHTML = '<a href="signin.html" id="signInBtn" class="button">Sign In</a>';
        }
    }

    // Handle logout
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            localStorage.removeItem('isLoggedIn');
            alert('Logged out successfully');
            if (userSidebar) userSidebar.classList.remove('open');
            location.reload(); // Refresh page to show the Sign In button
        });
    }

    // Close user sidebar when the close button is clicked
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', function () {
            if (userSidebar) userSidebar.classList.remove('open');
        });
    }

    // Initial login status check
    checkLoginStatus();
});

// Function to show the navigation sidebar (hamburger menu)
function showSidebar() {
    if (sidebar) {
        sidebar.style.display = 'flex';
        createOverlay();
    }
}

// Function to hide the navigation sidebar
function hideSidebar() {
    if (sidebar) {
        sidebar.style.display = 'none';
        removeOverlay();
    }
}

// Toggle navigation sidebar visibility when clicking the menu button
if (menuButton) {
    menuButton.addEventListener('click', function () {
        const isVisible = sidebar.style.display === 'flex';
        if (isVisible) {
            hideSidebar();
        } else {
            showSidebar();
        }
    });
}

// Close navigation sidebar when clicking outside of it
document.addEventListener('click', function (event) {
    if (sidebar && menuButton) {
        const isClickInside = sidebar.contains(event.target) || menuButton.contains(event.target);
        if (!isClickInside && sidebar.style.display === 'flex') {
            hideSidebar();
        }
    }
});

// Helper function to create an overlay
function createOverlay() {
    if (!document.getElementById('overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', hideSidebar);
    }
}

// Helper function to remove the overlay
function removeOverlay() {
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.remove();
}

// Carousel functionality for each section
// Set up touch swiping for each carousel section
// Carousel functionality for each section
document.querySelectorAll('.carousel-section').forEach(function (section) {
    let currentIndex = 0;
    let startX = 0;
    let isSwiping = false;
    const container = section.querySelector('.container');
    const items = container.querySelectorAll('.box');
    const totalItems = items.length;

    // Helper function to get the number of visible items
    function getVisibleItems() {
        if (window.innerWidth <= 480) return 2;
        if (window.innerWidth <= 768) return 3;
        return 3.5;
    }

    // Function to move the carousel
    function moveCarousel(direction) {
        const visibleItems = getVisibleItems();
        const maxIndex = Math.max(0, totalItems - visibleItems);
        const itemWidthPercentage = 100 / visibleItems;

        currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
        container.style.transform = `translateX(${-currentIndex * itemWidthPercentage}%)`;
        updateButtons();
    }

    // Function to update button states (disable/enable)
    function updateButtons() {
        const prevButton = section.querySelector('.carousel-button.prev');
        const nextButton = section.querySelector('.carousel-button.next');
        if (prevButton && nextButton) {
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === totalItems - getVisibleItems();
        }
    }

    // Event listeners for swipe functionality
    container.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        isSwiping = true;
    });

    container.addEventListener('touchmove', function (e) {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;

        if (Math.abs(deltaX) > 50) {
            if (deltaX < 0) moveCarousel(1); // Swipe left
            else moveCarousel(-1); // Swipe right
            isSwiping = false;
        }
    });

    container.addEventListener('touchend', function () {
        isSwiping = false;
    });

    // Event listeners for carousel buttons
    const prevButton = section.querySelector('.carousel-button.prev');
    const nextButton = section.querySelector('.carousel-button.next');

    if (prevButton) {
        prevButton.addEventListener('click', function () {
            moveCarousel(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function () {
            moveCarousel(1);
        });
    }

    // Adjust carousel on window resize
    window.addEventListener('resize', function () {
        moveCarousel(0); // Reset the position
        updateButtons();
    });

    // Initial button state update
    updateButtons();
});
