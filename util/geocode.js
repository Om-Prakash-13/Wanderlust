require('dotenv').config();
const mbxGeocoading = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoading({ accessToken: mapToken });

let getCityCoordinates = async (cityName) => {
    let mapResponce = await geocodingClient.forwardGeocode({
        query: cityName,
        limit: 1
    })
    .send()

    if (mapResponce.body.features.length === 0) {
        console.log('City not found');
        return null;
    }

    return mapResponce.body.features[0].geometry.coordinates;
}

// getCityCoordinates("New Delih").then(res => console.log(res));
module.exports = getCityCoordinates;