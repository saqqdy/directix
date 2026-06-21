// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
	tab.addEventListener('click', () => {
		document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
		tab.classList.add('active')
		const targetPanel = tab.getAttribute('data-tab')
		document.querySelectorAll<HTMLElement>('.content').forEach(p => p.style.display = 'none')
		const panel = document.getElementById(`${targetPanel}-panel`)
		if (panel) panel.style.display = 'block'
	})
})

// Listen for messages from content script
window.addEventListener('message', event => {
	if (event.data.type === 'directix-inspect') {
		updateDirectiveList(event.data.directives)
	}
	if (event.data.type === 'directix-performance') {
		updatePerformanceMetrics(event.data.metrics)
	}
})

function updateDirectiveList(directives: any[]): void {
	const list = document.getElementById('directive-list')!
	const activeCount = document.getElementById('active-count')!
	const elementCount = document.getElementById('element-count')!

	if (!directives.length) {
		list.innerHTML = '<div class="empty-state">No Directix directives found on this element</div>'
		return
	}

	activeCount.textContent = String(directives.filter((d: any) => d.active).length)
	elementCount.textContent = String(directives.length)

	list.innerHTML = ''
	for (const d of directives) {
		const item = document.createElement('div')
		item.className = 'directive-item'

		const name = document.createElement('span')
		name.className = 'directive-name'
		name.textContent = d.name
		item.appendChild(name)

		const state = document.createElement('span')
		state.className = `directive-state ${d.active ? 'state-active' : 'state-inactive'}`
		state.textContent = d.active ? 'Active' : 'Inactive'
		item.appendChild(state)

		const value = document.createElement('div')
		value.className = 'directive-value'
		value.textContent = `Value: ${JSON.stringify(d.value)}`
		item.appendChild(value)

		if (d.state) {
			const stateEl = document.createElement('div')
			stateEl.className = 'directive-value'
			stateEl.textContent = `State: ${JSON.stringify(d.state)}`
			item.appendChild(stateEl)
		}

		list.appendChild(item)
	}
}

function updatePerformanceMetrics(metrics: any): void {
	const perfPanel = document.getElementById('performance-panel')!
	const memUsage = document.getElementById('memory-usage')!

	memUsage.textContent = `${Math.round(metrics.memory / 1024)}KB`
	perfPanel.innerHTML = ''

	const statsDiv = document.createElement('div')
	statsDiv.className = 'stats'

	const mountCard = createStatCard(`${metrics.mountTime}ms`, 'Avg Mount Time')
	const updateCard = createStatCard(`${metrics.updateTime}ms`, 'Avg Update Time')
	const memCard = createStatCard(`${Math.round(metrics.memory / 1024)}KB`, 'Memory Usage')
	statsDiv.appendChild(mountCard)
	statsDiv.appendChild(updateCard)
	statsDiv.appendChild(memCard)
	perfPanel.appendChild(statsDiv)

	for (const d of metrics.directives) {
		const item = document.createElement('div')
		item.className = 'directive-item'

		const name = document.createElement('span')
		name.className = 'directive-name'
		name.textContent = d.name
		item.appendChild(name)

		const value = document.createElement('div')
		value.className = 'directive-value'
		value.textContent = `Mount: ${d.mountTime}ms | Update: ${d.updateTime}ms | Memory: ${Math.round(d.memory / 1024)}KB`
		item.appendChild(value)

		perfPanel.appendChild(item)
	}
}

function createStatCard(value: string, label: string): HTMLElement {
	const card = document.createElement('div')
	card.className = 'stat-card'

	const val = document.createElement('div')
	val.className = 'stat-value'
	val.textContent = value
	card.appendChild(val)

	const lab = document.createElement('div')
	lab.className = 'stat-label'
	lab.textContent = label
	card.appendChild(lab)

	return card
}
