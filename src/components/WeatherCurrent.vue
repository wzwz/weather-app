<template>
  <div class="weather-results mt-3" v-if="store.weather">
    <div class="weather-results-header mb-2">
      <div class="weather-results-header-left">
        <Menu/>
      </div>

      <div class="weather-results-header-right">
        <div class="weather-results-date">
          {{ new Date(store.weather.current.dt * 1000) | moment("dddd, MMMM Do ") }}
        </div>

        <div class="weather-results-address" v-if="store.address">
          {{ store.address }}

          <transition name="fade">
            <b-button
                v-if="isFavorite"
                class="p-0"
                variant="link"
                title="Remove from Favorites"
                @click.prevent="onRemoveFromFavorites(store.address)"
                :disabled="store.offline"
            >
              <b-icon icon="star-fill" variant="warning"></b-icon>
            </b-button>

            <b-button
                v-else
                class="p-0"
                variant="link"
                title="Add to Favorites"
                v-b-modal.addToFavoritesModal
                :disabled="store.offline"
            >
              <b-icon icon="star" variant="warning"></b-icon>
            </b-button>
          </transition>
        </div>
      </div>
    </div>

    <div class="weather-results-row">
      <div class="weather-results-main">
        <div class="weather-results-main-card mt-2">
          <div class="weather-results-icon">
            <img :src="require(`@/assets/weather-icons/${store.weather.current.weather[0].icon}@2x.png`)"/>

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

      <b-row class="weather-results-sub" cols="2">
        <b-col class="weather-results-sub-item weather-results-sunrise">
          <div class="weather-results-sub-title">
            Sunrise:
          </div>

          <div class="weather-results-sub-data">
            {{ new Date(store.weather.current.sunrise * 1000) | moment("h:mma") }}
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-sunset">
          <div class="weather-results-sub-title">
            Sunset:
          </div>

          <div class="weather-results-sub-data">
            {{ new Date(store.weather.current.sunset * 1000) | moment("h:mma") }}
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-dew-point">
          <div class="weather-results-sub-title">
            Dew Point:
          </div>

          <div class="weather-results-sub-data">
            {{ store.weather.current.dew_point.toFixed(1) }}°C
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-cloudiness">
          <div class="weather-results-sub-title">
            Cloudiness:
          </div>

          <div class="weather-results-sub-data">
            {{ store.weather.current.clouds }}%
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-uvi">
          <div class="weather-results-sub-title">
            UV Index:
          </div>

          <div class="weather-results-sub-data">
            {{ store.weather.current.uvi }}%
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-humidity">
          <div class="weather-results-sub-title">
            Humidity:
          </div>

          <div class="weather-results-sub-data">
            {{ store.weather.current.humidity }}%
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-pressure">
          <div class="weather-results-sub-title">
            Pressure:
          </div>

          <div class="weather-results-sub-data">
            {{ store.weather.current.pressure }}hPa
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-visibility">
          <div class="weather-results-sub-title">
            Visibility:
          </div>

          <div class="weather-results-sub-data">
            {{ (store.weather.current.visibility / 1000).toFixed(1) }}km
          </div>
        </b-col>

        <b-col class="weather-results-sub-item weather-results-wind-speed">
          <div class="weather-results-sub-title">
            Wind:
          </div>

          <div class="weather-results-sub-data">
            {{ (store.weather.current.wind_speed * 3.6).toFixed(1) }}km/h
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<style lang="scss">
.weather-results {

  .weather-results-header {
    display: flex;

    .weather-results-header-left {

      .weather-dropdown-menu {
        width: 50px;
        height: 50px;
        background-color: #2e7daf;
        font-size: 24px;
        padding: 0;

        .weather-dropdown-menu-btn {
        }
      }
    }

    .weather-results-header-right {
      margin-left: 15px;
    }
  }

  .weather-results-date {
    font-size: 14px;
  }

  .weather-results-address {
    font-weight: 500;
  }

  .weather-results-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .weather-results-main {

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
      max-width: 400px;
      font-size: 16px;

      .weather-results-sub-item {
        display: flex;
        justify-content: flex-end;

        .weather-results-sub-title {
          margin-right: 5px;
        }

        .weather-results-sub-data {
          font-weight: 500;
        }

      }
    }

    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;

      .weather-results-sub {
        margin-top: 1rem;

        .weather-results-sub-item {
          justify-content: flex-start;

          .weather-results-sub-title {
            margin-right: 5px;
          }

          .weather-results-sub-data {
            font-weight: 700;
          }
        }
      }
    }
  }
}
</style>

<script>
import Menu from "@/components/Menu";

export default {
  name: 'WeatherCurrent',
  components: {
    Menu
  },
  computed: {
    store () {
      return this.$store.state
    },
    isFavorite () {
      return this.$store.state.favorites.find(favorite => favorite.address === this.$store.state.address)
    }
  },
  methods: {
    onRemoveFromFavorites (address) {
      this.$store.dispatch('removeFromFavorites', address)
      this.$toasted.success("Location has been removed from favorites!")
    }
  }
}
</script>