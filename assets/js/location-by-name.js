const nominatimBaseUrl = 'https://nominatim.openstreetmap.org/search';

// Fetch location data
function fetchLocationData(locationName) {
    const apiUrl = `${nominatimBaseUrl}?q=${encodeURIComponent(locationName)}&format=json`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Location cannot be fetched.`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                console.log('No results found.');
                return;
            }
            // Log the first result's display name and latitude/longitude
            console.log(`Location: ${data[0].display_name}`);
            console.log(`Latitude: ${data[0].lat}, Longitude: ${data[0].lon}`);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
}

// Event listener for the button click
document.getElementById('fetchButton').addEventListener('click', function() {
    const locationName = document.getElementById('locationInput').value;
    if (!locationName) {
        console.log('Please enter a location name.');
        return; 
    }
    fetchLocationData(locationName);
});
