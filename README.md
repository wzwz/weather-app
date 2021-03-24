# Weather PWA

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## To-Do

- [x] Get device geolocation data
- [x] Use device geolocation data to perform reverse geocoding API request
- [x] Use device geolocation data to perform weather API request
  - [x] Current weather
  - [x] 7 day forecast
- [x] Save weather data for offline use
- [x] Create a UI element that shows up when the user is in offline mode
- [x] Display relevant information
- [x] Mobile responsive layout
- [x] Include a set of icons for offline use
- [x] Cache weather data for offline use
- [x] Disable interactive UI elements that require an internet connection during offline use
- [ ] Option to toggle units between metric and imperial (Celcius and Fahrenheit) 
- [x] Favorites
- [ ] PWA functionality
- [ ] Handle no results case for reverse geocoding API call

## Stretch Objectives

- [ ] Include hourly forecast
- [x] Ability to search for weather in a city
- [x] Ability to save a city to favorites
- [x] Ability to see saved favorites

## Features

- Get weather information based on current time and location
- Get 7-day weather forecast based on current location
- Search for weather in a specific location

## Credits

### Frameworks/libraries used

- Vue.js v2
- VueX
- vuex-persist
- Bootstrap 4
- axios
- Moment.js
- Vue Loading Overlay


### APIs used

- OpenWeatherMap One Call API
- Google Maps Geocoding API