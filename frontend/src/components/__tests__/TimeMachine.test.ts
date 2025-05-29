import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeMachine from '../TimeMachine.vue'
import { createRouter, createWebHistory } from 'vue-router'

// 模擬 eras 配置
vi.mock('@/config/eras', () => ({
  eras: [
    { id: 1, name: '啟蒙時代', year: 1774, title: '啟蒙時代 - 化學革命' },
    { id: 2, name: '工業革命', year: 1869, title: '工業革命 - 元素週期表' },
    { id: 3, name: '現代化學', year: 1913, title: '現代化學 - 原子結構' }
  ]
}))

describe('TimeMachine', () => {
  let wrapper: any
  let router: any

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
    })

    wrapper = mount(TimeMachine, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
    await wrapper.vm.$nextTick()
  })

  it('應該正確切換場景', async () => {
    const slider = wrapper.find('.year-slider')
    expect(slider.exists()).toBe(true)

    await slider.setValue(1869)
    await wrapper.vm.$nextTick()
    await router.push('/era/1869')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedYear).toBe(1869)
    expect(router.currentRoute.value.path).toBe('/era/1869')
  })

  it('應該顯示正確的年份選項', async () => {
    const yearLabels = wrapper.findAll('.year-label')
    expect(yearLabels).toHaveLength(3)
    expect(yearLabels[0].text()).toBe('1774')
    expect(yearLabels[1].text()).toBe('1869')
    expect(yearLabels[2].text()).toBe('1913')
  })
}) 