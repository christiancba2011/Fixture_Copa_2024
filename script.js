document.addEventListener('DOMContentLoaded', function() {
    const groupButtons = document.querySelectorAll('.group-btn');
    const phaseButtons = document.querySelectorAll('.phase-btn');
    const carouselTrack = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let numVisibleCards = 1; // Número de tarjetas visibles por defecto
    let startX = 0;
    let endX = 0;
    let isTouchMove = false;

    // Fetch JSON data
    fetch('https://project-data-games.onrender.com/groups')
        .then(response => response.json())
        .then(data => {
            populateCarousel(data.groups, "Grupo A"); // Cargar grupo inicial
        });

    function populateCarousel(groups, selectedGroup) {
        carouselTrack.innerHTML = ''; // Limpiar contenido existente
        let group = groups[selectedGroup];
        group.matches.forEach(match => {
            const card = createMatchCard(selectedGroup, match);
            carouselTrack.appendChild(card);
        });
        updateControls(); // Actualizar controles después de poblar el carrusel
        updateCarousel(); // Posicionamiento inicial
    }

    function createMatchCard(groupName, match) {
        const card = document.createElement('div');
        card.classList.add('card');
        const imgHtml = groupName.includes('Cuartos') || groupName.includes('Semifinal') || groupName.includes('Final') ? '' : `<img src="${match.imageUrl}" alt="Partido ${match.team1} vs ${match.team2}">`;
        card.innerHTML = `
            <h3>${match.team1} vs ${match.team2}</h3>
            ${imgHtml}
            <div class="card-content">
                <p>${match.dayOfWeek}, ${match.date} - ${match.time}</p>
                <p>Ubicación: ${match.location}</p>
            </div>
        `;
        return card;
    }

    groupButtons.forEach(button => {
        button.addEventListener('click', () => {
            groupButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedGroup = button.getAttribute('data-group');
            currentIndex = 0; // Restablecer índice cuando cambia el grupo
            populateCarouselFromGroup(selectedGroup);
        });
    });

    phaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            phaseButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedGroup = button.getAttribute('data-group');
            currentIndex = 0; // Restablecer índice cuando cambia la fase
            populateCarouselFromGroup(selectedGroup);
        });
    });

    function populateCarouselFromGroup(selectedGroup) {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                populateCarousel(data.groups, selectedGroup);
            });
    }

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
        const gap = 10; // Asumiendo un espacio entre tarjetas
        const containerWidth = document.querySelector('.carousel-container').offsetWidth;

        // Calcular el número de tarjetas visibles basado en el ancho del contenedor
        numVisibleCards = Math.floor(containerWidth / (cardWidth + gap));

        const moveDistance = (cardWidth + gap) * currentIndex;
        carouselTrack.style.transform = `translateX(-${moveDistance}px)`;
        updateControls();
    }

    function updateControls() {
        // Deshabilitar botón anterior si está al inicio
        prevBtn.disabled = currentIndex === 0;

        // Deshabilitar botón siguiente si está al final
        const numCards = carouselTrack.children.length;
        nextBtn.disabled = currentIndex >= numCards - numVisibleCards;
    }

    window.addEventListener('resize', updateCarousel);

    // Agregar eventos de toque para deslizamiento
    carouselTrack.addEventListener('touchstart', handleTouchStart);
    carouselTrack.addEventListener('touchmove', handleTouchMove);
    carouselTrack.addEventListener('touchend', handleTouchEnd);

    function handleTouchStart(event) {
        startX = event.touches[0].clientX;
        isTouchMove = false;
    }

    function handleTouchMove(event) {
        endX = event.touches[0].clientX;
        isTouchMove = true;
    }

    function handleTouchEnd() {
        if (isTouchMove) {
            if (startX > endX) {
                // Deslizar hacia la izquierda
                nextBtn.click();
            } else if (startX < endX) {
                // Deslizar hacia la derecha
                prevBtn.click();
            }
        }
        // Reiniciar variables de toque
        startX = 0;
        endX = 0;
        isTouchMove = false;
    }
});
