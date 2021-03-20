<template>
  <transition name="slide-fade-vertical">
    <div class="offline-message" v-if="store.offline">
      <b-icon icon="exclamation-circle-fill"></b-icon>
      You are currently offline. Please connect to the internet to get the latest weather information!
    </div>
  </transition>
</template>

<style lang="scss">
.offline-message {
  font-size: 16px;
  padding: .75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
  border-radius: .25rem;
  color: #721c24;
  background-color: #f8d7da;
}
</style>

<script>
export default {
  name: 'OfflineMessage',
  computed: {
    store () {
      return this.$store.state
    }
  },
  mounted () {
    window.addEventListener('online', () => {
      this.$store.dispatch('setOffline', false)
    })
    window.addEventListener('offline', () => {
      this.$store.dispatch('setOffline', true)
    })
  }
}
</script>