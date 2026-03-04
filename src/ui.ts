import { intro, outro, spinner, multiselect, confirm, isCancel } from '@clack/prompts';
import pc from 'picocolors';
import { DirectoryInfo, formatBytes } from './core';

export function showIntro() {
    intro(pc.bgMagenta(pc.black(' blackhole 🕳️ ')));
}

export function showSuccess(message: string) {
    outro(pc.green(`✔ ${message}`));
}

export function showError(message: string) {
    outro(pc.red(`✖ ${message}`));
}

export function getSpinner() {
    return spinner();
}

/**
 * Prompts the user to select which node_modules to delete via interactive checklist.
 */
export async function promptSelection(directories: DirectoryInfo[]): Promise<DirectoryInfo[]> {
    const options = directories.map((dir) => ({
        value: dir,
        label: `${dir.path} - ${pc.bold(pc.yellow(formatBytes(dir.sizeBytes)))}`,
    }));

    const selected = await multiselect({
        message: 'Select the blackholes to collapse (Space to toggle, Enter to confirm)',
        options,
        required: false,
    });

    if (isCancel(selected)) {
        outro(pc.dim('Operation cancelled. No space reclaimed.'));
        process.exit(1);
    }

    return selected as DirectoryInfo[];
}

/**
 * Final confirmation before permanent deletion.
 */
export async function confirmDeletion(totalSize: string): Promise<boolean> {
    const shouldDelete = await confirm({
        message: pc.bgRed(pc.white(` 🔥 Permanently clear ${totalSize} of disk space? This cannot be undone.`)),
        initialValue: true,
    });

    if (isCancel(shouldDelete)) {
        outro(pc.dim('Operation cancelled. Enjoy your bloated drive!'));
        process.exit(1);
    }

    return shouldDelete;
}
