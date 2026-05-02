<template>
  <div class="demo-container">
    <h2>Plugin System</h2>
    <p class="description">
      Extensible plugin architecture for creating and sharing custom directives.
      Build your own plugins or use community plugins.
    </p>

    <!-- Plugin Manager -->
    <section class="demo-section">
      <h3>Plugin Manager</h3>
      <div class="demo-box">
        <div class="manager-stats">
          <div class="stat">
            <span class="stat-value">{{ installedPlugins.length }}</span>
            <span class="stat-label">Installed Plugins</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ enabledPlugins.length }}</span>
            <span class="stat-label">Enabled</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Installed Plugins -->
    <section class="demo-section">
      <h3>Installed Plugins</h3>
      <div class="demo-box">
        <div class="plugin-list">
          <div
            v-for="plugin in installedPlugins"
            :key="plugin.meta.name"
            class="plugin-card"
            :class="{ disabled: !plugin.enabled }"
          >
            <div class="plugin-header">
              <span class="plugin-name">{{ plugin.meta.name }}</span>
              <span class="plugin-version">v{{ plugin.meta.version }}</span>
            </div>
            <p class="plugin-desc">{{ plugin.meta.description }}</p>
            <div class="plugin-directives">
              <span class="label">Directives:</span>
              <span
                v-for="dir in plugin.directives"
                :key="dir"
                class="directive-tag"
              >
                {{ dir }}
              </span>
            </div>
            <div class="plugin-actions">
              <button
                v-if="plugin.enabled"
                @click="disablePlugin(plugin.meta.name)"
                class="warning"
              >
                Disable
              </button>
              <button v-else @click="enablePlugin(plugin.meta.name)">
                Enable
              </button>
              <button @click="uninstallPlugin(plugin.meta.name)" class="danger">
                Uninstall
              </button>
            </div>
          </div>
          <div v-if="installedPlugins.length === 0" class="empty">
            No plugins installed. Create or install one below.
          </div>
        </div>
      </div>
    </section>

    <!-- Create Custom Plugin -->
    <section class="demo-section">
      <h3>Create Custom Plugin</h3>
      <div class="demo-box">
        <div class="plugin-creator">
          <div class="form-group">
            <label>Plugin Name</label>
            <input v-model="newPlugin.name" placeholder="my-plugin" />
          </div>
          <div class="form-group">
            <label>Version</label>
            <input v-model="newPlugin.version" placeholder="1.0.0" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <input v-model="newPlugin.description" placeholder="Plugin description" />
          </div>
          <div class="form-group">
            <label>Directive Name</label>
            <input v-model="newPlugin.directiveName" placeholder="my-directive" />
          </div>
          <div class="form-group">
            <label>Directive Behavior</label>
            <select v-model="newPlugin.directiveType">
              <option value="log">Log on mount</option>
              <option value="color">Change background color</option>
              <option value="focus">Auto focus element</option>
            </select>
          </div>
          <button @click="createPlugin" class="primary">Create & Install Plugin</button>
        </div>

        <div v-if="createdPluginCode" class="code-preview">
          <h4>Generated Plugin Code</h4>
          <pre><code>{{ createdPluginCode }}</code></pre>
        </div>
      </div>
    </section>

    <!-- Plugin Registry (Community) -->
    <section class="demo-section">
      <h3>Community Plugin Registry</h3>
      <div class="demo-box">
        <div class="registry-search">
          <input
            v-model="searchQuery"
            placeholder="Search plugins..."
            @input="searchPlugins"
          />
        </div>
        <div class="registry-list">
          <div
            v-for="plugin in filteredRegistryPlugins"
            :key="plugin.name"
            class="registry-item"
          >
            <div class="registry-info">
              <span class="registry-name">{{ plugin.name }}</span>
              <span class="registry-version">v{{ plugin.version }}</span>
              <span class="registry-downloads">{{ plugin.downloads }} downloads</span>
            </div>
            <p class="registry-desc">{{ plugin.description }}</p>
            <button
              @click="installFromRegistry(plugin.name)"
              :disabled="isInstalled(plugin.name)"
            >
              {{ isInstalled(plugin.name) ? 'Installed' : 'Install' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Plugin Hooks -->
    <section class="demo-section">
      <h3>Plugin Lifecycle Hooks</h3>
      <div class="demo-box">
        <div class="hooks-demo">
          <p>Plugins can hook into various lifecycle events:</p>
          <div class="hook-list">
            <div class="hook-item">
              <code>onInstall</code>
              <span>Called when plugin is installed</span>
            </div>
            <div class="hook-item">
              <code>onEnable</code>
              <span>Called when plugin is enabled</span>
            </div>
            <div class="hook-item">
              <code>onDisable</code>
              <span>Called when plugin is disabled</span>
            </div>
            <div class="hook-item">
              <code>onUninstall</code>
              <span>Called when plugin is uninstalled</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Test Custom Directive -->
    <section class="demo-section">
      <h3>Test Custom Directive</h3>
      <div class="demo-box">
        <p v-if="!hasCustomDirectives" class="hint">
          Create and install a plugin above to test its directive here.
        </p>
        <div v-else class="test-area">
          <div class="test-item">
            <label>Test with created directive:</label>
            <div
              v-if="testDirectiveType === 'color'"
              v-my-directive="'#42b883'"
              class="test-box"
            >
              This box has custom background color from plugin directive
            </div>
            <input
              v-else-if="testDirectiveType === 'focus'"
              v-my-directive
              type="text"
              placeholder="Auto-focused input"
            />
            <div v-else v-my-directive class="test-box">
              Check console for mount log
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  definePlugin,
  getPluginManager,
  defineDirective,
} from 'directix'

export default {
  name: 'PluginSystemDemo',
  setup() {
    const manager = getPluginManager()

    // Plugin state
    const installedPlugins = ref([])
    const enabledPlugins = computed(() =>
      installedPlugins.value.filter(p => p.enabled)
    )

    // New plugin form
    const newPlugin = reactive({
      name: 'my-custom-plugin',
      version: '1.0.0',
      description: 'A custom plugin for demonstration',
      directiveName: 'my-directive',
      directiveType: 'color',
    })

    const createdPluginCode = ref('')
    const testDirectiveType = ref('')

    // Registry
    const searchQuery = ref('')
    const registryPlugins = ref([
      {
        name: 'directix-animate',
        version: '1.2.0',
        description: 'Advanced animation directives with GSAP integration',
        downloads: 15420,
      },
      {
        name: 'directix-forms',
        version: '2.0.1',
        description: 'Form validation and enhancement directives',
        downloads: 23150,
      },
      {
        name: 'directix-charts',
        version: '1.0.5',
        description: 'Chart and data visualization directives',
        downloads: 8930,
      },
      {
        name: 'directix-media',
        version: '1.1.0',
        description: 'Audio and video player directives',
        downloads: 5620,
      },
    ])

    const filteredRegistryPlugins = computed(() => {
      if (!searchQuery.value) return registryPlugins.value
      const query = searchQuery.value.toLowerCase()
      return registryPlugins.value.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    })

    // Create plugin
    const createPlugin = () => {
      const directiveDef = createDirectiveDefinition(newPlugin.directiveType)
      testDirectiveType.value = newPlugin.directiveType

      const plugin = definePlugin({
        meta: {
          name: newPlugin.name,
          version: newPlugin.version,
          description: newPlugin.description,
        },
        directives: {
          [newPlugin.directiveName]: directiveDef,
        },
        onInstall(ctx) {
          console.log(`Plugin ${newPlugin.name} installed!`)
        },
        onEnable(ctx) {
          console.log(`Plugin ${newPlugin.name} enabled!`)
        },
      })

      manager.register(plugin)
      updateInstalledPlugins()

      // Generate code preview
      createdPluginCode.value = generatePluginCode()
    }

    const createDirectiveDefinition = (type) => {
      switch (type) {
        case 'color':
          return defineDirective({
            name: 'color-bg',
            mounted(el, binding) {
              el.style.backgroundColor = binding.value || '#42b883'
            },
          })
        case 'focus':
          return defineDirective({
            name: 'auto-focus',
            mounted(el) {
              el.focus()
            },
          })
        default:
          return defineDirective({
            name: 'log-mount',
            mounted(el) {
              console.log('Directive mounted on:', el)
            },
          })
      }
    }

    const generatePluginCode = () => {
      return `import { definePlugin, defineDirective } from 'directix'

const plugin = definePlugin({
  meta: {
    name: '${newPlugin.name}',
    version: '${newPlugin.version}',
    description: '${newPlugin.description}',
  },
  directives: {
    '${newPlugin.directiveName}': defineDirective({
      name: '${newPlugin.directiveName}',
      mounted(el, binding) {
        // ${newPlugin.directiveType} behavior
      },
    }),
  },
  onInstall(ctx) {
    console.log('Plugin installed!')
  },
})

// Register
getPluginManager().register(plugin)`
    }

    // Plugin management
    const enablePlugin = (name) => {
      manager.enable(name)
      updateInstalledPlugins()
    }

    const disablePlugin = (name) => {
      manager.disable(name)
      updateInstalledPlugins()
    }

    const uninstallPlugin = (name) => {
      manager.unregister(name)
      updateInstalledPlugins()
    }

    const updateInstalledPlugins = () => {
      installedPlugins.value = manager.getAll().map(p => ({
        meta: p.meta,
        directives: Object.keys(p.directives || {}),
        enabled: p.enabled !== false,
      }))
    }

    const isInstalled = (name) => {
      return installedPlugins.value.some(p => p.meta.name === name)
    }

    const installFromRegistry = (name) => {
      // Simulate installation
      const plugin = registryPlugins.value.find(p => p.name === name)
      if (plugin) {
        const newPlugin = definePlugin({
          meta: {
            name: plugin.name,
            version: plugin.version,
            description: plugin.description,
          },
          directives: {},
        })
        manager.register(newPlugin)
        updateInstalledPlugins()
      }
    }

    const searchPlugins = () => {
      // Search is handled by computed property
    }

    const hasCustomDirectives = computed(() => {
      return installedPlugins.value.some(
        p => p.directives && p.directives.length > 0
      )
    })

    onMounted(() => {
      updateInstalledPlugins()
    })

    return {
      // State
      installedPlugins,
      enabledPlugins,
      newPlugin,
      createdPluginCode,
      testDirectiveType,
      searchQuery,
      filteredRegistryPlugins,
      hasCustomDirectives,

      // Actions
      createPlugin,
      enablePlugin,
      disablePlugin,
      uninstallPlugin,
      isInstalled,
      installFromRegistry,
      searchPlugins,
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
}

.manager-stats {
  display: flex;
  gap: 30px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #42b883;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.plugin-card {
  padding: 15px;
  margin: 10px 0;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #42b883;
}

.plugin-card.disabled {
  opacity: 0.6;
  border-left-color: #ccc;
}

.plugin-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.plugin-name {
  font-weight: bold;
  font-size: 16px;
}

.plugin-version {
  background: #42b883;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.plugin-directives {
  margin: 10px 0;
}

.directive-tag {
  display: inline-block;
  padding: 2px 8px;
  margin: 2px;
  background: #e8f5e9;
  border-radius: 4px;
  font-size: 12px;
}

button {
  padding: 6px 12px;
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

button.primary {
  background: #1976d2;
}

button.warning {
  background: #fb8c00;
}

button.danger {
  background: #e53935;
}

.form-group {
  margin: 10px 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.code-preview {
  margin-top: 20px;
  padding: 15px;
  background: #263238;
  border-radius: 8px;
}

.code-preview h4 {
  color: #42b883;
  margin-bottom: 10px;
}

.code-preview pre {
  margin: 0;
  color: #aed581;
  font-size: 12px;
  overflow-x: auto;
}

.registry-item {
  padding: 15px;
  margin: 10px 0;
  background: #f5f5f5;
  border-radius: 8px;
}

.registry-info {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 5px;
}

.registry-name {
  font-weight: bold;
}

.registry-version {
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.registry-downloads {
  color: #666;
  font-size: 12px;
}

.hook-list {
  margin-top: 15px;
}

.hook-item {
  display: flex;
  gap: 15px;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border-radius: 4px;
}

.hook-item code {
  background: #e8f5e9;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.test-box {
  padding: 30px;
  border-radius: 8px;
  color: white;
  text-align: center;
}

.empty {
  padding: 30px;
  text-align: center;
  color: #999;
}

.hint {
  padding: 15px;
  background: #fff3e0;
  border-radius: 4px;
  color: #e65100;
}
</style>
