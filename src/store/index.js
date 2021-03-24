import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({})

export default new Vuex.Store({
  state: {
    loading: true,
    offline: !navigator.onLine,
    coordinates: {
      latitude: null,
      longitude: null
    },
    address: null,
    weather: null,
    searchText: '',
    locationIcon: 'search',
    units: 'metric',
    favorites: [],
    favoritesFilter: '',
    favoriteName: ''
  },
  getters: {
    filteredFavorites: state => {
      let filteredFavorites = state.favorites;
      if (state.favoritesFilter.length) {
        filteredFavorites = filteredFavorites.filter(favorite => favorite.name.includes(state.favoritesFilter))
      }
      return filteredFavorites.sort((a, b) => a.name.localeCompare(b.name))
    }
  },
  actions: {
    setLoading ({commit}, loading) {
      commit('setLoading', loading)
    },
    setOffline ({commit}, offline) {
      commit('setOffline', offline)
    },
    setCoordinates ({commit}, coordinates) {
      commit('setCoordinates', coordinates)
    },
    setSearchText ({commit}, searchText) {
      commit('setSearchText', searchText)
    },
    setLocationIcon ({commit}, locationIcon) {
      commit('setLocationIcon', locationIcon)
    },
    setUnits ({commit}, units) {
      commit('setUnits', units)
    },
    async getGeocodeBySearch ({commit, state}) {
      const response = await Vue.axios.get(process.env.VUE_APP_GOOGLE_API_MAPS_GEOCODE_URL, {
        params: {
          address: state.searchText,
          key: process.env.VUE_APP_GOOGLE_API_KEY
        }
      });

      if (response.data.results.length) {
        commit('setAddress', response.data.results[0].formatted_address)
        commit('setCoordinates', {
          latitude: response.data.results[0].geometry.location.lat,
          longitude: response.data.results[0].geometry.location.lng
        })
        return true;
      } else {
        return false;
      }
    },
    async getReverseGeocode ({commit, state}) {
      const response = await Vue.axios.get(process.env.VUE_APP_GOOGLE_API_MAPS_GEOCODE_URL, {
        params: {
          latlng: state.coordinates.latitude + ',' + state.coordinates.longitude,
          key: process.env.VUE_APP_GOOGLE_API_KEY
        }
      });
      commit('setAddress', response.data.results[0].formatted_address)
    },
    async getWeather ({commit, state}) {
      const response = await Vue.axios.get(process.env.VUE_APP_WEATHER_API_URL, {
        params: {
          lat: state.coordinates.latitude,
          lon: state.coordinates.longitude,
          exclude: "minutely,alert",
          units: "metric",
          appid: process.env.VUE_APP_WEATHER_API_KEY
        }
      });
      commit('setWeather', response.data)
    },
    setFavoriteName ({commit}, favoriteName) {
      commit('setFavoriteName', favoriteName)
    },
    addToFavorites ({commit}, favorite) {
      commit('addToFavorites', favorite)
    },
    removeFromFavorites ({commit}, address) {
      commit('removeFromFavorites', address)
    },
    setFavoritesFilter ({commit}, favoritesFilter) {
      commit('setFavoritesFilter', favoritesFilter)
    },
    selectFavorite ({commit}, favoriteName) {
      commit('selectFavorite', favoriteName)
    }
  },
  mutations: {
    setLoading: (state, loading) => {
      state.loading = loading
    },
    setOffline: (state, offline) => {
      state.offline = offline
    },
    setCoordinates: (state, coordinates) => {
      state.coordinates.latitude = coordinates.latitude
      state.coordinates.longitude = coordinates.longitude
    },
    setSearchText: (state, searchText) => {
      state.searchText = searchText
    },
    setLocationIcon: (state, locationIcon) => {
      state.locationIcon = locationIcon
    },
    setUnits: (state, units) => {
      state.units = units
      localStorage.setItem('units', units)
    },
    setAddress: (state, address) => {
      state.address = address
    },
    setWeather: (state, weather) => {
      state.weather = weather
    },
    setFavoriteName (state, favoriteName) {
      state.favoriteName = favoriteName
    },
    addToFavorites (state, favorite) {
      state.favorites.push(favorite)
    },
    removeFromFavorites (state, address) {
      state.favorites = state.favorites.filter(favorite => favorite.address !== address)
    },
    setFavoritesFilter (state, favoritesFilter) {
      state.favoritesFilter = favoritesFilter
    },
    selectFavorite (state, favoriteName) {
      const selectedFavorite = state.favorites.find(favorite => favorite.name === favoriteName)
      state.coordinates.latitude = selectedFavorite.coordinates.latitude
      state.coordinates.longitude = selectedFavorite.coordinates.longitude
    }
  },
  plugins: [vuexLocal.plugin]
})
