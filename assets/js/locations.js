// Logging the current coordinates & address to the console
const OPEN_STREET_MAP_REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';

function Location(
  placeId,
  licence,
  osmType,
  osmId,
  lat,
  lon,
  classVal,
  type,
  placeRank,
  importance,
  addressType,
  name,
  displayName,
  address,
  boundingBox,
) {
  this.postId = null;
  this.id = placeId;
  this.licence = licence;
  this.osmType = osmType;
  this.osmId = osmId;
  this.lat = lat;
  this.lon = lon;
  this.classVal = classVal;
  this.type = type;
  this.placeRank = placeRank;
  this.importance = importance;
  this.addressType = addressType;
  this.name = name;
  this.displayName = displayName;
  this.address = address;
  this.boundingBox = boundingBox;
}

function locationMapper(addressData) {
  return new Location(
    addressData.place_id,
    addressData.licence,
    addressData.osm_type,
    addressData.osm_id,
    addressData.lat,
    addressData.lon,
    addressData.class,
    addressData.type,
    addressData.place_rank,
    addressData.importance,
    addressData.addresstype,
    addressData.name,
    addressData.display_name,
    addressData.address,
    addressData.boundingbox,
  );
}

function handleResolvingReverseGeoCoding(latitude, longitude) {
  return fetch(`${OPEN_STREET_MAP_REVERSE_GEOCODING_API}?lat=${latitude}&lon=${longitude}&format=json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Location cannot be accessed');
      }
      return response.json();
    })
    .then((data) => data)
    .catch((error) => console.error('Error:', error));
}
