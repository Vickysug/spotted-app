function serialiseFormData(form) {
  const FormDataArray = form.serializeArray();

  // Create an empty object to store form data
  const FormDataObject = {};

  // Iterate over the serialised array and populate the object
  $.each(FormDataArray, (index, field) => {
    FormDataObject[field.name] = field.value;
  });
  return FormDataObject;
}

function capitaliseFirstLetter(string) {
  // Split the string into an array of words
  const words = string.split(' ');

  // Capitalise the first letter of each word
  const capitalisedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Join the capitalised words back into a single string
  return capitalisedWords.join(' ');
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
