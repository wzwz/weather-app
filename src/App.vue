<template>
  <div id="app">
    <div id="weather-container" class="vld-parent">
      <loading :active.sync="store.loading"
               :is-full-page="false"></loading>
      <OfflineMessage/>
      <Search/>
      <WeatherCurrent/>
      <WeatherForecastDaily/>
      <Footer/>
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
  min-height: 500px;
  padding: 30px 30px 50px;

  @media (max-width: 899px) {
    border-radius: 0;
    min-height: 100vh;
  }

  @media (max-width: 639px) {
    padding: 15px;
  }
}
</style>

<script>
import Loading from 'vue-loading-overlay'
import OfflineMessage from "@/components/OfflineMessage";
import Search from "@/components/Search";
import WeatherCurrent from "@/components/WeatherCurrent";
import WeatherForecastDaily from "@/components/WeatherForecastDaily";
import Footer from "@/components/Footer";

export default {
  name: 'app',
  components: {
    Loading,
    OfflineMessage,
    Search,
    WeatherCurrent,
    WeatherForecastDaily,
    Footer
  },
  computed: {
    store () {
      return this.$store.state
    }
  }
}
</script>