import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import "izitoast/dist/css/iziToast.min.css";
import { fetchImages } from './js/pixabay-api.js';
import { 
    renderImages, 
    showLoadingIndicator, 
    hideLoadingIndicator, 
    renderLoadMoreButton,
    scrollPageSmoothly 
} from './js/render-functions.js';

// Головний клас для керування галереєю зображень
class ImageGalleryController {
    // Конструктор класу ініціалізує початкові значення
    constructor() {
        this.currentPage = 1;        // Поточна сторінка пагінації
        this.currentQuery = '';      // Поточний пошуковий запит
        this.lightbox = null;        // Екземпляр лайтбоксу для перегляду зображень
        this.init();                 // Запуск ініціалізації
    }

    // Метод ініціалізації компонентів галереї
    init() {
        this.initializeElements();    // Ініціалізація DOM-елементів
        this.initializeLightbox();    // Ініціалізація лайтбоксу
        this.addEventListeners();     // Додавання обробників подій
    }

    // Ініціалізація необхідних DOM-елементів
    initializeElements() {
        this.searchButton = document.querySelector('#search-button');  // Кнопка пошуку
        this.searchInput = document.querySelector('#search-input');    // Поле введення
        this.gallery = document.querySelector('.gallery');            // Контейнер галереї
        
        // Перевірка наявності всіх необхідних елементів
        if (!this.searchButton || !this.searchInput || !this.gallery) {
            throw new Error('Required elements not found');
        }
    }

    // Ініціалізація лайтбоксу для перегляду зображень
    initializeLightbox() {
        this.lightbox = new SimpleLightbox('.gallery a');
    }

    // Додавання обробників подій
    addEventListeners() {
        // Обробник кліку по кнопці пошуку
        this.searchButton.addEventListener('click', () => this.handleSearch());
        
        // Обробник натискання Enter в полі пошуку
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });
        
        // Делегування подій для кнопки Load More
        document.body.addEventListener('click', (e) => {
            if (e.target.classList.contains('load-more-btn')) {
                this.handleLoadMore();
            }
        });
    }

    // Обробник події пошуку
    async handleSearch() {
        const query = this.searchInput.value.trim();
        
        // Перевірка наявності пошукового запиту
        if (!query) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please enter a search query.',
            });
            return;
        }

        this.currentQuery = query;     // Зберігаємо поточний запит
        this.currentPage = 1;          // Скидаємо сторінку до початкової
        this.gallery.innerHTML = '';   // Очищуємо галерею
        
        await this.fetchAndRenderImages();  // Завантажуємо та відображаємо зображення
    }

    // Обробник завантаження додаткових зображень
    async handleLoadMore() {
        this.currentPage += 1;                // Збільшуємо номер сторінки
        await this.fetchAndRenderImages();    // Завантажуємо нові зображення
        scrollPageSmoothly();                 // Прокручуємо сторінку до нових зображень
    }

    // Метод для завантаження та відображення зображень
    async fetchAndRenderImages() {
        try {
            showLoadingIndicator();  // Показуємо індикатор завантаження
            
            // Отримуємо зображення з API
            const { images, totalHits } = await fetchImages(this.currentQuery, this.currentPage);
            
            renderImages(images, totalHits);  // Відображаємо зображення
            this.lightbox.refresh();          // Оновлюємо лайтбокс

            // Відображаємо кнопку "Load More" тільки для першої сторінки
            if (this.currentPage === 1) {
                renderLoadMoreButton(this.gallery, totalHits);
            }
        } catch (error) {
            // Обробка помилок при завантаженні
            iziToast.error({
                title: 'Error',
                message: error.message || 'Failed to fetch images',
            });
        } finally {
            hideLoadingIndicator();  // Приховуємо індикатор завантаження
        }
    }
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ImageGalleryController();  // Створюємо екземпляр контролера галереї
    } catch (error) {
        console.error('Failed to initialize gallery:', error);
        iziToast.error({
            title: 'Error',
            message: 'Failed to initialize the gallery',
        });
    }
});