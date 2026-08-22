const IMG={
  slime:'slime 1751x1146.png',
  ninja:'Ninja - 480x624.png',
  ghost:'Ghost - 480x480.png',
  witch:'Witch - 480x492.png',
  dragon:'Dragon - 640x383.png',
  demon:'Demon - 640x605.png',
  duck:'duckling - 481x649.png',
  bear:'Bear - 480x480.png',
  platypus:'platypus - 640x426.png',
  squirrel:'Squirrel - 640x480.png',
  dropbear:'Koala Bear - 480x523.png',
  zombie:'zombies 363x600.png',
  eagle:'diving-eagle-480x624.png',
  robot:'damaged-robot-480x624.png',
  cultist:'faceless-black-robed-figure-480x624.png',
  gargoyle:'gargoyle-480x624.png',
  skeleton:'Skeleton Warrior.png',
  bat:'Bat.png',
  cyclops:'Cyclops.png',
  paladin:'Paladin.png',
};
const EVENT_IMG={
  campfire:'outdoor-fire-pit-with-crackling-flames-free-png.webp',
  darkChurch:'dark-cult-church-transparent-480x624.png',
  ordinaryChurch:'ordinary-medieval-church-transparent-480x624.png',
  bloodAltar:'blood-painted-ritual-altar-scroll-transparent-480x624.png',
};
const ENEMIES={
  slime: {name:'史萊姆', type:'slime', img:IMG.slime, hp:20, atk:[3,7],  h:120},
  ninja: {name:'忍者',   type:'ninja', img:IMG.ninja, hp:50, atk:[6,11], h:185},
  ghost: {name:'幽靈',   type:'ghost', img:IMG.ghost, hp:62, atk:[7,12], h:160},
  witch: {name:'女巫',   type:'witch', img:IMG.witch, hp:72, atk:[9,14], h:185},
  bear:  {name:'熊',     type:'bear',  img:IMG.bear,  hp:80, atk:[8,13], h:180},
  platypus:{name:'鴨嘴獸', type:'platypus', img:IMG.platypus, hp:68, atk:[7,12], h:155},
  squirrel:{name:'松鼠', type:'squirrel', img:IMG.squirrel, hp:45, atk:[4,8], h:150},
  dropbear:{name:'掉落熊', type:'dropbear', img:IMG.dropbear, hp:72, atk:[18,28], h:175},
  zombie:{name:'殭屍', type:'zombie', img:IMG.zombie, hp:88, atk:[5,9], h:190},
  eagle:{name:'老鷹', type:'eagle', img:IMG.eagle, hp:58, atk:[7,11], h:185},
  robot:{name:'機器人', type:'robot', img:IMG.robot, hp:76, atk:[6,10], h:185},
  cultist:{name:'邪教徒', type:'cultist', img:IMG.cultist, hp:72, atk:[7,12], h:185},
  skeleton:{name:'骷髏戰士', type:'skeleton', img:IMG.skeleton, hp:78, atk:[7,12], h:190},
  bat:{name:'吸血蝙蝠', type:'bat', img:IMG.bat, hp:26, atk:[3,6], h:130},
  cyclops:{name:'獨眼巨人', type:'cyclops', img:IMG.cyclops, hp:105, atk:[10,16], h:205},
  paladin:{name:'聖騎士', type:'paladin', img:IMG.paladin, hp:92, atk:[8,13], h:205},
  gargoyle:{name:'石像鬼', type:'gargoyle', img:IMG.gargoyle, hp:150, atk:[9,14], h:205, boss:true},
  dragon:{name:'魔龍 · 莊家', type:'dragon', img:IMG.dragon, hp:135, atk:[8,13], h:165, boss:true},
  demon: {name:'惡魔', type:'demon', img:IMG.demon, emoji:'😈', hp:100, atk:[9,15], h:175, boss:true},
};
const NORMAL_POOL=['ninja','eagle','robot','cultist','skeleton','cyclops','bats','slimes','zombies','witch','ghost','bear','platypus','squirrel','dropbear'];
const EARLY_POOL=['slimes','ninja','squirrel'];
const MID_POOL=['ninja','eagle','robot','cultist','slimes','zombies','witch','ghost','bear','platypus','squirrel'];
const CHAPTER_LENGTH=11;
const RANDOM_NODE_COUNT=9;
const REST_NODE=10;
const BOSS_NODE=11;
const LEGACY_CHAPTER_LENGTH=5;
const BASE_EVENT_CHANCE=0.20;
const EVENT_CHANCE_STEP=0.05;
const BASE_SHOP_CHANCE=0.50;
const SHOP_CHANCE_STEP=0.10;
const BLOOD_ALTAR_CHANCE=0.08;
const CHURCH_EVENT_CHANCE=0.30;
const chapterPosition=f=>(Math.max(1,f)-1)%CHAPTER_LENGTH+1;
const chapterIndex=f=>Math.floor((Math.max(1,f)-1)/CHAPTER_LENGTH);
const isBossFloor=f=>chapterPosition(f)===BOSS_NODE;
const isRestFloor=f=>chapterPosition(f)===REST_NODE;
function legacyHeight(floor){
  const pos=chapterPosition(floor),within=(pos-1)*(LEGACY_CHAPTER_LENGTH-1)/(CHAPTER_LENGTH-1);
  return chapterIndex(floor)*LEGACY_CHAPTER_LENGTH+1+within;
}

const CHARACTERS=[
  {id:'warrior',name:'戰士',icon:'⚔️',passives:['rubyring','heartguard'],desc:'以恢復與防禦穩定推進。'},
  {id:'magician',name:'魔術師',icon:'🎭',passives:['suitmage'],desc:'開局可改變手牌花色，並從四種花色技能中選擇一種。'},
  {id:'gambler',name:'賭徒',icon:'🎲',passives:['cardsharp','doublebet'],desc:'丟棄不利手牌，追求高風險的豪賭爆發。'},
];

// 每張被動卡有 desc（基礎）與 descUp（強化）。壁壘無強化。
const ALL_PASSIVES=[
  {id:'aceboost', name:'A 強化', icon:'🅰️', cost:80,  desc:'抽到 A 時，本次攻擊額外 +6 傷害。', descUp:'抽到 A 時，本次攻擊額外 +8 傷害。'},
  {id:'facemult',  name:'面牌加成', icon:'🃏', cost:90,  desc:'每張 J/Q/K 額外 +3 傷害。', descUp:'每張 J/Q/K 額外 +4 傷害。'},
  {id:'doublebet', name:'雙倍豪賭', icon:'🎲', cost:180, desc:'攻擊先獲得 +8 基礎傷害；攻擊或防禦時，單數 → 效果 ×2，雙數 → 扣除等同點數的 HP；爆牌扣點數 ×2。', descUp:'攻擊基礎傷害提高為 +12；攻防單數 ×2.5，雙數反噬降為點數一半；爆牌仍扣點數 ×2。'},
  {id:'redraw',    name:'重抽機會', icon:'🔄', cost:130, desc:'每場戰鬥可重抽一次目前手牌；金錢回合每大關共用 1 次。', descUp:'每場戰鬥可重抽兩次，且爆牌後也能選擇重抽救牌；金錢回合每大關共用 2 次。'},
  {id:'insurance', name:'保險機制', icon:'🛡️', cost:150, desc:'爆牌時，仍造成前兩張牌的點數傷害。', descUp:'爆牌時，仍造成前三張牌的點數傷害。'},
  {id:'peek',      name:'透視牌堆', icon:'👁️', cost:110, desc:'每場戰鬥可預覽接下來三張牌一次；金錢回合每大關共用 1 次。', descUp:'每場戰鬥可預覽接下來四張牌、共兩次；金錢回合每大關共用 2 次。'},
  {id:'vampire',   name:'吸血賭注', icon:'🩸', cost:170, desc:'成功攻擊時，回復造成傷害的 20% HP。', descUp:'成功攻擊時，回復造成傷害的 30% HP。'},
  {id:'bloodpact', name:'鮮血契約', icon:'📜', cost:null, shop:false, desc:'獲得渴血；無法獲得戰後自然回血；因陣營排斥不可被封印。成為血魔後裔後進化為血魔契約。'},
  {id:'safe21',    name:'安全線', icon:'🪙', cost:100, desc:'手牌達 17 點以上選擇攻擊時，額外 +5 傷害。', descUp:'手牌達 17 點以上選擇攻擊時，額外 +8 傷害。'},
  {id:'bulwark',   name:'壁壘', icon:'🏰', cost:80, desc:'防禦值不再於回合結束歸零，可持續累積。', descUp:'防禦持續累積；攻擊時每滿 10 點多餘防禦使最終傷害倍率 +0.1，最高 ×1.6，且不消耗防禦。'},
  {id:'buckler',   name:'圓盾', icon:'🛡', cost:120, desc:'選擇防禦時額外獲得 8 防禦；可使用 4 次。', descUp:'選擇防禦時額外獲得 10 防禦，且不消耗耐久。'},
  {id:'antidote',  name:'淨化', icon:'✨', cost:120, desc:'每回合中毒 −1、燒傷 −2、腐敗 −1；震攝減輕為攻擊 −25%；遲疑上限 4 張。', descUp:'每回合中毒 −2、清除全部燒傷、腐敗 −2；免疫震攝；遲疑上限 5 張。'},
  {id:'toxicology',name:'毒物學', icon:'⚗️', cost:145, desc:'成功攻擊時，每張 2～3 依其牌面點數對目標施加等量中毒；層數無上限。', descUp:'適用牌面擴大為 2～4；層數仍無上限。'},
  {id:'heartguard',name:'護心鏡', icon:'🪞', cost:180, desc:'選擇防禦時，額外將手牌點數的 30% 轉為防禦。', descUp:'選擇防禦時，額外將手牌點數的 50% 轉為防禦。'},
  {id:'dragonneck',name:'龍頭項鍊', icon:'🐉', cost:200, desc:'5 張以上不爆時，額外造成 50 傷害並回復 50 HP。', descUp:'五龍時，額外造成 50 + 點數50% 傷害，並回復 50 + 點數20% HP。'},
  {id:'luckycoin', name:'幸運金幣', icon:'🍀', cost:110, desc:'商店所有價格 −10%，進入商店時回復 5 HP。', descUp:'商店所有價格 −15%，進入商店時回復 10 HP。'},
  {id:'collector', name:'蒐集家', icon:'🎴', cost:140, desc:'戰鬥結束時掉落 1 張撲克牌。', descUp:'戰鬥結束時掉落 2 張撲克牌。'},
  {id:'rubyring',  name:'紅寶石戒指', icon:'💍', cost:130, desc:'每清除一層回復 8 HP。', descUp:'每清除一層回復 15 HP。'},
  {id:'echelon',   name:'階層', icon:'📈', cost:150, desc:'本回合比初始多抽 n 張牌時，攻擊額外 +n! 傷害。', descUp:'同上，但 n 額外 +1（成長更快）。'},
  {id:'cardsharp', name:'老千', icon:'🤵', cost:140, desc:'每場戰鬥可丟棄手牌 2 次（點按手牌移除單張）；金錢回合每大關共用 2 次。', descUp:'每場戰鬥可丟棄手牌 3 次；金錢回合每大關共用 3 次。'},
  {id:'spadeart',  name:'黑桃穿刺', icon:'♠️', cost:135, desc:'攻擊時每張黑桃 +2 傷害；3 張黑桃可無視 50% 護盾。', descUp:'每張黑桃 +3 傷害；3 張黑桃可完全無視護盾。'},
  {id:'heartecho', name:'紅心回響', icon:'♥️', cost:135, desc:'每場戰鬥首次以含紅心的手牌行動時，每張紅心回復 4 HP。', descUp:'每場戰鬥可觸發 2 次。'},
  {id:'diamondbonus',name:'方塊分紅',icon:'♦️',cost:135,desc:'賞金結算時，每張方塊使倍率 +0.1，最多 +0.3。',descUp:'每張方塊使倍率 +0.15，最多 +0.45。'},
  {id:'clubstance',name:'梅花架勢', icon:'♣️', cost:135, desc:'防禦時每張梅花 +3 防禦；3 張梅花再獲得 5 蓄勢。', descUp:'每張梅花 +4 防禦；3 張梅花再獲得 8 蓄勢。'},
  {id:'suitmage',  name:'花色魔術師', icon:'🎭', cost:175, desc:'每場戰鬥與每次賞金各可將 1 張手牌變成指定花色。', descUp:'使用次數提高為 2；下次魔王強化可四選一取得花色二次專精。'},
  {id:'firststrike',name:'先發制人',icon:'⚔️',cost:130,desc:'戰鬥第 1 回合以恰好 2 張、20 點的手牌攻擊時，額外 +20 傷害。',descUp:'第 1 回合以不超過 3 張、19～21 點的手牌攻擊時，額外 +30 傷害。'},
  {id:'straight',name:'連號',icon:'🔗',cost:145,desc:'手牌含至少 3 張連續牌面時，攻擊與防禦 +18。A 視為 1，Q-K-A 不成立。',descUp:'三連號攻防 +24；四張以上連號攻防 +40。'},
  {id:'court',name:'宮廷牌局',icon:'👑',cost:165,desc:'戰鬥中 K 成為可自動切換 11／1 的軟牌；J、Q、K 齊聚時攻擊 +35。',descUp:'戰鬥中 J、Q、K 齊聚時攻擊 +50、防禦 +25。'},
  {id:'bountyhunter',name:'賞金獵人',icon:'💰',cost:150,desc:'以 20 或 21 點結算賞金後，下一場戰鬥首次成功攻擊額外增加「賞金倍率 ×10」傷害。',descUp:'第一次攻擊獲得完整加成，第二次成功攻擊再獲得 50% 加成。'},
  {id:'laststand',name:'背水一戰',icon:'🔥',cost:155,desc:'HP 不高於 30% 時，攻擊 ×1.5，但防禦值 −20%。',descUp:'HP 不高於 40% 時攻擊 ×1.6，且不再降低防禦。'},
];

const SUITS=['♠','♥','♦','♣'];
const SUIT_STARTERS=['spadeart','heartecho','diamondbonus','clubstance'];
const SUIT_SHOP_WEIGHT=2.5;
const SUIT_MASTERIES=[
  {id:'four_suits',name:'四象齊聚',icon:'🧭',desc:'四種花色齊聚時，攻擊與防禦最終 +40；賞金倍率 ×1.5。'},
  {id:'flush',name:'同花大獎',icon:'🌊',desc:'手牌有 4 張同花時，攻擊與防禦 ×2；賞金倍率 ×1.75。'},
  {id:'alternating',name:'紅黑交替',icon:'🌓',desc:'每組相鄰紅黑交替使攻擊與防禦 +12；賞金手牌 4 張以上且全交替時倍率 ×1.75。'},
  {id:'mono',name:'純色牌組',icon:'🎨',desc:'牌庫占比至少 40% 的主花色計數加倍、其他花色技能失效；手牌過半為主花色時攻防與賞金 ×1.5。'},
];
const DOUBLEBET_MASTERY_DESC='賞金手牌另計：單數時最終賞金 ×2，雙數時賞金歸零，爆牌則倒扣該層基礎賞金。';

//===== 音效 =====
const SFX=(()=>{
  let ctx,on=true;
  const ac=()=>ctx||(ctx=new (window.AudioContext||window.webkitAudioContext)());
  function tone(freq,dur,type='square',vol=.18,slideTo){
    if(!on)return;const c=ac();const o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,c.currentTime);
    if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,c.currentTime+dur);
    g.gain.setValueAtTime(vol,c.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+dur);
    o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+dur);
  }
  function noise(dur,vol=.25,hp=800){
    if(!on)return;const c=ac();const n=c.createBufferSource();
    const buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate);const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
    n.buffer=buf;const f=c.createBiquadFilter();f.type='highpass';f.frequency.value=hp;
    const g=c.createGain();g.gain.value=vol;n.connect(f).connect(g).connect(c.destination);n.start();
  }
  return {
    draw(){noise(.16,.22,1200);},
    hit(){tone(180,.18,'square',.22,90);},
    crit(){tone(300,.22,'sawtooth',.22,120);},
    bust(){tone(330,.5,'sawtooth',.25,70);},
    hurt(){tone(120,.25,'triangle',.25,60);noise(.12,.12,300);},
    poison(){tone(240,.3,'sine',.18,160);},
    coin(){tone(880,.08,'square',.18);setTimeout(()=>tone(1320,.1,'square',.18),70);},
    win(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.18,'triangle',.2),i*110));},
    lose(){[400,300,200,140].forEach((f,i)=>setTimeout(()=>tone(f,.25,'sawtooth',.2),i*140));},
    shield(){tone(660,.18,'sine',.16,990);},
    toggle(){on=!on;return on;},
  };
})();

const START_HP=100;
const SAVE_FORMAT='black-jack-roguelike-save';
const SAVE_VERSION=2;
const GAME_VERSION='0.21.0';
const BALANCE={
  startGold:60,
  hpTierStep:0.28,
  atkTierStep:0.20,
  hpMicroPerFloor:0.02,
  atkMicroPerFloor:0.01,
  clearHeal:4,
  focusRate:0.5,
  focusCap:25,
  bucklerUses:4,
  deckEditGrowth:1.35,
  shopGrowthPower:0.75,
  demonFrenzyUses:5,
  bloodPactChance:0.15,
  bloodPactDemonChance:0.50,
};
const STATUS_CODEX=[
  {icon:'☠',name:'中毒',desc:'行動階段前，每層造成 1 HP 傷害；不會自然衰減。淨化會在傷害發作後減少 1 層，強化淨化減少 2 層。'},
  {icon:'🔥',name:'燒傷',desc:'最高 5 層。行動階段前，每層造成 2 HP 傷害；每發作 2 次才自然減少 1 層。淨化減少 2 層，強化淨化會清除剩餘燒傷。'},
  {icon:'🧟',name:'腐敗',desc:'最高 3 層，每層使戰鬥中的回血量降低 20%，最低仍保留 40% 回血；不會自然衰減。淨化每回合減少 1 層，強化後減少 2 層。'},
  {icon:'🦠',name:'敗血',desc:'最高 5 層。受到吸血時，每層使吸血者的吸血效率提高 15%；不會自然衰減。淨化每回合減少 1 層，強化後減少 2 層。'},
  {icon:'🩸',name:'流血',desc:'最高 8 層。直接攻擊傷及 HP 時，額外受到等同層數的傷害，之後自然減少 1 層；完全防禦與狀態傷害不會觸發。淨化減少 2 層，強化淨化會直接清除。'},
  {icon:'🦴',name:'斷骨',desc:'最高 3 層。每層使新獲得的防禦降低 15%，不影響已經持有的防禦；不會自然解除。淨化減少 1 層，強化後減少 2 層。'},
  {icon:'🐻',name:'震攝',desc:'下一次行動的攻擊力降低 50%；若改選防禦也會在行動結束後消失。淨化使減幅降為 25%，強化淨化則完全免疫。'},
  {icon:'🦫',name:'遲疑',desc:'下一次行動最多額外抽 3 張牌，完成攻擊或防禦後消失。淨化將上限提高為 4 張，強化後提高為 5 張。'},
  {icon:'🛡',name:'防禦',desc:'優先抵擋即將受到的傷害；一般會在承受攻擊後歸零，持有壁壘則可保留。'},
  {icon:'⚡',name:'蓄勢',desc:`選擇防禦時，獲得該次防禦量約 50% 的蓄勢，最高 ${BALANCE.focusCap}。下次攻擊會消耗並轉為額外傷害；爆牌或特定效果會清除蓄勢。`},
  {icon:'🛡️',name:'護盾',desc:'受到攻擊時會先消耗護盾，再傷害 HP。穿透效果可忽略部分或全部護盾；部分護盾會永久保留或重新生成。'},
  {icon:'💥',name:'破防',desc:'依照標示比例額外磨損現有防禦；只作用於仍存在的防禦，超出防禦量的破防不會轉為 HP 傷害。目前忍者穿刺與聖騎士破甲斬擊提供 30% 破防。'},
  {icon:'💨',name:'閃避與折翼',desc:'閃避可消耗層數躲開符合條件的攻擊；折翼會清除閃避、削弱攻擊，且持續期間無法恢復閃避。'},
  {icon:'👻',name:'無敵',desc:'無敵期間受到的攻擊完全無效。'},
  {icon:'💤',name:'沉睡',desc:'沉睡期間無法行動；若受到攻擊，當次行動仍保持沉睡，但下一回合必定甦醒。'},
  {icon:'🔒',name:'技能封鎖',desc:'隨機指定一項技能暫時失效，目標可能是主動或被動技能；同時間只封鎖一項，完成指定解除條件後恢復。'},
  {icon:'🩸',name:'渴血',desc:'吸血效率變為 1.5 倍。'},
];
let G;
function newGame(characterId=null){
  const character=CHARACTERS.find(c=>c.id===characterId)||null;
  G={hp:START_HP,maxhp:START_HP,gold:BALANCE.startGold,floor:1,poison:0,eventChance:BASE_EVENT_CHANCE,shopChance:BASE_SHOP_CHANCE,altarSeen:false,churchSeen:false,faction:0,bloodDescendant:false,nodeType:null,nodeStarted:false,
    character:character&&character.id,passives:character?[...character.passives]:[],upgrades:[],suitMastery:null,bountyHunt:null,bountyDurability:null,deck:buildDeck(),deckEdits:0,battle:null};
}

