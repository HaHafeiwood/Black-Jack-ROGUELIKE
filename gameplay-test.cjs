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
      roninChoice: !document.querySelector('#ronin-beheading-choice').classList.contains('hidden'),
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

    if (state.roninChoice) {
      await page.evaluate(() => document.querySelector('#ronin-beheading-refuse')?.click());
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
        const roundShieldPassive=ALL_PASSIVES.find(passive=>passive.id==='buckler'),samuraiRoundShieldBase=passiveDescription(roundShieldPassive,false),samuraiRoundShieldUpgrade=passiveDescription(roundShieldPassive,true),samuraiRoundShieldCodex=[...document.querySelectorAll('#codex-list .codex-card')].find(card=>card.querySelector('.cn')?.textContent.includes('圓盾'))?.textContent||'';
        const samuraiRoundShieldDescriptionCorrect=samuraiRoundShieldBase.includes('8點防禦等價')&&samuraiRoundShieldBase.includes('4心流')&&samuraiRoundShieldBase.includes('4次')&&samuraiRoundShieldUpgrade.includes('10點防禦等價')&&samuraiRoundShieldUpgrade.includes('5心流')&&samuraiRoundShieldUpgrade.includes('不消耗耐久')&&samuraiRoundShieldCodex.includes('武士專屬');
        const heartguardPassive=ALL_PASSIVES.find(passive=>passive.id==='heartguard'),samuraiHeartguardBase=passiveDescription(heartguardPassive,false),samuraiHeartguardUpgrade=passiveDescription(heartguardPassive,true),samuraiHeartguardCodex=[...document.querySelectorAll('#codex-list .codex-card')].find(card=>card.querySelector('.cn')?.textContent.includes('護心鏡'))?.textContent||'';
        const samuraiHeartguardDescriptionCorrect=samuraiHeartguardBase.includes('30%')&&samuraiHeartguardBase.includes('按50%轉為心流')&&samuraiHeartguardBase.includes('不直接提高')&&samuraiHeartguardUpgrade.includes('50%的防禦等價')&&samuraiHeartguardUpgrade.includes('架勢15／見切35')&&samuraiHeartguardCodex.includes('武士專屬');
        const straightPassive=ALL_PASSIVES.find(passive=>passive.id==='straight'),samuraiStraightBase=passiveDescription(straightPassive,false),samuraiStraightUpgrade=passiveDescription(straightPassive,true),samuraiStraightCodex=[...document.querySelectorAll('#codex-list .codex-card')].find(card=>card.querySelector('.cn')?.textContent.includes('連號'))?.textContent||'';
        const samuraiStraightDescriptionCorrect=samuraiStraightBase.includes('攻擊仍+18')&&samuraiStraightBase.includes('18點防禦等價')&&samuraiStraightBase.includes('9心流')&&samuraiStraightUpgrade.includes('攻擊+24')&&samuraiStraightUpgrade.includes('12心流')&&samuraiStraightUpgrade.includes('攻擊+40')&&samuraiStraightUpgrade.includes('20心流')&&samuraiStraightCodex.includes('武士專屬');
        G.character = 'warrior';
        G.battle = { lockedSkills: [] };
        const warriorKeepsGeneralBulwark = persistentDefenseActive() && bulwarkCounterattackActive();
        const warriorBulwarkDescriptionUnchanged = passiveDescription(ALL_PASSIVES.find(passive => passive.id === 'bulwark'), true) === ALL_PASSIVES.find(passive => passive.id === 'bulwark').descUp;
        const warriorRoundShieldDescriptionUnchanged=passiveDescription(roundShieldPassive,false)===roundShieldPassive.desc&&passiveDescription(roundShieldPassive,true)===roundShieldPassive.descUp;
        const warriorHeartguardDescriptionUnchanged=passiveDescription(heartguardPassive,false)===heartguardPassive.desc&&passiveDescription(heartguardPassive,true)===heartguardPassive.descUp;
        const warriorStraightDescriptionUnchanged=passiveDescription(straightPassive,false)===straightPassive.desc&&passiveDescription(straightPassive,true)===straightPassive.descUp;
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
        G.passives = ['toxicology'];G.upgrades = [];G.blades = ['toxicology'];G.activeBlade = 'toxicology';G.preferredBlade = 'toxicology';G.sealedPassive = 'toxicology';G.miracleAlignment = null;
        G.battle = { hand: [{ r: 2, s: '♠' }, { r: 3, s: '♥' }], over: false, busy: false, dealReady: true, pendingBust: false, lockedSkills: [{ id: 'toxicology' }], stolenUpgrades: [{ id: 'toxicology' }], samuraiFlow: 0, samuraiWeaponState: 'sheathed', samuraiPoisonDraw: false, samuraiZanshinTurns: 0, round: 1, target: 0, enemies: [] };
        const poisonBladeDefinition = BLADE_DEFS.toxicology.name === '蠱毒脇差' && BLADE_DEFS.toxicology.sourceId === 'toxicology' && BLADE_DEFS.toxicology.icon === '🐍' && BLADE_DEFS.toxicology.type === '脇差';G.upgrades = ['toxicology'];
        const forgedToxicologyProtection = hasP('toxicology') && isUp('toxicology') && !skillIsLocked('toxicology') && !upgradeStolen('toxicology');
        G.battle.lockedSkills = [];G.battle.stolenUpgrades = [];G.upgrades = [];
        const toxicTarget = { idx: 0, name: '毒傷測試敵人', type: 'slime', curhp: 2000, maxhp: 2000, shield: 0, statusResist: 0, poison: 0, virulence: 0, trauma: 0, toxicologyProgress: 0 };G.battle.enemies = [toxicTarget];
        const basePoisonRanks = toxicologyPoison([{ r: 2 }, { r: 3 }, { r: 4 }]) === 5;applyToxicology(toxicTarget,G.battle.hand);applyToxicology(toxicTarget,G.battle.hand);
        const baseVirulenceThreshold = toxicTarget.poison === 10 && toxicTarget.virulence === 1 && toxicTarget.toxicologyProgress === 0;
        G.upgrades = ['toxicology'];Object.assign(toxicTarget,{poison:0,virulence:0,toxicologyProgress:0});const upgradedPoisonRanks = toxicologyPoison([{ r: 2 }, { r: 3 }, { r: 4 }]) === 9;applyToxicology(toxicTarget,[{r:4}]);applyToxicology(toxicTarget,[{r:4}]);
        const upgradedVirulenceThreshold = toxicTarget.poison === 8 && toxicTarget.virulence === 1 && toxicTarget.toxicologyProgress === 0;
        G.upgrades = [];Object.assign(toxicTarget,{poison:0,virulence:0,toxicologyProgress:0,statusResist:.5});G.battle.samuraiFlow=0;const resistedApplied=applyToxicology(toxicTarget,G.battle.hand),baseTemper=grantPoisonTemperFlow(resistedApplied,0,false);G.battle.samuraiFlow=25;const toxicVein=grantPoisonTemperFlow(resistedApplied,25,false);
        const temperUsesActualPoisonAndHalfEven = resistedApplied === 3 && baseTemper === 2 && toxicVein === 3 && poisonTemperFlowGain(99,0) === 5 && poisonTemperFlowGain(99,25) === 10;
        Object.assign(toxicTarget,{curhp:2000,poison:20,virulence:2,trauma:1,statusResist:0});G.battle.samuraiFlow=0;
        const baseDraw=poisonDrawSnapshot(toxicTarget,0,false),corrodingDraw=poisonDrawSnapshot(toxicTarget,50,false),retainingDraw=poisonDrawSnapshot(toxicTarget,75,false);
        const poisonDrawScalingCorrect = baseDraw.base === 10 && baseDraw.remove === 10 && baseDraw.tick === 24 && baseDraw.damage === 48 && corrodingDraw.base === 15 && corrodingDraw.remove === 15 && corrodingDraw.damage === 90 && retainingDraw.base === 15 && retainingDraw.remove === 8 && retainingDraw.damage === 90;
        const hpBeforeBlockedDraw=toxicTarget.curhp,poisonBeforeBlockedDraw=toxicTarget.poison,blockedDraw=settlePoisonBurst(retainingDraw,0,0);
        toxicTarget.poison+=5;const successfulDraw=settlePoisonBurst(retainingDraw,1,5);
        const poisonDrawRequiresHpAndPreservesNewPoison = !blockedDraw.triggered && toxicTarget.curhp === hpBeforeBlockedDraw-90 && poisonBeforeBlockedDraw === 20 && successfulDraw.triggered && successfulDraw.removed === 8 && toxicTarget.poison === 17;
        Object.assign(toxicTarget,{type:'inquisitor',curhp:2000,poison:10,virulence:0,trauma:0});const reducedDraw=poisonDrawSnapshot(toxicTarget,0,false);
        const poisonBurstUsesExistingSpecialReduction = reducedDraw.tick === 7 && reducedDraw.damage === 14;
        Object.assign(toxicTarget,{type:'slime',curhp:2000,poison:40,virulence:1,trauma:1});const ultimatePoisonSnapshot=poisonDrawSnapshot(toxicTarget,100,true);toxicTarget.poison+=6;const ultimateBurst=settlePoisonBurst(ultimatePoisonSnapshot,0,6);
        const ultimateBurstUsesOldThirtyThroughShield = ultimatePoisonSnapshot.base === 30 && ultimatePoisonSnapshot.tick === 66 && ultimatePoisonSnapshot.damage === 198 && ultimateBurst.triggered && ultimateBurst.removed === 30 && toxicTarget.poison === 16;
        Object.assign(toxicTarget,{type:'slime',curhp:2000,poison:12,virulence:0,trauma:0});const staleTargetSnapshot=poisonDrawSnapshot(toxicTarget,75,false);toxicTarget.type='peng';const staleTargetResult=settlePoisonBurst(staleTargetSnapshot,10,0);
        const poisonDoesNotTransferAcrossForms = !staleTargetResult.triggered && toxicTarget.poison === 12 && toxicTarget.curhp === 2000;
        Object.assign(toxicTarget,{type:'slime',curhp:2000,poison:12,virulence:1,trauma:0,statusResist:0});G.upgrades=['toxicology'];Object.assign(G.battle,{samuraiFlow:100,samuraiWeaponState:'drawn',samuraiPoisonDraw:false,samuraiUltimate:'toxicology',hand:[{r:10,s:'♠'},{r:10,s:'♥'}]});
        const poisonUltimateInfo=samuraiUltimateInfo(),poisonUltimateDamage=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false);
        const poisonUltimateReadyAndMath = poisonUltimateInfo?.ready && poisonUltimateInfo.name === '百毒穿心' && poisonUltimateDamage.dmg === 175 && poisonUltimateDamage.shieldPierce === .5;
        const ultimateTemperBlocked=grantPoisonTemperFlow(10,100,true)===0;settleSamuraiUltimate('toxicology','百毒穿心');const poisonUltimateCleanup=ultimateTemperBlocked&&G.battle.samuraiFlow===0&&G.battle.samuraiWeaponState==='sheathed';
        Object.assign(G.battle,{samuraiFlow:75,samuraiWeaponState:'sheathed',samuraiPoisonDraw:false,samuraiUltimate:null,hand:[{r:2,s:'♠'},{r:3,s:'♥'}]});const poisonRngBefore=G.rngCalls,poisonRoundBefore=G.battle.round,poisonModeSelected=selectPoisonDraw(true),poisonModeText=document.querySelector('#battle-poison-draw-picker').textContent;
        const poisonDrawDirectProfile=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false),poisonDrawDirectMultiplier=poisonDrawDirectProfile.dmg===115&&poisonDrawDirectProfile.shieldPierce===.4;
        G.passives.push('firststrike');G.blades.push('firststrike');const poisonSwitch= switchBattleBlade('firststrike');
        const poisonDrawUiAndSwitchRules = poisonModeSelected && poisonModeText.includes('毒拔預計以 12 層計算、移除 6 層') && G.rngCalls === poisonRngBefore && G.battle.round === poisonRoundBefore && poisonSwitch && !G.battle.samuraiPoisonDraw;
        G.activeBlade='toxicology';G.battle.samuraiFlow=75;const poisonDetailText=bladeForgeRows(BLADE_DEFS.toxicology).flat().join('｜');
        const poisonDetailsComplete=['類型','脇差','目前目標','淬毒','毒拔居合','毒脈','蝕心','留毒','百毒穿心'].every(text=>poisonDetailText.includes(text));
        G.passives=['heartguard'];G.upgrades=[];G.blades=['heartguard'];G.activeBlade='heartguard';G.preferredBlade='heartguard';G.sealedPassive='heartguard';
        G.battle={hand:[{r:10,s:'♠'},{r:10,s:'♥'}],over:false,lockedSkills:[{id:'heartguard'}],stolenUpgrades:[{id:'heartguard'}],samuraiFlow:0,samuraiWeaponState:'drawn',samuraiGuardMode:null,samuraiGuardRate:0,samuraiDefenseFlow:0,samuraiDefenseSubmitFlow:0,samuraiDefenseFlowAwarded:0,samuraiHeartBladeSubmitted:false,samuraiZanshinTurns:0,guardStreak:0,blind:0,fracture:0,ironskin:1,focus:0,bucklerUses:0,bucklerBroken:false,enemies:[]};
        const heartBladeDefinition=BLADE_DEFS.heartguard.name==='鏡心打刀'&&BLADE_DEFS.heartguard.sourceId==='heartguard'&&BLADE_DEFS.heartguard.icon==='🪞'&&BLADE_DEFS.heartguard.type==='打刀';G.upgrades=['heartguard'];
        const forgedHeartguardProtection=hasP('heartguard')&&isUp('heartguard')&&!skillIsLocked('heartguard')&&!upgradeStolen('heartguard');G.battle.lockedSkills=[];G.battle.stolenUpgrades=[];G.upgrades=[];
        const heartBaseProfile=samuraiDefenseFlowBonus(G.battle.hand,false);G.upgrades=['heartguard'];const heartUpgradedProfile=samuraiDefenseFlowBonus(G.battle.hand,false);
        const heartguardRatesPreserved=heartBaseProfile.heartguardEquivalent===6&&heartBaseProfile.heartguardFlow===6&&heartUpgradedProfile.heartguardEquivalent===10&&heartUpgradedProfile.heartguardFlow===10;
        G.upgrades=[];G.passives=['heartguard','straight','buckler'];G.battle.hand=[{r:2,s:'♠'},{r:3,s:'♥'},{r:4,s:'♦'}];G.battle.samuraiFlow=0;G.battle.bucklerUses=0;G.battle.bucklerBroken=false;
        const separatedHeartSources=samuraiDefenseFlowBonus(G.battle.hand,false),onlyHeartguardGetsFullConversion=separatedHeartSources.heartguardEquivalent===3&&separatedHeartSources.heartguardFlow===3&&separatedHeartSources.otherEquivalent===18&&separatedHeartSources.bucklerFlow===4&&separatedHeartSources.flow===16;
        G.passives=['heartguard'];G.battle.hand=[{r:4,s:'♠'}];G.battle.samuraiFlow=25;const calmProfile=samuraiDefenseFlowBonus(G.battle.hand,false);G.battle.samuraiFlow=24;const beforeCalmProfile=samuraiDefenseFlowBonus(G.battle.hand,false);
        const calmUsesSubmitThreshold=calmProfile.heartguardEquivalent===1&&calmProfile.heartguardFlow===4&&calmProfile.heartguardMinimumApplied&&!beforeCalmProfile.heartguardMinimumApplied&&beforeCalmProfile.heartguardFlow===1;
        G.battle.hand=[{r:10,s:'♠'},{r:10,s:'♥'}];G.battle.samuraiFlow=75;const clearReward=samuraiGuardFlowReward('mikiri',{flow:10},20,20,75),belowClearReward=samuraiGuardFlowReward('mikiri',{flow:10},20,20,74),cappedClearReward=samuraiGuardFlowReward('mikiri',{flow:10},30,20,75);
        const clearMindUsesSubmitThresholdAndCap=clearReward.clear===4&&clearReward.total===34&&belowClearReward.clear===0&&belowClearReward.total===30&&cappedClearReward.total===35;
        Object.assign(G.battle,{samuraiFlow:50,samuraiGuardMode:'stance',samuraiDefenseSubmitFlow:50,samuraiDefenseFlowAwarded:11,samuraiHeartBladeSubmitted:true});const noHarmGain=settleHeartBladeNoHarm(1,1,0),noHarmRejectedOnHp=settleHeartBladeNoHarm(1,1,1),noHarmRejectedWithoutAttack=settleHeartBladeNoHarm(0,1,0);
        Object.assign(G.battle,{samuraiFlow:75,samuraiDefenseFlowAwarded:14});const cappedNoHarmGain=settleHeartBladeNoHarm(1,1,0);
        const noHarmRequiresAttackAndRespectsCap=noHarmGain===3&&noHarmRejectedOnHp===0&&noHarmRejectedWithoutAttack===0&&cappedNoHarmGain===1&&G.battle.samuraiFlow===76;
        G.upgrades=['heartguard'];Object.assign(G.battle,{hand:[{r:10,s:'♠'},{r:7,s:'♥'}],samuraiFlow:100,samuraiWeaponState:'drawn',samuraiUltimate:'heartguard'});const heartUltimateInfo=samuraiUltimateInfo(),heartUltimateDamage=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false);settleSamuraiUltimate('heartguard','護心一文字');
        const heartUltimateReadyAndMath=heartUltimateInfo?.ready&&heartUltimateInfo.name==='護心一文字'&&heartUltimateDamage.dmg===175&&heartUltimateDamage.shieldPierce===.5&&G.battle.samuraiFlow===0&&G.battle.samuraiWeaponState==='sheathed';
        Object.assign(G.battle,{samuraiFlow:75,samuraiWeaponState:'sheathed',samuraiUltimate:null,hand:[{r:10,s:'♠'},{r:10,s:'♥'}]});const heartNormalIaido=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false),heartDetailText=bladeForgeRows(BLADE_DEFS.heartguard).flat().join('｜');
        const heartNormalIaidoAndDetails=heartNormalIaido.dmg===115&&['類型','打刀','心鏡流轉','定心','無傷','澄心','護心一文字','架勢預計最多','見切的裝備'].every(text=>heartDetailText.includes(text));
        G.passives=['dragonneck'];G.upgrades=[];G.blades=['dragonneck'];G.activeBlade='dragonneck';G.preferredBlade='dragonneck';G.sealedPassive='dragonneck';G.hp=100;G.maxhp=200;
        G.battle={hand:[],over:false,busy:false,dealReady:true,pendingBust:false,lockedSkills:[{id:'dragonneck'}],stolenUpgrades:[{id:'dragonneck'}],samuraiFlow:0,samuraiWeaponState:'sheathed',samuraiDragonSheath:false,samuraiZanshinTurns:0,corruption:0,round:1,enemies:[]};
        const dragonAcceptance1=BLADE_DEFS.dragonneck.name==='五龍大太刀'&&BLADE_DEFS.dragonneck.sourceId==='dragonneck'&&BLADE_DEFS.dragonneck.icon==='🐉'&&BLADE_DEFS.dragonneck.type==='太刀';
        const dragonAcceptance2=hasP('dragonneck')&&!skillIsLocked('dragonneck')&&!upgradeStolen('dragonneck');
        const dragonHands=[2,3,4,5].map(count=>Array.from({length:count},(_,i)=>({r:i?2:10,s:'♠'})));
        const dragonIaidos=dragonHands.map(hand=>{G.battle.hand=hand;G.battle.samuraiWeaponState='sheathed';G.battle.samuraiUltimate=null;return finalizeSamuraiAttackDamage({dmg:100,notes:[]},hand,false).dmg;});
        const dragonAcceptance3=dragonIaidos[0]===110;
        const dragonAcceptance4=dragonIaidos[1]===115;
        const dragonAcceptance5=dragonIaidos[2]===120;
        const dragonAcceptance6=dragonIaidos[3]===130;
        const dragonAcceptance7=dragonWalkGain(3,false,1,false)===2;
        const dragonAcceptance8=dragonWalkGain(4,false,1,false)===4;
        const dragonAcceptance9=dragonWalkGain(5,true,1,false)===10;
        const dragonAcceptance10=dragonWalkGain(6,true,1,false)===10;
        const dragonAcceptance11=dragonWalkGain(5,true,0,false)===0;
        const dragonAcceptance12=dragonBreathGain(49,25,false)===4;
        const dragonAcceptance13=dragonBreathGain(80,25,false)===8;
        const dragonAcceptance14=dragonBreathGain(0,25,false)===0;
        G.battle.hand=dragonHands[3];G.battle.samuraiWeaponState='drawn';G.battle.samuraiFlow=50;G.battle.samuraiUltimate=null;const dragonThreatProfile=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false);
        const dragonAcceptance15=dragonThreatProfile.dmg===100&&dragonThreatProfile.shieldPierce===.4;
        G.battle.samuraiFlow=75;const dragonRngBefore=G.rngCalls,dragonRoundBefore=G.battle.round,dragonChoice=selectDragonSheath(true);
        const dragonAcceptance16=dragonChoice&&G.battle.samuraiDragonSheath&&G.rngCalls===dragonRngBefore&&G.battle.round===dragonRoundBefore;
        selectDragonSheath(false);const dragonAcceptance17=!G.battle.samuraiDragonSheath;
        G.upgrades=['dragonneck'];G.battle.samuraiFlow=100;G.battle.samuraiWeaponState='sheathed';G.battle.samuraiUltimate=null;G.battle.hand=dragonHands[2];const dragonFourCardUltimate=samuraiUltimateInfo();
        const dragonAcceptance18=dragonFourCardUltimate?.name==='五龍吞天'&&!dragonFourCardUltimate.ready;
        G.battle.hand=dragonHands[3];const dragonFiveCardUltimate=samuraiUltimateInfo();G.battle.samuraiUltimate='dragonneck';const dragonUltimateProfile=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false);
        const dragonAcceptance19=dragonFiveCardUltimate?.ready&&dragonFiveCardUltimate.name==='五龍吞天';
        const dragonAcceptance20=dragonUltimateProfile.dmg===210&&dragonUltimateProfile.shieldPierce===.6;
        const dragonAcceptance21=dragonBreathGain(80,100,true)===0&&dragonWalkGain(5,true,1,true)===0;
        settleSamuraiUltimate('dragonneck','五龍吞天');const dragonAcceptance22=G.battle.samuraiFlow===0&&G.battle.samuraiWeaponState==='sheathed';
        const dragonDetailText=bladeForgeRows(BLADE_DEFS.dragonneck).flat().join('｜');const dragonAcceptance23=['五龍大太刀','×1.10／×1.15／×1.20／×1.30','龍行','龍息','龍威','乘龍歸鞘','五龍吞天','60%'].every(text=>dragonDetailText.includes(text));
        const fortuneBladeAcceptance=(()=>{
          newGame('samurai','fortune-blade');G.floor=3;G.nodeType='shop';G.passives=['luckycoin'];G.upgrades=[];G.blades=[];G.fortune=0;G.hp=90;G.maxhp=100;
          const a1=gainFortune(1,'測試')===0&&G.fortune===0;
          G.blades=['luckycoin'];G.activeBlade='luckycoin';G.preferredBlade='luckycoin';G.shopFortuneVisit=null;const entry=applyLuckyCoinShopEntry(),a2=entry.healed===5&&entry.fortune===1&&G.fortune===1;
          G.hp=G.maxhp;G.shopFortuneVisit=null;const fullEntry=applyLuckyCoinShopEntry(),a3=fullEntry.healed===0&&fullEntry.fortune===0;
          G.hp=90;G.shopFortuneVisit=null;const firstEntry=applyLuckyCoinShopEntry(),secondEntry=applyLuckyCoinShopEntry(),a4=firstEntry.fortune===1&&secondEntry.duplicate===true&&G.fortune===2;
          const marked=markLuckyDiscountPurchase(20),spendGain=settleShopFortune(),a5=marked&&spendGain===1&&G.fortune===3;
          markLuckyDiscountPurchase(20);const duplicateSpend=settleShopFortune(),a6=duplicateSpend===0&&G.fortune===3;
          G.shopFortuneVisit=null;const zeroRejected=!markLuckyDiscountPurchase(0)&&!ensureShopFortuneVisit().discountPurchase,a7=zeroRejected;
          G.fortune=0;G.hp=90;G.shopFortuneVisit=null;const visitEntry=applyLuckyCoinShopEntry();markLuckyDiscountPurchase(10);const visitSpend=settleShopFortune(),a8=visitEntry.fortune===1&&visitSpend===1&&G.fortune===2;
          G.fortune=5;const capped=gainFortune(2,'測試上限'),a9=capped===0&&G.fortune===5;
          G.activeBlade='firststrike';const retained=G.fortune;G.activeBlade='luckycoin';const a10=retained===5&&G.fortune===5;
          G.battle={hand:[{r:10,s:'♠'},{r:7,s:'♥'}],over:false,busy:false,dealReady:true,pendingBust:false,target:0,enemies:[],samuraiFlow:0,samuraiWeaponState:'sheathed',samuraiZanshinTurns:0,weakness:0,focus:0,ironskin:1,whetstone:1,lockedSkills:[],stolenUpgrades:[],round:1};
          const a11=fortuneAttackProfile(17,0,true,false).multiplier===1.15;
          G.fortune=2;G.battle.samuraiFlow=0;const openProfile=fortuneAttackProfile(16,0,false,false),openResult=settleFortuneAttack(openProfile,1),a12=openResult.spent===1&&openResult.flow===6&&G.fortune===1;
          const missBefore=G.fortune,missFlow=G.battle.samuraiFlow,missResult=settleFortuneAttack(fortuneAttackProfile(16,0,false,false),0),a13=!missResult.triggered&&G.fortune===missBefore&&G.battle.samuraiFlow===missFlow;
          G.fortune=2;G.battle.samuraiFlow=25;const minor=fortuneAttackProfile(17,25,false,false),minorResult=settleFortuneAttack(minor,1),a14=minor.flowGain===9&&minorResult.flow===9;
          G.fortune=2;G.battle.samuraiFlow=24;const beforeThreshold=fortuneAttackProfile(17,24,false,false),a15=beforeThreshold.flowGain===6;
          G.battle.samuraiFlow=50;G.fortune=2;G.battle.samuraiWeaponState='drawn';const slash50=fortuneAttackProfile(17,50,false,false),slashDamage=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false);G.battle.samuraiWeaponState='sheathed';const iaido50=fortuneAttackProfile(17,50,true,false),iaidoDamage=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false),a16=slash50.multiplier===1.10&&slashDamage.dmg===110,a17=iaido50.multiplier===1.25&&iaidoDamage.dmg===125;
          G.battle.samuraiFlow=75;G.fortune=2;const great=fortuneAttackProfile(21,75,false,false),greatResult=settleFortuneAttack(great,1),a18=greatResult.flow===9&&greatResult.spent===0&&G.fortune===2;
          G.fortune=0;const noFortune=fortuneAttackProfile(21,75,false,false),a19=!noFortune.prepared&&!noFortune.great;
          G.upgrades=['luckycoin'];G.battle.samuraiFlow=100;G.battle.hand=[{r:10,s:'♠'},{r:7,s:'♥'}];G.fortune=2;const lowUltimate=samuraiUltimateInfo(),a20=lowUltimate?.name==='一擲萬福'&&!lowUltimate.ready;
          G.fortune=3;const u3=fortuneAttackProfile(17,100,true,true).multiplier;G.fortune=4;const u4=fortuneAttackProfile(17,100,true,true).multiplier;G.fortune=5;const u5=fortuneAttackProfile(17,100,true,true).multiplier,a21=near([u3,u4,u5],[1.9,2,2.1]);
          G.hp=50;G.maxhp=100;G.battle.corruption=0;const heals=[3,4,5].map(stacks=>fortuneUltimateHealPreview(stacks).raw),a22=heals.join(',')==='30,40,50';
          G.fortune=3;G.battle.samuraiFlow=100;const ultimateSettle=settleFortuneUltimate(3),a23=ultimateSettle.used===3&&G.fortune===0;
          G.fortune=3;G.battle.samuraiWeaponState='sheathed';G.battle.samuraiUltimate='luckycoin';const ultimateProfile=fortuneAttackProfile(17,100,true,true),ultimateDamage=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false),a24=Math.abs(ultimateProfile.multiplier-1.9)<1e-9&&ultimateDamage.dmg===190&&ultimateDamage.shieldPierce===.5;G.battle.samuraiUltimate=null;
          G.battle.samuraiFlow=100;G.battle.samuraiWeaponState='drawn';settleSamuraiUltimate('luckycoin','一擲萬福');const a25=G.battle.samuraiFlow===0&&G.battle.samuraiWeaponState==='sheathed';
          G.fortune=4;G.passivePaid={luckycoin:100};G.passiveAffixes={};G.nodeType='shop';G._shopPicks=[];G._shopRankBoosts=[];G._shopPurchases=[];sellPassive('luckycoin');const a26=!G.passives.includes('luckycoin')&&!G.blades.includes('luckycoin')&&G.fortune===0;
          G.passives=['luckycoin'];G.upgrades=['luckycoin'];G.blades=['luckycoin'];G.activeBlade='luckycoin';G.preferredBlade='luckycoin';G.fortune=4;G.shopFortuneVisit={key:`shop:${G.floor}`,entryGranted:true,discountPurchase:true,spendGranted:false};const saved=createFloorCheckpoint(),restored=restoreSave({format:SAVE_FORMAT,saveVersion:SAVE_VERSION,progress:saved}).state,a27=restored.fortune===4&&restored.shopFortuneVisit?.entryGranted&&restored.shopFortuneVisit?.discountPurchase&&!restored.shopFortuneVisit?.spendGranted;
          G=restored;G.battle={hand:[{r:10,s:'♠'},{r:7,s:'♥'}],samuraiFlow:75,samuraiWeaponState:'sheathed',pendingBust:false};const detail=bladeForgeRows(BLADE_DEFS.luckycoin).flat().join('｜'),detailNeeds=['招福脇差','福緣','入店之福','消費之福','開運','小吉','福斬','大吉','一擲萬福','×1.90／×2.00／×2.10'],a28=detailNeeds.every(text=>detail.includes(text));
          return {a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28};
        })();
        const rubyBladeAcceptance=(()=>{
          newGame('samurai','ruby-blade');G.passives=['rubyring'];G.upgrades=[];G.blades=['rubyring'];G.activeBlade='rubyring';G.preferredBlade='rubyring';G.hp=100;G.maxhp=300;
          G.battle={hand:[{r:10,s:'♠'},{r:7,s:'♥'}],over:false,busy:false,dealReady:true,pendingBust:false,target:0,enemies:[],samuraiFlow:0,samuraiWeaponState:'drawn',samuraiUltimate:null,samuraiZanshinTurns:0,weakness:0,focus:0,ironskin:1,whetstone:1,lockedSkills:[],stolenUpgrades:[],corruption:0,round:1,blind:0};
          const makeTarget=(shield=0,hp=100)=>({idx:0,name:'緋晶測試目標',type:'slime',curhp:hp,maxhp:hp,shield,nextDmg:0,statusResist:0,poison:0,virulence:0,bleed:0,burn:0,trauma:0,sepsis:0,fracture:0,weakness:0});
          const a1=rubyBladeAttackProfile(17,0,100,false,false).fixed===5,a2=rubyBladeAttackProfile(17,0,150,false,false).fixed===7,a3=rubyBladeAttackProfile(17,50,200,false,false).fixed===20,a4=rubyBladeAttackProfile(20,75,150,false,false).fixed===22;
          G.hp=150;G.battle.hand=[{r:10,s:'♠'},{r:10,s:'♥'}];G.battle.samuraiFlow=75;const flawlessProfile=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false,{hpSnapshot:150,submitFlow:75}),a5=flawlessProfile.dmg===122&&flawlessProfile.rubyFlat===22&&flawlessProfile.shieldPierce===.3;
          G.hp=100;G.battle.hand=[{r:10,s:'♠'},{r:7,s:'♥'}];G.battle.samuraiFlow=0;G.battle.samuraiWeaponState='sheathed';const rubyIaido=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false,{hpSnapshot:100,submitFlow:0}),a6=rubyIaido.dmg===120&&rubyIaido.rubyFlat===5;
          Object.assign(G.battle,{samuraiWeaponState:'sheathed',samuraiZanshinTurns:3,samuraiZanshinDuration:3,samuraiZanshinAttack:.25,samuraiZanshinReduction:.15,samuraiZanshinStrong:false});const rubyZanshin=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false,{hpSnapshot:100,submitFlow:0}),spellIsolated=applyAttackSpellMultiplier({...rubyZanshin,notes:[...rubyZanshin.notes]},1.2);let a7=rubyZanshin.dmg===149&&rubyZanshin.rubyFlat===5&&spellIsolated.dmg===178;Object.assign(G.battle,{samuraiZanshinTurns:0,samuraiZanshinDuration:0,samuraiZanshinAttack:0,samuraiZanshinReduction:0,samuraiWeaponState:'drawn'});const traumaTarget=makeTarget();traumaTarget.trauma=1;G.battle.enemies=[traumaTarget];a7=a7&&attackEnemy(105,{postMultiplierFlat:5})===135;
          G.battle.samuraiFlow=25;const assistedTarget=makeTarget(12);G.battle.enemies=[assistedTarget];const assistedDealt=attackEnemy(15,{postMultiplierFlat:5}),assistedFlow=settleRubyBloodReflection(rubyBladeAttackProfile(17,25,100,false,false),assistedDealt),a8=assistedDealt===3&&assistedFlow===4&&G.battle.samuraiFlow===29;
          const blockedTarget=makeTarget(20);G.battle.enemies=[blockedTarget];G.battle.samuraiFlow=25;const blockedDealt=attackEnemy(15,{postMultiplierFlat:5}),blockedFlow=settleRubyBloodReflection(rubyBladeAttackProfile(17,25,100,false,false),blockedDealt),a9=blockedDealt===0&&blockedFlow===0&&G.battle.samuraiFlow===25;
          const a10=rubyBladeAttackProfile(17,25,100,false,false).bloodReflection===4,a11=rubyBladeAttackProfile(17,25,150,false,false).bloodReflection===6,a12=rubyBladeAttackProfile(17,24,100,false,false).bloodReflection===0,a13=rubyBladeAttackProfile(17,49,200,false,false).rate===.05,a14=rubyBladeAttackProfile(20,74,200,false,false).rate===.10,a15=rubyBladeAttackProfile(19,75,200,false,false).rate===.10;
          G.hp=100;G.battle.samuraiFlow=25;G.battle.hand=[{r:10,s:'♠'},{r:7,s:'♥'}];const rapidProfile=finalizeSamuraiAttackDamage({dmg:30,notes:[],rapid:{segments:3,segmentDamage:10}},G.battle.hand,false,{hpSnapshot:100,submitFlow:25}),rapidTarget=makeTarget(0,200);G.battle.enemies=[rapidTarget];const rapidResult=executeRapidStrikes(rapidProfile.rapid,false),rapidFlow=settleRubyBloodReflection(rapidProfile.rubyProfile,rapidResult.dealt),a16=rapidProfile.rubyFlat===5&&rapidProfile.rapid.postMultiplierFlat===5&&rapidResult.dealt===35&&rapidFlow===4;
          G.upgrades=['rubyring'];G.battle.hand=[{r:10,s:'♠'},{r:7,s:'♥'}];G.battle.samuraiFlow=100;G.battle.samuraiWeaponState='sheathed';G.battle.samuraiUltimate='rubyring';const ultimate100=finalizeSamuraiAttackDamage({dmg:100,notes:[]},G.battle.hand,false,{hpSnapshot:100,submitFlow:100}),a17=ultimate100.dmg===225&&ultimate100.rubyFlat===50;
          const ultimate200=rubyBladeAttackProfile(17,100,200,true,true),a18=ultimate200.fixed===100,a19=ultimate100.dmg-ultimate100.rubyFlat===175&&ultimate100.rubyFlat===50,a20=ultimate100.dmg===225&&ultimate100.rubyProfile.label==='紅玉',a21=ultimate100.shieldPierce===.5;
          G.hp=50;G.maxhp=300;G.battle.corruption=0;G.miracleAlignment=null;const healNormal=settleRubyUltimate(),a22=healNormal.healed===15;
          G.hp=50;G.battle.corruption=1;G.miracleAlignment=null;G.faction=0;const healCorrupt=settleRubyUltimate();G.hp=50;G.faction=1000;G.miracleAlignment='holy';const healHoly=settleRubyUltimate(),a23=healCorrupt.healed===12&&healHoly.healed===24;
          G.hp=50;G.battle.corruption=0;G.faction=0;G.miracleAlignment=null;const ultimateBlockedTarget=makeTarget(999);G.battle.enemies=[ultimateBlockedTarget];const fullyBlocked=attackEnemy(ultimate100.dmg,{shieldPierce:.5,postMultiplierFlat:ultimate100.rubyFlat}),healAfterBlock=settleRubyUltimate(),a24=fullyBlocked===0&&healAfterBlock.healed===15;
          G.hp=50;Object.assign(G.battle,{enemies:[makeTarget()],samuraiFlow:100,samuraiWeaponState:'drawn',samuraiUltimate:null,blind:1,pendingBust:false,over:false,busy:false,dealReady:true});const hpBeforeCancel=G.hp;useSamuraiUltimate();const a25=G.hp===hpBeforeCancel&&G.battle.samuraiUltimate==null;
          Object.assign(G.battle,{blind:0,samuraiFlow:100,samuraiWeaponState:'drawn'});settleSamuraiUltimate('rubyring','緋晶一閃');const a26=G.battle.samuraiFlow===0&&G.battle.samuraiWeaponState==='sheathed';
          G.passivePaid={rubyring:100};G.passiveAffixes={};G.nodeType='shop';G._shopPicks=[];G._shopRankBoosts=[];G._shopPurchases=[];sellPassive('rubyring');const a27=!G.passives.includes('rubyring')&&!G.blades.includes('rubyring');
          G.passives=['rubyring'];G.upgrades=['rubyring'];G.blades=['rubyring'];G.activeBlade='rubyring';G.preferredBlade='rubyring';G.hp=150;Object.assign(G.battle,{hand:[{r:10,s:'♠'},{r:10,s:'♥'}],samuraiFlow:75,samuraiWeaponState:'sheathed',pendingBust:false});const details=bladeForgeRows(BLADE_DEFS.rubyring).flat().join('｜'),a28=BLADE_DEFS.rubyring.name==='緋晶打刀'&&BLADE_DEFS.rubyring.type==='打刀'&&['目前 HP「實際數值」','5%','10%','15%','50%','血映','30%','15 HP','緋晶一閃'].every(text=>details.includes(text));
          return {a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,a23,a24,a25,a26,a27,a28};
        })();
        const thousandStrikeAcceptance=(()=>{
          newGame('warrior','thousand-strike-rework');G.floor=1;G.passives=['thousandstrikes'];G.upgrades=[];G.passiveAffixes={};G.rankFlatDamage=Object.fromEntries(CARD_RANKS.map(rank=>[String(rank),0]));G.suitFlatDamage=Object.fromEntries(SUITS.map(suit=>[suit,0]));G.rankDamage=Object.fromEntries(CARD_RANKS.map(rank=>[String(rank),100]));G.suitDamage=Object.fromEntries(SUITS.map(suit=>[suit,100]));
          const hand=[{r:2,s:'♠'},{r:5,s:'♥'}],enemy=(idx,name,hp=100,shield=0)=>({idx,name,type:'slime',curhp:hp,maxhp:hp,shield,statusResist:0,poison:0,virulence:0,bleed:0,burn:0,trauma:0,sepsis:0,fracture:0,weakness:0,nextDmg:0});
          G.battle={hand,over:false,busy:false,dealReady:true,pendingBust:false,target:0,enemies:[],weakness:0,focus:0,defense:0,ironskin:1,whetstone:1,inquisitorBattle:false,inquisitorDamageCrime:false,lockedSkills:[],stolenUpgrades:[],round:1};
          G.passives=[];const noPassiveDamage=computeDamage(hand,false).dmg;G.passives=['thousandstrikes'];const noCombo=computeDamage(hand,false);
          const a1=noCombo.dmg===noPassiveDamage&&noCombo.thousand.total===0;
          const a2=thousandStrikeSegments(10,5).join(',')==='2,2,2,2,2';
          const a3=thousandStrikeSegments(15,7).join(',')==='3,2,2,2,2,2,2';
          G.rankFlatDamage['2']=10;const normalCombo=computeDamage(hand,false);G.passives.push('doublebet');G.luckyNumber=7;const luckyCombo=computeDamage(hand,false);
          const a4=normalCombo.thousand.total===10&&luckyCombo.thousand.total===10;
          const a5=luckyCombo.dmg===Math.round(normalCombo.dmg*1.35);
          G.battle.weakness=1;const weakCombo=computeDamage(hand,false);const a6=weakCombo.thousand.total===9;G.battle.weakness=0;
          const shielded=enemy(0,'護盾目標',100,3);G.battle.enemies=[shielded];G.battle.target=0;const shieldResult=executeThousandStrikes({comboValue:4,total:4,segments:[2,2]},shielded);const a7=shieldResult.dealt===1&&shielded.shield===0&&shielded.curhp===99;
          const a8=shieldResult.byTarget.length===1&&shieldResult.byTarget[0].hits===2;
          const replay=()=>{const dead=enemy(0,'原目標',0),others=[enemy(1,'甲',1),enemy(2,'乙',1),enemy(3,'丙',1)];G.battle.enemies=[dead,...others];G.battle.target=0;G.rngState=seedStateFromCode('thousand-transfer');G.rngCalls=0;const result=executeThousandStrikes({comboValue:3,total:3,segments:[1,1,1]},dead);return result.byTarget.map(entry=>entry.target.name).join(',');};
          const transferA=replay(),transferB=replay(),a9=transferA===transferB;
          const deadOriginal=enemy(0,'倒下原目標',0),survivor=enemy(1,'存活目標',10);G.battle.enemies=[deadOriginal,survivor];G.battle.target=0;const transferred=executeThousandStrikes({comboValue:2,total:2,segments:[1,1]},deadOriginal);const a10=transferred.dealt===2&&survivor.curhp===8;
          G.battle.enemies=[deadOriginal];G.battle.target=0;const stopped=executeThousandStrikes({comboValue:2,total:2,segments:[1,1]},deadOriginal);const a11=stopped.dealt===0&&stopped.byTarget.length===0;
          G.passives=['thousandstrikes','toxicology'];G.upgrades=[];const poisonHand=[{r:2,s:'♠'},{r:2,s:'♥'}],poisonBase=toxicologyPoisonProfile(poisonHand);G.upgrades=['thousandstrikes'];const poisonUp=toxicologyPoisonProfile(poisonHand);const a12=poisonBase.base===4&&poisonBase.total===6&&poisonUp.total===8;
          const poisonTarget=enemy(0,'抗毒目標',100);poisonTarget.statusResist=.5;G.battle.enemies=[poisonTarget];G.battle.target=0;G.upgrades=[];const applied=applyToxicology(poisonTarget,poisonHand,true);const a13=applied===3&&poisonTarget.poison===3;
          const a14=poisonTarget.toxicologyProgress===3;
          const overkill=enemy(0,'過量目標',2);G.battle.enemies=[overkill];G.battle.target=0;const overkillResult=executeThousandStrikes({comboValue:10,total:10,segments:[10]},overkill);const a15=overkillResult.dealt===2;
          const a16=thousandStrikeLifestealAmount(19,.3)===2&&thousandStrikeLifestealAmount(1,.3)===0;
          const execution=enemy(0,'斬首目標',4);execution.maxhp=100;G.passives=['thousandstrikes','beheading'];G.beheadingPercent=5;G.battle.enemies=[execution];G.battle.target=0;const firstExecution=settleThousandBeheading(execution),secondExecution=settleThousandBeheading(execution);const a17=firstExecution===4&&secondExecution===0&&execution.curhp<=0;
          G.passives=['thousandstrikes','insurance'];const bustProfile=computeDamage([{r:10,s:'♠'},{r:10,s:'♥'},{r:5,s:'♦'}],true);const a18=!bustProfile.thousand;
          const a19=!SUIT_SPELL_DEFS.throwingKnife.followup&&!CONSUMABLES.find(item=>item.id==='throwingKnife').followup;
          const card=ALL_PASSIVES.find(passive=>passive.id==='thousandstrikes'),a20=card.desc.includes('連擊值 100%')&&card.descUp.includes('連擊值 150%')&&!`${card.desc}${card.descUp}`.includes('牌面傷害30%');
          G.passives=['thousandstrikes'];G.upgrades=['thousandstrikes'];G.passiveAffixes={thousandstrikes:'sharp'};G.passivePaid={thousandstrikes:260};const saved=createFloorCheckpoint(),restored=restoreSave({format:SAVE_FORMAT,saveVersion:SAVE_VERSION,progress:saved}).state;const a21=restored.passives.includes('thousandstrikes')&&restored.upgrades.includes('thousandstrikes')&&restored.passiveAffixes.thousandstrikes==='sharp'&&restored.passivePaid.thousandstrikes===260;
          G.passives=[];G.upgrades=[];G.passiveAffixes={};G.rankFlatDamage['2']=0;G.battle.weakness=0;const unchangedA=computeDamage(hand,false).dmg,unchangedB=computeDamage(hand,false).dmg,a22=unchangedA===unchangedB;
          const segmentCases=[0,1,3,5,6,10,100].map(value=>thousandStrikeSegments(value,5)),specialCases=segmentCases[0].length===0&&segmentCases[1].join(',')==='1'&&segmentCases[2].join(',')==='1,1,1'&&segmentCases[4].reduce((a,b)=>a+b,0)===6&&segmentCases[6].reduce((a,b)=>a+b,0)===100;
          return {a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15,a16,a17,a18,a19,a20,a21,a22,specialCases};
        })();
        const fiveNewBladeAcceptance=(()=>{
          const defs=BLADE_DEFS,definitions=defs.straight.name==='十三階太刀'&&defs.bountyhunter.name==='懸賞打刀'&&defs.laststand.name==='沉舟太刀'&&defs.thousandstrikes.name==='剎那太刀'&&defs.beheading.name==='首塚大太刀';
          newGame('samurai','five-new-blades');G.passives=['straight'];G.blades=['straight'];G.activeBlade='straight';G.preferredBlade='straight';G.battle={hand:[],enemies:[],target:0,samuraiFlow:0,samuraiWeaponState:'sheathed',samuraiThirteenAdvanced:false,lockedSkills:[],stolenUpgrades:[]};
          ['A',2,3,5,4].forEach(rank=>recordThirteenDraw({r:rank,s:'♠'}));const sequenceOnly=G.thirteenStage===4&&G.thirteenThrough===false;recordThirteenDraw({r:5,s:'♠'});
          [6,7,8,9,10,'J','Q','K'].forEach(rank=>recordThirteenDraw({r:rank,s:'♠'}));const throughEarned=G.thirteenStage===13&&G.thirteenThrough&&Math.abs(thirteenStageMultiplier()-1.13)<1e-9,stageFlow=G.battle.samuraiFlow===91,throughProfiles=thirteenThroughProfile(74).multiplier===1.5&&thirteenThroughProfile(75).multiplier===1.7&&thirteenThroughProfile(75).pierce===.4;
          const saved=createFloorCheckpoint(),restored=restoreSave({format:SAVE_FORMAT,saveVersion:SAVE_VERSION,progress:saved}).state,stageSaved=restored.thirteenStage===13&&restored.thirteenThrough;
          G.thirteenStage=2;G.thirteenThrough=false;G.battle.hand=[{r:'A',s:'♠'},{r:2,s:'♥'},{r:3,s:'♦'}];G.battle.samuraiFlow=25;G.battle.samuraiThirteenAdvanced=false;G.battle.samuraiThirteenConnected=false;recordThirteenDraw(G.battle.hand[2]);const connectedAfterAdvance=G.battle.samuraiFlow===33&&G.battle.samuraiThirteenConnected;G.thirteenStage=5;G.battle.hand=[{r:'A',s:'♠'},{r:2,s:'♥'},{r:3,s:'♦'}];G.battle.samuraiFlow=25;G.battle.samuraiThirteenAdvanced=false;G.battle.samuraiThirteenConnected=false;recordThirteenDraw({r:9,s:'♣'});const noConnectWithoutAdvance=G.battle.samuraiFlow===25&&!G.battle.samuraiThirteenConnected;
          G=restored;consumeThirteenThrough();const throughConsumed=G.thirteenStage===0&&!G.thirteenThrough;
          G.passives=['bountyhunter'];G.blades=['bountyhunter'];G.activeBlade='bountyhunter';G.bountyHunt={bonuses:[20]};const bountyTarget={idx:0,name:'懸賞目標',curhp:100,maxhp:100};G.battle={bountyHuntActive:true,samuraiPlayerAttackCount:0,samuraiBountyBlade:null,enemies:[bountyTarget],target:0,samuraiFlow:25};const bounty=lockBountyTarget(bountyTarget);bounty.pursuit=20;const bountyLocked=bounty.target===bountyTarget&&bounty.locked&&bountyDirectReward(bounty,20,false,25)===23,bountyThreshold=bountyDirectReward({pursuit:20,settled:false},20,false,24)===15&&bountyDirectReward({pursuit:20,settled:false},20,false,25)===23;
          G.maxhp=100;G.hp=50;const sinkingBase=Math.abs(sinkingLostMultiplier(50,0)-1.10)<1e-9,sinkingHigh=Math.abs(sinkingLostMultiplier(50,50)-1.15)<1e-9;G.hp=85;const bloodSheathRound=bloodSheathDamage()===13;G.hp=2;const bloodSheathFloor=bloodSheathDamage()===1;
          G.passives=['thousandstrikes'];G.upgrades=['thousandstrikes'];G.blades=['thousandstrikes'];G.activeBlade='thousandstrikes';G.battle={samuraiFlow:100,samuraiWeaponState:'drawn',samuraiZanshinTurns:3,samuraiZanshinDuration:3,samuraiZanshinAttack:.25,hand:[{r:10,s:'♠'},{r:7,s:'♥'}],pendingBust:false};const instantUltimate=samuraiUltimateInfo(),instantReady=instantUltimate?.name==='千太刀'&&instantUltimate.ready&&thousandStrikeSegments(101,5).reduce((a,b)=>a+b,0)===101;
          G.passives=['beheading'];G.blades=['beheading'];G.activeBlade='beheading';G.beheadingPercent=15;G.headTrophies={normal:2,elite:1,boss:1};const headMath=headValue()===10;const headEnemy={name:'首級測試',elite:true,_headClass:'elite',_headEligible:true,_headAwarded:false,_statsDefeated:true};G.battle={samuraiFlow:100,samuraiWeaponState:'drawn',hand:[{r:10,s:'♠'},{r:7,s:'♥'}],pendingBust:false,samuraiAttackContext:{blade:'beheading',beheadingTriggered:[headEnemy]}};const headAward=awardHead(headEnemy)===3&&headValue()===13&&awardHead(headEnemy)===0,headUltimate=samuraiUltimateInfo()?.ready===true;
          const details=['straight','bountyhunter','laststand','thousandstrikes','beheading'].every(id=>bladeForgeRows(defs[id]).flat().join('｜').includes(defs[id].name)||bladeForgeRows(defs[id]).length>=6);
          return {definitions,sequenceOnly,throughEarned,stageFlow,throughProfiles,stageSaved,connectedAfterAdvance,noConnectWithoutAdvance,throughConsumed,bountyLocked,bountyThreshold,sinkingBase,sinkingHigh,bloodSheathRound,bloodSheathFloor,instantReady,headMath,headAward,headUltimate,details};
        })();
        const fourBladeLimit = (() => { G.passives = ['buckler'];G.blades = ['firststrike', 'safe21', 'court', 'peek'];forgeBlade('buckler');return G.blades.length === 4 && !G.blades.includes('buckler'); })();
        newGame('samurai','samurai-codex-blade-details');renderCodex();
        const samuraiCodexBladeButtons=[...document.querySelectorAll('#codex-list [data-codex-blade-detail]')],expectedCodexBladeButtons=ALL_PASSIVES.filter(passive=>bladeDef(passive.id)).length,toxicologyCodexButton=document.querySelector('#codex-list [data-codex-blade-detail="toxicology"]'),heartguardCodexButton=document.querySelector('#codex-list [data-codex-blade-detail="heartguard"]');
        toxicologyCodexButton?.click();const toxicologyCodexDetailShown=!document.querySelector('#blade-forge-detail').classList.contains('hidden')&&document.querySelector('#blade-forge-detail-content').textContent.includes('蠱毒脇差')&&document.querySelector('#blade-forge-detail-content').textContent.includes('百毒穿心');closeBladeForgeDetail();heartguardCodexButton?.click();const heartguardCodexDetailShown=!document.querySelector('#blade-forge-detail').classList.contains('hidden')&&document.querySelector('#blade-forge-detail-content').textContent.includes('鏡心打刀')&&document.querySelector('#blade-forge-detail-content').textContent.includes('護心一文字');const samuraiCodexShowsBladeDetails=samuraiCodexBladeButtons.length===expectedCodexBladeButtons&&!!toxicologyCodexButton&&!!heartguardCodexButton&&toxicologyCodexDetailShown&&heartguardCodexDetailShown;closeBladeForgeDetail();
        newGame('warrior','non-samurai-codex-no-blades');renderCodex();const nonSamuraiCodexHidesBladeDetails=document.querySelectorAll('#codex-list [data-codex-blade-detail]').length===0;
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
        const rapidWithLucky = computeDamage(G.battle.hand, false),rapidLuckyAppliedOnce = rapidWithLucky.dmg === Math.round(rapidWithoutLucky.dmg * 1.35) && rapidWithoutLucky.thousand.total === 0 && rapidWithLucky.thousand.total === 0;
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
        newGame('magician', 'magician-only-suit-forge');G.floor = 1;G.deck = pristineDeck();G.gold = 500;G.deckWorkshopUses = 2;G.deckWorkshopChapter = 0;const suitGoldBefore = G.gold,suitDeckEditsBefore = G.deckEdits;
        const validSuitForge = performSuitForge(0, '♥');
        const suitForgeSeparateFromStructure = validSuitForge.ok && G.gold === suitGoldBefore - suitForgePrice() && G.deckWorkshopUses === 2 && G.deckEdits === suitDeckEditsBefore;
        G.deck = pristineDeck();G.deck.push({ r: 'A', s: '♠', red: false });G.gold = 500;const invalidSuitGold = G.gold,invalidSuitUses = G.deckWorkshopUses,heartAceIndex = G.deck.findIndex(card => card.r === 'A' && card.s === '♥');
        const invalidSuitForge = performSuitForge(heartAceIndex, '♠');
        const illegalSuitForgeConsumesNothing = !invalidSuitForge.ok && G.gold === invalidSuitGold && G.deckWorkshopUses === invalidSuitUses;
        newGame('warrior', 'non-magician-suit-forge');G.floor = 2;G.nodeType = 'shop';G.nodeStarted = false;openShop();const nonMagicianGold = G.gold,nonMagicianDeck = JSON.stringify(G.deck),blockedSuitForge = performSuitForge(0, '♥');
        const suitForgeIsMagicianOnly = !document.querySelector('#open-suitforge') && !openSuitForge() && !blockedSuitForge.ok && blockedSuitForge.reason.includes('只有魔術師') && G.gold === nonMagicianGold && JSON.stringify(G.deck) === nonMagicianDeck;
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
        newGame('magician', 'bounty-mono-isolation');G.upgrades = ['suitmage'];G.suitMastery = 'mono';G.deck = [...pristineDeck().filter(card => card.s === '♠'), ...pristineDeck().filter(card => card.s === '♥').slice(0, 5), ...pristineDeck().filter(card => card.s === '♦').slice(0, 5), ...pristineDeck().filter(card => card.s === '♣').slice(0, 5)];
        const bountyMonoHand = [{ r: 4, s: '♠', red: false }, { r: 6, s: '♠', red: false }];G.bounty = { suitMainSuit: dominantSuit(G.deck) };
        const bountyIgnoresCombatDeckMastery = dominantSuit(G.deck) === '♠' && bountyMultiplier(10, bountyMonoHand) === .75 && bountySuitNotes(bountyMonoHand).some(note => note.includes('純色'));

        const originalSetTimeout = window.setTimeout;window.setTimeout = fn => { fn();return 0; };
        const roninBattle = () => {const foe=scaledEnemy('ronin',0,Math.max(1,G.floor||1));foe.curhp=0;return { enemies:[foe],eventSource:'ronin',over:false,bountyHuntActive:false };};
        newGame('warrior', 'ronin-choice-accept');G.floor=2;G.hp=50;G.battle=roninBattle();const hpBeforeRoninChoice=G.hp;winBattle();winBattle();
        const roninChoicePausesRewards=!ownsP('beheading')&&G.hp===hpBeforeRoninChoice&&!G.bounty&&!document.querySelector('#ronin-beheading-choice').classList.contains('hidden')&&document.querySelector('#ronin-beheading-title').textContent==='⚔️ 流浪武士的認可';
        const acceptedOnce=resolveRoninBeheadingChoice(true),acceptedTwice=resolveRoninBeheadingChoice(true);
        const roninAcceptsAtFive=acceptedOnce&&!acceptedTwice&&ownsP('beheading')&&G.beheadingPercent===5&&G.passives.filter(id=>id==='beheading').length===1&&G.passivePaid.beheading===0&&G.bounty&&G.hp>hpBeforeRoninChoice;
        newGame('warrior', 'ronin-choice-refuse');G.floor=2;G.battle=roninBattle();finishBattleVictory(G.battle);const refusedOnce=resolveRoninBeheadingChoice(false),refusedTwice=resolveRoninBeheadingChoice(false);
        const roninRefusalContinues=refusedOnce&&!refusedTwice&&!ownsP('beheading')&&G.beheadingPercent===0&&!!G.bounty;
        G.bounty=null;G.battle=roninBattle();finishBattleVictory(G.battle);const roninRefusalCanReoffer=!document.querySelector('#ronin-beheading-choice').classList.contains('hidden')&&G.battle.roninRewardPending;resolveRoninBeheadingChoice(false);
        newGame('warrior', 'ronin-choice-upgrade');G.floor=2;G.passives.push('beheading');G.passivePaid.beheading=0;G.beheadingPercent=17;G.battle=roninBattle();finishBattleVictory(G.battle);const roninOwnedAutoUpgrades=G.beheadingPercent===20&&document.querySelector('#ronin-beheading-choice').classList.contains('hidden');G.battle=roninBattle();finishBattleVictory(G.battle);const roninUpgradeCapsAtTwenty=G.beheadingPercent===20;
        newGame('warrior', 'ronin-full-inventory');G.floor=2;while(!passiveInventoryFull(passiveSlotCost('beheading'))){const next=ALL_PASSIVES.find(p=>p.shop!==false&&!G.passives.includes(p.id)&&!professionPassiveProtected(p.id));if(!next)break;G.passives.push(next.id);}G.nodeStarted=false;openRoninEvent();const roninChallengeAllowedWhenFull=!document.querySelector('#ronin-challenge').disabled;G.battle=roninBattle();finishBattleVictory(G.battle);const fullInventoryCanStillRefuse=document.querySelector('#ronin-beheading-accept').disabled&&!document.querySelector('#ronin-beheading-refuse').disabled;resolveRoninBeheadingChoice(false);
        window.setTimeout = originalSetTimeout;

        newGame('magician', 'magician-rework-tests');G.suitEnchantments = { '♠': 'throwingKnife', '♥': 'ironPlate', '♦': 'healingPotion', '♣': 'bomb' };
        const cards = (suit, count, start = 2) => Array.from({ length: count }, (_, i) => ({ r: start + i, s: suit, red: suit === '♥' || suit === '♦' }));
        const tierHands = [2, 3, 4, 5].map(n => suitSpellPlan('attack', cards('♠', n))[0]?.tier || 0);
        const magicianAcceptance1 = JSON.stringify(tierHands) === JSON.stringify([1, 2, 3, 3]);
        const magicianAcceptance2 = suitSpellPlan('attack', cards('♠', 1)).length === 0 && suitSpellPlan('attack', [{ r: 'K', s: '♠' }, { r: 'Q', s: '♠' }, { r: 5, s: '♠' }]).length === 0 && suitSpellPlan('escape', cards('♠', 4)).length === 0;
        G.battle = { hand: cards('♠', 2), deck: [], enemies: [{ idx: 0, name: '測試敵人', type: 'slime', curhp: 20, maxhp: 20, shield: 0, nextDmg: 0 }], target: 0, over: false, busy: false, dealReady: true, pendingBust: false, suitMagicUsed: false, suitSelected: 0, controlLeft: 10, controlCap: 30, suitMode: true, lockedSkills: [], stolenUpgrades: [], weakness: 0, guardStreak: 0, focus: 0, fracture: 0, blind: 0, ironskin: 1, bucklerUses: 0, bucklerBroken: false };changeBattleSuit('♠');const sameSuitFree = G.battle.controlLeft === 10 && !G.battle.suitMagicUsed;G.battle.suitSelected = 0;changeBattleSuit('♥');const oneChange = G.battle.controlLeft === 7 && G.battle.suitMagicUsed;G.battle.suitSelected = 1;changeBattleSuit('♦');
        const magicianAcceptance3 = sameSuitFree && oneChange && G.battle.controlLeft === 7 && G.battle.hand[1].s === '♠';
        G.upgrades = [];G.battle.paralysis = 0;const baseMagicCost = currentControlCost('suitmage');G.upgrades = ['suitmage'];const upgradedMagicCost = currentControlCost('suitmage');G.battle.paralysis = 1;const paralyzedMagicCost = currentControlCost('suitmage');
        const magicianAcceptance4 = baseMagicCost === 3 && upgradedMagicCost === 2 && paralyzedMagicCost === 4;
        G.battle.paralysis = 0;G.upgrades = [];G.suitEnchantments = { '♠': 'throwingKnife', '♥': 'throwingKnife', '♦': 'throwingKnife' };const mergedPlan = suitSpellPlan('attack', [...cards('♠', 2), ...cards('♥', 3), ...cards('♦', 2)]);
        const magicianAcceptance5 = mergedPlan.length === 1 && mergedPlan[0].tier === 3 && mergedPlan[0].sources.length === 3;
        G.upgrades = ['suitmage'];G.suitMastery = 'four_suits';G.suitEnchantments = { '♠': 'throwingKnife', '♥': 'ironPlate', '♦': 'healingPotion', '♣': 'bomb' };const fourHand = SUITS.map((s, i) => ({ r: i + 2, s, red: s === '♥' || s === '♦' }));
        const magicianAcceptance6 = suitSpellPlan('attack', fourHand).every(entry => entry.tier === 1) && suitSpellPlan('defense', fourHand).every(entry => entry.tier === 1);
        G.suitMastery = 'flush';G.suitEnchantments = { '♠': 'throwingKnife', '♥': 'bomb' };const flushPlan = suitSpellPlan('attack', cards('♠', 4));
        const magicianAcceptance7 = flushPlan.filter(entry => entry.encore).length === 1 && flushPlan[0].encore;
        G.suitMastery = 'alternating';G.suitEnchantments = { '♠': 'throwingKnife', '♥': 'ironPlate' };const alternatingHand = [{ r: 2, s: '♠', red: false }, { r: 3, s: '♥', red: true }, { r: 4, s: '♠', red: false }, { r: 5, s: '♥', red: true }];const alternatingBefore = suitSpellPlan('attack', alternatingHand)[0]?.tier;alternatingHand[1].s = '♠';alternatingHand[1].red = false;
        const magicianAcceptance8 = alternatingBefore === 2 && !fullyAlternating(alternatingHand) && suitSpellPlan('attack', alternatingHand)[0]?.tier === 2;
        G.suitMastery = 'mono';G.deck = [...pristineDeck().filter(c => c.s === '♠'), ...pristineDeck().filter(c => c.s === '♥').slice(0, 5), ...pristineDeck().filter(c => c.s === '♦').slice(0, 5), ...pristineDeck().filter(c => c.s === '♣').slice(0, 5)];const lockedMain = dominantSuit(G.deck);const tieDeck = [...cards('♠', 4), ...cards('♥', 4)];G.bounty = { suitMainSuit: lockedMain };
        const magicianAcceptance9 = lockedMain === '♠' && dominantSuit(tieDeck) === null && bountyMultiplier(10, bountyMonoHand) === .75;
        G.suitMastery = null;const fakePlan = [{ id: 'whetstone', tier: 3, suit: '♠', sources: [], encore: false }, { id: 'ironskin', tier: 3, suit: '♥', sources: [], encore: false }, { id: 'ironPlate', tier: 3, suit: '♦', sources: [], encore: false }];
        const magicianAcceptance10 = spellAttackMultiplier(fakePlan) === 1.18 && spellDefenseMultiplier(fakePlan) === 1.25 && spellPayload(fakePlan[2]).defense === 18;
        G.battle = { defense: 0, focus: 0, controlLeft: 20, controlCap: 30, suitMagicSpent: 3, suitMagicRefunded: 0, enemies: [], target: 0 };applyOneSuitSpell(fakePlan[2], 'defense', null);const magicianAcceptance11 = G.battle.defense === consumablePower(18) && G.battle.focus === 0;
        const stimulantEntry = { id: 'stimulant', tier: 3, suit: '♣', sources: [], encore: false };applyOneSuitSpell(stimulantEntry, 'attack', null);const refundOnce = G.battle.controlLeft;applyOneSuitSpell(stimulantEntry, 'attack', null);
        const magicianAcceptance12 = refundOnce === 23 && G.battle.controlLeft === 23 && G.battle.suitMagicRefunded === 3;
        G.hp = 3;G.maxhp = 100;G.battle.hand = [];G.battle.enemies = [{ idx: 0, name: '測試敵人', type: 'slime', curhp: 1, maxhp: 1, shield: 0 }];G.battle.target = 0;const demolitionEntry = { id: 'demolition', tier: 1, suit: '♠', sources: [], encore: false };applyOneSuitSpell(demolitionEntry, 'attack', G.battle.enemies[0]);
        const magicianAcceptance13 = G.battle.enemies[0].curhp <= 0 && G.hp <= 0;
        const dead = { idx: 0, curhp: 0 },alive = { idx: 1, curhp: 10 };G.battle.enemies = [dead, alive];G.battle.target = 0;const magicianAcceptance14 = currentSpellTarget(dead) === alive && G.battle.target === 1;
        const magicianAcceptance15 = SUIT_SPELL_DEFS.throwingKnife.type === 'attack' && SUIT_SPELL_DEFS.bomb.type === 'attack' && !spellPayload({ id: 'throwingKnife', tier: 1 }).lifesteal;
        G.character = 'magician';G.passives = ['suitmage'];G.upgrades = ['suitmage'];G.battle.lockedSkills = [{ id: 'suitmage' }];G.battle.stolenUpgrades = [{ id: 'suitmage' }];const magicianAcceptance16 = hasP('suitmage') && isUp('suitmage') && !skillIsLocked('suitmage') && !upgradeStolen('suitmage');
        newGame('magician', 'atomic-start');openMagicianStart();G._suitEnchantFlow.knifeSuit = '♠';G._suitEnchantFlow.plateSuit = '♥';const beforeAtomic = { ...G.consumables };confirmMagicianStartup();const magicianAcceptance17 = beforeAtomic.throwingKnife === 1 && beforeAtomic.ironPlate === 1 && !G.consumables.throwingKnife && !G.consumables.ironPlate && G.suitEnchantments['♠'] === 'throwingKnife' && G.suitEnchantments['♥'] === 'ironPlate';
        G.upgrades = ['suitmage'];G.suitMastery = 'flush';G.suitDamage['♠'] = 123;G.suitFlatDamage['♥'] = 7;const magicianCheckpoint = createFloorCheckpoint();const migratedMagician = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: magicianCheckpoint }).state;
        const emptyLegacyMagician = restoreSave({ format: SAVE_FORMAT, saveVersion: SAVE_VERSION, progress: { ...magicianCheckpoint, suitEnchantments: {}, suitEnchantStartupDone: undefined, floor: 3 } }).state;
        const magicianAcceptance18 = migratedMagician.suitEnchantments['♠'] === 'throwingKnife' && migratedMagician.suitMastery === 'flush' && migratedMagician.suitDamage['♠'] === 123 && migratedMagician.suitFlatDamage['♥'] === 7 && emptyLegacyMagician.suitEnchantRecoveryPending;
        const magicianAcceptance19 = CONSUMABLES.length === 15 && CONSUMABLES.every(item => item.desc && SUIT_ENCHANT_EFFECTS[item.id]?.includes('第一階') && SUIT_ENCHANT_EFFECTS[item.id]?.includes('第三階'));
        const rngBeforeView = G.rngCalls;SUITS.forEach(s => SUIT_ENCHANT_EFFECTS[G.suitEnchantments[s]]);suitSpellPlanText('attack', cards('♠', 4));const magicianAcceptance20 = G.rngCalls === rngBeforeView;
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
          samuraiRoundShieldDescriptionCorrect,
          warriorRoundShieldDescriptionUnchanged,
          samuraiHeartguardDescriptionCorrect,
          warriorHeartguardDescriptionUnchanged,
          samuraiStraightDescriptionCorrect,
          warriorStraightDescriptionUnchanged,
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
          poisonBladeDefinition,
          forgedToxicologyProtection,
          basePoisonRanks,
          baseVirulenceThreshold,
          upgradedPoisonRanks,
          upgradedVirulenceThreshold,
          temperUsesActualPoisonAndHalfEven,
          poisonDrawScalingCorrect,
          poisonDrawRequiresHpAndPreservesNewPoison,
          poisonBurstUsesExistingSpecialReduction,
          ultimateBurstUsesOldThirtyThroughShield,
          poisonDoesNotTransferAcrossForms,
          poisonUltimateReadyAndMath,
          poisonUltimateCleanup,
          poisonDrawDirectMultiplier,
          poisonDrawUiAndSwitchRules,
          poisonDetailsComplete,
          heartBladeDefinition,
          forgedHeartguardProtection,
          heartguardRatesPreserved,
          onlyHeartguardGetsFullConversion,
          calmUsesSubmitThreshold,
          clearMindUsesSubmitThresholdAndCap,
          noHarmRequiresAttackAndRespectsCap,
          heartUltimateReadyAndMath,
          heartNormalIaidoAndDetails,
          dragonAcceptance1,
          dragonAcceptance2,
          dragonAcceptance3,
          dragonAcceptance4,
          dragonAcceptance5,
          dragonAcceptance6,
          dragonAcceptance7,
          dragonAcceptance8,
          dragonAcceptance9,
          dragonAcceptance10,
          dragonAcceptance11,
          dragonAcceptance12,
          dragonAcceptance13,
          dragonAcceptance14,
          dragonAcceptance15,
          dragonAcceptance16,
          dragonAcceptance17,
          dragonAcceptance18,
          dragonAcceptance19,
          dragonAcceptance20,
          dragonAcceptance21,
          dragonAcceptance22,
          dragonAcceptance23,
          fortuneBladeAcceptance,
          rubyBladeAcceptance,
          thousandStrikeAcceptance,
          fiveNewBladeAcceptance,
          fourBladeLimit,
          samuraiCodexShowsBladeDetails,
          nonSamuraiCodexHidesBladeDetails,
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
          suitForgeIsMagicianOnly,
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
          roninChoicePausesRewards,
          roninAcceptsAtFive,
          roninRefusalContinues,
          roninRefusalCanReoffer,
          roninOwnedAutoUpgrades,
          roninUpgradeCapsAtTwenty,
          roninChallengeAllowedWhenFull,
          fullInventoryCanStillRefuse,
          magicianAcceptance1,
          magicianAcceptance2,
          magicianAcceptance3,
          magicianAcceptance4,
          magicianAcceptance5,
          magicianAcceptance6,
          magicianAcceptance7,
          magicianAcceptance8,
          magicianAcceptance9,
          magicianAcceptance10,
          magicianAcceptance11,
          magicianAcceptance12,
          magicianAcceptance13,
          magicianAcceptance14,
          magicianAcceptance15,
          magicianAcceptance16,
          magicianAcceptance17,
          magicianAcceptance18,
          magicianAcceptance19,
          magicianAcceptance20,
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
