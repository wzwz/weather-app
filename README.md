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
- [ ] Save weather data for offline use
- [x] Create a UI element that shows up when the user is in offline mode
- [ ] Display relevant information
- [ ] Mobile responsive layout
- [ ] Include a set of icons for offline use
- [ ] Cache weather data for offline use

## Stretch Objectives

- [ ] Include hourly forecast
- [ ] Ability to search for weather in a city
- [ ] Ability to save a city to favorites
- [ ] Ability to see saved favorites

## Features

- Get weather information based on current time and location
- Get 7-day weather forecast based on current location

## Credits

### Frameworks/libraries used

- Vue.js v2
- VueX
- Bootstrap 4
- axios
- Moment.js
- Vue Loading Overlay


### APIs used

- OpenWeatherMap One Call API
- Google Maps Geocoding API