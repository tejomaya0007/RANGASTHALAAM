document.addEventListener('DOMContentLoaded', () => {

    // Function to open a new page for the movie title
    window.openMoviePage = function(movie) {
        const url = `./SwagBookinPage.html`;
        window.location.href = url;
    };

    // Dates for navigation
    const dates = ["Thu, 24 Oct", "Fri, 25 Oct", "Sat, 26 Oct", "Sun, 27 Oct"];
    let currentDateIndex = 0;
    let currentFilter = 'all'; // Default filter

    // Elements for date navigation and dropdown
    const selectedDate = document.getElementById('selected-date');
    const prevDate = document.getElementById('prev-date');
    const nextDate = document.getElementById('next-date');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // Showtimes data for all dates and theaters
    const showtimeData = {
        ameerpet: {
            "Thu, 24 Oct": ['04:00AM', '08:00 AM', '11:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'],
            "Fri, 25 Oct": ['11:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'],
            "Sat, 26 Oct": ['08:00 AM', '11:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'],
            "Sun, 27 Oct": ['08:00 AM', '11:30 AM', '02:00 PM', '06:00 PM', '09:30 PM'],
            morning: ['04:00 AM', '11:30 AM'],
            afternoon: ['12:30 PM', '02:00 PM'],
            evening: ['04:10 PM', '06:00 PM'],
            night: ['08:00 PM', '10:00 PM']
        },
        gachibowli: {
            "Thu, 24 Oct": ['06:05 AM', '01:00 PM', '02:00 PM', '05:05 PM', '06:05 PM', '08:00 PM', '10:00 PM'],
            "Fri, 25 Oct": ['06:05 AM', '01:00 PM', '03:30 PM', '05:05 PM', '07:00 PM', '08:00 PM', '10:00 PM'],
            "Sat, 26 Oct": ['06:05 AM', '12:30 PM', '02:00 PM', '04:00 PM', '05:05 PM', '07:00 PM', '08:00 PM', '10:00 PM'],
            "Sun, 27 Oct": ['06:05 AM', '01:00 PM', '03:30 PM', '05:05 PM', '06:05 PM', '08:00 PM', '10:00 PM'],
            morning: ['06:05 AM'],
            afternoon: ['01:00 PM', '02:00 PM'],
            evening: ['05:05 PM', '06:05 PM'],
            night: ['08:00 PM', '10:00 PM']
        },
        nallagandla: {
            "Thu, 24 Oct": ['06:00 PM', '07:00 PM', '08:25 PM', '10:50 PM'],
            "Fri, 25 Oct": ['05:00 PM', '06:00 PM', '07:00 PM', '08:30 PM', '09:30 PM', '10:50 PM'],
            "Sat, 26 Oct": ['06:00 PM', '07:00 PM', '08:25 PM', '10:50 PM'],
            "Sun, 27 Oct": ['06:00 PM', '07:00 PM', '08:25 PM', '10:50 PM'],
            morning: [],
            afternoon: [],
            evening: ['06:00 PM', '07:00 PM'],
            night: ['08:25 PM', '10:50 PM']
        }
    };

    // Initialize date and showtimes display
    updateDate();

    // Update the date display and showtimes
    function updateDate() {
        selectedDate.textContent = dates[currentDateIndex];
        updateShowtimes();
    }

    // Event listeners for date navigation
    prevDate.addEventListener('click', () => {
        if (currentDateIndex > 0) {
            currentDateIndex--;
            updateDate();
        }
    });

    nextDate.addEventListener('click', () => {
        if (currentDateIndex < dates.length - 1) {
            currentDateIndex++;
            updateDate();
        }
    });

    // Handle filtering by time period
    window.filterShowtimes = function(period) {
        currentFilter = period;
        updateShowtimes();
    };

    // Reset showtimes to show all times
    window.resetShowtimes = function() {
        currentFilter = 'all';
        updateShowtimes();
    };

    // Update the displayed showtimes based on selected date and filter
    function updateShowtimes() {
        const ameerpetTimes = getShowtimes(showtimeData.ameerpet);
        const gachibowliTimes = getShowtimes(showtimeData.gachibowli);
        const nallagandlaTimes = getShowtimes(showtimeData.nallagandla);

        document.getElementById('ameerpet-times').innerHTML = generateShowtimeButtons('ameerpet', ameerpetTimes);
        document.getElementById('gachibowli-times').innerHTML = generateShowtimeButtons('gachibowli', gachibowliTimes);
        document.getElementById('nallagandla-times').innerHTML = generateShowtimeButtons('nallagandla', nallagandlaTimes);
    }

    // Get filtered showtimes based on current date and filter
    function getShowtimes(showtimeData) {
        const dateKey = dates[currentDateIndex];
        const defaultTimes = showtimeData[dateKey] || [];
        if (currentFilter === 'all') return defaultTimes;
        return showtimeData[currentFilter] || [];
    }

    // Generate HTML for showtime buttons
    function generateShowtimeButtons(theater, times) {
        return times.map(time => 
            `<button type="button" class="showtime" onclick="redirectToShowtimePage('${theater}', '${time}')">${time}</button>`
        ).join('');
    }

    // Redirect to seating.html only for the "ameerpet" theater
    // Redirect to specific HTML pages based on the selected showtime for "ameerpet" theater
window.redirectToShowtimePage = function(theater, time) {
    if (theater === 'ameerpet') {
        let url;

        // Check the showtime and set the corresponding URL
        if (time === '04:00 AM') {
            url = '4am.html';
        } else if (time === '08:00 AM') {
            url = '8am.html';
        } else if (time === '11:30 AM') {
            url = '11am.html';
        } else {
            // Default fallback for other times (if needed)
            url = 'seating.html';
        }

        // Redirect to the selected time's page
        window.location.href = url;
    } else {
        // Redirect to a different page for other theaters
        const otherTheaterUrl = `showtime-details.html?theater=${theater}&time=${encodeURIComponent(time)}`;
        window.location.href = otherTheaterUrl;
    }
};



    // Open a new page for the selected theater
    window.openTheaterPage = function(theater) {
        const url = `theater-details.html?theater=${encodeURIComponent(theater)}`;
        window.location.href = url;
    };

    // Dropdown toggle functionality
    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.dropdown')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
