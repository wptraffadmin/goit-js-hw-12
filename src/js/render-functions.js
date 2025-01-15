export function renderImages(images) {
    const gallery = document.querySelector('.gallery');
    // // gallery.innerHTML = ''; // Очищаємо галерею перед новим пошуком

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

export function showLoadingIndicator() {
    const loader = document.querySelector('.loader');
    loader.classList.add('visible');
}

export function hideLoadingIndicator() {
    const loader = document.querySelector('.loader');
    loader.classList.remove('visible');
}