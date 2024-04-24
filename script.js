function fetchLocation() {
    let cityName = document.getElementById('locationInput').value;
    let apiKey = 'pk.4602a5f3c2e4a2de07adca165a1f8a5d';  // Replace 'YOUR_LOCATIONIQ_API_KEY' with your actual API key.
    let url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(cityName)}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data[0] && data[0].lat && data[0].lon) {
                fetchTimeZone(data[0].lat, data[0].lon)
                    .then(timeZone => fetchSunData(data[0].lat, data[0].lon, timeZone))
                    .catch(error => alert('Failed to fetch time zone: ' + error.message));
            } else {
                alert('Location not found. Please try a different query.');
            }
        })
        .catch(error => {
            alert('Error fetching location: ' + error.message);
        });
}

function fetchTimeZone(latitude, longitude) {
    // Replace 'YOUR_GOOGLE_TIMEZONE_API_KEY' with your actual Google Time Zone API key
    let apiKey = 'AIzaSyDfFVCJpAvorR5ziYyE9e5jNa3CWKOST5Q';
    let timestamp = Math.floor(Date.now() / 1000);
    let url = `https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=${timestamp}&key=${apiKey}`;

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

function fetchSunData(latitude, longitude, timeZone) {
    let apiURL = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                displayTimes(data.results.sunrise, data.results.sunset, timeZone);
            } else {
                alert('Could not retrieve sunrise and sunset times.');
            }
        })
        .catch(error => {
            alert('Failed to fetch data: ' + error.message);
        });
}

function displayTimes(sunriseUTC, sunsetUTC, timeZone) {
    let sunriseTime = new Date(sunriseUTC);
    let sunsetTime = new Date(sunsetUTC);
    let options = { timeStyle: 'short', timeZone: timeZone };
    let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone };
    
    document.getElementById('dateDisplay').textContent = sunriseTime.toLocaleDateString([], dateOptions);
    document.getElementById('sunriseTime').textContent = "Sunrise: " + sunriseTime.toLocaleTimeString([], options);
    document.getElementById('sunsetTime').textContent = "Sunset: " + sunsetTime.toLocaleTimeString([], options);
}
