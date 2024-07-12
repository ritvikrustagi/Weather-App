const apiKey = "1e3e8f230b6064d27976e41163a82b77";

navigator.geolocation.getCurrentPosition(async function(position) {
    try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const geoResponse = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${apiKey}`);
        const geoData = await geoResponse.json();
        const cityName = geoData[0].name;

        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?&units=metric&`;
        const weatherResponse = await fetch(weatherUrl + `q=${cityName}&` + `appid=${apiKey}`);
        const weatherData = await weatherResponse.json();

        const cityNameElement = document.getElementById("city-name");
        const temperatureElement = document.getElementById("metric");
        const weatherDescriptionElements = document.querySelectorAll("#weather-main");
        const humidityElement = document.getElementById("humidity");
        const feelsLikeElement = document.getElementById("feels-like");
        const weatherImage = document.querySelector(".weather-icon");
        const weatherImages = document.querySelector(".weather-icons");
        const minTempElement = document.getElementById("temp-min-today");
        const maxTempElement = document.getElementById("temp-max-today");

        cityNameElement.innerHTML = weatherData.city.name;
        temperatureElement.innerHTML = `${Math.floor(weatherData.list[0].main.temp)}°`;
        weatherDescriptionElements[0].innerHTML = weatherData.list[0].weather[0].description;
        weatherDescriptionElements[1].innerHTML = weatherData.list[0].weather[0].description;
        humidityElement.innerHTML = Math.floor(weatherData.list[0].main.humidity);
        feelsLikeElement.innerHTML = Math.floor(weatherData.list[0].main.feels_like);
        minTempElement.innerHTML = `${Math.floor(weatherData.list[0].main.temp_min)}°`;
        maxTempElement.innerHTML = `${Math.floor(weatherData.list[0].main.temp_max)}°`;

        const weatherCondition = weatherData.list[0].weather[0].main.toLowerCase();
        let weatherIconSrc = "";

        switch (weatherCondition) {
            case "rain":
                weatherIconSrc = "img/rain.png";
                break;
            case "clear":
            case "clear sky":
                weatherIconSrc = "img/sun.png";
                break;
            case "snow":
                weatherIconSrc = "img/snow.png";
                break;
            case "clouds":
            case "smoke":
                weatherIconSrc = "img/cloud.png";
                break;
            case "mist":
            case "fog":
                weatherIconSrc = "img/mist.png";
                break;
            case "haze":
                weatherIconSrc = "img/haze.png";
                break;
            default:
                weatherIconSrc = "img/sun.png";
                break;
        }

        weatherImage.src = weatherIconSrc;
        weatherImages.src = weatherIconSrc;

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${weatherData.city.name}&appid=${apiKey}&units=metric`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(forecastData => {
                console.log("5-Day Forecast for", forecastData.city.name);
                renderForecast(forecastData);
            })
            .catch(error => {
                console.error("Error fetching forecast:", error);
            });

        function renderForecast(forecastData) {
            const dailyForecasts = {};
            const forecastContainer = document.getElementById('forecast-box');
            let forecastHTML = "";

            forecastData.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const day = new Date(date).getDay();

                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = {
                        dayOfWeek: dayNames[day],
                        temperature: `${Math.floor(item.main.temp)}°`,
                        description: item.weather[0].description,
                        weatherIcon: item.weather[0].main.toLowerCase()
                    };
                }
            });

            for (const date in dailyForecasts) {
                let iconSrc = "";

                switch (dailyForecasts[date].weatherIcon) {
                    case "rain":
                        iconSrc = "img/rain.png";
                        break;
                    case "clear":
                    case "clear sky":
                        iconSrc = "img/sun.png";
                        break;
                    case "snow":
                        iconSrc = "img/snow.png";
                        break;
                    case "clouds":
                    case "smoke":
                        iconSrc = "img/cloud.png";
                        break;
                    case "mist":
                        iconSrc = "img/mist.png";
                        break;
                    case "haze":
                        iconSrc = "img/haze.png";
                        break;
                    default:
                        iconSrc = "img/sun.png";
                }

                forecastHTML += `
                <div class="weather-forecast-box">
                    <div class="day-weather">
                        <span>${dailyForecasts[date].dayOfWeek}</span>
                    </div>
                    <div class="weather-icon-forecast">
                        <img src="${iconSrc}" />
                    </div>
                    <div class="temp-weather">
                        <span>${dailyForecasts[date].temperature}</span>
                    </div>
                    <div class="weather-main-forecast">${dailyForecasts[date].description}</div>
                </div>`;
            }

            forecastContainer.innerHTML = forecastHTML;
            console.log(forecastData);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}, () => {
    alert("Please turn on your location and refresh the page");
});
