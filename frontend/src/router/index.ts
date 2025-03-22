import { createRouter, createWebHistory } from 'vue-router';
import EraView from '@/views/EraView.vue';

const routes = [
  { path: '/', redirect: '/era/1774' },
  { path: '/era/:id', name: 'EraView', component: EraView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});