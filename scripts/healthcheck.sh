#!/bin/sh
# [PRI-2923 healthcheck] Cheap on-host probe for the Saltrun landing.
#
# Usage:
#   sh scripts/healthcheck.sh                  # default URL
#   sh scripts/healthcheck.sh https://outbound-sales-machines.prin7r.com
#
# Returns 0 when the landing returns 2xx and the hero copy is present.
# Returns 1 otherwise. No secrets are read or written. Intended for use
# from cron, Traefik healthchecks, or a supervisor loop on the deploy host.

set -eu

URL=${1:-https://outbound-sales-machines.prin7r.com}

if ! command -v curl >/dev/null 2>&1; then
    echo "healthcheck: error: curl is required" >&2
    exit 1
fi

status=$(curl -s -o /tmp/saltrun-healthcheck.html -w '%{http_code}' --max-time 15 "$URL" || echo 000)
case "$status" in
    2*) ;;
    *)
        echo "healthcheck: FAIL ${URL} status=${status}"
        exit 1
        ;;
esac

# Hero copy must be present in the static HTML (not waiting on client JS).
required="Saltrun Outbound is Throughput Q2 2026 ops@prin7r.com"
missing=""
for needle in $required; do
    if ! grep -q "$needle" /tmp/saltrun-healthcheck.html; then
        missing="$missing $needle"
    fi
done
if [ -n "$missing" ]; then
    echo "healthcheck: FAIL ${URL} missing copy:${missing}"
    exit 1
fi

bytes=$(wc -c < /tmp/saltrun-healthcheck.html | tr -d ' ')
rm -f /tmp/saltrun-healthcheck.html
echo "healthcheck: OK ${URL} status=${status} bytes=${bytes}"
exit 0
