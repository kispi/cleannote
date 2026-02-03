import { derived } from 'svelte/store'
import { page } from '$app/stores'
import ko from './ko.ts'
import en from './en.ts'

export const translations = {
    ko,
    en
}

export type Locale = keyof typeof translations
// Helper to get nested keys type? For now just string intersection or simple string
export type TranslationKey = string 

export const t = derived(page, () => {
    // Logic to detect locale can be added here
    const locale: Locale = 'ko' 

    return (key: TranslationKey, vars: Record<string, any> = {}) => {
        const keys = key.split('.')
        let value: any = translations[locale]
        
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
})
