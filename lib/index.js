/**
 * dsh-mobile-page-fix — host half.
 *
 * This plugin is client-only: every fix it ships is CSS injected into the web
 * profile's page by `client/client.js`. The host half exists so the bundle
 * patch has something to mount and so the plugin shows up in Settings →
 * Plugins like any other entry.
 *
 * No routes, no settings section, no state — the host does nothing.
 */

export const name = 'dsh-mobile-page-fix';

/**
 * Register the plugin against the host context.
 *
 * Intentionally empty: all work happens on the client. Kept as a function so
 * cordis has a plugin body to apply.
 */
export function apply() {
  // Client-only plugin.
}
