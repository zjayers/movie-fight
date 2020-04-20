/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// Init JQuery When Document Is Ready
$(document).ready(() => {
  // Config Functions To Pass To The AutoComplete Box
  const autoCompleteConfig = {
    renderOption(movie) {
      return $(`
      <img src="${movie.Poster === 'N/A' ? '' : movie.Poster}" alt="Poster" />
      <p>${movie.Title} (${movie.Year})</p>`);
    },
    inputValue(movie) {
      return movie.Title;
    },
    async fetchData(searchTerm) {
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: 'fcabcdc7',
          s: searchTerm,
        },
      });
      // If there is no data on the response, return an empty array
      if (response.data.Error) {
        return [];
      }
      // Returns an array of fetched movies
      return response.data.Search;
    },
  };

  // Create Movie Template HTML
  const createMovieTemplate = (movieDetails) => {
    const {
      Poster, Title, Genre, Plot,
    } = movieDetails;

    return $(`
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${Poster}" alt="Poster"/>
        </p>
      </figure>
      <div class="media-content>
        <div class="content">
          <h1>${Title}</h1>
          <h4>${Genre}</h4>
          <p>${Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">imdbRating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">imdbVotes</p>
    </article>
    `);
  };

  // Function to run comparisons between movies
  const runComparison = () => {

  }

  // Get Movie Data
  let leftMovie;
  let rightMovie;
  const onMovieSelect = async (movie, $summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'fcabcdc7',
        i: movie.imdbID,
      },
    });
    $summaryElement.html(createMovieTemplate(response.data));

    if (side === 'left') {
      leftMovie = response.data;
    } else {
      rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
      runComparison();
    }
  };

  // Left AutoComplete Box
  createAutoComplete({
    ...autoCompleteConfig,
    $root: $('#left-autocomplete'),
    onOptionSelect(movie) {
      $('.tutorial').addClass('is-hidden');
      onMovieSelect(movie, $('#left-summary'), 'left');
    },
  });

  // Right AutoComplete Box
  createAutoComplete({
    ...autoCompleteConfig,
    $root: $('#right-autocomplete'),
    onOptionSelect(movie) {
      $('.tutorial').addClass('is-hidden');
      onMovieSelect(movie, $('#right-summary'), 'right');
    },
  });

});
