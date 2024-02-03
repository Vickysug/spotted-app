const appInitialisationModal = $('#app-initiation');
const initiateEl = $('#initiate');
const inProgressEl = $('#in-progress');

async function handleAppInitialisationModal() {
  try {
    // Removes the initiation element
    initiateEl.remove();
    // Shows the in-progress element
    inProgressEl.removeClass('hidden');

    // Simulates a delay (for demonstration purposes)
    await delay(3000);

    // Sets a flag in localStorage indicating initialisation is done
    localStorage.setItem('initialised', 'true');

    // Hides the message modal
    messageModal.hide();
  } catch (error) {
    // Handles any errors that may occur during the initialisation process
    console.error('Error occurred during app initialisation:', error);
  }
}

async function handleDataInitialisation() {
  try {
    // Fetch users and posts concurrently
    const fetchedUsersPromise = handleFetchingPostsFromApi();
    const fetchedPostsPromise = handleFetchingUsersFromApi();

    // Await both promises
    const [fetchedUsers, fetchedPosts] = await Promise
      .all([fetchedUsersPromise, fetchedPostsPromise]);

    // Show app initialisation modal after both data fetched successfully
    // App initialisation modal
    await handleAppInitialisationModal();

    // Return fetched data
    return { fetchedUsers, fetchedPosts };
  } catch (error) {
    // Handle any errors that occurred during fetching or initialisation
    console.error('Error occurred during data initialisation:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

if (localStorage.getItem('initialised') === 'false' || (!('initialised' in localStorage))) {
  appInitialisationModal.removeClass('hidden');
  messageModal.show();
}

initiateEl.on('click', handleDataInitialisation);
