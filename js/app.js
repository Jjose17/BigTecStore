import { db, collection, onSnapshot } from './firebase-config.js';

const WHATSAPP_PHONE = "573213284988"; // Tu número de WhatsApp

const productsGrid = document.getElementById('products-grid');
const categoryButtons = document.querySelectorAll('.cat-btn');

let allProducts = [];
let currentCategory = 'todos';
let carouselIntervals = []; // Guardará los temporizadores activos

function initProductsListener() {
    const productsRef = collection(db, 'productos');

    onSnapshot(productsRef, (snapshot) => {
        allProducts = [];
        snapshot.forEach((doc) => {
            allProducts.push({
                id: doc.id,
                ...doc.data()
            });
        });
        renderProducts();
    }, (error) => {
        console.error("Error al obtener los productos:", error);
    });
}

function renderProducts() {
    // Limpiar temporizadores anteriores para no sobrecargar la memoria
    carouselIntervals.forEach(interval => clearInterval(interval));
    carouselIntervals = [];

    const filteredProducts = currentCategory === 'todos'
        ? allProducts
        : allProducts.filter(p => p.categoria.toLowerCase() === currentCategory.toLowerCase());

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `<p class="loading">No hay productos disponibles en esta categoría.</p>`;
        return;
    }

    productsGrid.innerHTML = filteredProducts.map(product => {
        const hasStock = product.stock > 0;
        const stockText = hasStock ? `Quedan ${product.stock} disponibles` : 'Agotado';
        const stockClass = hasStock ? '' : 'out-of-stock';

        // Manejar múltiples imágenes o una por defecto
        const imageList = (product.imagenes && product.imagenes.length > 0)
            ? product.imagenes
            : [product.imagen || 'img/Air1.jfif'];

        const waMessage = encodeURIComponent(
            `Hola, estoy interesado en comprar el producto *${product.nombre}* (Precio: $${product.precio.toLocaleString('es-CO')}). ¿Aún está disponible?`
        );
        const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${waMessage}`;

        return `
            <article class="product-card">
                <div class="carousel-container">
                    <img id="img-${product.id}" src="${imageList[0]}" alt="${product.nombre}">
                </div>
                <div class="product-info">
                    <h3>${product.nombre}</h3>
                    <p>${product.descripcion || ''}</p>
                </div>
                <div class="card-bottom">
                    <div class="card-details">
                        <span class="price">$${product.precio.toLocaleString('es-CO')}</span>
                        <span class="stock-badge ${stockClass}">${stockText}</span>
                    </div>
                    <a href="${hasStock ? waUrl : '#'}" 
                       target="${hasStock ? '_blank' : '_self'}" 
                       class="btn-whatsapp ${hasStock ? '' : 'disabled'}">
                        <i class="fab fa-whatsapp"></i> ${hasStock ? 'Comprar por WhatsApp' : 'Agotado'}
                    </a>
                </div>
            </article>
        `;
    }).join('');

    // Iniciar la rotación automática de imágenes para cada producto
    filteredProducts.forEach(product => {
        const imageList = (product.imagenes && product.imagenes.length > 0) ? product.imagenes : [product.imagen];

        if (imageList.length > 1) {
            let currentIndex = 0;
            const imgElement = document.getElementById(`img-${product.id}`);

            const interval = setInterval(() => {
                currentIndex = (currentIndex + 1) % imageList.length;
                if (imgElement) {
                    imgElement.style.opacity = '0.3'; // Efecto de transición suave
                    setTimeout(() => {
                        imgElement.src = imageList[currentIndex];
                        imgElement.style.opacity = '1';
                    }, 200);
                }
            }, 3000); // Cambia cada 3000 milisegundos (3 segundos)

            carouselIntervals.push(interval);
        }
    });
}

function setupCategoryFilters() {
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.getAttribute('data-category');
            renderProducts();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupCategoryFilters();
    initProductsListener();
});

// Permite que las tarjetas destacadas filtren el catálogo al hacer clic
function setupBannerCategoryTriggers() {
    const triggers = document.querySelectorAll('.category-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const cat = trigger.getAttribute('data-cat');

            // Buscar y presionar el botón de categoría correspondiente
            const targetButton = document.querySelector(`.cat-btn[data-category="${cat}"]`);
            if (targetButton) {
                targetButton.click();
            }

            // Desplazarse suavemente hasta la sección de productos
            document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Asegúrate de llamarla dentro del evento DOMContentLoaded:
document.addEventListener('DOMContentLoaded', () => {
    setupCategoryFilters();
    initProductsListener();
    setupBannerCategoryTriggers(); // <- Agregar esta línea
});