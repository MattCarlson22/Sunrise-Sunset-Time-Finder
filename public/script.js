// script.js

function fetchLocation() {
    let cityName = document.getElementById('locationInput').value;
    let url = `/api/location?cityName=${encodeURIComponent(cityName)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data[0] && data[0].lat && data[0].lon) {
                fetchTimeZone(data[0].lat, data[0].lon)
                    .then(timeZone => fetchSunData(data[0].lat, data[0].lon, timeZone, cityName)) // Pass cityName here
                    .catch(error => alert('Failed to fetch time zone: ' + error.message));
            } else {
                alert('Location not found. Please try a different query.');
            }
        })
        .catch(error => {
            alert('Error fetching location: ' + error.message);
        });
}

function fetchTimeZone(latitude, longitude) { // No cityName needed here
    let url = `/api/timezone?latitude=${latitude}&longitude=${longitude}`;

    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                return data.timeZoneId;  // This is the IANA time zone identifier
            } else {
                throw new Error(data.status);
            }
        });
}

function fetchSunData(latitude, longitude, timeZone, cityName) { // Accept cityName here
    let apiURL = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                displayTimes(data.results.sunrise, data.results.sunset, timeZone, cityName); // Pass cityName here
            } else {
                alert('Could not retrieve sunrise and sunset times.');
            }
        })
        .catch(error => {
            alert('Failed to fetch data: ' + error.message);
        });
}

function displayTimes(sunriseUTC, sunsetUTC, timeZone, cityName) { // Accept cityName here
    let sunriseTime = new Date(sunriseUTC);
    let sunsetTime = new Date(sunsetUTC);
    let options = { timeStyle: 'short', timeZone: timeZone };
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone };

    document.getElementById('locationDisplay').textContent = cityName; // Display the city name
    document.getElementById('dateDisplay').textContent = sunriseTime.toLocaleDateString([], dateOptions);
    document.getElementById('sunriseTime').textContent = "Sunrise: " + sunriseTime.toLocaleTimeString([], options);
    document.getElementById('sunsetTime').textContent = "Sunset: " + sunsetTime.toLocaleTimeString([], options);
}
