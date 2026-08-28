const { chromium } = require('playwright');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://127.0.0.1:4173/';
const GAMES = Number(process.env.GAMES || 40);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitReady(page) {
  for (let i = 0; i < 300; i++) {
    await page.evaluate(() => {
      const choice = document.querySelector('[data-character="warrior"]');
      if (choice && !document.querySelector('#screen-character').classList.contains('hidden')) choice.click();
      const faithIntroLeave = document.querySelector('#faith-intro-leave');
      if (faithIntroLeave && !document.querySelector('#screen-event').classList.contains('hidden')) faithIntroLeave.click();
    });
    const ready = await page.evaluate(() => {
      const button = document.querySelector('#btn-stand');
      return button && !button.disabled && !document.querySelector('#screen-battle').classList.contains('hidden');
    });
    if (ready) return;
    await sleep(10);
  }
  throw new Error('Battle controls did not become ready');
}

async function interactionTest(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await waitReady(page);

  const initial = await page.evaluate(() => ({
    version: document.querySelector('#version').textContent,
    passives: [...document.querySelectorAll('.pcard-chip .pn')].map(node => node.textContent),
    cards: document.querySelectorAll('#pl-cards .card').length,
    attackVisible: Boolean(document.querySelector('#btn-stand').offsetParent),
    defendVisible: Boolean(document.querySelector('#btn-defend').offsetParent),
  }));

  // Force a safe ace draw so the Hit interaction is deterministic.
  await page.evaluate(() => G.battle.deck.push({ r: 'A', s: '♠', red: false }));
  await page.click('#btn-hit');
  await sleep(450);
  const afterHit = await page.evaluate(() => ({
    cards: document.querySelectorAll('#pl-cards .card').length,
    log: document.querySelector('#log').textContent,
  }));

  const dealGuard = await page.evaluate(() => {
    dealNewHand();
    const cardsBefore = G.battle.hand.length;
    hit();
    return { cardsBefore, cardsAfterEarlyHit: G.battle.hand.length, hitDisabled: document.querySelector('#btn-hit').disabled };
  });
  await sleep(800);

  const defenseCurve = await page.evaluate(() => {
    const originalHand = G.battle.hand;
    const originalStreak = G.battle.guardStreak;
    G.battle.hand = [{ r: 10, s: '♠', red: false }, { r: 10, s: '♥', red: true }];
    const values = [0, 1, 2, 3, 4].map(streak => {
      G.battle.guardStreak = streak;
      return computeDefense(G.battle.hand);
    });
    G.battle.hand = originalHand;
    G.battle.guardStreak = originalStreak;
    return values;
  });

  await page.click('#btn-defend');
  await sleep(120);
  const afterDefend = await page.evaluate(() => ({
    defense: G.battle.defense,
    focus: G.battle.focus,
    log: document.querySelector('#log').textContent,
  }));
  await waitReady(page);

  const hpBeforeAttack = await page.evaluate(() => currentTarget().curhp);
  await page.click('#btn-stand');
  await sleep(120);
  const afterAttack = await page.evaluate(() => ({
    targetHp: currentTarget() ? currentTarget().curhp : 0,
    focus: G.battle.focus,
    log: document.querySelector('#log').textContent,
  }));

  const deathUi = await page.evaluate(() => {
    G.hp = 0;
    gameOver();
    const save = document.querySelector('#ui-save');
    return {
      reportVisible: document.querySelector('#death-report').textContent.includes('最高樓層'),
      reportHasSeed: document.querySelector('#death-report').textContent.includes(G.seedCode),
      saveBlocked: save.disabled && save.classList.contains('hidden'),
    };
  });

  await page.close();
  return {
    initial,
    safeHitAddedCard: afterHit.cards === initial.cards + 1 && afterHit.log.includes('抽到 A♠'),
    dealGuarded: dealGuard.cardsAfterEarlyHit === dealGuard.cardsBefore && dealGuard.hitDisabled,
    defenseCurve,
    defenseActionLogged: afterDefend.log.includes('選擇防禦'),
    focusGained: afterDefend.focus > 0,
    attackActionLogged: afterAttack.log.includes('選擇攻擊'),
    focusAppliedAndConsumed: afterAttack.log.includes('蓄勢+') && afterAttack.focus === 0,
    attackDamagedTarget: afterAttack.targetHp < hpBeforeAttack || /對.+造成/.test(afterAttack.log),
    deathReportVisible: deathUi.reportVisible && deathUi.reportHasSeed,
    deathSaveBlocked: deathUi.saveBlocked,
    errors,
  };
}

