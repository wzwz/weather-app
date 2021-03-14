import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: true,
    offline: !navigator.onLine,
    coordinates: {
      latitude: null,
      longitude: null
    },
    geocode: null,
    weather: null,
    searchText: '',
    locationIcon: 'search',
    units: 'metric'
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

    async getGeocode ({commit, state}) {
      const response = await Vue.axios.get(process.env.VUE_APP_GOOGLE_API_MAPS_GEOCODE_URL, {
        params: {
          latlng: state.coordinates.latitude + ',' + state.coordinates.longitude,
          key: process.env.VUE_APP_GOOGLE_API_KEY
        }
      });
      console.log(response);
      commit('setGeocode', response.data.results)
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
      console.log(response);
      commit('setWeather', response.data)
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

    setGeocode: (state, geocode) => {
      state.geocode = geocode
    },

    setWeather: (state, weather) => {
      state.weather = weather
    }
  }
})
