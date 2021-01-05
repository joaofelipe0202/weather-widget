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
  const currentWeatherInfo = 
  `<h2>Current Conditions</h2>
  <img src="http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png" />
  <div class="current">
    <div class="temp">${Math.round(currentWeather.main.temp - 273)}℃</div>
    <div class="condition">${currentWeather.weather[0].description}</div>
  </div>`;

  currentConditions.insertAdjacentHTML('afterbegin', currentWeatherInfo);
}

navigator.geolocation.getCurrentPosition(position => {
  getCurrentWeatherConditions(position.coords.latitude, position.coords.longitude);
  getTheNext5DaysForecast(position.coords.latitude, position.coords.longitude);
});

const getTheNext5DaysForecast = (lat, lon) => {
  return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        Promise.reject({response: response.status, response: response.statusText});
      }
    })
    .then(weathers => {
      const weathersData = [];
      let forecast = weathers.list.filter(timeSlot => new Date(timeSlot.dt_txt).getDate() !== new Date().getDate());
      forecast.forEach(timeSlot => {
        timeSlot.weekday = new Intl.DateTimeFormat('en-US', { weekday: `long` }).format(new Date(timeSlot.dt_txt));
      });

      for (let x = 0; x < 5; x++) {
        weathersData[weathersData.length] = { 
          day: forecast[0].weekday,
          weathers: forecast.filter(timeSlot => timeSlot.weekday === forecast[0].weekday)
        };

        forecast = forecast.filter(timeSlot => timeSlot.weekday !== weathersData[weathersData.length - 1].day);
      }
      
      return weathersData;
    })
    .then(data => {
      getHighAndLowTemperatures(data);
      update5DaysWeatherConditions(data);
    })
}

const getHighAndLowTemperatures = temperatures => {
  temperatures.forEach(weekDay => {
    weekDay.weathers.forEach(temperature => {
      if (temperature.main['temp_max'] > weekDay.high) {
        weekDay.high = temperature.main['temp_max'];
      }
      if (temperature.main['temp_min'] < weekDay.low) {
        weekDay.low = temperature.main['temp_min'];
      }
    })
  })
}

const update5DaysWeatherConditions = nextWeatherCondition => {
  const nextForecast = document.querySelector('.forecast');

  nextWeatherCondition.forEach(weekDay => {
    const nextWeatherInfo = 
      `<div class="day">
      <h3>${weekDay.day}</h3>
      <img src="http://openweathermap.org/img/wn/${weekDay.weathers[3].weather[0].icon}@2x.png" />
      <div class="description">${weekDay.weathers[3].weather[0].description}</div>
      <div class="temp">
        <span class="high">${Math.round(weekDay.main['temp_max'] - 273)}℃</span>/<span class="low">${Math.round(weekDay.main['temp_min'] - 273)}℃</span>
      </div>`;
    nextForecast.insertAdjacentHTML('afterbegin', nextWeatherInfo);
  })
}