import { createRouter, createWebHistory } from 'vue-router';
import Era1774 from '@/views/Era1774.vue';
import Era1869 from '@/views/Era1869.vue';
import Era1898 from '@/views/Era1898.vue';

const routes = [
  { path: '/', redirect: '/era/1774' },
  { 
    path: '/era/1774', 
    name: 'Era1774', 
    component: Era1774
  },
  { 
    path: '/era/1869', 
    name: 'Era1869', 
    component: Era1869
  },
  { 
    path: '/era/1898', 
    name: 'Era1898', 
    component: Era1898
  },
  { 
    path: '/era/:year', 
    redirect: '/era/1774'
  }
];

export default createRouter({
  history: createWebHistory(),
  routes,
});