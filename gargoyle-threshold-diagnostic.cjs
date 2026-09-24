const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = __dirname;
const routes = 10000;
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(request.url.split('?')[0]);
  const file = path.join(root, pathname === '/' ? 'index.html' : pathname.slice(1));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403);response.end();return; }
  fs.readFile(file, (error, data) => {
    response.writeHead(error ? 404 : 200, { 'Content-Type': file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });
    response.end(error ? '' : data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' });
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'load' });
    const result = await page.evaluate(({ routes }) => {
      const simulate = threshold => {
        let before33 = 0, through33 = 0, eligibleAt22 = 0, eligibleAt33 = 0, ultimateQualified = 0;
        for (let route = 0; route < routes; route++) {
          newGame(null, `gargoyle-diagnostic-${route}`);
          G.passives = ['faithneck'];G.upgrades = [];G.faction = 0;G.eventChance = BASE_EVENT_CHANCE;G.shopChance = BASE_SHOP_CHANCE;G.altarSeen = false;
          let firstGargoyle = null;
          for (let floor = 1; floor <= 97; floor++) {
            G.floor = floor;
            if (isBossFloor(floor)) {
              const eligible = G.faction >= threshold;
              if (floor === 22 && eligible) eligibleAt22++;
              if (floor === 33 && eligible) eligibleAt33++;
              const bosses = [{ key: 'dragon', weight: 1 }, { key: 'bloodDemon', weight: 1 }];
              if (chapterIndex(floor) + 1 >= SAMURAI_BOSS_UNLOCK_CHAPTER) bosses.push({ key: 'samurai', weight: .85 });
              if (eligible) bosses.push({ key: 'gargoyle', weight: 1 });
              const picked = weightedBossKey(bosses);
              if (picked === 'gargoyle' && firstGargoyle == null) firstGargoyle = floor;
              continue;
            }
            if (isRestFloor(floor)) continue;
            const node = decideCurrentNode();
            if (node === 'battle') {
              G.eventChance = Math.min(1, (G.eventChance || BASE_EVENT_CHANCE) + EVENT_CHANCE_STEP);
              continue;
            }
            G.eventChance = BASE_EVENT_CHANCE;
            if (node !== 'ordinaryChurch' && node !== 'darkChurch') continue;
            if (gameRandom() < .75) {
              const base = node === 'ordinaryChurch' ? 100 : 220;
              G.faction += scaledFaithEventAmount(base, floor);
            } else {
              G.faction = Math.max(0, G.faction - scaledFaithEventAmount(50, floor));
            }
          }
          if (firstGargoyle != null && firstGargoyle < 33) before33++;
          if (firstGargoyle != null && firstGargoyle <= 33) through33++;
          if (G.faction >= 800) ultimateQualified++;
        }
        const pct = value => Number((value / routes * 100).toFixed(2));
        return {
          threshold,
          routes,
          eligibleAt22Percent: pct(eligibleAt22),
          eligibleAt33Percent: pct(eligibleAt33),
          firstGargoyleBefore33Percent: pct(before33),
          firstGargoyleThrough33Percent: pct(through33),
          ultimateQualifiedPercent: pct(ultimateQualified),
        };
      };
      return { assumptions: { sameFactionSupportPercent: 75, leavePercent: 25, faithNecklaceChurchWeight: CHURCH_EVENT_WEIGHT + FAITH_NECK_CHURCH_BONUS, chapterMultipliers: [...FAITH_EVENT_CHAPTER_MULTIPLIERS] }, old: simulate(200), current: simulate(GARGOYLE_REPUTATION_THRESHOLD) };
    }, { routes });
    fs.writeFileSync(path.join(root, 'gargoyle-threshold-diagnostic-results.json'), JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result, null, 2));
    await page.close();
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error);server.close();process.exitCode = 1; });
