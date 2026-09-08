#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, '..');
const toolBin = path.join(projectRoot, '.tools', 'bin');
const wailsName = process.platform === 'win32' ? 'wails.exe' : 'wails';
const wailsPath = path.join(toolBin, wailsName);
const wailsModule = 'github.com/wailsapp/wails/v2/cmd/wails@v2.15.0';
const [command, ...args] = process.argv.slice(2);

const usage = `Usage:
  node tools/project-tools.mjs install
  node tools/project-tools.mjs wails <arguments...>

Project-local binaries are installed in .tools/bin and are not committed.`;

const exitWithUsage = () => {
  console.error(usage);
  process.exit(1);
};

const run = (executable, commandArgs, options = {}) => {
  const child = spawn(executable, commandArgs, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
    ...options,
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
  child.on('error', (error) => {
    console.error(`Failed to start ${executable}: ${error.message}`);
    process.exit(1);
  });
};

if (command === 'install') {
	if (args.length > 0) {
		exitWithUsage();
	}
	mkdirSync(toolBin, { recursive: true });
  const result = spawnSync('go', ['install', wailsModule], {
    cwd: projectRoot,
    env: { ...process.env, GOBIN: toolBin },
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  console.log(`Installed Wails CLI at ${wailsPath}`);
  process.exit(0);
}

if (command === 'wails') {
  if (!existsSync(wailsPath)) {
    console.error(`Project Wails CLI is missing: ${wailsPath}`);
    console.error('Run: node tools/project-tools.mjs install');
    process.exit(1);
  }
  run(wailsPath, args);
} else {
  exitWithUsage();
}
