# blackhole 🕳️

> A stunning, visually satisfying CLI tool to instantly scan your hard drive, locate heavy `node_modules` folders, and safely destroy them to reclaim gigabytes of disk space.

> *(A beautiful, interactive CLI built with `@clack/prompts`)*

## The Problem
As developers, we spin up dozens of experimental projects. Each `npm install` brings in hundreds of megabytes of `node_modules`. Very quickly, your hard drive fills up with gigabytes of unused dependencies from projects you haven't touched in 8 months.

**blackhole** makes cleaning your disk actually *fun*.

## Features
- ✨ **Zero configuration required.** Just aim it at a folder.
- 🚀 **Blazing Fast.** Powered by `fast-glob`, it recursively scans massive directories without hanging.
- 📊 **Intelligent Mass Calculation.** It calculates exactly how much space each folder takes up.
- 🛡️ **Interactive Multi-select.** You choose exactly which folders get destroyed using a clean, beautiful CLI interface (powered by `@clack/prompts`).
- 🔥 **Satisfying Destruction.** Permanently wipes gigabytes from your drive in seconds.

## Usage

Simply run this command and pass the root directory you want to scan:

```bash
npx @dinakars777/blackhole ~/Projects
```

For the best experience, install it globally so you can use the short command anytime:
```bash
npm install -g @dinakars777/blackhole

# Now you can just use:
blackhole ~/Projects
blackhole .
```

## How It Works

1. It initiates a highly optimized recursive glob search through the target directory looking for `node_modules`.
2. It pauses to calculate the exact size in bytes of everything inside those folders.
3. It presents you with a sorted interactive checklist (largest folders first).
4. You press `Space` to toggle folders for deletion. 
5. Press `Enter` to confirm.
6. It displays the **total space you will reclaim** (e.g., `4.2 GB`) and asks for one final confirmation.
7. Upon typing `y`, those folders are forcefully and recursively deleted from your disk.

## Contributing

Pull requests are welcome!

```bash
git clone https://github.com/dinakars777/blackhole.git
cd blackhole
npm install
npm run dev ~/TestDirectory
```

## License

MIT
