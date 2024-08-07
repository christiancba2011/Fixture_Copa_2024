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
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    


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
        
         let penaltiesInfo = '';
            if (match.penalties) {
                penaltiesInfo = `<p><strong>Penales:</strong> ${match.penalties}</p>`;
            }

            // Verifica si es la final y si hay un resultado definido
            let championImage = '';
                if (groupName === "final" && match.score1 !== null && match.score2 !== null) {
                    // Determina el equipo ganador
                    const winner = match.score1 > match.score2 ? match.team1 : match.team2;
                    // URL de la imagen del campeón (esto debería ser dinámico según tu lógica)
                    const championImageUrl = './img/Argentina_Campeon_CA_2024.png';
                    championImage = `<div class="champion">
                                        <p><strong>Campeón:</strong> ${winner}</p>
                                        <img src="${championImageUrl}" alt="Campeón ${winner}">
                                    </div>`;
                }
            card.innerHTML = `
            <h3>${match.team1} vs ${match.team2}</h3>
            ${!isKnockoutStage ? `<img src="${match.imageUrl}" alt="Partido ${match.team1} vs ${match.team2}">` : ''}
            <div class="card-content">
                <p>${match.dayOfWeek}, ${match.date} - ${match.time}</p>
                <p>${match.location}</p>
                <p><strong>Resultado:</strong> ${match.score1 !== null ? match.score1 : '-'} - ${match.score2 !== null ? match.score2 : '-'}</p>
                ${penaltiesInfo} <!-- Solo se mostrará si hay información de penales -->
                ${championImage} <!-- Imagen del campeón si es la final -->
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

     // Handle touch events for swiping
     carouselTrack.addEventListener('touchstart', handleTouchStart);
     carouselTrack.addEventListener('touchmove', handleTouchMove);
     carouselTrack.addEventListener('touchend', handleTouchEnd);
 
     function handleTouchStart(event) {
         startX = event.touches[0].clientX;
         isDragging = true;
         currentX = startX; // Set currentX to startX initially
     }
 
     function handleTouchMove(event) {
         if (!isDragging) return;
         currentX = event.touches[0].clientX;
         event.preventDefault(); // Prevent default behavior (e.g., scrolling)
     }
 
     function handleTouchEnd() {
         if (!isDragging) return;
         isDragging = false;
         const diffX = startX - currentX;
         if (Math.abs(diffX) > 50) {
             if (diffX > 0) {
                 // Swipe left, move to next card
                 nextBtn.click();
             } else {
                 // Swipe right, move to previous card
                 prevBtn.click();
             }
         }
     }

      // Event listener for clicks outside the carousel
      document.addEventListener('click', function(event) {
        const isClickInsideCarousel = carouselTrack.contains(event.target) || prevBtn.contains(event.target) || nextBtn.contains(event.target);
        if (!isClickInsideCarousel) {
            carouselTrack.innerHTML = ''; // Clear carousel content
        }
    });

    window.addEventListener('resize', updateCarousel);
});


