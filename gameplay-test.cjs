const { chromium } = require('playwright');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const URL = 'http://127.0.0.1:4173/';
const GAMES = Number(process.env.GAMES || 40);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function waitReady(page) {
  for (let i = 0; i < 300; i++) {
    await page.evaluate(() => {
      const choice = document.querySelector('[data-character="warrior"]');
      if (choice && !document.querySelector('#screen-character').classList.contains('hidden')) {
        document.querySelector('#character-seed').value = 'gameplay-test-battle';
        choice.click();
      }
      const faithIntroLeave = document.querySelector('#faith-intro-leave');
      if (faithIntroLeave && !document.querySelector('#screen-event').classList.contains('hidden')) faithIntroLeave.click();
    });
    const ready = await page.evaluate(() => {
      const button = document.querySelector('#btn-stand');
      return button && !button.disabled && !document.querySelector('#screen-battle').classList.contains('hidden')
        && typeof G !== 'undefined' && G.battle && Array.isArray(G.battle.deck) && G.battle.dealReady;
    });
    if (ready) return;
    await sleep(10);
  }
  const state = await page.evaluate(() => ({
    screen: [...document.querySelectorAll('[id^="screen-"]')].find(node => !node.classList.contains('hidden'))?.id,
    nodeType: typeof G === 'undefined' ? null : G.nodeType,
    battle: typeof G === 'undefined' || !G.battle ? null : { keys: Object.keys(G.battle), dealReady: G.battle.dealReady, busy: G.battle.busy },
  }));
  throw new Error(`Battle controls did not become ready: ${JSON.stringify(state)}`);
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
      event: !document.querySelector('#screen-event').classList.contains('hidden'),
      treasure: !document.querySelector('#screen-treasure-reward').classList.contains('hidden'),
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

    if (state.event) {
      await page.evaluate(() => (document.querySelector('#faith-intro-leave') || document.querySelector('#event-actions button:not([disabled])'))?.click());
      continue;
    }

    if (state.treasure) {
      await page.evaluate(() => document.querySelector('#treasure-reward-continue')?.click());
      continue;
    }

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
      await waitReady(page);
      const combatMechanics = await page.evaluate(() => {
        const firstBossHp = {
          dragon: scaledEnemy('dragon', 0, 5).maxhp,
          bloodDemon: scaledEnemy('bloodDemon', 0, 5).maxhp,
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
        const bustClearedFocus = G.battle.focus === 0;
        const bustPenaltyLogged = document.querySelector('#log').textContent.includes('蓄勢潰散：失去 12 點蓄勢');
        const zanshinSeries = upgraded => {
          G.character = 'samurai';
          G.passives = upgraded === null ? [] : ['bulwark'];
          G.upgrades = upgraded ? ['bulwark'] : [];
          G.battle = { samuraiZanshinAttack: 0, samuraiZanshinReduction: 0, samuraiZanshinTurns: 0, samuraiZanshinDuration: 0 };
          grantPlayerZanshin(false);
          settlePlayerZanshin('mikiri');
          const profiles = [];
          while (playerZanshinProfile()) {
            const profile = playerZanshinProfile();
            profiles.push({ attackBonus: profile.attack - 1, reduction: profile.reduction, turns: profile.turns, duration: profile.duration });
            settlePlayerZanshin('attack');
          }
          return profiles;
        };
        const zanshinBase = zanshinSeries(null);
        const zanshinBulwark = zanshinSeries(false);
        const zanshinBulwarkUpgraded = zanshinSeries(true);
        G.character = 'samurai';
        G.passives = ['bulwark'];
        G.upgrades = [];
        G.battle = { samuraiZanshinAttack: 0, samuraiZanshinReduction: 0, samuraiZanshinTurns: 0, samuraiZanshinDuration: 0 };
        grantPlayerZanshin(true);
        const strongInitialUnchanged = playerZanshinProfile().attack === 1.35 && playerZanshinProfile().reduction === 0.20;
        settlePlayerZanshin('mikiri');
        settlePlayerZanshin('attack');
        const weakDidNotReplaceStrong = !grantPlayerZanshin(false) && G.battle.samuraiZanshinAttack === 0.35 && G.battle.samuraiZanshinDuration === 4;
        G.upgrades = ['bulwark'];
        const upgradedRefresh = grantPlayerZanshin(true) && G.battle.samuraiZanshinTurns === 5 && G.battle.samuraiZanshinDuration === 5;
        G.battle.samuraiZanshinRefreshed = false;
        settlePlayerZanshin('mikiri');
        const failedMikiriCleared = playerZanshinProfile() === null;
        G.battle = { samuraiZanshinAttack: 0, samuraiZanshinReduction: 0, samuraiZanshinTurns: 0, samuraiZanshinDuration: 0, lockedSkills: [{ id: 'bulwark' }] };
        G.upgrades = ['bulwark'];
        grantPlayerZanshin(false);
        const lockedBulwarkUsesBaseDuration = G.battle.samuraiZanshinDuration === 3;
        const samuraiRejectsGeneralBulwark = !persistentDefenseActive() && !bulwarkCounterattackActive();
        G.battle.lockedSkills = [];
        G.upgrades = ['bulwark'];
        renderPassives();
        renderCodex();
        const samuraiDescriptions = {
          passive: document.querySelector('.pcard-chip .pd')?.textContent || '',
          codex: [...document.querySelectorAll('#codex-list .codex-card')].find(card => card.querySelector('.cn')?.textContent.includes('壁壘'))?.textContent || '',
          status: [...document.querySelectorAll('#status-list .codex-card')].find(card => card.querySelector('.cn')?.textContent.includes('殘心'))?.textContent || '',
          character: CHARACTERS.find(character => character.id === 'samurai').desc,
        };
        G.character = 'warrior';
        G.battle = { lockedSkills: [] };
        const warriorKeepsGeneralBulwark = persistentDefenseActive() && bulwarkCounterattackActive();
        const warriorBulwarkDescriptionUnchanged = passiveDescription(ALL_PASSIVES.find(passive => passive.id === 'bulwark'), true) === ALL_PASSIVES.find(passive => passive.id === 'bulwark').descUp;
        const ratios = series => series.map(profile => profile.attackBonus / 0.25);
        const near = (actual, expected) => actual.length === expected.length && actual.every((value, index) => Math.abs(value - expected[index]) < 1e-12);
        const zanshinDecayMatches = near(ratios(zanshinBase), [1, 2 / 3, 1 / 3])
          && near(ratios(zanshinBulwark), [1, 0.75, 0.5, 0.25])
          && near(ratios(zanshinBulwarkUpgraded), [1, 0.8, 0.6, 0.4, 0.2]);
        G.character = 'samurai';
        G.passives = ['bulwark'];
        G.upgrades = ['bulwark'];
        G.blades = ['bulwark'];
        G.activeBlade = 'bulwark';
        G.preferredBlade = 'bulwark';
        G.sealedPassive = 'bulwark';
        G.battle = { hand: [], over: false, lockedSkills: [{ id: 'bulwark' }], stolenUpgrades: [{ id: 'bulwark' }], samuraiFlow: 0, samuraiWeaponState: 'sheathed', samuraiZanshinAttack: 0, samuraiZanshinReduction: 0, samuraiZanshinTurns: 0, samuraiZanshinDuration: 0, samuraiZanshinGuardUsed: false, samuraiZanshinPreserved: false };
        grantPlayerZanshin(false);
        const forgedBulwarkProtection = hasP('bulwark') && isUp('bulwark') && G.battle.samuraiZanshinDuration === 5;
        const bladeDefinition = BLADE_DEFS.bulwark.name === '不動太刀' && BLADE_DEFS.bulwark.sourceId === 'bulwark' && BLADE_DEFS.bulwark.icon === '🏯' && BLADE_DEFS.bulwark.type === '太刀';
        const iaidoMultipliers = [0, 1, 2, 3, 4, 5].map(turns => immovableIaidoMultiplier(turns ? { turns } : null));
        const iaidoMultipliersMatch = near(iaidoMultipliers, [1.10, 1.15, 1.20, 1.25, 1.30, 1.35]);
        G.battle.samuraiZanshinAttack = 0.25;
        G.battle.samuraiZanshinReduction = 0.15;
        G.battle.samuraiZanshinTurns = 5;
        G.battle.samuraiZanshinDuration = 5;
        const resonanceBaseAndLongThought = immovableResonanceGain(playerZanshinProfile(), 49) === 5 && immovableResonanceGain(playerZanshinProfile(), 50) === 7;
        const separatedIaidoAndZanshin = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg === 169;
        G.battle.samuraiFlow = 25;
        G.battle.samuraiZanshinFresh = false;
        G.battle.samuraiZanshinGuardUsed = false;
        const guardFirstUse = preserveImmovableZanshin(1);
        settlePlayerZanshin('stance');
        const guardSkippedOneDecay = G.battle.samuraiZanshinTurns === 5 && G.battle.samuraiZanshinGuardUsed && !G.battle.samuraiZanshinPreserved;
        const guardCannotRepeat = !preserveImmovableZanshin(1);
        G.passives.push('firststrike');
        G.blades.push('firststrike');
        G.activeBlade = 'firststrike';
        const switchingBladeDidNotResetGuard = G.battle.samuraiZanshinGuardUsed && !immovableGuardReady(1);
        G.activeBlade = 'bulwark';
        G.battle.samuraiZanshinAttack = 0.35;
        G.battle.samuraiZanshinReduction = 0.20;
        G.battle.samuraiFlow = 74;
        const unfallenThreshold = !immovableUnfallenReady(20, 1) && (addSamuraiFlow(1, '測試不墜門檻'), immovableUnfallenReady(20, 1));
        G.activeBlade = 'firststrike';
        const otherBladeCannotUseUnfallen = !immovableUnfallenReady(20, 1) && immovableResonanceGain(playerZanshinProfile(), 100) === 0;
        G.activeBlade = 'bulwark';
        G.battle.samuraiFlow = 100;
        G.battle.samuraiWeaponState = 'drawn';
        const ultimateInfo = samuraiUltimateInfo();
        G.battle.samuraiUltimate = 'bulwark';
        const ultimateProfile = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);
        const immovableUltimateReady = ultimateInfo?.ready && ultimateInfo.name === '一念不動';
        const immovableUltimateMath = ultimateProfile.dmg === 270 && ultimateProfile.shieldPierce === 0.5;
        settleSamuraiUltimate('bulwark', '一念不動');
        const immovableUltimateCleanup = !playerZanshinProfile() && G.battle.samuraiFlow === 0 && G.battle.samuraiWeaponState === 'sheathed' && !G.battle.samuraiZanshinGuardUsed;
        G.battle.samuraiFlow = 100;
        G.battle.samuraiZanshinAttack = 0.35;
        G.battle.samuraiZanshinReduction = 0.20;
        G.battle.samuraiZanshinTurns = 5;
        G.battle.samuraiZanshinDuration = 5;
        G.battle.samuraiZanshinGuardUsed = true;
        const bladeDetailText = bladeForgeRows(BLADE_DEFS.bulwark).flat().join('｜');
        const bladeDetailsComplete = ['目前 5 回合', '目前預計 +7', '本段殘心：已使用', '心流條件已滿足', '目前預計倍率：×2.00'].every(text => bladeDetailText.includes(text));
        G.passives = ['buckler'];
        G.upgrades = ['buckler'];
        G.blades = ['buckler'];
        G.activeBlade = 'buckler';
        G.preferredBlade = 'buckler';
        G.sealedPassive = 'buckler';
        G.battle = { hand: [], over: false, lockedSkills: [{ id: 'buckler' }], stolenUpgrades: [{ id: 'buckler' }], samuraiFlow: 0, samuraiWeaponState: 'sheathed', bucklerUses: 0, bucklerBroken: false, samuraiMoonCounter: false, samuraiBucklerParticipated: false, ironskin: 1, blind: 0, weakness: 0, focus: 0 };
        const moonBladeDefinition = BLADE_DEFS.buckler.name === '月輪脇差' && BLADE_DEFS.buckler.sourceId === 'buckler' && BLADE_DEFS.buckler.icon === '🌙' && BLADE_DEFS.buckler.type === '脇差';
        const forgedBucklerProtection = hasP('buckler') && isUp('buckler') && bucklerDefense() === 10;
        G.sealedPassive = null;G.battle.lockedSkills = [];G.battle.stolenUpgrades = [];G.upgrades = [];
        G.battle.samuraiFlow = 24;
        const baseBucklerFlow = samuraiDefenseFlowBonus([], false);
        G.battle.samuraiFlow = 25;
        const circularBucklerFlow = samuraiDefenseFlowBonus([], false);
        G.upgrades = ['buckler'];
        const upgradedCircularFlow = samuraiDefenseFlowBonus([], false);
        const circularFlowMatches = baseBucklerFlow.bucklerFlow === 4 && !baseBucklerFlow.moonFlow && circularBucklerFlow.bucklerFlow === 6 && circularBucklerFlow.moonFlow && upgradedCircularFlow.bucklerFlow === 8;
        G.upgrades = [];
        G.battle.bucklerBroken = true;G.battle.samuraiBucklerParticipated = false;
        const noBucklerNoCounter = !grantMoonCounter(10);
        G.battle.samuraiBucklerParticipated = true;
        const counterFormed = grantMoonCounter(1) && G.battle.samuraiMoonCounter;
        G.battle.bucklerBroken = false;
        const counterRefreshedWithoutStack = grantMoonCounter(1) && G.battle.samuraiMoonCounter === true;
        G.battle.samuraiMoonCounter = false;
        const zanshinOnlyCannotFormCounter = !grantMoonCounter(0) && !G.battle.samuraiMoonCounter;
        const moonMultipliersMatch = near([
          moonCounterMultiplier(true, 0),
          (G.battle.samuraiMoonCounter = true, moonCounterMultiplier(false, 49)),
          moonCounterMultiplier(true, 49),
          moonCounterMultiplier(false, 50),
          moonCounterMultiplier(true, 50),
          moonCounterMultiplier(true, 100, true),
        ], [1.15, 1.15, 1.15 * 1.15, 1.25, 1.35, 2]);
        G.battle.samuraiZanshinTurns = 0;
        G.battle.samuraiWeaponState = 'sheathed';G.battle.samuraiFlow = 49;G.battle.samuraiMoonCounter = false;
        const moonNormalIaido = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg === 115;
        G.battle.samuraiMoonCounter = true;
        const moonLowFlowCounterIaido = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg === 132;
        G.battle.samuraiFlow = 50;
        const moonWheelCounterIaido = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg === 135;
        G.battle.samuraiWeaponState = 'drawn';
        const moonWheelCounterStrike = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg === 125;
        G.battle.bucklerUses = 4;G.battle.bucklerBroken = true;G.battle.samuraiFlow = 75;G.battle.samuraiMoonCounter = true;
        const noDamageKeepsCounter = !settleMoonCounterAttack(0, 75) && G.battle.samuraiMoonCounter && G.battle.bucklerUses === 4;
        const repairedBrokenBuckler = settleMoonCounterAttack(10, 75) && G.battle.bucklerUses === 3 && !G.battle.bucklerBroken && !G.battle.samuraiMoonCounter;
        G.upgrades = ['buckler'];G.battle.samuraiWeaponState = 'sheathed';G.battle.samuraiMoonCounter = true;G.battle.bucklerUses = 2;
        const upgradedCounterConsumedWithoutRepair = settleMoonCounterAttack(10, 75) && G.battle.bucklerUses === 2 && !G.battle.samuraiMoonCounter;
        G.battle.samuraiMoonCounter = true;
        const upgradedPierceProfile = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);
        const upgradedMoonPierce = upgradedPierceProfile.dmg === 135 && upgradedPierceProfile.shieldPierce === 0.4;
        G.battle.samuraiFlow = 100;
        const moonUltimateInfo = samuraiUltimateInfo();
        G.battle.samuraiUltimate = 'buckler';
        const moonUltimateProfile = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);
        const moonUltimateReady = moonUltimateInfo?.ready && moonUltimateInfo.name === '滿月返照';
        const moonUltimateMath = moonUltimateProfile.dmg === 200 && moonUltimateProfile.shieldPierce === 0.5;
        settleSamuraiUltimate('buckler', '滿月返照');
        const moonUltimateCleanup = !G.battle.samuraiMoonCounter && G.battle.samuraiFlow === 0 && G.battle.samuraiWeaponState === 'sheathed';
        G.battle.samuraiFlow = 75;G.battle.samuraiMoonCounter = true;G.battle.bucklerUses = 2;G.battle.bucklerBroken = false;
        const moonDetailText = bladeForgeRows(BLADE_DEFS.buckler).flat().join('｜');
        const moonDetailsComplete = ['類型', '脇差', '圓盾耐久', '盾返', '圓流', '下一次盾返', '缺月復圓', '滿月返照'].every(text => moonDetailText.includes(text));
        const moonSwitchClearsCounter = (clearMoonCounter('測試換刀'), !G.battle.samuraiMoonCounter);
        const fourBladeLimit = (() => { G.passives = ['buckler'];G.blades = ['firststrike', 'safe21', 'court', 'peek'];forgeBlade('buckler');return G.blades.length === 4 && !G.blades.includes('buckler'); })();
        newGame('gambler', 'lucky-number-mechanics');
        G.floor = 1;
        G.battle = { hand: [], over: false, lockedSkills: [], stolenUpgrades: [], guardStreak: 0, weakness: 0, blind: 0, fracture: 0, ironskin: 1, focus: 0, bucklerUses: 0, bucklerBroken: false, enemies: [] };
        G.luckyNumber = 7;
        const luckySevenProfiles = [7, 14, 21, 13, 28].map(total => luckyNumberProfile(total, 'battle'));
        const luckyHitTypesCorrect = luckySevenProfiles.map(profile => profile.type).join(',') === 'exact,multiple,multiple,miss,bust';
        const luckyBaseMultipliersCorrect = near(luckySevenProfiles.map(profile => profile.multiplier), [1.35, 1.10, 1.10, 1, 1]);
        const missHand = [{ r: 6, s: '♠', red: false }, { r: 7, s: '♥', red: true }];G.battle.hand = missHand;G.battle.lockedSkills = [{ id: 'doublebet' }];
        const missBaselineDamage = computeDamage(missHand, false).dmg;G.battle.lockedSkills = [];
        const luckyMissHasNoFixedBonus = computeDamage(missHand, false).dmg === missBaselineDamage;
        G.passives = ['doublebet', 'thousandstrikes'];G.battle.hand = luckySevenProfiles.length ? [{ r: 2, s: '♠', red: false }, { r: 5, s: '♥', red: true }] : [];
        G.battle.lockedSkills = [{ id: 'doublebet' }];const rapidWithoutLucky = computeDamage(G.battle.hand, false);G.battle.lockedSkills = [];
        const rapidWithLucky = computeDamage(G.battle.hand, false),rapidLuckyAppliedOnce = rapidWithLucky.dmg === Math.round(rapidWithoutLucky.dmg * 1.35) && rapidWithLucky.dmg === rapidWithLucky.rapid.segments * rapidWithLucky.rapid.segmentDamage + (rapidWithLucky.rapid.iaidoFlatBonus || 0);
        G.passives = ['cardsharp', 'doublebet'];
        G.luckyNumber = 21;
        const luckyTwentyOneProfile = luckyNumberProfile(21, 'battle');
        const twentyOneHand = [{ r: 10, s: '♠', red: false }, { r: 'A', s: '♥', red: true }];
        G.battle.hand = twentyOneHand;
        G.battle.lockedSkills = [{ id: 'doublebet' }];const twentyOneWithoutLucky = computeDamage(twentyOneHand, false).dmg;G.battle.lockedSkills = [];
        const twentyOneStacksNormally = luckyTwentyOneProfile.multiplier === 2.4 && computeDamage(twentyOneHand, false).dmg === Math.round(twentyOneWithoutLucky * 2.4);
        G.luckyNumber = 7;G.upgrades = ['doublebet'];
        const raisedOddsCorrect = luckyNumberProfile(7, 'battle').multiplier === 1.55 && luckyNumberProfile(14, 'battle').multiplier === 1.15 && luckyNumberProfile(7, 'bounty').multiplier === 1.25 && luckyNumberProfile(14, 'bounty').multiplier === 1.08;
        G.upgrades.push('doublebet2');G.luckyAllIn = true;
        const allInFormulaCorrect = luckyNumberProfile(7, 'battle').multiplier === 2.1 && luckyNumberProfile(14, 'battle').multiplier === 1.3 && luckyNumberProfile(7, 'bounty').multiplier === 1.5;
        const allInBustPenaltyCorrect = gamblePenalty(28, true) === 14;
        G.luckyAllIn = false;G.passives = ['cardsharp', 'doublebet', 'buckler'];G.upgrades = [];G.luckyNumber = 7;
        const sevenHand = [{ r: 2, s: '♠', red: false }, { r: 5, s: '♥', red: true }];G.battle.hand = sevenHand;
        const luckyDefensePreview = defenseActionProfile(sevenHand, false),luckyDefenseActual = defenseActionProfile(sevenHand, true);
        const defenseAndBucklerBoosted = luckyDefensePreview.total === 16 && luckyDefenseActual.total === luckyDefensePreview.total && luckyDefenseActual.shield.def > 8;
        const focusUsesBoostedDefense = Math.ceil(luckyDefenseActual.total * BALANCE.focusRate) === 8;
        G.passives = ['cardsharp', 'doublebet', 'insurance'];G.battle.bucklerUses = 0;G.battle.bucklerBroken = false;
        const bustHand = [{ r: 10, s: '♠', red: false }, { r: 10, s: '♥', red: true }, { r: 5, s: '♦', red: true }];G.battle.hand = bustHand;
        const insuranceNotBoosted = computeDamage(bustHand, true).dmg === 20;
        G.passives = ['cardsharp', 'doublebet'];G.battle.hand = [];G.battle.lockedSkills = [{ id: 'doublebet' }];G.luckyNumber = 7;
        const lockedLuckyPreserved = luckyNumberProfile(7, 'battle').multiplier === 1 && gamblePenalty(28, true) === 0 && G.luckyNumber === 7;
        G.upgrades = ['doublebet', 'doublebet2'];let lockedAllInConfirmed = false;requestLuckyNumber('battle', () => { lockedAllInConfirmed = true; });luckyPickerState.number = 7;luckyPickerState.allIn = true;renderLuckyNumberPicker();confirmLuckyNumber();
        const lockedMasteryCanCommitAllIn = lockedAllInConfirmed && G.luckyAllIn && document.querySelector('#lucky-number-picker').classList.contains('hidden');G.upgrades = [];G.luckyAllIn = false;
        G.battle.lockedSkills = [];
        const unlockedLuckyRestored = luckyNumberProfile(7, 'battle').multiplier === 1.35;
        G.hp = 100;G.maxhp = 100;G.battle.luckyBustResolved = false;
        applyGamblePenalty(28, true);const hpAfterFirstLuckyBust = G.hp;applyGamblePenalty(28, true);
        const combatBustOnlyOnce = hpAfterFirstLuckyBust === 93 && G.hp === hpAfterFirstLuckyBust;
        G.hp = 5;G.maxhp = 100;G.faction = 1000;G.miracleAlignment = 'holy';G.miracleReviveUsed = false;G.battle.luckyBustResolved = false;
        applyGamblePenalty(28, true);
        const luckySurvivesHolyRevive = G.hp === 30 && G.miracleReviveUsed && G.luckyNumber === 7;G.miracleAlignment = null;
        G.upgrades = ['doublebet', 'doublebet2'];G.luckyAllIn = true;G.luckyPendingBounty = false;G.battle.over = true;
        const rngBeforeLuckyChoice = G.rngCalls;let luckyChoiceConfirmed = false;requestLuckyNumber('battle', () => { luckyChoiceConfirmed = true; });luckyPickerState.number = 7;luckyPickerState.allIn = true;renderLuckyNumberPicker();confirmLuckyNumber();
        const luckyChoiceNoRng = luckyChoiceConfirmed && G.luckyNumber === 7 && G.luckyAllIn && G.rngCalls === rngBeforeLuckyChoice;
        G.luckyPendingBounty = true;startBounty(false, 100, 'battle');
        const inheritedLuckyToBounty = G.bounty.luckyNumber === 7 && G.bounty.luckyAllIn && G.bounty.hand.length === 2 && document.querySelector('#lucky-number-picker').classList.contains('hidden');
        G.luckyPendingBounty = false;clearLuckyNumber();startBounty(false, 100, 'duckBattle');
        const directBountyWaitsForChoice = G.bounty.hand.length === 0 && !document.querySelector('#lucky-number-picker').classList.contains('hidden');
        luckyPickerState.number = 7;luckyPickerState.allIn = false;renderLuckyNumberPicker();confirmLuckyNumber();
        const directBountyDealsAfterChoice = G.bounty.luckyNumber === 7 && G.bounty.hand.length === 2;
        G.bounty.base = 100;G.bounty.hand = sevenHand;const bountyExactReward = bountyGambleReward(100, 7, sevenHand);
        const fourteenHand = [{ r: 7, s: '♠', red: false }, { r: 7, s: '♥', red: true }];G.bounty.hand = fourteenHand;
        const bountyRewardProfilesCorrect = bountyExactReward === 63 && bountyGambleReward(100, 14, fourteenHand) === 81;
        G.gold = 5;G.bounty.base = 100;G.bounty.luckyNumber = 7;G.bounty.luckyAllIn = false;
        const bountyNormalPenaltyCapped = bountyBustPenaltyAmount(G.bounty) === 5;
        G.gold = 80;G.bounty.luckyAllIn = true;
        const bountyAllInPenaltyIsBase = bountyBustPenaltyAmount(G.bounty) === 80;
        G.bounty.luckyAllIn = false;G.bounty.hand = bustHand;G.bounty.resolved = false;G.gold = 50;G.hp = 55;
        resolveBounty(true);
        const bountyBustCostsGoldOnly = G.gold === 43 && G.hp === 55 && G.bounty.reward === 0;
        newGame('gambler', 'lucky-save-state');G.floor = 1;G.upgrades = ['doublebet', 'doublebet2'];G.luckyNumber = 17;G.luckyAllIn = true;G.luckyPendingBounty = true;
        const checkpoint = createFloorCheckpoint(),rngBeforeRestore = checkpoint.rngCalls;
        const restoredLucky = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: checkpoint }).state;
        const luckySaveRoundTrip = restoredLucky.luckyNumber === 17 && restoredLucky.luckyAllIn && restoredLucky.luckyPendingBounty && restoredLucky.rngCalls === rngBeforeRestore;
        return {
          firstBossHp,
          bustClearedFocus,
          bustPenaltyLogged,
          bucklerNormal,
          bucklerBrokeAfterFour,
          bucklerUpgraded,
          upgradedBucklerUsedDurability,
          zanshinBase,
          zanshinBulwark,
          zanshinBulwarkUpgraded,
          zanshinDecayMatches,
          strongInitialUnchanged,
          weakDidNotReplaceStrong,
          upgradedRefresh,
          failedMikiriCleared,
          lockedBulwarkUsesBaseDuration,
          samuraiRejectsGeneralBulwark,
          warriorKeepsGeneralBulwark,
          warriorBulwarkDescriptionUnchanged,
          samuraiDescriptions,
          bladeDefinition,
          forgedBulwarkProtection,
          iaidoMultipliers,
          iaidoMultipliersMatch,
          resonanceBaseAndLongThought,
          separatedIaidoAndZanshin,
          guardFirstUse,
          guardSkippedOneDecay,
          guardCannotRepeat,
          switchingBladeDidNotResetGuard,
          unfallenThreshold,
          otherBladeCannotUseUnfallen,
          immovableUltimateReady,
          immovableUltimateMath,
          immovableUltimateCleanup,
          bladeDetailsComplete,
          moonBladeDefinition,
          forgedBucklerProtection,
          circularFlowMatches,
          noBucklerNoCounter,
          counterFormed,
          counterRefreshedWithoutStack,
          zanshinOnlyCannotFormCounter,
          moonMultipliersMatch,
          moonNormalIaido,
          moonLowFlowCounterIaido,
          moonWheelCounterIaido,
          moonWheelCounterStrike,
          noDamageKeepsCounter,
          repairedBrokenBuckler,
          noDamageKeepsCounter,
          upgradedCounterConsumedWithoutRepair,
          upgradedCounterConsumedWithoutRepair,
          upgradedMoonPierce,
          moonUltimateReady,
          moonUltimateMath,
          moonUltimateCleanup,
          moonDetailsComplete,
          moonSwitchClearsCounter,
          fourBladeLimit,
          luckyHitTypesCorrect,
          luckyBaseMultipliersCorrect,
          luckyMissHasNoFixedBonus,
          rapidLuckyAppliedOnce,
          twentyOneStacksNormally,
          raisedOddsCorrect,
          allInFormulaCorrect,
          allInBustPenaltyCorrect,
          defenseAndBucklerBoosted,
          focusUsesBoostedDefense,
          insuranceNotBoosted,
          lockedLuckyPreserved,
          lockedMasteryCanCommitAllIn,
          unlockedLuckyRestored,
          combatBustOnlyOnce,
          luckySurvivesHolyRevive,
          luckyChoiceNoRng,
          inheritedLuckyToBounty,
          directBountyWaitsForChoice,
          directBountyDealsAfterChoice,
          bountyRewardProfilesCorrect,
          bountyNormalPenaltyCapped,
          bountyAllInPenaltyIsBase,
          bountyBustCostsGoldOnly,
          luckySaveRoundTrip,
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
