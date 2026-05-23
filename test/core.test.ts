import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { formatBytes, getDirectorySize } from '../src/core';

test('formatBytes supports units through petabytes', () => {
    assert.equal(formatBytes(0), '0 B');
    assert.equal(formatBytes(1024), '1 KB');
    assert.equal(formatBytes(1024 ** 2), '1 MB');
    assert.equal(formatBytes(1024 ** 3), '1 GB');
    assert.equal(formatBytes(1024 ** 4), '1 TB');
    assert.equal(formatBytes(1024 ** 5), '1 PB');
});

test('getDirectorySize keeps counting siblings after an unreadable entry', () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blackhole-size-'));
    const unreadablePath = path.join(tempDir, '00-unreadable.txt');
    const readablePath = path.join(tempDir, 'zz-readable.txt');
    const readableContents = 'still counted';

    fs.writeFileSync(unreadablePath, 'skip me');
    fs.writeFileSync(readablePath, readableContents);

    const mutableFs = fs as unknown as { statSync: (...args: unknown[]) => fs.Stats };
    const originalStatSync = mutableFs.statSync;

    mutableFs.statSync = (...args: unknown[]) => {
        if (args[0] === unreadablePath) {
            throw new Error('simulated stat failure');
        }

        return originalStatSync(...args);
    };

    try {
        assert.equal(getDirectorySize(tempDir), Buffer.byteLength(readableContents));
    } finally {
        mutableFs.statSync = originalStatSync;
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
});
