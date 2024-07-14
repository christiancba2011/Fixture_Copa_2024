function showChampion(teamName, imageUrl) {
    const championContainer = document.getElementById('champion-container');
    const championTeam = document.getElementById('champion-team');
    const championImage = document.getElementById('champion-image');

    championTeam.textContent = `¡${teamName} Campeón!`;
    championImage.src = imageUrl;

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
        // window.location.href = 'inicio.html'; // Ejemplo de redirección
        resetView(); // O llama a una función para restablecer la vista
    }, 1000); // Espera a que la transición de desvanecimiento termine
}, 4500); // Tiempo para mostrar el mensaje

 }
function resetView() {
// Aquí puedes agregar el código para restablecer la vista principal
// Por ejemplo, recargar la página o restablecer ciertos elementos
window.location.reload(); // Ejemplo de recarga de página
}

// Llama a la función cuando tengas el equipo campeón
// Por ejemplo, después de que se determine el ganador:
showChampion('Argentina', 'https://i.ytimg.com/vi/LZT2EIFOIwU/sddefault.jpg');
