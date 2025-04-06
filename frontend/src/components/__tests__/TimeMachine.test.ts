import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import TimeMachine from '../TimeMachine.vue'
import { useTimeTravelStore } from '@/store/timeTravel'

describe('TimeMachine', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/time/:year', component: {} }
      ]
    })
  })

  it('應該正確切換場景', async () => {
    const wrapper = mount(TimeMachine)
    const store = useTimeTravelStore()

    // 測試切換到 1774 年
    await wrapper.find('[data-test="year-1774"]').trigger('click')
    expect(store.currentYear).toBe(1774)
    expect(wrapper.emitted('year-change')).toBeTruthy()

    // 測試切換到 1869 年
    await wrapper.find('[data-test="year-1869"]').trigger('click')
    expect(store.currentYear).toBe(1869)
    expect(wrapper.emitted('year-change')).toBeTruthy()
  })

  it('應該顯示正確的年份選項', () => {
    const wrapper = mount(TimeMachine)
    const yearOptions = wrapper.findAll('[data-test^="year-"]')
    
    expect(yearOptions).toHaveLength(3) // 假設有 3 個年份選項
    expect(yearOptions[0].text()).toContain('1774')
    expect(yearOptions[1].text()).toContain('1869')
    expect(yearOptions[2].text()).toContain('1898')
  })
}) 