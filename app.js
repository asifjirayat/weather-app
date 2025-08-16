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
  res.send("Hello! Weather app is running....");
});

app.listen(PORT, () => {
  console.log("Weather app is running on http://localhost:", PORT);
});
