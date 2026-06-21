<template>
  <div class="demo-container">
    <h2>i18n Internationalization</h2>
    <p class="description">
      Built-in internationalization support with 8 languages (English, Chinese, Japanese, Korean, French, German, Spanish, Russian).
      Create custom translations for your application.
    </p>

    <!-- Language Selection -->
    <section class="demo-section">
      <h3>Language Selection</h3>
      <div class="demo-box">
        <div class="language-buttons">
          <button
            v-for="lang in availableLanguages"
            :key="lang.code"
            :class="{ active: currentLocale === lang.code }"
            @click="changeLocale(lang.code)"
          >
            {{ lang.flag }} {{ lang.name }}
          </button>
        </div>
        <p class="current-locale">
          Current locale: <strong>{{ currentLocale }}</strong>
        </p>
      </div>
    </section>

    <!-- Translated Messages -->
    <section class="demo-section">
      <h3>Translated Messages</h3>
      <div class="demo-box">
        <div class="message-grid">
          <div class="message-item">
            <span class="message-key">errors.invalid_type</span>
            <span class="message-value">{{ t('errors.invalid_type') }}</span>
          </div>
          <div class="message-item">
            <span class="message-key">errors.required</span>
            <span class="message-value">{{ t('errors.required') }}</span>
          </div>
          <div class="message-item">
            <span class="message-key">errors.invalid_param</span>
            <span class="message-value">{{ t('errors.invalid_param') }}</span>
          </div>
          <div class="message-item">
            <span class="message-key">warnings.deprecated</span>
            <span class="message-value">{{ t('warnings.deprecated') }}</span>
          </div>
          <div class="message-item">
            <span class="message-key">warnings.ssr_unsupported</span>
            <span class="message-value">{{ t('warnings.ssr_unsupported') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Interpolation -->
    <section class="demo-section">
      <h3>Message Interpolation</h3>
      <div class="demo-box">
        <div class="interpolation-demo">
          <div class="input-group">
            <label>Directive Name:</label>
            <input v-model="directiveName" type="text" />
          </div>
          <div class="input-group">
            <label>Parameter:</label>
            <input v-model="paramName" type="text" />
          </div>
          <div class="result">
            <p><strong>errors.directive_not_found:</strong></p>
            <p class="translated">{{ interpolatedMessage }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Directive with i18n -->
    <section class="demo-section">
      <h3>Directive with i18n Messages</h3>
      <div class="demo-box">
        <div class="directive-demo">
          <p>Test v-debounce with different locales:</p>
          <input
            v-debounce="{ handler: handleInput, wait: 500 }"
            type="text"
            placeholder="Type something..."
          />
          <p class="hint">
            Error messages will be displayed in the selected language when invalid inputs are used.
          </p>
          <div v-if="lastInput" class="input-display">
            <strong>Last Input:</strong> {{ lastInput }}
          </div>
        </div>
      </div>
    </section>

    <!-- Available Locales -->
    <section class="demo-section">
      <h3>Available Locales</h3>
      <div class="demo-box">
        <div class="locale-list">
          <div class="locale-item" @click="showLocaleMessages('en-US')">
            <span class="locale-code">en-US</span>
            <span class="locale-name">English (US)</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('zh-CN')">
            <span class="locale-code">zh-CN</span>
            <span class="locale-name">Chinese (Simplified)</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('ja-JP')">
            <span class="locale-code">ja-JP</span>
            <span class="locale-name">Japanese</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('ko-KR')">
            <span class="locale-code">ko-KR</span>
            <span class="locale-name">Korean</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('fr-FR')">
            <span class="locale-code">fr-FR</span>
            <span class="locale-name">French</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('de-DE')">
            <span class="locale-code">de-DE</span>
            <span class="locale-name">German</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('es-ES')">
            <span class="locale-code">es-ES</span>
            <span class="locale-name">Spanish</span>
          </div>
          <div class="locale-item" @click="showLocaleMessages('ru-RU')">
            <span class="locale-code">ru-RU</span>
            <span class="locale-name">Russian</span>
          </div>
        </div>
        <div v-if="selectedLocaleMessages" class="locale-preview">
          <h4>{{ selectedLocale }} Messages Preview</h4>
          <pre>{{ selectedLocaleMessages }}</pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import {
  createI18n,
  setLocale,
  getLocale,
  t,
  enUS,
  zhCN,
  jaJP,
  koKR,
  frFR,
  deDE,
  esES,
  ruRU,
} from 'directix'
import { vDebounce } from 'directix'

export default {
  name: 'I18nDemo',
  directives: {
    debounce: vDebounce,
  },
  setup() {
    // Available locale messages
    const localeMessages = {
      'en-US': enUS,
      'zh-CN': zhCN,
      'ja-JP': jaJP,
      'ko-KR': koKR,
      'fr-FR': frFR,
      'de-DE': deDE,
      'es-ES': esES,
      'ru-RU': ruRU,
    }

    // Language options
    const availableLanguages = ref([
      { code: 'en-US', name: 'English', flag: '🇺🇸' },
      { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
      { code: 'ja-JP', name: '日本語', flag: '🇯🇵' },
      { code: 'ko-KR', name: '한국어', flag: '🇰🇷' },
      { code: 'fr-FR', name: 'Français', flag: '🇫🇷' },
      { code: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'es-ES', name: 'Español', flag: '🇪🇸' },
      { code: 'ru-RU', name: 'Русский', flag: '🇷🇺' },
    ])

    const currentLocale = ref('zh-CN')

    // Interpolation
    const directiveName = ref('v-debounce')
    const paramName = ref('wait')

    const interpolatedMessage = computed(() => {
      return t('errors.directive_not_found', { directive: directiveName.value, param: paramName.value })
    })

    // Directive demo
    const lastInput = ref('')

    const handleInput = (event) => {
      lastInput.value = event.target.value
    }

    // Locale messages preview
    const selectedLocale = ref('')
    const selectedLocaleMessages = ref(null)

    const showLocaleMessages = (locale) => {
      selectedLocale.value = locale
      selectedLocaleMessages.value = JSON.stringify(localeMessages[locale]?.errors || {}, null, 2)
    }

    // Change locale
    const changeLocale = (locale) => {
      currentLocale.value = locale
      setLocale(locale)
    }

    onMounted(() => {
      // Initialize i18n
      createI18n({
        locale: currentLocale.value,
        fallbackLocale: 'en-US',
        messages: localeMessages,
      })

      currentLocale.value = getLocale()
    })

    return {
      // Languages
      availableLanguages,
      currentLocale,
      changeLocale,

      // Translation
      t,
      interpolatedMessage,
      directiveName,
      paramName,

      // Directive demo
      handleInput,
      lastInput,

      // Locale preview
      selectedLocale,
      selectedLocaleMessages,
      showLocaleMessages,
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
  padding: 8px 16px;
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

button.active {
  background: #35495e;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.language-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.message-grid {
  display: grid;
  gap: 10px;
}

.message-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
}

.message-key {
  font-family: monospace;
  color: #666;
}

.message-value {
  font-weight: 500;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.input-group label {
  min-width: 120px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.translated {
  padding: 15px;
  background: white;
  border-radius: 4px;
  font-style: italic;
}

.directive-demo input {
  width: 100%;
  padding: 10px;
}

.hint {
  font-size: 12px;
  color: #666;
  margin-top: 10px;
}

.input-display {
  margin-top: 15px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 4px;
}

.locale-list {
  display: flex;
  gap: 15px;
}

.locale-item {
  padding: 15px 20px;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  transition: all 0.2s;
}

.locale-item:hover {
  border-color: #42b883;
}

.locale-code {
  font-weight: bold;
  color: #42b883;
}

.locale-name {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.locale-preview {
  margin-top: 20px;
  padding: 15px;
  background: #263238;
  border-radius: 8px;
}

.locale-preview h4 {
  color: #42b883;
  margin-bottom: 10px;
}

.locale-preview pre {
  color: #aed581;
  font-size: 12px;
  margin: 0;
  overflow-x: auto;
}
</style>