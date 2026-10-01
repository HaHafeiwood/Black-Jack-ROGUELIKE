const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const bundledModules = 'C:\\Users\\nonol\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules';
const { chromium } = require(path.join(bundledModules, 'playwright'));
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const root = __dirname;

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(`${path.resolve(root)}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { response.writeHead(404).end('not found');return; }
  response.writeHead(200, { 'content-type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });fs.createReadStream(file).pipe(response);
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, executablePath: edge });
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'domcontentloaded' });
    const result = await page.evaluate(async () => {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const ok = (value, message) => { if (!value) throw new Error(message); };
      const equal = (actual, expected, message) => { if (actual !== expected) throw new Error(`${message}: ${actual} !== ${expected}`); };
      const cases = [];
      const check = (name, fn) => { fn();cases.push(name); };
      const waitReady = async () => { for (let i = 0; i < 100; i++) { if (G.battle && !G.battle.busy && G.battle.dealReady !== false) return;await wait(20); }throw new Error('battle did not become ready'); };
      const fresh = async (character = 'warrior', floor = 1, forced = 'ninja') => {
        newGame(character, `precision-${character}-${floor}-${cases.length}`, 'hard');G.floor = floor;G.nodeType = 'battle';startBattle(forced);await wait(750);await waitReady();
        const enemy = G.battle.enemies[0];enemy.maxhp = enemy.curhp = 9999;enemy.shield = 0;enemy.nextDmg = 10;enemy.atk = [10, 10];G.battle.target = enemy.idx;G.battle.defense = 0;G.battle.over = false;G.battle.busy = false;G.battle.dealReady = true;return enemy;
      };
      const hand = total => total === 21 ? [{ r: 10, s: '♠' }, { r: 'A', s: '♥' }] : [{ r: 10, s: '♠' }, { r: total - 10, s: '♥' }];
      const stopTurn = action => { const original = endPlayerTurn;endPlayerTurn = () => {};try { return action(); } finally { endPlayerTurn = original; } };

      let enemy = await fresh();G.battle.hand = hand(21);enemy.shield = 500;const hp = enemy.curhp;stopTurn(attack);
      check('attack: pure shield progress', () => { equal(enemy.curhp, hp, 'pure shield leaves HP');ok(enemy.shield < 500, 'shield was reduced');ok(!!G.battle.precisionTrainingCandidate, 'shield progress creates candidate'); });
      enemy = await fresh();G.battle.hand = hand(21);enemy.type = 'ghost';G.battle.round = 3;stopTurn(attack);
      check('attack: zero progress/invulnerability', () => ok(!G.battle.precisionTrainingCandidate, 'zero progress must not qualify'));
      enemy = await fresh();G.battle.hand = hand(21);enemy.maxEvasion = 1;enemy.evasion = 1;const dodgeBefore = precisionTrainingEnemySnapshot();attackEnemy(10, { busted: true });
      check('attack: dodge is not progress', () => { equal(enemy.evasion, 0, 'dodge was consumed');equal(precisionTrainingEnemyProgress(dodgeBefore), false, 'evasion change is not HP/shield progress');ok(!G.battle.precisionTrainingCandidate, 'dodge cannot qualify'); });

      enemy = await fresh();G.battle.hand = hand(21);const second = { ...enemy, idx: 1, name: 'second', curhp: 9999, maxhp: 9999, shield: 20 };G.battle.enemies.push(second);
      const originalDamage = computeDamage;computeDamage = () => ({ dmg: 10, notes: [], rapid: { segments: 2, customSegments: [10, 10] } });enemy.curhp = enemy.maxhp = 1;stopTurn(attack);computeDamage = originalDamage;
      check('attack: multi-hit/multi-target/revive once', () => { ok(!!G.battle.precisionTrainingCandidate, 'later main segment progress qualifies');equal(G.runLog.filter(entry => entry.type === 'precisionTrainingCandidate').length, 1, 'multi-hit logs one candidate');enemy.curhp = enemy.maxhp;equal(precisionTrainingCandidate('attack', 21), false, 'same battle cannot duplicate after revive'); });
      enemy = await fresh();G.battle.hand = hand(21);enemy.type = 'kun';enemy.name = ENEMIES.kun.name;enemy.maxhp = 100;enemy.curhp = 1;enemy.northTide = 0;enemy.kunAction = 'impact';enemy.kunBaseMaxhp = 100;stopTurn(attack);
      check('attack: phase transition signal', () => { equal(enemy.type, 'peng', 'target transformed');ok(enemy.curhp > 1, 'phase reset restored HP');ok(!!G.battle.precisionTrainingCandidate, 'actual pre-transition damage qualifies'); });

      const defenseCase = async (oldDefense, incoming) => { const target = await fresh();G.battle.defense = oldDefense;G.battle.hand = hand(21);stopTurn(defend);if (incoming === 0) { const pending = G.battle.precisionTrainingPending,resolved = resolveDefenseDamage(0, G.battle.defense, 0);equal(Math.max(0, resolved.blocked - Math.max(0, pending.priorDefense || 0)), 0, 'empty action contribution');dealNewHand();return !!G.battle.precisionTrainingCandidate; }target.nextDmg = incoming;target.atk = [incoming, incoming];endPlayerTurn();await wait(800);return !!G.battle.precisionTrainingCandidate; };
      equal(await defenseCase(20, 10), false, 'old shield alone must not qualify');cases.push('defense: old shield only');
      equal(await defenseCase(20, 21), true, 'one point absorbed by new shield qualifies');cases.push('defense: new shield contribution');
      equal(await defenseCase(0, 0), false, 'no incoming damage must not qualify');cases.push('defense: empty incoming action');

      const samuraiDefense = async mode => { const target = await fresh('samurai');G.battle.hand = hand(21);G.battle.samuraiWeaponState = 'drawn';G.battle.defense = 999;G.battle.mikiriCooldown = 0;stopTurn(mode === 'stance' ? samuraiDefend : samuraiMikiri);target.nextDmg = 20;target.atk = [20, 20];endPlayerTurn();await wait(800);return !!G.battle.precisionTrainingCandidate; };
      equal(await samuraiDefense('stance'), true, 'stance actual reduction qualifies');cases.push('samurai: stance actual reduction');
      equal(await samuraiDefense('mikiri'), true, 'mikiri actual reduction qualifies');cases.push('samurai: mikiri actual reduction');

      await fresh();precisionTrainingCandidate('attack', 21);winBattle();check('result: victory awards', () => equal(G.precisionTrainingStacks, 1, 'victory awards one stack'));
      await fresh();precisionTrainingCandidate('attack', 21);G.hp = 0;gameOver();check('result: death does not award', () => equal(G.precisionTrainingStacks, 0, 'death must not award'));
      await fresh();precisionTrainingCandidate('attack', 21);G.battle.cthulhuPhase = true;G.battle.abyssDistance = 0;G.battle.abyssMax = 20;G.battle.hand = hand(21);stopTurn(escapeAbyss);check('result: escape does not award', () => equal(G.precisionTrainingStacks, 0, 'escape must not award'));

      newGame('warrior', 'precision-caps', 'hard');G.floor = 1;G.battle = { precisionTrainingCandidate: null };precisionTrainingCandidate('attack', 21);awardPrecisionTraining();
      check('caps: same chapter', () => { equal(G.precisionTrainingStacks, 1, 'first chapter award');equal(precisionTrainingAvailable(), false, 'same chapter unavailable'); });
      G.floor = 12;G.battle = { precisionTrainingCandidate: null };precisionTrainingCandidate('defense', 21);awardPrecisionTraining();check('caps: next chapter', () => equal(G.precisionTrainingStacks, 2, 'next chapter can award'));
      for (const floor of [23, 34, 45]) { G.floor = floor;G.battle = { precisionTrainingCandidate: null };precisionTrainingCandidate('attack', 21);awardPrecisionTraining(); }
      check('caps: run maximum five', () => { equal(G.precisionTrainingStacks, 5, 'run cap reached');G.floor = 56;G.battle = {};equal(precisionTrainingAvailable(), false, 'run cap prevents more'); });

      enemy = await fresh();G.passives.push('court');G.battle.hand = [{ r: 'J', s: '♠' }, { r: 'Q', s: '♥' }, { r: 'K', s: '♦' }];stopTurn(attack);check('special: court-forced 21 excluded', () => ok(!G.battle.precisionTrainingCandidate, 'court lock excluded'));
      enemy = await fresh('samurai');G.battle.hand = hand(21);G.battle.samuraiWeaponState = 'sheathed';stopTurn(attack);check('special: iaido excluded', () => ok(!G.battle.precisionTrainingCandidate, 'iaido excluded'));
      enemy = await fresh('samurai');G.battle.hand = hand(21);G.battle.samuraiWeaponState = 'drawn';G.battle.samuraiUltimate = 'firststrike';stopTurn(attack);check('special: ultimate excluded', () => ok(!G.battle.precisionTrainingCandidate, 'ultimate excluded'));
      enemy = await fresh();G.passives.push('insurance');G.battle.hand = [{ r: 10, s: '♠' }, { r: 10, s: '♥' }, { r: 2, s: '♦' }];G.battle.pendingBust = true;stopTurn(attack);check('special: insurance excluded', () => ok(!G.battle.precisionTrainingCandidate, 'bust insurance excluded'));
      enemy = await fresh();G.consumables.throwingKnife = 1;G.battle.consumableUsedRound = -1;useConsumable('throwingKnife');check('special: consumable excluded', () => ok(!G.battle.precisionTrainingCandidate, 'consumable excluded'));
      newGame('warrior', 'precision-bounty', 'hard');startBounty(false, 40, 'test');G.bounty.hand = hand(21);resolveBounty(false);check('special: bounty excluded', () => equal(G.precisionTrainingStacks, 0, 'bounty 21 cannot award'));
      newGame('warrior', 'precision-dev', 'hard');G.developerMode = true;G.floor = 1;G.battle = {};check('special: developer mode excluded', () => equal(precisionTrainingCandidate('attack', 21), false, 'developer mode excluded'));

      enemy = await fresh();G.precisionTrainingStacks = 3;G.battle.hand = hand(18);const baseDamage = computeDamage(G.battle.hand, false).dmg;const beforeHp = enemy.curhp;stopTurn(attack);check('bonus: 17-20 attack +1 per layer', () => equal(beforeHp - enemy.curhp, baseDamage + 3, 'attack gets exactly stack count'));
      await fresh();G.precisionTrainingStacks = 3;G.battle.hand = hand(18);const baseDefense = defenseActionProfile(G.battle.hand, false, suitSpellPlan('defense', G.battle.hand, G.battle.suitMainSuit)).total;stopTurn(defend);check('bonus: 17-20 defense +1 per layer', () => equal(G.battle.defense, baseDefense + 3, 'defense gets exactly stack count'));

      newGame('warrior', 'precision-save', 'hard');const save = { format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: createFloorCheckpoint() };delete save.progress.precisionTrainingStacks;delete save.progress.precisionTrainingChapters;const restored = restoreSave(save).state;
      check('persistence: legacy defaults', () => { equal(restored.precisionTrainingStacks, 0, 'legacy stack default');equal(Object.keys(restored.precisionTrainingChapters).length, 0, 'legacy chapters default');ok(!restored.passives.includes('precisionTraining'), 'not a passive'); });
      check('architecture: not passive/blade/shop content', () => { ok(!ALL_PASSIVES.some(item => item.id === 'precisionTraining'), 'not in passive catalog');ok(!BLADE_DEFS.precisionTraining, 'not in blade forge catalog'); });
      G = restored;G.precisionTrainingStacks = 2;G.precisionTrainingChapters = { 0: true, 1: true };const exported = createRunLogExport('death');check('run log: globalMechanics', () => { equal(exported.globalMechanics.precisionTraining.stacks, 2, 'global stacks');equal(exported.globalMechanics.precisionTraining.chapters[1], true, 'global chapters'); });
      return { cases };
    });
    assert.equal(result.cases.length >= 22, true);console.log(`precision-training tests passed (${result.cases.length} cases): ${result.cases.join('; ')}`);
  } finally { await browser.close();await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error);server.close();process.exitCode = 1; });
