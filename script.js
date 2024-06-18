// script.js

document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const groupButtons = document.querySelectorAll('.group-btn');
    const knockoutButtons = document.querySelectorAll('.knockout-btn');
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let numVisibleCards = 1; // Default number of visible cards

    // Fetch JSON data
    fetch('https://project-data-games.onrender.com/groups')
        .then(response => response.json())
        .then(data => {
            populateCarousel(data.groups, "Grupo A"); // Load initial group
        });

    function populateCarousel(data, selectedGroupOrPhase) {
        carouselTrack.innerHTML = ''; // Clear existing content
        
        // Determine if we are handling groups or knockout phase
        let matches = data[selectedGroupOrPhase]?.matches || data[selectedGroupOrPhase] || [];

        matches.forEach(match => {
            const card = createMatchCard(selectedGroupOrPhase, match);
            carouselTrack.appendChild(card);
        });
        updateControls(); // Update controls after populating carousel
        updateCarousel(); // Initial positioning
    }

    function createMatchCard(groupName, match) {
        const card = document.createElement('div');
        card.classList.add('card');

        // Check if the groupName is knockout stage
        const isKnockoutStage = ["quarterfinals", "semifinals", "thirdPlace", "final"].includes(groupName);

        card.innerHTML = `
            <h3>${match.team1} vs ${match.team2}</h3>
            ${!isKnockoutStage ? `<img src="${match.imageUrl}" alt="Partido ${match.team1} vs ${match.team2}">` : ''}
            <div class="card-content">
                <p>${match.dayOfWeek}, ${match.date} - ${match.time}</p>
                <p>${match.location}</p>
                <p><strong>Resultado:</strong> ${match.score1 !== null ? match.score1 : '-'} - ${match.score2 !== null ? match.score2 : '-'}</p>
            </div>
        `;
        return card;
    }

    function handleButtonClick(buttons, selectedType) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' class from all buttons
                groupButtons.forEach(btn => btn.classList.remove('active'));
                knockoutButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add 'active' class to clicked button
                button.classList.add('active');
                
                const selectedGroupOrPhase = button.getAttribute('data-group');
                currentIndex = 0; // Reset index when group changes
                fetch('db.json')
                    .then(response => response.json())
                    .then(data => {
                        if (selectedType === 'group') {
                            populateCarousel(data.groups, selectedGroupOrPhase);
                        } else {
                            populateCarousel(data, selectedGroupOrPhase);
                        }
                    });
            });
        });
    }

    handleButtonClick(groupButtons, 'group');
    handleButtonClick(knockoutButtons, 'knockout');

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        const numCards = carouselTrack.children.length;
        if (currentIndex < numCards - numVisibleCards) {
            currentIndex++;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const cardWidth = document.querySelector('.card').offsetWidth;
        const gap = 10; // Assuming a gap between cards
        const containerWidth = document.querySelector('.carousel-container').offsetWidth;

        // Calculate number of visible cards based on the container width
        numVisibleCards = Math.floor(containerWidth / (cardWidth + gap));

        const moveDistance = (cardWidth + gap) * currentIndex;
        carouselTrack.style.transform = `translateX(-${moveDistance}px)`;
        updateControls();
    }

    function updateControls() {
        // Disable previous button if at the start
        prevBtn.disabled = currentIndex === 0;

        // Disable next button if at the end
        const numCards = carouselTrack.children.length;
        nextBtn.disabled = currentIndex >= numCards - numVisibleCards;
    }

    window.addEventListener('resize', updateCarousel);
});


