<template>
  <article class="day-card" :class="isFavoritePage && 'day-card--favorite'">
    <div class="day-card__search" v-if="!cityWeather">
      <span class="day-card__legend">Type city name</span>
      <input
        class="day-card__input"
        type="text"
        @input="getCities"
        v-model="citySearchInput"
      />
      <div
        class="day-card__list"
        v-if="!isCitySearchStart && citiesList.length"
      >
        <div
          class="day-card__list-item"
          v-for="(item, index) in citiesList"
          :key="index"
          @click="
            setCurrentCity(item.name);
            getWeatherByCity(item.name);
          "
        >
          {{ item.name }} |
          {{ item.country.code }}
        </div>
      </div>

      <LoadingComponent
        v-else-if="isCitySearchStart"
        :message="loadingMessage"
      />
      <LoadingComponent
        v-else
        :message="loadingMessage"
        :is-show-loader="false"
      />
    </div>

    <template v-if="cityWeather">
      <div class="day-card__description">
        <div class="day-card__row">
          <button
            type="button"
            @click.stop="addToFavorites(cityWeather.name)"
            class="day-card__button day-card__button--favorite"
          >
            <font-awesome-icon
              v-if="isAddedToFavorites"
              :icon="['solid', 'heart']"
            />
            <font-awesome-icon :icon="['regular', 'heart']" v-else />
          </button>

          <span class="day-card__name">
            {{ cityWeather.name }}
          </span>
          <button
            type="button"
            @click.stop="removeDay(id)"
            class="day-card__button day-card__button--remove"
          >
            <font-awesome-icon :icon="['solid', 'xmark']" />
          </button>
        </div>

        <img
          :src="`http://openweathermap.org/img/wn/${cityWeather.weather[0].icon}@2x.png`"
          :alt="cityWeather.weather[0].description"
          class="day-card__image"
        />
        <span class="day-card__weather-title">
          {{ cityWeather.weather[0].description }}
        </span>

        <div class="day-card__info">
          <span class="day-card__label">
            <font-awesome-icon icon="temperature-high" />
          </span>
          <span class="day-card__value">
            {{ getRoundedCelsiusFromKelvin(cityWeather.main.temp) }} deg</span
          >
        </div>

        <div class="day-card__info">
          <span class="day-card__label">
            <font-awesome-icon icon="wind" />
          </span>
          <span class="day-card__value"> {{ cityWeather.wind.speed }} mps</span>
        </div>

        <div class="day-card__info">
          <span class="day-card__label">
            <font-awesome-icon icon="droplet" />
          </span>
          <span class="day-card__value">
            {{ cityWeather.main.humidity }} humidity
          </span>
        </div>
      </div>
      <div class="day-card__chart">
        <div class="day-card__buttons">
          <button
            @click="setDaysToPaint(1)"
            :v-tooltip="`Show data for ${1}  day/s`"
            class="day-card__button day-card__button--regular"
          >
            1 day
          </button>
          <button
            @click="setDaysToPaint(5)"
            v-tooltip.bottom-left="
              `Show average temperature  <br> data  for ${5}  day/s`
            "
            class="day-card__button day-card__button--regular"
          >
            5 days
          </button>

          <button
            content="Hello"
            v-tippy="{ placement: 'top', arrow: true }"
            class="day-card__button day-card__button--regular"
            @click="setDayPeriodToPaint(dayTime.day)"
          >
            <font-awesome-icon icon="sun" /> Show day data for <br />
            {{ forecastForDays }} day/s
          </button>
          <button
            @click="setDayPeriodToPaint(dayTime.night)"
            class="day-card__button day-card__button--regular"
          >
            <font-awesome-icon icon="moon" /> Show night data for <br />
            {{ forecastForDays }} day/s
          </button>
        </div>

        <canvas class="day-card__canvas" :ref="`myChartId_${this.id}`"></canvas>
      </div>
    </template>
  </article>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { Chart } from "chart.js/auto";
import { EventBus } from "@/event-bus";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far);

