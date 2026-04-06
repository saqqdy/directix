/**
 * Shared utilities for number and money formatting directives
 */

import { clamp } from '@directix/shared'

/**
 * Base options shared by number and money formatting
 */
export interface NumberFormatOptions {
	/** Number of decimal places */
	precision?: number
	/** Thousands separator */
	separator?: string
	/** Decimal separator */
	decimal?: string
	/** Whether to allow negative numbers @default true */
	allowNegative?: boolean
	/** Minimum value */
	min?: number
	/** Maximum value */
	max?: number
}

/**
 * Format number to string with thousands separator
 */
export function formatNumber(value: number, options: NumberFormatOptions): string {
	const { precision = 0, separator = ',', decimal = '.', prefix = '', suffix = '' } = options as any

	const fixed = value.toFixed(precision)
	const [intPart, decPart] = fixed.split('.')

	// Add thousands separator to integer part
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

	let result = formattedInt

	if (precision > 0 && decPart) {
		result += decimal + decPart
	}

	return prefix + result + suffix
}

/**
 * Parse string to number, removing non-numeric characters
 */
export function parseToNumber(value: string, decimal: string): number | null {
	const cleaned = value.replace(/[^\d.-]/g, '').replace(decimal, '.')
	const num = Number.parseFloat(cleaned)

	return isNaN(num) ? null : num
}

/**
 * Clamp value within min/max bounds
 */
export function clampValue(value: number, options: NumberFormatOptions): number {
	let result = value

	// allowNegative defaults to true if not specified
	const allowNegative = options.allowNegative ?? true

	if (!allowNegative && result < 0) {
		result = Math.abs(result)
	}

	return clamp(result, options.min, options.max)
}

/**
 * Calculate cursor position after formatting
 * Preserves cursor position relative to digit count
 */
export function calculateCursorPosition(
	rawValue: string,
	formatted: string,
	cursorPos: number,
	startOffset: number = 0,
): number {
	// Count digits before cursor in old value
	let digitsBeforeCursor = 0,
		// Find position after same number of digits in new value
		digitCount = 0

	for (let i = 0; i < cursorPos && i < rawValue.length; i++) {
		if (/\d/.test(rawValue[i])) {
			digitsBeforeCursor++
		}
	}

	for (let i = startOffset; i < formatted.length; i++) {
		if (/\d/.test(formatted[i])) {
			digitCount++
		}
		if (digitCount >= digitsBeforeCursor) {
			return i + 1
		}
	}

	// Default to end of formatted string
	return formatted.length
}

/**
 * Setup input element with live formatting
 */
export function setupNumberInput(
	el: HTMLInputElement | HTMLTextAreaElement,
	options: NumberFormatOptions & { prefix?: string, suffix?: string },
	formatFn: (value: number, options: any) => string,
): () => void {
	const { decimal = '.', prefix = '' } = options
	let isFormatting = false

	const onInput = (): void => {
		if (isFormatting) return

		const rawValue = el.value
		const cursorPos = el.selectionStart || 0

		// Handle empty or just minus
		if (!rawValue || rawValue === '-') {
			return
		}

		// Parse the number
		const num = parseToNumber(rawValue, decimal)

		if (num === null) {
			isFormatting = true
			el.value = ''
			el.dispatchEvent(new Event('input', { bubbles: true }))
			isFormatting = false

			return
		}

		// Format the number
		const clamped = clampValue(num, options)
		const formatted = formatFn(clamped, options)

		if (formatted !== rawValue) {
			isFormatting = true

			// Calculate new cursor position (start after prefix)
			const startOffset = prefix.length
			const newCursorPos = calculateCursorPosition(rawValue, formatted, cursorPos, startOffset)

			el.value = formatted
			el.setSelectionRange(newCursorPos, newCursorPos)
			el.dispatchEvent(new Event('input', { bubbles: true }))

			isFormatting = false
		}
	}

	const onBlur = (): void => {
		if (!el.value || el.value === '-') return

		const num = parseToNumber(el.value, decimal)

		if (num !== null) {
			const clamped = clampValue(num, options)
			const formatted = formatFn(clamped, options)

			isFormatting = true
			el.value = formatted
			el.dispatchEvent(new Event('input', { bubbles: true }))
			isFormatting = false
		}
	}

	el.addEventListener('input', onInput)
	el.addEventListener('blur', onBlur)

	// Initial format
	if (el.value) {
		const num = parseToNumber(el.value, decimal)

		if (num !== null) {
			const formatted = formatFn(clampValue(num, options), options)

			isFormatting = true
			el.value = formatted
			// Trigger input to sync with v-model
			el.dispatchEvent(new Event('input', { bubbles: true }))
			isFormatting = false
		}
	}

	return () => {
		el.removeEventListener('input', onInput)
		el.removeEventListener('blur', onBlur)
	}
}
