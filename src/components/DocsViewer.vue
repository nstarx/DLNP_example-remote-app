<template>
  <div class="docs-viewer" style="min-height: 100vh; padding: 2rem 1.5rem;">
    <div style="max-width: 80rem; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h1 class="docs-title">Documentation</h1>
        <p class="docs-subtitle">Browse and read project documentation</p>
      </div>

      <div style="display: flex; gap: 1.5rem;">
        <!-- Sidebar with doc list -->
        <div style="width: 16rem; flex-shrink: 0;">
          <Card style="position: sticky; top: 1rem;">
            <template #content>
              <h3 style="margin-bottom: 1rem; font-size: 1.125rem; font-weight: 600;">Documents</h3>
              <div v-if="loading" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <Skeleton v-for="i in 4" :key="i" height="2rem" />
              </div>
              <ul v-else-if="docs.length > 0" style="display: flex; flex-direction: column; gap: 0.5rem; list-style: none; padding: 0;">
                <li v-for="doc in docs" :key="doc.path">
                  <button
                    @click="selectDoc(doc)"
                    :style="{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      borderRadius: '0.5rem',
                      transition: 'background-color 0.2s',
                      backgroundColor: selectedDoc?.path === doc.path ? 'var(--p-primary-500)' : 'transparent',
                      color: selectedDoc?.path === doc.path ? 'white' : 'inherit',
                      border: 'none',
                      cursor: 'pointer'
                    }"
                    class="doc-button"
                    @mouseenter="handleMouseEnter($event, doc)"
                    @mouseleave="handleMouseLeave($event, doc)"
                  >
                    {{ doc.name }}
                  </button>
                </li>
              </ul>
              <p v-else style="color: var(--p-surface-500);">
                No documentation files found
              </p>
            </template>
          </Card>
        </div>

        <!-- Main content area -->
        <div style="flex: 1;">
          <Card>
            <template #content>
              <div v-if="!selectedDoc" style="padding: 3rem 0; text-align: center; color: var(--p-surface-500);">
                <i class="pi pi-book" style="font-size: 2.5rem; display: block; margin-bottom: 1rem;"></i>
                <p>Select a document from the sidebar to view its content</p>
              </div>
              <div v-else-if="loadingContent" style="display: flex; flex-direction: column; gap: 1rem;">
                <Skeleton height="2rem" width="70%" />
                <Skeleton height="1rem" />
                <Skeleton height="1rem" />
                <Skeleton height="1rem" width="80%" />
              </div>
              <div v-else-if="docContent" class="doc-content">
                <h1 class="doc-main-title">{{ docContent.name }}</h1>
                <div v-html="renderedContent" class="markdown-body"></div>
              </div>
              <div v-else-if="error" style="padding: 3rem 0; text-align: center;">
                <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem; color: var(--p-red-500); display: block; margin-bottom: 1rem;"></i>
                <p style="color: var(--p-red-600);">{{ error }}</p>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { marked } from 'marked'
import mermaid from 'mermaid'
import api from '@/services/api'
import { useLayout } from '@/composables/useLayout'

const { isDarkMode } = useLayout()

const docs = ref([])
const selectedDoc = ref(null)
const docContent = ref(null)
const loading = ref(false)
const loadingContent = ref(false)
const error = ref(null)

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    darkMode: false,
    primaryColor: '#10b981',
    primaryTextColor: '#fff',
    primaryBorderColor: '#059669',
    lineColor: '#6b7280',
    secondaryColor: '#f3f4f6',
    tertiaryColor: '#e5e7eb',
    fontSize: '16px'
  },
  flowchart: {
    htmlLabels: true,
    nodeSpacing: 80,
    rankSpacing: 60,
    curve: 'basis',
    padding: 15,
    useMaxWidth: false
  },
  sequence: {
    actorMargin: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    mirrorActors: true,
    useMaxWidth: false
  },
  gantt: {
    fontSize: 14,
    numberSectionStyles: 4,
    axisFormat: '%Y-%m-%d',
    useMaxWidth: false
  }
})

// Configure marked for safe HTML rendering
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
})

