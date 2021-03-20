<template>
  <div class="weather-forecast-daily mt-4" v-if="store.weather">
    <div class="weather-forecast-daily-row">
      <div class="weather-forecast-daily-col" v-for="day in store.weather.daily" :key="day.dt">
        <div class="weather-forecast-daily-date">
          {{ new Date(day.dt * 1000) | moment("ddd") }}
        </div>
        <div class="weather-forecast-daily-icon">
          <img :src="require(`@/assets/weather-icons/${day.weather[0].icon}@2x.png`)"/>
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
</template>

<style lang="scss">
.weather-forecast-daily {

  .weather-forecast-daily-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
    grid-template-rows: auto;
    grid-gap: 10px;

    .weather-forecast-daily-col {
      font-size: 16px;
      text-align: center;
      background-color: #2e7daf;
      color: #ffffff;
      padding: 5px 10px;
      border-radius: 6px;

      .weather-forecast-daily-date {
        font-weight: 500;
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
        justify-content: space-evenly;
        margin: 0 -10px;
        font-size: 14px;

        .weather-forecast-daily-temp-high {
          font-weight: 500;
        }

        .weather-forecast-daily-temp-low {
          font-weight: 300;
        }
      }
    }
  }
}
</style>

<script>
export default {
  name: 'WeatherForecastDaily',
  computed: {
    store () {
      return this.$store.state
    }
  }
}
</script>