function saveNumber(value,fallback,min,max){
  const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,Math.round(n))):fallback;
}
function normalizeSavedCard(card){
  if(!card||typeof card!=='object')return null;
  const suitAliases={S:'♠',H:'♥',D:'♦',C:'♣',spade:'♠',heart:'♥',diamond:'♦',club:'♣'};
  const suit=SUITS.includes(card.s)?card.s:suitAliases[String(card.s||card.suit||'').toLowerCase()]||suitAliases[String(card.s||card.suit||'').toUpperCase()];
  let rank=card.r??card.rank??card.value;
  if(typeof rank==='string')rank=rank.trim().toUpperCase();
  if(rank==='T')rank=10;
  if(/^\d+$/.test(String(rank)))rank=Number(rank);
  if(!suit||!([2,3,4,5,6,7,8,9,10].includes(rank)||['J','Q','K','A'].includes(rank)))return null;
  return {r:rank,s:suit,red:suit==='♥'||suit==='♦'};
}
function currentSaveData(){
  const progress={
    hp:G.hp,maxhp:G.maxhp,gold:G.gold,floor:G.floor,poison:0,eventChance:G.eventChance,shopChance:G.shopChance,altarSeen:!!G.altarSeen,churchSeen:!!G.churchSeen,faction:G.faction||0,bloodDescendant:!!G.bloodDescendant,nodeType:G.nodeType,nodeStarted:!!G.nodeStarted,
    character:G.character,passives:[...G.passives],upgrades:[...G.upgrades],suitMastery:G.suitMastery,
    bountyHunt:G.bountyHunt?JSON.parse(JSON.stringify(G.bountyHunt)):null,
    bountyDurability:G.bountyDurability?JSON.parse(JSON.stringify(G.bountyDurability)):null,
    deck:G.deck.map(c=>({r:c.r,s:c.s})),deckEdits:G.deckEdits||0,
  };
  return {format:SAVE_FORMAT,saveVersion:SAVE_VERSION,gameVersion:GAME_VERSION,savedAt:new Date().toISOString(),checkpoint:'floor-start',progress};
}
function downloadSave(){
  if(!G||!Array.isArray(G.deck))return;
  const data=JSON.stringify(currentSaveData(),null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a'),date=new Date().toISOString().slice(0,10);a.href=url;a.download=`blackjack-roguelike-floor-${G.floor}-${date}.json`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  setSaveStatus(`已下載第 ${G.floor} 層 JSON 存檔。`);
}
function findLegacyProgress(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('檔案不是有效的存檔物件。');
  return raw.progress||raw.state||raw.game||raw.G||raw.save||raw;
}
function restoreSave(raw){
  const src=findLegacyProgress(raw),player=src.player&&typeof src.player==='object'?src.player:src;
  const warnings=[];
  const characterId=src.character||src.characterId||player.character;
  let character=CHARACTERS.find(c=>c.id===characterId)||null;
  let passiveSource=src.passives||src.passiveIds||player.passives||player.skills;
  if(!Array.isArray(passiveSource))passiveSource=character?[...character.passives]:[];
  passiveSource=passiveSource.map(item=>typeof item==='string'?item:item&&item.id).filter(Boolean);
  const validPassives=new Set(ALL_PASSIVES.map(p=>p.id));
  const passives=[...new Set(passiveSource.filter(id=>validPassives.has(id)))];
  if(!character)character=CHARACTERS.find(c=>c.passives.every(id=>passives.includes(id)))||null;
  if(passives.length<passiveSource.length)warnings.push('已略過舊版或未知被動');
  let upgradeSource=src.upgrades||src.upgradeIds||player.upgrades||[];
  if(!Array.isArray(upgradeSource))upgradeSource=[];
  upgradeSource=upgradeSource.map(item=>typeof item==='string'?item:item&&item.id).filter(Boolean);
  const upgrades=[...new Set(upgradeSource.filter(id=>(id==='doublebet2'&&passives.includes('doublebet'))||(validPassives.has(id)&&passives.includes(id))))];
  if(upgrades.length<upgradeSource.length)warnings.push('已略過無法對應的強化');
  const maxhp=saveNumber(player.maxhp??player.maxHp??src.maxhp,START_HP,1,1000000);
  const hp=saveNumber(player.hp??player.health??src.hp,maxhp,1,maxhp);
  let floor=saveNumber(src.floor??src.stage??src.level??src.depth,1,1,100000);
  const versionMatch=String(raw.gameVersion||'').match(/^(\d+)\.(\d+)/),usesOldMap=!versionMatch||Number(versionMatch[1])===0&&Number(versionMatch[2])<19;
  if(usesOldMap){
    const oldChapter=Math.floor((floor-1)/LEGACY_CHAPTER_LENGTH),oldWithin=(floor-1)%LEGACY_CHAPTER_LENGTH;
    floor=oldChapter*CHAPTER_LENGTH+Math.round(oldWithin*(CHAPTER_LENGTH-1)/(LEGACY_CHAPTER_LENGTH-1))+1;
    warnings.push('已將舊版 5 層大關換算為新版 11 格大關');
  }
  const rawDeck=src.deck||src.cards||player.deck;
  let deck=Array.isArray(rawDeck)?rawDeck.map(normalizeSavedCard).filter(Boolean):[];
  if(Array.isArray(rawDeck)&&deck.length<rawDeck.length)warnings.push('已移除無法辨識的牌');
  if(!deck.length){deck=buildDeck();warnings.push('缺少有效牌庫，已補回標準牌組');}
  else if(deck.reduce((sum,card)=>sum+cardPoints(card),0)<30){
    const supplements=buildDeck();
    while(deck.reduce((sum,card)=>sum+cardPoints(card),0)<30)deck.push(supplements.pop());
    warnings.push('牌庫點數過低，已補牌至可遊玩範圍');
  }
  const mastery=SUIT_MASTERIES.some(m=>m.id===src.suitMastery)&&passives.includes('suitmage')?src.suitMastery:null;
  let bountyHunt=src.bountyHunt;
  if(!bountyHunt||!Array.isArray(bountyHunt.bonuses))bountyHunt=null;
  else bountyHunt={bonuses:bountyHunt.bonuses.map(n=>saveNumber(n,0,0,1000000)).filter(n=>n>0)};
  if(bountyHunt&&!bountyHunt.bonuses.length)bountyHunt=null;
  let bountyDurability=src.bountyDurability||null;
  const chapter=chapterIndex(floor);
  if(!bountyDurability||bountyDurability.chapter!==chapter)bountyDurability=null;
  else{
    const redrawCap=passives.includes('redraw')?(upgrades.includes('redraw')?2:1):0;
    const peekCap=passives.includes('peek')?(upgrades.includes('peek')?2:1):0;
    const discardCap=passives.includes('cardsharp')?(upgrades.includes('cardsharp')?3:2):0;
    const caps={redraws:redrawCap,peeks:peekCap,discards:discardCap};
    bountyDurability={chapter,caps,redraws:saveNumber(bountyDurability.redraws,redrawCap,0,redrawCap),peeks:saveNumber(bountyDurability.peeks,peekCap,0,peekCap),discards:saveNumber(bountyDurability.discards,discardCap,0,discardCap)};
  }
  if(raw.format!==SAVE_FORMAT||raw.saveVersion!==SAVE_VERSION)warnings.push('已使用相容模式復原舊版本存檔');
  return {
    state:{hp,maxhp,gold:saveNumber(player.gold??player.coins??player.money??src.gold??src.money,0,0,1000000000000),floor,poison:0,
      eventChance:Math.min(1,Math.max(BASE_EVENT_CHANCE,Number(src.eventChance)||BASE_EVENT_CHANCE)),shopChance:Math.min(1,Math.max(BASE_SHOP_CHANCE,Number(src.shopChance)||BASE_SHOP_CHANCE)),altarSeen:src.altarSeen===true,churchSeen:src.churchSeen===true,faction:saveNumber(src.faction??src.alignment,0,-1000000,1000000),bloodDescendant:src.bloodDescendant===true,nodeType:['battle','duckBattle','shop','rest','ordinaryChurch','darkChurch','ordinaryChurchBattle','darkChurchBattle','bloodAltar','bloodAltarDeclined','bloodInvitationAltar','bloodInvitationBoss','altarBattle','altarExam','bossDemon','bossExam','altarReward','boss'].includes(src.nodeType)?src.nodeType:null,
      nodeStarted:src.nodeStarted===true,
      character:character&&character.id,passives,upgrades,suitMastery:mastery,bountyHunt,bountyDurability,deck,deckEdits:saveNumber(src.deckEdits,0,0,100000),battle:null},
    warnings,
  };
}
function setSaveStatus(message,error=false){
  const el=$('save-status');if(el){el.textContent=message;el.style.color=error?'#ff8d8d':'';}
  const toast=$('save-toast');if(!toast)return;
  toast.textContent=message;toast.classList.remove('hidden');toast.classList.toggle('error',error);
  clearTimeout(setSaveStatus.timer);setSaveStatus.timer=setTimeout(()=>toast.classList.add('hidden'),5000);
}
async function loadSaveFile(file){
  if(!file)return;
  try{
    if(file.size>2*1024*1024)throw new Error('存檔超過 2 MB，無法讀取。');
    const raw=JSON.parse(await file.text()),restored=restoreSave(raw);G=restored.state;
    document.querySelectorAll('.codex-overlay').forEach(el=>el.classList.add('hidden'));
    enterCurrentNode();
    const note=restored.warnings.length?`｜${[...new Set(restored.warnings)].join('；')}`:'';
    setSaveStatus(`已載入第 ${G.floor} 層存檔${note}`);
    log(`💾 存檔載入成功：從第 ${G.floor} 格恢復目前節點。${note}`,'gd');
  }catch(error){
    setSaveStatus(`讀取失敗：${error.message}`,true);
    alert(`無法讀取存檔：${error.message}`);
  }finally{$('save-file').value='';}
}
function chooseSaveFile(){$('save-file').click();}

function buildDeck(){
  const suits=['♠','♥','♦','♣'],ranks=[2,3,4,5,6,7,8,9,10,'J','Q','K','A'];let d=[];
  for(const s of suits)for(const r of ranks)d.push({r,s,red:(s==='♥'||s==='♦')});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d;
}
function handTotal(hand,allowCourt=true){
  let total=0,soft=0;
  for(const c of hand){
    if(c.r==='A'){soft++;total+=11;}
    else if(c.r==='K'&&allowCourt&&G&&hasP('court')){soft++;total+=11;}
    else if(['J','Q','K'].includes(c.r))total+=10;
    else total+=c.r;
  }
  while(total>21&&soft>0){total-=10;soft--;}
  return total;
}
const cardLabel=c=>(c.r===10?'10':c.r);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function cardPoints(c){if(c.r==='A')return 11;if(['J','Q','K'].includes(c.r))return 10;return c.r;}
function randomCard(){const ranks=[2,3,4,5,6,7,8,9,10,'J','Q','K','A'];const suits=['♠','♥','♦','♣'];const s=suits[rnd(0,3)];return {r:ranks[rnd(0,12)],s,red:(s==='♥'||s==='♦')};}
function battleDeck(){return G.deck.map(c=>({...c}));}
function bountyDeck(){return buildDeck();}
function shopMult(){return hasP('luckycoin')?(isUp('luckycoin')?0.85:0.90):1;}
function shopFloorMultiplier(){
  const floor=G&&G.floor?G.floor:1;
  return Math.pow(floorReward(floor,false)/floorReward(1,false),BALANCE.shopGrowthPower);
}
function price(base){return Math.max(0,Math.round(base*shopFloorMultiplier()*shopMult()));}
function deckEditMultiplier(){return Math.pow(BALANCE.deckEditGrowth,G.deckEdits||0);}
function deckEditPrice(base){return price(Math.round(base*deckEditMultiplier()));}
function floorReward(floor,boss=false){const height=legacyHeight(floor);return Math.round((boss?100:60)+height*(boss?10:8));}
function deckPoints(){return G.deck.reduce((s,c)=>s+cardPoints(c),0);}
const suitOrder=s=>({'♠':0,'♥':1,'♦':2,'♣':3}[s]??9);
const suitName=s=>({'♠':'黑桃','♥':'紅心','♦':'方塊','♣':'梅花'}[s]||s);
function rawSuitCount(hand,suit){return hand.filter(c=>c.s===suit).length;}
function dominantSuit(){
  if(!G||!G.deck.length)return null;
  const counts=SUITS.map(s=>[s,rawSuitCount(G.deck,s)]).sort((a,b)=>b[1]-a[1]||suitOrder(a[0])-suitOrder(b[0]));
  return counts[0][1]/G.deck.length>=0.4?counts[0][0]:null;
}
function effectiveSuitCount(hand,suit){
  if(activeSuitMastery()!=='mono')return rawSuitCount(hand,suit);
  const main=dominantSuit();return main===suit?rawSuitCount(hand,suit)*2:0;
}
function hasFourSuits(hand){return SUITS.every(s=>rawSuitCount(hand,s)>0);}
function maxSameSuit(hand){return Math.max(...SUITS.map(s=>rawSuitCount(hand,s)),0);}
function alternationCount(hand){let n=0;for(let i=1;i<hand.length;i++)if(hand[i].red!==hand[i-1].red)n++;return n;}
function fullyAlternating(hand){return hand.length>=4&&alternationCount(hand)===hand.length-1;}
function monoHandActive(hand){const main=dominantSuit();return !!main&&rawSuitCount(hand,main)>hand.length/2;}
function masteryInfo(){return SUIT_MASTERIES.find(m=>m.id===G.suitMastery);}
function activeSuitMastery(){return skillIsLocked('suitmage')?null:G.suitMastery;}
const sequenceRank=c=>c.r==='A'?1:c.r==='J'?11:c.r==='Q'?12:c.r==='K'?13:c.r;
function longestStraight(hand){
  const ranks=[...new Set(hand.map(sequenceRank))].sort((a,b)=>a-b);let best=0,run=0,prev=null;
  ranks.forEach(r=>{run=prev!=null&&r===prev+1?run+1:1;best=Math.max(best,run);prev=r;});return best;
}
function hasCourt(hand){return ['J','Q','K'].every(r=>hand.some(c=>c.r===r));}
function lastStandActive(){if(!hasP('laststand'))return false;return G.hp/G.maxhp<=(isUp('laststand')?0.4:0.3);}
function bloodInvitationEligible(){return !G.bloodDescendant&&ownsP('vampire')&&G.upgrades.includes('vampire')&&ownsP('bloodpact')&&ownsP('laststand')&&G.upgrades.includes('laststand');}
function bloodDescendantActive(){return !!(G&&G.bloodDescendant);}
function descendantDamageMultiplier(){return 1+Math.max(0,G.battle&&G.battle.bloodDamageStacks||0)*0.05;}
function losePlayerHp(amount){
  const damage=Math.max(0,Math.round(amount||0));if(damage<=0)return 0;
  G.hp-=damage;
  const b=G.battle;
  if(bloodDescendantActive()&&b&&!b.over){b.bloodDamageStacks=(b.bloodDamageStacks||0)+1;log(`🩸 後裔血性：本場傷害倍率提高至 ×${descendantDamageMultiplier().toFixed(2)}。`,'dmg');}
  return damage;
}
function gambleMultiplier(total){return hasP('doublebet')&&total%2===1?(isUp('doublebet')?2.5:2):1;}
function gamblePenalty(total,busted=false){
  if(!hasP('doublebet'))return 0;
  if(busted)return total*2;
  return total%2===0?(isUp('doublebet')?Math.round(total/2):total):0;
}
function applyGamblePenalty(total,busted=false){
  const penalty=gamblePenalty(total,busted);if(penalty<=0)return false;
  losePlayerHp(penalty);log(`🎲 豪賭${busted?'爆牌':'雙數'}反噬：−${penalty} HP`,'dmg');renderTop();
  if(G.hp<=0){gameOver();return true;}return false;
}
function doublebetMastered(){return G.upgrades.includes('doublebet2')&&!upgradeStolen('doublebet')&&!skillIsLocked('doublebet');}
function thirstMultiplier(){return hasP('bloodpact')?1.5:1;}
function naturalHealingBlocked(){return hasP('bloodpact');}
function bountyGambleProfile(){
  return doublebetMastered()?{odd:2,even:0,bustPenalty:true}:null;
}
function hesitationLimit(){
  if(!G.battle||!G.battle.hesitated)return Infinity;
  if(!hasP('antidote'))return 3;
  return isUp('antidote')?5:4;
}
function intimidationMult(){
  if(!G.battle||!G.battle.intimidated)return 1;
  if(!hasP('antidote'))return 0.5;
  return isUp('antidote')?1:0.75;
}
function applyDragonIntimidation(source){
  const b=G.battle;if(!b)return;
  b.intimidated=true;
  if(hasP('antidote')&&isUp('antidote'))log(`🐲 ${source}施加震攝，但強化淨化使你免疫！`,'good');
  else if(hasP('antidote'))log(`🐲 ${source}施加震攝；淨化將攻擊減幅降為 25%。`,'dmg');
  else log(`🐲 ${source}施加震攝：下一次攻擊 −50%！`,'dmg');
}
function bucklerDefense(){
  const b=G.battle;
  if(!hasP('buckler')||b.bucklerBroken)return 0;
  return isUp('buckler')?10:8;
}
function useBuckler(){
  const b=G.battle,def=bucklerDefense();
  if(def===0)return {def:0,broke:false};
  if(isUp('buckler'))return {def,broke:false};
  b.bucklerUses++;
  const broke=b.bucklerUses>=BALANCE.bucklerUses;
  if(broke)b.bucklerBroken=true;
  return {def,broke};
}

const $=id=>document.getElementById(id);
function show(s){for(const x of['character','magician-start','battle','bounty','shop','event','upgrade','drop','end'])$('screen-'+x).classList.add('hidden');$('screen-'+s).classList.remove('hidden');$('topbar').classList.toggle('hidden',s==='character'||s==='magician-start');}
function log(m,c=''){const d=document.createElement('div');d.className=c;d.textContent=m;$('log').appendChild(d);$('log').scrollTop=$('log').scrollHeight;}
const ownsP=id=>G.passives.includes(id);
const BLOOD_TRINITY=['vampire','bloodpact','laststand'];
const bloodTrinityActive=()=>bloodDescendantActive()&&BLOOD_TRINITY.every(ownsP);
const bloodTrinityProtected=id=>bloodTrinityActive()&&BLOOD_TRINITY.includes(id);
const factionSealProtected=id=>(id==='bloodpact'&&ownsP('bloodpact'))||bloodTrinityProtected(id);
const bloodContractSuppresses=id=>id==='antidote'&&bloodDescendantActive()&&ownsP('bloodpact');
const bloodContractName=()=>bloodDescendantActive()?'血魔契約':'鮮血契約';
const lockedSkillId=()=>G.battle&&!G.battle.over?G.battle.lockedSkill:null;
const skillIsLocked=id=>lockedSkillId()===id&&!factionSealProtected(id);
const hasP=id=>ownsP(id)&&!skillIsLocked(id)&&!bloodContractSuppresses(id);
const upgradeStolen=id=>!!(G.battle&&!G.battle.over&&G.battle.stolenUpgrade===id&&!bloodTrinityProtected(id));
const isUp=id=>G.upgrades.includes(id)&&!upgradeStolen(id)&&!skillIsLocked(id)&&!bloodContractSuppresses(id);

function renderPassives(){
  if(!G.passives.length){$('ui-passives').innerHTML='<span class="empty">尚未持有，於商店購買被動卡牌。</span>';return;}
  $('ui-passives').innerHTML=G.passives.map(id=>{
    const p=ALL_PASSIVES.find(x=>x.id===id);const stolen=upgradeStolen(id),locked=skillIsLocked(id),up=isUp(id);
    let txt=up&&p.descUp?p.descUp:p.desc,stars=up?' ⭐':'';
    if(id==='doublebet'&&doublebetMastered()){txt+=`｜⭐⭐ 金錢狂賭：${DOUBLEBET_MASTERY_DESC}`;stars=' ⭐⭐';}
    if(stolen){txt=`🔒 強化暫時被邪教徒奪取｜${p.desc}`;stars=' 🔒';}
    if(id==='suitmage'&&G.suitMastery){const m=masteryInfo();txt+=`｜${m.icon} ${m.name}：${m.desc}`;stars=' ⭐⭐';}
    if(id==='suitmage'&&G.suitMastery==='mono'){const main=dominantSuit();txt+=main?`（目前主花色：${main}${suitName(main)}）`:'（目前沒有花色達到牌庫 40%）';}
    if(G.bloodDescendant&&id==='vampire'){txt='血魔後裔強化：成功攻擊時，回復造成傷害的 50% HP。';stars=' 🩸';}
    if(G.bloodDescendant&&id==='laststand'){txt='血魔後裔強化：HP 不高於 40% 時攻擊 ×1.8；成功攻擊會施加 1 層敗血。';stars=' 🩸';}
    if(G.bloodDescendant&&id==='bloodpact'){txt='血魔後裔強化：無法防禦；每回合結束自損最大 HP 2%；每次扣血使本場傷害倍率 +5%；淨化失效。';stars=' 🩸';}
    if(bloodContractSuppresses(id)){txt='🔒 被血魔契約壓制：本技能及其強化效果完全失效。';stars=' 🔒';}
    if(bloodTrinityProtected(id))txt=`🩸 血之三契：不可封印，強化不可被奪取。｜${txt}`;
    else if(id==='bloodpact')txt=`🩸 陣營排斥：不可封印。｜${txt}`;
    if(locked){txt=`🔒 被石像鬼暫時封鎖｜${txt}`;stars=' 🔒';}
    const displayName=id==='bloodpact'?bloodContractName():p.name;
    return `<div class="pcard-chip" title="${txt}"><div class="pn">${p.icon} ${displayName}${stars}</div><div class="pd">${txt}</div></div>`;
  }).join('');
}

function renderTop(){
  $('ui-hp').textContent=Math.max(0,G.hp);$('ui-maxhp').textContent=G.maxhp;
  $('ui-gold').textContent=G.gold;$('ui-floor').textContent=G.floor;
  const pos=chapterPosition(G.floor),chapter=chapterIndex(G.floor)+1;
  if(isBossFloor(G.floor))$('ui-map').innerHTML=`<span class="node cur">第 ${chapter} 大關｜👑 魔王</span>`;
  else if(isRestFloor(G.floor))$('ui-map').innerHTML=`<span class="node cur">第 ${chapter} 大關｜🔥 休息</span>`;
  else $('ui-map').innerHTML=`<span class="node">第 ${chapter} 大關 ${pos}/${CHAPTER_LENGTH}｜事件 ${Math.round((G.eventChance||BASE_EVENT_CHANCE)*100)}%｜事件內商店 ${Math.round((G.shopChance||BASE_SHOP_CHANCE)*100)}%</span>`;
  renderPassives();
}

//===== 樓層敵人生成 + 高度加強 =====
function floorScaling(floor){
  const tier=chapterIndex(floor);
  const within=(chapterPosition(floor)-1)*(LEGACY_CHAPTER_LENGTH-1)/(CHAPTER_LENGTH-1);
  return {
    tier,within,
    hp:1+tier*BALANCE.hpTierStep+within*BALANCE.hpMicroPerFloor,
    atk:1+tier*BALANCE.atkTierStep+within*BALANCE.atkMicroPerFloor,
  };
}
function squirrelEscapeTurns(floor){return Math.max(3,6-Math.floor((legacyHeight(floor)-1)/10));}
function squirrelHpMultiplier(floor){
  const normal=floorScaling(floor).hp;
  const height=legacyHeight(floor);
  if(height>=31)return normal;
  const convergence=0.55+0.45*((height-1)/30);
  return 1+(normal-1)*convergence;
}
function demonGrowth(floor){
  const tier=floorScaling(floor).tier;
  const stage=Math.min(4,tier);
  const extra=Math.max(0,tier-4);
  return {
    stage,
    drainRate:0.7+stage*0.1,
    pattern:stage<2?['normal','normal','drain']:stage<4?['normal','drain']:['drain'],
    sacrificeEvery:extra>0?Math.max(3,7-Math.floor((extra-1)/2)):0,
  };
}
function demonFrenzyActive(e){return e.curhp<e.maxhp*.15&&(e.bloodFrenzyUses||0)<BALANCE.demonFrenzyUses;}
function demonThirstActive(e){return !!(e&&e.permanentThirst)||demonFrenzyActive(e);}
function demonDrainRate(e){return demonGrowth(G.floor).drainRate*(demonThirstActive(e)?1.5:1)*sepsisMultiplier(G.battle);}
function demonAction(e,round,floor){
  const growth=demonGrowth(floor);
  const canSacrifice=e.curhp>e.maxhp*0.3;
  if(growth.sacrificeEvery&&round%growth.sacrificeEvery===0&&canSacrifice)return 'sacrifice';
  const priorSacrifices=growth.sacrificeEvery?Math.floor((round-1)/growth.sacrificeEvery):0;
  return growth.pattern[((round-1)-priorSacrifices)%growth.pattern.length];
}
function dragonGrowth(floor){
  const tier=floorScaling(floor).tier;
  const stage=Math.min(4,tier);
  const extra=Math.max(0,tier-4);
  const normals=stage<2?4:stage<4?3:2;
  const interrupt=24+stage*7+extra*5;
  return {
    stage,normals,interrupt,
    breathMult:2.1+stage*0.1+extra*0.03,
    sleepChance:Math.max(0.05,0.45-stage*0.1-extra*0.02),
    shield:stage>=3,
    shieldAmount:Math.round(interrupt*0.65),
  };
}
function dragonAction(e,floor){
  if((e.sleepTurns||0)>0)return 'sleep';
  const growth=dragonGrowth(floor);
  const pos=(e.dragonStep||0)%(growth.normals+1);
  if(pos===growth.normals)return 'breath';
  if(growth.shield&&pos===growth.normals-1)return 'ward';
  return 'normal';
}
function scaledEnemy(k,idx,floor){
  const t=ENEMIES[k];
  const scale=floorScaling(floor);
  const hs=k==='squirrel'?squirrelHpMultiplier(floor):scale.hp;
  const as=scale.atk;
  const hp=Math.max(1,Math.round(t.hp*hs));
  const atk=[Math.max(1,Math.round(t.atk[0]*as)),Math.max(1,Math.round(t.atk[1]*as))];
  return {...t,atk,key:k,idx,curhp:hp,maxhp:hp,nextDmg:null};
}
function slimeWanted(floor){return 2+floorScaling(floor).tier;}
function slimeEncounter(floor){
  const wanted=slimeWanted(floor);
  const count=Math.min(5,wanted);
  const overflow=Math.max(0,wanted-5);
  const within=floorScaling(floor).within;
  const hs=1+within*BALANCE.hpMicroPerFloor+overflow*0.12;
  const as=1+within*BALANCE.atkMicroPerFloor+overflow*0.08;
  const t=ENEMIES.slime;const arr=[];
  for(let i=0;i<count;i++){
    const hp=Math.max(1,Math.round(t.hp*hs));
    arr.push({...t,atk:[Math.max(1,Math.round(t.atk[0]*as)),Math.max(1,Math.round(t.atk[1]*as))],key:'slime',idx:i,curhp:hp,maxhp:hp,nextDmg:null});
  }
  return arr;
}
function zombieEncounter(floor){
  const count=rnd(1,2),arr=[];
  for(let i=0;i<count;i++){
    const e=scaledEnemy('zombie',i,floor);e.zombieStep=0;e.zombieAction='normal';e.downed=false;e.revived=false;e.downedRound=-1;arr.push(e);
  }
  return arr;
}
function batMaxCount(floor){const height=legacyHeight(floor);return height>=31?4:height>=16?3:2;}
function batAction(e){return (e.batStep||0)%3===2?'drain':'bite';}
function batDrainHeal(hpDamage){return Math.round(Math.max(0,hpDamage)*0.5);}
function cyclopsGrowth(floor){return {cycleLength:legacyHeight(floor)>=26?3:4,smashMult:2};}
function cyclopsAction(e,floor){
  const length=cyclopsGrowth(floor).cycleLength,pos=(e.cyclopsStep||0)%length;
  if(pos===length-1)return 'smash';
  if(pos===length-2)return 'gaze';
  return 'normal';
}
function paladinGrowth(floor){
  const tier=floorScaling(floor).tier;
  const height=legacyHeight(floor),pattern=height>=26?['sunder','guard','judgment']:height>=11?['normal','normal','sunder','guard','judgment']:['normal','normal','normal','guard'];
  return {pattern,cycleLength:pattern.length,shield:16+tier*3,judgmentMult:height>=31?1.7:1.5,statusResist:0.5};
}
function paladinAction(e,floor){
  const pattern=paladinGrowth(floor).pattern;
  return pattern[(e.paladinStep||0)%pattern.length];
}
function paladinDispel(e){
  const statuses=[['poison','中毒'],['bleed','流血'],['fracture','斷骨'],['sepsis','敗血'],['burn','燒傷'],['corruption','腐敗']],removed=[];
  statuses.forEach(([key,name])=>{const stacks=Math.max(0,e[key]||0);if(stacks<=0)return;const amount=Math.max(1,Math.ceil(stacks*0.1));e[key]=Math.max(0,stacks-amount);removed.push(`${name} −${amount}`);});
  return removed;
}
function batEncounter(floor){
  const count=rnd(2,batMaxCount(floor)),arr=[];
  for(let i=0;i<count;i++){
    const e=scaledEnemy('bat',i,floor);e.name=`吸血蝙蝠 ${i+1}`;e.batStep=i%3;e.batAction=batAction(e);arr.push(e);
  }
  return arr;
}
function gargoyleEncounter(floor){
  const boss=scaledEnemy('gargoyle',0,floor);boss.gargStep=0;boss.gargoyleAction='normal';boss.shield=0;
  const cultists=[1,2].map((idx,i)=>{
    const e=scaledEnemy('cultist',idx,floor);e.name=i===0?'左翼邪教徒':'右翼邪教徒';e.maxhp=e.curhp=Math.max(1,Math.round(e.maxhp*0.55));e.atk=e.atk.map(v=>Math.max(1,Math.round(v*0.65)));e.cultStartStep=i===0?0:2;return e;
  });
  return [boss,...cultists];
}
function factionEnemyType(){
  if(ownsP('bloodpact'))return Math.random()<0.5?'cultist':'paladin';
  return (G.faction||0)<0?'paladin':'cultist';
}
function factionEncounter(type,count,floor){
  return Array.from({length:count},(_,i)=>{
    const e=scaledEnemy(type,i,floor);e.name=count>1?`${type==='cultist'?'邪教徒':'聖騎士'} ${i+1}`:e.name;
    if(type==='cultist')e.cultStartStep=i*2;
    if(type==='paladin')e.paladinStartStep=i*2;
    return e;
  });
}
function genEncounter(floor){
  if(isBossFloor(floor)){
    const gargoyleAllowed=legacyHeight(floor)>=25&&(ownsP('bloodpact')||(G.faction||0)>=120);
    const bosses=gargoyleAllowed?['dragon','demon','gargoyle']:['dragon','demon'];const bk=bosses[rnd(0,bosses.length-1)];
    return bk==='gargoyle'?gargoyleEncounter(floor):[scaledEnemy(bk,0,floor)];
  }
  const height=legacyHeight(floor);
  let pool=floor===1?EARLY_POOL:(height<6?MID_POOL:NORMAL_POOL);
  if(height<3)pool=pool.filter(x=>x!=='eagle');
  if(height<4)pool=pool.filter(x=>x!=='robot');
  if(height<4)pool=pool.filter(x=>x!=='zombies');
  if(height<6)pool=pool.filter(x=>x!=='cultist');
  if(height<11)pool=pool.filter(x=>x!=='cyclops');
  const pick=pool[Math.floor(Math.random()*pool.length)];
  if(pick==='slimes')return slimeEncounter(floor);
  if(pick==='zombies')return zombieEncounter(floor);
  if(pick==='bats')return batEncounter(floor);
  if(pick==='cultist')return factionEncounter(factionEnemyType(),1,floor);
  return [scaledEnemy(pick,0,floor)];
}

//===== 十一格大關：1～9 動態戰鬥／事件、10 休息、11 魔王 =====
function rollEventType(){
  if(!G.altarSeen&&Math.random()<BLOOD_ALTAR_CHANCE){G.altarSeen=true;G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);return 'bloodAltar';}
  if(Math.random()<CHURCH_EVENT_CHANCE){G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);return Math.random()<0.5?'ordinaryChurch':'darkChurch';}
  if(Math.random()<(G.shopChance||BASE_SHOP_CHANCE)){G.shopChance=BASE_SHOP_CHANCE;return 'shop';}
  G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);
  return 'rest';
}
function decideCurrentNode(){
  if(isBossFloor(G.floor))return 'boss';
  if(isRestFloor(G.floor))return 'rest';
  if(chapterPosition(G.floor)<=RANDOM_NODE_COUNT&&Math.random()<(G.eventChance||BASE_EVENT_CHANCE))return rollEventType();
  return 'battle';
}
function enterCurrentNode(){
  if(!G.nodeType){G.nodeType=decideCurrentNode();G.nodeStarted=false;}
  if(['shop','rest','ordinaryChurch','darkChurch','ordinaryChurchBattle','darkChurchBattle','bloodAltar','bloodAltarDeclined','bloodInvitationAltar','altarBattle','altarExam','altarReward'].includes(G.nodeType))G.eventChance=BASE_EVENT_CHANCE;
  renderTop();
  if(G.nodeType==='shop'){openShop();return;}
  if(G.nodeType==='duckBattle'){startDuck(G.floor);return;}
  if(G.nodeType==='rest'){openRestEvent();return;}
  if(G.nodeType==='ordinaryChurch'){openChurchEvent('ordinary');return;}
  if(G.nodeType==='darkChurch'){openChurchEvent('dark');return;}
  if(G.nodeType==='ordinaryChurchBattle'){startBattle('ordinaryChurch');return;}
  if(G.nodeType==='darkChurchBattle'){startBattle('darkChurch');return;}
  if(G.nodeType==='bloodAltar'){
    if(bloodInvitationEligible()){G.nodeType='bloodInvitationAltar';openBloodInvitation('altar');}
    else openBloodAltarEvent();
    return;
  }
  if(G.nodeType==='bloodAltarDeclined'){openBloodAltarEvent();return;}
  if(G.nodeType==='bloodInvitationAltar'){openBloodInvitation('altar');return;}
  if(G.nodeType==='bloodInvitationBoss'){openBloodInvitation('boss');return;}
  if(G.nodeType==='altarBattle'){startBattle('altarDemon');return;}
  if(G.nodeType==='altarExam'){startBattle('bloodExamAltar');return;}
  if(G.nodeType==='bossDemon'){startBattle('normalDemon');return;}
  if(G.nodeType==='bossExam'){startBattle('bloodExamBoss');return;}
  if(G.nodeType==='altarReward'){openBloodAltarVictory();return;}
  startBattle();
}
function advanceNode(){G.floor++;G.nodeType=null;G.nodeStarted=false;enterCurrentNode();}
function completeEvent(){advanceNode();}
function openRestEvent(){
  const fixed=isRestFloor(G.floor);
  let message=fixed?'你已在營火旁休整，整理牌組並準備迎戰下一格的魔王。':'你在旅途中找到一處安全營火。';
  if(!G.nodeStarted){
    if(naturalHealingBlocked())message=fixed?`${bloodContractName()}阻止了自然恢復；你仍整理好裝備，準備迎戰魔王。`:`${bloodContractName()}阻止了營火帶來的自然恢復。`;
    else{
      const heal=fixed?Math.max(20,Math.round(G.maxhp*0.30)):Math.max(10,Math.round(G.maxhp*0.20)),before=G.hp;G.hp=Math.min(G.maxhp,G.hp+heal);
      message=`你在營火旁回復 ${G.hp-before} HP${fixed?'，下一格必定遭遇魔王':''}。`;
    }
    G.nodeStarted=true;
  }
  $('event-title').textContent=fixed?`🔥 第 ${chapterIndex(G.floor)+1} 大關休息營地`:'🔥 途中營火';
  $('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.campfire;$('event-image').alt='燃燒中的營火';
  $('event-desc').textContent=message;$('event-actions').innerHTML='<button class="b-next" id="btn-event-continue">休息後繼續 ➜</button>';
  $('btn-event-continue').onclick=completeEvent;show('event');renderTop();
}
function churchPrayerAllowed(kind){
  if(ownsP('bloodpact'))return false;
  const faction=G.faction||0;
  return kind==='ordinary'?faction>-100:faction<100;
}
function churchGoldReward(){return Math.max(40,Math.round(floorReward(G.floor,false)*1.5));}
function openChurchEvent(kind){
  const ordinary=kind==='ordinary',canPray=churchPrayerAllowed(kind),hasContract=ownsP('bloodpact');
  G.nodeStarted=true;G.churchSeen=true;
  $('event-title').textContent=ordinary?'⛪ 一般教堂':'🕯 邪教堂';
  $('event-visual').classList.remove('hidden');$('event-image').src=ordinary?EVENT_IMG.ordinaryChurch:EVENT_IMG.darkChurch;$('event-image').alt=ordinary?'一般中世紀教堂':'黑暗邪教教堂';
  const prayerEffect=ordinary?'將生命回復至全滿':`獲得 ${churchGoldReward()} 金幣`;
  const blocked=hasContract?'鮮血契約使雙方陣營都將你視為仇敵，無法祈禱。':ordinary?'你對聖堂的敵意已突破門檻，暫時無法祈禱。':'你對邪教的敵意已突破門檻，暫時無法祈禱。';
  $('event-desc').textContent=`${ordinary?'鐘聲與燭光帶來短暫安寧。':'低語從黑色祭壇後傳來。'}祈禱可${prayerEffect}；破壞教堂將同時驚動兩名${ordinary?'聖騎士':'邪教徒'}。${canPray?'':blocked}`;
  $('event-actions').innerHTML=`${canPray?`<button class="b-magic" id="church-pray">祈禱：${prayerEffect}</button>`:''}<button class="b-stand" id="church-destroy">破壞教堂</button><button class="b-ghost" id="church-leave">路過</button>`;
  const pray=$('church-pray');if(pray)pray.onclick=()=>{
    if(ordinary){G.hp=G.maxhp;G.faction=(G.faction||0)+100;SFX.win();}
    else{const gold=churchGoldReward();G.gold+=gold;G.faction=(G.faction||0)-100;SFX.coin();}
    renderTop();completeEvent();
  };
  $('church-destroy').onclick=()=>{
    G.faction=(G.faction||0)+(ordinary?-200:200);G.nodeType=ordinary?'ordinaryChurchBattle':'darkChurchBattle';G.nodeStarted=false;startBattle(ordinary?'ordinaryChurch':'darkChurch');
  };
  $('church-leave').onclick=completeEvent;show('event');renderTop();
}
function openBloodAltarEvent(){
  const hasContract=ownsP('bloodpact');
  G.nodeStarted=true;$('event-title').textContent='🩸 鮮血祭壇';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.bloodAltar;$('event-image').alt='以鮮血繪製的儀式祭壇';
  $('event-desc').textContent=hasContract?`凝固的血液在祭壇上搏動。你已經持有${bloodContractName()}，祭壇不會產生第二份；現在只能摧毀祭壇或離開。`:'凝固的血液在祭壇上搏動。你可以簽下契約、摧毀祭壇挑戰受創的血魔，或立刻離開。這座祭壇本局不會再次出現。';
  $('event-actions').innerHTML=`${hasContract?'':'<button class="b-magic" id="altar-take">拿取鮮血契約</button>'}<button class="b-stand" id="altar-destroy">破壞祭壇</button><button class="b-ghost" id="altar-leave">離開</button>`;
  const take=$('altar-take');if(take)take.onclick=()=>{G.passives.push('bloodpact');SFX.win();completeEvent();};
  $('altar-destroy').onclick=()=>{G.nodeType='altarBattle';G.nodeStarted=false;startBattle('altarDemon');};
  $('altar-leave').onclick=completeEvent;show('event');renderTop();
}
function openBloodAltarVictory(){
  const hasContract=ownsP('bloodpact');
  G.nodeType='altarReward';G.nodeStarted=true;$('event-title').textContent='🩸 破碎的鮮血祭壇';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.bloodAltar;$('event-image').alt='破碎的鮮血儀式祭壇';
  $('event-desc').textContent=hasContract?'受創的血魔已被擊敗。你已有契約，碎石中不會出現第二份；祭壇的力量仍凝成了一次額外強化獎勵。':'受創的血魔已被擊敗。鮮血契約仍留在碎石之中，而且祭壇的力量凝成了一次額外強化獎勵。';
  $('event-actions').innerHTML=`${hasContract?'':'<button class="b-magic" id="altar-victory-take">拿取鮮血契約（不占獎勵）</button>'}<button class="b-next" id="altar-reward">進入額外獎勵 ➜</button>`;
  const take=$('altar-victory-take');if(take)take.onclick=()=>{G.passives.push('bloodpact');SFX.win();openBloodAltarVictory();};
  $('altar-reward').onclick=()=>openUpgrade('event');show('event');renderTop();
}
function openBloodInvitation(source){
  $('event-title').textContent='🩸 血魔的邀請';$('event-visual').classList.add('hidden');
  $('event-desc').textContent='強化吸血賭注、鮮血契約與強化背水一戰產生共鳴。血魔邀請你成為後裔；接受後鮮血契約會進化為血魔契約，三件裝備立即蛻變，並立刻開始血魔考核。';
  $('event-actions').innerHTML='<button class="b-magic" id="blood-invite-accept">接受邀請，進入考核</button><button class="b-ghost" id="blood-invite-decline">拒絕邀請</button>';
  $('blood-invite-accept').onclick=()=>acceptBloodInvitation(source);$('blood-invite-decline').onclick=()=>declineBloodInvitation(source);show('event');renderTop();
}
function acceptBloodInvitation(source){
  G.bloodDescendant=true;SFX.win();renderTop();
  if(source==='altar'){G.nodeType='altarExam';G.nodeStarted=false;startBattle('bloodExamAltar');}
  else{G.nodeType='bossExam';G.nodeStarted=false;startBattle('bloodExamBoss');}
}
function declineBloodInvitation(source){
  if(source==='altar'){G.nodeType='bloodAltarDeclined';openBloodAltarEvent();}
  else{G.nodeType='bossDemon';startBattle('normalDemon');}
}
function weakenedDemonEncounter(floor){
  const e=scaledEnemy('demon',0,floor);e.name='受創的血魔';e.maxhp=e.curhp=Math.max(1,Math.round(e.maxhp*0.65));e.atk=e.atk.map(v=>Math.max(1,Math.round(v*0.70)));e.boss=false;e.eventBoss=true;e.weakened=true;return [e];
}
function bloodExamEncounter(floor,eventBattle=false){
  const e=scaledEnemy('demon',0,floor);e.name='血魔考官';e.boss=!eventBattle;e.eventBoss=eventBattle;e.bloodExam=true;e.permanentThirst=true;e.statusResist=0.5;return [e];
}

//===== 戰鬥 =====
function startBattle(forcedEnemy=null){
  const floor=G.floor;
  if(!forcedEnemy&&!isBossFloor(floor)&&G.nodeType==='battle'&&Math.random()<0.12){G.nodeType='duckBattle';G.nodeStarted=false;startDuck(floor);return;}
  G.nodeStarted=true;
  const enemies=forcedEnemy==='paladin'?[scaledEnemy('paladin',0,floor)]
    :forcedEnemy==='ordinaryChurch'?factionEncounter('paladin',2,floor)
    :forcedEnemy==='darkChurch'?factionEncounter('cultist',2,floor)
    :forcedEnemy==='altarDemon'?weakenedDemonEncounter(floor)
    :forcedEnemy==='normalDemon'?[scaledEnemy('demon',0,floor)]
    :forcedEnemy==='bloodExamAltar'?bloodExamEncounter(floor,true)
    :forcedEnemy==='bloodExamBoss'?bloodExamEncounter(floor,false)
    :genEncounter(floor);
  if(!forcedEnemy&&G.nodeType==='boss'&&enemies.some(e=>e.type==='demon')&&bloodInvitationEligible()){G.nodeType='bloodInvitationBoss';G.nodeStarted=false;openBloodInvitation('boss');return;}
  const dragon=enemies.find(e=>e.type==='dragon');
  if(dragon){
    const dg=dragonGrowth(floor);
    dragon.dragonStep=0;dragon.shield=0;dragon.breathInterrupted=false;dragon.wakeNext=false;dragon.wakeShockPending=false;
    dragon.sleepTurns=Math.random()<dg.sleepChance?2:0;
  }
  enemies.filter(e=>e.type==='eagle').forEach(e=>{const eg=eagleGrowth(floor);e.maxEvasion=eg.maxEvasion;e.evasion=eg.maxEvasion;e.divePending=false;e.broken=0;e.weakened=false;});
  enemies.filter(e=>e.type==='robot').forEach(e=>{e.robotStep=0;e.robotAction='fire';e.shield=0;e.focusAbsorb=0;});
  enemies.filter(e=>e.type==='skeleton').forEach(e=>{const sg=skeletonGrowth(floor);e.skeletonStep=0;e.skeletonAction='normal';e.boneArmor=sg.maxArmor;e.boneRage=false;});
  enemies.filter(e=>e.type==='bat').forEach((e,i)=>{e.batStep=i%3;e.batAction=batAction(e);});
  enemies.filter(e=>e.type==='cyclops').forEach(e=>{e.cyclopsStep=0;e.cyclopsAction='normal';e.eyeInterrupted=false;});
  enemies.filter(e=>e.type==='paladin').forEach(e=>{const pg=paladinGrowth(floor);e.paladinStep=e.paladinStartStep||0;e.paladinAction=paladinAction(e,floor);e.judgmentInterrupted=false;e.shield=0;e.statusResist=pg.statusResist;});
  enemies.filter(e=>e.type==='cultist').forEach(e=>{e.cultStep=e.cultStartStep||0;e.cultistAction=cultistAction(e);e.hasStolen=false;e.lastStolen=null;e.shield=0;});
  enemies.filter(e=>e.type==='gargoyle').forEach(e=>{const gg=gargoyleGrowth(floor);e.gargStep=0;e.gargoyleAction='normal';e.gargoylePower=0;e.shield=gg.bossShield;enemies.filter(x=>x.type==='cultist').forEach(x=>x.shield=gg.cultShield);});
  enemies.filter(e=>e.type==='demon').forEach(e=>{e.bloodPower=0;e.bloodLockUses=0;e.bloodLockArmed=true;e.bloodFrenzyUses=0;});
  G.poison=0;
  const eventSource=['altarDemon','bloodExamAltar'].includes(forcedEnemy)?'bloodAltar':forcedEnemy==='ordinaryChurch'?'ordinaryChurch':forcedEnemy==='darkChurch'?'darkChurch':null;
  G.battle={enemies,eventSource,deck:shuffle(battleDeck()),hand:[],round:1,target:0,defense:0,pendingBust:false,
    bucklerUses:0,bucklerBroken:false,intimidated:false,hesitated:false,corruption:0,sepsis:0,bleed:0,fracture:0,burn:0,burnTicks:0,hits:0,guardStreak:0,focus:0,
    bloodDamageStacks:0,
    stolenUpgrade:null,stolenBy:null,lastStolenUpgrade:null,lockedUpgradeUses:{},lockedSkill:null,lastLockedSkill:null,
    discards:hasP('cardsharp')?(isUp('cardsharp')?3:2):0,discardMode:false,
    suitChanges:hasP('suitmage')?(isUp('suitmage')?2:1):0,suitMode:false,suitSelected:null,
    heartEchoes:hasP('heartecho')?(isUp('heartecho')?2:1):0,
    bountyHuntActive:!!G.bountyHunt,
    redrawsLeft:hasP('redraw')?(isUp('redraw')?2:1):0,
    peeksLeft:hasP('peek')?(isUp('peek')?2:1):0,
    over:false,busy:false};
  if(enemies.some(e=>e.bloodExam))G.battle.sepsis=5;
  $('btn-duck').classList.add('hidden');
  $('btn-hit').classList.remove('hidden');$('btn-stand').classList.remove('hidden');$('btn-defend').classList.remove('hidden');
  $('log').innerHTML='';
  const isBoss=enemies.some(e=>e.boss);
  log(`🗼 第 ${floor} 層 — 遭遇 ${enemies.map(e=>e.name).join(' + ')}！`,isBoss?'dmg':'');
  if(forcedEnemy==='altarDemon')log('🩸 祭壇崩裂後，受創的血魔現身：HP 僅有正常值的 65%，攻擊僅有 70%，但仍保留血祭、吸血與渴血機制。','dmg');
  if(forcedEnemy==='ordinaryChurch')log('⛪ 教堂警鐘響起：兩名聖騎士同時迎戰，擊敗後可進入一般獎勵。','dmg');
  if(forcedEnemy==='darkChurch')log('🕯 邪教儀式被破壞：兩名邪教徒同時迎戰，擊敗後可進入一般獎勵。','dmg');
  if(enemies.some(e=>e.bloodExam)){log('🩸 血魔考官：完整 Boss 數值、50% 負面狀態抗性、所有命中 HP 的攻擊附加流血，渴血永久生效。','dmg');log('🦠 血魔考核開局：你被直接施加 5 層敗血。','dmg');}
  if(floor===1){
    const character=CHARACTERS.find(c=>c.id===G.character);
    if(character)log(`${character.icon} 角色：${character.name}｜${character.desc}`,'gd');
    const starters=G.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return `${p.icon} ${p.name}`;});
    log(`🎁 起始被動：${starters.join('、')}`,'gd');
  }
  if(enemies[0].key==='slime'){
    const buffed=enemies[0].maxhp>ENEMIES.slime.hp;
    log(`史萊姆群：共 ${enemies.length} 隻`);
  }else if(floor>1){
    const scale=floorScaling(floor);
    const hpScale=enemies.length===1&&enemies[0].type==='squirrel'?squirrelHpMultiplier(floor):scale.hp;
    log(`敵人成長：第 ${scale.tier+1} 階、本大關節點 ${chapterPosition(floor)}/${CHAPTER_LENGTH}｜HP ×${hpScale.toFixed(2)}、攻擊 ×${scale.atk.toFixed(2)}`);
  }
  if(enemies.some(e=>e.type==='squirrel')){const turns=squirrelEscapeTurns(floor);log(`🐿️ 松鼠第1回合偷竊、第 ${turns} 回合結束後逃跑——高度越高，逃跑越快；第 7 大關前 HP 成長較慢。`,'dmg');}
  if(enemies.some(e=>e.type==='ninja'))log('🥷 忍者每第 3 回合使用穿刺；額外 30% 只磨損仍存在的防禦，不會轉為 HP 傷害。','dmg');
  if(enemies.some(e=>e.type==='zombie'))log(`🧟 殭屍群：共 ${enemies.length} 隻。兩次抓擊後撕咬；首次倒地後需補刀，否則以 30% HP 復活。`,'dmg');
  if(enemies.some(e=>e.type==='eagle')){const eg=eagleGrowth(floor);log(`🦅 老鷹擁有 ${eg.maxEvasion} 層閃避：16 點以下會被閃避，17～19 點可命中，20／21 點造成折翼。`,'dmg');}
  if(enemies.some(e=>e.type==='skeleton')){const sg=skeletonGrowth(floor);log(`💀 骷髏戰士擁有 ${sg.maxArmor} 層骨甲：一般攻擊消耗 1 層並減傷 40%；20／21 點可直接粉碎全部骨甲。骨盾架勢恢復 ${sg.recover} 層。`,'dmg');}
  if(enemies.some(e=>e.type==='bat'))log(`🦇 蝙蝠群：共 ${enemies.length} 隻，行動節奏彼此錯開。每兩次撕咬後吸血，回復實際 HP 傷害的 50%；完全防禦時不會回血。`,'dmg');
  if(enemies.some(e=>e.type==='cyclops'))log(`👁️ 獨眼巨人：${legacyHeight(floor)>=26?'巨棒揮擊 → 凝視 → 粉碎重擊':'兩次巨棒揮擊 → 凝視 → 粉碎重擊'}。凝視時以 18～21 點成功攻擊可打眼中斷；重擊傷及 HP 會施加 1 層斷骨。`,'dmg');
  if(enemies.some(e=>e.type==='paladin')){const pg=paladinGrowth(floor),cycle=pg.pattern.map(a=>({normal:'斬擊',sunder:'破甲斬擊',guard:'聖盾',judgment:'神聖裁決'}[a])).join(' → ');log(`✝️ 聖騎士：${cycle}。破甲斬擊具有 30% 破防；聖盾提供 ${pg.shield} 護盾並驅散各負面狀態 10%${pg.pattern.includes('judgment')?'；裁決前打破聖盾即可中斷':''}。負面狀態施加量減半（向上取整）。`,'dmg');}
  if(enemies.some(e=>e.type==='robot'))log('🤖 機器人循環：火焰噴射 → 電力充能 → 電弧放電 → 過熱冷卻。放電會吸收全部蓄勢。','dmg');
  if(enemies.some(e=>e.type==='cultist'))log('🕯 邪教徒會暫時奪取一項被動強化；20／21 點或達到傷害門檻可提前奪回。','dmg');
  if(enemies.some(e=>e.type==='gargoyle'))log(`🗿 石像鬼開局立即展開石像守護並正常行動；石像護盾永久保留且可累加。護盾足以支付死亡教徒最大 HP 的 50% 時，會消耗護盾使其以 45% HP 復活。石像封鎖會從主動與被動中隨機鎖定一項；以 20／21 點或單次對本體造成 ${gargoyleUnlockThreshold(floor)} 傷害可解除並歸還被奪強化。邪教徒每次讚頌使石像鬼永久攻擊 +${Math.round(gargoyleGrowth(floor).prayerPower*100)}%。此魔王從第 5 大關的魔王格開始出現。`,'dmg');
  if(enemies.some(e=>e.type==='dropbear'))log('🐨 掉落熊蓄力休息中，每第 3 回合猛攻一次（附中毒＋震攝）！','dmg');
  if(enemies.some(e=>e.type==='demon')){
    const dg=demonGrowth(floor);
    const cycle=dg.pattern.map(a=>a==='drain'?'吸血':'普攻').join(' → ');
    log(`😈 惡魔循環：${cycle}｜吸血率 ${Math.round(dg.drainRate*100)}%，完全防住仍至少回復預定傷害的 25%；低於 15% HP 時吸血效率 ×1.5，整場最多 ${BALANCE.demonFrenzyUses} 次。從 15% 以上被打到低於 3% 時，本場僅一次鎖在 3% HP；血祭只在高於 30% HP 時發動`+(dg.sacrificeEvery?`｜每 ${dg.sacrificeEvery} 回合可能血祭強化`:'。'),'dmg');
  }
  if(dragon){
    const dg=dragonGrowth(floor);
    log(`🐲 魔龍節奏：${dg.normals} 次普攻 → 1 次龍息｜龍息中斷門檻 ${dg.interrupt}`+(dg.shield?'｜龍息前會展開龍盾':'')+'。','dmg');
    if(dragon.sleepTurns>0)log(`💤 魔龍正在沉睡！最多沉睡 2 回合；受到攻擊後，下回合必定甦醒並施加震攝。`,'good');
    else applyDragonIntimidation('開局龍威');
  }
  if(enemies.some(e=>e.type==='gargoyle')){
    const locked=lockRandomSkill();if(locked)log(`🔒 石像封鎖指定「${locked.name}」：此技能暫時失效；20／21 點或本體傷害 ${gargoyleUnlockThreshold(floor)} 可解除。`,'dmg');
  }
  const cultist=enemies.find(e=>e.type==='cultist');if(cultist)cultistStealUpgrade(cultist);
  updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();
  rollIntents();
  renderEnemies();
  show('battle');renderTop();
  dealNewHand();
}

