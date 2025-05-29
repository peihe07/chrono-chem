import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ChemistDialog from '../ChemistDialog.vue'

const mockChemist = {
  id: 1,
  name: '約瑟夫·普里斯特利',
  description: '發現氧氣的化學家',
  birth_year: 1733,
  death_year: 1804,
  portrait_path: '/portraits/priestley.jpg'
}

describe('ChemistDialog', () => {
  let wrapper: any

  beforeEach(async () => {
    wrapper = mount(ChemistDialog, {
      props: {
        chemist: mockChemist,
        show: true
      }
    })
    await wrapper.vm.$nextTick()
  })

  it('renders properly', async () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.dialog-content').exists()).toBe(true)
  })

  it('displays chemist information correctly', async () => {
    expect(wrapper.find('.dialog-header h2').text()).toBe(mockChemist.name)
    expect(wrapper.find('.chemist-description').text()).toBe(mockChemist.description)
    expect(wrapper.find('.chemist-years').text()).toContain(`${mockChemist.birth_year} - ${mockChemist.death_year}`)
  })

  it('emits close event when close button is clicked', async () => {
    await wrapper.find('.close-button').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('shows portrait image', async () => {
    const portrait = wrapper.find('.chemist-portrait img')
    expect(portrait.exists()).toBe(true)
    expect(portrait.attributes('src')).toBe(mockChemist.portrait_path)
    expect(portrait.attributes('alt')).toBe(mockChemist.name)
  })

  it('hides dialog when show prop is false', async () => {
    await wrapper.setProps({ show: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.dialog-content').exists()).toBe(false)
  })
}) 