/**
 * Locale detection - Auto-detect user's preferred language
 */

import type { LocaleCode } from './types'

/**
 * Locale detector - Detects user's preferred language
 * Priority: stored > browser language > default
 */
export class LocaleDetector {
	private static storedLocale: LocaleCode | null = null
	private static readonly STORAGE_KEY = 'directix_locale'

	/**
	 * Detect user's preferred locale
	 * Priority: stored > browser language > default
	 * @param fallback - Fallback locale if detection fails (default: 'en-US')
	 */
	static detect(fallback: LocaleCode = 'en-US'): LocaleCode {
		// 1. Check stored preference
		if (this.storedLocale) {
			return this.storedLocale
		}

		// 2. Try reading from localStorage
		if (typeof localStorage !== 'undefined') {
			const stored = localStorage.getItem(this.STORAGE_KEY)
			if (stored && this.isValidLocale(stored)) {
				this.storedLocale = stored as LocaleCode
				return this.storedLocale
			}
		}

		// 3. Detect browser language
		if (typeof navigator !== 'undefined') {
			const browserLang = navigator.language || (navigator as any).userLanguage
			const detected = this.normalizeLocale(browserLang)
			if (detected && this.isSupported(detected)) {
				return detected
			}
		}

		// 4. Return fallback
		return fallback
	}

	/**
	 * Set locale preference
	 * @param locale - Locale code to set
	 */
	static setLocale(locale: LocaleCode): void {
		this.storedLocale = locale
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(this.STORAGE_KEY, locale)
		}
	}

	/**
	 * Clear stored locale preference
	 */
	static clearLocale(): void {
		this.storedLocale = null
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(this.STORAGE_KEY)
		}
	}

	/**
	 * Normalize a language string to a supported locale code
	 * @param lang - Language string (e.g., 'zh-CN', 'ko', 'en-GB')
	 */
	static normalizeLocale(lang: string | undefined): LocaleCode | null {
		if (!lang) return null
		// Handle Chinese variants
		if (lang.startsWith('zh')) return 'zh-CN'
		// Handle Korean
		if (lang.startsWith('ko')) return 'ko-KR'
		// Handle Japanese
		if (lang.startsWith('ja')) return 'ja-JP'
		// Handle English variants
		if (lang.startsWith('en')) return 'en-US'
		// Handle French
		if (lang.startsWith('fr')) return 'fr-FR'
		// Handle German
		if (lang.startsWith('de')) return 'de-DE'
		// Handle Spanish
		if (lang.startsWith('es')) return 'es-ES'
		// Handle Russian
		if (lang.startsWith('ru')) return 'ru-RU'
		return null
	}

	/**
	 * Check if a locale code is supported
	 * @param locale - Locale code to check
	 */
	static isSupported(locale: string): locale is LocaleCode {
		const supported: LocaleCode[] = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU']
		return supported.includes(locale as LocaleCode)
	}

	/**
	 * Validate a locale code string
	 * @param code - String to validate
	 */
	static isValidLocale(code: string): boolean {
		return ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU'].includes(code)
	}

	/**
	 * Get all supported locale codes
	 */
	static getSupportedLocales(): LocaleCode[] {
		return ['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU']
	}
}
