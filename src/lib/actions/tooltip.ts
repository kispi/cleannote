import { tooltip } from '$lib/store/tooltip.svelte'

export function uiTooltip(node: HTMLElement, content: string) {
  const handleMouseEnter = (e: MouseEvent) => {
    tooltip.show(content, e.clientX, e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    tooltip.move(e.clientX, e.clientY)
  }

  const handleMouseLeave = () => {
    tooltip.hide()
  }

  node.addEventListener('mouseenter', handleMouseEnter)
  node.addEventListener('mousemove', handleMouseMove)
  node.addEventListener('mouseleave', handleMouseLeave)

  return {
    update(newContent: string) {
      content = newContent
    },
    destroy() {
      node.removeEventListener('mouseenter', handleMouseEnter)
      node.removeEventListener('mousemove', handleMouseMove)
      node.removeEventListener('mouseleave', handleMouseLeave)
    }
  }
}
