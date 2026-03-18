/**
 * Nuxt Studio Compatibility Plugin
 *
 * Provides editable regions markers and click-to-edit functionality
 * for Nuxt Studio integration
 */

export default defineNuxtPlugin((nuxtApp) => {
  const isStudioMode = import.meta.env.NUXT_STUDIO_MODE === 'true'

  // Add editable region marker
  const addEditableMarker = (element: HTMLElement, field: string) => {
    if (!isStudioMode) return

    const marker = document.createElement('span')
    marker.className = 'nuxt-studio-editable-marker'
    marker.setAttribute('data-field', field)
    marker.innerHTML = '✏️'
    marker.style.cssText = `
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 100;
    `

    element.style.position = 'relative'
    element.appendChild(marker)

    element.addEventListener('mouseenter', () => {
      marker.style.opacity = '1'
    })

    element.addEventListener('mouseleave', () => {
      marker.style.opacity = '0'
    })

    marker.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      // Trigger Studio editor
      window.postMessage({
        type: 'NUXT_STUDIO_EDIT',
        field,
        element
      }, '*')
    })
  }

  // Global directive for editable regions
  const editableDirective = {
    mounted(el: HTMLElement, binding: any) {
      if (binding.value) {
        addEditableMarker(el, binding.value)
      }
    }
  }

  // Register global directive
  nuxtApp.vueApp.directive('editable', editableDirective)

  return {
    provide: {
      isStudioMode,
      addEditableMarker
    }
  }
})
