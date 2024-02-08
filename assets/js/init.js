/* global messageModal, delay,handleFetchingPostsFromApi, User,userRepository,
handleFetchingUsersFromApi, clearTokenFromSessionStorage, renderPostList */
const initiateEl = $('#initiate'); // Element used to initiate data generation.
const inProgressEl = $('#in-progress'); // Element indicating progress of data generation
const appInitialisationModal = $('#app-initiation-modal'); // Modal element for application initialisation

async function handleAppInitialisationModal() {
  try {
    // Removes the initiation element
    initiateEl.remove();
    // Shows the in-progress element
    inProgressEl.removeClass('hidden');

    // Simulates a delay (for demonstration purposes)
    await delay(1000);

    // Sets a flag in localStorage indicating initialisation is done
    localStorage.setItem('initialised', 'true');

    await renderPostList();

    clearTokenFromSessionStorage();

    // Hides the message modal
    messageModal.hide();
    appInitialisationModal.addClass('hidden');
  } catch (error) {
    // Handles any errors that may occur during the initialisation process
    console.error('Error occurred during app initialisation:', error);
  }
}

async function handleDataInitialisation() {
  try {
    const demoUser = new User('Walter Joseph', 'Kovacs', 'demo@demo.com', 'rorschach', '12345', `https://i.pravatar.cc/150?u=${crypto.randomUUID()}`);

    userRepository.createUser(demoUser);

    // Fetch users and posts concurrently
    const fetchedUsersPromise = handleFetchingPostsFromApi();
    const fetchedPostsPromise = handleFetchingUsersFromApi();

    // Awaits both promises
    const [fetchedUsers, fetchedPosts] = await Promise
      .all([fetchedUsersPromise, fetchedPostsPromise]);

    // Shows app initialisation modal after both data fetched successfully
    await handleAppInitialisationModal();

    // Returns fetched data
    return { fetchedUsers, fetchedPosts };
  } catch (error) {
    // Handles any errors that occurred during fetching or initialisation
    console.error('Error occurred during data initialisation:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

if (localStorage.getItem('initialised') === 'false' || (!('initialised' in localStorage))) {
  appInitialisationModal.removeClass('hidden');
  messageModal.show();
}

initiateEl.on('click', handleDataInitialisation);