function startDuck(floor){
  const heal=Math.round(4+legacyHeight(floor)*2);
  const before=G.hp;
  if(!G.nodeStarted)G.hp=Math.min(G.maxhp,G.hp+heal);
  const got=G.hp-before;G.nodeStarted=true;
  G.battle={duck:true,over:true,busy:false};
  show('battle');SFX.coin();
  $('enemy-zone').innerHTML=`<div class="enemy"><img class="esprite" src="${encodeURI(IMG.duck)}" alt="鴨子" style="height:175px"><div class="ename">鴨子</div></div>`;
  $('pl-cards').innerHTML='';$('pl-total').textContent='';
  $('outgoing').textContent='';$('pl-def').textContent='';$('pl-poison').textContent='';$('incoming').textContent='';
  $('log').innerHTML='';
  log(got>0?`🦆 鴨子出現！牠送了你 ${got} HP，然後心滿意足地離開了…`:'🦆 鴨子事件已經發生；牠留下賞金挑戰後離開了。','good');
  log(`🪙 鴨子也帶來了賞金挑戰資格！基礎賞金 ${floorReward(floor,false)}。`,'gd');
  $('btn-hit').classList.add('hidden');$('btn-stand').classList.add('hidden');$('btn-defend').classList.add('hidden');
  $('btn-redraw').classList.add('hidden');$('btn-peek').classList.add('hidden');$('btn-discard').classList.add('hidden');
  $('btn-suitmagic').classList.add('hidden');$('battle-suit-picker').classList.add('hidden');
  $('btn-duck').classList.remove('hidden');
  renderTop();
}
function finishDuck(){
  $('btn-duck').classList.add('hidden');
  $('btn-hit').classList.remove('hidden');$('btn-stand').classList.remove('hidden');$('btn-defend').classList.remove('hidden');
  startBounty(false,floorReward(G.floor,false),'duckBattle');
}