const renderedContent = computed(() => {
  if (!docContent.value?.content) return ''
  
  // Store mermaid blocks before parsing
  const mermaidBlocks = []
  let mermaidIndex = 0
  
  // Extract mermaid blocks before markdown parsing
  const contentWithPlaceholders = docContent.value.content.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagram) => {
    mermaidBlocks.push(diagram.trim())
    return `<!--MERMAID_PLACEHOLDER_${mermaidIndex++}-->`
  })
  
  // Parse markdown to HTML
  let html = marked(contentWithPlaceholders)
  
  // Replace placeholders with mermaid containers
  html = html.replace(/<!--MERMAID_PLACEHOLDER_(\d+)-->/g, (match, index) => {
    const diagram = mermaidBlocks[parseInt(index)]
    return `<div class="mermaid-container">
      <div class="mermaid-controls">
        <button onclick="zoomMermaid(this, 0.8)" title="Zoom out">−</button>
        <button onclick="zoomMermaid(this, 1.25)" title="Zoom in">+</button>
        <button onclick="resetMermaid(this)" title="Reset zoom">⟲</button>
      </div>
      <div class="mermaid-wrapper">
        <div class="mermaid" data-zoom="1">${diagram}</div>
      </div>
    </div>`
  })
  
  return html
})

// Render mermaid diagrams after content updates
const renderMermaidDiagrams = async () => {
  await nextTick()
  
  const isDark = document.documentElement.classList.contains('p-dark')
  
  // Update mermaid theme based on dark mode
  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    themeVariables: isDark ? {
      darkMode: true,
      primaryColor: '#10b981',
      primaryTextColor: '#fff',
      primaryBorderColor: '#059669',
      lineColor: '#9ca3af',
      secondaryColor: '#374151',
      tertiaryColor: '#1f2937',
      background: '#111827',
      mainBkg: '#1f2937',
      secondBkg: '#374151',
      tertiaryBkg: '#4b5563',
      fontSize: '16px'
    } : {
      darkMode: false,
      primaryColor: '#10b981',
      primaryTextColor: '#fff',
      primaryBorderColor: '#059669',
      lineColor: '#6b7280',
      secondaryColor: '#f3f4f6',
      tertiaryColor: '#e5e7eb',
      fontSize: '16px'
    },
    flowchart: {
      htmlLabels: true,
      nodeSpacing: 80,
      rankSpacing: 60,
      curve: 'basis',
      padding: 15,
      useMaxWidth: false
    },
    sequence: {
      actorMargin: 50,
      boxMargin: 10,
      boxTextMargin: 5,
      noteMargin: 10,
      messageMargin: 35,
      mirrorActors: true,
      useMaxWidth: false
    },
    gantt: {
      fontSize: 14,
      numberSectionStyles: 4,
      axisFormat: '%Y-%m-%d',
      useMaxWidth: false
    }
  })
  
  const mermaidElements = document.querySelectorAll('.mermaid')
  for (let i = 0; i < mermaidElements.length; i++) {
    const element = mermaidElements[i]
    if (!element.getAttribute('data-processed')) {
      try {
        const graphDefinition = element.textContent
        const id = `mermaid-${Date.now()}-${i}`
        const { svg } = await mermaid.render(id, graphDefinition)
        
        // Clear the element and add only the SVG
        element.textContent = ''
        element.innerHTML = svg
        element.setAttribute('data-processed', 'true')
        element.setAttribute('data-graph', graphDefinition) // Store for re-rendering
      } catch (error) {
        console.error('Error rendering mermaid diagram:', error)
        element.innerHTML = `<pre class="mermaid-error">Error rendering diagram: ${error.message}</pre>`
      }
    }
  }
}

// Re-render mermaid diagrams when dark mode changes
watch(isDarkMode, () => {
  // Clear processed attributes to force re-render
  const mermaidElements = document.querySelectorAll('.mermaid[data-processed]')
  mermaidElements.forEach(el => {
    const graphDefinition = el.getAttribute('data-graph')
    if (graphDefinition) {
      el.removeAttribute('data-processed')
      el.textContent = graphDefinition // Restore original content for re-rendering
    }
  })
  renderMermaidDiagrams()
})

const fetchDocs = async () => {
  loading.value = true
  error.value = null
  try {
    docs.value = await api.getDocs()
    // Auto-select first doc if available
    if (docs.value.length > 0) {
      selectDoc(docs.value[0])
    }
  } catch (err) {
    console.error('Error fetching docs:', err)
    error.value = 'Failed to load documentation list'
  } finally {
    loading.value = false
  }
}

const selectDoc = async (doc) => {
  selectedDoc.value = doc
  loadingContent.value = true
  error.value = null
  docContent.value = null
  
  try {
    docContent.value = await api.getDocContent(doc.path)
  } catch (err) {
    console.error('Error fetching doc content:', err)
    error.value = 'Failed to load document content'
  } finally {
    loadingContent.value = false
  }
}

