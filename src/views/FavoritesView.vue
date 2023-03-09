<template>
  <div class="days-list">
    <span v-if="!favoritesList.length">No cities in favorites</span>
    <DayCard
      class="days-list__item"
      v-for="day in favoritesList"
      :city="day.city"
      :key="day.id"
      :id="day.id"
      :isFavoritePage="true"
      @remove="removeDay"
    />
  </div>
</template>

<script>
import DayCard from "@/components/cards/DayCard.vue";
import { EventBus } from "@/event-bus";

export default {
  name: "FavoritesView",
  components: { DayCard },
  data() {
    return {
      favoritesList: [],
    };
  },
  methods: {
    removeDay(e) {
      EventBus.$emit("open-popup", {
        text: `Do you really want to remove city? `,
        id: e,
      });
    },
  },
  mounted() {
    this.favoritesList = JSON.parse(localStorage.getItem("favoritesList"));
  },
  created() {
    EventBus.$on("delete-card", (id) => {
      const favoritesList =
        JSON.parse(localStorage.getItem("favoritesList")) || [];

      this.favoritesList = favoritesList.filter((item) => item.id !== id);
      localStorage.setItem("favoritesList", JSON.stringify(this.favoritesList));
    });
  },
};
</script>