//===== 戰後賞金 21 點 =====
function bountyMultiplier(total,hand){
  let mult=total<=11?0.5:total<=14?0.75:total<=16?1:total===17?1.2:total===18?1.4:total===19?1.6:total===20?1.8:2;
  if(hasP('diamondbonus')){
    const each=isUp('diamondbonus')?0.15:0.1,cap=isUp('diamondbonus')?0.45:0.3;
    mult+=Math.min(cap,effectiveSuitCount(hand,'♦')*each);
  }
  if(hand.length>=5&&total<=21)mult*=1.5;
  if(activeSuitMastery()==='four_suits'&&hasFourSuits(hand))mult*=1.5;
  else if(activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4)mult*=1.75;
  else if(activeSuitMastery()==='alternating'&&fullyAlternating(hand))mult*=1.75;
  else if(activeSuitMastery()==='mono'&&monoHandActive(hand))mult*=1.5;
  return mult;
}
function bountyGambleReward(base,total,hand){
  const normal=Math.round(base*bountyMultiplier(total,hand));
  const gamble=bountyGambleProfile();
  if(!gamble)return normal;
  return Math.round(normal*(total%2===1?gamble.odd:gamble.even));
}
function bountySuitNotes(hand){
  const notes=[];
  if(hasP('diamondbonus')&&effectiveSuitCount(hand,'♦')>0){const each=isUp('diamondbonus')?0.15:0.1,cap=isUp('diamondbonus')?0.45:0.3;notes.push(`♦分紅 +${Math.min(cap,effectiveSuitCount(hand,'♦')*each).toFixed(2)}`);}
  if(activeSuitMastery()==='four_suits'&&hasFourSuits(hand))notes.push('四象 ×1.5');
  else if(activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4)notes.push('同花 ×1.75');
  else if(activeSuitMastery()==='alternating'&&fullyAlternating(hand))notes.push('紅黑交替 ×1.75');
  else if(activeSuitMastery()==='mono'&&monoHandActive(hand))notes.push('純色 ×1.5');
  return notes;
}
function bountyLog(msg,cls=''){
  const d=document.createElement('div');d.className=cls;d.textContent=msg;$('bounty-log').appendChild(d);$('bounty-log').scrollTop=$('bounty-log').scrollHeight;
}
function bountyDrawOne(){
  const b=G.bounty;if(!b.deck.length)b.deck=shuffle(bountyDeck());
  const c=b.deck.pop();b.hand.push(c);return c;
}
function bountyChapter(){return chapterIndex(G.floor);}
function bountyDurabilityCaps(){
  return {
    redraws:hasP('redraw')?(isUp('redraw')?2:1):0,
    peeks:hasP('peek')?(isUp('peek')?2:1):0,
    discards:hasP('cardsharp')?(isUp('cardsharp')?3:2):0,
  };
}
function ensureBountyDurability(){
  const chapter=bountyChapter(),caps=bountyDurabilityCaps();
  if(!G.bountyDurability||G.bountyDurability.chapter!==chapter){
    G.bountyDurability={chapter,caps:{...caps},...caps};
    return G.bountyDurability;
  }
  const durability=G.bountyDurability;
  for(const field of ['redraws','peeks','discards']){
    const oldCap=durability.caps?.[field]||0;
    if(caps[field]>oldCap)durability[field]=(durability[field]||0)+(caps[field]-oldCap);
    durability[field]=Math.min(durability[field]||0,caps[field]);
  }
  durability.caps={...caps};
  return durability;
}
function startBounty(boss,base,source='battle'){
  const durability=ensureBountyDurability();
  G.bounty={boss,base,source,deck:shuffle(bountyDeck()),hand:[],resolved:false,reward:0,penalty:0,bust:false,discardMode:false,
    suitChanges:hasP('suitmage')?(isUp('suitmage')?2:1):0,suitMode:false,suitSelected:null,
    redraws:durability.redraws,
    peeks:durability.peeks,
    discards:durability.discards};
  bountyDrawOne();bountyDrawOne();show('bounty');$('bounty-log').innerHTML='';
  bountyLog(`🪙 基礎賞金 ${base}，決定要安全領取還是繼續追求倍率。`,'gd');
  renderBounty();renderTop();
}
function renderBounty(){
  const b=G.bounty;if(!b)return;
  const total=handTotal(b.hand,false),five=b.hand.length>=5&&total<=21;
  const mult=total>21?0:bountyMultiplier(total,b.hand);
  const preview=b.resolved?b.reward:(total>21?0:bountyGambleReward(b.base,total,b.hand));
  $('bounty-base').textContent=`${b.base}🪙`;
  $('bounty-cards').innerHTML=b.hand.map((c,i)=>`<div class="card${c.red?' red':''}${b.discardMode?' discardable':''}${b.suitMode?' suit-selectable':''}${b.suitSelected===i?' suit-selected':''}" data-bi="${i}"><div class="v">${cardLabel(c)}</div><div class="s">${c.s}</div></div>`).join('');
  if(b.discardMode)$('bounty-cards').querySelectorAll('[data-bi]').forEach(el=>el.onclick=()=>bountyDiscardCard(+el.dataset.bi));
  else if(b.suitMode)$('bounty-cards').querySelectorAll('[data-bi]').forEach(el=>el.onclick=()=>{b.suitSelected=+el.dataset.bi;renderBounty();});
  $('bounty-total').textContent=total;$('bounty-total').classList.toggle('bust',total>21);
  const suitNotes=bountySuitNotes(b.hand);
  const gamble=bountyGambleProfile();
  const gambleRate=gamble?(total%2===1?`｜🎲 單數：最終賞金 ×${gamble.odd}`:`｜🎲 雙數：最終賞金 ×${gamble.even}`):'';
  $('bounty-rate').textContent=total>21?(gamble&&gamble.bustPenalty?`💥 爆牌：倒扣基礎賞金 ${b.base}🪙`:'💥 爆牌：倍率 ×0'):`目前倍率 ×${Number(mult.toFixed(3))}${five?'（五龍 ×1.5）':''}${suitNotes.length?`｜${suitNotes.join('、')}`:''}${gambleRate}`;
  $('bounty-preview').textContent=b.resolved?(b.penalty>0?`豪賭倒扣 ${b.penalty}🪙`:b.bust?'賞金沒收：0🪙':`獲得 ${b.reward}🪙`):`目前可領取 ${preview}🪙`;
  $('bounty-deck-count').textContent=`賞金牌堆剩餘 ${b.deck.length} 張｜技能耐久於本大關共用｜傷害與防禦效果不參與計算`;
  $('bounty-hit').disabled=b.resolved;
  $('bounty-cash').textContent=b.resolved?'繼續爬塔 ➜':'領取賞金';
  const configs=[['bounty-redraw','redraw',b.redraws,`重抽手牌（本大關剩 ${b.redraws}）`],['bounty-peek','peek',b.peeks,`透視牌堆（本大關剩 ${b.peeks}）`],['bounty-discard','cardsharp',b.discards,b.discardMode?'點選一張牌丟棄（取消）':`🤵 老千丟棄（本大關剩 ${b.discards}）`]];
  configs.forEach(([id,passive,left,label])=>{const el=$(id);el.classList.toggle('hidden',!hasP(passive));el.textContent=label;el.disabled=b.resolved||left<=0;});
  const magic=$('bounty-suitmagic');magic.classList.toggle('hidden',!hasP('suitmage'));
  magic.textContent=b.suitMode?'🎭 選擇手牌（按此取消）':`🎭 花色魔術（剩 ${b.suitChanges}）`;
  magic.disabled=b.resolved||b.suitChanges<=0;
  renderSuitPicker('bounty-suit-picker',b.suitMode&&b.suitSelected!=null,s=>changeBountySuit(s));
}
function bountyHit(){
  const b=G.bounty;if(!b||b.resolved)return;
  b.discardMode=false;b.suitMode=false;b.suitSelected=null;const c=bountyDrawOne();bountyLog(`抽到 ${cardLabel(c)}${c.s}`,'hit');
  if(handTotal(b.hand,false)>21){bountyLog('💥 爆牌！本層賞金全數沒收。','dmg');resolveBounty(true);}else renderBounty();
}
function bountyCash(){
  const b=G.bounty;if(!b)return;
  if(b.resolved){leaveBounty();return;}
  resolveBounty(false);
}
function resolveBounty(bust){
  const b=G.bounty;if(!b||b.resolved)return;
  b.bust=bust;b.resolved=true;
  const total=handTotal(b.hand,false);
  b.reward=bust?0:bountyGambleReward(b.base,total,b.hand);b.penalty=0;
  const gamble=bountyGambleProfile();
  if(gamble){
    if(bust&&gamble.bustPenalty){b.penalty=Math.min(G.gold,b.base);G.gold-=b.penalty;bountyLog(`🎲 金錢狂賭爆牌：倒扣 ${b.penalty} 金幣！`,'dmg');}
    else if(!bust&&total%2===1)bountyLog(`🎲 賞金豪賭單數：最終賞金 ×${gamble.odd}！`,'gd');
    else if(!bust)bountyLog(`🎲 賞金豪賭雙數：最終賞金 ×${gamble.even}。`,'dmg');
  }
  if(!bust&&hasP('bountyhunter')&&(total===20||total===21)){
    const bonus=Math.round(bountyMultiplier(total,b.hand)*10);
    G.bountyHunt={bonuses:isUp('bountyhunter')?[bonus,Math.round(bonus*0.5)]:[bonus]};
    bountyLog(`💰 賞金獵人：下一場戰鬥首擊 +${bonus}`+(isUp('bountyhunter')?`，第二擊 +${Math.round(bonus*0.5)}`:'')+'。','good');
  }
  if(b.reward>0){G.gold+=b.reward;SFX.coin();bountyLog(`🏆 賞金結算：獲得 ${b.reward} 金幣！`,'gd');}
  renderBounty();renderTop();
}
function leaveBounty(){
  const b=G.bounty;if(!b||!b.resolved)return;
  const boss=b.boss,source=b.source;G.bounty=null;
  if(source.startsWith('event:')){if(hasP('collector'))openCardDrop(boss,source);else finishEventBattleReward(source);}
  else if(source==='battle'&&hasP('collector'))openCardDrop(boss,source);
  else if(source==='duckBattle')proceedAfterWin(false);
  else proceedAfterWin(boss);
}
function bountyRedraw(){
  const b=G.bounty;if(!b||b.resolved||b.redraws<=0)return;
  b.redraws--;G.bountyDurability.redraws=b.redraws;b.discardMode=false;b.hand=[];bountyDrawOne();bountyDrawOne();bountyLog('🔄 重抽賞金手牌','hit');renderBounty();
}
function bountyPeek(){
  const b=G.bounty;if(!b||b.resolved||b.peeks<=0)return;
  b.peeks--;G.bountyDurability.peeks=b.peeks;const n=isUp('peek')?4:3;
  bountyLog(`👁️ 接下來 ${n} 張：${b.deck.slice(-n).reverse().map(c=>cardLabel(c)+c.s).join('  ')}`,'hit');renderBounty();
}
function bountyToggleDiscard(){
  const b=G.bounty;if(!b||b.resolved||b.discards<=0)return;
  b.discardMode=!b.discardMode;b.suitMode=false;b.suitSelected=null;renderBounty();
}
function bountyToggleSuitMagic(){
  const b=G.bounty;if(!b||b.resolved||b.suitChanges<=0)return;
  b.suitMode=!b.suitMode;b.suitSelected=null;b.discardMode=false;renderBounty();
}
function changeBountySuit(suit){
  const b=G.bounty,c=b&&b.hand[b.suitSelected];if(!c||!SUITS.includes(suit)||b.suitChanges<=0)return;
  const old=c.s;c.s=suit;c.red=suit==='♥'||suit==='♦';b.suitChanges--;b.suitMode=false;b.suitSelected=null;
  bountyLog(`🎭 將 ${cardLabel(c)}${old} 變為 ${cardLabel(c)}${suit}`,'good');renderBounty();
}
function bountyDiscardCard(i){
  const b=G.bounty;if(!b||b.resolved||!b.discardMode||b.discards<=0||!b.hand[i])return;
  const c=b.hand.splice(i,1)[0];b.discards--;G.bountyDurability.discards=b.discards;b.discardMode=false;bountyLog(`🤵 老千丟棄 ${cardLabel(c)}${c.s}`,'hit');renderBounty();
}

function frontAlive(){return G.battle.enemies.find(e=>e.curhp>0);}
function ghostInvincible(e){return e.type==='ghost'&&G.battle.round%3===0;}
function witchPoisonTurn(e){return e.type==='witch'&&G.battle.round===5;}
function bearTurn(e){return e.type==='bear'&&(G.battle.round===1||G.battle.round%5===0);}
function platypusTurn(e){return e.type==='platypus'&&(G.battle.round===1||G.battle.round%3===0);}
function dropbearAttacks(r){return r%3===0;} // 休息 2 回合、第 3 回合猛攻
function ninjaPierces(r){return r%3===0;}
function zombieAction(e){return (e.zombieStep||0)%3===2?'bite':'normal';}
function zombieFinishThreshold(floor){return Math.min(24,12+floorScaling(floor).tier*2);}
function skeletonGrowth(floor){const height=legacyHeight(floor);return {maxArmor:3,recover:height>=16?2:1,guardEvery:height>=31?2:3,rageMult:1.35,damageReduction:0.4};}
function skeletonAction(e,floor){const sg=skeletonGrowth(floor);return (e.skeletonStep||0)%sg.guardEvery===sg.guardEvery-1?'guard':'normal';}
function eagleGrowth(floor){const tier=floorScaling(floor).tier;return {maxEvasion:tier>=2?2:1,diveMult:tier>=4?1.6:1.4};}
function robotGrowth(floor){const tier=floorScaling(floor).tier;return {burn:tier>=2?3:2,focusRate:tier>=2?0.75:0.5,focusCap:tier>=4?20:15,chargeShield:tier>=4?12:0};}
function robotAction(e){return ['fire','charge','electric','cool'][(e.robotStep||0)%4];}
function refreshRobotElectric(e){
  if(e.type!=='robot'||e.robotAction!=='electric')return;
  const rg=robotGrowth(G.floor);e.focusAbsorb=Math.min(rg.focusCap,Math.floor((G.battle.focus||0)*rg.focusRate));e.nextDmg=Math.max(1,Math.round((e.baseNextDmg||0)*1.4)+e.focusAbsorb);
}
function cultistGrowth(floor){const tier=floorScaling(floor).tier;return {dark:tier>=4?1.4:tier>=2?1.35:1.25,sacrifice:tier>=4?1.7:tier>=2?1.6:1.5,shield:tier>=4?15:tier>=2?8:0};}
function cultistAction(e){return ['normal','dark','sacrifice','prayer'][(e.cultStep||0)%4];}
function cultistReclaimThreshold(floor){return Math.min(40,28+floorScaling(floor).tier*2);}
function gargoyleUnlockThreshold(floor){return cultistReclaimThreshold(floor);}
function canBreakGargoyleLock(total,damage,busted=false){return !busted&&(total===20||total===21||damage>=gargoyleUnlockThreshold(G.floor));}
function gargoyleGrowth(floor){const tier=floorScaling(floor).tier;return {bossShield:18+tier*3,cultShield:10+tier*2,reviveCostRate:0.5,reviveHpRate:0.45,prayerPower:0.1};}
function livingGargoyle(){return G.battle&&G.battle.enemies.find(e=>e.type==='gargoyle'&&e.curhp>0);}
function gargoyleAction(e){
  return (e.gargStep||0)%3===2?'guard':'normal';
}
function reviveCultistsFromGargoyleShield(gargoyle){
  const b=G.battle;if(!b||!gargoyle||gargoyle.curhp<=0)return 0;
  const gg=gargoyleGrowth(G.floor);let revived=0;
  b.enemies.filter(e=>e.type==='cultist'&&e.curhp<=0).forEach(e=>{
    const cost=Math.ceil(e.maxhp*gg.reviveCostRate);
    if((gargoyle.shield||0)<cost)return;
    gargoyle.shield-=cost;e.curhp=Math.max(1,Math.round(e.maxhp*gg.reviveHpRate));e.shield=0;
    e.cultStep=e.cultStartStep||0;e.cultistAction=cultistAction(e);e.hasStolen=false;e.reclaimPause=false;e.nextDmg=0;revived++;
    log(`🗿 石像鬼消耗 ${cost} 護盾，使 ${e.name}以 ${e.curhp}/${e.maxhp} HP 復活！`,'dmg');
  });
  if(revived)ensureTarget();return revived;
}
const UPGRADE_USE_LIMITS={redraw:['redrawsLeft',1],peek:['peeksLeft',1],cardsharp:['discards',2],suitmage:['suitChanges',1],heartecho:['heartEchoes',1]};
function lockStolenUpgradeUses(id){
  const b=G.battle,rule=UPGRADE_USE_LIMITS[id];if(!b||!rule)return;
  const [field,base]=rule,locked=Math.max(0,(b[field]||0)-base);if(locked>0){b[field]-=locked;b.lockedUpgradeUses[id]=locked;}
}
function cultistRestoreUpgrade(e,reason='歸還'){
  const b=G.battle,id=b&&b.stolenUpgrade;if(!id)return;
  const holder=b.enemies&&b.enemies.find(x=>x.type==='cultist'&&x.idx===b.stolenBy);if(holder)e=holder;
  const locked=b.lockedUpgradeUses[id]||0,rule=UPGRADE_USE_LIMITS[id];if(rule&&locked)b[rule[0]]+=locked;
  if(id==='buckler')b.bucklerBroken=false;
  delete b.lockedUpgradeUses[id];b.stolenUpgrade=null;b.stolenBy=null;if(e)e.hasStolen=false;
  const p=ALL_PASSIVES.find(x=>x.id===id);log(`🌟 ${p?p.name:id}的強化已${reason}！`,'good');renderTop();
}
function cultistStealUpgrade(e){
  const b=G.battle;if(!b)return null;
  if(b.stolenUpgrade)cultistRestoreUpgrade(null);
  const all=G.upgrades.filter(id=>ownsP(id)&&!skillIsLocked(id)&&!bloodTrinityProtected(id)),choices=all.length>1?all.filter(id=>id!==b.lastStolenUpgrade):all;
  if(!choices.length){e.hasStolen=false;e.shield=Math.max(e.shield||0,12);log('🕯 無強化可奪取，邪教徒改為獲得 12 點儀式護盾。','dmg');return null;}
  const id=choices[rnd(0,choices.length-1)];b.stolenUpgrade=id;b.stolenBy=e.idx;b.lastStolenUpgrade=id;e.hasStolen=true;e.lastStolen=id;lockStolenUpgradeUses(id);
  const shield=cultistGrowth(G.floor).shield;if(shield)e.shield=Math.max(e.shield||0,shield);
  const p=ALL_PASSIVES.find(x=>x.id===id);log(`🔒 邪教徒暫時奪取「${p?p.name:id}」的強化！被動退回基礎效果。`,'dmg');renderTop();return id;
}
function lockRandomSkill(){
  const b=G.battle;if(!b||!b.enemies.some(e=>e.type==='gargoyle'&&e.curhp>0)||!G.passives.length)return null;
  let choices=G.passives.filter(id=>!factionSealProtected(id)&&id!==b.lastLockedSkill&&id!==b.stolenUpgrade);
  if(!choices.length)choices=G.passives.filter(id=>!factionSealProtected(id)&&id!==b.lastLockedSkill);
  if(!choices.length)choices=G.passives.filter(id=>!factionSealProtected(id));
  if(!choices.length){b.lockedSkill=null;log(bloodTrinityActive()?'🩸 血之三契拒絕石像封印，本次封鎖失敗。':'🩸 鮮血契約的陣營排斥拒絕石像封印，本次封鎖失敗。','good');return null;}
  const id=choices[rnd(0,choices.length-1)];b.lockedSkill=id;b.lastLockedSkill=id;b.discardMode=false;b.suitMode=false;b.suitSelected=null;
  return ALL_PASSIVES.find(p=>p.id===id)||{id,name:id};
}
function releaseGargoyleLocks(){
  const b=G.battle;if(!b)return false;const locked=b.lockedSkill,hadUpgrade=!!b.stolenUpgrade;
  b.lockedSkill=null;if(hadUpgrade)cultistRestoreUpgrade(null,'解放');
  if(locked||hadUpgrade){const p=ALL_PASSIVES.find(x=>x.id===locked);log(`🔓 石像封鎖破裂：${p?`「${p.name}」已恢復`:'技能已恢復'}${hadUpgrade?'，被邪教徒奪取的強化也已歸還':''}！`,'gd');updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();renderTop();return true;}
  return false;
}
function eagleRecoverEvasion(reason){
  const b=G.battle;if(!b||!b.enemies)return;
  b.enemies.filter(e=>e.type==='eagle'&&e.curhp>0).forEach(e=>{
    if(e.broken>0){log(`🪶 ${e.name}處於折翼，無法因${reason}恢復閃避。`,'good');return;}
    if(e.evasion<e.maxEvasion){e.evasion++;log(`🦅 ${e.name}因你${reason}而恢復 1 層閃避（${e.evasion}/${e.maxEvasion}）。`,'dmg');}
  });
}
function activateEagleDive(e){
  e.divePending=true;const base=e.baseNextDmg??e.nextDmg??0;e.nextDmg=Math.max(1,Math.round(base*eagleGrowth(G.floor).diveMult));
}
function reviveZombie(e){
  e.downed=false;e.revived=true;e.curhp=Math.max(1,Math.round(e.maxhp*0.3));e.zombieStep=0;e.zombieAction='normal';e.nextDmg=0;return e.curhp;
}
function combatHeal(amount){
  const stacks=G.battle&&G.battle.corruption||0,mult=Math.max(0.4,1-stacks*0.2),adjusted=Math.max(0,Math.round(amount*mult));
  const before=G.hp;G.hp=Math.min(G.maxhp,G.hp+adjusted);return {healed:G.hp-before,adjusted,mult};
}
function sepsisMultiplier(target){return 1+Math.max(0,target&&target.sepsis||0)*0.15;}
function resistedStatusAmount(target,amount){const raw=Math.max(0,amount||0),resist=Math.min(1,Math.max(0,target&&target.statusResist||0));return raw>0?Math.max(1,Math.ceil(raw*(1-resist))):0;}
function addBleed(target,amount){if(!target)return 0;const before=target.bleed||0;target.bleed=Math.min(8,before+resistedStatusAmount(target,amount));return target.bleed-before;}
function addSepsis(target,amount){if(!target)return 0;const before=target.sepsis||0;target.sepsis=Math.min(5,before+resistedStatusAmount(target,amount));return target.sepsis-before;}
function triggerBleed(target,directDamage){
  if(!target||directDamage<=0||(target.bleed||0)<=0)return {damage:0,remaining:target&&target.bleed||0};
  const damage=target.bleed;target.bleed=Math.max(0,target.bleed-1);return {damage,remaining:target.bleed};
}
function addFracture(target,amount){if(!target)return 0;const before=target.fracture||0;target.fracture=Math.min(3,before+resistedStatusAmount(target,amount));return target.fracture-before;}
function fractureMultiplier(target){return Math.max(0.55,1-Math.max(0,target&&target.fracture||0)*0.15);}
function toxicologyPoison(hand){
  if(!hasP('toxicology'))return 0;
  const maxRank=isUp('toxicology')?4:3;
  return hand.reduce((sum,c)=>sum+(typeof c.r==='number'&&c.r>=2&&c.r<=maxRank?c.r:0),0);
}
function applyToxicology(target,hand){
  const rawPoison=toxicologyPoison(hand),poison=resistedStatusAmount(target,rawPoison);
  if(!target||target.curhp<=0||target.downed||poison<=0)return 0;
  target.poison=(target.poison||0)+poison;SFX.poison();
  log(`⚗️ 毒物學：${target.name} 中毒 +${poison}${poison<rawPoison?`（抗性抵銷 ${rawPoison-poison} 層）`:''}（目前 ${target.poison} 層）`,'good');
  return poison;
}
function tickBurnStatus(b){
  if(!b||b.burn<=0)return null;
  const damage=b.burn*2;b.burnTicks=(b.burnTicks||0)+1;
  const decays=b.burnTicks>=2;if(decays){b.burn=Math.max(0,b.burn-1);b.burnTicks=0;}
  return {damage,decays,remaining:b.burn};
}
function armorBreakBonus(e,dmg,hasDefense){return hasDefense&&((e.type==='ninja'&&e.ninjaAction==='pierce')||(e.type==='paladin'&&e.paladinAction==='sunder'))?Math.round(dmg*0.3):0;}
function resolveDefenseDamage(baseDamage,defense,armorBonus=0){
  const blocked=Math.min(baseDamage,defense),net=Math.max(0,baseDamage-blocked);
  const armorWear=Math.min(Math.max(0,defense-blocked),armorBonus);
  return {blocked,net,armorWear,defenseLeft:Math.max(0,defense-blocked-armorWear)};
}
function fact(n){n=Math.min(n,10);let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
function squirrelSteal(){
  const amt=Math.min(G.gold,Math.max(10,Math.round(G.gold*0.15)));
  G.gold-=amt;
  log(`🐿️ 松鼠偷走了 ${amt} 金幣！擊倒牠就不會再損失更多。`,'dmg');
  renderTop();
}
function rollIntents(){G.battle.enemies.forEach(e=>{if(e.curhp>0){
  if(e.type==='ninja')e.ninjaAction=ninjaPierces(G.battle.round)?'pierce':'normal';
  if(e.type==='zombie')e.zombieAction=zombieAction(e);
  if(e.type==='robot')e.robotAction=robotAction(e);
  if(e.type==='skeleton')e.skeletonAction=skeletonAction(e,G.floor);
  if(e.type==='bat')e.batAction=batAction(e);
  if(e.type==='cyclops')e.cyclopsAction=cyclopsAction(e,G.floor);
  if(e.type==='paladin')e.paladinAction=paladinAction(e,G.floor);
  if(e.type==='cultist')e.cultistAction=cultistAction(e);
  if(e.type==='gargoyle')e.gargoyleAction=gargoyleAction(e);
  if(e.type==='demon')e.demonAction=demonAction(e,G.battle.round,G.floor);
  if(e.type==='dragon')e.dragonAction=dragonAction(e,G.floor);
  if(e.type==='zombie'&&e.downed)e.nextDmg=0;
  else if(e.type==='robot'&&(e.robotAction==='charge'||e.robotAction==='cool')){
    e.nextDmg=0;e.focusAbsorb=0;if(e.robotAction==='charge'){const s=robotGrowth(G.floor).chargeShield;if(s)e.shield=Math.max(e.shield||0,s);}
  }
  else if(e.type==='cultist'&&e.cultistAction==='prayer')e.nextDmg=0;
  else if(e.type==='gargoyle'&&e.gargoyleAction==='guard')e.nextDmg=0;
  else if(e.type==='skeleton'&&e.skeletonAction==='guard')e.nextDmg=0;
  else if(e.type==='cyclops'&&e.cyclopsAction==='gaze')e.nextDmg=0;
  else if(e.type==='paladin'&&e.paladinAction==='guard')e.nextDmg=0;
  else if(e.type==='dropbear'&&!dropbearAttacks(G.battle.round))e.nextDmg=0;
  else if(e.type==='demon'&&e.demonAction==='sacrifice')e.nextDmg=0;
  else if(e.type==='dragon'&&e.dragonAction==='sleep')e.nextDmg=0;
  else{
    const base=rnd(e.atk[0],e.atk[1]);
    e.baseNextDmg=base;
    if(e.type==='demon')e.nextDmg=Math.max(1,Math.round(base*(1+(e.bloodPower||0))));
    else if(e.type==='gargoyle')e.nextDmg=Math.max(1,Math.round(base*(1+(e.gargoylePower||0))));
    else if(e.type==='skeleton'&&e.boneRage)e.nextDmg=Math.max(1,Math.round(base*skeletonGrowth(G.floor).rageMult));
    else if(e.type==='cyclops'&&e.cyclopsAction==='smash')e.nextDmg=Math.max(1,Math.round(base*cyclopsGrowth(G.floor).smashMult));
    else if(e.type==='paladin'&&e.paladinAction==='judgment')e.nextDmg=Math.max(1,Math.round(base*paladinGrowth(G.floor).judgmentMult));
    else if(e.type==='zombie'&&e.zombieAction==='bite')e.nextDmg=Math.max(1,Math.round(base*1.35));
    else if(e.type==='robot'&&e.robotAction==='fire')e.nextDmg=Math.max(1,Math.round(base*1.1));
    else if(e.type==='robot'&&e.robotAction==='electric'){
      const rg=robotGrowth(G.floor);e.focusAbsorb=Math.min(rg.focusCap,Math.floor((G.battle.focus||0)*rg.focusRate));e.nextDmg=Math.max(1,Math.round(base*1.4)+e.focusAbsorb);
    }
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='dark')e.nextDmg=Math.max(1,Math.round(base*cultistGrowth(G.floor).dark));
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='sacrifice')e.nextDmg=Math.max(1,Math.round(base*cultistGrowth(G.floor).sacrifice));
    else if(e.type==='eagle'&&e.divePending)e.nextDmg=Math.max(1,Math.round(base*eagleGrowth(G.floor).diveMult));
    else if(e.type==='dragon'&&e.dragonAction==='breath')e.nextDmg=Math.max(1,Math.round(base*dragonGrowth(G.floor).breathMult));
    else e.nextDmg=base;
  }
}});}
function currentTarget(){const b=G.battle;const sel=b.enemies.find(e=>e.idx===b.target&&e.curhp>0);return sel||frontAlive();}
function ensureTarget(){const b=G.battle;const sel=b.enemies.find(e=>e.idx===b.target&&e.curhp>0);if(!sel){const f=frontAlive();b.target=f?f.idx:0;}}
function setTarget(idx){const b=G.battle;if(b.over)return;const e=b.enemies.find(x=>x.idx===idx&&x.curhp>0);if(!e)return;b.target=idx;renderEnemies();}

