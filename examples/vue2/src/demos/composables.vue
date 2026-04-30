<template>
  <div class="demo-container">
    <h2>Composables Usage Examples</h2>
    <p class="description">
      Every directive has a corresponding composable for Composition API usage.
      Here are examples of using composables directly.
    </p>

    <!-- useDebounce -->
    <section class="demo-section">
      <h3>useDebounce</h3>
      <div class="demo-box">
        <input
          v-model="searchText"
          type="text"
          placeholder="Type to search..."
          @input="handleDebouncedSearch"
        />
        <p>Search text: {{ searchText }}</p>
        <p>Debounced value: {{ debouncedValue }}</p>
        <p>Search count: {{ searchCount }}</p>
      </div>
    </section>

    <!-- useThrottle -->
    <section class="demo-section">
      <h3>useThrottle</h3>
      <div class="demo-box">
        <button @click="handleThrottledClick">
          Click Me (Throttled)
        </button>
        <p>Click count: {{ clickCount }}</p>
        <p>Throttled count: {{ throttledCount }}</p>
      </div>
    </section>

    <!-- useClickOutside -->
    <section class="demo-section">
      <h3>useClickOutside</h3>
      <div class="demo-box">
        <div
          ref="outsideBox"
          class="outside-box"
          :class="{ active: isBoxActive }"
        >
          Click outside this box to trigger
        </div>
        <p>Outside clicks: {{ outsideClicks }}</p>
      </div>
    </section>

    <!-- useHover -->
    <section class="demo-section">
      <h3>useHover</h3>
      <div class="demo-box">
        <div
          ref="hoverBox"
          class="hover-box"
          :class="{ hovering: isHovering }"
        >
          Hover over me
        </div>
        <p>Is hovering: {{ isHovering }}</p>
        <p>Hover count: {{ hoverCount }}</p>
      </div>
    </section>

    <!-- useLongPress -->
    <section class="demo-section">
      <h3>useLongPress</h3>
      <div class="demo-box">
        <button
          ref="longPressBtn"
          class="long-press-btn"
          :class="{ pressed: isLongPressing }"
        >
          Hold for 500ms
        </button>
        <p>Is pressing: {{ isLongPressing }}</p>
        <p>Long press count: {{ longPressCount }}</p>
      </div>
    </section>

    <!-- useIntersect -->
    <section class="demo-section">
      <h3>useIntersect</h3>
      <div class="demo-box">
        <div class="intersect-container">
          <div class="intersect-spacer">Scroll down...</div>
          <div
            ref="intersectBox"
            class="intersect-target"
            :class="{ visible: isIntersecting }"
          >
            I'm {{ isIntersecting ? 'visible' : 'hidden' }}!
          </div>
        </div>
        <p>Intersection count: {{ intersectCount }}</p>
      </div>
    </section>

    <!-- useResize -->
    <section class="demo-section">
      <h3>useResize</h3>
      <div class="demo-box">
        <div
          ref="resizeArea"
          class="resize-box"
          :class="{ 'resize-changed': resizeCount > 0 }"
        >
          <div class="resize-info">
            <span class="resize-dim">{{ Math.round(resizeWidth) }} × {{ Math.round(resizeHeight) }}</span>
            <span class="resize-hint">↘ Drag corner to resize</span>
          </div>
        </div>
        <p>Resize count: {{ resizeCount }}</p>
      </div>
    </section>

    <!-- useCopy -->
    <section class="demo-section">
      <h3>useCopy</h3>
      <div class="demo-box">
        <input v-model="copyText" type="text" placeholder="Text to copy" />
        <button @click="handleCopy">Copy to Clipboard</button>
        <p v-if="copied" class="success">Copied!</p>
        <p>Copy count: {{ copyCount }}</p>
      </div>
    </section>

    <!-- createPermissionChecker -->
    <section class="demo-section">
      <h3>createPermissionChecker</h3>
      <div class="demo-box">
        <div class="perm-role-switcher">
          <span class="perm-label">Current Role:</span>
          <button
            v-for="role in permRoles"
            :key="role"
            class="perm-role-btn"
            :class="{ active: currentRole === role }"
            @click="currentRole = role"
          >
            {{ role }}
          </button>
        </div>
        <div class="perm-grid">
          <div
            v-for="item in permChecks"
            :key="item.label"
            class="perm-card"
            :class="item.result ? 'perm-granted' : 'perm-denied'"
          >
            <div class="perm-card-header">{{ item.label }}</div>
            <div class="perm-card-status">
              <span class="perm-icon">{{ item.result ? '✓' : '✗' }}</span>
              {{ item.result ? 'Granted' : 'Denied' }}
            </div>
            <div class="perm-card-detail" v-if="item.detail">{{ item.detail }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- useLazy -->
    <section class="demo-section">
      <h3>useLazy</h3>
      <div class="demo-box">
        <p class="lazy-tip">Scroll down to trigger lazy loading ↓</p>
        <div class="lazy-scroll-area">
          <div class="lazy-spacer">Scroll down...</div>
          <img
            ref="lazyImage"
            class="lazy-img"
            :class="{
              'lazy-loading': lazyState === 'loading',
              'lazy-loaded': lazyState === 'loaded',
              'lazy-error': lazyState === 'error',
            }"
            alt="Lazy loaded"
          />
        </div>
        <p>State: {{ lazyState }}</p>
        <p>Is loaded: {{ lazyIsLoaded }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import {
  useDebounce,
  useThrottle,
  useClickOutside,
  useHover,
  useLongPress,
  useIntersect,
  useResize,
  useCopy,
  createPermissionChecker,
  useLazy,
} from 'directix'

export default {
  name: 'ComposablesDemo',
  setup() {
    // useDebounce
    const searchText = ref('')
    const debouncedValue = ref('')
    const searchCount = ref(0)
    const { run: debouncedSearch, flush } = useDebounce({
      handler: (value) => {
        debouncedValue.value = value
        searchCount.value++
      },
      wait: 300,
    })

    const handleDebouncedSearch = (e) => {
      debouncedSearch(e.target.value)
    }

    // useThrottle
    const clickCount = ref(0)
    const throttledCount = ref(0)
    const { run: throttledRun } = useThrottle({
      handler: () => {
        throttledCount.value++
      },
      wait: 500,
    })

    const handleThrottledClick = () => {
      clickCount.value++
      throttledRun()
    }

    // useClickOutside
    const outsideBox = ref(null)
    const outsideClicks = ref(0)
    const isBoxActive = ref(false)
    let clickOutsideCleanup = null

    // useHover
    const hoverBox = ref(null)
    const hoverCount = ref(0)
    let hoverCleanup = null
    const { isHovering, bind: bindHover } = useHover({
      onEnter: () => {
        hoverCount.value++
      },
    })

    // useLongPress
    const longPressBtn = ref(null)
    const longPressCount = ref(0)
    let longPressCleanup = null
    const { isPressing: isLongPressing, bind: bindLongPress } = useLongPress({
      duration: 500,
      onTrigger: () => {
        longPressCount.value++
      },
    })

    // useIntersect
    const intersectBox = ref(null)
    const isIntersecting = ref(false)
    const intersectCount = ref(0)
    let intersectCleanup = null

    // useResize
    const resizeArea = ref(null)
    const resizeCount = ref(0)
    let resizeCleanup = null
    const { width: resizeWidth, height: resizeHeight, bind: bindResize } = useResize({
      onResize: () => {
        resizeCount.value++
      },
    })

    // useCopy
    const copyText = ref('Hello, Directix!')
    const copied = ref(false)
    const copyCount = ref(0)
    const { copy: copyToClipboard } = useCopy({})

    const handleCopy = async () => {
      const success = await copyToClipboard(copyText.value)
      if (success) {
        copied.value = true
        copyCount.value++
        setTimeout(() => {
          copied.value = false
        }, 2000)
      }
    }

    // createPermissionChecker
    const permRoles = ['admin', 'editor', 'viewer']
    const currentRole = ref('editor')

    const roleConfig = {
      admin: { permissions: ['read', 'write', 'delete'], roles: ['admin'] },
      editor: { permissions: ['read', 'write'], roles: ['editor'] },
      viewer: { permissions: ['read'], roles: ['viewer'] },
    }

    const roleMap = {
      admin: ['*'],
      editor: ['read', 'write'],
      viewer: ['read'],
    }

    const checkPermission = createPermissionChecker({
      getPermissions: () => roleConfig[currentRole.value].permissions,
      getRoles: () => roleConfig[currentRole.value].roles,
      roleMap,
    })

    const permChecks = computed(() => {
      const c = currentRole.value
      const hasRead = checkPermission('read')
      const hasWrite = checkPermission('write')
      const hasDelete = checkPermission('delete')
      const hasRoleAdmin = checkPermission('admin')
      const hasSome = checkPermission(['read', 'write', 'delete'], 'some')
      const hasEvery = checkPermission(['read', 'write'], 'every')
      return [
        { label: 'read', result: hasRead, detail: 'Direct permission check' },
        { label: 'write', result: hasWrite, detail: 'Direct permission check' },
        { label: 'delete', result: hasDelete, detail: 'Direct permission check' },
        { label: 'admin (role)', result: hasRoleAdmin, detail: 'Role-based check' },
        { label: "['read','write','delete'] (some)", result: hasSome, detail: 'Mode: some — any match' },
        { label: "['read','write'] (every)", result: hasEvery, detail: 'Mode: every — all must match' },
      ]
    })

    // useLazy
    const lazyImage = ref(null)
    let lazyCleanup = null
    const { state: lazyState, isLoaded: lazyIsLoaded, bind: bindLazy } = useLazy({
      src: 'https://picsum.photos/200/150',
    })

    // Setup composables that need element refs
    onMounted(() => {
      // useClickOutside setup
      if (outsideBox.value) {
        const { bind } = useClickOutside({
          handler: () => {
            outsideClicks.value++
            isBoxActive.value = true
            setTimeout(() => {
              isBoxActive.value = false
            }, 300)
          },
        })
        clickOutsideCleanup = bind(outsideBox.value)
      }

      // useHover setup
      if (hoverBox.value) {
        hoverCleanup = bindHover(hoverBox.value)
      }

      // useLongPress setup
      if (longPressBtn.value) {
        longPressCleanup = bindLongPress(longPressBtn.value)
      }

      // useIntersect setup
      if (intersectBox.value) {
        const { bind } = useIntersect({
          handler: (entry) => {
            isIntersecting.value = entry.isIntersecting
            if (entry.isIntersecting) {
              intersectCount.value++
            }
          },
        })
        intersectCleanup = bind(intersectBox.value)
      }

      // useResize setup
      if (resizeArea.value) {
        resizeCleanup = bindResize(resizeArea.value)
      }

      // useLazy setup
      if (lazyImage.value) {
        lazyCleanup = bindLazy(lazyImage.value)
      }
    })

    onUnmounted(() => {
      // Cleanup all bindings
      if (clickOutsideCleanup) clickOutsideCleanup()
      if (hoverCleanup) hoverCleanup()
      if (longPressCleanup) longPressCleanup()
      if (intersectCleanup) intersectCleanup()
      if (resizeCleanup) resizeCleanup()
      if (lazyCleanup) lazyCleanup()
    })

    return {
      // useDebounce
      searchText,
      debouncedValue,
      searchCount,
      handleDebouncedSearch,

      // useThrottle
      clickCount,
      throttledCount,
      handleThrottledClick,

      // useClickOutside
      outsideBox,
      outsideClicks,
      isBoxActive,

      // useHover
      hoverBox,
      isHovering,
      hoverCount,

      // useLongPress
      longPressBtn,
      isLongPressing,
      longPressCount,

      // useIntersect
      intersectBox,
      isIntersecting,
      intersectCount,

      // useResize
      resizeArea,
      resizeWidth,
      resizeHeight,
      resizeCount,

      // useCopy
      copyText,
      copied,
      copyCount,
      handleCopy,

      // createPermissionChecker
      permRoles,
      currentRole,
      permChecks,

      // useLazy
      lazyImage,
      lazyState,
      lazyIsLoaded,
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

input, textarea, button {
  padding: 8px 12px;
  margin: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: #42b883;
  color: white;
  cursor: pointer;
  border: none;
}

button:hover {
  background: #35495e;
}

.outside-box, .hover-box, .long-press-btn {
  display: inline-block;
  padding: 20px 40px;
  background: #e8f5e9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.outside-box.active, .hover-box.hovering, .long-press-btn.pressed {
  background: #42b883;
  color: white;
}

.intersect-container {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.intersect-spacer {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.intersect-target {
  padding: 40px;
  background: #f5f5f5;
  text-align: center;
  transition: all 0.3s;
}

.intersect-target.visible {
  background: #42b883;
  color: white;
}

.resize-box {
  width: 100%;
  min-height: 120px;
  resize: both;
  overflow: hidden;
  background: #e8f5e9;
  border: 2px dashed #42b883;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s, border-color 0.3s;
}

.resize-box.resize-changed {
  background: #c8e6c9;
  border-color: #2e7d32;
  border-style: solid;
}

.resize-info {
  text-align: center;
  pointer-events: none;
  user-select: none;
}

.resize-dim {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #2e7d32;
  font-variant-numeric: tabular-nums;
}

.resize-hint {
  display: block;
  font-size: 12px;
  color: #66bb6a;
  margin-top: 6px;
}

.success {
  color: #42b883;
  font-weight: bold;
}

.perm-role-switcher {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.perm-label {
  font-weight: 600;
  font-size: 14px;
  color: #555;
}

.perm-role-btn {
  padding: 6px 16px !important;
  border-radius: 20px !important;
  font-size: 13px;
  background: #e0e0e0 !important;
  color: #555 !important;
  border: 2px solid transparent !important;
  transition: all 0.2s;
}

.perm-role-btn.active {
  background: #42b883 !important;
  color: white !important;
  border-color: #35a572 !important;
}

.perm-role-btn:hover {
  background: #ccc !important;
}

.perm-role-btn.active:hover {
  background: #35495e !important;
}

.perm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
}

.perm-card {
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.25s;
}

.perm-granted {
  background: #e8f5e9;
  border-color: #66bb6a;
}

.perm-denied {
  background: #ffebee;
  border-color: #ef9a9a;
}

.perm-card-header {
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  word-break: break-all;
}

.perm-card-status {
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.perm-granted .perm-card-status {
  color: #2e7d32;
}

.perm-denied .perm-card-status {
  color: #c62828;
}

.perm-icon {
  font-size: 16px;
}

.perm-card-detail {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

.lazy-tip {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.lazy-scroll-area {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.lazy-spacer {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.lazy-img {
  display: block;
  width: 200px;
  height: 150px;
  margin: 20px auto;
  background: #f0f0f0;
  border-radius: 6px;
  transition: opacity 0.3s;
}

.lazy-img.lazy-loading {
  opacity: 0.5;
}

.lazy-img.lazy-loaded {
  opacity: 1;
}

.lazy-img.lazy-error {
  background: #ffebee;
}
</style>
