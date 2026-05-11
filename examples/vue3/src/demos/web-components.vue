<template>
  <div class="demo-container">
    <h2>Web Components Support</h2>
    <p class="description">
      Use Directix directives with Custom Elements / Web Components.
      Works in both Vue 2 and Vue 3 applications.
    </p>

    <!-- Basic Usage -->
    <section class="demo-section">
      <h3>Basic Usage</h3>
      <div class="demo-box">
        <p>Check if an element is a custom element:</p>
        <div class="code-block">
          <code>
            isCustomElement(element) // returns true/false
          </code>
        </div>
        <button @click="checkCustomElement">Check &lt;my-custom-element&gt;</button>
        <p v-if="checkResult" class="result">{{ checkResult }}</p>
      </div>
    </section>

    <!-- Apply Directive to Custom Element -->
    <section class="demo-section">
      <h3>Apply Directive to Custom Element</h3>
      <div class="demo-box">
        <p>Apply a Vue directive to an existing custom element:</p>
        <my-test-element ref="testElement"></my-test-element>
        <button @click="applyLazyDirective">Apply v-lazy Directive</button>
        <button @click="applyClickOutside">Apply v-click-outside</button>
        <p v-if="appliedDirective" class="result">Applied: {{ appliedDirective }}</p>
      </div>
    </section>

    <!-- Define Custom Element Directive -->
    <section class="demo-section">
      <h3>Define Custom Element Directive</h3>
      <div class="demo-box">
        <p>Create a custom element that wraps a directive:</p>
        <div class="code-block">
          <pre>
defineCustomElementDirective({
  name: 'lazy-img',
  directive: vLazy,
  shadow: true
})

