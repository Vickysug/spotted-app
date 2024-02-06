// Function to handle search input and filter posts
function searchPosts() {
    // Get the value of the search input field, convert it to lower case
    var query = $('#search-posts').val().toLowerCase();

    // Iterate over each post in the post list
    $('.post-list-item').each(function() {
        // Get the text content of the current post, convert it to lower case
        var postContent = $(this).text().toLowerCase();

        // Check if the post content includes the query string
        if (postContent.includes(query)) {
            // If it does, show the current post
            $(this).show();
        } else {
            // If it doesn't, hide the current post
            $(this).hide();
        }
    });
}

// Attach the debounced search handler to the search input field
$('#search-posts').on('input', debounce(searchPosts, 500));
