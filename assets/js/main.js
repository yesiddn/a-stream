// Instancia de axios para usarla en toda la app
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    api_key: API_KEY,
    language: 'es',
  },
});

// Helpers o utils
const lazyLoader = new IntersectionObserver((entries) => {
  // entries, observer | el observer es el mismo lazyLoader
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const url = entry.target.getAttribute('data-img');
    entry.target.setAttribute('src', url);
  });
}); // callback, options | si no se pasan las opciones se observa todo el html

function createMovies(movies, container, { lazy = true, clean = true } = {}) {
  // want lazy or not?

  if (clean) container.innerHTML = '';
  movies.forEach((movie) => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    movieContainer.addEventListener('click', () => {
      location.hash = `#movie=${movie.id}`;
    });

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazy ? 'data-img' : 'src',
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute(
        'src',
        // imagen tipo placeholder -> tamaño 300x450 -> color de fondo 5c218a -> texto blanco -> tamaño de texto 20px
        `https://via.placeholder.com/300x450/5c218a/ffffff?text=${movie.title}&fontsize=32`
      );
    });

    if (lazy) lazyLoader.observe(movieImg);

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = '';
  categories.forEach((category) => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

// Llamados a la api

async function getTrendingMoviesPreview() {
  const { data } = await api(`/trending/movie/day`);

  const movies = data.results;

  createMovies(movies, trendingMoviesPreviewList, true);
}

async function getCategoriesPreview() {
  const { data } = await api(`/genre/movie/list`);

  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(categoryId) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: categoryId,
    },
  });

  const movies = data.results;
  maxPages = data.total_pages;

  createMovies(movies, genericSection);
}

async function getMoviesBySearch(searchQuery) {
  const { data } = await api('search/movie', {
    params: {
      query: searchQuery,
    },
  });

  const movies = data.results;
  maxPages = data.total_pages;

  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api(`/trending/movie/day`);
  const movies = data.results;
  maxPages = data.total_pages;

  createMovies(movies, genericSection);
  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.innerText = 'Cargar más';
  // btnLoadMore.addEventListener('click', () => {
  //   btnLoadMore.remove();
  //   getPaginatedTrendingMovies();
  // });
  // genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
  const pageIsNotMax = page < maxPages;

  if (scrollIsBottom && pageIsNotMax) {
    page++;

    const { data } = await api(`/trending/movie/day`, {
      params: {
        page,
      },
    });
    const movies = data.results;

    createMovies(movies, genericSection, { clean: false });
  }
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const pageIsNotMax = page < maxPages;

    if (scrollIsBottom && pageIsNotMax) {
      page++;

      const { data } = await api(`/search/movie`, {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;

      createMovies(movies, genericSection, { clean: false });
    }
  };
}

function getPaginatedMoviesByCategory(categoryId) {
  return async function () {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const pageIsNotMax = page < maxPages;

    if (scrollIsBottom && pageIsNotMax) {
      page++;

      const { data } = await api('discover/movie', {
        params: {
          with_genres: categoryId,
          page,
        },
      });

      const movies = data.results;

      createMovies(movies, genericSection, { clean: false });
    }
  };
}

async function getMovieById(id) {
  const { data: movie } = await api(`/movie/${id}`);

  const movieImgUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
  headerSection.style.background = `
    linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0.35) 19.27%, 
    rgba(0, 0, 0, 0) 29.17%
    ),
    url(${movieImgUrl}) center center / cover no-repeat`;

  movieDetailTitle.innerHTML = movie.title;
  movieDetailDescription.innerHTML = movie.overview;
  movieDetailScore.innerHTML = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
}

async function getReletedMoviesId(id) {
  const { data } = await api(`movie/${id}/similar`);

  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}
