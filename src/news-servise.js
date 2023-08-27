import axios from "axios";
import Notiflix from 'notiflix';
const BASE_URL = 'https://pixabay.com/api/';
axios.defaults.baseURL = BASE_URL;
export default class NewsApiServise{
    constructor() {
        this.searchParametr = '';
        this.page = 1;
        this.hits = 0;
        this.currentHits = 0;
    }

    async fetchImage() {
        this.hits = 0;
    const params = new URLSearchParams({
        key: '39077539-1e107db3fd9a5ec3005c5bc93',
        q: this.searchParametr,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
    });
    try {
    const response = await axios.get(`?${params}`);
        this.currentHits += response.data.hits.length;
        if (response.data.hits.length === 0) {
            throw new Error(response.statusText);
        }
        this.hits = response.data.totalHits;
        return response.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return {
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads
            }
        });
    } catch (error) {
        Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.');
    } finally {
        this.page += 1;
  }
    }

    resetPage() {
        this.page = 1;
    }
    
    get query() {
        return this.searchParametr;
    }

    set query(newQuery) {
        this.searchParametr = newQuery;
    }

    hits() {
        return this.hits;
    }

    currentHits() {
        return this.currentHits;
    }

    resetCurrentHits() {
        this.currentHits = 0;
    }
}
