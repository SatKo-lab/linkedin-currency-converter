# linkedin-currency-converter

A currency conversion API, backed by official US Treasury exchange rate data.

**Live API**: https://linkedin-currency-converter.sathishkottravel.workers.dev

## For everyone

This is a small web service that converts amounts between US Dollars and other currencies, using official exchange rates published by the [US Treasury](https://fiscaldata.treasury.gov/datasets/treasury-reporting-rates-exchange/). It only supports conversions where one side of the conversion is USD (e.g. USD → EUR or EUR → USD), not conversions between two non-USD currencies (e.g. CAD → EUR).

The API is protected — every request needs a valid access token, and requests are rate-limited per caller to keep the service available for everyone.

Example request (replace `<token>` with a valid API token):

```
curl -H "Authorization: Bearer <token>" \
  "https://linkedin-currency-converter.sathishkottravel.workers.dev/api/v1/convert?from=USD&to=EUR&amount=100"
```

```json
{ "from": "USD", "to": "EUR", "amount": 100, "rate": 0.877, "result": 87.7 }
```

See what's changed recently in [CHANGELOG.md](./CHANGELOG.md).

## For developers

### Stack

- [Hono](https://hono.dev/) on [Cloudflare Workers](https://developers.cloudflare.com/workers/), deployed via [Wrangler](https://developers.cloudflare.com/workers/wrangler/).
- TypeScript, tested with [Vitest](https://vitest.dev/) — including [`@cloudflare/vitest-pool-workers`](https://developers.cloudflare.com/workers/testing/vitest-integration/) for tests that run inside the real Workers runtime.

### Project layout

Application code lives under `generated/claude/api/v1/` (source, tests, and the exchange-rate CSV data), per `requirements.md`. `wrangler.jsonc`'s `main` points at its entry point.

```
generated/claude/api/v1/
  src/            # Hono app: routes, controllers, services, types
  test/
    unit/         # isolated unit tests (Node)
    functional/   # full request/response cycle via app.request() (Node)
    integration/  # runs inside the real workerd runtime (cloudflareTest())
```

### API

All endpoints are under `/api/v1` and require `Authorization: Bearer <token>`.

| Method | Path                | Description                              |
| ------ | ------------------- | ----------------------------------------- |
| GET    | `/api/v1/health`    | Health check                              |
| GET    | `/api/v1/currencies`| List available currency codes             |
| GET    | `/api/v1/convert`   | Convert `amount` between `from` and `to`  |

### Setup

```bash
pnpm install
pnpm dev            # wrangler dev, local server
```

Local dev reads the bearer token from a `.dev.vars` file (gitignored) — copy `.dev.vars.example` to `.dev.vars` and set your own value.

### Scripts

| Command                 | What it does                                      |
| ------------------------ | -------------------------------------------------- |
| `pnpm typecheck`         | `tsc --noEmit`                                     |
| `pnpm test`               | Runs all three test projects (unit/functional/integration) |
| `pnpm test:unit` / `test:functional` / `test:integration` | Run one project only |
| `pnpm test:coverage`     | `pnpm test` with an Istanbul coverage report        |
| `pnpm deploy`            | `wrangler deploy` (normally handled by CI, see below) |

### CI/CD

- **`.github/workflows/ci.yml`** — typecheck + full test suite + coverage, on every PR and every push to `main`.
- **`.github/workflows/deploy.yml`** — deploys to Cloudflare Workers on every push to `main` (after tests pass).
- **`.github/workflows/release.yml`** — cuts a version release (changelogs, git tag, GitHub Release) only when a PR titled `Release-vX.Y.Z` is merged — not on every merge. See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full release process and PR-title conventions, and [CHANGELOG-DEV.md](./CHANGELOG-DEV.md) for the full contributor changelog.

### Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for PR title conventions and the release process, and the PR template for what to include when opening one.
