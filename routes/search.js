// In your Express route (for example, app.js or routes.js)
const express = require('express');
const router = express.Router();
const Listings = require('../models/listing');  // Import your Listings model
require('dotenv').config();
const mbxGeocoading = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoading({ accessToken: mapToken });

// Route to handle form submission
router.post('/', async (req, res) => {
    console.log("I am in /search");
  const cityName = req.body.city;  // Get city name from form input

  let mapResponce = await geocodingClient.forwardGeocode({
    query: cityName,
    limit: 1
  })
  .send()

  // Get coordinates for the city
  const coordinates = mapResponce.body.features[0].geometry.coordinates;

  if (!coordinates) {
    req.flash('error', 'City not found or invalid.');
    return res.redirect('/search');  // Redirect back to search page
  }

  // Perform geospatial query to find listings near the city
  let lng = coordinates[0];
  let lat = coordinates[1];
  const nearbyListings = await Listings.find({
    geometry: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: 500000,  // Optional: Specify the distance in meters (e.g., 50 km)
      },
    },
  });

  if (nearbyListings.length === 0) {
    req.flash('failure', 'Enter the correct location');
    return res.redirect('/listings');  // Render empty results page
  }

  res.render('listings/index', { allListings: nearbyListings });
});

module.exports = router;