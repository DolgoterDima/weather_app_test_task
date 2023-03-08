<template>
  <div id="app" class="app">
    <nav class="nav app__nav">
      <router-link class="nav__link" to="/">Home</router-link>
      <router-link class="nav__link" to="/favorites">Favorites</router-link>
    </nav>
    <ModalComponent
      v-if="isShowModal"

      :currentCardIdToDelete="currentCardToDeleteId"

    >
      <template #header>{{ textForModal }}</template>
    </ModalComponent>

    <router-view />
  </div>
</template>

<script>
import ModalComponent from "@/components/ModalComponent.vue";
import { EventBus } from "@/event-bus";

export default {
  name: "App",
  data() {
    return {
      isShowModal: false,
      textForModal: "",
      currentCardToDeleteId: null,

    };
  },
  components: {
    ModalComponent,
  },
  created() {
    EventBus.$on("open-popup", ({ text, id }) => {
      this.isShowModal = true;
      this.textForModal = text;
      this.currentCardToDeleteId = id;

      });
    EventBus.$on("close-popup", () => {
      this.isShowModal = false;
    });
  },

};
</script>
