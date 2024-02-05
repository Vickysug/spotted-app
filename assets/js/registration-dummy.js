$('#exampleForm').on('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission

    var formData = $(this).serializeArray(); // Use serializeArray to get form data
    var formObject = {}; // Create an empty object to store form data as key-value pairs

    $.each(formData, function(index, value) {
        formObject[value.name] = value.value; // Convert each form field into a key-value pair
    });

    console.log(formObject); // Log the resulting object to the console
});
