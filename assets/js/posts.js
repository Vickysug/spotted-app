/* global postRepository */
function Post(userId, content) {
  this.id = 1;
  this.userId = userId;
  this.content = content;
  this.createdAt = dayjs().unix();
}
