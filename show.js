function showChampion(teamName, imageUrl) {
    const championContainer = document.getElementById('champion-container');
    const championTeam = document.getElementById('champion-team');
    const championImage = document.getElementById('champion-image');

    championTeam.textContent = `¡${teamName} es el campeón!`;
    championImage.src = imageUrl;

    // Mostrar el contenedor del campeón
    championContainer.classList.remove('hidden');
    setTimeout(() => {
        championContainer.classList.add('visible');
    }, 10);

    // Ocultar el contenedor después de 5 segundos y redirigir a la página de inicio
    setTimeout(() => {
        championContainer.classList.remove('visible');
        setTimeout(() => {
            championContainer.classList.add('hidden');
            // Redirigir a la página de inicio o restablecer la vista principal
            resetView(); // O llama a una función para restablecer la vista
        }, 1000); // Espera a que la transición de desvanecimiento termine
    }, 5000); // Tiempo para mostrar el mensaje
}

function resetView() {
    // Aquí puedes agregar el código para restablecer la vista principal
    // Por ejemplo, recargar la página o restablecer ciertos elementos
    // Evitar que se repita la animación al recargar
    sessionStorage.setItem('championShown', 'true');
    window.location.reload(); // Ejemplo de recarga de página
}

// Verificar si ya se mostró el campeón
if (!sessionStorage.getItem('championShown')) {
    // Llama a la función cuando tengas el equipo campeón
    // Por ejemplo, después de que se determine el ganador:
    showChampion('Argentina', 'https://i.ytimg.com/vi/LZT2EIFOIwU/sddefault.jpg');
}
