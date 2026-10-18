import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
process.chdir(projectRoot);
const require = createRequire(import.meta.url);
const { getRootDirs } = require("@next/eslint-plugin-next/dist/utils/get-root-dirs.js");
const pluginRequire = createRequire(require.resolve("@next/eslint-plugin-next"));
const { globSync } = pluginRequire("fast-glob");
const resolveRoots = (rootDir) =>
  getRootDirs({ cwd: projectRoot, settings: { next: { rootDir } } }).sort();
const absoluteRoot = projectRoot.replaceAll("\\", "/").replace(/\/$/, "");
const directories = readdirSync("src", { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => `src/${entry.name}`)
  .sort();

assert.deepEqual(resolveRoots(undefined), [projectRoot]);
assert.deepEqual(resolveRoots("src/app"), ["src/app"]);
assert.deepEqual(resolveRoots("src\\app"), ["src/app"]);
assert.deepEqual(resolveRoots("src/*"), directories);
assert.deepEqual(resolveRoots("src/{app,components}"), ["src/app", "src/components"]);
assert.deepEqual(resolveRoots(["src/app", "src/components"]), ["src/app", "src/components"]);
assert.deepEqual(resolveRoots("src/!(app)"), directories.filter((entry) => entry !== "src/app"));
assert.deepEqual(resolveRoots("src/__missing_security_test__*"), []);
assert.deepEqual(resolveRoots("src/app/layout.tsx"), []);
assert.deepEqual(resolveRoots(`${absoluteRoot}/src/{app,components}`), [
  `${absoluteRoot}/src/app`,
  `${absoluteRoot}/src/components`,
]);
assert.deepEqual(resolveRoots(path.join(projectRoot, "src", "app")), [`${absoluteRoot}/src/app`]);
assert.throws(() => globSync("src/*", { onlyFiles: true }), /Unsupported/);
console.log("Next.js ESLint root directory checks passed.");
