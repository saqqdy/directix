/**
 * Locale loader - Dynamic loading and caching of locale messages
 */

import type { I18nMessages, LocaleCode } from './types'

/**
 * Locale loader with caching and deduplication
 */
export class LocaleLoader {
	private static cache: Map<LocaleCode, I18nMessages> = new Map()
	private static loading: Map<LocaleCode, Promise<I18nMessages>> = new Map()

	/**
	 * Load a locale bundle
	 * @param locale - Locale code to load
	 * @returns Promise resolving to locale messages
	 */
	static async load(locale: LocaleCode): Promise<I18nMessages> {
		// Check cache
		if (this.cache.has(locale)) {
			return this.cache.get(locale)!
		}

		// Check if already loading (dedup concurrent loads)
		if (this.loading.has(locale)) {
			return this.loading.get(locale)!
		}

		// Start loading
		const promise = this.doLoad(locale)
		this.loading.set(locale, promise)

		try {
			const messages = await promise
			this.cache.set(locale, messages)
			return messages
		} finally {
			this.loading.delete(locale)
		}
	}

	/**
	 * Perform the actual loading
	 */
	private static async doLoad(locale: LocaleCode): Promise<I18nMessages> {
		const loaders: Record<LocaleCode, () => Promise<I18nMessages>> = {
			'zh-CN': async () => (await import('./locales/zh-CN')).zhCN,
			'en-US': async () => (await import('./locales/en-US')).enUS,
			'ja-JP': async () => (await import('./locales/ja-JP')).jaJP,
			'ko-KR': async () => (await import('./locales/ko-KR')).koKR,
			'fr-FR': async () => (await import('./locales/fr-FR')).frFR,
			'de-DE': async () => (await import('./locales/de-DE')).deDE,
			'es-ES': async () => (await import('./locales/es-ES')).esES,
			'ru-RU': async () => (await import('./locales/ru-RU')).ruRU,
		}

		const loader = loaders[locale]
		if (!loader) {
			throw new Error(`[Directix] Unsupported locale: ${locale}`)
		}

		return await loader()
	}

	/**
	 * Preload multiple locales
	 * @param locales - Array of locale codes to preload
	 */
	static async preload(locales: LocaleCode[]): Promise<void> {
		await Promise.all(locales.map(l => this.load(l)))
	}

	/**
	 * Register locale messages directly (for SSR or bundles)
	 * @param locale - Locale code
	 * @param messages - Locale messages to register
	 */
	static register(locale: LocaleCode, messages: I18nMessages): void {
		this.cache.set(locale, messages)
	}

	/**
	 * Clear cache
	 */
	static clearCache(): void {
		this.cache.clear()
		this.loading.clear()
	}

	/**
	 * Check if a locale is cached
	 */
	static isLoaded(locale: LocaleCode): boolean {
		return this.cache.has(locale)
	}

	/**
	 * Get all cached locales
	 */
	static getCachedLocales(): LocaleCode[] {
		return Array.from(this.cache.keys())
	}
}
