// Objeto para llevar el control del índice de imágenes de cada carrusel
const carrousels = {
    "slider-airpods": 0,
    "slider-deportivos": 0
};

// Función para abrir la ventana modal elegida
function openModal(modalId) {
    const selectedModal = document.getElementById(modalId);
    if(selectedModal) {
        selectedModal.style.display = "flex";
    }
}

// Función para cerrar la ventana modal elegida
function closeModal(modalId) {
    const selectedModal = document.getElementById(modalId);
    if(selectedModal) {
        selectedModal.style.display = "none";
    }
}

// Cerrar el modal automáticamente si el usuario hace clic por fuera de la caja de contenido
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

// Función para avanzar o retroceder fotos en el carrusel
function moveSlide(direction, sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    
    const totalImages = slider.children.length;
    
    carrousels[sliderId] += direction;
    
    // Validaciones de bucle infinito (Del final pasa al inicio y viceversa)
    if (carrousels[sliderId] >= totalImages) {
        carrousels[sliderId] = 0;
    }
    if (carrousels[sliderId] < 0) {
        carrousels[sliderId] = totalImages - 1;
    }
    
    const widthPercentage = carrousels[sliderId] * 100;
    slider.style.transform = `translateX(-${widthPercentage}%)`;
}
/* // Este código JavaScript maneja la funcionalidad de las ventanas modales y los carruseles de imágenes en la página de la tienda de auriculares. Permite abrir y cerrar modales específicos, así como avanzar o retroceder a través de las imágenes del carrusel, asegurando que el usuario pueda navegar por las fotos de los productos de manera fluida. Además, incluye una función para cerrar el modal si el usuario hace clic fuera del contenido, mejorando la experiencia de usuario.    */