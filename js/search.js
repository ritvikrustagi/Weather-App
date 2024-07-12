const apiKey = "1e3e8f230b6064d27976e41163a82b77";
const searchInput = document.querySelector(".searchinput");

async function fetchWeather(city, state, country) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city},${state},${country}&appid=${apiKey}`);

    if (response.ok) {
        const weatherData = await response.json();
        console.log(weatherData);

        const returnBox = document.querySelector(".return");
        returnBox.style.display = "block";

        const messageBox = document.querySelector(".message");
        messageBox.style.display = "none";

        const errorBox = document.querySelector(".error-message");
        errorBox.style.display = "none";

        const weatherImage = document.querySelector(".weather-img");
        document.querySelector(".city-name").innerHTML = weatherData.name;
        document.querySelector(".weather-temp").innerHTML = Math.floor(weatherData.main.temp) + "°";
        document.querySelector(".wind").innerHTML = Math.floor(weatherData.wind.speed) + " m/s";
        document.querySelector(".pressure").innerHTML = Math.floor(weatherData.main.pressure) + " hPa";
        document.querySelector(".humidity").innerHTML = Math.floor(weatherData.main.humidity) + "%";

        const weatherCondition = weatherData.weather[0].main;
        let weatherIconSrc = "";

        switch (weatherCondition) {
            case "Rain":
                weatherIconSrc = "img/rain.png";
                break;
            case "Clear":
                weatherIconSrc = "img/sun.png";
                break;
            case "Snow":
                weatherIconSrc = "img/snow.png";
                break;
            case "Clouds":
            case "Smoke":
                weatherIconSrc = "img/cloud.png";
                break;
            case "Mist":
            case "Fog":
                weatherIconSrc = "img/mist.png";
                break;
            case "Haze":
                weatherIconSrc = "img/haze.png";
                break;
            default:
                weatherIconSrc = "img/sun.png";
        }

        weatherImage.src = weatherIconSrc;
    } else {
        const returnBox = document.querySelector(".return");
        returnBox.style.display = "none";

        const messageBox = document.querySelector(".message");
        messageBox.style.display = "none";

        const errorBox = document.querySelector(".error-message");
        errorBox.style.display = "block";
    }
}

searchInput.addEventListener('keydown', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
        fetchWeather(searchInput.value);
        console.log("worked");
    }
});
