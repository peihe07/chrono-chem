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