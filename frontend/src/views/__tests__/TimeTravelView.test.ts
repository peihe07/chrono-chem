import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TimeTravelView from '../TimeTravelView.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock Three.js Scene
vi.mock('@/threejs/scene', () => ({
  Scene: vi.fn().mockImplementation(() => ({
    loadModel: vi.fn().mockResolvedValue(undefined),
    dispose: vi.fn(),
    addChemist: vi.fn().mockResolvedValue(undefined)
  }))
}));

// Mock API calls
vi.mock('@/api', () => ({
  fetchEvents: vi.fn().mockResolvedValue([]),
  fetchScientists: vi.fn().mockResolvedValue([
    {
      id: 1,
      name: "安東尼·拉瓦錫",
      era: 1,
      description: "法國化學家，被稱為現代化學之父。",
      position: { x: -2, y: 0, z: 0 },
      model_path: "/models/chemists/lavoisier.glb",
      birth_year: 1743,
      death_year: 1827,
      portrait_path: "/images/portraits/lavoisier.jpg",
      discoveries: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ])
}));

describe('TimeTravelView', () => {
  let wrapper: any;
  let router: any;

  beforeEach(() => {
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

    wrapper = mount(TimeTravelView, {
      global: {
        plugins: [router],
        stubs: {
          'TimeSelector': true,
          'ChemistDialog': true
        }
      }
    });
  });

  it('renders properly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.time-travel-view').exists()).toBe(true);
  });

  it('shows loading state when loading', async () => {
    await wrapper.vm.$nextTick();
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.loading-overlay').exists()).toBe(true);
  });

  it('shows error message when error occurs', async () => {
    const errorMessage = '測試錯誤訊息';
    wrapper.vm.error = errorMessage;
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.error-message').text()).toBe(errorMessage);
  });

  it('changes era when TimeSelector emits update', async () => {
    const newEraId = 2;
    await wrapper.findComponent({ name: 'TimeSelector' }).vm.$emit('update:currentEraId', newEraId);
    expect(wrapper.vm.currentEra).toBe(newEraId);
  });

  it('shows chemist dialog when scientist is selected', async () => {
    const testChemist = {
      id: 1,
      name: "安東尼·拉瓦錫",
      era: 1,
      description: "法國化學家，被稱為現代化學之父。"
    };
    
    await wrapper.vm.selectChemist(testChemist);
    expect(wrapper.vm.selectedChemist).toStrictEqual(testChemist);
    expect(wrapper.vm.isDialogCollapsed).toBe(false);
  });
}); 