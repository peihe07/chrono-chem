import { createRouter, createWebHistory } from 'vue-router';
import TimeTravelView from '@/views/TimeTravelView.vue';
import Privacy from '@/views/Privacy.vue';

const routes = [
  { 
    path: '/', 
    name: 'TimeTravel',
    component: TimeTravelView
  },
  { 
    path: '/era/:year', 
    redirect: '/'
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});