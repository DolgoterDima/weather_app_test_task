import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/weather_app_test_task",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/weather_app_test_task/favorites",
    name: "favorites",

    component: () =>
      import(/* webpackChunkName: "about" */ "@/views/FavoritesView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",

  routes,
  linkExactActiveClass: "nav__link--active",
});

export default router;
