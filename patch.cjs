#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const target = path.join(ROOT, "fix.cjs");

if (!fs.existsSync(target)) {
  console.error("✗ fix.cjs not found in " + ROOT);
  process.exit(1);
}

let src = fs.readFileSync(target, "utf8");

// Already patched?
if (
  /const\s*\{\s*spawnSync\s*,\s*spawn\s*\}\s*=\s*require\(['"]child_process['"]\)/.test(
    src
  )
) {
  console.log("✓ fix.cjs already patched — running it now...");
} else {
  const before = src;
  src = src.replace(
    /const\s*\{\s*spawnSync\s*\}\s*=\s*require\(['"]child_process['"]\);/,
    "const { spawnSync, spawn } = require('child_process');"
  );
  if (src === before) {
    console.error("✗ could not find the import line to patch.");
    console.error("  Open fix.cjs manually and change:");
    console.error("    const { spawnSync } = require('child_process');");
    console.error("  to:");
    console.error("    const { spawnSync, spawn } = require('child_process');");
    process.exit(1);
  }
  fs.writeFileSync(target, src, "utf8");
  console.log("✓ patched: added `spawn` to child_process import");
}

console.log("▶ running fix.cjs ...\n");
const r = spawnSync("node", ["fix.cjs"], { cwd: ROOT, stdio: "inherit" });
process.exit(r.status || 0);
