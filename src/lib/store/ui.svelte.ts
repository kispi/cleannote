import type { Component } from 'svelte'

const createModalState = () => {
  let items = $state<{ id: string; component: Component<any>; props: any; options?: { preventCloseOnClickBackdrop?: boolean } }[]>([])

  return {
    get items() { return items },
    show: (component: Component<any>, props: any = {}, options: { preventCloseOnClickBackdrop?: boolean } = {}) => {
      items.push({ 
        id: crypto.randomUUID(), 
        component, 
        props, 
        options 
      })
    },
    close: () => {
      items.pop()
    }
  }
}

const createToastState = () => {
  let items = $state<{ id: string; text: string; type: 'success' | 'error' | 'info' }[]>([])

  return {
    get items() { return items },
    set items(v) { items = v }, // Allow direct assignment if needed (e.g. filtering)
    show: (text: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = crypto.randomUUID()
      items.push({ id, text, type })
      setTimeout(() => {
        items = items.filter((i) => i.id !== id)
      }, 3000)
    }
  }
}

export const ui = {
  modal: createModalState(),
  toast: createToastState()
}
