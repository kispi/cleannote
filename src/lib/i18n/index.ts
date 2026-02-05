import { settings } from '$lib/store/settings.svelte'
import ko from './ko'
import en from './en'

export const translations = {
  ko,
  en
}

export type Locale = keyof typeof translations
export type TranslationKey = string

export const locale = settings.locale

export const t = (key: TranslationKey, vars: Record<string, any> = {}) => {
  const keys = key.split('.')
  let value: any = translations[settings.locale] // Read reactive state directly
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value]
    } else {
      return key // Fallback to key if not found
    }
  }

  if (typeof value === 'string') {
    // Simple variable substitution {count}
    return value.replace(/{(\w+)}/g, (_, k) => vars[k] !== undefined ? vars[k] : `{${k}}`)
  }

  return value || key
}
