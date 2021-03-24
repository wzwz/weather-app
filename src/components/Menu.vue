<template>
  <div class="weather-menu">
    <b-dropdown
        ref="weatherDropdown"
        toggle-class="weather-dropdown-menu"
        no-caret
    >
      <template #button-content>
        <b-icon class="weather-dropdown-menu-btn" icon="list"></b-icon>
      </template>
      <b-dropdown-item-button v-b-modal.favoritesListModal>
        <b-icon icon="star-fill" variant="warning" class="mr-2"></b-icon>
        Favorites
      </b-dropdown-item-button>
      <b-dropdown-item-button v-if="isFavorite" @click="onRemoveFromFavorites(store.address)">
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
              <b-button size="sm" variant="link" class="pt-0" @click.prevent.stop="onRemoveFromFavorites(favorite.address)">
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
</style>

<script>
export default {
  name: 'Menu',
  computed: {
    store () {
      return this.$store.state
    },
    isFavorite () {
      return this.$store.state.favorites.find(favorite => favorite.address === this.$store.state.address)
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
    onRemoveFromFavorites (address) {
      this.$store.dispatch('removeFromFavorites', address)
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