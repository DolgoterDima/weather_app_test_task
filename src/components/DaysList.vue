<template>
  <div class="days-list">
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
      +
    </button>
  </div>
</template>

<script>
import DayCard from "@/components/cards/DayCard.vue";

export default {
  name: "DaysList",

  data() {
    return {
      daysList: [],
      usersCity: "222",
      favoritesList: [],
    };
  },
  components: {
    DayCard,
  },
  computed: {
    isShowAddNewDay() {
      return this.daysList.length < 5;
    },
  },
  methods: {
    getCurrentUserCity() {
      if (navigator.geolocation) {
        const showPosition = (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=en`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              this.daysList.push({ id: Date.now(), city: data.address.city });
            })
            .catch((error) => console.log(error));
        };
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    },
    removeDay(e) {
      this.daysList = this.daysList.filter((item) => item.id !== e);
    },
    addNewDay() {
      this.daysList.push({ id: Date.now(), city: "" });
    },
    addDayToFavorite({ id, city }) {
      /* проверка есть ли город в списке если нет, то добавляем*/
      if (!this.favoritesList.find((item) => item.city === city)) {
        this.favoritesList.push({ id, city });
        localStorage.setItem(
          "favoritesList",
          JSON.stringify(this.favoritesList)
        );
      }
    },
  },
  mounted() {
    /* this.addNewDay()*/

    this.getCurrentUserCity();
  },
};
</script>

<style scoped></style>
