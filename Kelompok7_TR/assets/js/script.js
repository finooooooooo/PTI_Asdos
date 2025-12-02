/* Created by Fidelix - Group 7 */

// Movie Data
const movies = [
    {
        id: 1,
        title: "Bokep anjay",
        rating: "6 Tahun Boleh+",
        genre: "Horor",
        duration: "20h",
        synopsis: "Tante nyasar ngungsi di tempat kakek",
        image: "images/parani.jpg"
    },
    {
        id: 2,
        title: "Interstellar",
        rating: "R13+",
        genre: "Sci-Fi, Adventure",
        duration: "2h 49m",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        image: "images/interstellar.jpg"
    },
    {
        id: 3,
        title: "The Dark Knight",
        rating: "D17+",
        genre: "Action, Crime",
        duration: "2h 32m",
        synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        image: "images/batman.jpg"
    },
    {
        id: 4,
        title: "Avengers: Endgame",
        rating: "R13+",
        genre: "Action, Sci-Fi",
        duration: "3h 1m",
        synopsis: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        image: "images/avengers.jpg"
    },
    {
        id: 5,
        title: "Spider-Man: No Way Home",
        rating: "R13+",
        genre: "Action, Adventure",
        duration: "2h 28m",
        synopsis: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
        image: "images/spiderman.jpg"
    },
    {
        id: 6,
        title: "Dune",
        rating: "D17+",
        genre: "Sci-Fi, Adventure",
        duration: "2h 35m",
        synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
        image: "images/dune.jpg"
    }
];

const TICKET_PRICE = 50000;

document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    const path = window.location.pathname;

    // Check for specific elements to determine which page logic to run
    if (document.getElementById('now-playing-grid')) {
        renderMovies('now-playing-grid');
    } else if (document.getElementById('movies-list-grid')) {
        renderMovies('movies-list-grid');
    } else if (document.getElementById('movie-detail-container')) {
        loadMovieDetail();
    } else if (document.getElementById('schedule-container')) {
        setupSchedule();
    } else if (document.getElementById('seats-container')) {
        setupSeats();
    } else if (document.getElementById('ticket-container')) {
        renderTicket();
    }
}

// Render Movies Grid
function renderMovies(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // If on homepage (now-playing-grid), maybe show only 4? But instructions didn't specify limits.
    // We'll show all.

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => {
            localStorage.setItem('selectedMovieId', movie.id);
            // Handle correct path navigation
            const isHome = containerId === 'now-playing-grid';
            window.location.href = isHome ? 'pages/detail.html' : 'detail.html';
        };
        const prefix = window.location.pathname.includes('/pages/') ? '../' : '';
        card.innerHTML = `
            <img src="${prefix + movie.image}" alt="${movie.title}">
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-rating">
                    <span>${movie.rating}</span>
                    <span>${movie.duration}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Load Movie Details
function loadMovieDetail() {
    const movieId = localStorage.getItem('selectedMovieId');
    if (!movieId) {
        window.location.href = 'movies.html';
        return;
    }

    const movie = movies.find(m => m.id == movieId);
    if (!movie) return;

    document.getElementById('detail-poster').src = "../" + movie.image;
    document.getElementById('detail-title').textContent = movie.title;
    document.getElementById('detail-synopsis').textContent = movie.synopsis;
    document.getElementById('meta-genre').textContent = movie.genre;
    document.getElementById('meta-duration').textContent = movie.duration;
    document.getElementById('meta-rating').textContent = movie.rating;

    document.getElementById('buy-ticket-btn').onclick = () => {
        window.location.href = 'schedule.html';
    };
}

// Schedule Logic
function setupSchedule() {
    const timeButtons = document.querySelectorAll('.time-btn');
    let selectedTime = null;
    let selectedStudio = null;

    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all
            timeButtons.forEach(b => b.classList.remove('selected'));
            // Add to clicked
            btn.classList.add('selected');

            selectedTime = btn.dataset.time;
            selectedStudio = btn.closest('.schedule-section').querySelector('.studio-title').textContent;

            // Enable next button
            const nextBtn = document.getElementById('next-btn');
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
        });
    });

    document.getElementById('next-btn').onclick = () => {
        if (selectedTime && selectedStudio) {
            localStorage.setItem('selectedSchedule', JSON.stringify({
                time: selectedTime,
                studio: selectedStudio,
                date: new Date().toLocaleDateString()
            }));
            window.location.href = 'seats.html';
        } else {
            alert('Please select a time.');
        }
    };
}

// Seats Logic
function setupSeats() {
    const grid = document.getElementById('seats-grid');
    const totalDisplay = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const selectedSeats = new Set();

    // Generate 8x8 Grid (64 seats)
    for (let i = 0; i < 64; i++) {
        const seat = document.createElement('div');
        seat.className = 'seat';

        // Randomly occupy some seats for realism
        if (Math.random() < 0.2) {
            seat.classList.add('occupied');
        } else {
            seat.addEventListener('click', () => {
                if (seat.classList.contains('selected')) {
                    seat.classList.remove('selected');
                    selectedSeats.delete(i);
                } else {
                    seat.classList.add('selected');
                    selectedSeats.add(i);
                }
                updateTotal();
            });
        }

        // Add row/col data for display? Just index for now "A1", etc.
        const row = String.fromCharCode(65 + Math.floor(i / 8)); // A, B, C...
        const col = (i % 8) + 1;
        seat.title = `${row}${col}`;
        seat.dataset.label = `${row}${col}`;

        grid.appendChild(seat);
    }

    function updateTotal() {
        const count = selectedSeats.size;
        const total = count * TICKET_PRICE;
        totalDisplay.textContent = `Rp ${total.toLocaleString('id-ID')}`;

        if (count > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        }
    }

    checkoutBtn.onclick = () => {
        const seatLabels = Array.from(selectedSeats).map(index => {
             const row = String.fromCharCode(65 + Math.floor(index / 8));
             const col = (index % 8) + 1;
             return `${row}${col}`;
        });

        localStorage.setItem('selectedSeats', JSON.stringify(seatLabels));
        localStorage.setItem('totalPrice', (selectedSeats.size * TICKET_PRICE));
        window.location.href = 'ticket.html';
    };
}

// Ticket Logic
function renderTicket() {
    const movieId = localStorage.getItem('selectedMovieId');
    const scheduleData = JSON.parse(localStorage.getItem('selectedSchedule'));
    const seatsData = JSON.parse(localStorage.getItem('selectedSeats'));
    const priceData = localStorage.getItem('totalPrice');

    if (!movieId || !scheduleData || !seatsData) {
        alert('Missing booking data');
        window.location.href = '../index.html';
        return;
    }

    const movie = movies.find(m => m.id == movieId);

    document.getElementById('ticket-movie-title').textContent = movie.title;
    document.getElementById('ticket-date').textContent = scheduleData.date;
    document.getElementById('ticket-time').textContent = scheduleData.time;
    document.getElementById('ticket-studio').textContent = scheduleData.studio;
    document.getElementById('ticket-seats').textContent = seatsData.join(', ');
    document.getElementById('ticket-price').textContent = `Rp ${parseInt(priceData).toLocaleString('id-ID')}`;

    // Random Transaction ID
    document.getElementById('ticket-id').textContent = 'TRX-' + Math.floor(Math.random() * 1000000);
}
