import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global mocks
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

// Vue Test Utils config
config.global.stubs = {}
