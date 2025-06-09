// Sidebar and menu button elements
const sidebar = document.getElementById('mobileSidebar');
const menuButton = document.querySelector('.menu-button');
const closeButton = document.querySelector('.close-btn');

// Ensure sidebar is closed on page load
document.addEventListener('DOMContentLoaded', function() {
  if (sidebar) {
    sidebar.style.display = 'none';
  }
});

// Toggle sidebar when the menu button is clicked
if (menuButton) {
  menuButton.addEventListener('click', toggleSidebar);
}

// Function to toggle the sidebar
function toggleSidebar() {
  if (sidebar.style.display === 'flex') {
    hideSidebar();
  } else {
    showSidebar();
  }
}

// Function to show the sidebar
function showSidebar() {
  sidebar.style.display = 'flex';
  createOverlay();
}

// Function to hide the sidebar
function hideSidebar() {
  sidebar.style.display = 'none';
  removeOverlay();
}

// Close sidebar when clicking the close button
if (closeButton) {
  closeButton.addEventListener('click', hideSidebar);
}

// Close sidebar when clicking outside of it
document.addEventListener('click', function(event) {
  if (sidebar && sidebar.style.display === 'flex') {
    if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
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
  if (overlay) {
    overlay.remove();
  }
}

// Video and Thumbnail functionality
const video = document.getElementById('background-video');
const thumbnail = document.getElementById('thumbnail');
const muteButton = document.getElementById('mute-button');
const bookNowButton = document.querySelector('.play-button');

// If video elements are present, set up video functionality
if (video && thumbnail) {
  video.style.display = 'none';
  thumbnail.style.display = 'block';

  // Mute/Unmute Button functionality
  if (muteButton) {
    muteButton.addEventListener('click', function() {
      video.muted = !video.muted;
      muteButton.innerHTML = video.muted ? '&#128264;' : '&#128266;';
    });
  }

  // Play video after 4 seconds
  setTimeout(() => playVideo(), 4000);

  // Stop video after 40 seconds
  setTimeout(() => stopVideo(), 40000);

  // Play video function
  function playVideo() {
    thumbnail.style.display = 'none';
    video.style.display = 'block';
    video.classList.add('fade-in');
    video.play();
  }

  // Stop video function
  function stopVideo() {
    video.pause();
    video.style.display = 'none';
    thumbnail.style.display = 'block';
  }
}

// 'Book Now' button functionality
if (bookNowButton) {
    bookNowButton.addEventListener('click', function() {
      window.open('https://www.primevideo.com/detail/0SZAZNN5MW3UZNPLWNAI1VWSGW/ref=atv_sr_fle_c_Tn74RA_1_1_1?sr=1-1&pageTypeIdSource=ASIN&pageTypeId=B0D62YXBYD&qid=1731380150741', '_blank');
    });
  }
