<template>
  <div id="app">
    <div id="weather-container" class="vld-parent">
      <loading :active.sync="store.loading"
               :is-full-page="false"></loading>

      <transition name="slide-fade-vertical">
        <div class="offline-message" v-if="!store.online">You are currently offline. Please connect to the internet to get the latest weather information!</div>
      </transition>

      <form id="form-search" @submit.prevent="onSearch">
        <div class="search-input-container">
          <input type="text" id="form-search-input" class="form-control" placeholder="Search" ref="searchInput" v-model="store.searchText" required />
          <button class="btn btn-clear-search" title="Clear search" type="button" v-if="store.searchText.length" @click.prevent="onClearSearch">
            <b-icon icon="x"></b-icon>
          </button>
        </div>

        <button class="btn btn-search-input" title="Search">
          <b-icon icon="search"></b-icon>
        </button>

        <button class="btn btn-search-current-location" title="Get your current location" type="button" @click.prevent="onGetCurrentLocation">
          <b-icon icon="geo-alt-fill"></b-icon>
        </button>
      </form>

      <div class="weather-results mt-3" v-if="store.weather">
        <div class="weather-results-main">
          <div class="weather-results-date">
            {{ new Date(store.weather.current.dt * 1000) | moment("dddd, MMMM Do ") }}
          </div>
          <div class="weather-results-address" v-if="store.geocode">
            {{ store.geocode[0].formatted_address }}
          </div>
          <div class="weather-results-main-card mt-2">
            <div class="weather-results-icon">
              <img :src="'http://openweathermap.org/img/wn/' + store.weather.current.weather[0].icon + '@2x.png'"/>

              <div class="weather-results-main-title">
                {{ store.weather.current.weather[0].main }}
              </div>
            </div>
            <div class="weather-results-main-card-data">
              <div class="weather-results-main-temp">
                {{ Math.round(store.weather.current.temp) }}°C
              </div>
              <div class="weather-results-main-feels-like">
                Feels like {{ Math.round(store.weather.current.feels_like) }}°C
              </div>
            </div>
          </div>
        </div>

        <div class="weather-results-sub">
          <div class="weather-results-sub-item weather-results-sunrise">
            <div class="weather-results-sub-title">
              Sunrise:
            </div>
            <div class="weather-results-sub-data">
              {{ new Date(store.weather.current.sunrise * 1000) | moment("h:mma") }}
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-sunset">
            <div class="weather-results-sub-title">
              Sunset:
            </div>
            <div class="weather-results-sub-data">
              {{ new Date(store.weather.current.sunset * 1000) | moment("h:mma") }}
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-dew-point">
            <div class="weather-results-sub-title">
              Dew Point:
            </div>
            <div class="weather-results-sub-data">
              {{ store.weather.current.dew_point }}°C
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-cloudiness">
            <div class="weather-results-sub-title">
              Cloudiness:
            </div>
            <div class="weather-results-sub-data">
              {{ store.weather.current.clouds }}%
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-uvi">
            <div class="weather-results-sub-title">
              UV Index:
            </div>
            <div class="weather-results-sub-data">
              {{ store.weather.current.uvi }}%
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-humidity">
            <div class="weather-results-sub-title">
              Humidity:
            </div>
            <div class="weather-results-sub-data">
              {{ store.weather.current.humidity }}%
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-pressure">
            <div class="weather-results-sub-title">
              Pressure:
            </div>
            <div class="weather-results-sub-data">
              {{ store.weather.current.pressure }} hPa
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-visibility">
            <div class="weather-results-sub-title">
              Visibility:
            </div>
            <div class="weather-results-sub-data">
              {{ (store.weather.current.visibility / 1000).toFixed(1) }} km
            </div>
          </div>
          <div class="weather-results-sub-item weather-results-wind-speed">
            <div class="weather-results-sub-title">
              Wind Speed:
            </div>
            <div class="weather-results-sub-data">
              {{ (store.weather.current.wind_speed * 3.6).toFixed(1) }} km/h ({{ store.weather.current.wind_deg }} degrees)
            </div>
          </div>
        </div>
      </div>

      <div class="weather-forecast-daily mt-4" v-if="store.weather">
        <div class="weather-forecast-daily-row">
          <div class="weather-forecast-daily-col" v-for="day in store.weather.daily" :key="day.dt">
            <div class="weather-forecast-daily-date">
              {{ new Date(day.dt * 1000) | moment("ddd") }}
            </div>
            <div class="weather-forecast-daily-icon">
              <img :src="'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png'"/>
            </div>
            <div class="weather-forecast-daily-title">
              {{ day.weather[0].main }}
            </div>
            <div class="weather-forecast-daily-temps">
              <div class="weather-forecast-daily-temp-high">
                {{ Math.round(day.temp.max) }}°C
              </div>
              <div class="weather-forecast-daily-temp-low">
                {{ Math.round(day.temp.min) }}°C
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer" v-if="store.weather">
        <a href="javascript:;" @click.prevent="onRefresh" class="last-updated">
          <b-icon icon="arrow-repeat" class="btn-refresh"></b-icon>
          Last updated {{ new Date(store.weather.current.dt * 1000) | moment("dddd, MMMM Do YYYY h:mma") }}
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#weather-container {
  position: relative;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  padding: 30px 30px 50px;

  @media (max-width: 900px) {
    border-radius: 0;
    min-height: 100vh;
  }
}

