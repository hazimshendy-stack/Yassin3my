#!/usr/bin/env node
'use strict';
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const out = path.join(ROOT, 'egy-skills-src-' + stamp + '.tar.gz');
const excludes = [
  '--exclude=node_modules', '--exclude=.git', '--exclude=dist',
  '--exclude=build', '--exclude=.next', '--exclude=coverage',
  '--exclude=.backup-*', '--exclude=errors.txt', '--exclude=fix.cjs',
  '--exclude=bundle.txt', '--exclude=*.log',
];
const args = ['-czf', out].concat(excludes).concat(['.']);
const res = spawnSync('tar', args, { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
if (res.status !== 0) {
  console.error('tar failed.');
  process.exit(1);
}
const size = (fs.statSync(out).size / 1024).toFixed(1);
console.log('Archive created:', path.basename(out), '(' + size + ' KB)');
