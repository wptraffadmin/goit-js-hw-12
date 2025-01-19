import iziToast from 'izitoast';

// Функція для рендерингу зображень
export function renderImages(images, totalHits) {
    const gallery = document.querySelector('.gallery');
    
    if (!gallery) {
        console.error('Gallery element not found');
        return;
    }

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

    gallery.insertAdjacentHTML('beforeend', imageMarkup);
}

// Функція для прокрутки сторінки
export function scrollPageSmoothly() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        const lastItem = galleryItems[galleryItems.length - 1];
        const itemHeight = lastItem.getBoundingClientRect().height;
        
        window.scrollBy({
            top: itemHeight * 2,
            behavior: 'smooth'
        });
    }
}

// Функція для відображення індикатора завантаження
export function showLoadingIndicator() {
    // Знаходимо кнопку "Load More"
    const loadMoreBtn = document.querySelector('.load-more-btn');
    // Якщо кнопка відсутня, виходимо з функції
    if (!loadMoreBtn) return;

    // Знаходимо або створюємо індикатор завантаження
    const loader = document.querySelector('.loader') || createLoader();
    // Ховаємо кнопку "Load More"
    loadMoreBtn.style.display = 'none';
    // Робимо індикатор завантаження видимим
    loader.classList.add('visible');
}

// Функція для приховування індикатора завантаження
export function hideLoadingIndicator() {
    // Знаходимо індикатор завантаження
    const loader = document.querySelector('.loader');
    // Знаходимо кнопку "Load More"
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Якщо індикатор завантаження існує, приховуємо його
    if (loader) {
        loader.classList.remove('visible');
    }
    
    // Якщо кнопка "Load More" існує, робимо її видимою
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'block';
    }
}

// Функція для створення індикатора завантаження
function createLoader() {
    // Створюємо новий div для індикатора
    const loader = document.createElement('div');
    // Додаємо клас 'loader' для стилізації
    loader.className = 'loader';
    // Вставляємо індикатор після галереї
    document.querySelector('.gallery').insertAdjacentElement('afterend', loader);
    // Повертаємо створений індикатор
    return loader;
}

// Функція для рендерингу кнопки "Load More"
export function renderLoadMoreButton(gallery, totalHits) {
    // Знаходимо існуючу кнопку "Load More"
    const existingButton = document.querySelector('.load-more-btn');
    // Знаходимо існуюче повідомлення про кінець результатів
    const existingMessage = document.querySelector('.end-message');
    // Знаходимо індикатор завантаження
    const loader = document.querySelector('.loader');
    
    // Якщо існує кнопка "Load More", видаляємо її
    if (existingButton) {
        existingButton.remove();
    }
    // Якщо існує повідомлення про кінець результатів, видаляємо його
    if (existingMessage) {
        existingMessage.remove();
    }
    // Якщо індикатор завантаження існує, приховуємо його
    if (loader) {
        loader.classList.remove('visible');
    }

    // Розраховуємо поточну сторінку на основі кількості елементів у галереї
    const currentPage = Math.ceil(document.querySelectorAll('.gallery-item').length / 15);
    
    // Якщо результат пошуку 0 завершуємо функцію
    if (totalHits === 0) {
    return;
    }

    // Якщо поточна сторінка охоплює всі результати пошуку
    if (currentPage * 15 >= totalHits) {
        // Створюємо повідомлення про кінець результатів
        const endMessage = `
            <p class="end-message">We're sorry, but you've reached the end of search results.</p>
        `;
        // Вставляємо повідомлення після галереї
        gallery.insertAdjacentHTML('afterend', endMessage);
        return; // Завершуємо виконання функції
    }

    // Створюємо розмітку для кнопки "Load More"
    const buttonMarkup = `
        <button type="button" class="load-more-btn">Load More</button>
    `;
    
    // Додаємо кнопку після галереї
    gallery.insertAdjacentHTML('afterend', buttonMarkup);
}