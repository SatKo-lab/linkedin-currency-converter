# Developer Changelog

Full changelog for contributors, including internal/tooling changes not listed in [CHANGELOG.md](./CHANGELOG.md).

## [0.1.0] - 2026-09-05

### Features

- add release workflow with dual changelogs and PR template

### Other Changes

- Add script to safely verify an API bearer token
- Protect /api/v1 endpoints with bearer token auth + rate limiting
- Update notes with session prompt history
- Add Cloudflare Workers deploy workflow
- Add CI workflow for pull requests and pushes to main
- Add code coverage reporting
- Add functional and integration test layers
- Namespace API routes under /api/v1 instead of root
