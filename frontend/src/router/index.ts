import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import TimeTravelView from '@/views/TimeTravelView.vue';
import { eras } from '@/config/eras';

const routes = [
  { path: '/', redirect: '/era/1774' },
  { 
    path: '/era/:year', 
    name: 'EraView', 
    component: TimeTravelView,
    props: true,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const year = parseInt(to.params.year as string);
      if (eras.some(era => era.year === year)) {
        next();
      } else {
        next('/era/1774');
      }
    }
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});