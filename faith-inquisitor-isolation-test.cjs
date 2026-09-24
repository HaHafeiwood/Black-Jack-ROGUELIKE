// Isolated experiment: never writes or replaces production sources or balance data.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const root = __dirname;
const production = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const balance = fs.readFileSync(path.join(root, 'balance-data.js'), 'utf8');
if (!production.includes('function advanceFaithNecklace')) {
  console.log(JSON.stringify({ skipped: true, reason: '歷史隔離候選已被正式重構取代：信仰項鍊不再自動推進評價。請執行 faith-rework-test.cjs。' }, null, 2));
  process.exit(0);
}
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403);res.end();return; }
  fs.readFile(file, (error, data) => { res.writeHead(error ? 404 : 200, { 'Content-Type': file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html' });res.end(error ? '' : data); });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' });
  const results = {};
  try {
    for (const mode of ['original', 'phase2Pause', 'atonementOnly']) {
      const page = await browser.newPage();
      await page.addInitScript(() => { const timer = window.setTimeout.bind(window);window.setTimeout = (fn, delay, ...args) => timer(fn, Math.min(delay || 0, 5), ...args); });
      await page.route('**/game.js*', route => route.fulfill({ contentType: 'application/javascript', body: production + `\n
        window.experimentMode=${JSON.stringify(mode)};window.turnTrace=[];window.transitionTrace=[];
        const experimentAdvance=advanceFaithNecklace;
        advanceFaithNecklace=function(){
          const before=G.faction, b=G.battle;
          const paused=b?.inquisitorPhase===2&&(window.experimentMode==='phase2Pause'||window.experimentMode==='atonementOnly'&&window.experimentAtone);
          const result=paused?0:experimentAdvance();
          window.turnTrace.push({before,after:G.faction,phase:b?.inquisitorPhase,s:b?.sinValue,C:b?.sinCap,paused});return result;
        };
        const experimentTransform=transformInquisitor;
        transformInquisitor=function(...args){const result=experimentTransform(...args);if(result)window.transitionTrace.push({f:G.faction,C:G.battle.sinCap,s:G.battle.sinValue,crime:G.battle.crimeFrozen});return result;};
        const experimentAtoneOriginal=atone;
        atone=function(...args){window.experimentAtone=true;return experimentAtoneOriginal(...args);};
        const experimentEnd=endPlayerTurn;
        endPlayerTurn=function(...args){const result=experimentEnd(...args);window.experimentAtone=false;return result;};
      ` }));
      await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'load' });
      results[mode] = await page.evaluate(async () => {
        const out = [], eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        // Blood judgment uses a frozen local baseline, not the global-faction debt E.
        const state = () => ({ f:G.faction,C:G.battle.sinCap,s:G.battle.sinValue,E:G.battle.bloodJudgment?null:Math.max(0,-G.faction-800)-(G.battle.sinValue||0),gold:G.gold,control:G.battle.controlLeft,turns:runStats().turns,miracle:G.miracleAlignment,over:G.battle.over });
        const ready = async () => { for(let i=0;i<500;i++){if(G.battle.over||!G.battle.busy&&G.battle.dealReady)return;await new Promise(r=>setTimeout(r,5));}throw Error('async turn did not finish'); };
        const setup = async ({f=-1800,C=1000,neck=1,contract=false,blood=false,phase=2,other=false,overflow=false}={}) => {
          document.querySelectorAll('#seal-choice,#deckedit').forEach(e=>e.classList.add('hidden'));
          newGame(null,'faith-inquisitor-isolation');G.developerMode=true;G.floor=98;G.hp=G.maxhp=100000;G.gold=100000;G.control=100;
          G.passives=neck?['faithneck']:[];if(contract||blood)G.passives.push('bloodpact');G.upgrades=neck===2?['faithneck']:[];G.faction=f;G.bloodDescendant=blood;
          startBattle(other?'dev:slime':'dev:inquisitorParty');await ready();
          const b=G.battle;b.enemies.forEach(e=>{e.atk=0;e.nextDmg=0;e.shield=0;e.curhp=e.maxhp=100000;});
          if(phase===2&&!other){transformInquisitor('isolated fixture');b.sinCap=C;b.sinValue=Math.min(C,Math.max(0,-f-800));b.bloodJudgment=blood;b.judgmentFaith=blood?-1200:f;G.faction=f;}
          b.controlLeft=100;window.turnTrace=[];window.transitionTrace=[];
          if(overflow){G.passives=['faithneck','rubyring',...ALL_PASSIVES.filter(p=>p.cost!=null&&p.id!=='faithneck'&&p.id!=='rubyring'&&!signatureProtected(p.id)).slice(0,PASSIVE_LIMIT-1).map(p=>p.id)];G.miracleAlignment='dark';G.darkGiftUsed=true;}
          prepare();return b;
        };
        const prepare = () => {const b=G.battle;b.hand=[{r:'A',s:'♠'},{r:'K',s:'♥'}];b.busy=false;b.dealReady=true;b.pendingBust=false;b.blind=0;b.poison=0;G.poison=0;b.enemies.forEach(e=>{e.atk=0;e.nextDmg=0;if(e.type==='inquisitor'){e.transitionPause=0;e.judgmentPending=false;e.inquisitorStep=0;e.inquisitorAction='sentenceSword';}});};
        const act = async kind => {prepare();const before=state(),cost=kind==='gold'?atonementGoldCost():0,controlCost=kind==='control'?scaledControlCost(3):0;atone(kind);const pending=!document.querySelector('#seal-choice').classList.contains('hidden');const immediate=state();if(pending)document.querySelector('[data-seal="rubyring"]').click();const settled=state();await ready();return {before,cost,controlCost,pending,immediate,settled,after:state(),trace:window.turnTrace.at(-1),sealed:G.sealedPassive};};
        for(const neck of [0,1,2])for(const kind of ['free','gold','control']){
          await setup({neck});const a=await act(kind);const pause=window.experimentMode!=='original',rate=kind==='free'?3:kind==='gold'?6:10,d=21*rate,push=pause||!neck?0:neck===2?100:50,f=-1800+d-push;
          out.push({name:`E0/neck${neck}/${kind}`,passed:a.after.f===f&&a.after.s===Math.min(1000,Math.max(0,-f-800))&&a.before.gold-a.after.gold===a.cost&&a.before.control-a.after.control===a.controlCost&&a.after.turns-a.before.turns===1,...a});
        }
        for(const neck of [1,2]){await setup({f:-2100,neck});const turns=[];for(let i=0;i<(neck===2?3:2);i++)turns.push(await act('control'));const expected=window.experimentMode==='original'?(neck===1?[-1940,-1780]:[-1990,-1880,-1770]):(neck===1?[-1890,-1680]:[-1890,-1680,-1470]);out.push({name:`existingE/neck${neck}`,passed:eq(turns.map(t=>t.after.f),expected)&&turns.every(t=>t.before.control-t.after.control===t.controlCost),turns});}
        for(const neck of [1,2])for(const kind of ['free','gold','control']){await setup({f:-820,neck});const a=await act(kind),expected=window.experimentMode==='original'?(neck===1?-850:-900):-800;out.push({name:`truncated/neck${neck}/${kind}`,passed:a.after.f===expected&&a.before.gold-a.after.gold===a.cost&&a.before.control-a.after.control===a.controlCost,...a});}
        for(const C of [0,1000])for(const neck of [1,2]){await setup({f:-800,C,neck});const before=state();defend();await ready();const after=state(),push=window.experimentMode==='phase2Pause'?0:neck===1?50:100;out.push({name:`defense/C${C}/neck${neck}`,passed:after.f===-800-push&&after.s===Math.min(C,push)&&after.turns-before.turns===1,before,after});}
        for(const neck of [0,1,2])for(const phase of [1,2]){await setup({neck,phase});const before=state();defend();await ready();const after=state(),push=!neck||phase===2&&window.experimentMode==='phase2Pause'?0:neck===1?50:100;out.push({name:`phase${phase}/neck${neck}`,passed:after.f===before.f-push,before,after});}
        for(const neck of [1,2])for(const contract of [false,true]){await setup({other:true,phase:1,neck,contract});const before=state();defend();await ready();const after=state(),push=(neck===1?50:100)*(contract?.5:1);out.push({name:`other/neck${neck}/contract${contract}`,passed:after.f===before.f-push,before,after});}
        for(const neck of [1,2]){await setup({neck,contract:true});const a=await act('free'),push=window.experimentMode==='original'?(neck===1?25:50):0;out.push({name:`contract/neck${neck}`,passed:a.after.f===-1800+63-push,...a});}
        await setup({f:-350,neck:2,blood:true,C:400});G.battle.sinValue=400;const blood=await act('control');out.push({name:'blood/atonement',passed:blood.after.f===-350&&blood.after.s===190&&blood.after.C===400&&blood.before.control-blood.after.control===blood.controlCost,...blood});
        await setup({f:-1000,phase:1,neck:2});G.battle.crime=3;const leader=G.battle.enemies.find(e=>e.type==='inquisitorMounted');G.battle.target=leader.idx;leader.curhp=1;attack();const transition=window.transitionTrace[0],sameTurn=window.turnTrace[0];await ready();out.push({name:'attackTransition/sameTurn',passed:!!transition&&sameTurn?.phase===2&&sameTurn.after===transition.f-(window.experimentMode==='phase2Pause'?0:100)&&transition.C===Math.max(0,-transition.f-800),transition,sameTurn});
        await setup({f:-1790,C:1000,neck:2});const nearBefore=state();G.battle.target=1;G.battle.enemies[1].shield=100000;attack();const crime=state();await ready();out.push({name:'attackCrime/preShield',passed:crime.s===1000&&G.battle.inquisitorDamageCrime===true&&crime.C===1000,before:nearBefore,after:state(),trace:window.turnTrace[0]});
        await setup({f:-920,C:400,neck:2,overflow:true});const hostileBefore=faithNecklaceHostile(G.battle.enemies[1]),miracle=await act('free');out.push({name:'miracleLoss/seal',passed:hostileBefore&&!faithNecklaceHostile(G.battle.enemies[1])&&miracle.pending&&miracle.after.miracle===null&&miracle.after.f===(window.experimentMode==='original'?-957:-857)&&miracle.sealed==='rubyring',hostileBefore,...miracle});
        await setup({neck:2});G.battle.target=1;G.battle.enemies[1].curhp=1;attack();await ready();const escortTurn=window.turnTrace[0];out.push({name:'leaderDead/escortsAlive',passed:G.battle.inquisitorLeaderFallen&&G.battle.enemies.some(e=>e.inquisitorEscort&&e.curhp>0)&&escortTurn.after===escortTurn.before-(window.experimentMode==='phase2Pause'?0:100),after:state(),trace:escortTurn});
        const weakened=G.battle.enemies.filter(e=>e.inquisitorEscort&&e.curhp>0);const crimeBefore=state();const added=addInquisitorCrime(5,'diagnostic after leader death');out.push({name:'escortWeakening/preserved',passed:weakened.every(e=>e.forsakenEscort)&&added===0&&state().s===crimeBefore.s});
        prepare();G.battle.enemies.forEach(e=>{e.curhp=e.idx===0?1:0;e.shield=0;});G.battle.target=0;const finalBefore=G.faction,traceCount=window.turnTrace.length,victoryDelta=adjustedFactionDelta(factionVictoryDelta(G.battle.enemies));attack();out.push({name:'lastHit/directVictoryBypassesEnd',passed:G.battle.over&&window.turnTrace.length===traceCount&&G.faction===finalBefore+victoryDelta,before:finalBefore,f:G.faction,victoryDelta});
        for(let i=0;i<20;i++)await new Promise(r=>setTimeout(r,5));
        await setup({neck:2});G.battle.enemies.forEach(e=>e.curhp=0);const endedBefore=G.faction;endPlayerTurn();const endedTrace=window.turnTrace.at(-1);out.push({name:'allDead/endPlayerTurnOrder',passed:G.battle.over&&endedTrace.after===endedBefore-(window.experimentMode==='phase2Pause'?0:100),trace:endedTrace});
        for(let i=0;i<20;i++)await new Promise(r=>setTimeout(r,5));
        G.battle=null;G.nodeType='battle';startBattle('dev:slime');await ready();prepare();const nextBefore=G.faction;defend();await ready();out.push({name:'afterVictory/nextBattleRestores',passed:G.faction===nextBefore-100,before:nextBefore,after:G.faction});
        await setup({neck:2});G.poison=G.hp+1;endPlayerTurn();for(let i=0;i<100&&document.querySelector('#screen-end').classList.contains('hidden');i++)await new Promise(r=>setTimeout(r,5));
        const deathVisible=!document.querySelector('#screen-end').classList.contains('hidden');
        await setup({other:true,phase:1,neck:2});const afterDeathBefore=G.faction;defend();await ready();out.push({name:'death/nextBattleRestores',passed:deathVisible&&G.faction===afterDeathBefore-100});
        await setup({f:-920,C:400,neck:2});G.miracleAlignment='dark';G.battle.target=1;const beforeDamage=G.battle.enemies[1].curhp;attackEnemy(100);const boosted=beforeDamage-G.battle.enemies[1].curhp;
        await setup({f:-920,C:400,neck:2});G.miracleAlignment='dark';changeFaction(63,()=>{},true);G.battle.target=1;const afterLossHp=G.battle.enemies[1].curhp;attackEnemy(100);const unboosted=afterLossHp-G.battle.enemies[1].curhp;out.push({name:'miracleHostileDamage/actual',passed:boosted===77&&unboosted===70,boosted,unboosted});
        await setup({f:-350,phase:1,neck:2,blood:true});transformInquisitor('blood fixture transition');const bloodTransition=state();const bloodBefore=G.faction;prepare();attack();await ready();out.push({name:'blood/actualTransitionAndAttack',passed:bloodTransition.C===400&&bloodTransition.s===400&&G.battle.judgmentFaith===-1200&&G.faction===bloodBefore,transition:bloodTransition,after:state()});
        await setup({other:true,phase:1,neck:2});const affixes=[];for(const affix of PASSIVE_AFFIXES){G.passiveAffixes.faithneck=affix.id;const before=JSON.stringify(G.passiveAffixes),slots=passiveSlotCost('faithneck'),sell=passiveSellValue('faithneck'),damage=computeDamage(G.battle.hand).dmg;renderTop();affixes.push({id:affix.id,slots,sell,damage,unchanged:before===JSON.stringify(G.passiveAffixes)});}out.push({name:'allNecklaceAffixes/preserved',passed:affixes.every(a=>a.unchanged),affixes});
        const viewBefore={rng:[...G.rngState],calls:G.rngCalls,f:G.faction};for(let i=0;i<5;i++){renderTop();renderEnemies();renderCodex();}out.push({name:'pureViews',passed:eq(viewBefore,{rng:[...G.rngState],calls:G.rngCalls,f:G.faction})});
        return out;
      });
      await page.close();
    }
    assert.equal(fs.readFileSync(path.join(root,'game.js'),'utf8'),production,'production game.js changed');
    assert.equal(fs.readFileSync(path.join(root,'balance-data.js'),'utf8'),balance,'balance data changed');
    const failed=Object.fromEntries(Object.entries(results).map(([mode,rows])=>[mode,rows.filter(r=>!r.passed).map(r=>r.name)]));
    for(const mode of ['phase2Pause','atonementOnly'])assert.deepEqual(results[mode].find(r=>r.name==='allNecklaceAffixes/preserved').affixes,results.original.find(r=>r.name==='allNecklaceAffixes/preserved').affixes,'affix behavior diverged');
    const report={candidate:'Pause only advanceFaithNecklace from inquisitor phase 2 through battle end',results,failed,productionUnchanged:true,limitations:['No win-rate inference; isolated scenario fixtures use high player HP and zero enemy attack to separate faction dynamics.','Actual normal attack final kill bypasses endPlayerTurn at game.js:4196; both direct victory and all-dead endPlayerTurn paths are tested separately.']};
    fs.writeFileSync(path.join(root,'faith-inquisitor-isolation-results.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({cases:Object.fromEntries(Object.entries(results).map(([mode,rows])=>[mode,rows.length])),failed,productionUnchanged:true},null,2));
    if(Object.values(failed).some(list=>list.length))process.exitCode=1;
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