const handleMouseEnter = (event, doc) => {
  if (selectedDoc.value?.path !== doc.path) {
    const isDark = document.documentElement.classList.contains('p-dark')
    event.target.style.backgroundColor = isDark ? 'var(--p-surface-700)' : 'var(--p-surface-100)'
  }
}

const handleMouseLeave = (event, doc) => {
  if (selectedDoc.value?.path !== doc.path) {
    event.target.style.backgroundColor = 'transparent'
  }
}

// Global zoom functions for mermaid diagrams
window.zoomMermaid = (button, factor) => {
  const container = button.closest('.mermaid-container')
  const mermaid = container.querySelector('.mermaid')
  const currentZoom = parseFloat(mermaid.getAttribute('data-zoom') || '1')
  const newZoom = Math.max(0.2, Math.min(5, currentZoom * factor))
  mermaid.setAttribute('data-zoom', newZoom)
  mermaid.style.transform = `scale(${newZoom})`
}

window.resetMermaid = (button) => {
  const container = button.closest('.mermaid-container')
  const mermaid = container.querySelector('.mermaid')
  mermaid.setAttribute('data-zoom', '1')
  mermaid.style.transform = 'scale(1)'
}

// Add pan functionality
const addPanFunctionality = () => {
  nextTick(() => {
    const wrappers = document.querySelectorAll('.mermaid-wrapper')
    wrappers.forEach(wrapper => {
      let isDragging = false
      let startX, startY, scrollLeft, scrollTop
      
      wrapper.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return
        isDragging = true
        wrapper.classList.add('dragging')
        startX = e.pageX - wrapper.offsetLeft
        startY = e.pageY - wrapper.offsetTop
        scrollLeft = wrapper.scrollLeft
        scrollTop = wrapper.scrollTop
      })
      
      wrapper.addEventListener('mouseleave', () => {
        isDragging = false
        wrapper.classList.remove('dragging')
      })
      
      wrapper.addEventListener('mouseup', () => {
        isDragging = false
        wrapper.classList.remove('dragging')
      })
      
      wrapper.addEventListener('mousemove', (e) => {
        if (!isDragging) return
        e.preventDefault()
        const x = e.pageX - wrapper.offsetLeft
        const y = e.pageY - wrapper.offsetTop
        const walkX = (x - startX) * 2
        const walkY = (y - startY) * 2
        wrapper.scrollLeft = scrollLeft - walkX
        wrapper.scrollTop = scrollTop - walkY
      })
    })
  })
}

// Watch for rendered content changes to add pan functionality
watch(renderedContent, () => {
  if (renderedContent.value) {
    nextTick(() => {
      renderMermaidDiagrams()
      addPanFunctionality()
    })
  }
}, { flush: 'post' })

onMounted(() => {
  fetchDocs()
})
</script>

<style>
/* Add any specific styles for the docs viewer */
.docs-viewer {
  background-color: var(--p-surface-50);
}

.p-dark .docs-viewer {
  background-color: var(--p-surface-900);
}

/* Markdown styles */
.markdown-body {
  color: var(--p-surface-900);
  line-height: 1.75;
}

.p-dark .markdown-body {
  color: var(--p-surface-100);
}

.markdown-body h1 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--p-surface-900);
}

.p-dark .markdown-body h1 {
  color: white;
}

.markdown-body h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--p-surface-900);
}

.p-dark .markdown-body h2 {
  color: white;
}

.markdown-body h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: var(--p-surface-900);
}

.p-dark .markdown-body h3 {
  color: white;
}

.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  font-size: 1.125rem;
  font-weight: 500;
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
  color: var(--p-surface-900);
}

.p-dark .markdown-body h4,
.p-dark .markdown-body h5,
.p-dark .markdown-body h6 {
  color: white;
}

.markdown-body p {
  margin-bottom: 1rem;
}

.markdown-body a {
  color: var(--p-primary-600);
  text-decoration: underline;
}

.markdown-body a:hover {
  color: var(--p-primary-700);
}

.p-dark .markdown-body a {
  color: var(--p-primary-400);
}

.p-dark .markdown-body a:hover {
  color: var(--p-primary-300);
}

.markdown-body ul,
.markdown-body ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.markdown-body ul {
  list-style-type: disc;
}

.markdown-body ol {
  list-style-type: decimal;
}

.markdown-body li {
  margin-bottom: 0.5rem;
}

