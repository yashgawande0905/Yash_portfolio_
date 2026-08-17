/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical site URL, baked into the SEO/JSON-LD tags at build time. */
  readonly VITE_SITE_URL?: string
  /** Only set when the API is hosted on a different origin than the frontend. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
