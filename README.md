# blackhole 🕳️

[![npm version](https://img.shields.io/npm/v/@dinakars777/blackhole.svg?style=flat-square)](https://www.npmjs.com/package/@dinakars777/blackhole)
[![npm downloads](https://img.shields.io/npm/dm/@dinakars777/blackhole.svg?style=flat-square)](https://www.npmjs.com/package/@dinakars777/blackhole)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> Scan your hard drive, locate heavy `node_modules` folders, and reclaim gigabytes of disk space.

You've spun up dozens of experimental projects. Each `npm install` brought in hundreds of megabytes you haven't touched in months. **blackhole** makes cleaning your disk actually fun.

## Features

- ✨ Zero configuration — just aim it at a folder
- 🚀 Blazing fast recursive scan powered by `fast-glob`
- 📊 Calculates exact disk usage per folder
- 🛡️ Interactive multi-select — you choose exactly what gets deleted
- 🔥 Permanently wipes gigabytes in seconds

## Quick Start

```bash
npx @dinakars777/blackhole ~/Projects
```

Or install globally:

```bash
npm install -g @dinakars777/blackhole
blackhole ~/Projects
blackhole .
```

## How It Works

1. Recursively scans the target directory for `node_modules` folders
2. Calculates the exact size of each folder
3. Presents a sorted interactive checklist (largest first)
4. Shows the **total space you'll reclaim** before doing anything
5. Deletes only what you confirm

## Tech Stack

| Package | Purpose |
|---|---|
| `fast-glob` | High-performance recursive file scanning |
| `@clack/prompts` | Beautiful interactive CLI UI |
| TypeScript | Type-safe implementation |

## Contributing

```bash
git clone https://github.com/dinakars777/blackhole.git
cd blackhole
npm install
npm run dev ~/TestDirectory
```

## License

MIT
