const axios = require('axios');

// Replace 'YOUR_MAPBOX_ACCESS_TOKEN' with your actual Mapbox access token
const MAPBOX_ACCESS_TOKEN = 'pk.Token.IhKJI0a8_bCIH9AOVOa_6w';

// Function to get coordinates for a pincode using Mapbox Geocoding API
async function getCoordinates(pincode) {
    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${pincode}.json`, {
            params: {
                access_token: MAPBOX_ACCESS_TOKEN,
                country: 'IN',
                limit: 1
            }
        });

        if (response.data.features.length > 0) {
            const [longitude, latitude] = response.data.features[0].geometry.coordinates;
            return { latitude, longitude };
        } else {
            throw new Error(`No location found for pincode: ${pincode}`);
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
    }
}

// Function to calculate distance between two coordinates using the Haversine formula
function calculateDistance(coord1, coord2) {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(coord2.latitude - coord1.latitude);
    const dLon = toRadians(coord2.longitude - coord1.longitude);
    const lat1 = toRadians(coord1.latitude);
    const lat2 = toRadians(coord2.latitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

// Main function to get the distance between two pincodes
async function getDistanceBetweenPincodes(originPincode, destinationPincode) {
    try {
        const originCoords = await getCoordinates(originPincode);
        const destinationCoords = await getCoordinates(destinationPincode);

        if (originCoords && destinationCoords) {
            const distance = calculateDistance(originCoords, destinationCoords);
            console.log(`Distance between pincode ${originPincode} and ${destinationPincode}: ${distance.toFixed(2)} km`);
        } else {
            console.log('Could not get coordinates for one or both pincodes.');
        }
    } catch (error) {
        console.error('Error calculating distance:', error.message);
    }
}

// Example usage: Replace with actual pincodes
const originPincode = '221001'; 
const destinationPincode = '829122';  

getDistanceBetweenPincodes(originPincode, destinationPincode);
