/**
 * DevTools panel entry point.
 * Creates the Directix DevTools panel and establishes port connection.
 */

/// <reference types="chrome" />

let port: chrome.runtime.Port | null = null

// Create the Directix panel
chrome.devtools.panels.create(
	'Directix',
	'icons/icon48.png',
	'panel.html',
	(panel: chrome.devtools.panels.ExtensionPanel) => {
		panel.onShown.addListener((window: any) => {
			// Initialize port connection when panel is shown
			if (!port) {
				connectToContent()
			}
			;(window as any).__directix_devtools_shown?.()
		})

		panel.onHidden.addListener(() => {
			// Optionally disconnect when hidden
		})
	},
)

function connectToContent(): void {
	const tabId = chrome.devtools.inspectedWindow.tabId

	port = chrome.runtime.connect({
		name: 'directix-devtools',
	})

	// Send initial connection message with tabId
	port.postMessage({
		type: 'devtools-connect',
		tabId,
	})

	port.onMessage.addListener((message: any) => {
		// Forward messages to panel window
		if (typeof window !== 'undefined' && (window as any).__directix_devtools_message) {
			;(window as any).__directix_devtools_message(message)
		}
	})

	port.onDisconnect.addListener(() => {
		port = null
	})
}
