# Contributing

## PR titles: Conventional Commits

Every PR title should follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>
```

Types used by this repo (matching the release workflow's changelog categorization):

| Type       | Meaning                                       | Shows in `CHANGELOG.md` (user-facing) |
| ---------- | ---------------------------------------------- | :------------------------------------: |
| `feat`     | A new feature                                  | ✅ |
| `fix`      | A bug fix                                      | ✅ |
| `perf`     | A performance improvement                      | ✅ |
| `revert`   | Reverts a previous change                      | ✅ |
| `docs`     | Documentation only                             | — |
| `style`    | Formatting, no code meaning change             | — |
| `refactor` | Code change that isn't a fix or a feature      | — |
| `test`     | Adding or correcting tests                     | — |
| `build`    | Build system or dependency changes             | — |
| `ci`       | CI/CD configuration changes                    | — |
| `chore`    | Anything else                                  | — |

Types marked "—" still appear in `CHANGELOG-DEV.md`, the full contributor changelog.

For a breaking change, add `!` after the type/scope, e.g. `feat(api)!: remove /legacy endpoint`. Breaking changes get their own "⚠ BREAKING CHANGES" section at the top of both changelogs.

A title that doesn't follow this format still merges fine — it just lands in the dev changelog's "Other Changes" section instead of a proper category, and won't appear in the user-facing changelog at all.

This isn't enforced by CI (no PR check blocks a non-conforming title) — it's a convention to follow when opening a PR, because **the title is read verbatim to build the changelog** when a release is cut.

## Merging

Use "Create a merge commit" (not squash or rebase) when merging PRs into `main`. The release workflow reads merge-commit bodies (which GitHub populates with the PR title) to find what shipped since the last release — squash/rebase merges won't produce that history.

## Cutting a release

Releases are **not** automatic — every merge to `main` deploys (see `deploy.yml`), but nothing is tagged or added to the changelogs until you explicitly cut a release:

1. Open a PR titled exactly `Release-vX.Y.Z` (e.g. `Release-v1.2.0`), following [semver](https://semver.org/). This can be your next regular PR (just use the release title instead of a conventional-commit one) or, if there's nothing else to merge, a PR from a branch with an empty commit: `git commit --allow-empty -m "chore: release vX.Y.Z"`.
2. Merge it (as a merge commit, per above).
3. `.github/workflows/release.yml` takes it from there: generates `CHANGELOG.md`/`CHANGELOG-DEV.md` entries from every merged PR title since the previous release tag, bumps `package.json`'s version, commits both back to `main`, tags the commit `vX.Y.Z`, and publishes a GitHub Release using the user-facing changelog section as its notes.

The version-bump commit is marked `[skip deploy]` so it doesn't trigger a second, redundant deploy of unchanged code.
