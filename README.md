# Weather App

A full-stack weather application built with Node.js, Express, Axios, and Vanilla Javascript that displays current weather information for cities around the world.

👉 **Live Demo:** [https://weather-app-lake-one-99.vercel.app/](https://weather-app-lake-one-99.vercel.app/)

## 🌟 Features

- 🌤️ Real-time weather data from WeatherAPI
- 📍 Search for weather in any city
- 📱 Responsive web interface
- 🔍 Recent searches tracking
- ⚡ Fast loading with proper error handling
- 🎨 Beautiful modern UI with smooth animations

## 📁 Project Structure

```bash
weather-app/
├── .env.example
├── .gitignore
├── app.js
├── package-lock.json
├── package.json
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── vercel.json

```

## 🚀 Technologies Used

- Backend: Node.js, Express.js, Axios
- Frontend: HTML, CSS, JavaScript
- API: WeatherAPI (free tier)
- Deployment: Vercel
- Package Management: npm

## Setup Instructions

### Prerequisites

- Node.js (v18.x or higher)
- npm (v8.x or higher)
- WeatherAPI account (free at weatherapi.com)

## 🛠 How to Clone

### 1. Clone the repo:

```bash
git clone https://github.com/asifjirayat/weather-app
cd weather-app
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Create `.env` file with your WeatherAPI key:

```bash
WEATHERAPI_KEY=your_actual_weatherapi_key_here
PORT=3000
```

[Click here to get your Weeather API](https://www.weatherapi.com/)

### 4. Start the development server:

```bash
npm run dev
```

## API Endpoints

- GET / - Home page with search interface
- GET /api/weather/:city - Get weather for specific city
- GET /health - Health check endpoint

## Usage

- Visit the deployed application
- Enter a city name in the search box
- View current weather information including:
- Temperature and feels-like temperature
- Weather conditions and description
- Humidity and wind speed
- Pressure and visibility
- UV index and last updated time

## Environment Variables

```bash
WEATHERAPI_KEY - Your WeatherAPI authentication key
PORT - Server port (defaults to 3000)
```

## 📄 License

ISC License

## Contributing

- Fork the repository
- Create a feature branch
- Commit your changes
- Push to the branch
- Create a Pull Request

## 🙌 Created By

Designed and built with ❤️ by **Asif Jirayat**
