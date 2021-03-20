<template>
  <div class="weather-results mt-3" v-if="store.weather">
    <div class="weather-results-header mb-2">
      <div class="weather-results-header-left">
        <b-dropdown
            ref="weatherDropdown"
            toggle-class="weather-dropdown-menu"
            no-caret
            :disabled="store.offline"
        >
          <template #button-content>
            <b-icon class="weather-dropdown-menu-btn" icon="list"></b-icon>
          </template>
          <b-dropdown-item-button v-b-modal.favoritesListModal>
            <b-icon icon="star-fill" variant="warning" class="mr-2"></b-icon>
            Favorites
          </b-dropdown-item-button>
          <b-dropdown-item-button v-if="isFavorite" @click="onRemoveFromFavorites">
            <b-icon icon="dash-circle-fill" variant="danger" class="mr-2"></b-icon>
            Remove from Favorites
          </b-dropdown-item-button>
          <b-dropdown-item-button v-else v-b-modal.addToFavoritesModal>
            <b-icon icon="plus-circle-fill" variant="success" class="mr-2"></b-icon>
            Add to Favorites
          </b-dropdown-item-button>
        </b-dropdown>

        <b-modal
            id="addToFavoritesModal"
            ref="addToFavoritesModal"
            title="Add to Favorites"
            header-text-variant="light"
            centered
            header-bg-variant="primary"
            header-border-variant="light"
            footer-border-variant="light"
            @show="resetAddToFavoritesModal"
            @hidden="resetAddToFavoritesModal"
            @ok="onAddToFavoritesSubmit"
            ok-title="Save"
        >
          <form @submit.stop.prevent="onAddToFavoritesSubmit">
            <b-form-group
                label="Name"
                label-for="form-addToFavorites-name"
            >
              <b-form-input
                  id="form-addToFavorites-name"
                  ref="form-addToFavorites-name"
                  v-model="store.favoriteName"
                  required
                  autofocus
              ></b-form-input>
            </b-form-group>
            <b-form-group
                label="Address"
                label-for="form-addToFavorites-address"
            >
              <b-form-input
                  id="form-addToFavorites-address"
                  v-model="store.address"
                  readonly
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" class="d-none"></b-button>
          </form>
        </b-modal>

        <b-modal
            id="favoritesListModal"
            ref="favoritesListModal"
            title="Favorites"
            header-text-variant="light"
            centered
            header-bg-variant="primary"
            header-border-variant="light"
            hide-footer
        >
          <div v-if="store.favorites.length">
            <b-form-input v-model="store.favoritesFilter" placeholder="Search favorites" class="mb-3"></b-form-input>
            <b-list-group v-if="this.$store.getters.filteredFavorites.length" class="weather-favorites-list">
              <b-list-group-item button v-for="favorite in this.$store.getters.filteredFavorites" :key="favorite.name" @click="onSelectFavorite(favorite.name)">
                <div class="d-flex justify-content-between">
                  <h5>{{ favorite.name }}</h5>
                  <b-button size="sm" variant="link" class="pt-0" @click.prevent.stop="onRemoveFromFavoritesByName(favorite.name)">
                    <b-icon icon="trash" variant="danger" title="Remove from Favorites"></b-icon>
                  </b-button>
                </div>
                <div>{{ favorite.address }}</div>
              </b-list-group-item>
            </b-list-group>
            <div v-else class="text-center p-3">
              There are no favorites that match your search terms!
            </div>
          </div>
          <div v-else class="text-center p-3">
            You have not added any locations as favorites yet!
          </div>
        </b-modal>
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
                @click.prevent="onRemoveFromFavorites"
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
#favoritesListModal {

  .modal-body {
    padding-bottom: 0;

    .weather-favorites-list {
      max-height: 400px;
      overflow-y: scroll;
      margin: 0 -16px;
    }
  }
}

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
export default {
  name: 'WeatherCurrent',
  computed: {
    store () {
      return this.$store.state
    },
    isFavorite () {
      return this.$store.state.favorites.find(favorite => favorite.coordinates.latitude === this.$store.state.coordinates.latitude && favorite.coordinates.longitude === this.$store.state.coordinates.longitude)
    },
    filteredFavorites () {
      const filteredFavorites = this.$store.state.favorites;
      return filteredFavorites.sort((a, b) => a.name > b.name)
    }
  },
  methods: {
    resetAddToFavoritesModal () {
      this.$store.dispatch('setFavoriteName', '')
    },
    onAddToFavoritesSubmit () {
      const duplicateNameCheck = this.$store.state.favorites.find(favorite => favorite.name === this.$store.state.favoriteName.trim())
      const duplicateCoordinatesCheck = this.$store.state.favorites.find(favorite => favorite.coordinates.latitude === this.$store.state.coordinates.latitude && favorite.coordinates.longitude === this.$store.state.coordinates.longitude)

      if (duplicateNameCheck) {
        this.$toasted.error("This name is already in use. Please choose another!")
      } else if (duplicateCoordinatesCheck) {
        this.$toasted.error("This location is already saved as a favorite!")
      } else {
        this.$store.dispatch('addToFavorites', {
          name: this.$store.state.favoriteName.trim(),
          address: this.$store.state.address,
          coordinates: {
            latitude: this.$store.state.coordinates.latitude,
            longitude: this.$store.state.coordinates.longitude
          }
        })
        this.$refs.addToFavoritesModal.hide();
        this.$toasted.success("Location has been added as a favorite!")
      }
    },
    onRemoveFromFavorites () {
      this.$store.dispatch('removeFromFavorites')
      this.$toasted.success("Location has been removed from favorites!")
    },
    onRemoveFromFavoritesByName (favoriteName) {
      this.$store.dispatch('removeFromFavoritesByName', favoriteName)
      this.$toasted.success("Location has been removed from favorites!")
    },
    async onSelectFavorite (favoriteName) {
      this.$refs.favoritesListModal.hide();
      this.$store.dispatch('setLoading', true)
      this.$store.dispatch('setSearchText', '')
      this.$store.dispatch('selectFavorite', favoriteName)

      await this.$store.dispatch('getReverseGeocode')
      await this.$store.dispatch('getWeather')

      this.$store.dispatch('setLoading', false)
    }
  }
}
</script>