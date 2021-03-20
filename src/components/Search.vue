<template>
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

    <button class="btn btn-search-current-location" title="Get your current location" type="button" @click.prevent="getCurrentLocationWeatherData">
      <b-icon icon="geo-alt-fill"></b-icon>
    </button>
  </form>
</template>

<style lang="scss">
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
</style>

<script>
export default {
  name: 'Search',
  computed: {
    store () {
      return this.$store.state
    }
  },
  methods: {
    async onSearch () {
      if (!this.$store.state.offline) {
        this.$store.dispatch('setLoading', true)

        await this.$store.dispatch('getGeocodeBySearch')
        await this.$store.dispatch('getWeather')

        this.$store.dispatch('setLoading', false)
      }
    },
    onClearSearch () {
      this.$store.dispatch('setSearchText', '')
      this.$refs.searchInput.focus()
    },
    getCurrentLocationWeatherData () {
      if (!this.$store.state.offline) {
        this.$store.dispatch('setLoading', true)

        navigator.geolocation.getCurrentPosition(async pos => {
          this.$store.dispatch('setCoordinates', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          })

          await this.$store.dispatch('getReverseGeocode')
          await this.$store.dispatch('getWeather')

          this.$store.dispatch('setSearchText', '')
          this.$store.dispatch('setLoading', false)
        }, () => {
          this.$store.dispatch('setLoading', false)
        })
      }
    }
  },
  mounted () {
    this.getCurrentLocationWeatherData()
  }
}
</script>