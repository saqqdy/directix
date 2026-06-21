import type { I18nMessages, LocaleCode } from '@directix/i18n/types'
import { LocaleDetector } from '@directix/i18n/detector'
import { LocaleLoader } from '@directix/i18n/loader'
import { deDE } from '@directix/i18n/locales/de-DE'
import { enUS } from '@directix/i18n/locales/en-US'
import { esES } from '@directix/i18n/locales/es-ES'
import { frFR } from '@directix/i18n/locales/fr-FR'
import { koKR } from '@directix/i18n/locales/ko-KR'
import { ruRU } from '@directix/i18n/locales/ru-RU'
import { zhCN } from '@directix/i18n/locales/zh-CN'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

// ─── LocaleDetector ────────────────────────────────────────────────────────────

describe('LocaleDetector', () => {
	beforeEach(() => {
		LocaleDetector.clearLocale()
	})

	it('should return fallback when no preference is stored', () => {
		const locale = LocaleDetector.detect('en-US')
		expect(locale).toBe('en-US')
	})

	it('should return stored locale when set', () => {
		LocaleDetector.setLocale('ko-KR')
		expect(LocaleDetector.detect()).toBe('ko-KR')
	})

	it('should clear stored locale', () => {
		LocaleDetector.setLocale('fr-FR')
		LocaleDetector.clearLocale()
		// After clearing, should fall back
		expect(LocaleDetector.detect('en-US')).toBe('en-US')
	})

	it('should normalize browser language to supported locale', () => {
		expect(LocaleDetector.normalizeLocale('zh')).toBe('zh-CN')
		expect(LocaleDetector.normalizeLocale('zh-TW')).toBe('zh-CN')
		expect(LocaleDetector.normalizeLocale('ko')).toBe('ko-KR')
		expect(LocaleDetector.normalizeLocale('ja')).toBe('ja-JP')
		expect(LocaleDetector.normalizeLocale('en-GB')).toBe('en-US')
		expect(LocaleDetector.normalizeLocale('fr')).toBe('fr-FR')
		expect(LocaleDetector.normalizeLocale('de-AT')).toBe('de-DE')
		expect(LocaleDetector.normalizeLocale('es-MX')).toBe('es-ES')
		expect(LocaleDetector.normalizeLocale('ru')).toBe('ru-RU')
		expect(LocaleDetector.normalizeLocale('xx')).toBeNull()
	})

	it('should return null for unsupported normalizeLocale input', () => {
		expect(LocaleDetector.normalizeLocale('')).toBeNull()
	})

	it('should check if locale is supported', () => {
		expect(LocaleDetector.isSupported('zh-CN')).toBe(true)
		expect(LocaleDetector.isSupported('en-US')).toBe(true)
		expect(LocaleDetector.isSupported('ko-KR')).toBe(true)
		expect(LocaleDetector.isSupported('xx-XX')).toBe(false)
	})

	it('should validate locale codes', () => {
		expect(LocaleDetector.isValidLocale('zh-CN')).toBe(true)
		expect(LocaleDetector.isValidLocale('invalid')).toBe(false)
	})

	it('should return all 8 supported locales', () => {
		const locales = LocaleDetector.getSupportedLocales()
		expect(locales).toEqual(
			expect.arrayContaining(['zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU']),
		)
		expect(locales.length).toBe(8)
	})
})

// ─── LocaleLoader ──────────────────────────────────────────────────────────────

describe('LocaleLoader', () => {
	beforeEach(() => {
		LocaleLoader.clearCache()
	})

	afterEach(() => {
		LocaleLoader.clearCache()
	})

	it('should register and retrieve locale messages', () => {
		const mockMessages: I18nMessages = zhCN
		LocaleLoader.register('zh-CN', mockMessages)
		expect(LocaleLoader.isLoaded('zh-CN')).toBe(true)
		expect(LocaleLoader.getCachedLocales()).toContain('zh-CN')
	})

	it('should load a locale dynamically', async () => {
		const messages = await LocaleLoader.load('zh-CN')
		expect(messages).toBeDefined()
		expect(messages.directives).toBeDefined()
		expect(messages.errors).toBeDefined()
		expect(messages.warnings).toBeDefined()
	})

	it('should throw for unsupported locale', async () => {
		await expect(LocaleLoader.load('xx-XX' as LocaleCode)).rejects.toThrow('[Directix] Unsupported locale')
	})

	it('should preload multiple locales', async () => {
		await LocaleLoader.preload(['zh-CN', 'en-US'])
		expect(LocaleLoader.isLoaded('zh-CN')).toBe(true)
		expect(LocaleLoader.isLoaded('en-US')).toBe(true)
	})

	it('should clear cache', () => {
		LocaleLoader.register('en-US', enUS)
		LocaleLoader.clearCache()
		expect(LocaleLoader.isLoaded('en-US')).toBe(false)
		expect(LocaleLoader.getCachedLocales()).toEqual([])
	})
})

// ─── Locale Messages Structure ────────────────────────────────────────────────

describe('New Locale Messages', () => {
	const locales: Array<{ code: LocaleCode, messages: I18nMessages }> = [
		{ code: 'ko-KR', messages: koKR },
		{ code: 'fr-FR', messages: frFR },
		{ code: 'de-DE', messages: deDE },
		{ code: 'es-ES', messages: esES },
		{ code: 'ru-RU', messages: ruRU },
	]

	it.each(locales)('should have valid structure for $code', ({ messages }) => {
		// Basic structure
		expect(messages.directives).toBeDefined()
		expect(messages.errors).toBeDefined()
		expect(messages.warnings).toBeDefined()
		expect(messages.help).toBeDefined()

		// Error messages have required keys
		expect(messages.errors.invalid_param).toBeDefined()
		expect(messages.errors.missing_required).toBeDefined()
		expect(messages.errors.type_error).toBeDefined()
		expect(messages.errors.value_out_of_range).toBeDefined()
		expect(messages.errors.not_supported).toBeDefined()
		expect(messages.errors.ssr_not_supported).toBeDefined()

		// Warning messages have required keys
		expect(messages.warnings.deprecated).toBeDefined()
		expect(messages.warnings.experimental).toBeDefined()
		expect(messages.warnings.performance).toBeDefined()
		expect(messages.warnings.fallback).toBeDefined()

		// All string values (not empty)
		expect(typeof messages.errors.invalid_param).toBe('string')
		expect(messages.errors.invalid_param.length).toBeGreaterThan(0)
	})
})
