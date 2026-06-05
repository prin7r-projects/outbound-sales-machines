// PRI-5485 screenshot harness — captures the local prelaunch + rewrite-target
// surfaces (the code change is on origin/main commit dc43e57; the local
// standalone build at 127.0.0.1:3118 reflects the post-change state).
//
// Usage:
//   LD_LIBRARY_PATH=/paperclip/.agent-browser/lib \
//     node scripts/pri5485-shot.mjs
//
// Output: docs/screenshots/pri5485/{prelaunch-desktop.png,
//         prelaunch-mobile.png, app-rewrite-desktop.png,
//         app-rewrite-mobile.png, dashboard-rewrite-desktop.png,
//         checkout-rewrite-desktop.png}

import pw from '/paperclip/instances/default/workspaces/no-code-vertical-tools/node_modules/playwright/index.js';
import fs from 'node:fs';

const { chromium } = pw;
const CHROME = '/paperclip/.cache/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell';
const BASE = process.argv[2] || 'http://127.0.0.1:3118';
const OUT = process.argv[3] || 'docs/screenshots/pri5485';

const TARGETS = [
  { name: 'prelaunch',           path: '/prelaunch', viewport: 'desktop' },
  { name: 'app-rewrite',         path: '/app',       viewport: 'desktop' },
  { name: 'dashboard-rewrite',   path: '/dashboard', viewport: 'desktop' },
  { name: 'checkout-rewrite',    path: '/checkout',  viewport: 'desktop' },
  { name: 'prelaunch-mobile',    path: '/prelaunch', viewport: 'mobile' },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900,  deviceScaleFactor: 2 },
  mobile:  { width: 390,  height: 844,  deviceScaleFactor: 2, isMobile: true },
};

fs.mkdirSync(OUT, { recursive: true });
const report = { capturedAt: new Date().toISOString(), base: BASE, results: [] };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  for (const t of TARGETS) {
    const ctx = await browser.newContext({ viewport: VIEWPORTS[t.viewport] });
    const page = await ctx.newPage();
    // Skip font requests that cause the SkFontMgr crash in this environment.
    await ctx.route('**/*', (route) => {
      const url = route.request().url();
      const type = route.request().resourceType();
      if (type === 'font' || /\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url)) return route.abort();
      return route.continue();
    });
    const url = `${BASE}${t.path}`;
    const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    const status = resp ? resp.status() : 0;
    const out = `${OUT}/${t.name}.png`;
    await page.screenshot({ path: out, fullPage: true });
    report.results.push({ url, status, out });
    await ctx.close();
  }
} finally {
  await browser.close();
}

fs.writeFileSync(`${OUT}/_report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
