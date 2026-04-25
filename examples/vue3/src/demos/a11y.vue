<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import DemoSection from '@/components/DemoSection.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import {
  applyAriaAttributes,
  announce,
  useKeyboardNavigation,
  useFocusTrap,
} from 'directix'

// Screen reader demo
const announceMessage = ref('')
const announcePriority = ref<'polite' | 'assertive'>('polite')

function handleAnnounce() {
  if (announceMessage.value) {
    announce(announceMessage.value, { priority: announcePriority.value })
    announceMessage.value = ''
  }
}

// ARIA attributes demo
const ariaElementRef = ref<HTMLElement | null>(null)
const ariaExpanded = ref(false)

function toggleAriaExpanded() {
  ariaExpanded.value = !ariaExpanded.value
  if (ariaElementRef.value) {
    applyAriaAttributes(ariaElementRef.value, {
      role: 'button',
      ariaExpanded: ariaExpanded.value,
      ariaLabel: ariaExpanded.value ? 'Click to collapse' : 'Click to expand',
    })
    announce(`Expanded: ${ariaExpanded.value}`)
  }
}

// Keyboard navigation demo
const menuRef = ref<HTMLElement | null>(null)
const menuItems = ref<HTMLElement[]>([])
const { focusedIndex, bind: bindKeyboardNav } = useKeyboardNavigation({
  focusTrap: true,
  loop: true,
  rovingTabindex: true,
})

const menuOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']
const selectedOption = ref('')

function selectOption(option: string) {
  selectedOption.value = option
  announce(`Selected ${option}`)
}

function initMenuNav() {
  if (menuRef.value) {
    menuItems.value = Array.from(menuRef.value.querySelectorAll('[role="menuitem"]')) as HTMLElement[]
    bindKeyboardNav(menuRef.value, menuItems.value)
  }
}

onMounted(() => {
  nextTick(() => {
    initMenuNav()
  })
})

// Focus trap demo
const modalRef = ref<HTMLElement | null>(null)
const isModalOpen = ref(false)
const { activate: activateTrap, deactivate: deactivateTrap } = useFocusTrap(modalRef, {
  returnFocus: true,
  escapeDeactivates: true,
})

function openModal() {
  isModalOpen.value = true
  setTimeout(() => activateTrap(), 0)
  announce('Modal opened')
}

function closeModal() {
  deactivateTrap()
  isModalOpen.value = false
  announce('Modal closed')
}

const announceCode = `import { announce } from 'directix'

// Screen reader announcement
announce('Form submitted successfully', { priority: 'polite' })
announce('Error occurred!', { priority: 'assertive' })`

const ariaCode = `import { applyAriaAttributes } from 'directix'

applyAriaAttributes(element, {
  role: 'button',
  ariaExpanded: true,
  ariaLabel: 'Toggle menu',
  ariaDisabled: false,
})`

const keyboardCode = `import { useKeyboardNavigation } from 'directix'

const { bind, focusedIndex } = useKeyboardNavigation({
  focusTrap: true,
  loop: true,
  rovingTabindex: true,
})

bind(containerEl, itemElements)`

const focusTrapCode = `import { useFocusTrap } from 'directix'

const modalRef = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(modalRef, {
  returnFocus: true,
  escapeDeactivates: true,
})

function openModal() {
  isModalOpen.value = true
  nextTick(() => activate())
}

function closeModal() {
  deactivate()
  isModalOpen.value = false
}`
</script>

