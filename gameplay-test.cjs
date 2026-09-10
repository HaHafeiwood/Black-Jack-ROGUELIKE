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
      const startupWorkshop = document.querySelector('#deckedit');
      if (startupWorkshop && !startupWorkshop.classList.contains('hidden') && G?._deckWorkshopVisit?.source === 'startup') document.querySelector('#deckedit-close').click();
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
      deckWorkshop: !document.querySelector('#deckedit').classList.contains('hidden'),
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

    if (state.deckWorkshop) {
      await page.evaluate(() => document.querySelector('#deckedit-close')?.click());
      continue;
    }

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
        G.passives = ['firststrike', 'buckler'];
        G.upgrades = [];
        G.blades = ['firststrike', 'buckler'];
        G.activeBlade = 'firststrike';
        G.preferredBlade = 'buckler';
        const battleStartsWithPreferredBlade = selectPreferredBattleBlade() === 'buckler' && G.activeBlade === 'buckler';
        G.battle = { hand: [{ r: 10, s: '♠', red: false }, { r: 10, s: '♥', red: true }], round: 3, over: false, busy: false, dealReady: true, pendingBust: false, enemies: [], samuraiWeaponState: 'sheathed', samuraiFlow: 25, mikiriCooldown: 0, samuraiGuardMode: null, samuraiGuardRate: 0, samuraiDefenseFlow: 0, samuraiBucklerParticipated: false, samuraiMoonFlowActive: false, samuraiMoonCounter: true, samuraiZanshinAttack: .25, samuraiZanshinReduction: .15, samuraiZanshinTurns: 3, samuraiZanshinDuration: 3, samuraiZanshinGuardUsed: false, samuraiZanshinPreserved: false, bucklerUses: 0, bucklerBroken: false, guardStreak: 0, focus: 0, ironskin: 0, weakness: 0, fracture: 0, blind: 0, hallucination: 0, upgradeReprieve: 0 };
        const originalSyncButtons = syncButtons, originalUpdateOutgoing = updateOutgoing, originalEndPlayerTurn = endPlayerTurn;
        syncButtons = () => {};updateOutgoing = () => {};endPlayerTurn = () => {};
        const defenseActionsBeforeSheathed = runStats().actions.defense, rngBeforeBladeSwitch = G.rngCalls, preferredBeforeBladeSwitch = G.preferredBlade;
        samuraiDefend();samuraiMikiri();
        const sheathedDefenseBlocked = runStats().actions.defense === defenseActionsBeforeSheathed && G.battle.samuraiGuardMode === null && G.battle.samuraiFlow === 25 && G.battle.bucklerUses === 0 && G.battle.samuraiMoonCounter;
        const switchedBlade = switchBattleBlade('firststrike');
        const sheathedSwitchIsFree = switchedBlade && G.activeBlade === 'firststrike' && G.preferredBlade === preferredBeforeBladeSwitch && G.battle.round === 3 && G.rngCalls === rngBeforeBladeSwitch && runStats().actions.defense === defenseActionsBeforeSheathed && !G.battle.samuraiMoonCounter;
        G.battle.samuraiWeaponState = 'drawn';
        const drawnSwitchRejected = !switchBattleBlade('buckler') && G.activeBlade === 'firststrike';
        G.activeBlade = 'buckler';G.battle.samuraiFlow = 25;G.battle.mikiriCooldown = 0;G.battle.samuraiGuardMode = null;G.battle.bucklerUses = 0;
        samuraiMikiri();
        const mikiriHasNoFlowCost = G.battle.samuraiFlow === 25 && G.battle.samuraiGuardMode === 'mikiri' && G.battle.mikiriCooldown === BALANCE.samuraiMikiriCooldown + 1 && G.battle.bucklerUses === 1;
        G.battle.samuraiWeaponState = 'sheathed';
        const zanshinPersistsWhileSheathed = !!playerZanshinProfile();
        G.blades = [];G.activeBlade = null;
        const unarmedCanDefend = samuraiDefenseActionsAvailable();
        syncButtons = originalSyncButtons;updateOutgoing = originalUpdateOutgoing;endPlayerTurn = originalEndPlayerTurn;
        G.blades = ['firststrike', 'buckler'];G.activeBlade = 'buckler';G.preferredBlade = 'buckler';
        G.battle.samuraiWeaponState = 'sheathed';G.battle.mikiriCooldown = 0;G.battle.over = false;G.battle.busy = false;G.battle.dealReady = true;
        syncButtons();renderBattleBladePicker();
        const sheathedDefenseUiDisabled = document.querySelector('#btn-defend').disabled && document.querySelector('#btn-mikiri').disabled && !document.querySelector('#battle-blade-picker').classList.contains('hidden');
        G.battle.samuraiWeaponState = 'drawn';syncButtons();renderBattleBladePicker();
        const drawnDefenseUiEnabled = !document.querySelector('#btn-defend').disabled && !document.querySelector('#btn-mikiri').disabled && document.querySelector('#battle-blade-picker').classList.contains('hidden');
        G.battle.samuraiWeaponState = 'sheathed';
        setPreferredBlade('firststrike');
        const preferredBladeLockedInBattle = G.preferredBlade === 'buckler';
        G.battle.over = true;setPreferredBlade('firststrike');
        const preferredBladeChangesOutsideBattle = G.preferredBlade === 'firststrike';
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
        G.passives = ['antidote'];G.upgrades = [];G.blades = ['antidote'];G.activeBlade = 'antidote';G.preferredBlade = 'antidote';G.sealedPassive = 'antidote';G.miracleAlignment = null;
        G.battle = { hand: [], over: false, lockedSkills: [{ id: 'antidote' }], stolenUpgrades: [{ id: 'antidote' }], samuraiFlow: 0, samuraiWeaponState: 'sheathed', samuraiMirrorFlowThisEnemyTurn: 0, enemies: [], weakness: 0, corruption: 0, sepsis: 0, bleed: 0, fracture: 0, burn: 0, trauma: 0, blind: 0, hallucination: 0, mentalDisorder: 0, paralysis: 0, virulence: 0 };
        const mirrorBladeDefinition = BLADE_DEFS.antidote.name === '明鏡打刀' && BLADE_DEFS.antidote.sourceId === 'antidote' && BLADE_DEFS.antidote.icon === '🪞' && BLADE_DEFS.antidote.type === '打刀';G.upgrades = ['antidote'];
        const forgedAntidoteProtection = hasP('antidote') && isUp('antidote') && !skillIsLocked('antidote') && !upgradeStolen('antidote');
        G.battle.lockedSkills = [];G.battle.stolenUpgrades = [];G.upgrades = [];
        const purificationResistanceUnchanged = playerStatusResistance() === .4 && (G.upgrades = ['antidote'], playerStatusResistance() === .6);
        G.upgrades = [];const mirrorEnemy = { name: '抗性測試敵人', curhp: 100, maxhp: 100, statusResist: .5, poison: 0 };
        const reflectedPlayerPoison = resistedPlayerStatusAmount('poison', 10, mirrorEnemy);
        const reflectionUsesActualReductionAndEnemyResistance = reflectedPlayerPoison === 6 && mirrorEnemy.poison === 2 && G.battle.samuraiFlow === 2;
        G.activeBlade = 'firststrike';const poisonBeforeInactive = mirrorEnemy.poison,flowBeforeInactive = G.battle.samuraiFlow;resistedPlayerStatusAmount('poison', 10, mirrorEnemy);
        const inactiveMirrorDoesNotReflect = mirrorEnemy.poison === poisonBeforeInactive && G.battle.samuraiFlow === flowBeforeInactive;
        G.activeBlade = 'antidote';G.battle.samuraiFlow = 0;G.battle.samuraiMirrorFlowThisEnemyTurn = 0;mirrorEnemy.statusResist = 0;mirrorEnemy.poison = 0;
        resistedPlayerStatusAmount('poison', 10, mirrorEnemy);resistedPlayerStatusAmount('poison', 10, mirrorEnemy);resistedPlayerStatusAmount('poison', 10, mirrorEnemy);
        const reflectionFlowCappedPerEnemyTurn = mirrorEnemy.poison === 12 && G.battle.samuraiFlow === 10 && G.battle.samuraiMirrorFlowThisEnemyTurn === 10;
        G.poison = 3;Object.assign(G.battle, { burn: 3, corruption: 1, weakness: 2, samuraiFlow: 25 });
        const purgeNoDamage = settleMirrorPurgingIaido(0, mirrorEnemy, 25),purgeStillPresent = G.poison === 3 && G.battle.burn === 3;
        const purgeResult = settleMirrorPurgingIaido(10, mirrorEnemy, 25);
        const purgingIaidoUsesKindsOnce = purgeNoDamage.length === 0 && purgeStillPresent && G.poison === 2 && G.battle.burn === 2 && G.battle.corruption === 0 && G.battle.weakness === 1 && purgeResult.length === 4 && G.battle.samuraiFlow === 33;
        G.poison = 5;Object.assign(G.battle, { burn: 1, corruption: 3, weakness: 0, samuraiFlow: 75 });mirrorEnemy.statusResist = .5;mirrorEnemy.poison = 0;mirrorEnemy.burn = 0;mirrorEnemy.trauma = 0;
        const breakingResult = settleMirrorPurgingIaido(10, mirrorEnemy, 75);
        const breakingEvilReflectsRemovedAmountWithoutLayerFlow = G.poison === 3 && G.battle.burn === 0 && G.battle.corruption === 1 && mirrorEnemy.poison === 1 && mirrorEnemy.burn === 1 && breakingResult.length === 3 && G.battle.samuraiFlow === 81;
        G.poison = 0;Object.assign(G.battle, { burn: 0, corruption: 0, weakness: 0, samuraiFlow: 50, samuraiWeaponState: 'drawn' });
        const unblemishedStrike = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);G.battle.samuraiWeaponState = 'sheathed';const unblemishedIaido = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);G.poison = 1;const stainedIaido = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);
        const unblemishedMultipliersCorrect = unblemishedStrike.dmg === 115 && unblemishedIaido.dmg === 130 && unblemishedIaido.shieldPierce === .3 && stainedIaido.dmg === 115 && !stainedIaido.shieldPierce;
        G.upgrades = ['antidote'];G.poison = 20;Object.assign(G.battle, { virulence: 2, corruption: 3, sepsis: 1, bleed: 4, fracture: 2, burn: 5, trauma: 3, blind: 2, weakness: 3, hallucination: 1, mentalDisorder: 1, paralysis: 1, hesitation: 4, disciplineBrand: 2, defense: 9, focus: 7, samuraiFlow: 100, samuraiWeaponState: 'drawn', samuraiZanshinTurns: 2, samuraiUltimate: 'antidote' });
        mirrorEnemy.statusResist = .5;mirrorEnemy.poison = 0;mirrorEnemy.virulence = 0;mirrorEnemy.burn = 0;mirrorEnemy.bleed = 0;mirrorEnemy.trauma = 0;mirrorEnemy.weakness = 0;
        const mirrorUltimateInfo = samuraiUltimateInfo(),mirrorUltimateProfile = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);settleMirrorUltimate(mirrorEnemy);settleSamuraiUltimate('antidote', '明鏡止水');
        const mirrorUltimateByKinds = mirrorUltimateInfo?.ready && mirrorUltimateProfile.dmg === 235 && mirrorUltimateProfile.shieldPierce === .5;
        const mirrorUltimateCleansesWithoutDamage = playerPurifiableStatuses().length === 0 && mirrorEnemy.poison === 5 && mirrorEnemy.virulence === 1 && mirrorEnemy.burn === 3 && mirrorEnemy.bleed === 2 && mirrorEnemy.trauma >= 2 && mirrorEnemy.weakness === 2 && G.battle.hesitation === 4 && G.battle.disciplineBrand === 2 && G.battle.defense === 9 && G.battle.focus === 7 && G.battle.samuraiZanshinTurns === 2 && G.battle.samuraiFlow === 0 && G.battle.samuraiWeaponState === 'sheathed';
        const mirrorDetailText = bladeForgeRows(BLADE_DEFS.antidote).flat().join('｜');
        const mirrorDetailsComplete = ['類型', '打刀', '目前可淨化狀態', '返照', '祓斬', '無垢', '破邪', '明鏡止水'].every(text => mirrorDetailText.includes(text));
        G.passives = ['howdidwegethere'];G.upgrades = [];G.blades = ['howdidwegethere'];G.activeBlade = 'howdidwegethere';G.preferredBlade = 'howdidwegethere';G.sealedPassive = 'howdidwegethere';G.miracleAlignment = null;
        G.battle = { hand: [], over: false, lockedSkills: [{ id: 'howdidwegethere' }], stolenUpgrades: [{ id: 'howdidwegethere' }], samuraiFlow: 0, samuraiWeaponState: 'drawn', samuraiAffinityStatus: null, samuraiZanshinTurns: 0, enemies: [], weakness: 0, virulence: 0, corruption: 0, sepsis: 0, bleed: 0, fracture: 0, burn: 0, trauma: 0, blind: 0, hesitation: 0, thirst: 0, hallucination: 0, mentalDisorder: 0, paralysis: 0 };
        G.poison = 0;
        const myriadBladeDefinition = BLADE_DEFS.howdidwegethere.name === '萬象妖刀' && BLADE_DEFS.howdidwegethere.sourceId === 'howdidwegethere' && BLADE_DEFS.howdidwegethere.icon === '🌀' && BLADE_DEFS.howdidwegethere.type === '妖刀';
        G.upgrades = ['howdidwegethere'];
        const forgedMyriadProtection = hasP('howdidwegethere') && isUp('howdidwegethere') && !skillIsLocked('howdidwegethere') && !upgradeStolen('howdidwegethere');
        G.battle.lockedSkills = [];G.battle.stolenUpgrades = [];G.upgrades = [];
        const guaranteedWeaknessCountsAsPhase = currentWeaknessStacks() === 3 && playerPhaseStatuses().some(status => status.key === 'weakness');
        G.poison = 1;Object.assign(G.battle, { virulence: 1, corruption: 1, sepsis: 1, bleed: 1, weakness: 0, samuraiFlow: 0, samuraiWeaponState: 'drawn' });
        const sixKindStrike = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg;
        G.poison = 40;Object.assign(G.battle, { virulence: 20, corruption: 3, sepsis: 5, bleed: 30 });
        const layeredSixKindStrike = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg;
        G.battle.samuraiWeaponState = 'sheathed';const sixKindIaido = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg;
        Object.assign(G.battle, { fracture: 1, burn: 1, samuraiFlow: 25, samuraiWeaponState: 'drawn' });
        const eightKindStrike = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false).dmg;
        const myriadDamageUsesKindsAndSeparateIaido = sixKindStrike === 130 && layeredSixKindStrike === 130 && sixKindIaido === 150 && eightKindStrike === 140;
        G.poison = 1;Object.assign(G.battle, { virulence: 0, corruption: 0, sepsis: 0, bleed: 0, fracture: 0, burn: BURN_CAP, trauma: 0, blind: 0, weakness: 3, hesitation: 2, thirst: 0, hallucination: 0, mentalDisorder: 0, paralysis: 0, samuraiFlow: 0, samuraiWeaponState: 'drawn' });
        const amplified = amplifyMyriadStatuses();
        const amplifyExistingDirectly = amplified.length === 3 && G.poison === 2 && G.battle.burn === BURN_CAP && G.battle.weakness === 4 && G.battle.hesitation === 3 && G.battle.trauma === 0 && G.battle.samuraiFlow === 6;
        const myriadEnemy = { name: '抗性測試敵人', curhp: 100, maxhp: 100, statusResist: .5, poison: 0, burn: 0, weakness: 0 };
        G.poison = 9;Object.assign(G.battle, { weakness: 3, hesitation: 0, burn: 0, trauma: 0, samuraiFlow: 50, samuraiAffinityStatus: 'poison', samuraiWeaponState: 'drawn' });
        const affinityNoDamage = settleMyriadAffinity(0, myriadEnemy, 50, false, false),affinityHit = settleMyriadAffinity(10, myriadEnemy, 50, false, false);
        const sameDiseaseOnceWithResistance = affinityNoDamage.length === 0 && affinityHit.length === 1 && affinityHit[0].raw === 5 && affinityHit[0].applied === 3 && myriadEnemy.poison === 3 && G.poison === 9;
        Object.assign(G.battle, { burn: 2, bleed: 2, trauma: 1, samuraiFlow: 75, samuraiWeaponState: 'sheathed' });
        const commonProfile = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false),commonAmount = myriadAffinityAmount('poison', 75, true);
        G.battle.samuraiAffinityStatus = null;const commonWithoutSelection = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false);
        const commonThresholdAndPierce = commonAmount.shared && commonAmount.raw === 9 && commonProfile.shieldPierce === .4 && commonWithoutSelection.shieldPierce === .4;
        G.battle.samuraiAffinityStatus = 'poison';clearMyriadAffinity();const affinityClearsOnInvalidation = G.battle.samuraiAffinityStatus === null;
        G.upgrades = ['howdidwegethere'];G.poison = 9;Object.assign(G.battle, { virulence: 2, corruption: 1, sepsis: 1, bleed: 3, fracture: 1, burn: 4, trauma: 2, blind: 1, weakness: 4, hesitation: 1, thirst: 0, hallucination: 0, mentalDisorder: 0, paralysis: 0, samuraiFlow: 100, samuraiWeaponState: 'drawn', samuraiAffinityStatus: 'poison', samuraiUltimate: 'howdidwegethere' });
        Object.assign(myriadEnemy, { poison: 0, virulence: 0, burn: 0, bleed: 0, trauma: 0, weakness: 0 });
        const myriadUltimateInfo = samuraiUltimateInfo(),myriadUltimateProfile = finalizeSamuraiAttackDamage({ dmg: 100, notes: [] }, [], false),playerPoisonBeforeUltimate = G.poison;
        const myriadCopied = settleMyriadAffinity(0, myriadEnemy, 100, false, true);settleSamuraiUltimate('howdidwegethere', '萬象歸一');
        const myriadUltimateReadyAndMath = myriadUltimateInfo?.ready && myriadUltimateInfo.name === '萬象歸一' && myriadUltimateProfile.dmg === 230 && myriadUltimateProfile.shieldPierce === .5;
        const myriadUltimateCopiesOnceAndKeepsSelf = myriadCopied.length === 6 && myriadEnemy.poison === 3 && G.poison === playerPoisonBeforeUltimate && G.battle.samuraiFlow === 0 && G.battle.samuraiWeaponState === 'sheathed';
        const myriadDetailText = bladeForgeRows(BLADE_DEFS.howdidwegethere).flat().join('｜');
        const myriadDetailsComplete = ['類型', '妖刀', '目前可增相狀態', '異相', '增相', '同病', '共相', '萬象歸一'].every(text => myriadDetailText.includes(text));
        G.passives = ['howdidwegethere', 'firststrike'];G.blades = ['howdidwegethere', 'firststrike'];G.activeBlade = 'howdidwegethere';G.poison = 4;Object.assign(G.battle, { samuraiFlow: 50, samuraiWeaponState: 'drawn', samuraiAffinityStatus: null, over: false, busy: false, dealReady: true, pendingBust: false });
        const affinityRngBefore = G.rngCalls,affinityRoundBefore = G.battle.round,affinitySelected = selectMyriadAffinity('poison'),affinityUiText = document.querySelector('#battle-affinity-picker').textContent;
        G.battle.samuraiWeaponState = 'sheathed';const affinitySwitch = switchBattleBlade('firststrike');
        const affinityUiAndSwitchRules = affinitySelected && affinityUiText.includes('目前選擇：中毒 4 層') && G.rngCalls === affinityRngBefore && G.battle.round === affinityRoundBefore && affinitySwitch && G.battle.samuraiAffinityStatus === null;
        const myriadMutexPreserved = (G.passives = ['howdidwegethere'], passiveConflictsWithOwned('antidote')) && (G.passives = ['antidote'], passiveConflictsWithOwned('howdidwegethere'));
        const fourBladeLimit = (() => { G.passives = ['buckler'];G.blades = ['firststrike', 'safe21', 'court', 'peek'];forgeBlade('buckler');return G.blades.length === 4 && !G.blades.includes('buckler'); })();
        newGame('gambler', 'lucky-number-mechanics');
        G.floor = 1;
        G.battle = { hand: [], over: false, lockedSkills: [], stolenUpgrades: [], guardStreak: 0, weakness: 0, blind: 0, fracture: 0, ironskin: 1, focus: 0, bucklerUses: 0, bucklerBroken: false, enemies: [] };
        G.luckyNumber = 7;
        const luckySevenProfiles = [7, 14, 21, 13, 28].map(total => luckyNumberProfile(total, 'battle'));
        const luckyHitTypesCorrect = luckySevenProfiles.map(profile => profile.type).join(',') === 'exact,multiple,multiple,miss,bust';
        const luckyBaseMultipliersCorrect = near(luckySevenProfiles.map(profile => profile.multiplier), [1.35, 1.10, 1.10, 1, 1]);
        const missHand = [{ r: 6, s: '♠', red: false }, { r: 7, s: '♥', red: true }];G.battle.hand = missHand;G.passives = ['cardsharp'];
        const missBaselineDamage = computeDamage(missHand, false).dmg;G.passives.push('doublebet');
        const luckyMissHasNoFixedBonus = computeDamage(missHand, false).dmg === missBaselineDamage;
        G.passives = ['thousandstrikes'];G.battle.hand = luckySevenProfiles.length ? [{ r: 2, s: '♠', red: false }, { r: 5, s: '♥', red: true }] : [];
        const rapidWithoutLucky = computeDamage(G.battle.hand, false);G.passives.push('doublebet');
        const rapidWithLucky = computeDamage(G.battle.hand, false),rapidLuckyAppliedOnce = rapidWithLucky.dmg === Math.round(rapidWithoutLucky.dmg * 1.35) && rapidWithLucky.dmg === rapidWithLucky.rapid.segments * rapidWithLucky.rapid.segmentDamage + (rapidWithLucky.rapid.iaidoFlatBonus || 0);
        G.passives = ['cardsharp', 'doublebet'];
        G.luckyNumber = 21;
        const luckyTwentyOneProfile = luckyNumberProfile(21, 'battle');
        const twentyOneHand = [{ r: 10, s: '♠', red: false }, { r: 'A', s: '♥', red: true }];
        G.battle.hand = twentyOneHand;
        G.passives = ['cardsharp'];const twentyOneWithoutLucky = computeDamage(twentyOneHand, false).dmg;G.passives.push('doublebet');
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
        G.passives = ['cardsharp', 'doublebet', 'suitmage'];G.battle.hand = [];G.battle.lockedSkills = [{ id: 'doublebet' }, { id: 'suitmage' }];G.luckyNumber = 7;
        const signatureSkillLocksIgnored = luckyNumberProfile(7, 'battle').multiplier === 1.35 && gamblePenalty(28, true) === 7 && hasP('doublebet') && hasP('suitmage') && !skillIsLocked('doublebet') && !skillIsLocked('suitmage');
        G.upgrades = ['doublebet', 'doublebet2'];G.battle.stolenUpgrades = [{ id: 'doublebet', sourceIdx: 0 }, { id: 'suitmage', sourceIdx: 0 }];let protectedAllInConfirmed = false;requestLuckyNumber('battle', () => { protectedAllInConfirmed = true; });luckyPickerState.number = 7;luckyPickerState.allIn = true;renderLuckyNumberPicker();confirmLuckyNumber();
        const signatureHighestProtection = protectedAllInConfirmed && G.luckyAllIn && doublebetMastered() && isUp('doublebet') && !upgradeStolen('doublebet') && !upgradeStolen('suitmage') && !sealCandidates().includes('doublebet') && !sealCandidates().includes('suitmage') && !ALL_PASSIVES.filter(p => p.shop !== false).some(p => p.id === 'doublebet' || p.id === 'suitmage') && document.querySelector('#lucky-number-picker').classList.contains('hidden');G.upgrades = [];G.luckyAllIn = false;G.battle.stolenUpgrades = [];
        G.battle.lockedSkills = [];
        G.passives = ['cardsharp', 'doublebet'];const professionPassivesRemainCharacterBound = PROFESSION_PASSIVES.has('doublebet') && PROFESSION_PASSIVES.has('suitmage') && PROFESSION_PASSIVES.has('collector') && professionPassiveOwner('collector') === 'warrior' && CHARACTERS.find(c => c.id === 'gambler').passives.includes('doublebet') && !CHARACTERS.find(c => c.id === 'warrior').passives.includes('doublebet') && CHARACTERS.find(c => c.id === 'magician').passives.includes('suitmage') && !CHARACTERS.find(c => c.id === 'warrior').passives.includes('suitmage');
        newGame('warrior', 'profession-save-guard');G.passives.push('doublebet', 'suitmage');const wrongProfessionSave = createFloorCheckpoint();
        const cleanedProfessionSave = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: wrongProfessionSave }).state;
        newGame('gambler', 'profession-save-restore');G.passives = G.passives.filter(id => id !== 'doublebet');const missingProfessionSave = createFloorCheckpoint();
        const restoredProfessionSave = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: missingProfessionSave }).state;
        const professionSaveGuard = !cleanedProfessionSave.passives.includes('doublebet') && !cleanedProfessionSave.passives.includes('suitmage') && restoredProfessionSave.passives.includes('doublebet');
        const pristineDeck = () => SUITS.flatMap(s => CARD_RANKS.map(r => ({ r, s, red: s === '♥' || s === '♦' })));
        newGame('warrior', 'collector-profession');
        const warriorStartsProtectedCollector = G.passives.includes('collector') && ALL_PASSIVES.find(p => p.id === 'collector').shop === false && activePassiveSlots() === 5 && !sealCandidates().includes('collector') && !skillIsLocked('collector');
        G.battle = { over: false, lockedSkills: [{ id: 'collector' }], stolenUpgrades: [{ id: 'collector' }], upgradeReprieve: 0 };G.upgrades = ['collector'];
        const collectorIgnoresLockAndTheft = hasP('collector') && isUp('collector') && !upgradeStolen('collector');
        G.battle = null;G.floor = 1;G.gold = 500;
        openDeckEdit('startup');
        const startupWorkshopReady = !document.querySelector('#deckedit').classList.contains('hidden') && ['降一階', '升一階', '三選一替換', '進階牌庫塑形', '跳過'].every(text => document.querySelector('#deckedit').textContent.includes(text));
        document.querySelector('#deckedit').classList.add('hidden');delete G._deckWorkshopVisit;
        const operationCases = [
          ['shift', { deckIndex: 0, delta: 1 }],
          ['replace', { deckIndex: 0, card: { r: 5, s: '♠' } }],
          ['add', { card: { r: 'A', s: '♠' } }],
          ['remove', { deckIndex: 0 }],
          ['duplicate', { deckIndex: 0 }],
          ['reforge', { deckIndex: 0, rank: 5 }],
        ];
        const allStructuralOperationsAvailable = operationCases.every(([type, payload], index) => {
          G.deck = pristineDeck();G.gold = 1000;G.deckWorkshopChapter = 0;G.deckWorkshopUses = 0;G._deckWorkshopVisit = { key: `test:${index}`, source: 'startup', used: false };
          return performDeckWorkshopOperation(type, payload).ok && validateCombatDeck(G.deck).ok;
        });
        G.deck = pristineDeck();G.gold = 1000;G.deckWorkshopChapter = 0;G.deckWorkshopUses = 0;G._deckWorkshopVisit = { key: 'once', source: 'startup', used: false };
        const firstWorkshopEdit = performDeckWorkshopOperation('shift', { deckIndex: 0, delta: 1 }),goldAfterOneWorkshopEdit = G.gold;
        const secondWorkshopEdit = performDeckWorkshopOperation('add', { card: { r: 'A', s: '♠' } });
        const oneStructuralEditPerVisit = firstWorkshopEdit.ok && !secondWorkshopEdit.ok && G.deckWorkshopUses === 1 && goldAfterOneWorkshopEdit === 965 && G.gold === goldAfterOneWorkshopEdit;
        G.deck = pristineDeck();G.collectorMaterials = [{ r: 9, s: '♠', red: false }];G.gold = 1000;G.deckWorkshopUses = 0;G._deckWorkshopVisit = { key: 'material-replace', source: 'startup', used: false };const materialDeckLength = G.deck.length;
        const materialReplaceResult = performDeckWorkshopOperation('materialReplace', { materialIndex: 0, deckIndex: 0 });
        const materialReplacementIsAtomic = materialReplaceResult.ok && G.deck.length === materialDeckLength && G.collectorMaterials.length === 0 && G.deckWorkshopUses === 1 && G.gold === 950;
        G.deck = pristineDeck();G.deck.push({ r: 'A', s: '♠', red: false });G.collectorMaterials = [{ r: 'A', s: '♠', red: false }];G.gold = 777;G.deckWorkshopUses = 0;G._deckWorkshopVisit = { key: 'illegal-material', source: 'startup', used: false };
        const illegalMaterialResult = performDeckWorkshopOperation('materialAdd', { materialIndex: 0 });
        const illegalEditConsumesNothing = !illegalMaterialResult.ok && G.gold === 777 && G.collectorMaterials.length === 1 && G.deckWorkshopUses === 0 && !G._deckWorkshopVisit.used;
        G.deck = pristineDeck();G.gold = 500;G.deckWorkshopUses = 2;G.floor = 1;G.deckWorkshopChapter = 0;const suitGoldBefore = G.gold,suitDeckEditsBefore = G.deckEdits;
        const validSuitForge = performSuitForge(0, '♥');
        const suitForgeSeparateFromStructure = validSuitForge.ok && G.gold === suitGoldBefore - suitForgePrice() && G.deckWorkshopUses === 2 && G.deckEdits === suitDeckEditsBefore;
        G.deck = pristineDeck();G.deck.push({ r: 'A', s: '♠', red: false });G.gold = 500;const invalidSuitGold = G.gold,invalidSuitUses = G.deckWorkshopUses,heartAceIndex = G.deck.findIndex(card => card.r === 'A' && card.s === '♥');
        const invalidSuitForge = performSuitForge(heartAceIndex, '♠');
        const illegalSuitForgeConsumesNothing = !invalidSuitForge.ok && G.gold === invalidSuitGold && G.deckWorkshopUses === invalidSuitUses;
        const minimumAndRatioLimits = !validateCombatDeck(pristineDeck().slice(0, 29)).ok && !validateCombatDeck([
          ...[10, 'J', 'Q', 'K'].flatMap(rank => [0, 1, 2].map(i => ({ r: rank, s: SUITS[i] }))),
          { r: 'K', s: '♣' },
          ...['A', 2, 3].flatMap(rank => [0, 1, 2, 3, 0, 1].map((_, i) => ({ r: rank, s: SUITS[i % 4] }))).slice(0, 17),
        ]).ok;
        G.floor = 1;G.deckWorkshopChapter = 0;
        const chapterVisitPrices = [0, 1, 2, 3].map(uses => { G.deckWorkshopUses = uses;return deckWorkshopPrice('shift', 'shop'); });
        G.deckWorkshopUses = 0;const fixedRestDiscountPrice = deckWorkshopPrice('shift', 'fixedRest');
        G.floor = CHAPTER_LENGTH + 1;G.deckWorkshopChapter = 0;G.deckWorkshopUses = 3;const nextChapterPrice = deckWorkshopPrice('shift', 'shop');
        const workshopPricingCentralized = chapterVisitPrices.join(',') === '35,47,60,70' && fixedRestDiscountPrice === 28 && G.deckWorkshopUses === 0 && nextChapterPrice > 35;
        newGame('warrior', 'collector-appearances');G.floor = 2;G.nodeType = 'shop';G.nodeStarted = false;openShop();
        const workshopInEveryShop = !!document.querySelector('#open-deckedit');
        G.floor = REST_NODE;G.nodeType = 'rest';G.nodeStarted = true;G.restCrab = false;openRestEvent();const workshopAtFixedRest = !!document.querySelector('#open-rest-deck-workshop');
        G.floor = 2;G.nodeType = 'rest';G.nodeStarted = true;G.restCrab = false;openRestEvent();const noWorkshopAtRandomRest = !document.querySelector('#open-rest-deck-workshop');
        newGame('magician', 'collector-other-role');G.floor = 2;G.nodeType = 'shop';G.nodeStarted = false;openShop();
        const otherRolesCannotShapeDeck = !deckWorkshopAllowed() && !document.querySelector('#open-deckedit') && !ALL_PASSIVES.filter(p => p.shop !== false).some(p => p.id === 'collector');
        G.deck = pristineDeck();G.deck.splice(0, 4);G.deck.push({ r: 2, s: '♠', red: false });G.passives.push('collector');G.passivePaid.collector = 137;G.passiveAffixes.collector = 'sharp';G.upgrades.push('collector');const foreignDeckBefore = JSON.stringify(G.deck),foreignGoldBefore = G.gold;
        const migratedForeignCollector = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: createFloorCheckpoint() }).state;
        const foreignCollectorRefundedAndDeckKept = !migratedForeignCollector.passives.includes('collector') && !migratedForeignCollector.upgrades.includes('collector') && !migratedForeignCollector.passiveAffixes.collector && migratedForeignCollector.gold === foreignGoldBefore + 137 && JSON.stringify(migratedForeignCollector.deck) === foreignDeckBefore;
        newGame('warrior', 'collector-save');G.floor = 5;G.deck = pristineDeck();G.deck.splice(0, 1);G.collectorMaterials = [{ r: 7, s: '♥', red: true }, { r: 'K', s: '♣', red: false }];G.deckWorkshopChapter = chapterIndex(G.floor);G.deckWorkshopUses = 2;G.collectorStartupDone = true;
        const collectorCheckpoint = createFloorCheckpoint(),restoredCollector = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: collectorCheckpoint }).state;
        const collectorSaveRoundTrip = restoredCollector.passives.includes('collector') && restoredCollector.deck.length === 51 && restoredCollector.collectorMaterials.length === 2 && restoredCollector.collectorMaterials[0].r === 7 && restoredCollector.deckWorkshopUses === 2 && restoredCollector.collectorStartupDone;
        const oldWarriorCheckpoint = { ...collectorCheckpoint, passives: collectorCheckpoint.passives.filter(id => id !== 'collector'), collectorStartupDone: undefined };
        const migratedOldWarrior = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: oldWarriorCheckpoint }).state;
        const oldWarriorGetsCollector = migratedOldWarrior.passives.includes('collector') && !sealCandidates().includes('collector');
        const overflowCheckpoint = { ...collectorCheckpoint, passives: ['rubyring', 'heartguard', 'redraw', 'safe21', 'collector', 'insurance', 'peek', 'vampire', 'buckler', 'toxicology', 'echelon'], sealedPassive: null };
        const overflowWarrior = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: overflowCheckpoint }).state;G = overflowWarrior;
        const collectorNeverOverflowCandidate = activePassiveSlots() > currentPassiveLimit() && sealCandidates().length > 0 && !sealCandidates().includes('collector');
        G = restoredCollector;G.upgrades = [];
        const baseCollectorNoMaterials = !collectorMaterialDropEligible(false, 'battle');G.upgrades = ['collector'];
        const upgradedCollectorDropRules = collectorMaterialDropEligible(false, 'battle') && !collectorMaterialDropEligible(true, 'battle') && !collectorMaterialDropEligible(false, 'event:bloodAltar');
        const combatDeckLengthBeforeMaterial = G.deck.length,materialsBeforeDrop = G.collectorMaterials.length;openCardDrop(false, 'battle');document.querySelector('[data-pick="0"]').click();
        const materialDoesNotEnterCombatDeck = G.deck.length === combatDeckLengthBeforeMaterial && G.collectorMaterials.length === Math.min(BALANCE.deckWorkshop.materialLimit, materialsBeforeDrop + 1);
        G.collectorMaterials = [{ r: 2, s: '♠' }, { r: 3, s: '♥' }, { r: 4, s: '♦' }].map(cloneCard);openCardDrop(false, 'battle');const replacementMaterial = cloneCard(G._drops[1].card);document.querySelector('[data-pick="1"]').click();document.querySelector('[data-replace-material="1"]').click();
        const fullMaterialCollectionCanReplace = G.collectorMaterials.length === 3 && G.collectorMaterials[1].r === replacementMaterial.r && G.collectorMaterials[1].s === replacementMaterial.s && G.deck.length === combatDeckLengthBeforeMaterial;
        G.deck = pristineDeck();G.deck.splice(0, 12);G.deck.push({ r: 4, s: '♣', red: false }, { r: 4, s: '♣', red: false });G.deck[0].s = '♦';G.deck[0].red = true;G.collectorMaterials = [{ r: 9, s: '♠', red: false }];
        startBounty(false, 100, 'duckBattle');const moneyDeck = [...G.bounty.deck, ...G.bounty.hand],moneyDeckCounts = new Map();moneyDeck.forEach(card => moneyDeckCounts.set(`${card.r}|${card.s}`, (moneyDeckCounts.get(`${card.r}|${card.s}`) || 0) + 1));
        const bountyAlwaysStandard52 = moneyDeck.length === 52 && G.bounty.hand.length === 2 && moneyDeckCounts.size === 52 && [...moneyDeckCounts.values()].every(count => count === 1);
        newGame('magician', 'bounty-mono-isolation');G.upgrades = ['suitmage'];G.suitMastery = 'mono';G.deck = [...pristineDeck().filter(card => card.s === '♠'), ...pristineDeck().filter(card => card.s !== '♠').slice(0, 17)];
        const bountyMonoHand = [{ r: 4, s: '♠', red: false }, { r: 6, s: '♠', red: false }];
        const bountyIgnoresCombatDeckMastery = dominantSuit(G.deck) === '♠' && bountyMultiplier(10, bountyMonoHand) === .5 && bountySuitNotes(bountyMonoHand).length === 0;
        newGame('gambler', 'lucky-number-mechanics-resume');G.floor = 1;G.battle = { hand: [], over: false, lockedSkills: [], stolenUpgrades: [], guardStreak: 0, weakness: 0, blind: 0, fracture: 0, ironskin: 1, focus: 0, bucklerUses: 0, bucklerBroken: false, enemies: [] };G.luckyNumber = 7;
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
          battleStartsWithPreferredBlade,
          sheathedDefenseBlocked,
          sheathedSwitchIsFree,
          drawnSwitchRejected,
          mikiriHasNoFlowCost,
          zanshinPersistsWhileSheathed,
          unarmedCanDefend,
          sheathedDefenseUiDisabled,
          drawnDefenseUiEnabled,
          preferredBladeLockedInBattle,
          preferredBladeChangesOutsideBattle,
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
          mirrorBladeDefinition,
          forgedAntidoteProtection,
          purificationResistanceUnchanged,
          reflectionUsesActualReductionAndEnemyResistance,
          inactiveMirrorDoesNotReflect,
          reflectionFlowCappedPerEnemyTurn,
          purgingIaidoUsesKindsOnce,
          breakingEvilReflectsRemovedAmountWithoutLayerFlow,
          unblemishedMultipliersCorrect,
          mirrorUltimateByKinds,
          mirrorUltimateCleansesWithoutDamage,
          mirrorDetailsComplete,
          myriadBladeDefinition,
          forgedMyriadProtection,
          guaranteedWeaknessCountsAsPhase,
          myriadDamageUsesKindsAndSeparateIaido,
          amplifyExistingDirectly,
          sameDiseaseOnceWithResistance,
          commonThresholdAndPierce,
          affinityClearsOnInvalidation,
          myriadUltimateReadyAndMath,
          myriadUltimateCopiesOnceAndKeepsSelf,
          myriadDetailsComplete,
          affinityUiAndSwitchRules,
          myriadMutexPreserved,
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
          signatureSkillLocksIgnored,
          signatureHighestProtection,
          professionPassivesRemainCharacterBound,
          professionSaveGuard,
          warriorStartsProtectedCollector,
          collectorIgnoresLockAndTheft,
          startupWorkshopReady,
          allStructuralOperationsAvailable,
          oneStructuralEditPerVisit,
          materialReplacementIsAtomic,
          illegalEditConsumesNothing,
          suitForgeSeparateFromStructure,
          illegalSuitForgeConsumesNothing,
          minimumAndRatioLimits,
          workshopPricingCentralized,
          workshopInEveryShop,
          workshopAtFixedRest,
          noWorkshopAtRandomRest,
          otherRolesCannotShapeDeck,
          foreignCollectorRefundedAndDeckKept,
          collectorSaveRoundTrip,
          oldWarriorGetsCollector,
          collectorNeverOverflowCandidate,
          baseCollectorNoMaterials,
          upgradedCollectorDropRules,
          materialDoesNotEnterCombatDeck,
          fullMaterialCollectionCanReplace,
          bountyAlwaysStandard52,
          bountyIgnoresCombatDeckMastery,
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
