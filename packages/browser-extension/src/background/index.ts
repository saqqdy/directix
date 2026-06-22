/**
 * Background service worker for Directix DevTools extension.
 * Routes messages between DevTools panels and content scripts.
 */

/// <reference types="chrome" />

// Relay messages from DevTools panel to content script
chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
	if (message.target === 'content') {
		chrome.tabs.sendMessage(message.tabId, message, (response: any) => {
			sendResponse(response)
		})
		return true // keep channel open for async response
	}

	if (message.target === 'background' && message.type === 'init') {
		sendResponse({ status: 'ok' })
	}
})

// Track DevTools connections
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
	port.onMessage.addListener((message: any) => {
		if (message.type === 'inspect') {
			chrome.tabs.sendMessage(message.tabId, {
				type: 'inspect',
				target: 'content',
			})
		}
	})
})
