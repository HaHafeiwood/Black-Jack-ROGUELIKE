const { chromium } = require('playwright');
const assert = require('node:assert/strict');

const URL = 'http://127.0.0.1:4173/';
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EDGE });
  try {
    const page = await browser.newPage();
    await page.goto(URL, { waitUntil: 'domcontentloaded' });
    const result = await page.evaluate(async () => {
      const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      const equal=(actual,expected,message)=>{if(actual!==expected)throw new Error(`${message}: ${actual} !== ${expected}`);};
      const same=(actual,expected,message)=>equal(JSON.stringify(actual),JSON.stringify(expected),message);
      const ready = async () => { for(let i=0;i<100;i++){if(G.battle&&!G.battle.busy&&G.battle.dealReady!==false)return;await wait(20);}throw new Error('battle did not become ready'); };
      const battle = async (difficulty,forced='ronin') => { newGame('warrior','difficulty-pair-seed',difficulty);if(String(forced).startsWith('dev:'))G.developerMode=true;G.floor=4;G.nodeType='battle';startBattle(forced);await ready();return {hp:G.battle.enemies[0].maxhp,atk:[...G.battle.enemies[0].atk],rng:G.rngCalls}; };
      const normal=await battle('normal'),hard=await battle('hard');
      equal(normal.hp,Math.round(hard.hp*.90),'normal ordinary HP');
      same(normal.atk,hard.atk.map(value=>Math.max(1,Math.round(value*.85))),'normal ordinary attack');
      const normalBoss=await battle('normal','normalBloodDemon'),hardBoss=await battle('hard','normalBloodDemon');
      equal(normalBoss.hp,Math.round(hardBoss.hp*.92),'normal boss HP');
      same(normalBoss.atk,hardBoss.atk.map(value=>Math.max(1,Math.round(value*.88))),'normal boss attack');
      const normalUltimate=await battle('normal','dev:kun'),hardUltimate=await battle('hard','dev:kun');
      equal(normalUltimate.hp,Math.round(hardUltimate.hp*.95),'normal ultimate HP');
      same(normalUltimate.atk,hardUltimate.atk.map(value=>Math.max(1,Math.round(value*.90))),'normal ultimate attack');
      newGame('warrior','difficulty-formation-seed','normal');G.floor=12;
      const sameSpecies=applyDifficultyToEncounter(sameSpeciesFormation([scaledEnemy('ninja',0,G.floor),scaledEnemy('ninja',1,G.floor)]));
      const sameHard=(()=>{newGame('warrior','difficulty-formation-seed','hard');G.floor=12;return sameSpeciesFormation([scaledEnemy('ninja',0,G.floor),scaledEnemy('ninja',1,G.floor)]);})();
      equal(sameSpecies[0].maxhp,Math.round(sameHard[0].maxhp*.90),'same-species formation before mode');
      newGame('warrior','difficulty-mixed-seed','normal');G.floor=12;const mixed=applyDifficultyToEncounter(gargoyleEncounter(G.floor));
      newGame('warrior','difficulty-mixed-seed','hard');G.floor=12;const mixedHard=gargoyleEncounter(G.floor);equal(mixed[0].maxhp,Math.round(mixedHard[0].maxhp*.92),'mixed formation before boss mode');
      newGame('warrior','difficulty-shield-seed','normal');G.floor=12;const fixed=difficultyFixedEnemyAmount({type:'cultist'},12),percentSource={type:'kun',maxhp:200,curhp:100,northTide:0};equal(fixed,11,'fixed shield normal scale');equal(kunShieldAmount(percentSource),20,'percentage shield has no second scale');
      const scaled=applyDifficultyToEnemy({type:'kun',key:'kun',maxhp:200,curhp:100,atk:[10,10]});applyDifficultyToEnemy(scaled);equal(scaled.maxhp,190,'difficulty is idempotent across phase handoff');
      newGame('warrior','difficulty-warning-seed','normal');G.floor=3;G.nodeType='ordinaryChurch';openChurchEvent('ordinary');const stateBefore=JSON.stringify({node:G.nodeType,faction:G.faction,gold:G.gold,items:G.consumables,rng:G.rngCalls});document.querySelector('#church-destroy').click();document.querySelector('#encounter-warning-cancel').click();equal(JSON.stringify({node:G.nodeType,faction:G.faction,gold:G.gold,items:G.consumables,rng:G.rngCalls}),stateBefore,'church warning cancel state');
      newGame('warrior','difficulty-warning-seed','normal');G.floor=3;G.nodeType='bloodAltar';openBloodAltarEvent();const altarBefore=JSON.stringify({node:G.nodeType,faction:G.faction,gold:G.gold,items:G.consumables,rng:G.rngCalls});document.querySelector('#altar-destroy').click();document.querySelector('#encounter-warning-cancel').click();equal(JSON.stringify({node:G.nodeType,faction:G.faction,gold:G.gold,items:G.consumables,rng:G.rngCalls}),altarBefore,'altar warning cancel state');
      newGame('warrior','difficulty-warning-seed','normal');G.floor=3;G.nodeType='treasureChest';openTreasureChestEvent();const chestBefore=JSON.stringify({node:G.nodeType,faction:G.faction,gold:G.gold,items:G.consumables,rng:G.rngCalls});document.querySelector('#treasure-open').click();document.querySelector('#encounter-warning-cancel').click();equal(JSON.stringify({node:G.nodeType,faction:G.faction,gold:G.gold,items:G.consumables,rng:G.rngCalls}),chestBefore,'probability warning cancel state');
      newGame('warrior','difficulty-warning-seed','normal');G.floor=3;G.nodeType='ronin';openRoninEvent();const before=G.rngCalls;document.querySelector('#ronin-challenge').click();
      equal(document.querySelector('#encounter-warning').classList.contains('hidden'),false,'warning opens');
      equal(G.rngCalls,before,'opening warning is pure');document.querySelector('#encounter-warning-cancel').click();
      equal(G.rngCalls,before,'cancelling warning is pure');
      newGame('warrior','difficulty-save-seed','normal');captureFloorCheckpoint();const saved=currentSaveData(),old=JSON.parse(JSON.stringify(saved));delete old.progress.difficulty;const invalid=JSON.parse(JSON.stringify(saved));invalid.progress.difficulty='invalid';const restored=restoreSave(old).state;
      equal(restored.difficulty,'hard','legacy save defaults to hard');
      equal(restoreSave(invalid).state.difficulty,'hard','invalid save defaults to hard');
      return {normal,hard,normalBoss,hardBoss,normalUltimate,hardUltimate,warningRng:before,difficulty:G.difficulty,legacyDifficulty:restored.difficulty};
    });
    console.log(`difficulty tests passed: normal ${result.normal.hp}/${result.normal.atk.join('-')} vs hard ${result.hard.hp}/${result.hard.atk.join('-')}; warning rng=${result.warningRng}`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode=1; });
