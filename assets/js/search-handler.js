/* global debounce */

const searchPostInputEl = $('#search-posts');

// Function to handle search input and filter posts
function searchPosts() {
  // Get the value of the search input field, convert it to lower case
  const query = searchPostInputEl.val().trim().toLowerCase();

  // Cache the jQuery selection for better performance
  const $postItems = $('.post-list-item');

  // Iterate over each post in the post list
  $postItems.each(function () {
    // Get the text content of the current post, convert it to lower case
    const postContent = $(this).text().trim().toLowerCase();

    // Toggle the visibility of the current post based on whether the query matches the post content
    $(this).toggle(postContent.includes(query));
  });
}

// Attach the debounced search handler to the search input field
searchPostInputEl.on('input', debounce(searchPosts, 500));