<template>
  <div class="demo-page">
    <h1>Accessibility (A11y) Utilities</h1>
    <p class="intro">
      Comprehensive accessibility support including ARIA attributes, screen reader announcements,
      keyboard navigation, and focus management. (v1.10.0)
    </p>

    <!-- Screen Reader Announcements -->
    <DemoSection title="Screen Reader Announcements" description="Announce messages to screen readers with configurable priority">
      <div class="demo-box">
        <div class="form-row">
          <input
            v-model="announceMessage"
            type="text"
            placeholder="Enter message..."
            class="input"
            @keyup.enter="handleAnnounce"
          />
          <select v-model="announcePriority" class="select">
            <option value="polite">Polite</option>
            <option value="assertive">Assertive</option>
          </select>
          <button class="btn" @click="handleAnnounce">Announce</button>
        </div>
        <p class="hint">Messages are announced to screen readers. Use "polite" for non-urgent updates, "assertive" for important notifications.</p>
      </div>
      <CodeBlock :code="announceCode" />
    </DemoSection>

    <!-- ARIA Attributes -->
    <DemoSection title="ARIA Attributes" description="Dynamically apply ARIA attributes to elements">
      <div class="demo-box">
        <button
          ref="ariaElementRef"
          class="btn"
          @click="toggleAriaExpanded"
        >
          {{ ariaExpanded ? 'Collapse' : 'Expand' }}
        </button>
        <span v-if="ariaExpanded" class="expanded-content">Expanded content visible!</span>
        <p class="hint">The button has ARIA attributes applied dynamically. Screen readers will announce the expanded state.</p>
      </div>
      <CodeBlock :code="ariaCode" />
    </DemoSection>

    <!-- Keyboard Navigation -->
    <DemoSection title="Keyboard Navigation" description="Arrow keys navigation with focus trap and roving tabindex">
      <div class="demo-box">
        <div
          ref="menuRef"
          class="menu"
          role="menu"
          tabindex="0"
        >
          <div
            v-for="option in menuOptions"
            :key="option"
            role="menuitem"
            tabindex="-1"
            :class="['menu-item', { selected: selectedOption === option }]"
            @click="selectOption(option)"
          >
            {{ option }}
          </div>
        </div>
        <p class="hint">
          Use <kbd>↑</kbd> <kbd>↓</kbd> arrow keys to navigate, <kbd>Enter</kbd> to select, <kbd>Tab</kbd> is trapped. Focus index: {{ focusedIndex }}
        </p>
        <p v-if="selectedOption" class="selected-text">Selected: {{ selectedOption }}</p>
      </div>
      <CodeBlock :code="keyboardCode" />
    </DemoSection>

    <!-- Focus Trap -->
    <DemoSection title="Focus Trap (Modal)" description="Trap focus within a container, commonly used for modals">
      <div class="demo-box">
        <button class="btn" @click="openModal">Open Modal</button>
        <p class="hint">Focus is trapped inside the modal. Press <kbd>Escape</kbd> to close.</p>
      </div>
      <CodeBlock :code="focusTrapCode" />

      <Teleport to="body">
        <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div ref="modalRef" class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <h3 id="modal-title">Focus Trap Demo</h3>
            <p>Tab through the elements below - focus stays within this modal.</p>
            <input type="text" placeholder="First input" class="input" />
            <input type="text" placeholder="Second input" class="input" />
            <div class="modal-buttons">
              <button class="btn" @click="closeModal">Cancel</button>
              <button class="btn btn-primary" @click="closeModal">Confirm</button>
            </div>
          </div>
        </div>
      </Teleport>
    </DemoSection>

    <!-- API Reference -->
    <DemoSection title="API">
      <table class="api-table">
        <thead>
          <tr>
            <th>Function</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>announce(message, options?)</code></td>
            <td>Announce message to screen readers</td>
          </tr>
          <tr>
            <td><code>applyAriaAttributes(el, config)</code></td>
            <td>Apply ARIA attributes to element</td>
          </tr>
          <tr>
            <td><code>useKeyboardNavigation(options?)</code></td>
            <td>Composable for keyboard navigation</td>
          </tr>
          <tr>
            <td><code>useFocusTrap(container, options?)</code></td>
            <td>Composable for focus trap</td>
          </tr>
        </tbody>
      </table>
    </DemoSection>
  </div>
</template>

<style scoped>
.demo-page {
  max-width: 900px;
}

h1 {
  margin-bottom: 8px;
}

.intro {
  color: #666;
  margin-bottom: 24px;
}

.demo-box {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.hint {
  font-size: 13px;
  color: #888;
  margin-top: 12px;
}

.form-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn:hover {
  background: #5a6fd6;
}

.btn-primary {
  background: #42b883;
}

.btn-primary:hover {
  background: #3aa876;
}

.expanded-content {
  margin-left: 12px;
  color: #42b883;
  font-weight: 500;
}

.menu {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  max-width: 200px;
  background: white;
}

.menu-item {
  padding: 10px 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.menu-item:hover,
.menu-item:focus {
  background: #e3f2fd;
  outline: none;
}

.menu-item.selected {
  background: #bbdefb;
  font-weight: bold;
}

.selected-text {
  margin-top: 10px;
  font-weight: 500;
}

kbd {
  background: #eee;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal h3 {
  margin-bottom: 12px;
}

.modal p {
  margin-bottom: 16px;
  color: #666;
}

.modal .input {
  width: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
}

.api-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.api-table th,
.api-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.api-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.api-table code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
}
</style>