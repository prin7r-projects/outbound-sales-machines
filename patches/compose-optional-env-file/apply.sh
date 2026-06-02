#!/bin/sh
# patches/compose-optional-env-file/apply.sh
#
# Converts the `env_file: .env` short-form declarations on the `landing` and
# `app` services in `docker-compose.yml` to the Compose long-form mapping
# with `required: false`. This makes a missing `.env` non-fatal at
# `docker compose config` time on clean hosts.
#
# Idempotent. Safe to re-run. Classifies the file into one of three states
# (PRE_PATCH, ALREADY_PATCHED, UNEXPECTED) and only mutates the file in
# PRE_PATCH. Refuses partial or mixed shapes so we never silently rewrite
# an unrelated configuration.
#
# Usage (from repo root):
#   sh patches/compose-optional-env-file/apply.sh

set -eu

# Resolve repo root as the parent of the patches/ directory containing this
# script. The script lives at:
#   <repo-root>/patches/compose-optional-env-file/apply.sh
# so REPO_ROOT is three levels up.
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "${SCRIPT_DIR}/../.." && pwd)
COMPOSE_FILE="${REPO_ROOT}/docker-compose.yml"

if [ ! -f "${COMPOSE_FILE}" ]; then
    printf 'apply.sh: error: %s not found\n' "${COMPOSE_FILE}" >&2
    exit 1
fi

# State detection. Classify docker-compose.yml by counting the relevant
# lines. Expected values:
#
#   PRE_PATCH (apply the rewrite):
#     2 short-form "- .env" lines, 2 "env_file:" keys,
#     0 long-form "path: .env" entries, 0 "required: false" entries
#
#   ALREADY_PATCHED (idempotent no-op, exit 0):
#     0 short-form "- .env" lines, 2 "env_file:" keys,
#     2 long-form "path: .env" entries, 2 "required: false" entries
#
#   UNEXPECTED (refuse, exit 1): any other combination, including a
#     partial / mixed shape (e.g. one short-form block + one long-form
#     block). We never silently rewrite something we don't recognize.
SHORT_COUNT=$(grep -cE '^[ 	]+- \.env[ 	]*$' \
    "${COMPOSE_FILE}" || true)
KEY_COUNT=$(grep -cE '^[ 	]+env_file:[ 	]*$' \
    "${COMPOSE_FILE}" || true)
LONG_COUNT=$(grep -cE '^[ 	]+- path: \.env[ 	]*$' \
    "${COMPOSE_FILE}" || true)
REQUIRED_COUNT=$(grep -cE '^[ 	]+required: false[ 	]*$' \
    "${COMPOSE_FILE}" || true)

# State: ALREADY_PATCHED -> idempotent no-op success.
if [ "${SHORT_COUNT}" -eq 0 ] && [ "${KEY_COUNT}" -eq 2 ] \
    && [ "${LONG_COUNT}" -eq 2 ] && [ "${REQUIRED_COUNT}" -eq 2 ]; then
    printf 'apply.sh: OK - already patched (no changes needed).\n'
    printf 'apply.sh: short-form "- .env" count: 0\n'
    printf 'apply.sh: env_file: key count: 2\n'
    printf 'apply.sh: long-form  "path: .env" count: 2\n'
    printf 'apply.sh: required: false count: 2\n'
    exit 0
fi

# State: PRE_PATCH -> run the rewrite. Falls through into the awk block
# below and exits 0 on success.
if [ "${SHORT_COUNT}" -eq 2 ] && [ "${KEY_COUNT}" -eq 2 ] \
    && [ "${LONG_COUNT}" -eq 0 ] && [ "${REQUIRED_COUNT}" -eq 0 ]; then
    : # proceed into the awk block
