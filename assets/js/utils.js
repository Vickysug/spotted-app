function capitaliseFirstLetter(string) {
  // Split the string into an array of words
  const words = string.split(' ');

  // Capitalise the first letter of each word
  const capitalisedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the capitalised words back into a single string
  return capitalisedWords.join(' ');
}
