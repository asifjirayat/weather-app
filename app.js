const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = 3000;

// Function to load weather data from JSON file
const loadWeatherData = async () => {
  console.log("Attempting to load weather data....");
  try {
    const data = await fs.readFile(
      path.join(__dirname, "weather.json"),
      "utf-8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading weather data:", error);
    return {};
  }
};

// Global variable to store weather data
let weatherData = {};

// IIFE to Load data when app starts
(async () => {
  weatherData = await loadWeatherData();
  console.log(
    `Loaded ${Object.keys(weatherData).length} cities from weather.json`
  );
})();

app.get("/", (req, res) => {
  res.send(`
    <h1>Weather App</h1>
    <p>Available endpoints:</p>
    <ul>
    <li><a href="/weather/mumbai">/weather/mumbai</a></li>
    <li><a href="/weather/delhi">/weather/delhi</a></li>
    <li><a href="/weather/london">/weather/london</a></li>
    <li><a href="/cities">/cities</a></li>
    </ul>
    `);
});

// Weather endpoint
app.get("/weather/:city", (req, res) => {
  console.log("Weather request for:", req.params.city);

  const { city } = req.params;
  const cityLower = city.toLowerCase();

  // Check if data for city available
  if (weatherData[cityLower]) {
    const data = weatherData[cityLower];
    console.log("Found weather data for city:", city);
    res.json({
      location: {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        localTime: data.location.localTime,
      },
      current: {
        temp_c: data.current.temp_c,
        feelslike_c: data.current.feelslike_c,
        condition: {
          text: data.current.condition.text,
          icon: data.current.condition.icon,
        },
        humidity: data.current.humidity,
        wind_kph: data.current.wind_kph,
        wind_dir: data.current.wind_dir,
        pressure_mb: data.current.pressure_mb,
        vis_km: data.current.vis_km,
        uv: data.current.uv,
        last_updated: data.current.last_updated,
      },
    });
  } else {
    console.log("City not found:", city);
    res.status(404).json({
      error: "City not found",
      message: "City is not in our local database",
    });
  }
});

// List all cities
app.get("/cities", (req, res) => {
  const cities = Object.keys(weatherData);
  console.log("Cities requested:", cities);
  res.json({
    cities: cities,
    count: cities.length,
  });
});

app.listen(PORT, () => {
  console.log("Weather app is running on http://localhost:", PORT);
});
