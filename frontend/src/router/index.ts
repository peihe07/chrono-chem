import { createRouter, createWebHistory } from 'vue-router';
import TimeTravelView from '@/views/TimeTravelView.vue';

const routes = [
  { 
    path: '/', 
    name: 'TimeTravel',
    component: TimeTravelView
  },
  { 
    path: '/era/:year', 
    redirect: '/'
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});