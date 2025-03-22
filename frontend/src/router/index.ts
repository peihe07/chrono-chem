import { createRouter, createWebHistory } from 'vue-router';
import TimeTravelView from '@/views/TimeTravelView.vue';

const routes = [
  { path: '/', redirect: '/era/1' },
  { path: '/era/:id', name: 'EraView', component: TimeTravelView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});