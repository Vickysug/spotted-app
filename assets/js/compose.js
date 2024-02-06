/* global serialiseFormData, Post, postRepository,
handleUserLoginModal, securityContext, userRepository, applicationContext, locationRepository */
const quill = new Quill('#editor-container', {
  modules: {
    toolbar: [
      // ['bold', 'italic', 'underline', 'strike'],
    ],
  },
  placeholder: 'Compose an epic...',
  theme: 'bubble',
});

$('.ql-editor').addClass('text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400');

// Represents the text editor container element
const postTextEditor = $('#editor-container');

const postTextEditorEl = $('#editor-container .ql-editor');

// Represents the form for composing a post
const postComposeForm = $('#post-compose');

// Represents the icon element for submitting a post
const postSubmitIconEl = $('#send-post-icon');

// Represents the input field for the post content
const postTextEditorContent = $('input[name="content"]');

// Represents the loading animation element for post submission
const loadingAnimationEl = $('#send-post-loader');

// Represents the button element for submitting a post
const postSubmitButtonEl = $('#post-submit');

// Represents post validation message element
const postValidationMessageEl = $('#post-validation');

// Represents posts rendering animation
const postRenderAnimation = $('.posts-render-animation');

function validatePostComposeForm(content, location) {
  if ($(content).text().trim() === '') {
    postValidationMessageEl.removeClass('hidden');
    postValidationMessageEl.text('Content is empty');

    return false;
  }

  if (location === null) {
    postValidationMessageEl.removeClass('hidden');
    postValidationMessageEl.text('Choose a location');
    return false;
  }

  return true;
}

async function handleDisplayingPostData(content, user) {
  // Get reference to the post list placeholder element
  const placeholderPostListItem = $('.post-list-item[data-placeholder="post-item-component"]');

  // Create a document postListFragment to hold the new dropdown items
  const postListFragment = document.createDocumentFragment();

  const placeholderPostListItemCopy = placeholderPostListItem.clone()
    .removeAttr('data-placeholder')
    .removeClass('hidden');
  placeholderPostListItemCopy.find('.content').first().html(content);
  placeholderPostListItemCopy.find('.user-avatar').first().attr('src', user.avatar);
  placeholderPostListItemCopy.find('.user-display-name').first().text(`${user.firstName} ${user.lastName}`);
  placeholderPostListItemCopy.find('.username').first().text(`@${user.username}`);
  postListFragment.appendChild(placeholderPostListItemCopy[0]);

  $('#post-list').prepend(postListFragment);
}

async function handlePostComposeSubmit(event) {
  try {
    event.preventDefault();

    const authToken = securityContext.getAuthenticationToken();

    if (!authToken) {
      handleUserLoginModal();
      return false;
    }

    const content = postTextEditorEl.html();

    const isFormValidated = validatePostComposeForm(content, applicationContext.resolvedLocation);

    if (!isFormValidated) {
      return false;
    }

    // Gets authenticated user
    const user = userRepository.findUserByUsername(authToken.username);

    if (!user) {
      throw new Error('User not found');
    }

    // Clear text editor and validation message
    postTextEditorEl.html('<p><br></p>');
    postValidationMessageEl.text('').addClass('hidden');

    // Creates and saves the post
    const createdPost = await postRepository.createPost(new Post(user.id, content));
    applicationContext.resolvedLocation.postId = createdPost.id;
    locationRepository.saveLocation(applicationContext.resolvedLocation);

    // Shows loading animation while handling post data
    loadingAnimationEl.removeClass('hidden');
    postSubmitIconEl.addClass('hidden');

    // Simulates delay for loading animation
    await delay(500);

    // Hides loading animation and shows submit icon
    loadingAnimationEl.addClass('hidden');
    postSubmitIconEl.removeClass('hidden');

    // Displays the newly created post
    await handleDisplayingPostData(content, user);
  } catch (error) {
    console.error('Error rendering posts:', error);
  }
}

postComposeForm.on('submit', handlePostComposeSubmit);

async function renderPostList() {
  try {
    // Fetch all posts and users concurrently
    const [allPosts, allUsers] = await Promise.all([postRepository.findAll(), userRepository.findAll()]);

    // Sort posts chronologically
    allPosts.sort((a, b) => a.createdAt - b.createdAt);

    postRenderAnimation.removeClass('hidden');

    await delay(2000);

    // Uses map to handle asynchronous tasks and collects promises
    const displayPostPromises = allPosts.map(async (post) => {
      const user = allUsers.find((user) => user.id === post.userId);
      if (user) {
        // handleDisplayingPostData returns a promise
        await handleDisplayingPostData(post.content, user);
      }
    });

    // Wait for all displayPostPromises to complete
    await Promise.all(displayPostPromises);
    postRenderAnimation.addClass('hidden');
  } catch (error) {
    console.error('Error rendering posts:', error);
  }
}

renderPostList();
