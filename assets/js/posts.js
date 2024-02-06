/* global postRepository */
function Post(userId, content) {
  this.id = 1;
  this.userId = userId;
  this.content = content;
  this.createdAt = dayjs().unix();
}

const JSON_PLACEHOLDER_POST_API = 'https://jsonplaceholder.typicode.com/posts?_start=0&_limit=20';

function handleFetchingPostsFromApi() {
  return fetch(JSON_PLACEHOLDER_POST_API)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Post cannot be fetched.');
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((post) => {
        const newPost = new Post(post.userId, post.body);
        postRepository.createPost(newPost);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