.markdown-body code {
  background-color: var(--p-surface-100);
  color: var(--p-surface-900);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.p-dark .markdown-body code {
  background-color: var(--p-surface-800);
  color: var(--p-surface-100);
}

.markdown-body pre {
  background-color: #f6f8fa;
  color: #24292e;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
  border: 1px solid var(--p-surface-200);
}

.p-dark .markdown-body pre {
  background-color: #161b22;
  color: #e6edf3;
  border-color: var(--p-surface-700);
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
  font-size: 1rem;
  color: inherit;
}

.markdown-body blockquote {
  border-left: 4px solid var(--p-primary-500);
  padding-left: 1rem;
  font-style: italic;
  margin: 1rem 0;
  color: var(--p-surface-700);
}

.p-dark .markdown-body blockquote {
  color: var(--p-surface-300);
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid var(--p-surface-300);
  padding: 0.5rem 1rem;
  text-align: left;
}

.p-dark .markdown-body th,
.p-dark .markdown-body td {
  border-color: var(--p-surface-700);
}

.markdown-body th {
  background-color: var(--p-surface-100);
  font-weight: 600;
}

.p-dark .markdown-body th {
  background-color: var(--p-surface-800);
}

.markdown-body hr {
  margin: 1.5rem 0;
  border-color: var(--p-surface-300);
}

.p-dark .markdown-body hr {
  border-color: var(--p-surface-700);
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

/* Additional component styles */
.docs-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--p-surface-900);
}

.p-dark .docs-title {
  color: white;
}

.docs-subtitle {
  margin-top: 0.5rem;
  color: var(--p-surface-600);
}

.p-dark .docs-subtitle {
  color: var(--p-surface-400);
}

.doc-main-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--p-surface-900);
}

.p-dark .doc-main-title {
  color: white;
}

/* Dark mode hover styles for doc buttons */
.p-dark .doc-button:hover {
  background-color: var(--p-surface-700) !important;
}

/* Mermaid diagram styles */
.mermaid-container {
  margin: 2rem 0;
  background-color: #ffffff;
  border: 1px solid var(--p-surface-200);
  border-radius: 0.5rem;
  padding: 2rem;
  overflow: hidden;
  position: relative;
}

.p-dark .mermaid-container {
  background-color: #0d1117;
  border-color: var(--p-surface-700);
}

.mermaid-wrapper {
  overflow: auto;
  max-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: grab;
}

.mermaid-wrapper.dragging {
  cursor: grabbing;
}

.mermaid {
  display: inline-block;
  text-align: center;
  transform-origin: center center;
  transition: transform 0.2s ease;
  min-width: 100%;
}

.mermaid svg {
  display: block;
  font-size: 16px !important;
}

/* Zoom controls */
.mermaid-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.mermaid-controls button {
  background-color: var(--p-surface-0);
  border: 1px solid var(--p-surface-300);
  color: var(--p-surface-700);
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.mermaid-controls button:hover {
  background-color: var(--p-surface-100);
  border-color: var(--p-surface-400);
}

.p-dark .mermaid-controls button {
  background-color: var(--p-surface-800);
  border-color: var(--p-surface-600);
  color: var(--p-surface-100);
}

.p-dark .mermaid-controls button:hover {
  background-color: var(--p-surface-700);
  border-color: var(--p-surface-500);
}

/* Override mermaid default styles for better visibility */
.mermaid .nodeLabel,
.mermaid .label {
  font-size: 14px !important;
  font-weight: 500 !important;
}

.mermaid .edgeLabel {
  font-size: 13px !important;
  background-color: white !important;
  padding: 2px 4px !important;
}

.p-dark .mermaid .edgeLabel {
  background-color: #0d1117 !important;
  color: #e6edf3 !important;
}

/* Larger text for specific diagram types */
.mermaid text.actor {
  font-size: 16px !important;
}

.mermaid .messageText {
  font-size: 14px !important;
}

/* Ensure gantt text is readable */
.mermaid .taskText,
.mermaid .taskTextOutsideRight,
.mermaid .taskTextOutsideLeft {
  font-size: 14px !important;
  font-weight: 500 !important;
}

.mermaid-error {
  color: var(--p-red-500);
  background-color: var(--p-red-50);
  border: 1px solid var(--p-red-200);
  border-radius: 0.25rem;
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
  font-size: 0.875rem;
  white-space: pre-wrap;
}

.p-dark .mermaid-error {
  background-color: var(--p-red-900);
  border-color: var(--p-red-700);
  color: var(--p-red-200);
}
</style>