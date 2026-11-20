import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const browser = await chromium.launch({
  executablePath:
    process.env.POOKIE_BROWSER ||
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 180, height: 180 } });
  await page.goto("http://127.0.0.1:1420/", { waitUntil: "networkidle" });
  await page.evaluate(() => { document.body.style.background = "#15112c"; });
  await page.locator(".pookie-sprite").waitFor();
  await page.evaluate(async () => {
    const sprite = document.querySelector(".pookie-sprite");
    if (!sprite) throw new Error("Mascot not rendered");
    const url = getComputedStyle(sprite).backgroundImage.slice(5, -2);
    await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
  });
  await mkdir(".preview", { recursive: true });
  for (const [name, position] of [
    ["idle", "0% 0%"],
    ["capture", "33.3333% 66.6667%"],
    ["offline", "66.6667% 66.6667%"],
  ]) {
    await page.locator(".pookie-sprite").evaluate((sprite, value) => {
      sprite.style.backgroundPosition = value;
    }, position);
    await page.screenshot({ path: `.preview/${name}.png` });
  }
  await page.setViewportSize({ width: 720, height: 600 });
  await page.evaluate(() => {
    const positions = [
      ["idle", 0, 0], ["blink", 1, 0], ["thinking", 2, 0], ["listening", 3, 0],
      ["speaking", 0, 1], ["happy", 1, 1], ["confused", 2, 1], ["sleepy", 3, 1],
      ["processing", 0, 2], ["capture", 1, 2], ["offline", 2, 2], ["dragging", 3, 2],
      ["error", 0, 3],
    ];
    const original = document.querySelector(".pookie-sprite");
    if (!original) throw new Error("Mascot not rendered");
    document.body.innerHTML = "";
    const grid = document.createElement("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:12px;color:white;text-align:center";
    for (const [name, col, row] of positions) {
      const cell = document.createElement("div");
      cell.style.cssText = "height:140px;position:relative;border:1px solid #393457";
      const sprite = original.cloneNode(true);
      sprite.style.cssText = `width:110px;height:110px;left:24px;top:4px;background-position:${col * 100 / 3}% ${row * 100 / 3}%`;
      cell.append(sprite);
      const label = document.createElement("div");
      label.textContent = name;
      label.style.cssText = "position:absolute;bottom:4px;width:100%";
      cell.append(label);
      grid.append(cell);
    }
    document.body.append(grid);
  });
  await page.screenshot({ path: ".preview/all-states.png" });
} finally {
  await browser.close();
}
