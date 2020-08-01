/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const createAutoComplete = ({
  $root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  $root.html(`
  <label><strong>Search</strong></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">
      </div>
    </div>
  </div>`);

  const $input = $root.find(".input");
  const $dropdown = $root.find(".dropdown");
  const $resultsWrapper = $root.find(".results");

  // Funtion called when entering text into the item input box
  const onInput = async (event) => {
    const items = await fetchData(event.target.value);

    if (!items.length) {
      $dropdown.removeClass("is-active");
      return;
    }

    $resultsWrapper.html("");
    $dropdown.addClass("is-active");
    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      const $option = $("<a></a>");
      $option.addClass("dropdown-item");

      renderOption(item).appendTo($option);
      $option.appendTo($resultsWrapper);

      $option.click(() => {
        $dropdown.removeClass("is-active");
        $input.val(inputValue(item));
        onOptionSelect(item);
      });
    }
  };

  // item Search For Input Box
  $input.keypress(debounce(onInput, 500));

  // item Search Box Close Click Event
  $(document).click((e) => {
    if (!$root.find(e.target).length > 0) {
      $dropdown.removeClass("is-active");
    }
  });
};