function updateIncoming(){
  const b=G.battle;
  const status=[];
  if(b.defense>0||hasP('bulwark'))status.push(`🛡 目前防禦 ${b.defense}`);
  if(hasP('buckler')){
    if(isUp('buckler'))status.push('🛡 圓盾耐久 ∞');
    else if(b.bucklerBroken)status.push('🛡 圓盾已損毀');
    else status.push(`🛡 圓盾耐久 ${BALANCE.bucklerUses-b.bucklerUses}/${BALANCE.bucklerUses}`);
  }
  if(b.focus>0)status.push(`⚡ 蓄勢 ${b.focus}（下次攻擊額外傷害）`);
  if(hasP('bloodpact'))status.push('🩸 渴血（吸血效率 ×1.5）');
  if(bloodContractSuppresses('antidote')&&ownsP('antidote'))status.push('🔒 淨化受血魔契約壓制');
  if(bloodTrinityActive())status.push('🩸 血之三契（不可封印／強化不可奪取）');
  else if(ownsP('bloodpact'))status.push('🩸 陣營排斥（鮮血契約不可封印）');
  if(bloodDescendantActive()&&(b.bloodDamageStacks||0)>0)status.push(`🩸 後裔血性 ×${descendantDamageMultiplier().toFixed(2)}`);
  if(b.lockedSkill){const p=ALL_PASSIVES.find(x=>x.id===b.lockedSkill);status.push(`🔒 封鎖「${p?p.name:b.lockedSkill}」：20／21 點或本體傷害 ${gargoyleUnlockThreshold(G.floor)} 可解除`);}
  $('pl-def').textContent=status.join(' ｜ ');
  const ailments=[];
  if(G.poison>0)ailments.push(`☠ 中毒 ${G.poison} 層（每回合 −${G.poison} HP）`);
  if(b.corruption>0)ailments.push(`🧟 腐敗 ${b.corruption} 層（戰鬥回血 −${b.corruption*20}%）`);
  if(b.sepsis>0)ailments.push(`🦠 敗血 ${b.sepsis} 層（吸血者效率 +${b.sepsis*15}%）`);
  if(b.bleed>0)ailments.push(`🩸 流血 ${b.bleed} 層（下次直接傷及 HP 時額外 −${b.bleed}）`);
  if(b.fracture>0)ailments.push(`🦴 斷骨 ${b.fracture} 層（新防禦 −${b.fracture*15}%）`);
  if(b.burn>0)ailments.push(`🔥 燒傷 ${b.burn} 層（下次 ${b.burn*2} 傷害；${(b.burnTicks||0)>=1?'發作後 −1 層':'每 2 次發作 −1 層'}）`);
  $('pl-poison').textContent=ailments.join(' ｜ ');
  const limit=hesitationLimit();
  $('incoming').textContent=b.hesitated?`🦫 遲疑中：本回合最多再抽 ${Math.max(0,limit-(b.hits||0))} 張（上限 ${limit}）`:'';
}
function incomingTotal(){
  const b=G.battle;if(!b||!b.enemies)return 0;
  return b.enemies.filter(e=>e.curhp>0).reduce((sum,e)=>{
    if(witchPoisonTurn(e))return sum;
    const d=Math.max(0,e.nextDmg||0);return sum+d+armorBreakBonus(e,d,b.defense>0);
  },0);
}

function renderEnemies(){
  const b=G.battle,zone=$('enemy-zone');zone.innerHTML='';
  const gargoyleFight=b.enemies.some(e=>e.type==='gargoyle');
  zone.classList.toggle('gargoyle-formation',gargoyleFight);
  ensureTarget();
  const aliveCount=b.enemies.filter(e=>e.curhp>0).length;
  b.enemies.forEach(e=>{
    refreshRobotElectric(e);
    const alive=e.curhp>0;
    const inv=ghostInvincible(e)&&alive;
    const poisonAct=witchPoisonTurn(e)&&alive;
    const selected=alive&&e.idx===b.target;
    const selectable=alive&&aliveCount>1;
    const el=document.createElement('div');
    el.className='enemy'+(alive?'':' dead')+(selected?' selected':'')+(inv?' invincible':'')+(selectable?' selectable':'');
    if(gargoyleFight){
      if(e.type==='gargoyle')el.classList.add('gargoyle-center');
      else if(e.type==='cultist')el.classList.add(e.cultStartStep===0?'cultist-left':'cultist-right');
    }
    el.id='enemy-'+e.idx;
    const shownHp=e.downed?0:Math.max(0,e.curhp),pct=shownHp/e.maxhp*100;
    const bearAct=bearTurn(e)&&alive;
    const platyAct=platypusTurn(e)&&alive;
    const sqAct=e.type==='squirrel'&&b.round===1&&alive;
    const sqFlee=e.type==='squirrel'&&alive?`（${Math.max(0,squirrelEscapeTurns(G.floor)+1-b.round)} 回合後逃跑）`:'';
    const dropRest=e.type==='dropbear'&&alive&&!dropbearAttacks(b.round);
    const dropAtk=e.type==='dropbear'&&alive&&dropbearAttacks(b.round);
    let intent;
    if(e.type==='zombie'&&e.downed)intent=`💀 倒地｜補刀需 ${zombieFinishThreshold(G.floor)} 傷害，20／21 點可直接處決`;
    else if(poisonAct)intent='☠ 本回合附加 2 層中毒';
    else if(dropRest)intent='💤 蓄力休息中…';
    else if(e.type==='skeleton'&&e.skeletonAction==='guard'){const sg=skeletonGrowth(G.floor);intent=`🦴 骨盾架勢（不攻擊；恢復 ${sg.recover} 層骨甲，滿層時下次攻擊 ×${sg.rageMult}）`;}
    else if(e.type==='skeleton'&&e.boneRage)intent=`💀 骨刃強襲 <span class="dmgtag">${e.nextDmg??'?'}</span>（×${skeletonGrowth(G.floor).rageMult}）`;
    else if(e.type==='bat'&&e.batAction==='drain')intent=`🩸 吸血撕咬 <span class="dmgtag">${e.nextDmg??'?'}</span>（實際 HP 傷害的 50%）`;
    else if(e.type==='bat')intent=`🦇 撕咬 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cyclops'&&e.cyclopsAction==='gaze')intent=e.eyeInterrupted?'💥 獨眼已被命中，粉碎重擊中斷':`👁️ 獨眼凝視（不攻擊；18～21 點命中可中斷下回合重擊）`;
    else if(e.type==='cyclops'&&e.cyclopsAction==='smash')intent=`🔨 粉碎重擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：斷骨 +1）`;
    else if(e.type==='cyclops')intent=`🪵 巨棒揮擊 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='paladin'&&e.paladinAction==='guard')intent=`✝️ 聖盾禱告（不攻擊；護盾補至 ${paladinGrowth(G.floor).shield}，驅散各負面狀態 10%）`;
    else if(e.type==='paladin'&&e.paladinAction==='judgment')intent=e.judgmentInterrupted?'💥 聖盾已破，神聖裁決中斷':`⚔️ 神聖裁決 <span class="dmgtag">${e.nextDmg??'?'}</span>（打破聖盾可中斷）`;
    else if(e.type==='paladin'&&e.paladinAction==='sunder')intent=`💥 破甲斬擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（破防 30%）`;
    else if(e.type==='paladin')intent=`🗡️ 聖劍斬擊 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='ninja'&&e.ninjaAction==='pierce')intent=`🗡️ 穿刺 <span class="dmgtag">${e.nextDmg??'?'}</span>（💥 破防 30%）`;
    else if(e.type==='zombie'&&e.zombieAction==='bite')intent=`🧟 腐敗撕咬 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP 時附加腐敗）`;
    else if(e.type==='eagle'&&e.divePending)intent=`🦅 俯衝反擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（×${eagleGrowth(G.floor).diveMult}）`;
    else if(e.type==='robot'&&e.robotAction==='charge')intent=`⚡ 電力充能（本回合不攻擊）${e.shield>0?`｜獲得 ${e.shield} 護盾`:''}`;
    else if(e.type==='robot'&&e.robotAction==='electric')intent=`⚡ 電弧放電 <span class="dmgtag">${e.nextDmg??'?'}</span>（吸收蓄勢 +${e.focusAbsorb}）`;
    else if(e.type==='robot'&&e.robotAction==='cool')intent='❄️ 過熱冷卻（不攻擊、受到傷害 ×1.4）';
    else if(e.type==='robot'&&e.robotAction==='fire')intent=`🔥 火焰噴射 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP 時附加燒傷）`;
    else if(e.type==='cultist'&&e.cultistAction==='prayer')intent=gargoyleFight?`🕯 石像讚頌（不攻擊；石像鬼永久攻擊 +${Math.round(gargoyleGrowth(G.floor).prayerPower*100)}%）`:'🕯 反噬祈禱（不攻擊、受到傷害 ×1.3）';
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='dark')intent=`🌑 邪能打擊 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='sacrifice')intent=`🩸 獻祭釋放 <span class="dmgtag">${e.nextDmg??'?'}</span>（攻擊後歸還強化）`;
    else if(e.type==='gargoyle'&&e.gargoyleAction==='guard')intent=`🗿 石像守護（護盾永久累加 +${gargoyleGrowth(G.floor).bossShield}，並嘗試復活教徒）`;
    else if(e.type==='demon'&&e.demonAction==='sacrifice')intent='🩸 血祭：自損最多 8% HP，攻擊永久 +15%';
    else if(e.type==='demon'&&e.demonAction==='drain')intent=`🩸 吸血攻擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（吸血 ${Math.round(demonDrainRate(e)*100)}%${e.permanentThirst?'，永久渴血':demonFrenzyActive(e)?`，渴血剩 ${BALANCE.demonFrenzyUses-(e.bloodFrenzyUses||0)} 次`:''}${b.sepsis>0?`，敗血 +${b.sepsis*15}%`:''}；完全防住仍保底回復 25%）`;
    else if(e.type==='dragon'&&e.dragonAction==='sleep')intent=`💤 沉睡中（剩 ${e.sleepTurns} 回合）${e.wakeNext?'｜下回合甦醒':''}`;
    else if(e.type==='dragon'&&e.dragonAction==='breath')intent=`🔥 龍息 <span class="dmgtag">${e.nextDmg??'?'}</span>｜實際傷害達 ${dragonGrowth(G.floor).interrupt} 可中斷`;
    else if(e.type==='dragon'&&e.dragonAction==='ward')intent=`🗡 普攻 <span class="dmgtag">${e.nextDmg??'?'}</span> ＋ 🛡 展開 ${dragonGrowth(G.floor).shieldAmount} 龍盾`;
    else intent=`🗡 本回合 <span class="dmgtag">${e.nextDmg??'?'}</span>${bearAct?' ＋🐻震攝':''}${platyAct?' ＋🦫遲疑':''}${sqAct?' ＋🐿️偷竊':''}${dropAtk?' ＋☠＋🐻':''}${sqFlee}`;
    const sprite=e.img?`<img class="esprite" src="${encodeURI(e.img)}" alt="${e.name}" style="height:${e.h}px">`:`<div class="esprite emoji-sprite" style="font-size:${Math.round(e.h*0.85)}px">${e.emoji||'❓'}</div>`;
    const demonRageRate=e.type==='demon'?demonGrowth(G.floor).drainRate*1.5*sepsisMultiplier(b):0;
    const demonRageHeal=e.type==='demon'&&e.demonAction==='drain'?Math.round((e.nextDmg||0)*demonRageRate):0;
    const demonStatus=e.type==='demon'?(e.permanentThirst?` ｜ 🩸 永久渴血｜吸血 ${Math.round(demonRageRate*100)}%${e.demonAction==='drain'?`（完全命中回復 ${demonRageHeal} HP）`:''}`:` ｜ 🩸 渴血剩餘 ${Math.max(0,BALANCE.demonFrenzyUses-(e.bloodFrenzyUses||0))}/${BALANCE.demonFrenzyUses}｜渴血吸血 ${Math.round(demonRageRate*100)}%${e.demonAction==='drain'?`（完全命中回復 ${demonRageHeal} HP）`:''}${demonFrenzyActive(e)?'（生效中）':''}`):'';
    el.innerHTML=`
      ${sprite}
      <div class="ename">${e.name}</div>
      <div class="ebar"><span style="width:${pct}%"></span></div>
      <div class="eintent">HP ${shownHp}/${e.maxhp}${e.shield>0?` ｜ 🛡 護盾 ${e.shield}`:''}${e.poison>0?` ｜ ☠ 中毒 ${e.poison} 層`:''}${e.bleed>0?` ｜ 🩸 流血 ${e.bleed} 層`:''}${e.sepsis>0?` ｜ 🦠 敗血 ${e.sepsis} 層`:''}${e.fracture>0?` ｜ 🦴 斷骨 ${e.fracture} 層`:''}${e.statusResist>0?` ｜ ✝️ 負面狀態抗性 ${Math.round(e.statusResist*100)}%`:''}${e.type==='skeleton'?` ｜ 🦴 骨甲 ${e.boneArmor}/${skeletonGrowth(G.floor).maxArmor}`:''}${e.type==='gargoyle'&&e.gargoylePower>0?` ｜ ⚔ 祈禱攻擊 +${Math.round(e.gargoylePower*100)}%`:''}${e.type==='eagle'?` ｜ 💨 閃避 ${e.evasion}/${e.maxEvasion}${e.broken>0?' ｜ 🪶 折翼':''}`:''}${e.type==='cultist'&&G.battle.stolenUpgrade&&G.battle.stolenBy===e.idx?` ｜ 🔒 ${ALL_PASSIVES.find(p=>p.id===G.battle.stolenUpgrade)?.name||G.battle.stolenUpgrade}`:''}${demonStatus} ｜ ${intent}</div>
      ${inv?'<div class="shieldtag">🛡️ 無敵回合</div>':(selected&&aliveCount>1?'<div class="targettag">🎯 攻擊目標</div>':'')}`;
    if(selectable)el.onclick=()=>setTarget(e.idx);
    zone.appendChild(el);
  });
  updateIncoming();
}

function floatNum(enemyIdx,txt,color){
  const el=$('enemy-'+enemyIdx);if(!el)return;
  const f=document.createElement('div');f.className='floatnum';f.textContent=txt;
  f.style.color=color;el.appendChild(f);setTimeout(()=>f.remove(),1000);
}

