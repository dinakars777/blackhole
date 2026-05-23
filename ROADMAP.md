# blackhole Roadmap

This roadmap is based on the current CLI shape: `src/index.ts` owns the command flow, `src/core.ts` owns scanning, sizing, formatting, and deletion, and `src/ui.ts` owns the interactive prompts.

## Baseline

Recently fixed:

- Clean installs now work from the committed `package.json` and `package-lock.json`.
- The production dependency audit is clean.
- Byte formatting supports TB and PB values.
- Directory sizing keeps scanning siblings when one nested entry cannot be read.
- The npm package now builds `dist/index.js` before packing and only ships runtime files.
- Core utility tests run through `npm test`.

## Priorities

1. Make deletion safer and easier to trust.
2. Make scans more accurate and configurable across real project layouts.
3. Keep release and packaging quality automated.
4. Add useful automation surfaces without weakening the interactive default.

## Near Term: Safety And Trust

### Dry-run mode

Add a `--dry-run` flag that scans and reports reclaimable space without prompting for deletion.

Acceptance criteria:

- `blackhole --dry-run <directory>` never deletes files.
- Output includes matched directories and total reclaimable bytes.
- Tests cover dry-run behavior without invoking prompts.

### Explicit deletion controls

Add a non-interactive deletion mode that requires an explicit confirmation flag, such as `--yes`, and a path selection input, such as `--all` or repeated `--include`.

Acceptance criteria:

- Automation can run without prompts only when destructive intent is explicit.
- Running a destructive non-interactive command without `--yes` exits with a clear error.
- Interactive behavior remains the default.

### Safer deletion backend

Evaluate moving selected directories to the OS trash when available, with force-delete as an explicit option.

Acceptance criteria:

- Default deletion has a recoverable path on supported platforms.
- Force deletion remains available for large folders or CI-style usage.
- Failure reporting names the directories that could not be removed.

## Next: Scan Accuracy And Performance

### Configurable scan depth

Replace the hard-coded `deep: 4` scan limit with a CLI option and documented default.

Acceptance criteria:

- Users can scan deeper monorepos when needed.
- The README explains the default depth and performance tradeoff.
- Tests cover depth-limited and deeper matches using fixture directories.

### Exclude patterns

Add repeatable `--exclude <glob>` support so users can skip generated folders, archives, mounted volumes, or vendor trees.

Acceptance criteria:

- Excludes are passed into `fast-glob` alongside the nested `node_modules` guard.
- Multiple excludes can be supplied.
- README examples show common excludes.

### Bounded concurrent size calculation

Measure and then parallelize directory-size calculations with a concurrency limit.

Acceptance criteria:

- Large scans complete faster than the current sequential loop.
- Progress remains understandable in the CLI.
- Permission or stat errors stay isolated to the affected entry.

## Next: Release Confidence

### GitHub Actions CI

Add CI for every pull request.

Acceptance criteria:

- CI runs `npm ci`, `npm test`, `npm run build`, `npm audit --omit=dev`, and `npm pack --dry-run`.
- Required checks are enabled before merging release-sensitive changes.
- The CI workflow uses the intended supported Node version.

### Release checklist

Document the release path for npm publishing.

Acceptance criteria:

- Maintainers have one checklist for version bump, build, pack verification, npm publish, and smoke test.
- The checklist includes `npx @dinakars777/blackhole --version` after publish.
- The release path clarifies whether tags and changelogs are manual or automated.

### Package provenance

Evaluate npm provenance and signed release tags.

Acceptance criteria:

- The repo documents whether npm provenance is enabled.
- Release artifacts can be traced back to a GitHub commit.

## Later: Product Surface

### JSON output

Add `--json` for scripts and dashboards.

Acceptance criteria:

- JSON output includes path, size bytes, formatted size, and deletion status.
- JSON mode does not mix prompt text with machine-readable output.

### Age-aware cleanup

Add optional age filters to focus on stale installs.

Acceptance criteria:

- Users can filter by last modified time.
- The README explains filesystem timestamp limitations.

### Better scan summaries

Improve the final report with counts, total selected space, failed deletions, and skipped paths.

Acceptance criteria:

- Success output shows what changed.
- Partial failure output is actionable.
- Tests cover the summary builder as a pure function.
