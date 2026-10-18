/* eslint-disable @typescript-eslint/no-require-imports -- The Next.js ESLint plugin loads this adapter synchronously through CommonJS. */
const { globSync: tinyGlobSync } = require("tinyglobby");
const { isAbsolute } = require("node:path");
/* eslint-enable @typescript-eslint/no-require-imports */

// The pinned Next.js ESLint plugin only uses globSync(pattern, { onlyDirectories: true }).
// This adapter deliberately does not implement the rest of fast-glob's API.
exports.globSync = (pattern, options) => {
  if (
    typeof pattern !== "string" ||
    options?.onlyDirectories !== true ||
    Object.keys(options).length !== 1
  ) {
    throw new Error("Unsupported Next.js ESLint glob options; review the adapter.");
  }

  return tinyGlobSync(pattern, {
    onlyDirectories: true,
    expandDirectories: false,
    absolute: isAbsolute(pattern),
  }).map((directory) =>
    directory === "/" || /^[a-z]:\/$/i.test(directory)
      ? directory
      : directory.replace(/\/$/, ""),
  );
};
