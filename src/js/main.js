const apiKey = '582b05f499f2639f9df696b6c1a8623c';
const days = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
}

navigator.geolocation.getCurrentPosition(position => {
  getCurrentWeatherConditions(position.coords.latitude, position.coords.longitude);
  getTheNext5DaysForecast(position.coords.latitude, position.coords.longitude);
});


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
  const currentWeatherInfo = 
  `<h2>Current Conditions</h2>
  <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" />
  <div class="current">
    <div class="temp">${Math.round(currentWeather.main.temp - 273)}℃</div>
    <div class="condition">${currentWeather.weather[0].description}</div>
  </div>`;

  currentConditions.insertAdjacentHTML('afterbegin', currentWeatherInfo);
}

const getTheNext5DaysForecast = (lat, lon) => {
  return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject({response: response.status, response: response.statusText});
      }
    })
    .then(weatherData => {
      getNext5DaysForecastInfo(weatherData.list);
    })
}

const getNext5DaysForecastInfo = weatherData => {
  const nextForecast = document.querySelector('.forecast');
  let weekDays = [];
  let highTemp = [];
  let lowTemp = [];

  weatherData.forEach(weatherCondition => {
    let currentDay = new Date(weatherCondition.dt_txt);
    if(weekDays[currentDay.toDateString(weatherCondition.dt_txt)] === undefined) {
      weekDays[currentDay.toDateString(weatherCondition.dt_txt)] = [weatherCondition];
      highTemp[currentDay.toDateString(weatherCondition.dt_txt)] = [weatherCondition.main.temp_max];
      lowTemp[currentDay.toDateString(weatherCondition.dt_txt)] = [weatherCondition.main.temp_min];
    } else {
      weekDays[currentDay.toDateString(weatherCondition.dt_txt)].push(weatherCondition);
      highTemp[currentDay.toDateString(weatherCondition.dt_txt)].push(weatherCondition.main.temp_max);
      lowTemp[currentDay.toDateString(weatherCondition.dt_txt)].push(weatherCondition.main.temp_min);
    }
    if (currentDay.toLocaleTimeString() === "12:00:00 PM") {
      const nextWeatherInfo = 
      `<div class="day">
      <h3>${days[currentDay.getDay()]}</h3>
      <img src="http://openweathermap.org/img/wn/${weatherCondition.weather[0].icon}@2x.png" />
      <div class="description">${weatherCondition.weather[0].description}</div>
      <div class="temp">
        <span class="high">${parseInt(highTemp[currentDay.toDateString(weatherCondition.dt_txt)]) - 273}℃</span>/<span class="low">${parseInt((lowTemp[currentDay.toDateString(weatherCondition.dt_txt)])) - 273}℃</span>
      </div>`;
      nextForecast.insertAdjacentHTML('afterbegin', nextWeatherInfo);
    }
  })  
}
