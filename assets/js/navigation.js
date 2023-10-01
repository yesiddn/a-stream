window.addEventListener(
  'DOMContentLoaded',
  () => {
    navigator();
    // Agregando un estado de carga inical
    window.history.pushState({ loadUrl: window.location.href }, null, '');
  },
  false
);

searchFormBtn.addEventListener('click', (e) => {
  e.preventDefault();
  location.hash = `search=${searchFormInput.value.trim()}`;
});

trendingBtn.addEventListener('click', () => {
  location.hash = 'trends';
});

arrowBtn.addEventListener('click', () => {
  const stateLoad = window.history.state ? window.history.state.loadUrl : '';
  if (stateLoad.includes('#')) {
    window.location.hash = 'home';
  } else {
    window.history.back();
  }
});

window.addEventListener('load', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
  if (location.hash.startsWith('#trends')) {
    trendsPage();
  } else if (location.hash.startsWith('#search=')) {
    searchPage();
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage();
  } else if (location.hash.startsWith('#category=')) {
    categoryPage();
  } else {
    homePage();
  }

  document.body.scrollTop = 0; // no funciona en algunos navegadores por la guerra de navegadores :(
  document.documentElement.scrollTop = 0;

  // scroll suave
  // function smoothscroll() {
  //   const currentScroll =
  //     document.documentElement.scrollTop || document.body.scrollTop;
  //   if (currentScroll > 0) {
  //     window.requestAnimationFrame(smoothscroll);
  //     window.scrollTo(0, currentScroll - currentScroll / 5);
  //   }
  // }
  // smoothscroll();
}

function homePage() {
  console.log('HOME!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');

  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function trendsPage() {
  console.log('TRENDS!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Tendencias';

  getTrendingMovies();
}

function searchPage() {
  console.log('SEARCH!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, searchQuery] = decodeURI(location.hash).split('='); // ['#search=', 'query']
  getMoviesBySearch(searchQuery);
}

function movieDetailsPage() {
  console.log('MOVIE!');

  headerSection.classList.add('header-container--long');
  // headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.add('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');
}

function categoryPage() {
  console.log('CATEGORY!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = decodeURI(location.hash).split('='); // ['#category=', 'id-name']
  const [categoryId, categoryName] = categoryData.split('-'); // ['id', 'name']

  headerCategoryTitle.innerHTML = categoryName;

  getMoviesByCategory(categoryId);
}
