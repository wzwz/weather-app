<template>
  <div class="footer" v-if="store.weather">
    <b-link
        href="javascript:;"
        @click.prevent="onRefresh"
        class="last-updated"
        :disabled="store.offline"
    >
      <b-icon icon="arrow-repeat" class="btn-refresh"></b-icon>
      Last updated {{ new Date(store.weather.current.dt * 1000) | moment("dddd, MMMM Do YYYY h:mma") }}
    </b-link>
  </div>
</template>

<style lang="scss">
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

  @media (max-width: 639px) {
    position: static;
    margin-top: 15px;
  }
}
</style>

<script>
export default {
  name: 'Footer',
  computed: {
    store () {
      return this.$store.state
    }
  },
  methods: {
    async onRefresh () {
      this.$store.dispatch('setLoading', true)

      await this.$store.dispatch('getWeather')

      this.$store.dispatch('setLoading', false)
    },
  }
}
</script>