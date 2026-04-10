import { computed, onMounted, ref, watch } from 'vue'

export interface EditorOptions {
	initialValue?: string
	language?: string
	theme?: 'light' | 'dark'
	readOnly?: boolean
	onChange?: (value: string) => void
}

export interface EditorReturn {
	content: ReturnType<typeof ref<string>>
	currentLanguage: ReturnType<typeof ref<string>>
	currentTheme: ReturnType<typeof ref<'light' | 'dark'>>
	isReadOnly: ReturnType<typeof ref<boolean>>
	isReady: ReturnType<typeof ref<boolean>>
	detectedLanguage: ReturnType<typeof computed<string>>
	setContent: (value: string) => void
	getContent: () => string
	reset: () => void
}

export function useEditor(options: EditorOptions = {}): EditorReturn {
	const {
		initialValue = '',
		language = 'vue',
		theme = 'light',
		readOnly = false,
		onChange,
	} = options

	const content = ref(initialValue)
	const currentLanguage = ref(language)
	const currentTheme = ref(theme)
	const isReadOnly = ref(readOnly)
	const isReady = ref(false)

	// Language detection based on content
	const detectedLanguage = computed(() => {
		const value = content.value
		if (value.includes('<template>') || value.includes('<script')) {
			return 'vue'
		}
		if (value.includes('import {') || value.includes('export ')) {
			if (value.includes('.vue') || value.includes('defineComponent')) {
				return 'vue'
			}
			return 'typescript'
		}
		if (value.includes('interface ') || value.includes('type ')) {
			return 'typescript'
		}
		return currentLanguage.value
	})

	// Update content
	function setContent(value: string): void {
		content.value = value
		onChange?.(value)
	}

	// Get content
	function getContent(): string {
		return content.value
	}

	// Reset to initial value
	function reset(): void {
		content.value = initialValue
		onChange?.(initialValue)
	}

	// Watch for external changes
	watch(content, newValue => {
		onChange?.(newValue)
	})

	return {
		content,
		currentLanguage,
		currentTheme,
		isReadOnly,
		isReady,
		detectedLanguage,
		setContent,
		getContent,
		reset,
	}
}

// Syntax highlighting tokens
export const highlightTokens = {
	vue: {
		keywords: ['import', 'from', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'ref', 'reactive', 'computed', 'watch', 'onMounted', 'onUnmounted'],
		tags: ['template', 'script', 'style', 'div', 'span', 'button', 'input', 'form', 'ul', 'li', 'a', 'p', 'h1', 'h2', 'h3'],
		directives: ['v-if', 'v-else', 'v-for', 'v-model', 'v-show', 'v-bind', 'v-on', 'v-slot', 'v-click-outside', 'v-debounce', 'v-throttle', 'v-copy', 'v-focus', 'v-lazy', 'v-permission', 'v-long-press', 'v-hover', 'v-ripple', 'v-scroll', 'v-resize', 'v-intersect', 'v-infinite-scroll', 'v-sticky', 'v-mask', 'v-sanitize', 'v-loading', 'v-visible', 'v-mutation', 'v-tooltip', 'v-draggable', 'v-touch', 'v-image-preview', 'v-truncate', 'v-uppercase', 'v-lowercase', 'v-capitalcase', 'v-number', 'v-money', 'v-trim', 'v-countdown', 'v-watermark', 'v-print', 'v-export', 'v-virtual-list', 'v-pull-refresh', 'v-swipe', 'v-hotkey', 'v-click-delay', 'v-ellipsis', 'v-counter', 'v-progress', 'v-click-wave', 'v-context-menu', 'v-fullscreen', 'v-skeleton', 'v-highlight', 'v-emoji', 'v-pan', 'v-pinch', 'v-rotate-gesture', 'v-blur', 'v-fade', 'v-parallax', 'v-lottie', 'v-typewriter'],
		events: ['@click', '@input', '@change', '@submit', '@scroll', '@focus', '@blur', '@keydown', '@keyup', '@mouseenter', '@mouseleave', '@touchstart', '@touchend', '@copy:success', '@copy:error'],
	},
	typescript: {
		keywords: ['import', 'from', 'export', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'interface', 'type', 'extends', 'implements', 'class', 'public', 'private', 'protected', 'readonly'],
		types: ['string', 'number', 'boolean', 'object', 'any', 'void', 'null', 'undefined', 'never', 'unknown', 'Ref', 'ComputedRef'],
	},
}

// Theme management
export interface EditorThemeReturn {
	theme: ReturnType<typeof ref<'light' | 'dark'>>
	toggleTheme: () => void
	setTheme: (newTheme: 'light' | 'dark') => void
}

export function useEditorTheme(): EditorThemeReturn {
	const theme = ref<'light' | 'dark'>('light')

	function toggleTheme(): void {
		theme.value = theme.value === 'light' ? 'dark' : 'light'
	}

	function setTheme(newTheme: 'light' | 'dark'): void {
		theme.value = newTheme
	}

	// Detect system preference
	onMounted(() => {
		if (typeof window !== 'undefined') {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
			theme.value = prefersDark ? 'dark' : 'light'

			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
				theme.value = e.matches ? 'dark' : 'light'
			})
		}
	})

	return {
		theme,
		toggleTheme,
		setTheme,
	}
}