const KELVIN_CONST = 273.15; //Kelvin constant
const MAX_LETTERS_COUNT_TO_START_SEARCH_CITY = 2;
const MAX_COUNT_OF_CITIES_TO_SHOW = 5; //count of cities to show during search
const FORECAST_HOURS_PER_DAY = 8; // per day we can get temperature not for every hour, but for every 3 hours.
const MAXIMUM_DAYS_FORECAST = 5; // how many days maximum we need forecast.
/* api required use count in timestamps so we need to count how many maximum days are and multiply  them for count of forecasts per day (8)*/
const MAXIMUM_HOURS_FORECAST = FORECAST_HOURS_PER_DAY * MAXIMUM_DAYS_FORECAST;

/* dictionary */
const labelsForAxis = {
  days: "Days",
  hours: "Hours",
  temperature: "Temperature",
};

export default {
  name: "DayCard",
  props: {
    id: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      default: "",
    },

    isFavoritePage: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      citySearchInput: "",
      citiesList: [],
      cityWeather: "",
      cityWeatherForecast: [],
      isCitySearchStart: false,
      currentCity: "",
      allWeatherData:
        [] /* data for all days. days count  you can change in  MAXIMUM_DAYS_FORECAST.
      we get all the data as much as possible and manipulate it locally so as not to make unnecessary requests */,
      forecastForDays: 1,
      textForXAxis: labelsForAxis.hours,
      textForYAxis: labelsForAxis.temperature,
      loadingMessage: "",
      isAddedToFavorites: false,
    };
  },
  computed: {
    dayTime() {
      return {
        day: "day",
        night: "night",
      };
    },
    getDataForCurrentDaysCount() {
      return this.allWeatherData.slice(
        0,
        FORECAST_HOURS_PER_DAY * this.forecastForDays
      );
    },
    getDataForAverageTemperatureOfEveryDay() {
      const dailyTemperatures = {};

      this.getDataForCurrentDaysCount.forEach((forecast) => {
        // Получаем дату прогноза
        const date = new Date(forecast.dt * 1000);

        // Извлекаем день из даты и форматируем его в формате "YYYY-MM-DD"
        const day = date.toISOString().split("T")[0];

        // Добавляем температуру в список для данного дня
        if (!dailyTemperatures[day]) {
          dailyTemperatures[day] = [];
        }

        dailyTemperatures[day].push(forecast.main.temp);
      });

      return Object.entries(dailyTemperatures).map(([day, temperatures]) => {
        const averageTemperature =
          temperatures.reduce((total, temperature) => total + temperature) /
          temperatures.length;

        const temperature =
          this.getRoundedCelsiusFromKelvin(averageTemperature);
        const hourFromDate = new Date(day).getDate();

        return {
          temp: temperature,
          hour: hourFromDate,
        };
      });
    },
  },
  components: {
    FontAwesomeIcon,
  },
  methods: {
    setDayPeriodToPaint(dayTime = this.dayTime.day) {
      /* we take forecasts for the number of days that was set */

      const formattedWeatherDataToPaint = this.getDataForCurrentDaysCount
        .map((item) => {
          const temperature = this.getRoundedCelsiusFromKelvin(item.main.temp);
          const hourFromDate = new Date(item?.dt_txt).getHours();

          return {
            temp: temperature,
            hour: hourFromDate,
          };
        })
        /*  if a day was passed, then we filter the array and get data only for the day.
         if the night parameter is passed, then we get data for the night time */
        .filter((hour) => {
          const date = new Date();
          date.setHours(hour.hour);

          if (dayTime === this.dayTime.day) {
            return date.getHours() >= 6 && date.getHours() <= 18;
          } else {
            return date.getHours() < 6 || date.getHours() > 18;
          }
        });

      /*  set the names for the axis and draw on the chart */
      this.textForXAxis = labelsForAxis.hours;
      this.paintLineChart(formattedWeatherDataToPaint);
    },

    setDaysToPaint(days = 1) {
      /* set current days count globally  */
      this.forecastForDays = days;

      if (days === 5) {
        /* if we pass 5 days call function for get data for average temperature  and set period in 5 days  */

        this.textForXAxis = labelsForAxis.days;

        this.paintLineChart(this.getDataForAverageTemperatureOfEveryDay);
        return;
      }

      const formattedWeatherDataToPaint = this.getDataForCurrentDaysCount.map(
        (item) => {
          const temperature = this.getRoundedCelsiusFromKelvin(item.main.temp);
          const hourFromDate = new Date(item?.dt_txt).getHours();
          return {
            temp: temperature,
            hour: hourFromDate,
          };
        }
      );

      this.textForXAxis = labelsForAxis.hours;
      this.paintLineChart(formattedWeatherDataToPaint);
    },

    paintLineChart(dataToPaint = []) {
      const canvas = this.$refs[`myChartId_${this.id}`]?.getContext("2d");

      const config = {
        type: "line",

        data: {
          labels: dataToPaint.map((row) => row.hour),
          datasets: [
            {
              label: "Temperature in °C  ",

              data: dataToPaint.map((row) => row.temp),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },

        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: this.textForXAxis,
              },
            },
            y: {
              title: {
                display: true,
                text: this.textForYAxis,
              },
            },
          },
        },
      };

      // check is chart exist  on this canvas. if yes, destroy it
      const existingChart = Chart.getChart(canvas);
      if (existingChart) existingChart.destroy();

      //paint data
      new Chart(canvas, config);

      return null;
    },

    setCurrentCity(city = "") {
      this.currentCity = city;
      this.setFavoriteStatus();
    },

    removeDay() {
      this.$emit("remove", this.id);
    },
    addToFavorites(cityName) {
      this.$emit("addToFavorite", { id: this.id, city: cityName });
    },
    getRoundedCelsiusFromKelvin(degreeInKelvin = KELVIN_CONST) {
      return (degreeInKelvin - KELVIN_CONST).toFixed(2);
    },

    getForecastByCity() {
      /* fetch data for 5 days */
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${this.currentCity}&cnt=${MAXIMUM_HOURS_FORECAST}&appid=${process.env.WEATHER_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.allWeatherData = data.list;
          this.setDaysToPaint(1);
        })
        .catch((error) => {
          console.error(error);
          this.loadingMessage = error;
        });
    },
    getWeatherByCity() {
      this.getForecastByCity();

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.currentCity}&appid=${process.env.WEATHER_API_KEY}`
      )
        .then((response) => response.json())
        .then((data) => {
          this.cityWeather = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    getCities() {
      if (this.citySearchInput.length <= MAX_LETTERS_COUNT_TO_START_SEARCH_CITY)
        return;
      this.isCitySearchStart = true;

      const requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: {
          apikey: process.env.GET_CITY_API_KEY,
        },
      };

      fetch(
        `https://api.apilayer.com/geo/city/name/${this.citySearchInput}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          /* if city was found return array else returned object */
          if (Array.isArray(result)) {
            this.isCitySearchStart = false;
            this.citiesList = result.slice(0, MAX_COUNT_OF_CITIES_TO_SHOW);
          } else {
            this.citiesList = [];
            this.isCitySearchStart = false;
            this.loadingMessage = result.message;
          }
        });
    },

    setFavoriteStatus() {
      const favoritesList =
        JSON.parse(localStorage.getItem("favoritesList")) || [];
      const isCurrentCityInFavorites = favoritesList.find(
        (item) => item.city === this.currentCity
      );

      if (isCurrentCityInFavorites) {
        this.isAddedToFavorites = true;
      }
    },
  },
  mounted() {
    if (this.city) {
      // if city name props exist
      this.currentCity = this.city;
      this.setFavoriteStatus();
      this.getWeatherByCity();
    }
  },
  created() {
    EventBus.$on("added-to-favorites", (id) => {
      if (this.id === id) {
        this.isAddedToFavorites = true;
      }
    });
  },
};
</script>
