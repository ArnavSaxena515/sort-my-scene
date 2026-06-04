export interface TranslationEntry {
  text: string
  enabled: boolean
}

export interface MessageData {
  translations: Record<string, TranslationEntry>
  updatedAt: string
}
