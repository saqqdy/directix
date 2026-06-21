// Create a Directix panel in DevTools
chrome.devtools.panels.create(
	'Directix',
	'icons/icon16.png',
	'panel.html',
	panel => {
		panel.onShown.addListener(_window => {
			// Panel shown
		})
	},
)