async function runGame(page, useDefense) {
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.click('[data-character="warrior"]');
  let attacks = 0;
  let defenses = 0;
  let steps = 0;

  while (steps++ < 500) {
    await sleep(5);
    const state = await page.evaluate(() => ({
      floor: G.floor,
      hp: G.hp,
      gold: G.gold,
      end: !document.querySelector('#screen-end').classList.contains('hidden'),
      shop: !document.querySelector('#screen-shop').classList.contains('hidden'),
      bounty: !document.querySelector('#screen-bounty').classList.contains('hidden'),
      bountyResolved: Boolean(G.bounty && G.bounty.resolved),
      bountyTotal: G.bounty ? handTotal(G.bounty.hand) : 0,
      upgrade: !document.querySelector('#screen-upgrade').classList.contains('hidden'),
      drop: !document.querySelector('#screen-drop').classList.contains('hidden'),
      battle: !document.querySelector('#screen-battle').classList.contains('hidden'),
      duck: Boolean(G.battle && G.battle.duck),
      busy: Boolean(G.battle && G.battle.busy),
      over: Boolean(G.battle && G.battle.over),
      total: G.battle && G.battle.hand ? handTotal(G.battle.hand) : 0,
      round: G.battle && G.battle.round,
      guardStreak: G.battle && G.battle.guardStreak || 0,
      defense: G.battle && G.battle.defense || 0,
      incoming: G.battle && G.battle.enemies
        ? G.battle.enemies.filter(enemy => enemy.curhp > 0).reduce((sum, enemy) => sum + (enemy.nextDmg || 0), 0)
        : 0,
      ghostInvincible: G.battle && G.battle.enemies
        ? G.battle.enemies.some(enemy => enemy.curhp > 0 && enemy.idx === G.battle.target && enemy.type === 'ghost' && G.battle.round % 3 === 0)
        : false,
    }));

    if (state.end || state.hp <= 0) return { win: false, floor: state.floor, hp: state.hp, attacks, defenses, steps };
    if (state.floor >= 6) return { win: true, floor: state.floor, hp: state.hp, attacks, defenses, steps };

    if (state.bounty) {
      if (state.bountyResolved || state.bountyTotal >= 17) await page.evaluate(() => document.querySelector('#bounty-cash').click());
      else await page.evaluate(() => document.querySelector('#bounty-hit').click());
      continue;
    }

    if (state.shop) {
      await page.evaluate(() => {
        const affordable = [...document.querySelectorAll('button[data-buy]')]
          .filter(button => Number(button.dataset.cost) <= G.gold)
          .sort((a, b) => Number(b.dataset.cost) - Number(a.dataset.cost));
        if (affordable[0]) affordable[0].click();
        if (G.hp <= 55) {
          const heal = document.querySelector('button[data-heal]');
          if (heal && Number(heal.dataset.cost) <= G.gold) heal.click();
        }
        document.querySelector('#btn-leave-shop').click();
      });
      continue;
    }
    if (state.upgrade) {
      await page.evaluate(() => (document.querySelector('#upgrade-list button') || document.querySelector('#btn-skip-upgrade')).click());
      continue;
    }
    if (state.drop) {
      await page.evaluate(() => document.querySelector('#btn-drop-continue').click());
      continue;
    }
    if (!state.battle || state.busy) continue;
    if (state.duck) {
      await page.evaluate(() => document.querySelector('#btn-duck').click());
      continue;
    }
    if (state.over) continue;

    if (state.total < 17) {
      const canHit = await page.evaluate(() => !document.querySelector('#btn-hit').disabled);
      if (canHit) {
        await page.evaluate(() => document.querySelector('#btn-hit').click());
        continue;
      }
    }

    const shouldDefend = useDefense && state.total <= 21 && state.guardStreak < 2
      && (state.ghostInvincible || Math.max(0, state.incoming - state.defense) >= Math.max(8, state.hp * 0.18));
    if (shouldDefend) {
      defenses++;
      await page.evaluate(() => document.querySelector('#btn-defend').click());
    } else {
      attacks++;
      await page.evaluate(() => document.querySelector('#btn-stand').click());
    }
  }
  const final = await page.evaluate(() => ({ floor: G.floor, hp: G.hp }));
  return { win: false, timeout: true, ...final, attacks, defenses, steps };
}

