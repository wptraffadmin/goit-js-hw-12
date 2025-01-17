import axios from 'axios';

let currentPage = 1;  // Початкова сторінка

// Функція для отримання зображень з API
export async function fetchImages(query) {
    const API_KEY = '48154537-527b84123da1832c7b7680c8e';
    const BASE_URL = 'https://pixabay.com/api/';
    
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${currentPage}&per_page=${15}&image_type=photo&orientation=horizontal&safesearch=true`;

    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch images');
        }
        
        // Повертає масив зображень та загальну кількість
        return {
            images: response.data.hits,
            totalHits: response.data.totalHits
        };
    } catch (error) {
        console.error('Error fetching images:', error);
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong while fetching images!',
        });
    }
}

// Функція для рендерингу зображень
export function renderImages(images, totalHits) {
    const gallery = document.querySelector('.gallery');
    
    if (images.length === 0) {
        iziToast.error({
            title: 'Error',
            message: 'Sorry, there are no images matching your search query. Please try again!',
        });
        return;
    }

    const imageMarkup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <a href="${largeImageURL}" class="gallery-item">
            <img src="${webformatURL}" alt="${tags}" />
            <div class="info">
                <p><strong>Likes:</strong> <br> ${likes}</p>
                <p><strong>Views:</strong> <br> ${views}</p>
                <p><strong>Comments:</strong> <br> ${comments}</p>
                <p><strong>Downloads:</strong> <br> ${downloads}</p>
            </div>
        </a>
    `).join('');

    // Додаємо HTML розмітку галереї
    gallery.insertAdjacentHTML('beforeend', imageMarkup);

    // Додаємо кнопку для завантаження додаткових зображень
    renderLoadMoreButton(gallery, totalHits);
}

// Функція для прокрутки до першого елемента нової сторінки
export function scrollPageSmoothly() {
    // Отримуємо всі елементи галереї
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Перевірка наявності елементів
    if (galleryItems.length > 0) {
        const firstNewItem = galleryItems[galleryItems.length - 1]; // Останній елемент (останнє завантажене зображення)

        // Отримуємо висоту одного елемента галереї
        const itemHeight = firstNewItem.getBoundingClientRect().height;

        // Прокручуємо сторінку на дві висоти елемента
        window.scrollBy({
            top: itemHeight * 2,  // Прокручувати на 2 висоти елемента
            behavior: 'smooth'    // Плавне прокручування
        });
    }
}

// Функція для відображення індикатора завантаження
export function showLoadingIndicator() {
    const loader = document.querySelector('.loader');
    loader.classList.add('visible');
}

// Функція для приховування індикатора завантаження
export function hideLoadingIndicator() {
    const loader = document.querySelector('.loader');
    loader.classList.remove('visible');
}

// Функція для рендерингу кнопки "Load More"
export function renderLoadMoreButton(gallery, totalHits) {
    const existingButton = document.querySelector('.load-more-btn');
    if (existingButton) return; // Якщо кнопка вже існує, не додаємо нову

    // Перевірка на досягнення кінця результатів
    if (currentPage * 15 >= totalHits) {
        gallery.insertAdjacentHTML('afterend', `
            <p class="end-message">We're sorry, but you've reached the end of search results.</p>
        `);
        return;
    }

    const buttonMarkup = `
        <button class="load-more-btn">Load More</button>
    `;
    
    gallery.insertAdjacentHTML('afterend', buttonMarkup);

    // Додаємо обробник події для кнопки
    const loadMoreBtn = document.querySelector('.load-more-btn');

    loadMoreBtn.addEventListener('click', async () => {
        // Отримуємо наступну сторінку зображень
        currentPage += 1;  // Збільшуємо поточну сторінку
        const query = 'nature'; // Це можна змінити на змінну, яка містить поточний запит
        const { images, totalHits } = await fetchImages(query); // Отримуємо нові зображення та totalHits
        renderImages(images, totalHits); // Рендеримо нові зображення

        // Викликаємо прокрутку
        scrollPageSmoothly();
    });
}
