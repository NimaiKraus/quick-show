interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_CURRENCY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