async function strategyTest(browser, games, useDefense) {
  const page = await browser.newPage();
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (callback, delay, ...args) => nativeSetTimeout(callback, Math.min(delay || 0, 3), ...args);
  });
  const results = [];
  for (let i = 0; i < games; i++) results.push(await runGame(page, useDefense));
  await page.close();
  const wins = results.filter(result => result.win);
  return {
    games,
    wins: wins.length,
    winRate: wins.length / games,
    averageFinishHp: wins.length ? wins.reduce((sum, result) => sum + result.hp, 0) / wins.length : 0,
    averageFloor: results.reduce((sum, result) => sum + result.floor, 0) / games,
    averageAttacks: results.reduce((sum, result) => sum + result.attacks, 0) / games,
    averageDefenses: results.reduce((sum, result) => sum + result.defenses, 0) / games,
    timeouts: results.filter(result => result.timeout).length,
  };
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE });
  try {
    const interaction = await interactionTest(browser);
    const mechanics = await browser.newPage().then(async page => {
      await page.goto(URL, { waitUntil: 'domcontentloaded' });
      await page.click('[data-character="warrior"]');
      await page.waitForTimeout(20);
      await page.evaluate(() => document.querySelector('#faith-intro-leave')?.click());
      await page.waitForTimeout(700);
      const combatMechanics = await page.evaluate(() => {
        const firstBossHp = {
          dragon: scaledEnemy('dragon', 0, 5).maxhp,
          demon: scaledEnemy('demon', 0, 5).maxhp,
        };
        G.battle.focus = 12;
        G.battle.hand = [{ r: 'K', s: '♠', red: false }, { r: 'Q', s: '♥', red: true }, { r: 2, s: '♣', red: false }];
        G.battle.pendingBust = true;
        G.battle.busy = false;
        resolveBust();
        G.passives.push('buckler');
        G.battle.bucklerUses = 0;
        G.battle.bucklerBroken = false;
        const bucklerNormal = [0, 1, 2, 3, 4].map(() => useBuckler().def);
        const bucklerBrokeAfterFour = G.battle.bucklerBroken && G.battle.bucklerUses === 4;
        G.upgrades.push('buckler');
        G.battle.bucklerUses = 0;
        G.battle.bucklerBroken = false;
        const bucklerUpgraded = [useBuckler().def, useBuckler().def];
        const upgradedBucklerUsedDurability = G.battle.bucklerUses !== 0;
        return {
          firstBossHp,
          bustClearedFocus: G.battle.focus === 0,
          bustPenaltyLogged: document.querySelector('#log').textContent.includes('蓄勢潰散：失去 12 點蓄勢'),
          bucklerNormal,
          bucklerBrokeAfterFour,
          bucklerUpgraded,
          upgradedBucklerUsedDurability,
        };
      });
      await page.waitForTimeout(800);
      const economyMechanics = await page.evaluate(() => {
        G.shopChance = 1;
        const guaranteedShop = rollEventType() === 'shop' && G.shopChance === BASE_SHOP_CHANCE;
        const squirrels = [0, 1, 2].map(index => scaledEnemy('squirrel', index, 25));
        G.battle = { enemies: squirrels };
        G.gold = 1000;
        const stolenBySquirrel = squirrels.map(squirrelSteal);
        const goldAfterSteals = G.gold;
        const recoveredFromSecond = recoverSquirrelGold(squirrels[1]);
        return { guaranteedShop, stolenBySquirrel, goldAfterSteals, recoveredFromSecond, squirrelBalances: squirrels.map(enemy => enemy.stolenGold || 0) };
      });
      await page.close();
      return { ...combatMechanics, ...economyMechanics };
    });
    const attackOnly = await strategyTest(browser, GAMES, false);
    const mixed = await strategyTest(browser, GAMES, true);
    console.log(JSON.stringify({ interaction, mechanics, attackOnly, mixed }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