function dealNewHand(){
  const b=G.battle;
  if(b.deck.length<8)b.deck=shuffle(battleDeck());
  b.hand=[];b.pendingBust=false;b.hits=0;b.discardMode=false;b.suitMode=false;b.suitSelected=null;$('pl-cards').innerHTML='';
  $('battle-suit-picker').classList.add('hidden');
  b.busy=true;
  dealOne(()=>dealOne(()=>{b.busy=false;updateHandUI();syncButtons();updateDiscardBtn();}));
}
function dealOne(cb){
  const b=G.battle;const c=b.deck.pop();b.hand.push(c);SFX.draw();
  const card=document.createElement('div');
  card.className='card dealing'+(c.red?' red':'');
  card.innerHTML=`<div class="v">${cardLabel(c)}</div><div class="s">${c.s}</div>`;
  $('pl-cards').appendChild(card);$('deck-count').textContent=b.deck.length;
  updateTotalOnly();setTimeout(cb,260);
}
function updateTotalOnly(){const t=handTotal(G.battle.hand);const el=$('pl-total');el.textContent=t;el.classList.toggle('bust',t>21);updateOutgoing();updateIncoming();}
function updateHandUI(){updateTotalOnly();$('deck-count').textContent=G.battle.deck.length;}
function renderHand(){
  const b=G.battle;const el=$('pl-cards');el.innerHTML='';
  b.hand.forEach((c,i)=>{
    const card=document.createElement('div');
    card.className='card'+(c.red?' red':'')+(b.discardMode?' discardable':'')+(b.suitMode?' suit-selectable':'')+(b.suitSelected===i?' suit-selected':'');
    card.innerHTML=`<div class="v">${cardLabel(c)}</div><div class="s">${c.s}</div>`;
    if(b.discardMode)card.onclick=()=>doDiscard(i);
    else if(b.suitMode)card.onclick=()=>{b.suitSelected=i;renderHand();renderSuitPicker('battle-suit-picker',true,s=>changeBattleSuit(s));};
    el.appendChild(card);
  });
}
function toggleDiscard(){
  const b=G.battle;if(b.over||b.busy||b.pendingBust||b.discards<=0||skillIsLocked('cardsharp'))return;
  b.discardMode=!b.discardMode;b.suitMode=false;b.suitSelected=null;renderHand();updateDiscardBtn();updateSuitMagicBtn();
}
function doDiscard(i){
  const b=G.battle;if(!b.discardMode||b.discards<=0||skillIsLocked('cardsharp'))return;
  b.hand.splice(i,1);b.discards--;b.discardMode=false;SFX.draw();
  log('🤵 老千：丟棄一張手牌','hit');
  renderHand();updateHandUI();updateDiscardBtn();syncButtons();
}
function updateDiscardBtn(){
  const b=G.battle;if(!b||!ownsP('cardsharp')){$('btn-discard').classList.add('hidden');return;}
  $('btn-discard').classList.remove('hidden');
  $('btn-discard').textContent=skillIsLocked('cardsharp')?'🔒 老千被封鎖':(b.discardMode?'🤵 點手牌丟棄（按此取消）':`🤵 老千丟棄（剩 ${b.discards}）`);
  $('btn-discard').disabled=b.over||b.busy||b.pendingBust||b.discards<=0||skillIsLocked('cardsharp');
}
function renderSuitPicker(id,visible,onPick){
  const el=$(id);el.classList.toggle('hidden',!visible);
  if(!visible){el.innerHTML='';return;}
  el.innerHTML=SUITS.map(s=>`<button class="${s==='♥'||s==='♦'?'red':''}" data-suit="${s}">${s} ${suitName(s)}</button>`).join('');
  el.querySelectorAll('[data-suit]').forEach(btn=>btn.onclick=()=>onPick(btn.dataset.suit));
}
function toggleSuitMagic(){
  const b=G.battle;if(!b||b.over||b.busy||b.pendingBust||b.suitChanges<=0||skillIsLocked('suitmage'))return;
  b.suitMode=!b.suitMode;b.suitSelected=null;b.discardMode=false;renderHand();updateDiscardBtn();updateSuitMagicBtn();
}
function changeBattleSuit(suit){
  const b=G.battle,c=b&&b.hand[b.suitSelected];if(!c||!SUITS.includes(suit)||b.suitChanges<=0||skillIsLocked('suitmage'))return;
  const old=c.s;c.s=suit;c.red=suit==='♥'||suit==='♦';b.suitChanges--;b.suitMode=false;b.suitSelected=null;
  log(`🎭 花色魔術：${cardLabel(c)}${old} → ${cardLabel(c)}${suit}`,'good');renderHand();updateHandUI();updateSuitMagicBtn();
}
function updateSuitMagicBtn(){
  const b=G.battle,btn=$('btn-suitmagic');
  if(!b||!ownsP('suitmage')){btn.classList.add('hidden');$('battle-suit-picker').classList.add('hidden');return;}
  btn.classList.remove('hidden');btn.textContent=skillIsLocked('suitmage')?'🔒 花色魔術被封鎖':(b.suitMode?'🎭 選擇手牌（按此取消）':`🎭 花色魔術（剩 ${b.suitChanges}）`);
  btn.disabled=b.over||b.busy||b.pendingBust||b.suitChanges<=0||skillIsLocked('suitmage');
  if(!b.suitMode)renderSuitPicker('battle-suit-picker',false,()=>{});
}
function syncButtons(){
  const b=G.battle;
  $('btn-hit').disabled=b.over||b.busy||b.pendingBust||(b.hesitated&&b.hits>=hesitationLimit());
  $('btn-stand').disabled=b.over||b.busy;
  $('btn-defend').disabled=b.over||b.busy||b.pendingBust||handTotal(b.hand)>21||bloodDescendantActive();
  $('btn-defend').textContent=bloodDescendantActive()?'🩸 血魔契約：無法防禦':'防禦 Defend';
  updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();
}

function updateRedrawBtn(){
  const b=G.battle;if(!b){return;}
  if(!ownsP('redraw')){$('btn-redraw').classList.add('hidden');return;}
  $('btn-redraw').classList.remove('hidden');
  $('btn-redraw').textContent=skillIsLocked('redraw')?'🔒 重抽被封鎖':`重抽手牌（剩 ${b.redrawsLeft}）`;
  $('btn-redraw').disabled=b.over||b.busy||b.redrawsLeft<=0||skillIsLocked('redraw');
}
function updatePeekBtn(){
  const b=G.battle;if(!b){return;}
  if(!ownsP('peek')){$('btn-peek').classList.add('hidden');return;}
  $('btn-peek').classList.remove('hidden');
  $('btn-peek').textContent=skillIsLocked('peek')?'🔒 透視被封鎖':`透視（剩 ${b.peeksLeft}）`;
  $('btn-peek').disabled=b.over||b.peeksLeft<=0||skillIsLocked('peek');
}

function updateOutgoing(){
  if(!G.battle){$('outgoing').textContent='';return;}
  const b=G.battle;
  if(!b.hand.length){$('outgoing').textContent='';return;}
  const t=handTotal(b.hand);
  const busted=t>21;
  const {dmg}=computeDamage(b.hand,busted);
  const tgt=currentTarget();
  const shieldDef=busted||bloodDescendantActive()?0:bucklerDefense();
  const projDef=busted||bloodDescendantActive()?0:computeDefense(b.hand)+shieldDef;
  const shieldStr=bloodDescendantActive()?'（血魔契約禁止防禦）':shieldDef>0?`（含圓盾 +${shieldDef}）`:'';
  const fdStr=(hasP('dragonneck')&&!busted&&b.hand.length>=5)?'（🐉五龍！再回 HP）':'';
  let txt;
  if(busted&&dmg===0) txt='🗡 爆牌：造成 0 傷害，無法防禦';
  else if(busted) txt=`🗡 爆牌：保險造成 ${dmg} 傷害，無法防禦`;
  else if(tgt&&ghostInvincible(tgt)) txt=`🗡 攻擊 ${dmg}${fdStr}（${tgt.name}無敵會擋） ｜ 🛡 防禦 ${projDef}${shieldStr}`;
  else txt=`🗡 攻擊 ${dmg}${fdStr} ｜ 🛡 防禦 ${projDef}${shieldStr}`;
  if(G.battle.intimidated){
    if(hasP('antidote')&&isUp('antidote'))txt+='（✨淨化：免疫震攝）';
    else if(hasP('antidote'))txt+='（✨淨化：震攝減輕為 −25%）';
    else txt+='（🐻被震攝 −50%）';
  }
  $('outgoing').textContent=txt;
}

function hit(){
  const b=G.battle;if(b.over||b.busy||b.pendingBust)return;
  if(b.hesitated&&b.hits>=hesitationLimit())return;
  b.hits++;b.discardMode=false;b.suitMode=false;b.suitSelected=null;
  b.busy=true;syncButtons();
  const c=b.deck.pop();b.hand.push(c);SFX.draw();
  const card=document.createElement('div');
  card.className='card dealing'+(c.red?' red':'');
  card.innerHTML=`<div class="v">${cardLabel(c)}</div><div class="s">${c.s}</div>`;
  $('pl-cards').appendChild(card);
  log(`抽到 ${cardLabel(c)}${c.s}`,'hit');updateHandUI();
  setTimeout(()=>{
    b.busy=false;
    if(handTotal(b.hand)>21){
      if(hasP('redraw')&&isUp('redraw')&&b.redrawsLeft>0){
        b.pendingBust=true;
        log('💥 爆牌！可用「重抽」救牌，或按「停牌」接受爆牌。','dmg');
        syncButtons();
      } else resolveBust();
    } else syncButtons();
  },300);
}

function computeDamage(hand,busted){
  if(busted&&!hasP('insurance'))return {dmg:0,notes:[]};
  const insN=isUp('insurance')?3:2;
  let dmg=busted?handTotal(hand.slice(0,insN)):handTotal(hand);
  const notes=[];
  if(!busted&&hasP('doublebet')){const v=isUp('doublebet')?12:8;dmg+=v;notes.push(`豪賭基礎+${v}`);}
  if(hasP('aceboost')){const a=hand.filter(c=>c.r==='A').length;if(a){const v=isUp('aceboost')?8:6;dmg+=v*a;notes.push(`A強化+${v*a}`);}}
  if(hasP('facemult')){const f=hand.filter(c=>['J','Q','K'].includes(c.r)).length;if(f){const v=isUp('facemult')?4:3;dmg+=v*f;notes.push(`面牌+${v*f}`);}}
  if(!busted&&hasP('firststrike')&&G.battle&&G.battle.round===1){
    const t=handTotal(hand),ok=isUp('firststrike')?hand.length<=3&&t>=19&&t<=21:hand.length===2&&t===20;
    if(ok){const v=isUp('firststrike')?30:20;dmg+=v;notes.push(`⚔️先發+${v}`);}
  }
  if(!busted&&hasP('straight')){
    const run=longestStraight(hand);if(run>=3){const v=isUp('straight')?(run>=4?40:24):18;dmg+=v;notes.push(`🔗連號+${v}`);}
  }
  if(!busted&&hasP('court')&&hasCourt(hand)){const v=isUp('court')?50:35;dmg+=v;notes.push(`👑宮廷+${v}`);}
  if(!busted&&hasP('spadeart')){const n=effectiveSuitCount(hand,'♠');if(n){const v=isUp('spadeart')?3:2;dmg+=n*v;notes.push(`♠穿刺+${n*v}`);}}
  if(!busted&&hasP('safe21')&&handTotal(hand)>=17){const v=isUp('safe21')?8:5;dmg+=v;notes.push('安全線+'+v);}
  if(!busted&&handTotal(hand)===21){dmg=Math.round(dmg*1.5);notes.push('21點×1.5');}
  if(hasP('doublebet')&&!busted&&handTotal(hand)%2===1){const m=gambleMultiplier(handTotal(hand));dmg=Math.round(dmg*m);notes.push('豪賭單數×'+m);}
  if(!busted&&hasP('dragonneck')&&hand.length>=5){let bonus=50;if(isUp('dragonneck'))bonus+=Math.round(handTotal(hand)*0.5);dmg+=bonus;notes.push('🐉五龍+'+bonus);}
  if(!busted&&hasP('echelon')){const extra=hand.length-2;if(extra>0){const b=fact(extra+(isUp('echelon')?1:0));dmg+=b;notes.push('📈階層+'+b);}}
  if(!busted&&G.battle&&G.battle.focus>0){dmg+=G.battle.focus;notes.push('⚡蓄勢+'+G.battle.focus);}
  if(G.battle&&G.battle.intimidated){
    const m=intimidationMult();
    dmg=Math.round(dmg*m);
    if(m===1)notes.push('✨淨化免疫震攝');
    else if(m===0.75)notes.push('✨震攝減輕−25%');
    else notes.push('🐻震攝−50%');
  }
  if(!busted&&activeSuitMastery()==='four_suits'&&hasFourSuits(hand)){dmg+=40;notes.push('🧭四象+40');}
  else if(!busted&&activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4){dmg=Math.round(dmg*2);notes.push('🌊同花×2');}
  else if(!busted&&activeSuitMastery()==='alternating'){
    const bonus=alternationCount(hand)*12;if(bonus){dmg+=bonus;notes.push(`🌓交替+${bonus}`);}
  }else if(!busted&&activeSuitMastery()==='mono'&&monoHandActive(hand)){dmg=Math.round(dmg*1.5);notes.push('🎨純色×1.5');}
  if(!busted&&lastStandActive()){
    const m=bloodDescendantActive()?1.8:isUp('laststand')?1.6:1.5;dmg=Math.round(dmg*m);notes.push(`🔥背水×${m}`);
  }
  if(!busted&&hasP('bulwark')&&isUp('bulwark')&&G.battle){
    const excess=Math.max(0,G.battle.defense-incomingTotal()),steps=Math.min(6,Math.floor(excess/10));
    if(steps>0){const m=1+steps*0.1;dmg=Math.round(dmg*m);notes.push(`🏰堡壘反攻×${m.toFixed(1)}`);}
  }
  if(!busted&&hasP('bountyhunter')&&G.bountyHunt&&G.bountyHunt.bonuses.length){const v=G.bountyHunt.bonuses[0];dmg+=v;notes.push(`💰賞金獵人+${v}`);}
  if(!busted&&bloodDescendantActive()&&G.battle&&G.battle.bloodDamageStacks>0){const m=descendantDamageMultiplier();dmg=Math.round(dmg*m);notes.push(`🩸後裔血性×${m.toFixed(2)}`);}
  return {dmg,notes};
}

function computeDefense(hand){
  const b=G.battle,t=handTotal(hand);
  if(t>21)return 0;
  const heartRate=hasP('heartguard')?(isUp('heartguard')?0.5:0.3):0;
  const repeatPenalty=Math.max(0.4,1-(b.guardStreak||0)*0.2);
  let def=Math.floor((t*(0.65+heartRate)+(hasP('clubstance')?effectiveSuitCount(hand,'♣')*(isUp('clubstance')?4:3):0))*repeatPenalty);
  if(hasP('straight')){const run=longestStraight(hand);if(run>=3)def+=isUp('straight')?(run>=4?40:24):18;}
  if(hasP('court')&&isUp('court')&&hasCourt(hand))def+=25;
  if(activeSuitMastery()==='four_suits'&&hasFourSuits(hand))def+=40;
  else if(activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4)def*=2;
  else if(activeSuitMastery()==='alternating')def+=alternationCount(hand)*12;
  else if(activeSuitMastery()==='mono'&&monoHandActive(hand))def=Math.round(def*1.5);
  if(lastStandActive()&&!isUp('laststand'))def=Math.floor(def*0.8);
  return Math.max(1,Math.floor(def));
}

function applyHeartEcho(hand){
  const b=G.battle;if(!hasP('heartecho')||!b||b.heartEchoes<=0)return;
  const n=effectiveSuitCount(hand,'♥');if(n<=0)return;
  const result=combatHeal(n*4);b.heartEchoes--;
  log(`♥ 紅心回響：回復 ${result.healed} HP${result.mult<1?`（腐敗後）`:''}（剩 ${b.heartEchoes} 次）`,'good');renderTop();
}

function resolveBust(){
  const b=G.battle,lostFocus=b.focus||0;
  b.pendingBust=false;b.guardStreak=0;b.focus=0;SFX.bust();log('💥 爆牌！','dmg');
  if(lostFocus>0)log(`⚡ 蓄勢潰散：失去 ${lostFocus} 點蓄勢。`,'dmg');
  let {dmg,notes}=computeDamage(b.hand,true);
  if(dmg>0){log(`保險生效，仍造成 ${dmg} 傷害`+(notes.length?`（${notes.join('，')}）`:''),'good');attackEnemy(dmg,{busted:true});}
  else log('本回合攻擊無效。');
  if(applyGamblePenalty(handTotal(b.hand),true))return;
  eagleRecoverEvasion('爆牌');
  endPlayerTurn();
}

function attack(){
  const b=G.battle;if(b.over||b.busy)return;
  if(b.pendingBust){resolveBust();return;}
  const t=handTotal(b.hand);
  const fiveDragon=hasP('dragonneck')&&b.hand.length>=5;
  let {dmg,notes}=computeDamage(b.hand,false);
  b.guardStreak=0;
  log(`🗡 選擇攻擊，點數 ${t}`+(notes.length?`（${notes.join('，')}）`:''));
  applyHeartEcho(b.hand);
  b.focus=0;
  if(fiveDragon)log('🐉 龍頭項鍊·五龍！五張不爆觸發！','gd');
  const attackedTarget=currentTarget(),dealt=attackEnemy(dmg);
  if(dealt>0)applyToxicology(attackedTarget,b.hand);
  if(dealt>0&&bloodDescendantActive()){
    const gained=addSepsis(attackedTarget,1);if(gained>0)log(`🦠 後裔攻擊：${attackedTarget.name} 敗血 +${gained}（目前 ${attackedTarget.sepsis}/5 層）。`,'good');
  }
  if(dealt>0&&hasP('bountyhunter')&&b.bountyHuntActive&&G.bountyHunt&&G.bountyHunt.bonuses.length){
    const used=G.bountyHunt.bonuses.shift();log(`💰 賞金獵人加成 +${used} 已消耗。`,'gd');
    if(!G.bountyHunt.bonuses.length)G.bountyHunt=null;
  }
  if(hasP('vampire')&&dealt>0){const baseRate=bloodDescendantActive()?0.5:isUp('vampire')?0.3:0.2,sepsis=sepsisMultiplier(attackedTarget),rate=baseRate*thirstMultiplier()*sepsis,result=combatHeal(Math.round(dealt*rate));log(`吸血賭注（${Math.round(rate*100)}%${bloodDescendantActive()?'，後裔基礎 50%':''}${thirstMultiplier()>1?'，渴血 ×1.5':''}${sepsis>1?`，敗血 +${Math.round((sepsis-1)*100)}%`:''}）：回復 ${result.healed} HP${result.mult<1?'（腐敗後）':''}`,'good');}
  if(fiveDragon){let heal=50;if(isUp('dragonneck'))heal+=Math.round(t*0.2);const result=combatHeal(heal);log(`🐉 五龍回復 ${result.healed} HP${result.mult<1?'（腐敗後）':''}`,'good');renderTop();}
  if(applyGamblePenalty(t,false))return;
  endPlayerTurn();
}

function defend(){
  const b=G.battle;if(b.over||b.busy||b.pendingBust)return;
  if(bloodDescendantActive()){log('📜 血魔後裔的血魔契約使你無法選擇防禦。','dmg');syncButtons();return;}
  const t=handTotal(b.hand),gambleMult=gambleMultiplier(t),fractureMult=fractureMultiplier(b);
  const def=Math.floor(computeDefense(b.hand)*gambleMult*fractureMult);
  const shield=useBuckler();
  shield.def=Math.round(shield.def*gambleMult*fractureMult);
  const clubBonus=hasP('clubstance')&&effectiveSuitCount(b.hand,'♣')>=3?(isUp('clubstance')?8:5):0;
  const focusGain=Math.ceil((def+shield.def)*BALANCE.focusRate)+clubBonus;
  b.defense+=def+shield.def;b.guardStreak++;
  b.focus=Math.min(BALANCE.focusCap,b.focus+focusGain);
  SFX.shield();
  const penalty=b.guardStreak>1?`（連續防禦效率降低）`:'';
  const shieldNote=shield.def>0?`、圓盾 +${shield.def}`:'';
  applyHeartEcho(b.hand);
  const gambleNote=hasP('doublebet')&&t%2===1?`（🎲豪賭單數×${gambleMult}）`:'';
  const fractureNote=b.fracture>0?`（🦴斷骨 −${b.fracture*15}%）`:'';
  log(`🛡 選擇防禦：獲得 ${def} 防禦${shieldNote}、蓄勢 +${focusGain}（目前 ${b.focus}）${clubBonus?`（♣架勢額外 +${clubBonus}）`:''}${gambleNote}${fractureNote}${penalty}`,'good');
  if(shield.broke)log('🛡 圓盾耐久耗盡，本次防禦後損毀！','dmg');
  if(applyGamblePenalty(t,false))return;
  eagleRecoverEvasion('選擇防禦');
  endPlayerTurn();
}

function attackEnemy(dmg,opts={}){
  const e=currentTarget();if(!e)return 0;
  if(ghostInvincible(e)){
    SFX.shield();log(`${e.name} 處於無敵回合，攻擊被擋下！`,'dmg');floatNum(e.idx,'🛡️','#bfe6ff');return 0;
  }
  if(e.type==='eagle'){
    const total=handTotal(G.battle.hand),dodged=e.evasion>0&&(opts.busted||total<=16);
    if(dodged){
      e.evasion--;activateEagleDive(e);SFX.shield();
      log(`💨 ${e.name}消耗 1 層閃避躲開攻擊！下一次行動改為俯衝反擊。`,'dmg');floatNum(e.idx,'閃避','#bfe6ff');renderEnemies();return 0;
    }
    if(!opts.busted&&total>=20&&total<=21){
      e.evasion=0;e.broken=2;e.weakened=true;e.nextDmg=Math.max(1,Math.round((e.nextDmg||0)*0.75));
      log(`🪶 ${total} 點命中！${e.name}折翼：清除全部閃避，本回合攻擊 −25%。`,'gd');
    }else if(!opts.busted&&total>=17&&total<=19&&e.evasion>0){
      e.evasion--;log(`🎯 ${total} 點鎖定高速目標：命中並清除 1 層閃避。`,'good');
    }
  }
  if(e.type==='robot'&&e.robotAction==='cool'&&dmg>0){dmg=Math.round(dmg*1.4);log('❄️ 過熱弱點：對機器人最終傷害 ×1.4！','gd');}
  if(e.type==='cultist'&&e.cultistAction==='prayer'&&!livingGargoyle()&&dmg>0){dmg=Math.round(dmg*1.3);log('🕯 反噬祈禱：對邪教徒最終傷害 ×1.3！','gd');}
  if(e.type==='zombie'&&e.downed){
    const threshold=zombieFinishThreshold(G.floor),total=handTotal(G.battle.hand);
    const finished=!opts.busted&&(dmg>=threshold||total===20||total===21);
    if(finished){
      e.curhp=0;e.downed=false;e.deadPermanent=true;SFX.crit();
      log(`💥 成功補刀！${e.name}被永久處決。`,'gd');floatNum(e.idx,'處決','#ffd24a');ensureTarget();renderEnemies();return Math.max(0,dmg);
    }
    log(opts.busted?`💥 爆牌保險無法處決倒地殭屍！`:`🧟 補刀失敗：需要 ${threshold} 傷害，或使用 20／21 點手牌。`,'dmg');
    renderEnemies();return 0;
  }
  const rawDmg=dmg;
  if((e.shield||0)>0&&dmg>0){
    const shieldBefore=e.shield;
    const spades=hasP('spadeart')?effectiveSuitCount(G.battle.hand,'♠'):0;
    const pierce=spades>=3?(isUp('spadeart')?1:0.5):0;
    const effectiveShield=Math.round(e.shield*(1-pierce));
    const blocked=Math.min(effectiveShield,dmg);e.shield=Math.max(0,e.shield-blocked);dmg-=blocked;SFX.shield();
    log(`🛡 ${e.name}的護盾抵擋 ${blocked} 傷害${pierce?`（♠無視 ${Math.round(pierce*100)}% 護盾）`:''}${dmg>0?`，穿透 ${dmg}`:'，完全擋下'}。`,'dmg');
    if(e.type==='paladin'&&e.paladinAction==='judgment'&&shieldBefore>0&&e.shield===0){e.judgmentInterrupted=true;log('💥 聖盾被完全打破，神聖裁決中斷！','gd');}
  }
  if(e.type==='gargoyle'&&dmg>0&&G.battle.lockedSkill){
    const total=handTotal(G.battle.hand),threshold=gargoyleUnlockThreshold(G.floor);
    if(canBreakGargoyleLock(total,dmg,opts.busted))releaseGargoyleLocks();
    else log(`🔒 石像封鎖未破：需 20／21 點，或單次對本體造成 ${threshold} 傷害（本次 ${dmg}）。`,'dmg');
  }
  if(e.type==='cultist'&&e.hasStolen&&!opts.busted&&dmg>0){
    const total=handTotal(G.battle.hand),threshold=cultistReclaimThreshold(G.floor);
    if(total===20||total===21||dmg>=threshold){cultistRestoreUpgrade(e,'奪回');e.cultStep=3;e.cultistAction='prayer';e.reclaimPause=true;e.nextDmg=0;log(livingGargoyle()?'✨ 儀式被擊破！邪教徒本回合失去行動，這次無法強化石像鬼。':'✨ 儀式被擊破！邪教徒本回合失去行動，下一回合進入反噬祈禱。','gd');}
  }
  if(e.type==='cyclops'&&e.cyclopsAction==='gaze'&&!opts.busted&&dmg>0){
    const total=handTotal(G.battle.hand);
    if(total>=18&&total<=21){e.eyeInterrupted=true;log(`👁️ ${total} 點命中獨眼！${e.name}的粉碎重擊已被中斷。`,'gd');}
  }
  if(e.type==='skeleton'&&(e.boneArmor||0)>0&&dmg>0){
    const total=handTotal(G.battle.hand),sg=skeletonGrowth(G.floor);
    if(!opts.busted&&(total===20||total===21)){
      const shattered=e.boneArmor;e.boneArmor=0;SFX.crit();
      log(`💥 ${total} 點粉碎 ${e.name}全部 ${shattered} 層骨甲，本次攻擊不受減傷！`,'gd');
    }else{
      const before=dmg;e.boneArmor--;
      dmg=Math.max(1,Math.round(dmg*(1-sg.damageReduction)));
      log(`🦴 ${e.name}消耗 1 層骨甲，使傷害降低 ${before-dmg}（剩餘 ${e.boneArmor} 層）。`,'dmg');
    }
  }
  const hpBeforeHit=e.curhp;
  e.curhp-=dmg;
  if(e.type==='demon'&&dmg>0&&e.bloodLockArmed&&(e.bloodLockUses||0)<1&&hpBeforeHit>=e.maxhp*.15&&e.curhp<e.maxhp*.03){
    const lockedHp=Math.max(1,Math.ceil(e.maxhp*.03));
    e.curhp=lockedHp;e.bloodLockUses=(e.bloodLockUses||0)+1;e.bloodLockArmed=false;
    log(`🩸 鮮血鎖命：HP 鎖在 ${lockedHp}；本場唯一一次鎖血已消耗。`,'dmg');
  }
  const bleedHit=triggerBleed(e,dmg);
  if(bleedHit.damage>0)e.curhp-=bleedHit.damage;
  if(e.type==='dragon'&&e.dragonAction==='sleep'&&rawDmg>0){
    e.wakeNext=true;e.wakeShockPending=true;log('💢 魔龍受到攻擊，將在下回合甦醒並施加震攝！','dmg');
  }
  if(e.type==='dragon'&&e.dragonAction==='breath'&&dmg>=dragonGrowth(G.floor).interrupt){
    e.breathInterrupted=true;log(`💥 傷害達到 ${dmg}，魔龍的龍息被中斷！`,'gd');
  }
  if(dmg>0){
    dmg>=20?SFX.crit():SFX.hit();
    log(`對 ${e.name} 造成 ${dmg} 傷害！`,'good');
    floatNum(e.idx,'-'+dmg,'#ffd24a');
    const el=$('enemy-'+e.idx);if(el){el.classList.add('hurt');setTimeout(()=>el.classList.remove('hurt'),360);}
  }
  if(bleedHit.damage>0){log(`🩸 ${e.name}流血發作：額外 −${bleedHit.damage} HP，降為 ${bleedHit.remaining} 層。`,'good');floatNum(e.idx,'-'+bleedHit.damage,'#e45c73');}
  if(e.curhp<=0){
    const total=handTotal(G.battle.hand),directExecution=e.type==='zombie'&&!opts.busted&&(total===20||total===21);
    if(e.type==='zombie'&&!e.revived&&!directExecution){
      e.curhp=1;e.downed=true;e.downedRound=G.battle.round;e.nextDmg=0;
      log(`🧟 ${e.name}倒地但尚未死亡！下回合需造成 ${zombieFinishThreshold(G.floor)} 傷害，或以 20／21 點處決。`,'dmg');
    }else{
      if(e.type==='zombie'&&directExecution)log(`🎯 20／21 點命中要害，${e.name}無法復活！`,'gd');
      log(`${e.name} 被擊倒！`,'good');ensureTarget();
    }
  }
  if(e.type==='gargoyle'&&e.curhp<=0){
    const cultists=G.battle.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>x.curhp=0);
    if(G.battle.stolenUpgrade)cultistRestoreUpgrade(null,'歸還');G.battle.lockedSkill=null;
    if(cultists.length)log(`🗿 石像鬼崩毀，儀式斷裂！${cultists.length} 名邪教徒隨之死亡。`,'gd');ensureTarget();
  }
  if(e.type==='cultist'&&e.curhp<=0){
    if(G.battle.stolenUpgrade&&G.battle.stolenBy===e.idx)cultistRestoreUpgrade(e,'歸還');
    reviveCultistsFromGargoyleShield(G.battle.enemies.find(x=>x.type==='gargoyle'&&x.curhp>0));
  }
  renderEnemies();
  return Math.max(0,dmg);
}

