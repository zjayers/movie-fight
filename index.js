/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// Init JQuery When Document Is Ready
$(document).ready(() => {
  // Config Functions To Pass To The AutoComplete Box
  const autoCompleteConfig = {
    renderOption(movie) {
      return $(`
      <img src="${movie.Poster === "N/A" ? "" : movie.Poster}" alt="Poster" />
      <p>${movie.Title} (${movie.Year})</p>`);
    },
    inputValue(movie) {
      return movie.Title;
    },
    async fetchData(searchTerm) {
      const response = await axios.get("https://www.omdbapi.com/", {
        params: {
          apikey: "fcabcdc7",
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
    const { Poster, Title, Genre, Plot } = movieDetails;

    // eslint-disable-next-line no-restricted-globals
    const awards = movieDetails.Awards.split(" ").reduce((acc, val) => {
      if (isNaN(val)) {
        return acc;
      }
      return acc + val;
    }, 0);
    const boxOfficeValue = parseInt(
      movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, ""),
      10
    );
    const metaScore = parseInt(movieDetails.Metascore, 10);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""), 10);

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

    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article data-value=${boxOfficeValue} class="notification is-primary">
      <p class="title">${movieDetails.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metaScore} class="notification is-primary">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtitle">imdbRating</p>
    </article>

    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtitle">imdbVotes</p>
    </article>

    `);
  };

  // Function to run comparisons between movies
  const runComparison = () => {
    const $leftSideStats = $("#left-summary .notification");
    const $rightSideStats = $("#right-summary .notification");

    $leftSideStats.each(function (index) {
      const leftStat = $(this);
      const rightStat = $($rightSideStats[index]);

      const leftVal = parseInt(leftStat.data("value"), 10);
      const rightVal = parseInt(rightStat.data("value"), 10);

      if (leftVal > rightVal) {
        rightStat.removeClass("is-primary");
        rightStat.addClass("is-warning");
      } else if (leftVal < rightVal) {
        leftStat.removeClass("is-primary");
        leftStat.addClass("is-warning");
      }
    });
  };

  // Get Movie Data
  let leftMovie;
  let rightMovie;
  const onMovieSelect = async (movie, $summaryElement, side) => {
    const response = await axios.get("https://www.omdbapi.com/", {
      params: {
        apikey: "fcabcdc7",
        i: movie.imdbID,
      },
    });
    $summaryElement.html(createMovieTemplate(response.data));

    if (side === "left") {
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
    $root: $("#left-autocomplete"),
    onOptionSelect(movie) {
      $(".tutorial").addClass("is-hidden");
      onMovieSelect(movie, $("#left-summary"), "left");
    },
  });

  // Right AutoComplete Box
  createAutoComplete({
    ...autoCompleteConfig,
    $root: $("#right-autocomplete"),
    onOptionSelect(movie) {
      $(".tutorial").addClass("is-hidden");
      onMovieSelect(movie, $("#right-summary"), "right");
    },
  });
});
