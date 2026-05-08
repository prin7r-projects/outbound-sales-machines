#!/usr/bin/env node
/**
 * [SALTRUN_SCREENSHOT] Capture landing-desktop.png and landing-mobile.png
 * from the live deploy.
 *
 * Usage:
 *   node scripts/capture-landing-screenshots.mjs
 *   node scripts/capture-landing-screenshots.mjs http://localhost:3000
 *
 * Defaults to https://outbound-sales-machines.prin7r.com.
 */

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const URL = process.argv[2] ?? "https://outbound-sales-machines.prin7r.com";
const OUT_DIR = resolve(__dirname, "../docs/screenshots");

mkdirSync(OUT_DIR, { recursive: true });

const targets = [
  { name: "landing-desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  { name: "landing-mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 }
];

const browser = await chromium.launch();
try {
  for (const target of targets) {
    const ctx = await browser.newContext({
      viewport: target.viewport,
      deviceScaleFactor: target.deviceScaleFactor
    });
    const page = await ctx.newPage();
    console.log(`[SALTRUN_SCREENSHOT] ${URL} -> ${target.name}.png (${target.viewport.width}x${target.viewport.height})`);
    await page.goto(URL, { waitUntil: "networkidle", timeout: 60_000 });
    // Let webfonts settle
    await page.waitForTimeout(1500);
    await page.screenshot({ path: resolve(OUT_DIR, `${target.name}.png`), fullPage: true });
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`[SALTRUN_SCREENSHOT] saved to ${OUT_DIR}`);
