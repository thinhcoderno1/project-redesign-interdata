import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const modules = new Map();
export function loadProjectModule(file) {
  const candidate = path.resolve(file);
  file = [
    candidate,
    ...[".ts", ".tsx", ".js", ".json"].map((ext) => candidate + ext),
  ].find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
  if (!file) throw new Error(`Missing module: ${candidate}`);
  if (file.endsWith(".json")) return JSON.parse(fs.readFileSync(file, "utf8"));
  if (modules.has(file)) return modules.get(file);
  const compiledModule = { exports: {} };
  modules.set(file, compiledModule.exports);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
  const localRequire = (id) =>
    id === "server-only"
      ? {}
      : id.startsWith("@/")
        ? loadProjectModule(path.join("src", id.slice(2)))
        : id.startsWith(".")
          ? loadProjectModule(path.resolve(path.dirname(file), id))
          : require(id);
  vm.runInThisContext(`(function(require,module,exports){${compiled}\n})`, {
    filename: file,
  })(localRequire, compiledModule, compiledModule.exports);
  modules.set(file, compiledModule.exports);
  return compiledModule.exports;
}
