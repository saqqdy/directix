/**
 * Background service worker for Directix DevTools extension.
 * Routes messages between DevTools panel and content scripts via long-lived ports.
 */

/// <reference types="chrome" />

// ─── Port Registry ───────────────────────────────────────

const devtoolsPorts = new Map<number, chrome.runtime.Port>() // tabId → devtools port
const contentPorts = new Map<number, chrome.runtime.Port>() // tabId → content port

// ─── DevTools Connection ─────────────────────────────────

chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
	if (port.name === 'directix-devtools') {
		handleDevToolsConnect(port)
	} else if (port.name === 'directix-content') {
		handleContentConnect(port)
	}
})

function handleDevToolsConnect(port: chrome.runtime.Port): void {
	const tabId = port.sender?.tab?.id
	if (!tabId) return

	devtoolsPorts.set(tabId, port)

	port.onMessage.addListener((message: any) => {
		// Forward to content script
		const contentPort = contentPorts.get(tabId)
		if (contentPort) {
			try {
				contentPort.postMessage(message)
			} catch {
				contentPorts.delete(tabId)
			}
		} else {
			// Fallback: use chrome.tabs.sendMessage
			chrome.tabs.sendMessage(tabId, message)
		}
	})

	port.onDisconnect.addListener(() => {
		devtoolsPorts.delete(tabId)
	})
}

function handleContentConnect(port: chrome.runtime.Port): void {
	const tabId = port.sender?.tab?.id
	if (!tabId) return

	contentPorts.set(tabId, port)

	port.onMessage.addListener((message: any) => {
		// Forward to DevTools panel
		const devtoolsPort = devtoolsPorts.get(tabId)
		if (devtoolsPort) {
			try {
				devtoolsPort.postMessage(message)
			} catch {
				devtoolsPorts.delete(tabId)
			}
		}
	})

	port.onDisconnect.addListener(() => {
		contentPorts.delete(tabId)
	})
}

// ─── Legacy Message Fallback ─────────────────────────────

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
	const tabId = sender.tab?.id

	if (message.target === 'content' && tabId) {
		// DevTools → Content (legacy fallback)
		chrome.tabs.sendMessage(tabId, message, (response: any) => {
			sendResponse(response)
		})
		return true
	}

	if (message.target === 'background' && message.type === 'init') {
		sendResponse({ status: 'ok' })
	}

	if (message.type === 'export-download') {
		// Handle file download triggered from content script
		if (message.payload?.content && tabId) {
			const devtoolsPort = devtoolsPorts.get(tabId)
			devtoolsPort?.postMessage({
				type: 'export-download',
				payload: message.payload,
			})
		}
	}
})
