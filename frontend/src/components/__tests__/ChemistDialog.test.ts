import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChemistDialog from '../ChemistDialog.vue'
import { useTimeTravelStore } from '@/store/timeTravel'

// Mock API 呼叫
vi.mock('@/api/chemists', () => ({
  sendMessage: vi.fn().mockResolvedValue({
    user_message: { content: '測試訊息', role: 'user' },
    assistant_message: { content: '這是化學家的回應', role: 'assistant' }
  })
}))

describe('ChemistDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('應該正確顯示化學家資訊', () => {
    const wrapper = mount(ChemistDialog, {
      props: {
        chemist: {
          name: '安東尼·拉瓦錫',
          description: '法國化學家',
          era: 1774
        }
      }
    })

    expect(wrapper.text()).toContain('安東尼·拉瓦錫')
    expect(wrapper.text()).toContain('法國化學家')
  })

  it('應該能發送訊息並顯示回應', async () => {
    const wrapper = mount(ChemistDialog, {
      props: {
        chemist: {
          name: '安東尼·拉瓦錫',
          description: '法國化學家',
          era: 1774
        }
      }
    })

    // 輸入訊息
    await wrapper.find('input[type="text"]').setValue('測試訊息')
    await wrapper.find('button[type="submit"]').trigger('click')

    // 等待 API 回應
    await wrapper.vm.$nextTick()

    // 檢查訊息是否顯示在對話框中
    expect(wrapper.text()).toContain('測試訊息')
    expect(wrapper.text()).toContain('這是化學家的回應')
  })

  it('應該能關閉對話框', async () => {
    const wrapper = mount(ChemistDialog, {
      props: {
        chemist: {
          name: '安東尼·拉瓦錫',
          description: '法國化學家',
          era: 1774
        }
      }
    })

    await wrapper.find('button.close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
}) 