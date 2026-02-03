import type { Component } from 'svelte'

const createModalState = () => {
  let items = $state<{ id: string; component: Component<any>; props: any; options?: { preventCloseOnClickBackdrop?: boolean } }[]>([])

  return {
    get items() { return items },
    show: ({ component, props = {}, options = {} }: { component: Component<any>, props?: any, options?: { preventCloseOnClickBackdrop?: boolean } }) => {
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
  let items = $state<{ id: string; text: string; type: 'success' | 'error' | 'info'; position: 'top-center' | 'bottom-center' }[]>([])

  return {
    get items() { return items },
    set items(v) { items = v },
    show: ({ text, type = 'info', duration = 3000, position = 'bottom-center' }: { text: string; type?: 'success' | 'error' | 'info'; duration?: number; position?: 'top-center' | 'bottom-center' }) => {
      const id = crypto.randomUUID()
      items.push({ id, text, type, position })
      setTimeout(() => {
        items = items.filter((i) => i.id !== id)
      }, duration)
    }
  }
}

export const ui = {
  modal: createModalState(),
  toast: createToastState()
}