// Use in HTML: &lt;lazy-img src="..."&gt;&lt;/lazy-img&gt;
          </pre>
        </div>
        <button @click="defineLazyImg">Define lazy-img Element</button>
        <button @click="defineClickWave">Define click-wave Element</button>
        <div v-if="definedElements.length" class="result">
          <p>Defined Elements:</p>
          <ul>
            <li v-for="el in definedElements" :key="el">{{ el }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Register Multiple Elements -->
    <section class="demo-section">
      <h3>Register Multiple Elements</h3>
      <div class="demo-box">
        <p>Register multiple directives as custom elements at once:</p>
        <button @click="registerMultipleElements">Register All</button>
        <div v-if="registeredElements.length" class="result">
          <p>Registered Elements:</p>
          <ul>
            <li v-for="el in registeredElements" :key="el">{{ el }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Usage Examples -->
    <section class="demo-section">
      <h3>Usage Examples</h3>
      <div class="demo-box">
        <p>After registering, use the custom elements in your HTML:</p>
        <div class="example-grid">
          <div class="example-item">
            <h4>Lazy Loading Image</h4>
            <lazy-img
              v-if="showLazyImg"
              src="https://picsum.photos/200/150"
              value="{ threshold: 0.5 }"
            ></lazy-img>
            <p v-else class="hint">Click "Define lazy-img" above to create</p>
          </div>
          <div class="example-item">
            <h4>Click Wave Effect</h4>
            <click-wave-btn v-if="showClickWave">
              Click Me!
            </click-wave-btn>
            <p v-else class="hint">Click "Define click-wave" above to create</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Browser Support -->
    <section class="demo-section">
      <h3>Browser Support</h3>
      <div class="demo-box">
        <p>Check if Web Components are supported:</p>
        <button @click="checkSupport">Check Browser Support</button>
        <p class="result">
          <span v-if="webComponentsSupported" class="supported">✅ Supported</span>
          <span v-else class="not-supported">❌ Not Supported</span>
        </p>
      </div>
    </section>

    <!-- Code Examples -->
    <section class="demo-section">
      <h3>Code Examples</h3>
      <div class="demo-box">
        <div class="code-examples">
          <div class="code-example">
            <h4>1. Apply Directive to Existing Element</h4>
            <pre>
import { applyDirectiveToCustomElement, vLazy } from 'directix'

const element = document.querySelector('my-component')
const cleanup = applyDirectiveToCustomElement(element, vLazy, {
  threshold: 0.5
})

// Cleanup when needed
cleanup()
            </pre>
          </div>
          <div class="code-example">
            <h4>2. Define Custom Element</h4>
            <pre>
import { defineCustomElementDirective, vClickOutside } from 'directix'

defineCustomElementDirective({
  name: 'click-outside-panel',
  directive: vClickOutside,
  shadow: true,
  shadowMode: 'open'
})
            </pre>
          </div>
          <div class="code-example">
            <h4>3. Register Multiple Elements</h4>
            <pre>
import {
  registerDirectiveElements,
  vLazy,
  vClickOutside,
  vDebounce
} from 'directix'

registerDirectiveElements({
  'lazy-img': vLazy,
  'click-outside-panel': vClickOutside,
  'debounce-input': vDebounce
})
            </pre>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import {
  isCustomElement,
  applyDirectiveToCustomElement,
  defineCustomElementDirective,
  registerDirectiveElements,
  createDirectiveElement,
  vLazy,
  vClickOutside,
  vClickWave,
  vDebounce,
} from 'directix'

export default {
  name: 'WebComponentsDemo',
  setup() {
    // State
    const checkResult = ref('')
    const appliedDirective = ref('')
    const definedElements = ref([])
    const registeredElements = ref([])
    const showLazyImg = ref(false)
    const showClickWave = ref(false)
    const webComponentsSupported = ref(false)
    const testElement = ref(null)

    // Define a test custom element for demo
    class MyTestElement extends HTMLElement {
      constructor() {
        super()
        this.innerHTML = '<div style="padding: 20px; background: #f0f0f0; border-radius: 8px;">This is a test custom element</div>'
      }
    }

    onMounted(() => {
      // Register test element
      if (!customElements.get('my-test-element')) {
        customElements.define('my-test-element', MyTestElement)
      }

      // Check support
      webComponentsSupported.value = typeof customElements !== 'undefined'
    })

    // Methods
    const checkCustomElement = () => {
      const testEl = document.querySelector('my-test-element')
      if (testEl) {
        const result = isCustomElement(testEl)
        checkResult.value = `my-test-element isCustomElement: ${result}`
      }
    }

    const applyLazyDirective = () => {
      const testEl = document.querySelector('my-test-element')
      if (testEl) {
        applyDirectiveToCustomElement(testEl, vLazy, { threshold: 0.5 })
        appliedDirective.value = 'v-lazy'
      }
    }

    const applyClickOutside = () => {
      const testEl = document.querySelector('my-test-element')
      if (testEl) {
        applyDirectiveToCustomElement(testEl, vClickOutside, {
          handler: () => alert('Clicked outside!')
        })
        appliedDirective.value = 'v-click-outside'
      }
    }

    const defineLazyImg = () => {
      defineCustomElementDirective({
        name: 'lazy-img',
        directive: vLazy,
        shadow: false,
      })
      definedElements.value.push('lazy-img')
      showLazyImg.value = true
    }

    const defineClickWave = () => {
      defineCustomElementDirective({
        name: 'click-wave-btn',
        directive: vClickWave,
        shadow: false,
      })
      definedElements.value.push('click-wave-btn')
      showClickWave.value = true
    }

    const registerMultipleElements = () => {
      registerDirectiveElements({
        'lazy-panel': vLazy,
        'click-wave-btn': vClickWave,
        'debounce-input': vDebounce,
      })
      registeredElements.value = ['lazy-panel', 'click-wave-btn', 'debounce-input']
    }

    const checkSupport = () => {
      webComponentsSupported.value = typeof customElements !== 'undefined'
    }

    return {
      checkResult,
      appliedDirective,
      definedElements,
      registeredElements,
      showLazyImg,
      showClickWave,
      webComponentsSupported,
      testElement,
      checkCustomElement,
      applyLazyDirective,
      applyClickOutside,
      defineLazyImg,
      defineClickWave,
      registerMultipleElements,
      checkSupport,
    }
  },
}
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.demo-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.demo-section h3 {
  margin-bottom: 15px;
  color: #42b883;
}

.demo-box {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 6px;
}

button {
  padding: 10px 20px;
  margin: 5px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #35495e;
}

.code-block {
  padding: 10px;
  background: #263238;
  color: #aed581;
  border-radius: 6px;
  margin: 10px 0;
  font-family: monospace;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
}

.result {
  margin-top: 10px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
}

.supported {
  color: #2e7d32;
  font-weight: bold;
}

.not-supported {
  color: #c62828;
  font-weight: bold;
}

.hint {
  color: #666;
  font-size: 12px;
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.example-item {
  padding: 20px;
  background: white;
  border-radius: 8px;
  text-align: center;
}

.example-item h4 {
  margin-bottom: 10px;
  color: #42b883;
}

.code-examples {
  display: grid;
  gap: 20px;
}

.code-example {
  padding: 15px;
  background: white;
  border-radius: 8px;
}

.code-example h4 {
  margin-bottom: 10px;
  color: #42b883;
}

.code-example pre {
  padding: 10px;
  background: #263238;
  color: #aed581;
  border-radius: 6px;
  overflow-x: auto;
}
</style>