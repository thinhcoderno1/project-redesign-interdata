# Dependency security

On 2026-10-18, `npm audit` reported five high-severity entries from one vulnerable
dependency chain used only by the development lint tooling:

`eslint-config-next -> @next/eslint-plugin-next -> fast-glob -> micromatch -> braces`

The advisory [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
affects `braces <=3.0.3` and has no published patched version. The latest stable
Next.js ESLint plugin checked (16.4.2) still depends on `fast-glob@3.3.1`.
The audit's suggested downgrade to `eslint-config-next@14.2.35` would change the
Next.js major version of the lint configuration.

## Temporary scoped replacement

`package.json` overrides `fast-glob` only under `@next/eslint-plugin-next@16.3.8`
with the local package at `tools/next-eslint-glob`. This removes the vulnerable
chain while retaining the current Next.js lint rules and framework version.
The direct `fast-glob` development dependency points to that directory; the
scoped override references it with `$fast-glob` so npm uses the same local copy.
The adapter declares version 3.3.1 to satisfy the caller's exact dependency;
its source is this repository, not the registry's `fast-glob@3.3.1` tarball.

The adapter uses pinned `tinyglobby@0.2.17`, which does not depend on `braces`.
It implements only the plugin's existing `globSync(pattern, { onlyDirectories:
true })` call. It disables automatic directory expansion, preserves absolute
paths, and strips directory suffixes to match the existing caller's expectations.
Unsupported options fail explicitly. It is not a general replacement for
`fast-glob`; do not apply the override globally.

Run `npm run test:eslint-roots` to check the actual plugin with default roots,
literal paths, Windows separators, wildcard and brace patterns, root arrays,
absolute paths, and missing directories. Use `npm ci` to verify reproducibility,
then `npm audit`, `npm run lint`, `npm run typecheck`, and `npm run build`.

When updating the ESLint plugin, review its glob API use and the advisory status.
Remove this override and adapter once the upstream dependency chain is fixed,
and rerun the checks above. The version-scoped override deliberately does not
apply to future plugin versions without review.
