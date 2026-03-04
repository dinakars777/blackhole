#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import { findNodeModules, getDirectorySize, formatBytes, deleteDirectories, DirectoryInfo } from './core';
import { showIntro, showSuccess, showError, getSpinner, promptSelection, confirmDeletion } from './ui';

const program = new Command();

program
    .name('blackhole')
    .description('🕳️ A visually satisfying CLI tool to scan and destroy heavy, unused node_modules folders.')
    .version('1.0.0')
    .argument('<directory>', 'The root directory to scan (e.g., ~/Projects or .)');

program.parse(process.argv);

async function main() {
    const basePath = program.args[0];

    if (!basePath) {
        console.error(pc.red('✖ Error: Please provide a root directory to scan.'));
        console.log(pc.dim('Example: npx @dinakars777/blackhole ~/Projects'));
        process.exit(1);
    }

    showIntro();
    const s = getSpinner();

    try {
        s.start(`Scanning ${pc.cyan(basePath)} for blackholes... (might take a few seconds)`);

        // 1. Find the paths
        const paths = await findNodeModules(basePath);

        if (paths.length === 0) {
            s.stop('Scan complete!');
            showSuccess(`Your space is completely clean. No node_modules found in ${basePath} ✨`);
            process.exit(0);
        }

        s.message(`Found ${paths.length} targets! Calculating mass...`);

        // 2. Calculate their sizes sequentially for accurate progress
        const directories: DirectoryInfo[] = [];
        for (const p of paths) {
            const sizeBytes = getDirectorySize(p);
            directories.push({ path: p, sizeBytes });
        }

        // Sort by largest to smallest
        directories.sort((a, b) => b.sizeBytes - a.sizeBytes);

        s.stop(`Mass calculation complete.`);

        // 3. User selects what to delete
        const selectedDirs = await promptSelection(directories);

        if (selectedDirs.length === 0) {
            showSuccess('Nothing selected. Everything is safe.');
            process.exit(0);
        }

        // 4. Calculate total savings
        const totalBytes = selectedDirs.reduce((acc, dir) => acc + dir.sizeBytes, 0);
        const formattedTotal = formatBytes(totalBytes);

        // 5. Final Confirmation
        const isConfirmed = await confirmDeletion(formattedTotal);

        if (isConfirmed) {
            const pathsToDelete = selectedDirs.map((d) => d.path);
            s.start(`Collapsing ${pathsToDelete.length} blackholes...`);

            const success = deleteDirectories(pathsToDelete);

            if (success) {
                s.stop('Collapsed!');
                showSuccess(`Successfully destroyed and reclaimed ${pc.bold(pc.green(formattedTotal))} of space! 🚀`);
            } else {
                s.stop('Error during deletion.');
                showError('Some directories failed to delete. You may need elevated permissions.');
            }
        } else {
            showSuccess('Deletion aborted. You are safe.');
        }

    } catch (error: any) {
        if (s) s.stop('Failed');
        showError(error.message || 'An unknown error occurred');
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(pc.red('An unexpected error occurred:'), err);
    process.exit(1);
});
