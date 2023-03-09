import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/scss/index.scss";
import { VTooltip } from "v-tooltip";
import vClickOutside from "vue-click-outside";
import LoadingComponent from "@/components/LoadingComponent.vue";

Vue.component("LoadingComponent", LoadingComponent);
Vue.directive("click-outside", vClickOutside);

Vue.directive("tooltip", VTooltip);
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
