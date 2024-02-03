// Logging the current coordinates & address to the console
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    const nominatimBaseUrl = 'https://nominatim.openstreetmap.org/reverse';
    const apiUrl = `${nominatimBaseUrl}?lat=${latitude}&lon=${longitude}&format=json`;
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    console.log('Address:', data.display_name);
    })
    .catch(error => console.error('Error:', error))
});

// Displaying coordinates and the link on the HTML page
function determineCurrentLocation() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");
  
    mapLink.href = "";
    mapLink.textContent = "";
  
    function success(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
    
      status.textContent = "";
      mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }
  
    function error() {
      status.textContent = "Unable to retrieve your location";
    }
  
    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser";
    } else {
      status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }
  
  document.querySelector("#find-me").addEventListener("click", determineCurrentLocation);
