<template>
  <div class="modal">
    <div class="modal__wrapper" v-click-outside="closeModal">
      <div class="modal__container">
        <div class="modal__header">
          <slot name="header"></slot>
          <button @click.stop="closeModal" class="modal__button">x</button>
        </div>
        <div class="modal__body">

          <button v-if="currentCardIdToDelete" class="modal__button" @click.stop="removeDayCard">yes</button>
        </div>
        <!--      <div class="modal__footer">
            <slot name="footer"></slot>
          </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/event-bus";

export default {
  name: "ModalComponent",
  props: {
    currentCardIdToDelete: [Number, Boolean],

  },
  methods: {
    removeDayCard() {



      EventBus.$emit("delete-card", this.currentCardIdToDelete);
      this.closeModal();
    },
    closeModal() {
      EventBus.$emit("close-popup");
    },
  },
};
</script>

<style scoped></style>
