import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// 配置全局組件
config.global.components = {
  // 在這裡註冊全局組件
}

// 配置全局指令
config.global.directives = {
  // 在這裡註冊全局指令
}

// 配置全局混入
config.global.mixins = [
  // 在這裡註冊全局混入
]

// 設置全局 fetch mock
global.fetch = vi.fn().mockImplementation((url) => {
  if (url.includes('/api/chemists')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          name: '安東尼·拉瓦錫',
          description: '法國化學家',
          era: 1774
        }
      ])
    })
  }
  if (url.includes('/api/events')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([
        {
          id: 1,
          title: '發現氧氣',
          description: '拉瓦錫發現氧氣',
          year: 1774
        }
      ])
    })
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  })
})

// 設置全局路由 mock
config.global.mocks = {
  $route: {
    path: '/',
    params: {},
    query: {}
  },
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }
}

// 模擬 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 模擬 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) 