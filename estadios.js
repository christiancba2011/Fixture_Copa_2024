// estadios.js
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    hamburgerMenu.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const stadiumsContainer = document.getElementById('stadiums-container');

    // Fetch JSON data for stadiums
    fetch('estadios.json')
        .then(response => response.json())
        .then(data => {
            populateStadiums(data.estadios);
        });

    function populateStadiums(estadios) {
        estadios.forEach(estadio => {
            const card = createStadiumCard(estadio);
            stadiumsContainer.appendChild(card);
        });
    }

    function createStadiumCard(estadio) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <img src="${estadio.imageUrl}" alt="${estadio.name}">
            <div class="card-content">
                <h3>${estadio.name}</h3>
                <p>${estadio.location}</p>
            </div>
        `;
        return card;
    }
});
