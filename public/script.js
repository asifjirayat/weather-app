// DOM Elements
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDisplay = document.getElementById("weatherDisplay");
const loadingElement = document.getElementById("loading");
const weatherContent = document.getElementById("weatherContent");
const errorMessage = document.getElementById("errorMessage");
const recentSearchesContainer = document.getElementById(
  "recentSearchesContainer"
);

// Weather data elements
const cityNameElement = document.getElementById("cityName");
const locationInfoElement = document.getElementById("locationInfo");
const temperatureElement = document.getElementById("temperature");
const weatherIconElement = document.getElementById("weatherIcon");
const weatherDescriptionElement = document.getElementById("weatherDescription");
const feelsLikeElement = document.getElementById("feelsLike");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("windSpeed");
const pressureElement = document.getElementById("pressure");
const visibilityElement = document.getElementById("visibility");
const uvIndexElement = document.getElementById("uvIndex");
const lastUpdatedElement = document.getElementById("lastUpdated");
const errorMessageText = document.getElementById("errorMessageText");

// Recent searches from localStorage
let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadRecentSearches();
  setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
  searchBtn.addEventListener("click", searchWeather);
  cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchWeather();
    }
  });
}

// Search weather function
async function searchWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  showLoading();

  try {
    const response = await fetch(`/api/weather/${city}`);
    const data = await response.json();

    if (response.ok) {
      displayWeather(data);
      addToRecentSearches(city);
      loadRecentSearches();
    } else {
      showError(data.error || "Failed to fetch weather data");
    }
  } catch (error) {
    showError("Network error: Could not connect to weather service");
    console.error("Error:", error);
  } finally {
    hideLoading();
  }
}

// Display weather data
function displayWeather(data) {
  // Update weather content
  cityNameElement.textContent = data.location.name;
  locationInfoElement.textContent = `${data.location.country}, ${data.location.region}`;
  temperatureElement.textContent = `${data.current.temp_c}°C`;
  weatherIconElement.src = data.current.condition.icon;
  weatherDescriptionElement.textContent = data.current.condition.text;
  feelsLikeElement.textContent = `${data.current.feelslike_c}°C`;
  humidityElement.textContent = `${data.current.humidity}%`;
  windSpeedElement.textContent = `${data.current.wind_kph} km/h`;
  pressureElement.textContent = `${data.current.pressure_mb} mb`;
  visibilityElement.textContent = `${data.current.vis_km} km`;
  uvIndexElement.textContent = data.current.uv;
  lastUpdatedElement.textContent = formatDate(data.current.last_updated);

  // Show weather content and hide loading/error
  weatherContent.classList.remove("hidden");
  loadingElement.classList.add("hidden");
  errorMessage.classList.add("hidden");
}

// Show loading state
function showLoading() {
  loadingElement.classList.remove("hidden");
  weatherContent.classList.add("hidden");
  errorMessage.classList.add("hidden");
}

// Hide loading state
function hideLoading() {
  loadingElement.classList.add("hidden");
}

// Show error message
function showError(message) {
  errorMessageText.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherContent.classList.add("hidden");
  loadingElement.classList.add("hidden");
}

// Add to recent searches
function addToRecentSearches(city) {
  // Remove if already exists
  recentSearches = recentSearches.filter((c) => c !== city);

  // Add to beginning
  recentSearches.unshift(city);

  // Keep only last 5
  if (recentSearches.length > 5) {
    recentSearches = recentSearches.slice(0, 5);
  }

  // Save to localStorage
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

// Load recent searches
function loadRecentSearches() {
  recentSearchesContainer.innerHTML = "";

  if (recentSearches.length === 0) {
    recentSearchesContainer.innerHTML = "<p>No recent searches</p>";
    return;
  }

  recentSearches.forEach((city) => {
    const btn = document.createElement("button");
    btn.className = "recent-search-btn";
    btn.textContent = city;
    btn.addEventListener("click", () => {
      cityInput.value = city;
      searchWeather();
    });
    recentSearchesContainer.appendChild(btn);
  });
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}
