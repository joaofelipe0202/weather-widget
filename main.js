const apiKey = '582b05f499f2639f9df696b6c1a8623c';

const getCurrentWeatherConditions = (lat, lon) => {
  return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject({response: response.status, response: response.statusText});
      }
    })
    .then(currentCondition => updateWeatherConditions(currentCondition));
}

const updateWeatherConditions = currentWeather => {
  const currentConditions = document.querySelector('.current-conditions');
  const info = 
  `<h2>Current Conditions</h2>
  <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" />
  <div class="current">
    <div class="temp">${Math.round(currentWeather.main.temp - 273)}℃</div>
    <div class="condition">${currentWeather.weather[0].description}</div>
  </div>`;

  currentConditions.insertAdjacentHTML('afterbegin', info);
  
}

navigator.geolocation.getCurrentPosition(position => {
  getCurrentWeatherConditions(position.coords.latitude, position.coords.longitude);
});

const getTheNext5DaysForecast = (lat, lon) => {
  const forecast = document.querySelector('.forecast');
}