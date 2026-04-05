import { defineDirective, isBrowser } from '@directix/core'

/**
 * Click wave directive options
 * A simplified version of v-ripple with simpler configuration
 */
export interface ClickWaveOptions {
	/**
	 * Wave color
	 * @default 'currentColor'
	 */
	color?: string

	/**
	 * Wave duration in milliseconds
	 * @default 500
	 */
	duration?: number

	/**
	 * Whether to disable wave effect
	 * @default false
	 */
	disabled?: boolean

	/**
	 * Wave size ratio (relative to element's smaller dimension)
	 * @default 1.5
	 */
	sizeRatio?: number
}

/**
 * Directive binding value type
 */
export type ClickWaveBinding = boolean | string | ClickWaveOptions

/**
 * Element state storage
 */
interface ClickWaveState {
	options: ClickWaveOptions
	clickHandler: (e: Event) => void
}

/**
 * Normalize options
 */
function normalizeOptions(binding: ClickWaveBinding | undefined): ClickWaveOptions {
	if (binding === false) {
		return { disabled: true, color: 'currentColor', duration: 500, sizeRatio: 1.5 }
	}

	if (typeof binding === 'string') {
		return { color: binding, duration: 500, sizeRatio: 1.5 }
	}

	const base: ClickWaveOptions = {
		color: 'currentColor',
		duration: 500,
		disabled: false,
		sizeRatio: 1.5,
	}

	return binding && typeof binding === 'object' ? { ...base, ...binding } : base
}

/**
 * Create wave element
 */
function createWave(event: MouseEvent, el: HTMLElement, options: ClickWaveOptions): HTMLSpanElement | null {
	const rect = el.getBoundingClientRect()
	const x = event.clientX - rect.left
	const y = event.clientY - rect.top

	// Calculate wave size based on element dimensions
	const size = Math.min(rect.width, rect.height) * (options.sizeRatio || 1.5)

	const wave = document.createElement('span')

	wave.className = 'v-click-wave__effect'
	wave.style.cssText = `
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    background-color: ${options.color};
    width: ${size}px;
    height: ${size}px;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    transform: scale(0);
    opacity: 0.5;
    z-index: 0;
  `

	return wave
}

/**
 * Animate wave
 */
function animateWave(wave: HTMLElement, options: ClickWaveOptions): void {
	const duration = options.duration || 500

	if (typeof wave.animate === 'function') {
		wave.animate(
			[
				{ transform: 'scale(0)', opacity: 0.5 },
				{ transform: 'scale(1)', opacity: 0 },
			],
			{
				duration,
				easing: 'ease-out',
				fill: 'forwards',
			},
		).onfinish = () => {
			wave.remove()
		}
	} else {
		wave.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`
		// Force reflow
		String(wave.offsetHeight)
		wave.style.transform = 'scale(1)'
		wave.style.opacity = '0'

		setTimeout(() => {
			wave.remove()
		}, duration)
	}
}

/**
 * v-click-wave directive
 * A simplified click wave effect directive
 *
 * @example
 * ```vue
 * <template>
 *   <button v-click-wave>Click me</button>
 *   <button v-click-wave="'rgba(255, 255, 255, 0.3)'">Custom color</button>
 *   <button v-click-wave="{ color: 'red', duration: 400 }">Custom options</button>
 * </template>
 * ```
 */
export const vClickWave = defineDirective<ClickWaveBinding, HTMLElement>({
	name: 'click-wave',
	ssr: false,
	defaults: {
		color: 'currentColor',
		duration: 500,
		disabled: false,
		sizeRatio: 1.5,
	},

	mounted(el, binding) {
		const options = normalizeOptions(binding.value)

		if (options.disabled || !isBrowser()) return

		// Ensure element has proper positioning
		const computedStyle = getComputedStyle(el)

		if (computedStyle.position === 'static') {
			el.style.position = 'relative'
		}

		if (computedStyle.overflow === 'visible') {
			el.style.overflow = 'hidden'
		}

		el.classList.add('v-click-wave')

		const state: ClickWaveState = {
			options,
			clickHandler: (e: Event) => {
				if (state.options.disabled) return

				const mouseEvent = e as MouseEvent
				const wave = createWave(mouseEvent, el, state.options)

				if (wave) {
					el.appendChild(wave)
					animateWave(wave, state.options)
				}
			},
		}

		;(el as any).__clickWave = state

		el.addEventListener('click', state.clickHandler)
	},

	updated(el, binding) {
		const state: ClickWaveState = (el as any).__clickWave

		if (!state) return

		state.options = normalizeOptions(binding.value)
	},

	unmounted(el) {
		const state: ClickWaveState = (el as any).__clickWave

		if (!state) return

		el.removeEventListener('click', state.clickHandler)
		el.classList.remove('v-click-wave')

		delete (el as any).__clickWave
	},
})

export default vClickWave
