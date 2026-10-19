/** Assets copied verbatim from the supplied Vibe Coding project. */
export function withAssetPrefix(path: string) {
  return `/images/vps-vibe-coding${path.replace(/^\/images/, "")}`;
}
