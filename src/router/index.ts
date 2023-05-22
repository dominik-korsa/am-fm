import {createRouter, createWebHashHistory} from 'vue-router';
import HomePage from "@/pages/HomePage.vue";
import CombinedPage from "@/pages/CombinedPage.vue";

const routes = [
  { path: '/', component: HomePage },
  { path: '/combined', component: CombinedPage },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
