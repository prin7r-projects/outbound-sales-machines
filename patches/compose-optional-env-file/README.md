# compose-optional-env-file

## Scope

Applies a single targeted change to `docker-compose.yml` in the
`outbound-sales-machines` (Saltrun) repo: both `landing` and `app` services
have their `env_file: .env` short-form declarations converted to the Compose
long-form mapping with `required: false`.

No other services are touched. The `db` service is left as-is (it uses inline
`environment:` and does not reference an env file).

## Rationale

PRI-3475 proved that `docker compose config --quiet` fails on a clean host
because `env_file: .env` is mandatory by default: when no `.env` file exists
in the project root, Compose aborts with:

```
service "landing" refers to undefined file .env
```

This is hostile to clean hosts (CI runners, fresh clones, Paperclip-managed
provisioning) that have not yet been seeded with a runtime `.env` file. The
landing and app services are intentionally tolerant of a missing env file
on first boot — the runtime secrets (`NOWPAYMENTS_API_KEY`,
`NOWPAYMENTS_IPN_SECRET`) are only consumed by the landing's `/api/checkout/
nowpayments` and IPN webhook routes, and the app's secrets arrive through
its own deployment pipeline. Both services can boot and serve traffic with
the env file absent (the landing will surface a clear "missing env" error
on checkout attempts, the app has its own env provisioning layer).

The fix is the Compose long-form `env_file` syntax with `required: false`:

```yaml
env_file:
  - path: .env
    required: false
```

This tells Compose: "load `.env` if it exists, otherwise continue." The
existing `db` service does not need this change because it does not use
`env_file`.

## Required runtime secrets (unchanged)

- `NOWPAYMENTS_API_KEY`
- `NOWPAYMENTS_IPN_SECRET`

This patch does **not** create placeholder values for these. Operators
must provision the live `.env` on the host (see repo `README.md` →
"Production deploy"). The `required: false` flag makes the absence
non-fatal at compose-time, not at runtime.

## Contents

- `README.md` — this file
- `apply.sh` — the patch applier (idempotent, safe to re-run)

## What `apply.sh` does

1. Locates `docker-compose.yml` in the repo root (the parent directory of
   the `patches/` folder).
2. **Classifies the file** into one of three states by counting the
   relevant lines (short-form `- .env` lines, `env_file:` keys, long-form
   `- path: .env` entries, `required: false` entries):
   - `ALREADY_PATCHED` (0 short / 2 keys / 2 long / 2 required) → prints
     a one-line summary, leaves the file untouched, **exits 0**. This
     is the rerun path; running `apply.sh` against an already-patched
     `docker-compose.yml` is a no-op success.
   - `PRE_PATCH` (2 short / 2 keys / 0 long / 0 required) → runs the
     rewrite and exits 0 on success.
   - `UNEXPECTED` (any other combination, including partial / mixed
     shapes where one service is short-form and the other is long-form)
     → prints a clear error with the observed counts, leaves the file
     untouched, and **exits 1**. The script will not silently rewrite
     something it doesn't recognize.
3. The rewrite step uses a small `awk` script so we do not depend on
   `python` or `yq` being installed. A post-rewrite sanity check verifies
   the file landed in the `ALREADY_PATCHED` shape before the temp file is
   moved into place.
4. Prints a one-line summary of what changed.

The script is **idempotent** — re-running it against an already-patched
`docker-compose.yml` exits 0 with the file unchanged. The expected
post-patch state (2 `env_file:` keys, 2 long-form `- path: .env`
entries, 2 `required: false` entries, 0 short-form `- .env` lines) is
verified on every run, so the file cannot drift.

## Verification

After running the script, verify with:

```bash
# 1. Check git diff is exactly the long-form rewrite on both services
git diff -- docker-compose.yml

# 2. If docker is available, validate the compose file
docker compose config --quiet && echo OK
```

On hosts without `docker`, leave verification to the supervisor / Paperclip
provisioning step.

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-06-02 | Initial patch — convert landing + app `env_file` to long-form with `required: false`. Tracks PRI-3478 (follow-up to PRI-3475). | Wave 2 fix agent |
