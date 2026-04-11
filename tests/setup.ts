import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Global mocks
vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
})))

// Real MutationObserver mock with proper observe method
class MockMutationObserver {
	private callback: MutationCallback
	private nodes: Set<Node> = new Set()

	constructor(callback: MutationCallback) {
		this.callback = callback
	}

	observe(target: Node, options?: MutationObserverInit): void {
		this.nodes.add(target)
	}

	unobserve(target: Node): void {
		this.nodes.delete(target)
	}

	disconnect(): void {
		this.nodes.clear()
	}

	// Helper to simulate mutations in tests
	simulateMutation(mutations: MutationRecord[]): void {
		this.callback(mutations, this as unknown as MutationObserver)
	}
}

vi.stubGlobal('MutationObserver', MockMutationObserver)

// Real ResizeObserver mock with proper observe method
class MockResizeObserver {
	private callback: ResizeObserverCallback
	private elements: Set<Element> = new Set()

	constructor(callback: ResizeObserverCallback) {
		this.callback = callback
	}

	observe(target: Element, options?: ResizeObserverOptions): void {
		this.elements.add(target)
	}

	unobserve(target: Element): void {
		this.elements.delete(target)
	}

	disconnect(): void {
		this.elements.clear()
	}
}

vi.stubGlobal('ResizeObserver', MockResizeObserver)

// Clipboard API mock
vi.stubGlobal('navigator', {
	clipboard: {
		writeText: vi.fn().mockResolvedValue(undefined),
		readText: vi.fn().mockResolvedValue(''),
	},
})

// Canvas mock for jsdom
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
	font: '',
	fillStyle: '',
	textAlign: '',
	textBaseline: '',
	translate: vi.fn(),
	rotate: vi.fn(),
	fillText: vi.fn(),
	measureText: vi.fn().mockReturnValue({ width: 100 }),
}) as any

HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,mock')

// Touch polyfill for jsdom
class MockTouch implements Touch {
	identifier: number
	target: EventTarget
	clientX: number
	clientY: number
	pageX: number
	pageY: number
	screenX: number
	screenY: number
	radiusX: number
	radiusY: number
	rotationAngle: number
	force: number

	constructor(options: TouchInit) {
		this.identifier = options.identifier ?? 0
		this.target = options.target ?? document.body
		this.clientX = options.clientX ?? 0
		this.clientY = options.clientY ?? 0
		this.pageX = this.clientX
		this.pageY = this.clientY
		this.screenX = this.clientX
		this.screenY = this.clientY
		this.radiusX = 0
		this.radiusY = 0
		this.rotationAngle = 0
		this.force = 0
	}
}

vi.stubGlobal('Touch', MockTouch)

// DOMMatrix mock for jsdom
class MockDOMMatrix {
	a: number = 1
	b: number = 0
	c: number = 0
	d: number = 1
	e: number = 0
	f: number = 0
	m11: number = 1
	m12: number = 0
	m13: number = 0
	m14: number = 0
	m21: number = 0
	m22: number = 1
	m23: number = 0
	m24: number = 0
	m31: number = 0
	m32: number = 0
	m33: number = 1
	m34: number = 0
	m41: number = 0
	m42: number = 0
	m43: number = 0
	m44: number = 1

	constructor(transform?: string) {
		if (transform && transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)') {
			// Parse simple matrix transform
			const match = transform.match(/matrix\(([^)]+)\)/)
			if (match) {
				const values = match[1].split(',').map(parseFloat)
				if (values.length >= 6) {
					this.a = values[0]
					this.b = values[1]
					this.c = values[2]
					this.d = values[3]
					this.e = values[4]
					this.f = values[5]
					this.m11 = values[0]
					this.m12 = values[1]
					this.m21 = values[2]
					this.m22 = values[3]
					this.m41 = values[4]
					this.m42 = values[5]
				}
			}
		}
	}

	scale(sx: number, sy?: number): MockDOMMatrix {
		const result = new MockDOMMatrix()
		result.a = this.a * sx
		result.d = this.d * (sy ?? sx)
		return result
	}

	translate(tx: number, ty: number): MockDOMMatrix {
		const result = new MockDOMMatrix()
		result.e = this.e + tx
		result.f = this.f + ty
		return result
	}

	rotate(angle: number): MockDOMMatrix {
		const rad = angle * (Math.PI / 180)
		const cos = Math.cos(rad)
		const sin = Math.sin(rad)
		const result = new MockDOMMatrix()
		result.a = cos
		result.b = sin
		result.c = -sin
		result.d = cos
		return result
	}

	multiply(other: MockDOMMatrix): MockDOMMatrix {
		const result = new MockDOMMatrix()
		result.a = this.a * other.a + this.c * other.b
		result.b = this.b * other.a + this.d * other.b
		result.c = this.a * other.c + this.c * other.d
		result.d = this.b * other.c + this.d * other.d
		result.e = this.a * other.e + this.c * other.f + this.e
		result.f = this.b * other.e + this.d * other.f + this.f
		return result
	}
}

vi.stubGlobal('DOMMatrix', MockDOMMatrix)

// Vue Test Utils config
config.global.stubs = {}
