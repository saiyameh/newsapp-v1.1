const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const newsBox = document.getElementById("newsBox");
const spinner = document.getElementById("spinner");

let allNews = [];
let currentNewsIndex = 0;
const newsLimit = 40;

// Toggle Dark Mode
function toggleDarkMode() {
  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
}
darkModeToggle.addEventListener("change", toggleDarkMode);

// Initial Dark Mode
function setInitialDarkMode() {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDarkMode) {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
}
setInitialDarkMode();

// Fetch News Function with parameters
function getNews({ category = '', language = 'en', country = 'in'} = {}) {
  const url = new URL('http://localhost:3000/api/news');
  if (category) url.searchParams.append('category', category);
  // if (q) url.searchParams.append('q', q);
  url.searchParams.append('language', language);
  url.searchParams.append('country', country);
  // url.searchParams.append('page', page);

  spinner.style.visibility = "visible";
  newsBox.style.visibility = "hidden";

  fetch(url)
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => {
      allNews = data;
      currentNewsIndex = 0;
      displayNews();
      spinner.style.visibility = "hidden";
    })
    .catch(error => {
      console.error('Error fetching news:', error);
      newsBox.innerHTML = '<p>Failed to fetch news articles. Please try again later.</p>';
      spinner.style.visibility = "hidden";
      newsBox.style.visibility = "visible";
    });
}

// Display News Cards
function displayNews() {
  if (allNews.length === 0) {
    newsBox.innerHTML = '<p>No news articles available at the moment. Please try again later.</p>';
    newsBox.style.visibility = "visible";
    return;
  }

  const newsHTML = allNews.slice(currentNewsIndex, currentNewsIndex + newsLimit).map(article => {
    const hasImage = article.image_url ? "has-image" : ""; // Check if an image URL exists
    const imageUrl = article.image_url || ''; // Use image URL if available, otherwise leave it blank

    return `
      <div class="newsCard ${hasImage}">
        <div class="imageWrapper">
          <img src="${imageUrl}" class="thumbnail" alt="News Image">
        </div>
        <div class="card-body">
          <div class="card-date">${new Date(article.pubDate).toLocaleDateString()}</div>
          <h5 class="card-title">${article.title}</h5>
          <h5 class="card-author">Author: ${article.creator || 'Unknown'}</h5>
          <p class="card-text">${article.description || 'No description available'}</p>
          <a target="_blank" href="${article.link}" class="btn btn-primary">Read more..</a>
        </div>
      </div>
    `;
  }).join('');
  
  newsBox.innerHTML = newsHTML;
  newsBox.style.visibility = "visible";



  if (currentNewsIndex + newsLimit < allNews.length) {
    newsBox.innerHTML += `<button id="showMore" class="btn btn-primary">Show More</button>`;
    document.getElementById("showMore").addEventListener("click", showMoreNews);
  }

  newsBox.style.visibility = "visible";
}

// Fetch News by Category
function sendCategory(id) {
  const categories = [
    "top", "business", "sports", "technology", "science", "entertainment",
    "health", "politics", "world"
  ];
  const category = categories[id];
  getNews({ category });
}

// Initial fetch with default parameters
getNews();