function defeatEnemyByPoison(e){
  const b=G.battle;
  if(e.type==='zombie'&&!e.revived){
    e.curhp=1;e.downed=true;e.downedRound=b.round;e.nextDmg=0;
    log(`☠ ${e.name}被毒倒但尚未死亡！下回合仍可補刀。`,'dmg');
    return;
  }
  e.curhp=0;log(`☠ ${e.name}被中毒擊倒！`,'good');
  if(e.type==='gargoyle'){
    const cultists=b.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>x.curhp=0);
    if(b.stolenUpgrade)cultistRestoreUpgrade(null,'歸還');b.lockedSkill=null;
    if(cultists.length)log(`🗿 石像鬼被毒蝕崩毀，${cultists.length} 名邪教徒隨之死亡。`,'gd');
  }
  if(e.type==='cultist'){
    if(b.stolenUpgrade&&b.stolenBy===e.idx)cultistRestoreUpgrade(e,'歸還');
    reviveCultistsFromGargoyleShield(b.enemies.find(x=>x.type==='gargoyle'&&x.curhp>0));
  }
  ensureTarget();
}
function triggerEnemyPoison(){
  const b=G.battle;
  b.enemies.filter(e=>e.curhp>0&&!e.downed&&(e.poison||0)>0).forEach(e=>{
    const damage=e.poison;e.curhp-=damage;SFX.poison();
    log(`☠ ${e.name}中毒發作：−${damage} HP`,'good');floatNum(e.idx,`-${damage}`,'#8ee063');
    if(e.curhp<=0)defeatEnemyByPoison(e);
  });
  renderEnemies();
  return b.enemies.every(e=>e.curhp<=0);
}