#form-search {
  display: flex;
  align-items: center;
  font-size: 20px;

  .search-input-container {
    position: relative;
    flex-grow: 1;

    #form-search-input {
      width: 100%;
      font-size: 20px;
      padding: 8px 15px;
      height: 50px;
    }

    .btn-clear-search {
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;

      &:focus {
        box-shadow: none;
      }
    }
  }

  .btn-search-input,
  .btn-search-current-location {
    width: 50px;
    height: 50px;
    background-color: #2e7daf;
    color: #fff;
    margin-left: 15px;
  }
}

.weather-results {
  display: flex;
  justify-content: space-between;

  .weather-results-main {

    .weather-results-date {
      font-size: 14px;
    }

    .weather-results-main-card {
      display: flex;
      align-items: center;

      .weather-results-icon {
        background-color: #2e7daf;
        border-radius: 6px;
        color: #ffffff;
        text-align: center;
        font-size: 20px;
        padding: 0 10px 10px;

        img {
          margin: -10px 0;
        }
      }

      .weather-results-main-card-data {
        padding: 0 20px;

        .weather-results-main-temp {
          font-size: 60px;
          line-height: 1;
        }

        .weather-results-main-feels-like {
        }

        .weather-results-main-title {
        }
      }
    }
  }

  .weather-results-sub {
    font-size: 16px;

    .weather-results-sub-item {
      display: flex;

      .weather-results-sub-title {
        margin-right: 0.5rem;
      }

      .weather-results-sub-data {
        font-weight: 700;
      }

    }
  }
}

.weather-forecast-daily {

  .weather-forecast-daily-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .weather-forecast-daily-col {
      font-size: 16px;
      text-align: center;
      background-color: #2e7daf;
      color: #ffffff;
      padding: 10px 10px;
      border-radius: 6px;

      .weather-forecast-daily-date {
      }

      .weather-forecast-daily-icon {

        img {
          max-width: 75px;
          margin: -10px 0;
        }
      }

      .weather-forecast-daily-title {
      }

      .weather-forecast-daily-temps {
        display: flex;
        justify-content: space-between;

        .weather-forecast-daily-temp-high {
          font-weight: 700;
        }

        .weather-forecast-daily-temp-low {
        }
      }
    }
  }
}

.footer {
  position: absolute;
  bottom: 15px;
  left: 15px;
  line-height: 1;

  .last-updated {
    font-size: 14px;
    color: #666666;
    transition: all 0.3s ease;

    &:hover {
      text-decoration: none;
      color: #000000;
    }
  }
}
</style>

<script>
import Loading from 'vue-loading-overlay'

export default {
  name: 'app',
  components: {
    Loading
  },
  data: () => ({
    searchText: ''
  }),
  computed: {
    store () {
      return this.$store.state
    }
  },
  methods: {
    async refreshWeather () {
      this.$store.dispatch('setLoading', true)
      await this.$store.dispatch('getWeather')
    },
    onGetCurrentLocation () {
      this.getCurrentLocationWeatherData()
    },
    onSearch () {
      console.log('search fired')
    },
    onClearSearch () {
      this.$store.dispatch('setSearchText', '')
      this.$refs.searchInput.focus()
    },
    getCurrentLocationWeatherData () {
      this.$store.dispatch('setLoading', true)

      navigator.geolocation.getCurrentPosition(async pos => {
        this.$store.dispatch('setCoordinates', {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        })

        await this.$store.dispatch('getGeocode')
        await this.$store.dispatch('getWeather')

        this.$store.dispatch('setLoading', false)
      }, () => {
        this.$store.dispatch('setLoading', false)
      })
    }
  },
  mounted () {
    window.addEventListener('online', () => {
      // this.hideOfflineToast()
      this.$store.dispatch('setOnline', true)
    })
    window.addEventListener('offline', () => {
      this.$store.dispatch('setOnline', false)
    })

    this.getCurrentLocationWeatherData()
  }
}
</script>