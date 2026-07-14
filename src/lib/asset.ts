/** Resolve a public asset path against the deploy base (e.g. GitHub Pages subpath). */
export const asset = (path: string) =>
  import.meta.env.BASE_URL + path.replace(/^\//, '')
