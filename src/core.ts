import fg from 'fast-glob';
import fs from 'fs';
import path from 'path';

export interface DirectoryInfo {
    path: string;
    sizeBytes: number;
}

/**
 * Super fast glob search for all node_modules in a given directory up to a specific depth.
 */
export async function findNodeModules(baseDir: string): Promise<string[]> {
    const fullPath = path.resolve(process.cwd(), baseDir);

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Directory ${baseDir} does not exist.`);
    }

    // fast-glob requires forward slashes even on Windows
    const searchPattern = fullPath.replace(/\\/g, '/') + '/**/node_modules';

    // Exclude node_modules inside other node_modules to keep it fast and top-level
    const entries = await fg(searchPattern, {
        onlyDirectories: true,
        deep: 4, // Prevent infinite traversal of massive monorepos
        ignore: ['**/node_modules/**/node_modules']
    });

    return entries;
}

/**
 * Recursively calculates the size of a directory.
 */
export function getDirectorySize(dirPath: string): number {
    let size = 0;

    try {
        const files = fs.readdirSync(dirPath, { withFileTypes: true });

        for (const file of files) {
            const fullPath = path.join(dirPath, file.name);
            if (file.isDirectory()) {
                size += getDirectorySize(fullPath);
            } else {
                const stats = fs.statSync(fullPath);
                size += stats.size;
            }
        }
    } catch (error) {
        // Ignore permission errors on specific nested files
    }

    return size;
}

/**
 * Formats bytes into a human readable string (MB, GB)
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Deletes an array of directories cleanly and forcefully.
 */
export function deleteDirectories(directories: string[]): boolean {
    try {
        for (const dir of directories) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
        return true;
    } catch (error) {
        return false;
    }
}