function endPlayerTurn(){
  const b=G.battle;b.busy=true;syncButtons();renderEnemies();
  if(b.enemies.every(e=>e.curhp<=0)){winBattle();return;}
  setTimeout(()=>{
    b.intimidated=false;b.hesitated=false; // 上一回合的震攝/遲疑已於本回合消耗
    if(b.burn>0){
      const burn=tickBurnStatus(b);losePlayerHp(burn.damage);
      SFX.hurt();log(`🔥 燒傷發作：−${burn.damage} HP${burn.decays?`，自然降為 ${burn.remaining} 層`:`；層數維持 ${burn.remaining}（下次發作後自然 −1）`}。`,'dmg');
    }
    if(b.burn>0&&hasP('antidote')){const r=Math.min(b.burn,isUp('antidote')?b.burn:2);b.burn=Math.max(0,b.burn-r);if(b.burn===0)b.burnTicks=0;log(`✨ 淨化：燒傷 −${r} 層`,'good');}
    if(G.poison>0){
      const pd=G.poison;losePlayerHp(pd);SFX.poison();
      log(`☠ 中毒發作：−${pd} HP`,'dmg');
      if(hasP('antidote')){const r=isUp('antidote')?2:1;G.poison=Math.max(0,G.poison-r);log(`✨ 淨化：中毒 −${r} 層`,'good');}
    }
    if(b.corruption>0&&hasP('antidote')){const r=isUp('antidote')?2:1;b.corruption=Math.max(0,b.corruption-r);log(`✨ 淨化：腐敗 −${r} 層`,'good');}
    if(b.sepsis>0&&hasP('antidote')){const r=Math.min(b.sepsis,isUp('antidote')?2:1);b.sepsis=Math.max(0,b.sepsis-r);log(`✨ 淨化：敗血 −${r} 層`,'good');}
    if(b.bleed>0&&hasP('antidote')){const r=Math.min(b.bleed,isUp('antidote')?b.bleed:2);b.bleed=Math.max(0,b.bleed-r);log(`✨ 淨化：流血 −${r} 層`,'good');}
    if(b.fracture>0&&hasP('antidote')){const r=Math.min(b.fracture,isUp('antidote')?2:1);b.fracture=Math.max(0,b.fracture-r);log(`✨ 淨化：斷骨 −${r} 層`,'good');}
    if(G.hp<=0){renderTop();gameOver();return;}
    if(triggerEnemyPoison()){winBattle();return;}
    let total=0,armorBonus=0,zombieBitesHit=0,robotFireHits=0,willIntimidate=false,willHesitate=false,willSteal=false,cyclopsSmash=false,bloodExamAttacked=false;
    const batEvents=[];
    b.enemies.filter(e=>e.curhp>0).forEach(e=>{
      if(e.type==='zombie'&&e.downed){
        if(b.round>e.downedRound){
          reviveZombie(e);
          log(`🧟 ${e.name}以 ${e.curhp} HP 復活！攻擊節奏重置，下一回合從抓擊開始。`,'dmg');
        }else log(`💀 ${e.name}倒地，本回合不會行動；下一回合是補刀機會。`,'good');
        return;
      }
      if(e.type==='skeleton'&&e.skeletonAction==='guard'){
        const sg=skeletonGrowth(G.floor),before=e.boneArmor||0;
        if(before<sg.maxArmor){e.boneArmor=Math.min(sg.maxArmor,before+sg.recover);log(`🦴 ${e.name}進入骨盾架勢，骨甲恢復 ${e.boneArmor-before} 層（目前 ${e.boneArmor}/${sg.maxArmor}）。`,'dmg');}
        else{e.boneRage=true;log(`💀 ${e.name}的骨甲已滿，蓄積殺意：下一次攻擊 ×${sg.rageMult}！`,'dmg');}
        e.skeletonStep++;return;
      }
      if(e.type==='cyclops'&&e.cyclopsAction==='gaze'){
        if(e.eyeInterrupted){e.eyeInterrupted=false;e.cyclopsStep=0;log(`👁️ ${e.name}獨眼受創，粉碎重擊中斷並重置攻擊節奏！`,'good');}
        else{e.cyclopsStep++;log(`👁️ ${e.name}凝視鎖定目標，下一回合將發動粉碎重擊！`,'dmg');}
        return;
      }
      if(e.type==='paladin'&&e.paladinAction==='guard'){
        const pg=paladinGrowth(G.floor),before=e.shield||0;e.shield=Math.max(before,pg.shield);e.judgmentInterrupted=false;e.paladinStep++;
        const dispelled=paladinDispel(e);
        const next=paladinAction(e,G.floor),followup=next==='judgment'?'；下回合準備神聖裁決':'；攻擊節奏重新循環';
        log(`✝️ ${e.name}施放聖盾，護盾 ${before} → ${e.shield}${dispelled.length?`，驅散 ${dispelled.join('、')}`:''}${followup}。`,'dmg');return;
      }
      if(e.type==='paladin'&&e.paladinAction==='judgment'&&e.judgmentInterrupted){
        e.judgmentInterrupted=false;e.paladinStep=0;log(`💥 ${e.name}的聖盾已破，神聖裁決中斷並重置攻擊節奏！`,'good');return;
      }
      if(e.type==='robot'&&e.robotAction==='charge'){log(`⚡ ${e.name}進行電力充能，本回合沒有攻擊。`,'dmg');e.robotStep++;return;}
      if(e.type==='robot'&&e.robotAction==='cool'){e.shield=0;log(`❄️ ${e.name}過熱冷卻，本回合沒有攻擊。`,'good');e.robotStep++;return;}
      if(e.type==='cultist'&&e.cultistAction==='prayer'){
        if(e.reclaimPause){e.reclaimPause=false;log('✨ 邪教徒因儀式被擊破，本回合無法行動。','good');return;}
        const gargoyle=livingGargoyle();
        if(gargoyle){
          const power=gargoyleGrowth(G.floor).prayerPower;gargoyle.gargoylePower=(gargoyle.gargoylePower||0)+power;
          log(`🕯 ${e.name}讚頌石像：石像鬼永久攻擊 +${Math.round(power*100)}%（累積 +${Math.round(gargoyle.gargoylePower*100)}%）！`,'dmg');
        }else log('🕯 邪教徒進入反噬祈禱，本回合沒有攻擊。','good');
        e.cultStep=0;cultistStealUpgrade(e);return;
      }
      if(e.type==='gargoyle'&&e.gargoyleAction==='guard'){
        const gg=gargoyleGrowth(G.floor);e.shield=(e.shield||0)+gg.bossShield;
        b.enemies.filter(x=>x.type==='cultist'&&x.curhp>0).forEach(x=>x.shield=Math.max(x.shield||0,gg.cultShield));
        const locked=lockRandomSkill();
        log(`🗿 ${e.name}施放石像守護：永久護盾 +${gg.bossShield}（目前 ${e.shield}），存活邪教徒獲得 ${gg.cultShield} 護盾${locked?`，並封鎖「${locked.name}」`:''}。`,'dmg');
        updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();renderTop();
        reviveCultistsFromGargoyleShield(e);e.gargStep++;return;
      }
      if(witchPoisonTurn(e)){G.poison+=2;SFX.poison();log(`${e.name} 第5回合施放劇毒，附加 2 層中毒！`,'dmg');return;}
      if(e.type==='dragon'){
        if(e.dragonAction==='sleep'){
          log(e.wakeNext?'💤 魔龍被驚醒，這回合仍未行動；下回合進入戰鬥！':'💤 魔龍仍在沉睡…','good');
          if(e.wakeNext){e.sleepTurns=0;e.wakeNext=false;if(e.wakeShockPending){e.wakeShockPending=false;applyDragonIntimidation('驚醒咆哮');}}else e.sleepTurns=Math.max(0,(e.sleepTurns||0)-1);
          return;
        }
        if(e.dragonAction==='breath'){
          if(e.breathInterrupted)log('💨 龍息中斷，魔龍本回合無法攻擊！','good');
          else{const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;log(`🔥 魔龍噴吐龍息，造成 ${d} 傷害！`,'dmg');}
          e.shield=0;e.breathInterrupted=false;e.dragonStep=(e.dragonStep||0)+1;
          return;
        }
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;
        log(`🐲 魔龍普攻，造成 ${d} 傷害`,'dmg');
        if(e.dragonAction==='ward'){
          const shield=dragonGrowth(G.floor).shieldAmount;e.shield=Math.max(e.shield||0,shield);
          log(`🛡 魔龍為龍息蓄力，展開 ${shield} 點龍盾！`,'dmg');
        }
        e.dragonStep=(e.dragonStep||0)+1;
        return;
      }
      if(e.type==='demon'&&e.demonAction==='sacrifice'){
        const floorHp=Math.ceil(e.maxhp*0.3);
        const cost=Math.min(Math.max(1,Math.round(e.maxhp*0.08)),Math.max(0,e.curhp-floorHp));
        if(cost>0){
          e.curhp-=cost;e.bloodPower=(e.bloodPower||0)+0.15;SFX.hurt();
          log(`🩸 惡魔發動血祭：自損 ${cost} HP，本場攻擊永久 +15%（目前 +${Math.round(e.bloodPower*100)}%）。`,'dmg');
          floatNum(e.idx,`-${cost}`,'#d94b64');
        }
        return;
      }
      if(e.type==='dropbear'){
        if(!dropbearAttacks(b.round)){log(`${e.name} 正在蓄力休息…`);return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;
        G.poison+=2;willIntimidate=true;SFX.poison();
        log(`${e.name} 蓄力後猛撲！造成 ${d} 傷害，並附加中毒與震攝！`,'dmg');
        return;
      }
      const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;
      if(e.bloodExam)bloodExamAttacked=true;
      const wear=armorBreakBonus(e,d,b.defense>0);armorBonus+=wear;
      if(e.type==='ninja'&&e.ninjaAction==='pierce')log(wear>0?`🥷 ${e.name}施展穿刺：造成 ${d} 基礎傷害，並以 30% 破防額外磨損 ${wear} 防禦。`:`🥷 ${e.name}施展穿刺；目前沒有可供破防磨損的防禦，因此只造成 ${d} 傷害。`,'dmg');
      else if(e.type==='eagle'&&e.divePending)log(`🦅 ${e.name}俯衝反擊，造成 ${d} 傷害！`,'dmg');
      else if(e.type==='eagle')log(`🦅 ${e.name}利爪攻擊，造成 ${d} 傷害${e.weakened?'（折翼 −25%）':''}`,'dmg');
      else if(e.type==='robot'&&e.robotAction==='fire'){
        if(total>b.defense)robotFireHits++;
        log(`🔥 ${e.name}火焰噴射，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='robot'&&e.robotAction==='electric'){
        log(`⚡ ${e.name}電弧放電，造成 ${d} 傷害並吸收 ${e.focusAbsorb} 點蓄勢傷害！`,'dmg');
        if(b.focus>0)log(`⚡ 你的 ${b.focus} 點蓄勢被電弧全部清除！`,'dmg');b.focus=0;e.shield=0;
      }
      else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='dark')log(`🌑 ${e.name}施展邪能打擊，造成 ${d} 傷害！`,'dmg');
      else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='sacrifice')log(`🩸 ${e.name}獻祭奪取的強化，造成 ${d} 傷害！`,'dmg');
      else if(e.type==='gargoyle')log(`🗿 ${e.name}利爪攻擊，造成 ${d} 傷害！`,'dmg');
      else if(e.type==='skeleton')log(`💀 ${e.name}${e.boneRage?'施展骨刃強襲':'揮劍斬擊'}，造成 ${d} 傷害${e.boneRage?'（×1.35）':''}！`,'dmg');
      else if(e.type==='bat'){
        batEvents.push({enemy:e,damage:d,drain:e.batAction==='drain'});
        log(e.batAction==='drain'?`🦇 ${e.name}發動吸血撕咬，造成 ${d} 傷害！`:`🦇 ${e.name}撕咬，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='cyclops'){
        cyclopsSmash=e.cyclopsAction==='smash';
        log(cyclopsSmash?`🔨 ${e.name}發動粉碎重擊，造成 ${d} 傷害！`:`🪵 ${e.name}揮舞巨棒，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='paladin'){
        if(e.paladinAction==='judgment')log(`⚔️ ${e.name}發動神聖裁決，造成 ${d} 傷害！`,'dmg');
        else if(e.paladinAction==='sunder')log(wear>0?`💥 ${e.name}施展破甲斬擊：造成 ${d} 基礎傷害，並以 30% 破防額外磨損 ${wear} 防禦。`:`💥 ${e.name}施展破甲斬擊；目前沒有剩餘防禦可供額外磨損，只造成 ${d} 傷害。`,'dmg');
        else log(`🗡️ ${e.name}以聖劍斬擊，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='zombie'&&e.zombieAction==='bite'){
        if(total>b.defense)zombieBitesHit++;
        log(`🧟 ${e.name}腐敗撕咬，造成 ${d} 傷害！`,'dmg');
      }
      else log(`${e.name} 攻擊，造成 ${d} 傷害`,'dmg');
      if(e.type==='zombie')e.zombieStep=(e.zombieStep||0)+1;
      if(e.type==='eagle'){e.divePending=false;e.weakened=false;}
      if(e.type==='robot')e.robotStep=(e.robotStep||0)+1;
      if(e.type==='cultist'){
        if(e.cultistAction==='sacrifice'&&e.hasStolen&&G.battle.stolenUpgrade&&G.battle.stolenBy===e.idx)cultistRestoreUpgrade(e,'歸還');
        e.cultStep=(e.cultStep||0)+1;
      }
      if(e.type==='gargoyle')e.gargStep=(e.gargStep||0)+1;
      if(e.type==='skeleton'){e.skeletonStep=(e.skeletonStep||0)+1;e.boneRage=false;}
      if(e.type==='bat')e.batStep=(e.batStep||0)+1;
      if(e.type==='cyclops')e.cyclopsStep=(e.cyclopsStep||0)+1;
      if(e.type==='paladin')e.paladinStep=(e.paladinStep||0)+1;
      if(bearTurn(e))willIntimidate=true;
      if(platypusTurn(e))willHesitate=true;
      if(e.type==='squirrel'&&b.round===1)willSteal=true;
    });
    b.enemies.filter(e=>e.type==='eagle'&&e.curhp>0&&e.broken>0).forEach(e=>e.broken--);
    if(willIntimidate){
      b.intimidated=true;
      if(hasP('antidote')&&isUp('antidote'))log('✨ 淨化使你免疫震攝！','good');
      else if(hasP('antidote'))log('✨ 淨化減輕震攝：下一回合攻擊力 −25%','good');
      else log('🐻 你被震攝！下一回合攻擊力 −50%','dmg');
    }
    if(willHesitate){
      b.hesitated=true;
      const limit=hesitationLimit();
      log(`🦫 鴨嘴獸讓你遲疑！下一回合最多只能抽 ${limit} 張`,hasP('antidote')?'good':'dmg');
    }
    if(willSteal)squirrelSteal();
    const defenseBefore=b.defense,resolved=resolveDefenseDamage(total,b.defense,armorBonus);
    const {blocked,net,armorWear}=resolved;
    if(b.defense>0)log(`🛡 防禦抵擋 ${blocked} 傷害`+(net>0?`，仍受 ${net}`:'，完全擋下'),'good');
    if(armorWear>0)log(`💥 破防額外磨損 ${armorWear} 防禦；溢出的破防不會傷害 HP。`,'dmg');
    b.defense=resolved.defenseLeft;
    const bleedHit=triggerBleed(b,net);losePlayerHp(net);losePlayerHp(bleedHit.damage);
    if(net>0)SFX.hurt();
    if(bleedHit.damage>0)log(`🩸 流血發作：額外 −${bleedHit.damage} HP，降為 ${bleedHit.remaining} 層。`,'dmg');
    if(bloodExamAttacked&&net>0){const gained=addBleed(b,1);if(gained>0)log(`🩸 血魔考官的攻擊命中 HP：流血 +${gained}（目前 ${b.bleed}/8 層）。`,'dmg');}
    if(cyclopsSmash&&net>0){const gained=addFracture(b,1);if(gained>0)log(`🦴 粉碎重擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3 層，新防禦 −${b.fracture*15}%）。`,'dmg');}
    let batDefense=defenseBefore;
    batEvents.forEach(event=>{
      const blockedForBat=Math.min(event.damage,batDefense),hpDamage=event.damage-blockedForBat;batDefense-=blockedForBat;
      if(!event.drain)return;
      const wanted=batDrainHeal(hpDamage),before=event.enemy.curhp;event.enemy.curhp=Math.min(event.enemy.maxhp,event.enemy.curhp+wanted);
      const healed=event.enemy.curhp-before;
      if(hpDamage<=0)log(`🛡 ${event.enemy.name}的吸血被完全防住，沒有回血。`,'good');
      else log(healed>0?`🩸 ${event.enemy.name}吸血回復 ${healed} HP（實際傷害 ${hpDamage}）。`:`🩸 ${event.enemy.name}成功吸血，但生命已滿。`,'dmg');
    });
    renderTop();
    if(zombieBitesHit>0){
      const before=b.corruption;b.corruption=Math.min(3,b.corruption+zombieBitesHit);const gained=b.corruption-before;
      if(gained>0)log(`🧟 腐敗撕咬傷及 HP：腐敗 +${gained}（目前 ${b.corruption} 層，戰鬥回血 −${b.corruption*20}%）`,'dmg');
    }
    if(robotFireHits>0){const add=robotGrowth(G.floor).burn*robotFireHits;b.burn=Math.min(5,b.burn+add);log(`🔥 火焰傷及 HP：燒傷 +${add}（目前 ${b.burn} 層）`,'dmg');}
    const demon=b.enemies.find(e=>e.type==='demon'&&e.curhp>0);
    if(demon&&demon.demonAction==='drain'){
      const baseRate=demonGrowth(G.floor).drainRate,permanent=demon.permanentThirst===true,thirst=demonThirstActive(demon);
      if(thirst&&!permanent){
        demon.bloodFrenzyUses=(demon.bloodFrenzyUses||0)+1;
        const before=b.sepsis;b.sepsis=Math.min(5,b.sepsis+1);
        if(b.sepsis>before)log(`🦠 血魔進入渴血：敗血 +1（目前 ${b.sepsis}/5 層）`,'dmg');
      }
      const sepsisBefore=b.sepsis,rate=baseRate*(thirst?1.5:1)*sepsisMultiplier(b),guaranteed=Math.round((demon.nextDmg||0)*.25);
      const wanted=Math.max(guaranteed,Math.round(net*rate)),before=demon.curhp;
      demon.curhp=Math.min(demon.maxhp,demon.curhp+wanted);
      const healed=demon.curhp-before;
      log(healed>0?`😈 惡魔吸血效率 ${Math.round(rate*100)}%${permanent?'（永久渴血）':thirst?`（渴血 ${demon.bloodFrenzyUses}/${BALANCE.demonFrenzyUses}）`:''}${sepsisBefore>0?`（敗血 +${sepsisBefore*15}%）`:''}，回復 ${healed} HP${net===0?'（完全防禦保底）':''}`:'😈 惡魔吸取鮮血，但生命已滿。','dmg');
    }
    if(bloodDescendantActive()){
      const selfDamage=Math.max(1,Math.ceil(G.maxhp*0.02));losePlayerHp(selfDamage);SFX.hurt();log(`📜 血魔契約反噬：回合結束自損 ${selfDamage} HP。`,'dmg');
    }
    document.querySelector('.arena').animate(
      [{filter:'brightness(1)'},{filter:'brightness(.5) sepia(.5)'},{filter:'brightness(1)'}],{duration:300});
    if(G.hp<=0){gameOver();return;}
    if(!hasP('bulwark'))b.defense=0;
    b.round++;log(`— 第 ${b.round} 回合 —`);
    const sq=b.enemies.find(e=>e.type==='squirrel'&&e.curhp>0);
    if(sq&&b.round>squirrelEscapeTurns(G.floor)){b.over=true;syncButtons();log('🐿️ 松鼠帶著贓物逃跑了！',"dmg");setTimeout(()=>proceedAfterWin(false),1000);return;}
    rollIntents();renderEnemies();dealNewHand();
  },700);
}

function applyFactionVictory(enemies){
  const cultists=enemies.filter(e=>e.type==='cultist').length,paladins=enemies.filter(e=>e.type==='paladin').length;
  if(!cultists&&!paladins)return;
  const cultistValue=G.churchSeen?20:-5;
  G.faction=(G.faction||0)+cultists*cultistValue-paladins*20;
  if(cultists)log(`🕯 邪教勢力對你的敵意加深${!G.churchSeen?'（尚未接觸教堂，影響較小）':''}。`,'dmg');
  if(paladins)log('⛪ 聖堂勢力對你的敵意加深。','dmg');
}
function winBattle(){
  const b=G.battle;b.over=true;syncButtons();SFX.win();
  applyFactionVictory(b.enemies);
  if(b.bountyHuntActive)G.bountyHunt=null;
  const bossEnemy=b.enemies.find(e=>e.boss),boss=!!bossEnemy;
  if(boss){
    const chance=bossEnemy.type==='demon'?BALANCE.bloodPactDemonChance:BALANCE.bloodPactChance;
    G._bloodPactOffer=!ownsP('bloodpact')&&Math.random()<chance;
  }
  const reward=floorReward(G.floor,boss);
  log(`🏆 第 ${G.floor} 層清除！取得基礎賞金 ${reward} 的挑戰資格`,'gd');
  if(naturalHealingBlocked())log(`📜 ${bloodContractName()}：無法獲得戰後自然回血。`,'dmg');
  else{
    G.hp=Math.min(G.maxhp,G.hp+BALANCE.clearHeal);
    log(`🔥 喘息片刻：回復 ${BALANCE.clearHeal} HP`,'good');
  }
  if(hasP('rubyring')){const h=isUp('rubyring')?15:8;G.hp=Math.min(G.maxhp,G.hp+h);log(`💍 紅寶石戒指：清層回復 ${h} HP`,'good');}
  if(boss&&!naturalHealingBlocked()){G.hp=Math.min(G.maxhp,G.hp+30);log('👑 擊敗魔王，回復 30 HP！','good');}
  renderTop();
  const source=b.eventSource?`event:${b.eventSource}`:'battle';
  setTimeout(()=>startBounty(boss,reward,source),1100);
}
function proceedAfterWin(boss){
  if(boss){G.floor++;G.nodeType=null;G.nodeStarted=false;openUpgrade('boss');return;}
  G.eventChance=Math.min(1,(G.eventChance||BASE_EVENT_CHANCE)+EVENT_CHANCE_STEP);
  advanceNode();
}
//===== 蒐集家：戰後掉牌 =====
function openCardDrop(boss,source='battle'){
  G._dropBoss=boss;G._dropSource=source;
  const n=isUp('collector')?2:1;
  G._drops=[]; for(let i=0;i<n;i++)G._drops.push({card:randomCard(),taken:false});
  show('drop');
  renderDrop();
}
function renderDrop(){
  $('drop-list').innerHTML=G._drops.map((d,i)=>{
    const c=d.card;
    const action=d.taken?'<div class="owned">✓ 已加入牌庫</div>':`<button class="b-buy" data-pick="${i}">撿起加入牌庫</button>`;
    return `<div class="codex-card"><div class="cn" style="font-size:24px;${c.red?'color:#e74c3c':''}">${cardLabel(c)}${c.s}</div>${action}</div>`;
  }).join('');
  $('drop-list').querySelectorAll('button[data-pick]').forEach(btn=>{
    btn.onclick=()=>{const i=+btn.dataset.pick;if(!G._drops[i].taken){G._drops[i].taken=true;G.deck.push(G._drops[i].card);SFX.coin();}renderDrop();};
  });
}
function finishEventBattleReward(source){
  if(source==='event:bloodAltar'){openBloodAltarVictory();return;}
  openUpgrade('event'); // 教堂破壞戰鬥等事件共用的一般獎勵出口
}
function finishDrop(){
  const source=G._dropSource||'battle';
  if(source.startsWith('event:'))finishEventBattleReward(source);else proceedAfterWin(G._dropBoss);
}

function redraw(){
  const b=G.battle;if(b.over||b.busy||b.redrawsLeft<=0||skillIsLocked('redraw'))return;
  b.redrawsLeft--;b.pendingBust=false;
  log('🔄 重抽手牌','hit');updateRedrawBtn();dealNewHand();
}
function peek(){
  const b=G.battle;if(b.over||b.peeksLeft<=0||skillIsLocked('peek'))return;
  b.peeksLeft--;
  const n=isUp('peek')?4:3;
  const top=b.deck.slice(-n).reverse().map(c=>cardLabel(c)+c.s).join('  ');
  log(`👁️ 下${n}張：`+top,'hit');updatePeekBtn();
}

//===== 強化（BOSS 後）=====
function finishBossReward(){G._bloodPactOffer=false;G._upgradeReturn=null;enterCurrentNode();}
function finishUpgradeReward(){
  const route=G._upgradeReturn||'boss';G._upgradeReturn=null;
  if(route==='event'){G._bloodPactOffer=false;completeEvent();return;}
  finishBossReward();
}
function openUpgrade(returnTo=null){
  if(returnTo)G._upgradeReturn=returnTo;else if(!G._upgradeReturn)G._upgradeReturn='boss';
  const cands=G.passives.filter(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return p&&p.descUp&&!G.upgrades.includes(id);});
  const canMaster=hasP('suitmage')&&isUp('suitmage')&&!G.suitMastery;
  const canDoublebetMaster=hasP('doublebet')&&isUp('doublebet')&&!G.upgrades.includes('doublebet2');
  const canTakeBloodPact=G._bloodPactOffer===true&&!ownsP('bloodpact');
  if(!cands.length&&!canMaster&&!canDoublebetMaster&&!canTakeBloodPact){finishUpgradeReward();return;}
  show('upgrade');
  const eventReward=G._upgradeReturn==='event';$('upgrade-title').textContent=eventReward?'⭐ 一般獎勵':'⭐ 魔王獎勵';$('upgrade-desc').textContent=eventReward?'選擇一項持有能力進行強化；這是事件戰鬥提供的額外獎勵。':'選擇一項強化或專精；特殊裝備可額外領取，不占用本次選擇。';
  let html='';
  if(canTakeBloodPact){
    html+=`<div class="shopitem blood-pact-item"><div class="info"><b>📜 鮮血契約（稀有額外裝備）</b><div class="desc">獲得渴血，使吸血效率 ×1.5；無法獲得戰後自然回血。接受血魔邀請後才會進化為血魔契約。</div><div class="desc" style="color:#f0a6b8">無法購買；領取後仍可選擇本次魔王強化。擊敗血魔時較容易出現。</div></div><button class="b-magic" data-bloodpact="1">簽訂契約</button></div>`;
  }
  cands.forEach(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);
    html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${p.name}</b><div class="desc">目前：${p.desc}</div><div class="desc" style="color:var(--gold)">⭐ 強化後：${p.descUp}</div></div><button class="b-buy" data-up="${id}">強化</button></div>`;
  });
  if(canMaster){
    html+=`<div class="center big" style="color:#d7b4ff">🎭 花色魔術師二次專精（四選一，永久互斥）</div>`;
    SUIT_MASTERIES.forEach(m=>{html+=`<div class="shopitem mastery-item"><div class="info"><b>${m.icon} ${m.name}</b><div class="desc">${m.desc}</div></div><button class="b-magic" data-mastery="${m.id}">專精</button></div>`;});
  }
  if(canDoublebetMaster){
    html+=`<div class="shopitem mastery-item"><div class="info"><b>🎲 金錢狂賭（二次強化）</b><div class="desc">${DOUBLEBET_MASTERY_DESC}</div></div><button class="b-magic" data-doublebet2="1">二次強化</button></div>`;
  }
  $('upgrade-list').innerHTML=html;
  $('upgrade-list').querySelectorAll('button[data-up]').forEach(btn=>{
    btn.onclick=()=>{if(!isUp(btn.dataset.up))G.upgrades.push(btn.dataset.up);SFX.win();finishUpgradeReward();};
  });
  $('upgrade-list').querySelectorAll('button[data-mastery]').forEach(btn=>{
    btn.onclick=()=>{if(!G.suitMastery)G.suitMastery=btn.dataset.mastery;SFX.win();finishUpgradeReward();};
  });
  const doublebet2=$('upgrade-list').querySelector('button[data-doublebet2]');
  if(doublebet2)doublebet2.onclick=()=>{if(!G.upgrades.includes('doublebet2'))G.upgrades.push('doublebet2');SFX.win();finishUpgradeReward();};
  const bloodPact=$('upgrade-list').querySelector('button[data-bloodpact]');
  if(bloodPact)bloodPact.onclick=()=>{if(!ownsP('bloodpact'))G.passives.push('bloodpact');G._bloodPactOffer=false;SFX.win();openUpgrade();};
  renderTop();
}

//===== 商店 =====
function rollShopPicks(){
  const pool=ALL_PASSIVES.filter(p=>p.shop!==false&&!G.passives.includes(p.id)).map(p=>({id:p.id,weight:G.character==='magician'&&SUIT_STARTERS.includes(p.id)?SUIT_SHOP_WEIGHT:1}));
  const picks=[];
  while(pool.length&&picks.length<4){
    const total=pool.reduce((sum,item)=>sum+item.weight,0);let roll=Math.random()*total,index=0;
    for(;index<pool.length-1;index++){roll-=pool[index].weight;if(roll<0)break;}
    picks.push(pool.splice(index,1)[0].id);
  }
  return picks;
}
function openShop(){
  show('shop');$('shop-stage').textContent=G.floor;$('shop-rate').textContent=`×${shopFloorMultiplier().toFixed(2)}`;
  G.shopRefreshCost=20;
  G._shopCards=[randomCard(),randomCard(),randomCard()];
  G._shopPicks=rollShopPicks();
  if(!G.nodeStarted&&hasP('luckycoin')){const h=isUp('luckycoin')?10:5;G.hp=Math.min(G.maxhp,G.hp+h);}
  G.nodeStarted=true;
  renderShop();
}
function renderShop(){
  const picks=(G._shopPicks||[]).map(id=>ALL_PASSIVES.find(p=>p.id===id)).filter(Boolean);
  const disc=hasP('luckycoin')?`（幸運金幣 −${isUp('luckycoin')?15:10}%）`:'';
  const editRate=deckEditMultiplier().toFixed(2);
  let html='';
  picks.forEach(p=>{
    if(G.passives.includes(p.id)){html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${p.name}</b><div class="desc">${p.desc}</div></div><div class="owned" style="padding:7px 12px">已擁有 ✓</div></div>`;return;}
    const c=price(p.cost);
    html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${p.name}</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${p.desc}</div></div><button class="b-buy" data-buy="${p.id}" data-cost="${c}">購買</button></div>`;
  });
  html+=`<div class="shopitem"><div class="info"><b>🧪 治療藥水</b> — <span style="color:var(--gold)">${price(60)}🪙</span><div class="desc">回復 40 HP（不超過上限）。</div></div><button class="b-buy" data-heal="1" data-cost="${price(60)}">購買</button></div>`;
  html+=`<div class="shopitem"><div class="info"><b>💪 強健體魄</b> — <span style="color:var(--gold)">${price(90)}🪙</span><div class="desc">最大 HP +20 並回復 20 HP。</div></div><button class="b-buy" data-maxhp="1" data-cost="${price(90)}">購買</button></div>`;
  html+=`<div class="shopitem"><div class="info"><b>🃏 編輯牌庫</b><div class="desc">加入隨機牌或拆除牌庫卡牌（本次拆除 ${deckEditPrice(90)}🪙）。所有永久改牌共用指數價格：已改 ${G.deckEdits} 次，當前 ×${editRate}。目前 ${G.deck.length} 張。</div></div><button class="b-buy" id="open-deckedit">開啟</button></div>`;
  html+=`<div class="shopitem"><div class="info"><b>🎨 花色重鑄</b> — <span style="color:var(--gold)">${deckEditPrice(60)}🪙</span>${disc}<div class="desc">保留點數並永久改成指定花色；每次成功改牌後，所有改牌價格 ×${BALANCE.deckEditGrowth}。</div></div><button class="b-magic" id="open-suitforge">開啟</button></div>`;
  $('shop-items').innerHTML=html;bindShop();
  $('open-deckedit').onclick=openDeckEdit;
  $('open-suitforge').onclick=openSuitForge;
  $('shop-refresh').textContent=`🔄 刷新商品（${price(G.shopRefreshCost)}🪙）`;
  renderTop();
}
function refreshShop(){
  const cost=price(G.shopRefreshCost);
  if(G.gold<cost){const btn=$('shop-refresh');const old=btn.textContent;btn.textContent='金幣不足';setTimeout(()=>btn.textContent=old,900);return;}
  G.gold-=cost;SFX.coin();
  G.shopRefreshCost*=2;
  G._shopCards=[randomCard(),randomCard(),randomCard()];
  G._shopPicks=rollShopPicks();
  renderShop();
}
//===== 牌庫編輯 =====
function openDeckEdit(){
  if(!G._shopCards)G._shopCards=[randomCard(),randomCard(),randomCard()];
  G._rmSel=null;
  renderDeckEdit();$('deckedit').classList.remove('hidden');
}
function removeSelectedCard(){
  if(G._rmSel==null)return;
  const rmCost=deckEditPrice(90);const card=G.deck[G._rmSel];if(!card)return;
  if(deckPoints()-cardPoints(card)<30){$('deckedit-info').textContent='牌庫合計不可低於 30 點！';return;}
  if(G.gold<rmCost){$('deckedit-info').textContent='金幣不足！';return;}
  G.gold-=rmCost;G.deck.splice(G._rmSel,1);G.deckEdits++;G._rmSel=null;SFX.coin();renderDeckEdit();renderTop();
}
function closeDeckEdit(){$('deckedit').classList.add('hidden');renderShop();}
function renderDeckEdit(){
  const rmCost=deckEditPrice(90);
  $('deckedit-info').textContent=`目前牌庫 ${G.deck.length} 張（合計 ${deckPoints()} 點）｜已改牌 ${G.deckEdits} 次｜價格 ×${deckEditMultiplier().toFixed(2)}｜金幣 ${G.gold}🪙`;
  $('remove-cost').textContent=rmCost;
  // 加入新牌：只顯示牌與加入按鈕
  $('deckedit-add').innerHTML=G._shopCards.map((c,i)=>{
    if(c==null)return `<div class="codex-card"><div class="owned">✓ 已加入</div></div>`;
    const cost=deckEditPrice(cardPoints(c)+30);
    return `<div class="codex-card"><div class="cn" style="font-size:24px;${c.red?'color:#e74c3c':''}">${cardLabel(c)}${c.s}</div><button class="b-buy" data-addcard="${i}">加入（${cost}🪙）</button></div>`;
  }).join('');
  $('deckedit-add').querySelectorAll('button[data-addcard]').forEach(btn=>{
    btn.onclick=()=>{const i=+btn.dataset.addcard;const c=G._shopCards[i];if(!c)return;const cost=deckEditPrice(cardPoints(c)+30);if(G.gold<cost){btn.textContent='金幣不足';return;}G.gold-=cost;G.deck.push(c);G.deckEdits++;G._shopCards[i]=null;SFX.coin();renderDeckEdit();renderTop();};
  });
  // 拆除牌庫：排序顯示、點選後高亮，按下方按鈕才刪除
  const order=G.deck.map((c,i)=>({c,i})).sort((a,b)=>cardPoints(a.c)-cardPoints(b.c)||suitOrder(a.c.s)-suitOrder(b.c.s));
  $('deckedit-deck').innerHTML=order.map(({c,i})=>`<div class="mini-card${c.red?' red':''}${G._rmSel===i?' sel':''}" data-rm="${i}">${cardLabel(c)}${c.s}</div>`).join('');
  $('deckedit-deck').querySelectorAll('[data-rm]').forEach(el=>{
    el.onclick=()=>{const i=+el.dataset.rm;G._rmSel=(G._rmSel===i?null:i);renderDeckEdit();};
  });
  const rb=$('deck-remove-btn');
  if(G._rmSel==null){rb.disabled=true;rb.textContent=`🗑 刪除選取的牌（${rmCost}🪙）`;}
  else{const sc=G.deck[G._rmSel];rb.disabled=false;rb.textContent=`🗑 刪除 ${cardLabel(sc)}${sc.s}（${rmCost}🪙）`;}
}
//===== 花色重鑄 =====
function openSuitForge(){G._forgeSel=null;renderSuitForge();$('suitforge').classList.remove('hidden');}
function closeSuitForge(){$('suitforge').classList.add('hidden');renderShop();}
function renderSuitForge(){
  const cost=deckEditPrice(60),order=G.deck.map((c,i)=>({c,i})).sort((a,b)=>cardPoints(a.c)-cardPoints(b.c)||suitOrder(a.c.s)-suitOrder(b.c.s));
  $('suitforge-info').textContent=`選擇一張牌後指定新花色｜本次 ${cost}🪙｜已改牌 ${G.deckEdits} 次（×${deckEditMultiplier().toFixed(2)}）｜目前金幣 ${G.gold}🪙`;
  $('suitforge-deck').innerHTML=order.map(({c,i})=>`<div class="mini-card${c.red?' red':''}${G._forgeSel===i?' sel':''}" data-forge="${i}">${cardLabel(c)}${c.s}</div>`).join('');
  $('suitforge-deck').querySelectorAll('[data-forge]').forEach(el=>el.onclick=()=>{G._forgeSel=+el.dataset.forge;renderSuitForge();});
  renderSuitPicker('suitforge-picker',G._forgeSel!=null,s=>forgeSelectedSuit(s));
}
function forgeSelectedSuit(suit){
  const card=G.deck[G._forgeSel],cost=deckEditPrice(60);if(!card)return;
  if(card.s===suit){$('suitforge-info').textContent='這張牌已經是該花色。';return;}
  if(G.gold<cost){$('suitforge-info').textContent='金幣不足！';return;}
  const old=card.s;G.gold-=cost;card.s=suit;card.red=suit==='♥'||suit==='♦';G.deckEdits++;G._forgeSel=null;SFX.coin();
  renderSuitForge();renderTop();$('suitforge-info').textContent=`重鑄完成：${cardLabel(card)}${old} → ${cardLabel(card)}${suit}｜目前金幣 ${G.gold}🪙`;
}
function bindShop(){
  $('shop-items').querySelectorAll('button').forEach(btn=>{
    btn.onclick=()=>{
      const cost=+btn.dataset.cost;
      if(G.gold<cost){btn.textContent='金幣不足';setTimeout(()=>btn.textContent='購買',900);return;}
      G.gold-=cost;SFX.coin();
      if(btn.dataset.buy)G.passives.push(btn.dataset.buy);
      else if(btn.dataset.heal)G.hp=Math.min(G.maxhp,G.hp+40);
      else if(btn.dataset.maxhp){G.maxhp+=20;G.hp+=20;}
      btn.textContent='已購買 ✓';btn.style.background='#2ecc71';btn.style.color='#fff';btn.disabled=true;
      renderTop();
    };
  });
}
function leaveShop(){completeEvent();}

//===== 百科 =====
function openCodex(){renderCodex();setCodexTab('passives');$('codex').classList.remove('hidden');}
function closeCodex(){$('codex').classList.add('hidden');}
function setCodexTab(tab){
  const status=tab==='status';
  $('codex-passive-panel').classList.toggle('hidden',status);
  $('codex-status-panel').classList.toggle('hidden',!status);
  $('codex-tab-passives').classList.toggle('active',!status);
  $('codex-tab-status').classList.toggle('active',status);
  $('codex-tab-passives').setAttribute('aria-selected',String(!status));
  $('codex-tab-status').setAttribute('aria-selected',String(status));
}
function renderCodex(){
  $('codex-count').textContent=ALL_PASSIVES.length;
  $('codex-list').innerHTML=ALL_PASSIVES.map(p=>{
    const owned=G.passives.includes(p.id);const up=isUp(p.id);
    const action=owned
      ?'<div class="owned">✓ 已持有'+(p.id==='doublebet'&&G.upgrades.includes('doublebet2')?'（二次強化）':up?'（已強化）':'')+(p.id==='suitmage'&&G.suitMastery?`｜${masteryInfo().name}`:'')+'</div>'
      :'<div class="ccost" style="text-align:center;padding:7px">尚未獲得</div>';
    let upLine=p.descUp?`<div class="ccost" style="color:var(--gold)">⭐ 強化：${p.descUp}</div>`:'<div class="ccost">（無強化）</div>';
    if(p.id==='suitmage')upLine+=`<div class="ccost" style="color:#d7b4ff">⭐⭐ 二次專精四選一：${SUIT_MASTERIES.map(m=>m.name).join('／')}</div>`;
    if(p.id==='doublebet')upLine+=`<div class="ccost" style="color:#d7b4ff">⭐⭐ 二次強化：${DOUBLEBET_MASTERY_DESC}</div>`;
    const stars=p.id==='doublebet'&&G.upgrades.includes('doublebet2')?' ⭐⭐':up?' ⭐':'';
    const source=p.id==='bloodpact'?'魔王稀有掉落｜血魔機率較高｜無法購買':`商店售價 ${p.cost}🪙`;
    return `<div class="codex-card"><div class="cn">${p.icon} ${p.name}${stars}</div><div class="cd">${p.desc}</div>${upLine}<div class="ccost">${source}</div>${action}</div>`;
  }).join('');
  $('status-count').textContent=STATUS_CODEX.length;
  $('status-list').innerHTML=STATUS_CODEX.map(status=>`<div class="codex-card status-card"><div class="cn">${status.icon} ${status.name}</div><div class="cd">${status.desc}</div></div>`).join('');
}

function gameOver(){show('end');SFX.lose();$('end-title').textContent='💀 你倒下了';$('end-title').className='big';$('end-sub').textContent=`你爬到了第 ${G.floor} 層。賭場無情，再挑戰一次？`;}

function openCharacterSelect(){
  newGame();show('character');renderTop();
  $('character-list').innerHTML=CHARACTERS.map(c=>{
    const skills=c.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return `<span>${p.icon} ${p.name}</span>`;}).join('')+(c.id==='magician'?'<span>＋ 花色技能四選一</span>':'');
    return `<div class="character-card"><div class="character-icon">${c.icon}</div><div class="character-name">${c.name}</div><div class="character-desc">${c.desc}</div><div class="character-skills">${skills}</div><button class="b-next" data-character="${c.id}">選擇 ${c.name}</button></div>`;
  }).join('');
  $('character-list').querySelectorAll('[data-character]').forEach(btn=>btn.onclick=()=>{
    newGame(btn.dataset.character);
    if(G.character==='magician')openMagicianStart();else enterCurrentNode();
  });
}
function openMagicianStart(){
  G._magicianChoosing=true;show('magician-start');
  $('magician-start-list').innerHTML=SUIT_STARTERS.map(id=>{
    const p=ALL_PASSIVES.find(item=>item.id===id);
    return `<div class="starter-choice"><div class="starter-icon">${p.icon}</div><div class="starter-name">${p.name}</div><div class="starter-desc">${p.desc}</div><button class="b-magic" data-starter="${p.id}">選擇 ${p.name}</button></div>`;
  }).join('');
  $('magician-start-list').querySelectorAll('[data-starter]').forEach(btn=>btn.onclick=()=>{
    if(!G._magicianChoosing||!SUIT_STARTERS.includes(btn.dataset.starter))return;
    G._magicianChoosing=false;G.passives.push(btn.dataset.starter);enterCurrentNode();
  });
}

$('btn-hit').onclick=hit;
$('btn-stand').onclick=attack;
$('btn-defend').onclick=defend;
$('btn-redraw').onclick=redraw;
$('btn-peek').onclick=peek;
$('btn-leave-shop').onclick=leaveShop;
$('shop-refresh').onclick=refreshShop;
$('btn-skip-upgrade').onclick=finishUpgradeReward;
$('btn-restart').onclick=openCharacterSelect;
$('ui-sound').onclick=()=>{const on=SFX.toggle();$('ui-sound').textContent=on?'🔊 音效':'🔇 靜音';};
$('ui-codex').onclick=openCodex;
$('codex-tab-passives').onclick=()=>setCodexTab('passives');
$('codex-tab-status').onclick=()=>setCodexTab('status');
$('ui-save').onclick=downloadSave;
$('ui-load').onclick=chooseSaveFile;
$('character-load').onclick=chooseSaveFile;
$('save-file').onchange=event=>loadSaveFile(event.target.files&&event.target.files[0]);
$('codex-close').onclick=closeCodex;
$('btn-drop-continue').onclick=finishDrop;
$('deckedit-close').onclick=closeDeckEdit;
$('deck-remove-btn').onclick=removeSelectedCard;
$('btn-duck').onclick=finishDuck;
$('btn-discard').onclick=toggleDiscard;
$('btn-suitmagic').onclick=toggleSuitMagic;
$('bounty-hit').onclick=bountyHit;
$('bounty-cash').onclick=bountyCash;
$('bounty-redraw').onclick=bountyRedraw;
$('bounty-peek').onclick=bountyPeek;
$('bounty-discard').onclick=bountyToggleDiscard;
$('bounty-suitmagic').onclick=bountyToggleSuitMagic;
$('suitforge-close').onclick=closeSuitForge;

openCharacterSelect();
