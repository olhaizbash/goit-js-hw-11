import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiServise from "./news-servise";
import NewsApiServise from "./news-servise";
const newsApiServise = new NewsApiServise();
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const refs = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    buttonLoadMore: document.querySelector('.load-more'),
}


refs.buttonLoadMore.style.display = 'none';
refs.form.addEventListener('submit', onSubmit);
refs.buttonLoadMore.addEventListener('click', onClick);

async function onClick(e) {
    const image = await newsApiServise.fetchImage();
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(image));
  gallerySimpleLightbox.refresh();
  console.log(newsApiServise.hits);
  console.log(newsApiServise.currentHits);
    if (newsApiServise.hits <= newsApiServise.currentHits) {
        refs.buttonLoadMore.style.display = 'none';
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
}

async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    newsApiServise.query = form.elements.searchQuery.value;
     if (newsApiServise.query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
    }
    newsApiServise.resetPage();
    newsApiServise.resetCurrentHits();
    const image = await newsApiServise.fetchImage();
    if (newsApiServise.hits > 0) {
        refs.buttonLoadMore.style.display = 'block';
    } else {
        refs.buttonLoadMore.style.display = 'none';
    }
    if (newsApiServise.hits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
    }
    if (newsApiServise.hits > 0) {
        Notiflix.Notify.success(`Hooray! We found ${newsApiServise.hits} images.`);
        refs.gallery.innerHTML = '';
        refs.gallery.insertAdjacentHTML('beforeend', createMarkup(image));
        gallerySimpleLightbox.refresh();
        form.reset();
  }
   if (newsApiServise.hits <= newsApiServise.currentHits) {
        refs.buttonLoadMore.style.display = 'none';
     Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
    }
}

function createMarkup(data) {
    return data.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span class="item-data">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> <span class="item-data">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span class="item-data">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span class="item-data">${downloads}</span>
    </p>
  </div>
</div>`
    }).join("")
}
