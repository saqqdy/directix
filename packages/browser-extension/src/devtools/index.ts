/**
 * DevTools panel entry point.
 * Creates the Directix DevTools panel and manages communication.
 */

/// <reference types="chrome" />

// Create the Directix panel
chrome.devtools.panels.create(
	'Directix',
	'icons/icon48.png',
	'panel.html',
	(panel: chrome.devtools.panels.ExtensionPanel) => {
		panel.onShown.addListener((window: any) => {
			;(window as any).__directix_devtools_shown?.()
		})
	},
)
