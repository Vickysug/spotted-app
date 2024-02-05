/* global handleResolvingReverseGeoCoding, messageModal, delay, locationMapper */
const locationPermissionModal = $('#geocoding-permission-modal');
const locationPermissionAllowButton = $('#location-allow');
const locationPermissionInProgressButton = $('#location-in-progress');
const locationPermissionDismissButton = $('#location-dismiss');
const locationPermissionMessageEl = $('#location-message');
const currentLocationButton = $('#current-location');
const currentLocationToolTipEl = $('#current-location-tooltip');
let resolvedLocation;

async function handleResolvingAddress(latitude, longitude) {
  try {
    const fetchAddressPromise = handleResolvingReverseGeoCoding(latitude, longitude);

    // Awaits getting reverse geocoding location
    const [fetchAddress] = await Promise
      .all([fetchAddressPromise]);

    return fetchAddress;
  } catch (error) {
    // Handles any errors that occurred during getting location
    locationPermissionMessageEl.text(`Error occurred during getting current location:, ${error}`);
    throw error; // Rethrows the error to propagate it to the caller
  }
}

function handleResettingLocationPermissionModal() {
  messageModal.hide();
  locationPermissionMessageEl.text('Spotted wants to access your current location. Tap "Allow" to enable location access.');
  locationPermissionModal.addClass('hidden');
  locationPermissionAllowButton.removeClass('hidden');
  locationPermissionInProgressButton.addClass('hidden');
}

function handleLocationData(data) {
  handleResettingLocationPermissionModal();
  if (data) {
    resolvedLocation = locationMapper(data);
    currentLocationButton.find('svg').first().addClass('fill-blue-600');
    currentLocationToolTipEl.removeClass('hidden').text(data.display_name);
  }
  return locationMapper(data);
}

function locateCurrentLocation() {
  locationPermissionModal.removeClass('hidden');
  messageModal.show();
  async function success(position) {
    const { latitude, longitude } = position.coords;

    await delay(1000);

    locationPermissionMessageEl.text('Resolving your location...');

    await delay(1000);

    handleResolvingAddress(latitude, longitude)
      .then((data) => handleLocationData(data));
  }

  function error() {
    locationPermissionMessageEl.text('Unable to retrieve your location');
  }

  locationPermissionAllowButton.on('click', async () => {
    locationPermissionAllowButton.addClass('hidden');
    locationPermissionInProgressButton.removeClass('hidden');

    await delay(1000);

    if (!navigator.geolocation) {
      locationPermissionMessageEl.text('Geolocation is not supported by your browser');
    } else {
      locationPermissionMessageEl.text('Getting location coordinates...');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });
}

currentLocationButton.on('click', locateCurrentLocation);
locationPermissionDismissButton.on('click', handleResettingLocationPermissionModal);
