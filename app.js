require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// API Configuration
const API_KEY = process.env.WEATHERAPI_KEY;
const BASE_URL = "http://api.weatherapi.com/v1/current.json";

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware for JSON parsing
app.use(express.json());

// Serve static files from public directory
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "1d",
  })
);

// Root route: "/" - serve the HTML file properly
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Weather endpoint
app.get("/api/weather/:city", async (req, res) => {
  try {
    const { city } = req.params;

    // Validate if city param is present
    if (!city || city.trim() === "") {
      return res.status(400).json({
        error: "Bad request",
        message: "City parameter is required",
        example: "weather/mumbai",
      });
    }

    // Check if API is configured
    if (!API_KEY) {
      return res.status(500).json({
        error: "API KEY not configured",
        message: "Please add your WeatherAPI to .env file",
        help: "Add WEATHERAPI_KEY=your_actual_key to .env file",
      });
    }

    // Make API request
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: city,
        aqi: "no",
      },
    });

    const data = response.data;

    // Return formatted data
    res.json({
      location: {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        localTime: data.location.localtime, // Fixed: was localTime
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

    // Handle different type of errors
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return res.status(400).json({
          error: "Invalid request",
          message: "Invalid city name or request parameters",
        });
      }

      if (status === 404) {
        return res.status(404).json({
          error: "City not found",
          message: "City not found in WeatherAPI database",
          city: req.params.city,
          suggestion: "Try a different city name",
        });
      }
      if (status === 401) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "Invalid WeatherAPI key",
          help: "Check your API key in .env file",
        });
      }

      // Other API errors
      return res.status(status).json({
        error: "API error",
        message: data.error?.message || "Failed to fetch weather data",
        status: status,
      });
    }

    // Network errors or timeouts
    if (error.code === "ECONNABORTED" || error.code === "ENOTFOUND") {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Could not connect to weather service",
        help: "Please check your internet connection",
      });
    }

    // General network errors
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Connection refused",
        message: "Weather service is not responding",
        help: "Try again later",
      });
    }

    // General error
    res.status(500).json({
      error: "Internal server error",
      message: "Could not process your request",
      details: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!API_KEY,
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  // If it's an API request, return 404
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "API Endpoint Not Found",
      message: `The requested API endpoint ${req.path} does not exist`,
    });
  }
  // Otherwise, serve the HTML (for SPA routing)
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("Weather app is running on http://localhost:", PORT);
  console.log("API Key configured:", API_KEY ? "YES" : "NO");
});
