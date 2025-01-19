import axios from 'axios';
// Константи для роботи з API
const API_KEY = '48154537-527b84123da1832c7b7680c8e';
const BASE_URL = 'https://pixabay.com/api/';
// Функція для отримання зображень з API
export async function fetchImages(query, page) {
    const searchParams = new URLSearchParams({
        key: API_KEY,
        q: query,
        page: page,
        per_page: 15,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true
    });
    const url = `${BASE_URL}?${searchParams}`;
    try {
        const response = await axios.get(url);
        if (response.status !== 200) {
            throw new Error('Failed to fetch images');
        }
        return {
            images: response.data.hits,
            totalHits: response.data.totalHits
        };
    } catch (error) {
        throw new Error('Failed to fetch images');
    }
}
