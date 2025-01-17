import axios from 'axios';

const API_KEY = '48154537-527b84123da1832c7b7680c8e';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query) {
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&page=${1}&per_page=${15}&image_type=photo&orientation=horizontal&safesearch=true`;
    
   try {
    const response = await axios.get(url);

    // Перевірка статусу відповіді
    if (response.status !== 200) {
      throw new Error('Failed to fetch images');
    }

    // Повертаємо масив зображень
    return response.data.hits;
  } catch (error) {
    console.error(error.message || 'Something went wrong!');
    throw new Error('Something went wrong!');
  }
}
