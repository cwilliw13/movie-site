const API_KEY = "da5471bf";
const movieResults = document.getElementById("movieResults");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultCount = document.getElementById("resultCount");
const sortFilter = document.getElementById("sortFilter");

let currentMovies = [];

function getSortedMovies(list) {
  const sortedMovies = [...list];
  const sortValue = sortFilter.value;

  if (sortValue === "az") {
    sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortValue === "newToOld") {
    sortedMovies.sort((a, b) => Number(b.Year) - Number(a.Year));
  } else if (sortValue === "oldToNew") {
    sortedMovies.sort((a, b) => Number(a.Year) - Number(b.Year));
  }

  return sortedMovies;
}

function renderMovies(list) {
  const sortedMovies = getSortedMovies(list || []);

  if (!sortedMovies.length) {
    movieResults.innerHTML = '<div class="empty-state">No movies found. Try a different title.</div>';
    resultCount.textContent = "0 results";
    return;
  }

  movieResults.innerHTML = sortedMovies
    .map((movie) => {
      const poster = movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Poster";

      return `
        <article class="movie-card">
          <img class="movie-poster" src="${poster}" alt="${movie.Title} poster">
          <div class="movie-info">
            <h3>${movie.Title}</h3>
            <div class="movie-meta">
              <span>${movie.Year}</span>
              <span>⭐ ${movie.imdbRating || "N/A"}</span>
            </div>
            <p>${movie.Type ? movie.Type.toUpperCase() : "Movie"}</p>
          </div>
        </article>
      `;
    })
    .join("");

  resultCount.textContent = `${sortedMovies.length} result${sortedMovies.length > 1 ? "s" : ""}`;
}

async function fetchMovies(searchTerm) {
  const query = searchTerm.trim();
  if (!query) {
    currentMovies = [];
    renderMovies(currentMovies);
    return;
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (data.Response === "True" && Array.isArray(data.Search)) {
      currentMovies = data.Search;
      renderMovies(currentMovies);
    } else {
      currentMovies = [];
      renderMovies([]);
    }
  } catch (error) {
    currentMovies = [];
    movieResults.innerHTML = '<div class="empty-state">Unable to load movies right now. Please try again.</div>';
    resultCount.textContent = "0 results";
  }
}

searchBtn.addEventListener("click", (event) => {
  event.preventDefault();
  fetchMovies(searchInput.value);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchMovies(searchInput.value);
  }
});

sortFilter.addEventListener("change", () => {
  renderMovies(currentMovies);
});

fetchMovies("movie");