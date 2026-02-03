import { browser } from '$app/environment'

export type Theme = 'light' | 'dark'
export type Locale = 'ko' | 'en'

export interface SettingsState {
  theme: Theme
  locale: Locale
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: 'light',
  locale: 'ko'
}

const createSettingsState = () => {
  let state = $state<SettingsState>(DEFAULT_SETTINGS)

  const sync = () => {
    if (browser) {
      localStorage.setItem('settings', JSON.stringify(state))
      
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Initialize from localStorage if available
  if (browser) {
    const stored = localStorage.getItem('settings')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        state = { ...DEFAULT_SETTINGS, ...parsed }
        // Apply initial theme
        if (state.theme === 'dark') {
          document.documentElement.classList.add('dark')
        }
      } catch (e) {
        console.error('Failed to parse settings from localStorage', e)
      }
    }
  }

  return {
    get theme() { return state.theme },
    set theme(v: Theme) { 
      state.theme = v
      sync()
    },
    get locale() { return state.locale },
    set locale(v: Locale) { 
      state.locale = v
      sync()
    },
    
    setTheme: (v: Theme) => { 
      state.theme = v
      sync()
    },
    setLocale: (v: Locale) => { 
      state.locale = v
      sync()
    }
  }
}

export const settings = createSettingsState()
