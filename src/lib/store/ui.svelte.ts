import type { Component } from 'svelte'

class ModalState {
    active = $state<{ component: Component; props: any } | null>(null)

    show(component: Component, props: any = {}) {
        this.active = { component, props }
    }

    close() {
        this.active = null
    }
}

class ToastState {
    items = $state<{ id: string; text: string; type: 'success' | 'error' | 'info' }[]>([])

    show(text: string, type: 'success' | 'error' | 'info' = 'info') {
        const id = crypto.randomUUID()
        this.items.push({ id, text, type })
        setTimeout(() => {
            this.items = this.items.filter((i) => i.id !== id)
        }, 3000)
    }
}

export const ui = {
    modal: new ModalState(),
    toast: new ToastState()
}
