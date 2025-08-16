require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// API Configuration
const API_KEY = process.env.WEATHERAPI_KEY;
const BASE_URL = "http://api.weatherapi.com/v1/current.json";

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!API_KEY,
  });
});

app.get("/api/weather/:city", async (req, res) => {
  try {
    const { city } = req.params;

    if (!city || city.trim() === "") {
      return res.status(400).json({
        error: "Bad request",
        message: "City parameter is required",
      });
    }

    if (!API_KEY) {
      return res.status(500).json({
        error: "API KEY not configured",
        message: "Please add your WeatherAPI key",
      });
    }

    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: city,
        aqi: "no",
      },
    });

    const data = response.data;

    res.json({
      location: {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        localTime: data.location.localtime,
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
  } catch (error) {
    console.error("API Error:", error.message);

    if (error.response) {
      const { status, data } = error.response;
      return res.status(status).json({
        error: "API Error",
        message: data.error?.message || "Failed to fetch weather data",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: "Could not process your request",
    });
  }
});

// Handle all other routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Weather app is running on port:", PORT);
});

module.exports = app;
