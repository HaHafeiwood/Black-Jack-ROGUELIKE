const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const URL = 'http://127.0.0.1:4173/';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE });
  try {
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    const sample = await page.evaluate(async () => {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const waitTurn = async () => { for (let i = 0; i < 150; i++) { if (G.battle && !G.battle.busy && G.battle.dealReady !== false) return;await wait(20); } };
      newGame('warrior', 'run-log-sample-seed');
      G.gold = 5000;G.floor = 2;G.nodeType = 'shop';G.nodeStarted = false;openShop();
      const buy = [...document.querySelectorAll('#shop-items button[data-cost]')].find(button => !button.disabled && Number(button.dataset.cost) > 0);
      if (buy) buy.click();
      G.collectorMaterials = [{ r: 2, s: '♠', red: false }];
      performDeckWorkshopOperation('materialReplace', { deckIndex: G.deck.findIndex(card => card.r === 3), materialIndex: 0 });
      G.consumables = { throwingKnife: 1, ironPlate: 1 };G.floor = 32;G.nodeType = 'rest';G.nodeStarted = true;delete G._restSupplyVisit;openRestEvent();openRestSupply();G._restSupplyVisit.selectedId = 'molotov';confirmRestSupply();
      G.floor = 33;G.nodeType = 'battle';G.nodeStarted = false;startBattle('paladin');await wait(900);
      if (consumableCount('molotov')) useConsumable('molotov');
      G.battle.hand = [{ r: 10, s: '♠', red: false }, { r: 7, s: '♥', red: true }];G.battle.dealReady = true;attack();await waitTurn();
      G.battle.hand = [{ r: 10, s: '♦', red: true }, { r: 8, s: '♣', red: false }];G.battle.dealReady = true;defend();await waitTurn();
      G.battle.enemies.forEach(enemy => enemy.curhp = 0);winBattle();await wait(30);
      startBounty(false, 40, 'treasureChest');await wait(20);resolveBounty(false);
      G.bounty = null;G.floor = 34;G.nodeType = 'battle';startBattle('paladin');await wait(900);G.hp = 0;gameOver();
      const before = { timeline: JSON.stringify(G.runLog), rng: JSON.stringify(G.rngState), calls: G.rngCalls };
      renderDeathReport();renderTop();createRunLogExport('death');createRunLogExport('death');
      const after = { timeline: JSON.stringify(G.runLog), rng: JSON.stringify(G.rngState), calls: G.rngCalls };
      return { json: createRunLogExport('death'), pureViewsReadOnly: JSON.stringify(before) === JSON.stringify(after), button: !!document.querySelector('#btn-download-run-log') };
    });
    const beforeDownload = await page.evaluate(() => ({ timeline: JSON.stringify(G.runLog), rng: JSON.stringify(G.rngState), calls: G.rngCalls }));
    const downloadName = await page.evaluate(() => { let name = '';const original = HTMLAnchorElement.prototype.click;HTMLAnchorElement.prototype.click = function(){ name = this.download; };try{document.querySelector('#btn-download-run-log').click();}finally{HTMLAnchorElement.prototype.click = original;}return name; });
    const afterDownload = await page.evaluate(() => ({ timeline: JSON.stringify(G.runLog), rng: JSON.stringify(G.rngState), calls: G.rngCalls, saveDisabled: document.querySelector('#ui-save').disabled }));

    const checkpoint = await page.evaluate(() => {
      newGame('warrior', 'run-log-checkpoint');recordRunEvent('eventResult', { marker: 'completed' });captureFloorCheckpoint();recordRunEvent('eventResult', { marker: 'rollback' });
      const saved = currentSaveData(), restored = restoreSave(saved).state;
      const old = JSON.parse(JSON.stringify(saved));delete old.progress.runLog;delete old.progress.runLogSeq;delete old.progress.runLogHistoryComplete;delete old.progress.runLogInitialState;
      const migrated = restoreSave(old).state;
      newGame('warrior','run-log-node-reentry');G.floor=10;G.nodeType='rest';G.nodeStarted=false;captureFloorCheckpoint();const entrySave=currentSaveData();G=restoreSave(entrySave).state;enterCurrentNode();enterCurrentNode();const nodeEntries=G.runLog.filter(entry=>entry.type==='nodeEnter'&&entry.floor===10).length;
      return { restored: restored.runLog.map(entry => entry.data.marker), complete: restored.runLogHistoryComplete, oldLength: migrated.runLog.length, oldComplete: migrated.runLogHistoryComplete,nodeEntries };
    });

    const deterministic = await page.evaluate(() => {
      const run = () => { newGame('warrior', 'run-log-determinism');G.floor = 2;G.nodeType = 'shop';G.nodeStarted = false;openShop();return { rngState: [...G.rngState], rngCalls: G.rngCalls, timeline: G.runLog }; };
      const a = run(), b = run();return JSON.stringify(a) === JSON.stringify(b);
    });
    const developer = await page.evaluate(() => { newGame('warrior', 'run-log-dev');const stats = JSON.stringify(runStats());G.developerMode = true;G.hp = 1;G.gold = 999999;startBattle('dev:gargoyleParty');const out = createRunLogExport('death'),start=out.timeline.find(entry=>entry.type==='battleStart');return { flagged: out.developerModeUsed, statsUnchanged: stats === JSON.stringify(runStats()),multiBossLogged:!!start&&start.data.enemies.length===3&&start.data.enemies.some(enemy=>enemy.type==='gargoyle') }; });
    await page.close();

    const out = sample.json;
    assert.equal(sample.pureViewsReadOnly, true);
    assert.equal(sample.button, true);
    assert.equal(downloadName.startsWith('blackjack-run-log-floor-'), true);
    assert.deepEqual({ timeline: afterDownload.timeline, rng: afterDownload.rng, calls: afterDownload.calls }, beforeDownload);
    assert.equal(afterDownload.saveDisabled, true);
    assert.equal(out.logSchemaVersion, 1);
    assert.equal(out.result, 'death');
    assert.equal(out.developerModeUsed, false);
    assert.equal(typeof out.finalState.reputation, 'string');
    assert.equal(Object.hasOwn(out.finalState, 'faction'), false);
    assert.deepEqual(checkpoint.restored, ['completed']);
    assert.equal(checkpoint.complete, true);
    assert.equal(checkpoint.oldLength, 0);
    assert.equal(checkpoint.oldComplete, false);
    assert.equal(checkpoint.nodeEntries, 1);
    assert.equal(deterministic, true);
    assert.deepEqual(developer, { flagged: true, statsUnchanged: true, multiBossLogged: true });
    const types = new Set(out.timeline.map(entry => entry.type));
    ['shopBatch','shopPurchase','deckChange','eventChoice','consumableUse','battleStart','playerAction','enemyAction','battleEnd','bountyStart','bountyResult'].forEach(type => assert.equal(types.has(type), true, `missing ${type}`));
    assert.equal(out.timeline.some(entry => entry.type === 'playerAction' && entry.data.action === 'defense' && entry.data.result.defenseGained > 0), true, 'missing defense result');

    const samplePath = path.join(__dirname, 'run-log-sample.json');
    fs.writeFileSync(samplePath, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
    const sampleBytes = fs.statSync(samplePath).size;
    // Diagnostic estimate: twenty compact state-changing entries per floor is a conservative long-run workload.
    const perFloor = 20;
    const projected = { ...out, summary: { ...out.summary, highestFloor: 100 }, timeline: Array.from({ length: perFloor * 100 }, (_, index) => ({ ...out.timeline[index % out.timeline.length], seq: index + 1, floor: Math.floor(index / perFloor) + 1 })) };
    const estimated100FloorBytes = Buffer.byteLength(JSON.stringify(projected), 'utf8');
    console.log(JSON.stringify({ passed: true, samplePath, sampleBytes, estimated100FloorBytes, timelineEntries: out.timeline.length, eventTypes: [...types].sort() }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error);process.exitCode = 1; });
