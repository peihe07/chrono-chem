/// <reference types="vitest/globals" />
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('contains the app title', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('ChronoChem')
  })
}) 