else
    # State: UNEXPECTED -> refuse with a clear error.
    printf 'apply.sh: error: unexpected shape in %s\n' \
        "${COMPOSE_FILE}" >&2
    printf '  short-form "- .env" count: %s (expected 0 or 2)\n' \
        "${SHORT_COUNT}" >&2
    printf '  "env_file:" key count: %s (expected 2)\n' \
        "${KEY_COUNT}" >&2
    printf '  long-form  "path: .env" count: %s (expected 0 or 2)\n' \
        "${LONG_COUNT}" >&2
    printf '  "required: false" count: %s (expected 0 or 2)\n' \
        "${REQUIRED_COUNT}" >&2
    printf 'apply.sh: refusing to patch an unexpected configuration.\n' >&2
    exit 1
fi

# Apply the rewrite using POSIX awk (present on every Unix we care about).
# The substitution replaces the two-line pattern
#     env_file:
#       - .env
# with the long-form
#     env_file:
#       - path: .env
#         required: false
# preserving the leading whitespace on the env_file: line.
#
# The child list item under env_file: is always indented two spaces deeper
# than the env_file: key itself in this compose file, so we compute the
# child indent by appending "  " to the captured key indent.
TMP_FILE="${COMPOSE_FILE}.apply.tmp"

awk '
    {
        if (in_env_file_block) {
            # We are on the line immediately following env_file:.
            # Check if it is the short-form "- .env" with matching indent.
            short_re = "^" child_indent "- \\.env[ \t]*$"
            if (match($0, short_re)) {
                # Emit the buffered env_file: line, then the long-form
                # mapping, then skip the input line.
                print env_file_line
                print child_indent "- path: .env"
                print child_indent "  required: false"
                in_env_file_block = 0
                next
            } else {
                # Not our pattern; emit the buffered env_file: line and
                # fall through to emit this line.
                print env_file_line
                in_env_file_block = 0
            }
        }

        # Detect env_file: at start of a line (allowing leading indent).
        if (match($0, "^[ \t]+env_file:[ \t]*$")) {
            key_indent = $0
            sub(/env_file:.*$/, "", key_indent)  # leading whitespace only
            child_indent = key_indent "  "        # YAML list indent (+2)
            env_file_line = $0
            in_env_file_block = 1
            next
        }

        print
    }
    END {
        if (in_env_file_block) {
            # Trailing env_file: with no following list item - emit as-is.
            print env_file_line
        }
    }
' "${COMPOSE_FILE}" > "${TMP_FILE}"

# Sanity check: post-rewrite must have zero short-form "- .env" lines,
# exactly 2 "env_file:" key lines, exactly 2 long-form "path: .env"
# lines, plus 2 "required: false" lines.
POST_SHORT=$(grep -cE '^[ 	]+- \.env[ 	]*$' \
    "${TMP_FILE}" || true)
POST_KEY=$(grep -cE '^[ 	]+env_file:[ 	]*$' \
    "${TMP_FILE}" || true)
POST_LONG=$(grep -cE '^[ 	]+- path: \.env[ 	]*$' \
    "${TMP_FILE}" || true)
POST_REQUIRED=$(grep -cE '^[ 	]+required: false[ 	]*$' \
    "${TMP_FILE}" || true)

if [ "${POST_SHORT}" -ne 0 ] || [ "${POST_KEY}" -ne 2 ] \
    || [ "${POST_LONG}" -ne 2 ] || [ "${POST_REQUIRED}" -ne 2 ]; then
    printf 'apply.sh: error: post-rewrite sanity check failed.\n' >&2
    printf '  short-form "- .env" count: expected 0, got %s\n' \
        "${POST_SHORT}" >&2
    printf '  "env_file:" key count: expected 2, got %s\n' \
        "${POST_KEY}" >&2
    printf '  long-form  "path: .env" count: expected 2, got %s\n' \
        "${POST_LONG}" >&2
    printf '  "required: false" count: expected 2, got %s\n' \
        "${POST_REQUIRED}" >&2
    rm -f "${TMP_FILE}"
    exit 1
fi

# Atomic-ish replace: write tmp back to original. We keep this inside the
# repo root so it lands in the git working tree.
mv "${TMP_FILE}" "${COMPOSE_FILE}"

printf 'apply.sh: OK - converted 2 short-form env_file: .env blocks to long-form with required: false.\n'
printf 'apply.sh: changed file: %s\n' "${COMPOSE_FILE}"
