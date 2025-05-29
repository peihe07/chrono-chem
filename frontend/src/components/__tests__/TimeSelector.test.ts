import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TimeSelector from '../TimeSelector.vue';
import { createRouter, createWebHistory } from 'vue-router';

// 模擬 eras 配置
vi.mock('@/config/eras', () => ({
  eras: [
    { id: 1, name: '啟蒙時代', start_year: 1700, end_year: 1800, year: 1774, title: '啟蒙時代 - 化學革命' },
    { id: 2, name: '工業革命', start_year: 1800, end_year: 1900, year: 1869, title: '工業革命 - 元素週期表' },
    { id: 3, name: '現代化學', start_year: 1900, end_year: 2000, year: 1913, title: '現代化學 - 原子結構' }
  ]
}));

describe('TimeSelector', () => {
  let wrapper: any;
  let router: any;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/era/:id',
          name: 'era',
          component: { template: '<div>Era View</div>' }
        }
      ]
    });

    wrapper = mount(TimeSelector, {
      props: {
        currentEraId: 1
      },
      global: {
        plugins: [router]
      }
    });

    await router.isReady();
    await wrapper.vm.$nextTick();
  });

  it('renders properly', async () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.time-selector').exists()).toBe(true);
  });

  it('displays all eras', async () => {
    const markers = wrapper.findAll('.time-marker');
    expect(markers).toHaveLength(3);
  });

  it('emits update event when era is selected', async () => {
    const newEraId = 2;
    await wrapper.find('.time-marker:nth-child(2)').trigger('click');
    expect(wrapper.emitted('update:currentEraId')).toBeTruthy();
    expect(wrapper.emitted('update:currentEraId')[0]).toEqual([newEraId]);
  });

  it('highlights current era', async () => {
    const currentMarker = wrapper.find('.time-marker.active');
    expect(currentMarker.exists()).toBe(true);
    expect(currentMarker.classes()).toContain('active');
  });

  it('shows era time range', async () => {
    const yearDisplay = wrapper.find('.year');
    expect(yearDisplay.text()).toBe('1774');
  });
}); 