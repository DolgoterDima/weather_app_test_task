<template>
  <div class="modal">
    <div class="modal__wrapper" v-click-outside="closeModal">
      <div class="modal__container">
        <div class="modal__header">
          <slot name="header"></slot>
          <button
            @click.stop="closeModal"
            class="modal__button modal__button--close"
          >
            <font-awesome-icon :icon="['solid', 'xmark']" />
          </button>
        </div>
        <div class="modal__body">
          <button
            v-if="currentCardIdToDelete"
            class="modal__button"
            @click.stop="removeDayCard"
          >
            Yes
          </button>
        </div>
        <!--      <div class="modal__footer">
            <slot name="footer"></slot>
          </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far);
import { EventBus } from "@/event-bus";

export default {
  name: "ModalComponent",
  props: {
    currentCardIdToDelete: [Number, Boolean],
  },
  components: {
    FontAwesomeIcon,
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
