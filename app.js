const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
const citySelect = document.getElementById("citySelect");
const fetchButton = document.getElementById("fetchWeatherButton");
const statusBadge = document.getElementById("statusBadge");
const weatherIcon = document.getElementById("weatherIcon");
const temperatureText = document.getElementById("temperature");
const descriptionText = document.getElementById("description");
const cityNameText = document.getElementById("cityName");
const feelsLikeText = document.getElementById("feelsLike");
const humidityText = document.getElementById("humidity");
const windSpeedText = document.getElementById("windSpeed");
const errorMessage = document.getElementById("errorMessage");

function getWeatherEmoji(iconCode) {
  const prefix = iconCode.slice(0, 2);
  const mapping = {
    "01": "☀️",
    "02": "🌤️",
    "03": "☁️",
    "04": "☁️",
    "09": "🌧️",
    "10": "🌦️",
    "11": "⛈️",
    "13": "❄️",
    "50": "🌫️",
  };
  return mapping[prefix] || "🌥️";
}

function updateStatus(message, isError = false) {
  statusBadge.textContent = message;
  if (isError) {
    statusBadge.style.background = "rgba(255, 127, 141, 0.18)";
    statusBadge.style.color = "#ffb7c2";
  } else {
    statusBadge.style.background = "rgba(101, 209, 255, 0.12)";
    statusBadge.style.color = "#8df3ff";
  }
}

function renderWeather(data) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  weatherIcon.textContent = getWeatherEmoji(iconCode);
  temperatureText.textContent = `${temp}°C`;
  descriptionText.textContent = description.replace(/\b(\w)/g, (char) => char.toUpperCase());
  cityNameText.textContent = `${data.name}, Denmark`;
  feelsLikeText.textContent = `${feelsLike}°C`;
  humidityText.textContent = `${humidity}%`;
  windSpeedText.textContent = `${windSpeed} m/s`;
  errorMessage.textContent = "";
  updateStatus("Weather loaded", false);
}

function displayError(message) {
  errorMessage.textContent = message;
  updateStatus("Unable to load weather", true);
}

async function fetchWeather(city) {
  if (!apiKey || apiKey === "YOUR_OPENWEATHERMAP_API_KEY") {
    displayError("Please add your OpenWeatherMap API key in app.js.");
    return;
  }

  updateStatus("Loading...");
  fetchButton.disabled = true;

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", `${city},DK`);
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", apiKey);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Weather data not available");
    }

    const data = await response.json();
    renderWeather(data);
  } catch (error) {
    displayError(error.message);
  } finally {
    fetchButton.disabled = false;
  }
}

fetchButton.addEventListener("click", () => {
  const city = citySelect.value;
  if (!city) {
    displayError("Select a city before fetching weather.");
    return;
  }
  fetchWeather(city);
});

citySelect.addEventListener("change", () => {
  errorMessage.textContent = "";
  updateStatus("Ready to fetch");
});

updateStatus("Ready to fetch");
