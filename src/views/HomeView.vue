<template>
  <div class="home">
    <div class="days-list">
      <LoadingComponent :message="loadingMessage" v-if="loadingMessage" />
      <DayCard
        class="days-list__item"
        v-for="day in daysList"
        :city="day.city"
        :key="day.id"
        :id="day.id"
        @remove="removeDay"
        @addToFavorite="addDayToFavorite"
      />
      <button class="days-list__add" @click="addNewDay" v-if="isShowAddNewDay">
        <font-awesome-icon icon="plus"  size="xl"  />
      </button>
    </div>
  </div>
</template>

<script>
import DayCard from "@/components/cards/DayCard.vue";
import { mapActions } from "vuex";
import { EventBus } from "@/event-bus";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
library.add(faPlus);

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const MAX_COUNT_OF_FAVORITES = 5;
export default {
  name: "HomeView",

  data() {
    return {
      daysList: [],
      usersCity: "222",
      favoritesList: [],

      loadingMessage: "",
    };
  },
  components: {
    DayCard,
    FontAwesomeIcon
  },
  computed: {
    isShowAddNewDay() {
      return this.daysList.length < MAX_COUNT_OF_FAVORITES;
    },
  },
  methods: {
    ...mapActions(["setDayCardInfo"]),
    getCurrentUserCity() {
      if (navigator.geolocation) {
        this.loadingMessage = "Detecting your current city";
        const showPosition = (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              this.loadingMessage = "";

              this.daysList.push({ id: Date.now(), city: data.address.city });
            })
            .catch((error) => {
              this.loadingMessage = `${error}. Please enter city name manually`;
              setTimeout(() => {
                this.loadingMessage = "";
              }, 5000);
              console.log(`API error ${error}`);
              this.daysList.push({ id: Date.now(), city: "" });
            });
        };
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }

      /* if ( !this.daysList.length){
        this.daysList.push({ id: Date.now(), city: '' });

      }*/
    },
    removeDay(e) {
      EventBus.$emit("open-popup", {
        text: `Do you really want to remove city? `,
        id: e,
      });
      /*
      this.daysList = this.daysList.filter((item) => item.id !== e);
*/
    },
    addNewDay() {
      this.daysList.push({ id: Date.now(), city: "" });
    },
    addDayToFavorite({ id, city }) {
      /* проверка есть ли город в списке и не больше ли 5 городов в списке если нет, то добавляем*/
      const isCityInFavorites = this.favoritesList.find(
        (item) => item.city === city
      );
      const isFavoritesListMoreThenAllowedCount =
        this.favoritesList.length > MAX_COUNT_OF_FAVORITES;

      if (!isCityInFavorites && !isFavoritesListMoreThenAllowedCount) {
        this.favoritesList.push({ id, city });
        localStorage.setItem(
          "favoritesList",
          JSON.stringify(this.favoritesList)
        );

        /* change icon in card to filled heart when it added in favorites list */
        EventBus.$emit("added-to-favorites", id);
      }

      if (isFavoritesListMoreThenAllowedCount) {
        EventBus.$emit("open-popup", {
          text: "You can`t add more then 5 cities ",
          id: false,
        });
      }

      if (isCityInFavorites) {
        EventBus.$emit("open-popup", {
          text: "This city is already in your favorites",
          id: false,
        });
      }
    },
  },
  mounted() {
    /* this.addNewDay()*/
    this.getCurrentUserCity();
    console.log("localStorage", localStorage.getItem("favoritesList"));
    this.favoritesList =
      JSON.parse(localStorage.getItem("favoritesList")) || [];
  },
  created() {
    EventBus.$on("delete-card", (id) => {
      this.daysList = this.daysList.filter((item) => item.id !== id);
    });
  },
};
</script>
