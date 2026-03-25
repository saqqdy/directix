import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局 mock
vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
})))

vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
})))

// Clipboard API mock
vi.stubGlobal('navigator', {
	clipboard: {
		writeText: vi.fn().mockResolvedValue(undefined),
		readText: vi.fn().mockResolvedValue(''),
	},
})

// Vue Test Utils 配置
config.global.stubs = {}
