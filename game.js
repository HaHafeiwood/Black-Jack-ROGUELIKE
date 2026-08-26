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
  werewolf:'werewolf.png',
  samurai:'warrior.png',
  kun:'kun-black-white-ink-transparent.png',
  peng:'peng-black-white-ink-transparent.png',
  cultLeader:'Cult Leader.png',
  cthulhu:'Cthulhu.png',
  inquisitorMounted:'Paladin Commander horse.png',
  inquisitor:'Paladin Commander.png',
  mimic:'fantasy-treasure-chest-mimic-transparent-480x624.png',
};
const EVENT_IMG={
  campfire:'outdoor-fire-pit-with-crackling-flames-free-png.webp',
  crabRest:'Crab Rave.png',
  darkChurch:'dark-cult-church-transparent-480x624.png',
  ordinaryChurch:'ordinary-medieval-church-transparent-480x624.png',
  bloodAltar:'blood-painted-ritual-altar-scroll-transparent-480x624.png',
  squirrelNest:'squirrel nest.png',
  treasureChest:'closed-fantasy-treasure-chest-transparent-480x624.png',
  faithNecklace:'necklace.png',
};
const ENEMIES={
  slime: {name:'史萊姆', type:'slime', img:IMG.slime, hp:20, atk:[3,7],  h:120},
  ninja: {name:'忍者',   type:'ninja', img:IMG.ninja, hp:50, atk:[6,11], h:185},
  ghost: {name:'幽靈',   type:'ghost', img:IMG.ghost, hp:62, atk:[7,12], h:160},
  witch: {name:'女巫',   type:'witch', img:IMG.witch, hp:72, atk:[9,14], h:185},
  bear:  {name:'熊',     type:'bear',  img:IMG.bear,  hp:80, atk:[8,13], h:180},
  platypus:{name:'鴨嘴獸', type:'platypus', img:IMG.platypus, hp:68, atk:[7,12], h:155},
  squirrel:{name:'松鼠', type:'squirrel', img:IMG.squirrel, hp:45, atk:[4,8], h:150},
  mimic:{name:'貪噬寶箱怪', type:'mimic', img:IMG.mimic, hp:115, atk:[9,15], h:190},
  dropbear:{name:'掉落熊', type:'dropbear', img:IMG.dropbear, hp:72, atk:[18,28], h:175},
  zombie:{name:'殭屍', type:'zombie', img:IMG.zombie, hp:88, atk:[5,9], h:190},
  eagle:{name:'老鷹', type:'eagle', img:IMG.eagle, hp:58, atk:[7,11], h:185},
  robot:{name:'機器人', type:'robot', img:IMG.robot, hp:76, atk:[6,10], h:185},
  cultist:{name:'邪教徒', type:'cultist', img:IMG.cultist, hp:72, atk:[7,12], h:185},
  skeleton:{name:'骷髏戰士', type:'skeleton', img:IMG.skeleton, hp:78, atk:[7,12], h:190},
  bat:{name:'吸血蝙蝠', type:'bat', img:IMG.bat, hp:26, atk:[3,6], h:130},
  cyclops:{name:'獨眼巨人', type:'cyclops', img:IMG.cyclops, hp:105, atk:[10,16], h:205},
  paladin:{name:'聖騎士', type:'paladin', img:IMG.paladin, hp:92, atk:[8,13], h:205},
  werewolf:{name:'狼人', type:'werewolf', img:IMG.werewolf, hp:82, atk:[8,13], h:190},
  gargoyle:{name:'石像鬼', type:'gargoyle', img:IMG.gargoyle, hp:150, atk:[9,14], h:205, boss:true},
  dragon:{name:'魔龍 · 莊家', type:'dragon', img:IMG.dragon, hp:135, atk:[8,13], h:165, boss:true},
  demon: {name:'惡魔', type:'demon', img:IMG.demon, emoji:'😈', hp:100, atk:[9,15], h:175, boss:true},
  samurai:{name:'武士',type:'samurai',img:IMG.samurai,hp:145,atk:[9,14],h:205,boss:true},
  kun: {name:'鯤 · 北冥巨獸', type:'kun', img:IMG.kun, hp:338, atk:[25,30], h:225, boss:true, ultimate:true},
  peng: {name:'鵬 · 垂天之翼', type:'peng', img:IMG.peng, hp:338, atk:[25,30], h:235, boss:true, ultimate:true},
  cultLeader:{name:'無面教宗・默禱者',type:'cultLeader',img:IMG.cultLeader,hp:360,atk:[25,30],h:225,boss:true,ultimate:true},
  disciplineGargoyle:{name:'戒律石像鬼',type:'disciplineGargoyle',img:IMG.gargoyle,hp:140,atk:[14,19],h:205,ultimateMinion:true},
  punishmentGargoyle:{name:'刑罰石像鬼',type:'punishmentGargoyle',img:IMG.gargoyle,hp:140,atk:[13,18],h:205,ultimateMinion:true},
  cthulhu:{name:'邪神・克蘇魯',type:'cthulhu',img:IMG.cthulhu,hp:640,atk:[28,34],h:240,boss:true,ultimate:true},
  inquisitorMounted:{name:'異端審判長・鐵騎',type:'inquisitorMounted',img:IMG.inquisitorMounted,hp:380,atk:[25,30],h:230,boss:true,ultimate:true},
  inquisitor:{name:'異端審判長・行刑者',type:'inquisitor',img:IMG.inquisitor,hp:380,atk:[27,32],h:230,boss:true,ultimate:true},
};
const NORMAL_POOL=['ninja','eagle','robot','cultist','skeleton','cyclops','werewolf','bats','slimes','zombies','witch','ghost','bear','platypus','squirrel','dropbear'];
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
const SQUIRREL_NEST_EVENT_CHANCE=0.16;
const TREASURE_CHEST_EVENT_CHANCE=0.02;
const FAITH_NECK_CHURCH_BONUS=0.15;
const SQUIRREL_AMBUSH_CHANCE=0.35;
const TREASURE_MIMIC_CHANCE=0.40;
const CRAB_REST_CHANCE=0.08;
const chapterPosition=f=>(Math.max(1,f)-1)%CHAPTER_LENGTH+1;
const chapterIndex=f=>Math.floor((Math.max(1,f)-1)/CHAPTER_LENGTH);
const isBossFloor=f=>chapterPosition(f)===BOSS_NODE;
const isUltimateBossFloor=f=>isBossFloor(f)&&(chapterIndex(f)+1)%9===0;
const isRestFloor=f=>chapterPosition(f)===REST_NODE;
function legacyHeight(floor){
  const pos=chapterPosition(floor),within=(pos-1)*(LEGACY_CHAPTER_LENGTH-1)/(CHAPTER_LENGTH-1);
  return chapterIndex(floor)*LEGACY_CHAPTER_LENGTH+1+within;
}

const CHARACTERS=[
  {id:'warrior',name:'戰士',icon:'⚔️',passives:['rubyring','heartguard','redraw','safe21'],desc:'兼具恢復、防禦與穩定控牌，安全累積攻勢。'},
  {id:'magician',name:'魔術師',icon:'🎭',passives:['suitmage'],desc:'開局可改變手牌花色，並從四種花色技能中選擇兩種。'},
  {id:'gambler',name:'賭徒',icon:'🎲',passives:['cardsharp','doublebet'],desc:'丟棄不利手牌，追求高風險的豪賭爆發。'},
];

// 每張被動卡有 desc（基礎）與 descUp（強化）。壁壘無強化。
const ALL_PASSIVES=[
  {id:'facemult',  name:'面牌加成', icon:'🃏', cost:90,  desc:'每張 J/Q/K 額外 +3 傷害。', descUp:'每張 J/Q/K 額外 +4 傷害。'},
  {id:'doublebet', name:'雙倍豪賭', icon:'🎲', cost:180, desc:'攻擊先獲得 +8 基礎傷害；攻擊或防禦時，單數 → 效果 ×2，雙數 → 扣除等同點數的 HP；爆牌扣點數 ×2。', descUp:'攻擊基礎傷害提高為 +12；攻防單數 ×2.5，雙數反噬降為點數一半；爆牌仍扣點數 ×2。'},
  {id:'redraw',    name:'重抽機會', icon:'🔄', cost:130, desc:'解鎖重抽；每次消耗 6 控制值。控制值跨一般關卡與金錢回合共用。', descUp:'重抽消耗降為 3，且爆牌後也能重抽救牌。'},
  {id:'insurance', name:'保險機制', icon:'🛡️', cost:150, desc:'爆牌時，仍造成前兩張牌的點數傷害。', descUp:'爆牌時，仍造成前三張牌的點數傷害。'},
  {id:'peek',      name:'透視牌堆', icon:'👁️', cost:110, desc:'解鎖預覽接下來三張牌；每次消耗 6 控制值。控制值跨一般關卡與金錢回合共用。', descUp:'預覽提高為四張，消耗降為 3 控制值。'},
  {id:'vampire',   name:'吸血賭注', icon:'🩸', cost:170, desc:'成功攻擊時，回復造成傷害的 20% HP。', descUp:'成功攻擊時，回復造成傷害的 30% HP。'},
  {id:'bloodpact', name:'鮮血契約', icon:'📜', cost:null, shop:false, desc:'撿起時最大生命減半；成為後裔前，未來獲得的最大生命也減半。獲得 5 層渴血，戰後無法自然回血；信仰變化與信仰項鍊效率減半，信仰達到 ±80 才能向對應教堂祈禱。不可封印、不可出售。成為後裔後進化為血魔契約。'},
  {id:'safe21',    name:'安全線', icon:'🪙', cost:100, desc:'手牌達 17 點以上選擇攻擊時，額外 +5 傷害。', descUp:'手牌達 17 點以上選擇攻擊時，額外 +8 傷害。'},
  {id:'bulwark',   name:'壁壘', icon:'🏰', cost:80, desc:'防禦值不再於回合結束歸零，可持續累積。', descUp:'防禦持續累積；攻擊時每滿 10 點多餘防禦使最終傷害倍率 +0.1，最高 ×1.6，且不消耗防禦。'},
  {id:'buckler',   name:'圓盾', icon:'🛡', cost:120, desc:'選擇防禦時額外獲得 8 防禦；可使用 4 次。', descUp:'選擇防禦時額外獲得 10 防禦，且不消耗耐久。'},
  {id:'antidote',  name:'淨化', icon:'✨', cost:120, desc:'獲得 40% 負面狀態抗性，降低有害狀態的獲得層數，並提高遲疑提供的可抽牌數。與「我們是怎麼走到這一步的」互斥。', descUp:'負面狀態抗性提高為 60%，進一步降低有害層數並提高遲疑可抽牌數。'},
  {id:'howdidwegethere',name:'我們是怎麼走到這一步的',icon:'❓',cost:175,desc:'實際獲得的所有數值型狀態層數 ×1.5，無論有利或有害；永遠至少持有 3 層虛弱。與淨化互斥。',descUp:'實際獲得的所有數值型狀態層數改為 ×2；仍永遠至少持有 3 層虛弱。'},
  {id:'toxicology',name:'毒物學', icon:'⚗️', cost:145, desc:'成功攻擊時，每張 2～3 依其牌面點數對目標施加等量中毒；層數無上限。', descUp:'適用牌面擴大為 2～4；層數仍無上限。'},
  {id:'heartguard',name:'護心鏡', icon:'🪞', cost:180, desc:'選擇防禦時，額外將手牌點數的 30% 轉為防禦。', descUp:'選擇防禦時，額外將手牌點數的 50% 轉為防禦。'},
  {id:'dragonneck',name:'龍頭項鍊', icon:'🐉', cost:200, desc:'5 張以上不爆時，額外造成 50 傷害並回復 50 HP。', descUp:'五龍時，額外造成 50 + 點數50% 傷害，並回復 50 + 點數20% HP。'},
  {id:'luckycoin', name:'幸運金幣', icon:'🍀', cost:110, desc:'商店所有價格 −10%，進入商店時回復 5 HP。', descUp:'商店所有價格 −15%，進入商店時回復 10 HP。'},
  {id:'collector', name:'蒐集家', icon:'🎴', cost:140, desc:'戰鬥結束時掉落 1 張撲克牌。', descUp:'戰鬥結束時掉落 2 張撲克牌。'},
  {id:'rubyring',  name:'紅寶石戒指', icon:'💍', cost:130, desc:'每清除一層回復 8 HP。', descUp:'每清除一層回復 15 HP。'},
  {id:'echelon',   name:'階層', icon:'📈', cost:150, desc:'本回合比初始多抽 n 張牌時，攻擊額外 +n! 傷害。', descUp:'同上，但 n 額外 +1（成長更快）。'},
  {id:'cardsharp', name:'老千', icon:'🤵', cost:140, desc:'解鎖丟棄單張手牌；每次消耗 3 控制值。控制值跨一般關卡與金錢回合共用。', descUp:'丟棄消耗降為 2 控制值。'},
  {id:'spadeart',  name:'黑桃穿刺', icon:'♠️', cost:135, desc:'攻擊時每張黑桃 +2 傷害；3 張黑桃可無視 50% 護盾。', descUp:'每張黑桃 +3 傷害；3 張黑桃可完全無視護盾。'},
  {id:'heartecho', name:'紅心回響', icon:'♥️', cost:135, desc:'每場戰鬥首次以含紅心的手牌行動時，每張紅心回復 4 HP。', descUp:'每場戰鬥可觸發 2 次。'},
  {id:'diamondbonus',name:'方塊分紅',icon:'♦️',cost:135,desc:'賞金結算時，每張方塊使倍率 +0.1，最多 +0.3。',descUp:'每張方塊使倍率 +0.15，最多 +0.45。'},
  {id:'clubstance',name:'梅花架勢', icon:'♣️', cost:135, desc:'防禦時每張梅花 +3 防禦；3 張梅花再獲得 5 蓄勢。', descUp:'每張梅花 +4 防禦；3 張梅花再獲得 8 蓄勢。'},
  {id:'suitmage',  name:'花色魔術師', icon:'🎭', cost:175, desc:'可將手牌變成指定花色；每次消耗 4 控制值，沒有使用次數限制。', descUp:'每次消耗降為 3 控制值；下次魔王強化可四選一取得花色二次專精。'},
  {id:'firststrike',name:'先發制人',icon:'⚔️',cost:130,desc:'戰鬥第 1 回合以恰好 2 張、20 點的手牌攻擊時，額外 +20 傷害。',descUp:'第 1 回合以不超過 3 張、19～21 點的手牌攻擊時，額外 +30 傷害。'},
  {id:'straight',name:'連號',icon:'🔗',cost:145,desc:'手牌含至少 3 張連續牌面時，攻擊與防禦 +18。A 視為 1，Q-K-A 不成立。',descUp:'三連號攻防 +24；四張以上連號攻防 +40。'},
  {id:'court',name:'宮廷牌局',icon:'👑',cost:165,desc:'戰鬥中 J、Q、K 齊聚時將點數鎖定為 21 並攻擊 +35；鎖定後再抽牌必定爆牌。',descUp:'J、Q、K 齊聚時鎖定 21；攻擊 +50、防禦 +25，鎖定後再抽牌必定爆牌。'},
  {id:'bountyhunter',name:'賞金獵人',icon:'💰',cost:150,desc:'以 20 或 21 點結算賞金後，下一場戰鬥首次成功攻擊額外增加「賞金倍率 ×10」傷害。',descUp:'第一次攻擊獲得完整加成，第二次成功攻擊再獲得 50% 加成。'},
  {id:'laststand',name:'背水一戰',icon:'🔥',cost:155,desc:'HP 不高於 30% 時，攻擊 ×1.5，但防禦值 −20%。',descUp:'HP 不高於 40% 時攻擊 ×1.6，且不再降低防禦。'},
  {id:'faithneck',name:'信仰項鍊',icon:'📿',cost:165,desc:'教堂出現率提高；立場明確後，每個完整戰鬥回合都會使信仰朝當前方向更加堅定。不會被敵對勢力封印；獲得神蹟後，對敵對勢力造成的攻擊傷害 ×1.10。',descUp:'教堂出現率維持提高；使信仰更加堅定的速度提升。不會被敵對勢力封印，神蹟的敵對勢力傷害維持 ×1.10。'},
  {id:'inflation',name:'通貨膨脹',icon:'📊',cost:160,slots:2,resale:'market',desc:'占用 2 個裝備欄。出售時不按原買入價，而是依當前商店漲價倍率重新估值。'},
  {id:'thousandstrikes',name:'一瞬千擊',icon:'⚡',cost:260,desc:'僅攻擊生效。先結算牌面與虛弱等乘法，再取 30% 化為 1 點段數；每段加入全部加法傷害後 ×0.6，並各自結算敵方減傷。擊倒目標後，剩餘段數隨機攻擊其他敵人；狀態只附加一次，吸血則逐段以原效率 30% 結算。',descUp:'轉換為段數的比例提高至 40%；其他規則不變。'},
];

const SUITS=['♠','♥','♦','♣'];
const SUIT_STARTERS=['spadeart','heartecho','diamondbonus','clubstance'];
const SUIT_SHOP_WEIGHT=2.5;
const CARD_RANKS=['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
const PASSIVE_LIMIT=10;
const PASSIVE_RARITY={
  facemult:'common',safe21:'common',buckler:'common',heartecho:'common',clubstance:'common',insurance:'common',
  rubyring:'uncommon',antidote:'uncommon',toxicology:'uncommon',collector:'uncommon',echelon:'uncommon',spadeart:'uncommon',diamondbonus:'uncommon',firststrike:'uncommon',straight:'uncommon',bountyhunter:'uncommon',laststand:'uncommon',
  heartguard:'rare',peek:'rare',redraw:'rare',cardsharp:'rare',vampire:'rare',luckycoin:'rare',bulwark:'rare',suitmage:'rare',court:'rare',faithneck:'rare',howdidwegethere:'rare',inflation:'rare',
  doublebet:'legendary',dragonneck:'legendary',thousandstrikes:'legendary',bloodpact:'special',
};
const RARITY_INFO={common:{name:'普通',weight:1},uncommon:{name:'罕見',weight:0.65},rare:{name:'稀有',weight:0.30},legendary:{name:'傳說',weight:0.10},special:{name:'特殊',weight:0}};
const PASSIVE_AFFIX_CHANCE=0.10;
const PASSIVE_AFFIXES=[
  {id:'hidden_weapon',name:'暗器',icon:'🗡️',rarity:'common',weight:28,desc:'攻擊傷害 +2。'},
  {id:'lining',name:'內襯',icon:'🧥',rarity:'common',weight:28,desc:'防禦 +2。'},
  {id:'sharp',name:'鋒利',icon:'⚔️',rarity:'uncommon',weight:14,desc:'攻擊傷害 +1%。'},
  {id:'guardian',name:'守護',icon:'🛡️',rarity:'uncommon',weight:14,desc:'防禦 +1%。'},
  {id:'gilded',name:'鍍金',icon:'💰',rarity:'rare',weight:10,desc:'販售價值 +10%。'},
  {id:'ghost',name:'幽靈',icon:'👻',rarity:'legendary',weight:3,desc:'此裝備占用的裝備欄 −1，最低為 0；無法封存。'},
  {id:'locked',name:'上鎖',icon:'🔒',rarity:'legendary',weight:3,desc:'無法販售或丟棄，但仍可封存。'},
];
const SUIT_MASTERIES=[
  {id:'four_suits',name:'四象齊聚',icon:'🧭',desc:'四種花色齊聚時，攻擊與防禦最終 +40；賞金倍率 ×1.5。'},
  {id:'flush',name:'同花大獎',icon:'🌊',desc:'手牌有 4 張同花時，攻擊與防禦 ×2；賞金倍率 ×1.75。'},
  {id:'alternating',name:'紅黑交替',icon:'🌓',desc:'每組相鄰紅黑交替使攻擊與防禦 +12；賞金手牌 4 張以上且全交替時倍率 ×1.75。'},
  {id:'mono',name:'純色牌組',icon:'🎨',desc:'牌庫占比至少 40% 的主花色計數加倍、其他花色技能失效；手牌過半為主花色時攻防與賞金 ×1.5。'},
];
const DOUBLEBET_MASTERY_DESC='賞金手牌另計：13／15 點 ×1.25、17 點 ×1.5、19 點 ×1.75、21 點 ×2；其他奇數不加成，雙數歸零，爆牌倒扣該層基礎賞金。';

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
const SAVE_VERSION=4;
const GAME_VERSION='0.34.1';
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
  suitForgeBase:45,
  maxHpGrowth:1.20,
  shopGrowthPower:0.75,
  demonFrenzyUses:5,
  bloodPactChance:0.15,
  bloodPactDemonChance:0.50,
  rankBoostShopChance:0.12,
  rankBoostShopChanceFull:0.65,
  rankBoostShopRollsFull:2,
  controlMax:15,
  controlRestore:3,
  controlShopRestore:6,
};
const MIRACLE_CARDS=[
  {id:'holy-miracle',icon:'✨',name:'聖輝眷顧',desc:'獲得神教堂認可時取得。提供 30% 異常抗性，使非吸血類回復量變為 2 倍，並可在致死時以 30% 最大生命復活一次。復活會清除自身所有暫時正面與負面狀態。整局只有一次復活機會，重新取得神蹟不會重置。'},
  {id:'dark-miracle',icon:'🌑',name:'深淵餽贈',desc:'獲得邪教堂認可時取得。額外提供 1 個一般裝備欄；失去認可時神蹟會消散，若裝備超額則須封存一件。封存裝備只有在被動欄重新容得下時才會恢復。'},
];
const STATUS_CODEX=[
  {icon:'☠',name:'中毒',desc:'行動階段前，每層造成 1 HP 傷害；不會自然衰減。負面狀態抗性可降低獲得的層數。'},
  {icon:'🔥',name:'燒傷',desc:'最高 5 層。滿層後再次獲得的燒傷會以 1：1 轉為創傷。行動階段前，每層造成 2 HP 傷害；每發作 2 次自然減少 1 層。負面狀態抗性可降低獲得的層數。'},
  {icon:'🧟',name:'腐敗',desc:'最高 3 層，每層使戰鬥中的回血量降低 20%，最低仍保留 40% 回血；不會自然衰減。負面狀態抗性可降低獲得的層數。'},
  {icon:'🦠',name:'敗血',desc:'最高 5 層。受到吸血時，每層使吸血者的吸血效率提高 15%；不會自然衰減。負面狀態抗性可降低獲得的層數。'},
  {icon:'🩸',name:'流血',desc:'最高 8 層。滿層後再次獲得的流血會以 1：1 轉為創傷。直接攻擊傷及 HP 時會發作，造成等同層數的傷害，之後自然減少 2 層；完全防禦與狀態傷害不會觸發。負面狀態抗性可降低獲得的層數。'},
  {icon:'🩹',name:'創傷',desc:'可疊加。每層使受到的攻擊傷害增加 0.3 倍，受到的燒傷、中毒與流血傷害增加 1 倍；每回合自然減少 1 層。'},
  {icon:'🌑',name:'致盲',desc:'無法使用一般攻擊。以 2～18 點解除 1 層、19～21 點完全解除；爆牌無法解除。仍可防禦，但防禦量降低 20%，且不會減少致盲。'},
  {icon:'🦴',name:'斷骨',desc:'最高 3 層。每層使新獲得的防禦降低 15%，不影響已經持有的防禦；不會自然解除。負面狀態抗性可降低獲得的層數。'},
  {icon:'📉',name:'虛弱',desc:'每層使攻擊力降低 10%，最高 9 層；完成下一次行動後全部解除。負面狀態抗性可降低獲得的層數。'},
  {icon:'🦫',name:'遲疑',desc:'層數代表下一次行動可額外抽牌的張數，層數越高越有利；完成行動後解除。更強的遲疑會降低層數，負面狀態抗性則提高層數。'},
  {icon:'🛡',name:'防禦',desc:'優先抵擋即將受到的傷害；一般會在承受攻擊後歸零，持有壁壘則可保留。'},
  {icon:'⚡',name:'蓄勢',desc:`選擇防禦時，獲得該次防禦量約 50% 的蓄勢，最高 ${BALANCE.focusCap}。下次攻擊會消耗並轉為額外傷害；爆牌或特定效果會清除蓄勢。`},
  {icon:'🛡️',name:'護盾',desc:'受到攻擊時會先消耗護盾，再傷害 HP。穿透效果可忽略部分或全部護盾；部分護盾會永久保留或重新生成。'},
  {icon:'💥',name:'破防',desc:'依照標示比例額外磨損現有防禦；只作用於仍存在的防禦，超出防禦量的破防不會轉為 HP 傷害。'},
  {icon:'💨',name:'閃避',desc:'可消耗層數躲開符合條件的攻擊。閃避與折翼是分開的機制，擁有閃避不代表一定能被打至折翼。'},
  {icon:'🪶',name:'折翼',desc:'清除閃避、削弱攻擊，且持續期間無法恢復閃避；只對具有折翼規則的目標生效。'},
  {icon:'👻',name:'無敵',desc:'無敵期間受到的攻擊完全無效。'},
  {icon:'💤',name:'沉睡',desc:'沉睡期間無法行動；若受到攻擊，當次行動仍保持沉睡，但下一回合必定甦醒。'},
  {icon:'🔒',name:'技能封鎖',desc:'主動或被動技能暫時失效；每隻石像鬼最多封鎖一項，不同來源可同時存在，並依各自解除條件恢復。'},
  {icon:'🩸',name:'渴血',desc:'每層使吸血倍率額外 +0.1。'},
  {icon:'📿',name:'戒律烙印',desc:'重複相同行動會累積，切換行動可減少。達到 3 層時引發戒律懲罰並重置為 1 層；在深淵中即使歸零也不會消失。'},
  {icon:'🫥',name:'幻覺',desc:'層數代表剩餘時間。持續期間看見手牌時有 5% 機率顯示成錯誤牌面；結算依照真實牌面，每完成一次行動減少 1 層。'},
  {icon:'🌀',name:'精神錯亂',desc:'層數代表剩餘時間。持續期間每次繼續抽牌會隨機抽出 1～2 張，第一張爆牌時立即停止；每完成一次行動減少 1 層。'},
  {icon:'🕳️',name:'深淵托拽',desc:'每個完整回合都會使深淵距離縮短；歸零時生命也會歸零。逃跑行動可依手牌點數拉開距離。'},
  {icon:'🔥',name:'狂信',desc:'每層提高攻擊力；成功施加異常或封鎖技能會增加，精準命中或擊倒眷屬可削減。'},
  {icon:'⚖️',name:'罪證',desc:'傷害審判長陣營、施加負面狀態、爆牌或擊殺護衛時累積；進入審判階段後轉換為信仰與罪惡值。'},
  {icon:'📜',name:'罪惡值',desc:'直接提高異端審判長陣營的傷害，審判獲得更高加成。可透過贖罪降低，再犯則會以較低效率回升至本場上限。'},
];
let G;
function newGame(characterId=null){
  const character=CHARACTERS.find(c=>c.id===characterId)||null;
  G={hp:START_HP,maxhp:START_HP,gold:BALANCE.startGold,floor:0,poison:0,control:BALANCE.controlMax,eventChance:BASE_EVENT_CHANCE,shopChance:BASE_SHOP_CHANCE,altarSeen:false,churchSeen:false,faction:0,miracleAlignment:null,bloodDescendant:false,miracleReviveUsed:false,restCrab:false,nodeType:null,nodeStarted:false,
    character:character&&character.id,passives:character?[...character.passives]:[],passivePaid:Object.fromEntries((character?[...character.passives]:[]).map(id=>[id,0])),passiveAffixes:{},sealedPassive:null,upgrades:[],suitMastery:null,bountyHunt:null,deck:buildDeck(),deckEdits:0,maxHpPurchases:0,rankDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),100])),rankFlatDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),0])),legendaryShopChapter:null,battle:null};
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
    hp:G.hp,maxhp:G.maxhp,gold:G.gold,floor:G.floor,poison:0,control:G.control,eventChance:G.eventChance,shopChance:G.shopChance,altarSeen:!!G.altarSeen,churchSeen:!!G.churchSeen,faction:G.faction||0,miracleAlignment:G.miracleAlignment||null,bloodDescendant:!!G.bloodDescendant,miracleReviveUsed:!!G.miracleReviveUsed,restCrab:!!G.restCrab,nodeType:G.nodeType,nodeStarted:!!G.nodeStarted,
    character:G.character,passives:[...G.passives],passivePaid:{...(G.passivePaid||{})},passiveAffixes:{...(G.passiveAffixes||{})},sealedPassive:G.sealedPassive||null,upgrades:[...G.upgrades],suitMastery:G.suitMastery,
    bountyHunt:G.bountyHunt?JSON.parse(JSON.stringify(G.bountyHunt)):null,
    deck:G.deck.map(c=>({r:c.r,s:c.s})),deckEdits:G.deckEdits||0,maxHpPurchases:G.maxHpPurchases||0,rankDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),rankDamagePercent(r)])),rankFlatDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),rankFlatBonus(r)])),legendaryShopChapter:Number.isInteger(G.legendaryShopChapter)?G.legendaryShopChapter:null,
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
  let passives=[...new Set(passiveSource.filter(id=>validPassives.has(id)))];
  if(passives.includes('antidote')&&passives.includes('howdidwegethere')){passives=passives.filter(id=>id!=='howdidwegethere');warnings.push('淨化與「我們是怎麼走到這一步的」互斥，已保留淨化');}
  if(!character)character=CHARACTERS.find(c=>c.passives.every(id=>passives.includes(id)))||null;
  if(passives.length<passiveSource.length)warnings.push('已略過舊版或未知被動');
  let upgradeSource=src.upgrades||src.upgradeIds||player.upgrades||[];
  if(!Array.isArray(upgradeSource))upgradeSource=[];
  upgradeSource=upgradeSource.map(item=>typeof item==='string'?item:item&&item.id).filter(Boolean);
  const upgrades=[...new Set(upgradeSource.filter(id=>(id==='doublebet2'&&passives.includes('doublebet'))||(validPassives.has(id)&&passives.includes(id))))];
  if(upgrades.length<upgradeSource.length)warnings.push('已略過無法對應的強化');
  const savedPassivePaid=src.passivePaid&&typeof src.passivePaid==='object'?src.passivePaid:{};
  const passivePaid=Object.fromEntries(passives.map(id=>[id,saveNumber(savedPassivePaid[id],0,0,1000000000000)]));
  const validAffixes=new Set(PASSIVE_AFFIXES.map(a=>a.id)),savedPassiveAffixes=src.passiveAffixes&&typeof src.passiveAffixes==='object'?src.passiveAffixes:{};
  const passiveAffixes=Object.fromEntries(passives.map(id=>[id,savedPassiveAffixes[id]]).filter(([,affix])=>validAffixes.has(affix)));
  const sealedPassive=passives.includes(src.sealedPassive)&&src.sealedPassive!=='bloodpact'&&passiveAffixes[src.sealedPassive]!=='ghost'?src.sealedPassive:null;
  const maxhp=saveNumber(player.maxhp??player.maxHp??src.maxhp,START_HP,1,1000000);
  const hp=saveNumber(player.hp??player.health??src.hp,maxhp,1,maxhp);
  let floor=saveNumber(src.floor??src.stage??src.level??src.depth,1,0,100000);
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
  const maxHpPurchases=src.maxHpPurchases==null?Math.max(0,Math.floor((maxhp-START_HP)/20)):saveNumber(src.maxHpPurchases,0,0,100000);
  const savedRankDamage=src.rankDamage&&typeof src.rankDamage==='object'?src.rankDamage:{};
  const rankDamage=Object.fromEntries(CARD_RANKS.map(r=>[String(r),saveNumber(savedRankDamage[String(r)],100,100,1000000)]));
  const savedRankFlatDamage=src.rankFlatDamage&&typeof src.rankFlatDamage==='object'?src.rankFlatDamage:{};
  const rankFlatDamage=Object.fromEntries(CARD_RANKS.map(r=>[String(r),saveNumber(savedRankFlatDamage[String(r)],0,0,1000000)]));
  const legendaryShopChapter=Number.isInteger(src.legendaryShopChapter)?src.legendaryShopChapter:null;
  const faction=saveNumber(src.faction??src.alignment,0,-1000000,1000000);
  const savedMiracle=['holy','dark'].includes(src.miracleAlignment)?src.miracleAlignment:null;
  const miracleAlignment=savedMiracle||(faction>=1000?'holy':faction<=-1000?'dark':null);
  if(raw.format!==SAVE_FORMAT||raw.saveVersion!==SAVE_VERSION)warnings.push('已使用相容模式復原舊版本存檔');
  return {
    state:{hp,maxhp,gold:saveNumber(player.gold??player.coins??player.money??src.gold??src.money,0,0,1000000000000),floor,poison:0,control:saveNumber(src.control,BALANCE.controlMax,0,BALANCE.controlMax),
      eventChance:Math.min(1,Math.max(BASE_EVENT_CHANCE,Number(src.eventChance)||BASE_EVENT_CHANCE)),shopChance:Math.min(1,Math.max(BASE_SHOP_CHANCE,Number(src.shopChance)||BASE_SHOP_CHANCE)),altarSeen:src.altarSeen===true,churchSeen:src.churchSeen===true,faction,miracleAlignment,bloodDescendant:src.bloodDescendant===true,miracleReviveUsed:src.miracleReviveUsed===true,restCrab:src.restCrab===true,nodeType:['faithNecklaceIntro','battle','duckBattle','shop','rest','ordinaryChurch','darkChurch','ordinaryChurchBattle','darkChurchBattle','squirrelNest','squirrelNestBattle','treasureChest','treasureChestBattle','bloodAltar','bloodAltarDeclined','bloodInvitationAltar','bloodInvitationBoss','altarBattle','altarExam','bossDemon','bossExam','altarReward','boss'].includes(src.nodeType)?src.nodeType:null,
      nodeStarted:src.nodeStarted===true,
      character:character&&character.id,passives,passivePaid,passiveAffixes,sealedPassive,upgrades,suitMastery:mastery,bountyHunt,deck,deckEdits:saveNumber(src.deckEdits,0,0,100000),maxHpPurchases,rankDamage,rankFlatDamage,legendaryShopChapter,battle:null},
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
  if(allowCourt&&G&&hasP('court')){
    const seen=new Set();
    for(let i=0;i<hand.length;i++){
      if(['J','Q','K'].includes(hand[i].r))seen.add(hand[i].r);
      if(seen.size===3)return i===hand.length-1?21:22;
    }
  }
  let total=0,soft=0;
  for(const c of hand){
    if(c.r==='A'){soft++;total+=11;}
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
function maxHpPrice(){return Math.min(1000000000,price(Math.round(90*Math.pow(BALANCE.maxHpGrowth,G.maxHpPurchases||0))));}
function rankDamagePercent(rank){return Math.max(100,Math.round(G&&G.rankDamage&&G.rankDamage[String(rank)]||100));}
function rankFlatBonus(rank){return Math.max(0,Math.round(G&&G.rankFlatDamage&&G.rankFlatDamage[String(rank)]||0));}
function rankBoostPrice(){return price(55);}
function rankDamageBase(hand){
  if(!hand.length)return 0;
  const values=hand.map(c=>c.r==='A'?11:['J','Q','K'].includes(c.r)?10:c.r);
  let total=values.reduce((sum,n)=>sum+n,0),soft=hand.reduce((n,c)=>n+(c.r==='A'),0);
  while(total>21&&soft>0){const i=hand.findIndex((c,index)=>c.r==='A'&&values[index]===11);if(i<0)break;values[i]=1;total-=10;soft--;}
  const actual=handTotal(hand),scale=actual===21&&hasP('court')&&hasCourt(hand)&&total>0?21/total:1;
  return values.reduce((sum,value,i)=>sum+value*rankDamagePercent(hand[i].r)/100+rankFlatBonus(hand[i].r),0)*scale;
}
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
function controlCostFor(id,upgraded){
  if(id==='redraw'||id==='peek')return upgraded?3:6;
  if(id==='cardsharp')return upgraded?2:3;
  if(id==='suitmage')return upgraded?3:4;
  return Infinity;
}
function currentControlCost(id){return controlCostFor(id,isUp(id));}
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
function clearPlayerCombatStatuses(){
  G.poison=0;const b=G.battle;if(!b||b.over)return;
  if((b.stolenUpgrades||[]).length)cultistRestoreUpgrade(null,'由神蹟歸還');
  const persistentCourtLocks=b.obsidianCourt&&!b.cthulhuPhase?[...(b.lockedSkills||[])]:[];b.lockedSkill=null;b.lockedSkills=persistentCourtLocks;
  const permanentBrand=b.cthulhuPhase?Math.max(0,b.disciplineBrand||0):0;
  Object.assign(b,{defense:0,focus:0,guardStreak:0,weakness:playerWeaknessFloor(),hesitation:0,buffSuppressed:0,corruption:0,sepsis:0,bleed:0,fracture:0,burn:0,burnTicks:0,trauma:0,traumaFresh:false,traumaDecayTicks:0,blind:0,hallucination:0,mentalDisorder:0,bloodDamageStacks:0,disciplineBrand:permanentBrand});
}
function tryHolyMiracleRevive(fromAbyss=false){
  if(G.hp>0||miracleType()!=='holy'||G.miracleReviveUsed)return false;
  G.miracleReviveUsed=true;G.hp=Math.max(1,Math.round(G.maxhp*0.30));clearPlayerCombatStatuses();SFX.win();
  if(fromAbyss&&G.battle&&G.battle.cthulhuPhase)G.battle.abyssDistance=5;
  if(G.battle&&!G.battle.over)log(`✨ 聖輝眷顧：從死亡中復甦，生命回復至 ${G.hp} HP；所有正面與負面狀態歸零！`,'gd');
  setSaveStatus('聖輝眷顧的唯一復活機會已消耗。');renderTop();return true;
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
  if(G.hp<=0){if(tryHolyMiracleRevive())return false;gameOver();return true;}return false;
}
function doublebetMastered(){return G.upgrades.includes('doublebet2')&&!upgradeStolen('doublebet')&&!skillIsLocked('doublebet');}
function playerThirstStacks(){return Math.max(0,Number(G.battle&&G.battle.thirst)||(hasP('bloodpact')?Math.ceil(5*statusGainMultiplier()):0));}
function thirstMultiplier(){return 1+playerThirstStacks()*0.1;}
function naturalHealingBlocked(){return hasP('bloodpact');}
function playerMaxHpGain(base){return Math.max(0,Math.round(Math.max(0,base||0)*(ownsP('bloodpact')&&!bloodDescendantActive()?0.5:1)));}
function bountyGambleProfile(){
  return doublebetMastered()?{even:0,bustPenalty:true}:null;
}
function bountyGambleMultiplier(total){
  if(total%2===0)return 0;
  if(total===21)return 2;
  if(total===19)return 1.75;
  if(total===17)return 1.5;
  if(total>=13&&total<=15)return 1.25;
  return 1;
}
function hesitationLimit(){
  return !G.battle||(G.battle.hesitation||0)<=0?Infinity:G.battle.hesitation;
}
function statusGainMultiplier(){return hasP('howdidwegethere')?(isUp('howdidwegethere')?2:1.5):1;}
function playerWeaknessFloor(){return hasP('howdidwegethere')?3:0;}
function currentWeaknessStacks(){return Math.max(playerWeaknessFloor(),G.battle&&G.battle.weakness||0);}
function intimidationMult(){
  return !G.battle?1:Math.max(0.1,1-Math.min(9,currentWeaknessStacks())*0.1);
}
function applyDragonIntimidation(source,e=null){
  const b=G.battle;if(!b)return;
  const gained=addWeakness(e,4),stacks=currentWeaknessStacks();log(`🐲 ${source}施加虛弱 +${gained}（目前 ${stacks}/9，下一次攻擊 −${stacks*10}%）。`,gained?'dmg':'good');
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
const inventoryPassives=()=>G.passives.filter(id=>id!=='bloodpact');
const miracleBlocked=()=>!!G.bloodDescendant;
function syncMiracleAlignment(){
  if(!G)return null;
  if(miracleBlocked()){G.miracleAlignment=null;return null;}
  const faction=G.faction||0,current=G.miracleAlignment;
  if(current==='holy'&&faction<900)G.miracleAlignment=null;
  else if(current==='dark'&&faction>-900)G.miracleAlignment=null;
  if(!G.miracleAlignment){
    if(faction>=1000)G.miracleAlignment='holy';
    else if(faction<=-1000)G.miracleAlignment='dark';
  }
  return G.miracleAlignment||null;
}
function miracleType(){return syncMiracleAlignment();}
const HOLY_HOSTILES=['cultist','gargoyle','disciplineGargoyle','punishmentGargoyle','cultLeader','cthulhu'];
const DARK_HOSTILES=['paladin','inquisitorMounted','inquisitor'];
function faithNecklaceHostile(e){const miracle=miracleType();return !!(e&&((miracle==='holy'&&HOLY_HOSTILES.includes(e.type))||(miracle==='dark'&&DARK_HOSTILES.includes(e.type))));}
function advanceFaithNecklace(){
  if(!hasP('faithneck')||bloodDescendantActive())return 0;
  const faction=G.faction||0;if(Math.abs(faction)<100)return 0;
  const amount=isUp('faithneck')?100:50,delta=faction>0?amount:-amount,applied=changeFaction(delta);
  log(`📿 信仰項鍊：信仰朝當前方向更加堅定${ownsP('bloodpact')?`（鮮血契約減半為 ${Math.abs(applied)}）`:''}。`,'good');return applied;
}
const activeInventoryPassives=()=>inventoryPassives().filter(id=>id!==G.sealedPassive);
const currentPassiveLimit=()=>PASSIVE_LIMIT+(miracleType()==='dark'?1:0);
const passiveAffixId=id=>G&&G.passiveAffixes&&G.passiveAffixes[id]||null;
const passiveAffixInfo=(id,affixId=passiveAffixId(id))=>PASSIVE_AFFIXES.find(a=>a.id===affixId)||null;
function passiveSlotCost(id,affixId=passiveAffixId(id)){
  const base=Math.max(1,Number((ALL_PASSIVES.find(p=>p.id===id)||{}).slots)||1);
  return Math.max(0,base-(affixId==='ghost'?1:0));
}
const activePassiveSlots=()=>activeInventoryPassives().reduce((sum,id)=>sum+passiveSlotCost(id),0);
const passiveInventoryFull=(required=1)=>activePassiveSlots()+Math.max(0,required)>currentPassiveLimit();
function passiveSellValue(id){
  const p=ALL_PASSIVES.find(item=>item.id===id);if(!p||id==='bloodpact')return 0;
  let value;
  if(p.resale==='market')value=Math.max(1,Math.round((p.cost||0)*shopFloorMultiplier()*0.5));
  else{
    const paid=Math.max(0,Number(G.passivePaid&&G.passivePaid[id])||0);
    value=Math.max(1,Math.round(paid>0?paid*0.5:(p.cost||0)*0.25));
  }
  return passiveAffixId(id)==='gilded'?Math.max(1,Math.round(value*1.1)):value;
}
const BLOOD_TRINITY=['vampire','bloodpact','laststand'];
const bloodTrinityActive=()=>bloodDescendantActive()&&BLOOD_TRINITY.every(ownsP);
const bloodTrinityProtected=id=>bloodTrinityActive()&&BLOOD_TRINITY.includes(id);
const factionSealProtected=id=>(id==='bloodpact'&&ownsP('bloodpact'))||bloodTrinityProtected(id);
const hostileSealProtected=id=>id==='faithneck'||factionSealProtected(id);
const bloodContractSuppresses=id=>id==='antidote'&&bloodDescendantActive()&&ownsP('bloodpact');
const bloodContractName=()=>bloodDescendantActive()?'血魔契約':'鮮血契約';
const lockedSkillIds=()=>{const b=G.battle;if(!b||b.over)return [];return [...new Set([b.lockedSkill,...(b.lockedSkills||[]).map(x=>typeof x==='string'?x:x.id)].filter(Boolean))];};
const lockedSkillId=()=>lockedSkillIds()[0]||null;
const skillIsLocked=id=>lockedSkillIds().includes(id)&&!hostileSealProtected(id);
const hasP=id=>ownsP(id)&&G.sealedPassive!==id&&!skillIsLocked(id)&&!bloodContractSuppresses(id);
const activeAffixCount=affixId=>G.passives.reduce((count,id)=>count+(hasP(id)&&passiveAffixId(id)===affixId?1:0),0);
const affixAttackFlat=()=>activeAffixCount('hidden_weapon')*2;
const affixDefenseFlat=()=>activeAffixCount('lining')*2;
const affixAttackMult=()=>1+activeAffixCount('sharp')*.01;
const affixDefenseMult=()=>1+activeAffixCount('guardian')*.01;
function affixBadge(affixId){const a=PASSIVE_AFFIXES.find(x=>x.id===affixId);return a?`<span class="rarity rarity-${a.rarity}" title="${a.desc}">${a.icon} ${a.name}</span>`:'';}
function passiveNameWithAffix(id,affixId=passiveAffixId(id)){
  const p=ALL_PASSIVES.find(x=>x.id===id),a=PASSIVE_AFFIXES.find(x=>x.id===affixId);
  return `${a?`${a.icon} ${a.name}・`:''}${p?p.name:id}`;
}
const PASSIVE_CONFLICTS={antidote:['howdidwegethere'],howdidwegethere:['antidote']};
const passiveConflictsWithOwned=id=>(PASSIVE_CONFLICTS[id]||[]).some(other=>G.passives.includes(other));
const upgradeStolen=id=>!!(G.battle&&!G.battle.over&&(G.battle.stolenUpgrades||[]).some(x=>x.id===id)&&!hostileSealProtected(id));
const upgradesGloballySealed=id=>!!(G.battle&&!G.battle.over&&G.battle.obsidianCourt&&!G.battle.cthulhuPhase&&(G.battle.upgradeReprieve||0)<=0&&!hostileSealProtected(id));
const isUp=id=>G.upgrades.includes(id)&&!upgradeStolen(id)&&!upgradesGloballySealed(id)&&!skillIsLocked(id)&&!bloodContractSuppresses(id);

function sealCandidates(){return inventoryPassives().filter(id=>!factionSealProtected(id)&&passiveAffixId(id)!=='ghost');}
function openSealChoice(after=()=>{}){
  const candidates=sealCandidates();
  if(!candidates.length){after();return;}
  G._afterSealChoice=after;
  $('seal-choice-list').innerHTML=candidates.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return `<button class="b-stand" data-seal="${id}">${p?p.icon:''} 封存${passiveNameWithAffix(id)}</button>`;}).join('');
  $('seal-choice-list').querySelectorAll('[data-seal]').forEach(btn=>btn.onclick=()=>{
    G.sealedPassive=btn.dataset.seal;$('seal-choice').classList.add('hidden');
    const next=G._afterSealChoice||(()=>{});G._afterSealChoice=null;renderTop();next();
  });
  $('seal-choice').classList.remove('hidden');
}
function restoreArchivedIfFits(reason='被動欄已有空位'){
  if(!G.sealedPassive||passiveInventoryFull(passiveSlotCost(G.sealedPassive)))return false;
  const id=G.sealedPassive,p=ALL_PASSIVES.find(x=>x.id===id);G.sealedPassive=null;
  setSaveStatus(`${reason}，${p?p.name:id}已解除封存。`);return true;
}
function reconcileMiracle(before,after=()=>{},previousFaction=null){
  const now=miracleType();
  restoreArchivedIfFits('被動欄目前可以容納封存裝備');
  if(before!==now){
    const message=now==='holy'?'獲得神蹟卡牌「聖輝眷顧」。':now==='dark'?'獲得神蹟卡牌「深淵餽贈」。':before?'持有的神蹟卡牌已消散。':'';
    if(message)setSaveStatus(message);
  }else if(now&&Math.abs(G.faction||0)>=900&&Math.abs(G.faction||0)<=999&&(previousFaction==null||Math.abs(G.faction||0)<Math.abs(previousFaction))){
    setSaveStatus('祂的視線正在減少。');
  }
  renderTop();
  if(now!=='dark'&&activePassiveSlots()>PASSIVE_LIMIT&&!G.sealedPassive){openSealChoice(after);return;}
  after();
}
function adjustedFactionDelta(delta,fullEfficiency=false){
  if(bloodDescendantActive())return 0;
  if(fullEfficiency||!ownsP('bloodpact'))return Math.round(delta||0);
  const value=Math.abs(Number(delta)||0);return Math.sign(delta)*Math.round(value*.5);
}
function changeFaction(delta,after=()=>{},fullEfficiency=false){
  const before=miracleType(),previousFaction=G.faction||0,applied=adjustedFactionDelta(delta,fullEfficiency);G.faction=previousFaction+applied;
  const b=G.battle;if(b&&b.inquisitorPhase===2&&!b.bloodJudgment){b.sinValue=Math.min(b.sinCap||0,Math.max(0,-G.faction-800));refreshInquisitorSinDamage();}
  reconcileMiracle(before,after,previousFaction);return applied;
}
function shiftFactionTowardZero(amount=50,after=()=>{}){
  const faction=G.faction||0,delta=faction>0?-Math.min(amount,faction):faction<0?Math.min(amount,-faction):0;
  changeFaction(delta,after);
}
function grantBloodPact(after=()=>{}){
  const before=miracleType();
  let lost=0;
  if(!ownsP('bloodpact')){
    G.passives.push('bloodpact');G.passivePaid=G.passivePaid||{};G.passivePaid.bloodpact=0;
    const oldMax=G.maxhp;G.maxhp=Math.max(1,Math.floor(G.maxhp*0.5));lost=oldMax-G.maxhp;G.hp=Math.min(G.hp,G.maxhp);
  }
  reconcileMiracle(before,()=>{if(lost>0)setSaveStatus(`簽下鮮血契約：最大生命減少 ${lost}，目前 ${G.hp}/${G.maxhp} HP。`);after();});
}

function renderPassives(){
  const miracle=miracleType(),miracleText=miracle==='holy'?' ✨ 聖輝眷顧':miracle==='dark'?' 🌑 深淵餽贈':'';
  $('passive-count-label').textContent=`🎴 啟用裝備欄 ${activePassiveSlots()}/${currentPassiveLimit()}${G.sealedPassive?' ＋ 封存 1 件':''}${ownsP('bloodpact')?' ＋ 特殊契約':''}${miracleText}`;
  if(!G.passives.length){$('ui-passives').innerHTML='<span class="empty">尚未持有，於商店購買被動卡牌。</span>';return;}
  $('ui-passives').innerHTML=G.passives.map(id=>{
    const p=ALL_PASSIVES.find(x=>x.id===id);const stolen=upgradeStolen(id),locked=skillIsLocked(id),sealed=G.sealedPassive===id,up=isUp(id);
    let txt=up&&p.descUp?p.descUp:p.desc,stars=up?' ⭐':'';
    const affix=passiveAffixInfo(id);if(affix)txt=`${affix.icon} ${affix.name}（${RARITY_INFO[affix.rarity].name}詞條）：${affix.desc}｜${txt}`;
    if(id==='doublebet'&&doublebetMastered()){txt+=`｜⭐⭐ 金錢狂賭：${DOUBLEBET_MASTERY_DESC}`;stars=' ⭐⭐';}
    if(stolen){txt=`🔒 強化暫時被邪教徒奪取｜${p.desc}`;stars=' 🔒';}
    if(id==='suitmage'&&G.suitMastery){const m=masteryInfo();txt+=`｜${m.icon} ${m.name}：${m.desc}`;stars=' ⭐⭐';}
    if(id==='suitmage'&&G.suitMastery==='mono'){const main=dominantSuit();txt+=main?`（目前主花色：${main}${suitName(main)}）`:'（目前沒有花色達到牌庫 40%）';}
    if(G.bloodDescendant&&id==='vampire'){txt='血魔後裔強化：成功攻擊時，回復造成傷害的 50% HP。';stars=' 🩸';}
    if(G.bloodDescendant&&id==='laststand'){txt='血魔後裔強化：HP 不高於 40% 時攻擊 ×1.8；成功攻擊會施加 1 層敗血。';stars=' 🩸';}
    if(G.bloodDescendant&&id==='bloodpact'){txt='血魔後裔強化：未來最大生命增長恢復 100%，但過去損失不返還；無法防禦；每回合結束自損最大 HP 2%；每次扣血使本場傷害倍率 +5%；淨化失效。';stars=' 🩸';}
    if(bloodContractSuppresses(id)){txt='🔒 被血魔契約壓制：本技能及其強化效果完全失效。';stars=' 🔒';}
    if(bloodTrinityProtected(id))txt=`🩸 血之三契：不可封印，強化不可被奪取。｜${txt}`;
    else if(id==='bloodpact')txt=`🩸 契約烙印：不可封印。｜${txt}`;
    if(locked){txt=`🔒 被石像鬼暫時封鎖｜${txt}`;stars=' 🔒';}
    if(sealed){txt=`📦 裝備已封存：不占用啟用欄位，效果暫停，但仍可在商店出售。｜${txt}`;stars=' 📦';}
    const displayName=id==='bloodpact'?bloodContractName():p.name;
    return `<div class="pcard-chip" title="${txt}"><div class="pn">${p.icon} ${affix?`${affix.icon} ${affix.name}・`:''}${displayName}${stars}</div><div class="pd">${txt}</div></div>`;
  }).join('')+(miracle==='holy'?`<div class="pcard-chip"><div class="pn">✨ 聖輝眷顧</div><div class="pd">30% 異常抗性；非吸血類回復量 ×2；致死時以 30% 最大生命復活一次並清除所有暫時狀態（${G.miracleReviveUsed?'本局已使用':'本局可用'}）。不占裝備欄。</div></div>`:miracle==='dark'?'<div class="pcard-chip"><div class="pn">🌑 深淵餽贈</div><div class="pd">一般裝備欄 +1。不占裝備欄。</div></div>':miracleBlocked()?'<div class="pcard-chip"><div class="pn">🩸 神蹟排斥</div><div class="pd">血魔後裔無法獲得教堂神蹟。</div></div>':'');
}

function renderTop(){
  $('ui-hp').textContent=Math.max(0,G.hp);$('ui-maxhp').textContent=G.maxhp;
  $('ui-gold').textContent=G.gold;$('ui-control').textContent=G.control;$('ui-floor').textContent=G.floor;
  if(G.floor===0){$('ui-map').innerHTML='<span class="node cur">第 0 層｜📿 命運的拾遺</span>';renderPassives();return;}
  const pos=chapterPosition(G.floor),chapter=chapterIndex(G.floor)+1;
  if(isBossFloor(G.floor))$('ui-map').innerHTML=`<span class="node cur">第 ${chapter} 大關｜${isUltimateBossFloor(G.floor)?'☯ 終極魔王':'👑 魔王'}</span>`;
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
function demonThirstStacks(e){return demonThirstActive(e)?5:0;}
function demonDrainRate(e){return demonGrowth(G.floor).drainRate*(1+demonThirstStacks(e)*.1)*sepsisMultiplier(G.battle);}
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
function samuraiAction(e){if((e.samuraiStep||0)===0)return 'iaido';return ['kesa','mikiri','tsubame'][((e.samuraiStep||0)-1)%3];}
function samuraiTsubameMult(e){return e.zanshin?0.95:0.8;}
function samuraiTsubameBreak(e){return e.zanshin?0.35:0.25;}
function prepareSamuraiDamage(e,base){
  const flow=Math.max(1,Math.round(base*1.5));e.samuraiParts=[];e.nextArmorBreak=0;
  if(e.samuraiAction==='iaido'){const damage=Math.max(1,Math.round(base*1.5*1.4));e.samuraiParts=[{kind:'iaido',damage,breakRate:.4,bleed:2}];}
  else if(e.samuraiAction==='kesa')e.samuraiParts=[{kind:'kesa',damage:flow,breakRate:0,bleed:1}];
  else if(e.samuraiAction==='tsubame'){
    if(e.returnBlade){const damage=Math.max(1,Math.round(base*1.5*.7));e.samuraiParts.push({kind:'return',damage,breakRate:.4,bleed:1});}
    const mult=samuraiTsubameMult(e),breakRate=samuraiTsubameBreak(e),damage=Math.max(1,Math.round(base*1.5*mult));
    e.samuraiParts.push({kind:'tsubame1',damage,breakRate,bleed:0},{kind:'tsubame2',damage,breakRate,bleed:2});
  }
  e.nextDmg=e.samuraiParts.reduce((sum,part)=>sum+part.damage,0);e.nextArmorBreak=e.samuraiParts.reduce((sum,part)=>sum+Math.round(part.damage*part.breakRate),0);
}
function kunGrowth(){return {tideStart:6,tideCap:16,tideStep:2,tideEvery:3,shieldBaseRate:0.16,shieldPerTide:0.01,maxHpGrowthRate:0.05,divineHealRate:0.06,coverEvery:8,passiveDamage:2};}
function kunAction(e,round){
  if(e.kunForcedAction){const action=e.kunForcedAction;e.kunForcedAction=null;return action;}
  if(round>1&&round%kunGrowth().coverEvery===0)return 'divinity';
  const roll=Math.random();return roll<0.45?'impact':roll<0.75?'devour':'pressure';
}
function kunShieldAmount(e){const kg=kunGrowth();return Math.max(1,Math.round(e.maxhp*(kg.shieldBaseRate+(e.northTide||0)*kg.shieldPerTide)));}
function advanceNorthTide(e){
  const kg=kunGrowth();
  if((e.northTide||0)<kg.tideCap){const before=e.northTide||0;e.northTide=Math.min(kg.tideCap,before+kg.tideStep);log(`🌊 北冥潮湧升 ${e.northTide-before} 層（目前 ${e.northTide}/${kg.tideCap}）。`,'dmg');return;}
  const gain=Math.max(1,Math.round((e.kunBaseMaxhp||e.maxhp)*kg.maxHpGrowthRate));e.maxhp+=gain;e.curhp+=gain;
  log(`🌊 滿潮再臨：鯤的生命上限與生命各提高 ${gain}（目前 ${e.curhp}/${e.maxhp}）。`,'dmg');
}
function pengAction(e){
  if((e.transitionPause||0)>0)return 'transition';
  if(e.pengForcedAction){const action=e.pengForcedAction;e.pengForcedAction=null;return action;}
  e.eclipseCooldown=Math.max(0,(e.eclipseCooldown||0)-1);
  if(e.eclipseCooldown<=0&&Math.random()<0.12){e.eclipseCooldown=5;return 'eclipse';}
  const roll=Math.random();return roll<0.30?'windblade':roll<0.55?'flamefeather':roll<0.80?'riftclaw':'rebirth';
}
function ultimateDispel(e){
  const removed=[];
  [['poison','中毒'],['bleed','流血'],['burn','燒傷'],['trauma','創傷'],['fracture','斷骨'],['sepsis','敗血'],['corruption','腐敗']].forEach(([key,name])=>{if((e[key]||0)>0){removed.push(name);e[key]=0;}});
  e.burnTicks=0;e.traumaFresh=false;return removed;
}
function addBlind(target,amount){return addLimitedStatus(target,'blind',amount,3);}
function burnwindActive(){return !!(G.battle&&G.battle.enemies.some(e=>e.type==='peng'&&e.curhp>0));}
function transformKunToPeng(e,cause='擊倒'){
  if(!e||e.type!=='kun'||e.pengTransformed)return false;
  const tide=Math.max(0,e.northTide||0),attackBonus=tide*0.02;
  e.type='peng';e.key='peng';e.name=ENEMIES.peng.name;e.img=IMG.peng;e.h=ENEMIES.peng.h;e.curhp=e.maxhp;e.shield=Math.max(1,Math.round(e.maxhp*0.15));e.statusResist=0.7;e.pengTransformed=true;
  e.pengAttackBonus=attackBonus;e.maxEvasion=8;e.evasion=3;e.foldable=false;e.dodgeCounter=null;e.broken=0;e.weakened=false;e.pengAction='transition';e.pengForcedAction=null;e.eclipseCooldown=3;e.transitionPause=1;e.justTransformed=true;
  const dispelled=ultimateDispel(e);
  log(`☯ ${cause}鯤的形體，北冥巨獸化而為鵬！生命回復至 ${e.maxhp}，展開 ${e.shield} 點化鵬護盾並停頓 1 回合。`,'gd');
  if(dispelled.length)log(`✨ 化鵬驅散：${dispelled.join('、')}。`,'dmg');
  log(`🌊 剩餘 ${tide} 層北冥潮化為垂天之力：鵬永久攻擊 +${Math.round(attackBonus*100)}%，並以 3/8 層閃避進入戰鬥。`,'dmg');
  log('🌪 焚風：燒傷需發作 4 次才減層、流血發作只減 1 層、創傷每 2 回合才自然減少 1 層。鵬可閃避但不會折翼。','dmg');
  ensureTarget();rollIntents();renderEnemies();return true;
}
const COURT_GARGOYLES=['disciplineGargoyle','punishmentGargoyle'];
function courtGargoylesAlive(){const b=G.battle;return b?b.enemies.filter(e=>COURT_GARGOYLES.includes(e.type)&&e.curhp>0):[];}
function cultLeaderAlive(){const b=G.battle;return b&&b.enemies.find(e=>e.type==='cultLeader'&&e.curhp>0);}
function cultFanaticismMultiplier(){const b=G.battle;return 1+Math.max(0,b&&b.fanaticism||0)*0.02;}
function addFanaticism(amount,reason=''){
  const b=G.battle;if(!b||!b.obsidianCourt||b.cthulhuPhase)return 0;
  const before=b.fanaticism;b.fanaticism=Math.max(0,Math.min(20,b.fanaticism+amount));const changed=b.fanaticism-before;
  if(changed)log(`🔥 狂信 ${changed>0?'+':''}${changed}（${b.fanaticism}/20）${reason?`：${reason}`:''}`,'dmg');return changed;
}
function courtAction(e){
  const cycles={
    disciplineGargoyle:['disciplineClaw','skillSeal','brandGaze','disciplineClaw'],
    punishmentGargoyle:['punishmentClaw','poisonPunishment','skillSeal','toxicWhip'],
    cultLeader:['blackScripture','blindSermon','sepsisRite','bloodDrain','profaneCommunion','obsidianAbsolution'],
  };
  const action=cycles[e.type][(e.courtStep||0)%cycles[e.type].length];
  return e.type==='cultLeader'&&action==='obsidianAbsolution'&&!courtGargoylesAlive().length?'blackScripture':action;
}
function cthulhuAction(e){return ['tentacleRend','namelessGaze','abyssResonance','starWhisper','deepPressure','abyssRegeneration'][(e.cthulhuStep||0)%6];}
function playerNegativeTypeCount(){
  const b=G.battle;if(!b)return 0;
  const numeric=[G.poison,b.corruption,b.sepsis,b.bleed,b.fracture,b.burn,b.trauma,b.blind,b.disciplineBrand,b.weakness,b.hesitation,b.hallucination,b.mentalDisorder];
  return numeric.filter(v=>(v||0)>0).length;
}
function applyDisciplineAction(actionType,bust=false){
  const b=G.battle;if(!b)return;const previousAction=b.lastPlayerAction;b.lastPlayerAction=actionType;
  if(b.inquisitorBattle&&bust)addInquisitorCrime(1,'爆牌');
  if(!b.obsidianCourt)return;
  const rawGain=bust&&b.cthulhuPhase?2:(previousAction===actionType?1:-1),gain=rawGain>0?Math.ceil(rawGain*statusGainMultiplier()):rawGain;
  b.disciplineBrand=Math.max(0,Math.min(3,(b.disciplineBrand||0)+gain));
  if(gain!==0)log(`📿 戒律烙印 ${gain>0?'+':''}${gain}（${b.disciplineBrand}/3）。`,gain>0?'dmg':'good');
  if(b.disciplineBrand>=3)triggerDisciplinePunishment();
}
function amplifyPlayerStackStatuses(){
  const b=G.battle;
  const poison=Math.ceil(G.poison*1.5)-G.poison;if(poison>0)G.poison+=poison;
  [['corruption',3],['sepsis',5],['fracture',3],['blind',3]].forEach(([k,cap])=>{b[k]=Math.min(cap,Math.ceil((b[k]||0)*1.5));});
  const bleedAdd=Math.ceil((b.bleed||0)*1.5)-(b.bleed||0),burnAdd=Math.ceil((b.burn||0)*1.5)-(b.burn||0);
  if(bleedAdd>0)addBleed(b,bleedAdd);if(burnAdd>0)addBurn(b,burnAdd);
  b.trauma=Math.ceil((b.trauma||0)*1.5);
  b.weakness=Math.min(9,Math.ceil((b.weakness||0)*1.5));
  b.hallucination=Math.min(5,Math.ceil((b.hallucination||0)*1.5));
  b.mentalDisorder=Math.min(5,Math.ceil((b.mentalDisorder||0)*1.5));
  if((b.hesitation||0)>0)b.hesitation=Math.max(1,Math.floor(b.hesitation/1.5));
}
function triggerDisciplinePunishment(){
  const b=G.battle;if(!b)return;
  amplifyPlayerStackStatuses();
  const leaderBase=cultLeaderAlive()?.baseNextDmg||Math.round((ENEMIES.cultLeader.atk[0]+ENEMIES.cultLeader.atk[1])/2*floorScaling(G.floor).atk);
  const extra=Math.max(1,Math.round(leaderBase*(b.disciplinePunishMult||1.5)));
  const resolved=resolveDefenseDamage(extra,b.defense,0);b.defense=resolved.defenseLeft;losePlayerHp(resolved.net);
  b.enemies.filter(e=>e.curhp>0).forEach(e=>{e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*.05)));e.shield=(e.shield||0)+Math.max(1,Math.round(e.maxhp*.10));});
  if(b.cthulhuPhase)b.abyssDistance=Math.max(0,(b.abyssDistance||0)-2);
  log(`⚖️ 戒律懲罰：負面層數放大，受到 ${resolved.net} 傷害；敵方全體回復 5% 並獲得 10% 永久護盾${b.cthulhuPhase?'，深淵距離 −2':''}。`,'dmg');
  b.disciplinePunishMult=(b.disciplinePunishMult||1.5)+.5;b.disciplineBrand=1;
}
function onCourtGargoyleDeath(e,linked=false){
  if(!e||e.courtDeathHandled)return;e.courtDeathHandled=true;releaseCourtLock(e.idx);if(linked)return;
  if(e.type==='disciplineGargoyle'){const leader=cultLeaderAlive();if(leader)leader.disciplineDeathBonus=(leader.disciplineDeathBonus||0)+.25;addFanaticism(-5,'戒律石像鬼崩毀');log('🗿 戒律遺命：教宗永久攻擊 +25%。','dmg');}
  if(e.type==='punishmentGargoyle'){G.poison=Math.max(0,G.poison||0)*2;addFanaticism(-5,'刑罰石像鬼崩毀');log(`☠ 刑罰遺毒：中毒層數翻倍為 ${G.poison}。`,'dmg');}
}
function transformCultLeaderToCthulhu(cause='擊倒'){
  const b=G.battle;if(!b||b.cthulhuPhase)return false;
  const leader=b.enemies.find(e=>e.type==='cultLeader');if(!leader)return false;leader.justTransformed=true;
  courtGargoylesAlive().forEach(e=>{e.curhp=0;onCourtGargoyleDeath(e,true);});b.lockedSkills=[];b.lockedSkill=null;
  const t=scaledEnemy('cthulhu',1,G.floor);t.maxhp=t.curhp=b.courtTotalMaxHp;t.statusResist=.7;t.shield=0;t.cthulhuStep=0;t.cthulhuAction='tentacleRend';t.inheritedFanaticism=b.fanaticism||0;
  b.enemies=[t];b.target=t.idx;b.cthulhuPhase=true;b.upgradeReprieve=0;b.abyssDistance=10;b.abyssMax=20;b.mentalDisorder=0;
  log(`🕳️ ${cause}教宗的肉身，祭儀卻已完成——邪神・克蘇魯以 ${t.maxhp} HP 降臨！`,'dmg');
  log(`🔥 凍結的 ${t.inheritedFanaticism} 層狂信使克蘇魯攻擊 +${t.inheritedFanaticism*2}%；深淵距離 10/20。升級封印與石像封鎖已解除。`,'dmg');
  ensureTarget();rollIntents();syncButtons();renderEnemies();return true;
}
const INQUISITOR_LEADERS=['inquisitorMounted','inquisitor'];
function inquisitorLeader(){const b=G.battle;return b&&b.enemies.find(e=>INQUISITOR_LEADERS.includes(e.type)&&e.curhp>0);}
function inquisitorUnits(){const b=G.battle;return b?b.enemies.filter(e=>e.curhp>0&&(INQUISITOR_LEADERS.includes(e.type)||e.inquisitorEscort)):[];}
function mountedMomentumMultiplier(e){return 1+Math.max(0,Math.min(25,e&&e.momentum||0))*.03;}
function inquisitorSinValue(){return Math.max(0,G.battle&&G.battle.inquisitorPhase===2?G.battle.sinValue||0:0);}
function inquisitorSinMultiplier(e,judgment=false){
  const per100=INQUISITOR_LEADERS.includes(e.type)?(judgment ? 0.05 : 0.02):(judgment ? 0.025 : 0.01);
  return 1+inquisitorSinValue()/100*per100;
}
function refreshInquisitorSinDamage(){
  const b=G.battle;if(!b||b.inquisitorPhase!==2)return;
  b.enemies.filter(e=>e.curhp>0).forEach(e=>{
    const base=e.baseNextDmg;if(!base)return;
    if(e.type==='inquisitor')e.nextDmg=inquisitorFootDamage(e,base);
    else if(e.inquisitorEscort&&e.inquisitorSync==='verdictStrike')e.nextDmg=Math.max(1,Math.round(base*1.25*inquisitorSinMultiplier(e,true)));
    else if(e.inquisitorEscort&&!e.inquisitorSync&&e.paladinAction!=='guard'){const own=e.paladinAction==='judgment'?paladinGrowth(G.floor).judgmentMult:1;e.nextDmg=Math.max(1,Math.round(base*own*inquisitorSinMultiplier(e,false)));}
  });
}
function addInquisitorCrime(points,reason=''){
  const b=G.battle;if(!b||!b.inquisitorBattle||points<=0)return 0;
  if(b.inquisitorPhase===1){const gained=Math.max(1,Math.round(points));b.crime=(b.crime||0)+gained;log(`⚖️ 罪證 +${gained}（${b.crime}）${reason?`：${reason}`:''}`,'dmg');return gained;}
  const wanted=Math.max(1,Math.round(points*80)),before=b.sinValue||0;b.sinValue=Math.min(b.sinCap||0,before+wanted);const gained=b.sinValue-before;
  if(!b.bloodJudgment&&gained>0)changeFaction(-gained,()=>{},true);
  if(gained>0)refreshInquisitorSinDamage();
  if(gained>0)log(`⚖️ 再犯：罪惡值 +${gained}（${b.sinValue}/${b.sinCap}）${reason?`：${reason}`:''}`,'dmg');
  return gained;
}
function crimePointsForStatusStrength(strength){return strength>=15?5:strength>=10?4:strength>=6?3:strength>=3?2:strength>0?1:0;}
function addInquisitorStatusCrime(strength,reason='施加負面狀態'){
  const points=crimePointsForStatusStrength(Math.max(0,strength||0));return points?addInquisitorCrime(points,reason):0;
}
function halveEnemyNegativeStatuses(e){
  const removed=[];[['poison','中毒'],['bleed','流血'],['fracture','斷骨'],['sepsis','敗血'],['burn','燒傷'],['corruption','腐敗'],['trauma','創傷']].forEach(([key,name])=>{
    const before=Math.max(0,e[key]||0);if(!before)return;const amount=Math.ceil(before*.5);e[key]=before-amount;removed.push(`${name} −${amount}`);
  });return removed;
}
function inquisitorMountedAction(e){return ['lance','trample','lance','proclamation','lance','chargePrep','charge'][(e.inquisitorStep||0)%7];}
function inquisitorFootAction(e){
  if((e.transitionPause||0)>0)return 'transition';
  if(e.judgmentPending)return 'judgment';
  return ['sentenceSword','pyre','interrogate','sentenceSword','confiscate','judgment'][(e.inquisitorStep||0)%6];
}
function inquisitorAction(e){return e.type==='inquisitorMounted'?inquisitorMountedAction(e):inquisitorFootAction(e);}
function inquisitorMountedDamage(e,base){
  const action=e.inquisitorAction,mult=action==='lance'?1.2:action==='trample'?1.05:action==='charge'?2.4:0;
  return mult?Math.max(1,Math.round(base*mult*mountedMomentumMultiplier(e)*(1+(G.battle.warcryStacks||0)*.25))):0;
}
function inquisitorFootDamage(e,base){
  const action=e.inquisitorAction,mult=action==='sentenceSword'?1.2:action==='pyre'?1.1:action==='interrogate'?1:action==='judgment'?1.4:0;
  return mult?Math.max(1,Math.round(base*mult*inquisitorSinMultiplier(e,action==='judgment'))):0;
}
function transformInquisitor(cause='擊倒'){
  const b=G.battle;if(!b||!b.inquisitorBattle||b.inquisitorPhase===2)return false;
  const e=b.enemies.find(x=>x.type==='inquisitorMounted');if(!e)return false;e.justTransformed=true;
  const baseMax=b.inquisitorFirstMax||e.maxhp,momentum=Math.max(0,Math.min(25,e.momentum||0)),next=scaledEnemy('inquisitor',e.idx,G.floor);
  e.type='inquisitor';e.key='inquisitor';e.name=next.name;e.img=next.img;e.h=next.h;e.atk=next.atk;e.maxhp=e.curhp=Math.max(1,Math.round(baseMax*(1.5+momentum*.05)));e.shield=0;e.statusResist=.7;
  Object.assign(e,{inquisitorStep:0,inquisitorAction:'transition',transitionPause:1,judgmentPending:true,momentum:0});ultimateDispel(e);
  b.inquisitorPhase=2;b.crimeFrozen=b.crime||0;b.bloodJudgment=bloodDescendantActive();
  if(b.bloodJudgment)b.judgmentFaith=-1200;
  else{changeFaction(-(b.crime||0)*100,()=>{},true);b.judgmentFaith=G.faction||0;}
  b.sinValue=Math.max(0,-b.judgmentFaith-800);b.sinCap=b.sinValue;b.redemptionUses=0;b.warcryStacks=0;
  b.enemies.filter(x=>x.inquisitorEscort&&x.curhp>0).forEach(x=>{x.curhp=x.maxhp;ultimateDispel(x);x.inquisitorSync=null;});
  log(`⚖️ ${cause}鐵騎後，異端審判長棄馬步戰！剩餘 ${momentum} 層馬勢使第二型態最大生命提高至 ${e.maxhp}。`,'dmg');
  log(`📜 ${b.bloodJudgment?'血魔以虛擬信仰 −1200 接受審判':`${b.crimeFrozen} 層罪證使信仰降至 ${G.faction}`}；罪惡值 ${b.sinValue}/${b.sinCap||0}。審判長暫停 1 回合，之後立即審判。`,'dmg');
  ensureTarget();rollIntents();syncButtons();renderEnemies();return true;
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
function werewolfAction(e){return ['claw','bite','claw','lick'][(e.werewolfStep||0)%4];}
function mimicAction(e){return ['venomBite','rendingTongue','boneCrush'][(e.mimicStep||0)%3];}
function mimicDamageMultiplier(action){return action==='boneCrush'?1.35:action==='rendingTongue'?1.1:1;}
function werewolfBiteMultiplier(){return Math.min(1.5,1.2+Math.max(0,G.battle&&G.battle.bleed||0)*.05);}
function werewolfHealRate(){return Math.min(.18,.10+Math.max(0,G.battle&&G.battle.bleed||0)*.01);}
function paladinDispel(e){
  const statuses=[['poison','中毒'],['bleed','流血'],['fracture','斷骨'],['sepsis','敗血'],['burn','燒傷'],['corruption','腐敗'],['trauma','創傷']],removed=[];
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
  if(bloodDescendantActive())return Math.random()<0.5?'cultist':'paladin';
  if(ownsP('bloodpact')&&Math.abs(G.faction||0)<80)return Math.random()<0.5?'cultist':'paladin';
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
function squirrelNestEncounter(floor){
  return Array.from({length:3},(_,i)=>{const e=scaledEnemy('squirrel',i,floor);e.name=`護巢松鼠 ${i+1}`;return e;});
}
function obsidianCourtEligible(){return (G.faction||0)>=800||ownsP('bloodpact');}
function obsidianCourtEncounter(floor){
  const order=['disciplineGargoyle','cultLeader','punishmentGargoyle'];
  const enemies=order.map((key,idx)=>scaledEnemy(key,idx,floor));
  enemies.forEach(e=>{e.statusResist=e.type==='cultLeader'?0.7:0.5;e.shield=0;});
  return enemies;
}
function inquisitorEncounter(floor){
  const left=scaledEnemy('paladin',0,floor),leader=scaledEnemy('inquisitorMounted',1,floor),right=scaledEnemy('paladin',2,floor);
  left.name='左翼聖騎士';right.name='右翼聖騎士';left.paladinStartStep=0;right.paladinStartStep=2;
  leader.statusResist=.7;leader.shield=0;leader.momentum=5;leader.inquisitorStep=0;leader.inquisitorAction='lance';
  return [left,leader,right];
}
function inquisitorEligible(){return bloodDescendantActive()||(G.faction||0)<=-800;}
function ultimateEncounter(floor){
  const entries=[{key:'kun',weight:1}];
  if(obsidianCourtEligible())entries.push({key:'court',weight:1});
  if(inquisitorEligible())entries.push({key:'inquisitor',weight:1});
  const pick=weightedBossKey(entries);
  return pick==='court'?obsidianCourtEncounter(floor):pick==='inquisitor'?inquisitorEncounter(floor):[scaledEnemy('kun',0,floor)];
}
function weightedBossKey(entries){const total=entries.reduce((sum,item)=>sum+item.weight,0);let roll=Math.random()*total;for(const item of entries){roll-=item.weight;if(roll<0)return item.key;}return entries[entries.length-1].key;}
function genEncounter(floor){
  if(isBossFloor(floor)){
    if(isUltimateBossFloor(floor))return ultimateEncounter(floor);
    const gargoyleAllowed=ownsP('bloodpact')||(G.faction||0)>=120;
    const bosses=[{key:'dragon',weight:1},{key:'demon',weight:1},{key:'samurai',weight:.85}];if(gargoyleAllowed)bosses.push({key:'gargoyle',weight:1});const bk=weightedBossKey(bosses);
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
  const discoveryRoll=Math.random();
  if(discoveryRoll<SQUIRREL_NEST_EVENT_CHANCE){G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);return 'squirrelNest';}
  if(discoveryRoll<SQUIRREL_NEST_EVENT_CHANCE+TREASURE_CHEST_EVENT_CHANCE){G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);return 'treasureChest';}
  const churchChance=Math.min(1,CHURCH_EVENT_CHANCE+(hasP('faithneck')?FAITH_NECK_CHURCH_BONUS:0));
  if(Math.random()<churchChance){G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);return Math.random()<0.5?'ordinaryChurch':'darkChurch';}
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
  if(G.floor===0&&!G.nodeType)G.nodeType='faithNecklaceIntro';
  if(!G.nodeType){G.nodeType=decideCurrentNode();G.nodeStarted=false;}
  if(['shop','rest','ordinaryChurch','darkChurch','ordinaryChurchBattle','darkChurchBattle','squirrelNest','squirrelNestBattle','treasureChest','treasureChestBattle','bloodAltar','bloodAltarDeclined','bloodInvitationAltar','altarBattle','altarExam','altarReward'].includes(G.nodeType))G.eventChance=BASE_EVENT_CHANCE;
  renderTop();
  if(G.nodeType==='faithNecklaceIntro'){openFaithNecklaceIntro();return;}
  if(G.nodeType==='shop'){openShop();return;}
  if(G.nodeType==='duckBattle'){startDuck(G.floor);return;}
  if(G.nodeType==='rest'){openRestEvent();return;}
  if(G.nodeType==='ordinaryChurch'){openChurchEvent('ordinary');return;}
  if(G.nodeType==='darkChurch'){openChurchEvent('dark');return;}
  if(G.nodeType==='ordinaryChurchBattle'){startBattle('ordinaryChurch');return;}
  if(G.nodeType==='darkChurchBattle'){startBattle('darkChurch');return;}
  if(G.nodeType==='squirrelNest'){openSquirrelNestEvent();return;}
  if(G.nodeType==='squirrelNestBattle'){startBattle('squirrelNest');return;}
  if(G.nodeType==='treasureChest'){openTreasureChestEvent();return;}
  if(G.nodeType==='treasureChestBattle'){startBattle('treasureMimic');return;}
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
function restoreControl(amount=BALANCE.controlRestore){const before=G.control;G.control=Math.min(BALANCE.controlMax,G.control+amount);return G.control-before;}
function advanceNode(controlRestore=BALANCE.controlRestore){restoreControl(controlRestore);G.floor++;G.nodeType=null;G.nodeStarted=false;G.restCrab=false;enterCurrentNode();}
function completeEvent(){advanceNode();}
function openRestEvent(){
  const fixed=isRestFloor(G.floor);
  if(!G.nodeStarted)G.restCrab=Math.random()<CRAB_REST_CHANCE;
  const crab=G.restCrab===true;
  let message=crab?'一群在沙灘上跳舞的螃蟹。':fixed?'你已在營火旁休整，整理牌組並準備迎戰下一格的魔王。':'你在旅途中找到一處安全營火。';
  if(!G.nodeStarted){
    if(naturalHealingBlocked())message=crab?`一群在沙灘上跳舞的螃蟹。${bloodContractName()}阻止了自然恢復，但你仍可隨著起舞。`:fixed?`${bloodContractName()}阻止了自然恢復；你仍整理好裝備，準備迎戰魔王。`:`${bloodContractName()}阻止了營火帶來的自然恢復。`;
    else{
      const rate=(fixed?0.30:0.20)+(crab?0.05:0),heal=fixed?Math.max(20,Math.round(G.maxhp*rate)):Math.max(10,Math.round(G.maxhp*rate)),result=healPlayer(heal);
      message=crab?`一群在沙灘上跳舞的螃蟹。你隨著起舞，回復 ${result.healed} HP${fixed?'，下一格必定遭遇魔王':''}。`:`你在營火旁回復 ${result.healed} HP${fixed?'，下一格必定遭遇魔王':''}。`;
    }
    G.nodeStarted=true;
  }
  $('event-title').textContent=crab?'🦀 沙灘舞會':fixed?`🔥 第 ${chapterIndex(G.floor)+1} 大關休息營地`:'🔥 途中營火';
  $('event-visual').classList.remove('hidden');$('event-image').src=crab?EVENT_IMG.crabRest:EVENT_IMG.campfire;$('event-image').alt=crab?'在沙灘上跳舞的螃蟹':'燃燒中的營火';
  $('event-desc').textContent=`${message} 離開休息格時回復 6 控制值。`;$('event-actions').innerHTML=`<button class="b-next" id="btn-event-continue">${crab?'隨著起舞':'休息後繼續'} ➜</button>`;
  $('btn-event-continue').onclick=()=>advanceNode(6);show('event');renderTop();
}
function squirrelNestSearchGold(){return Math.max(15,Math.round(floorReward(G.floor,false)*1.3));}
function squirrelNestVictoryGold(){return Math.max(30,Math.round(floorReward(G.floor,false)));}
function openSquirrelNestEvent(){
  G.nodeStarted=true;$('event-title').textContent='🐿️ 松鼠窩';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.squirrelNest;$('event-image').alt='堆滿果實與亮晶晶物品的松鼠窩';
  $('event-desc').textContent='樹洞裡塞滿堅果、落葉與幾枚閃亮的金幣。你可以冒險翻找，也可以安靜離開。';
  $('event-actions').innerHTML='<button class="b-magic" id="squirrel-search">翻找松鼠窩</button><button class="b-ghost" id="squirrel-leave">離開</button>';
  $('squirrel-search').onclick=()=>{
    const found=squirrelNestSearchGold();G.gold+=found;SFX.coin();renderTop();
    if(Math.random()<SQUIRREL_AMBUSH_CHANCE){
      G._squirrelNestFoundGold=found;G.nodeType='squirrelNestBattle';G.nodeStarted=false;startBattle('squirrelNest');return;
    }
    $('event-desc').textContent=`你翻出了 ${found} 金幣，附近的松鼠似乎都不在家。`;
    $('event-actions').innerHTML='<button class="b-next" id="squirrel-found-leave">帶著金幣離開 ➜</button>';
    $('squirrel-found-leave').onclick=completeEvent;
  };
  $('squirrel-leave').onclick=completeEvent;show('event');renderTop();
}
function grantTreasureChestReward(){
  const boosts=rollRankBoosts(5),notes=[];
  boosts.forEach(boost=>{
    const rank=String(boost.rank);
    if(boost.type==='flat'){G.rankFlatDamage[rank]=rankFlatBonus(rank)+2;notes.push(`${rank} 固定傷害 +2`);}
    else{G.rankDamage[rank]=rankDamagePercent(rank)+1;notes.push(`${rank} 倍率 +1%`);}
  });
  const base=floorReward(G.floor,false)*2;
  startBounty(false,base,'treasureChest');
  bountyLog(`🎁 寶箱的 5 項牌面強化：${notes.join('、')}。`,'gd');
  bountyLog(`💰 寶箱賞金以本層普通基礎賞金的 2 倍計算：${base} 金幣。`,'gd');
  renderBounty();renderTop();
}
function openTreasureChestEvent(){
  G.nodeStarted=true;$('event-title').textContent='🧰 神祕寶箱';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.treasureChest;$('event-image').alt='緊閉的奇幻寶箱';
  $('event-desc').textContent='一只沉重的寶箱靜靜躺在路中央。你可以直接離開，或冒險開啟它。';
  $('event-actions').innerHTML='<button class="b-magic" id="treasure-open">開啟寶箱</button><button class="b-ghost" id="treasure-leave">離開</button>';
  $('treasure-open').onclick=()=>{
    if(Math.random()<TREASURE_MIMIC_CHANCE){G.nodeType='treasureChestBattle';G.nodeStarted=false;startBattle('treasureMimic');return;}
    grantTreasureChestReward();
  };
  $('treasure-leave').onclick=completeEvent;show('event');renderTop();
}
function openFaithNecklaceIntro(){
  G.nodeType='faithNecklaceIntro';G.nodeStarted=true;$('event-title').textContent='📿 第 0 層・命運的拾遺';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.faithNecklace;$('event-image').alt='靜置於石階上的信仰項鍊';
  $('event-desc').textContent='啟程之前，你在無人注視的石階上發現一條信仰項鍊。你可以將它撿起，也可以不受其牽引，直接離開。';
  $('event-actions').innerHTML='<button class="b-magic" id="faith-intro-take">撿取信仰項鍊</button><button class="b-ghost" id="faith-intro-leave">離開</button>';
  const finish=take=>{
    if(take&&!ownsP('faithneck')){G.passives.push('faithneck');G.passivePaid.faithneck=0;SFX.coin();}
    G.floor=1;G.nodeType=null;G.nodeStarted=false;enterCurrentNode();
  };
  $('faith-intro-take').onclick=()=>finish(true);$('faith-intro-leave').onclick=()=>finish(false);show('event');renderTop();
}
function churchPrayerAllowed(kind){
  if(bloodDescendantActive())return false;
  const faction=G.faction||0;
  if(ownsP('bloodpact'))return kind==='ordinary'?faction>=80:faction<=-80;
  return kind==='ordinary'?faction>-100:faction<100;
}
function churchGoldReward(){return Math.max(40,Math.round(floorReward(G.floor,false)*1.5));}
function darkChurchGoldReward(){return Math.max(20,Math.round(churchGoldReward()*0.5));}
function openChurchEvent(kind){
  const ordinary=kind==='ordinary',canPray=churchPrayerAllowed(kind),hasContract=ownsP('bloodpact');
  G.nodeStarted=true;G.churchSeen=true;
  $('event-title').textContent=ordinary?'⛪ 一般教堂':'🕯 邪教堂';
  $('event-visual').classList.remove('hidden');$('event-image').src=ordinary?EVENT_IMG.ordinaryChurch:EVENT_IMG.darkChurch;$('event-image').alt=ordinary?'一般中世紀教堂':'黑暗邪教教堂';
  const prayerEffect=ordinary?'將生命回復至全滿':`獲得 ${darkChurchGoldReward()} 金幣並回復 9 控制值`;
  const blocked=bloodDescendantActive()?'血魔契約使雙方陣營都將你視為仇敵，無法祈禱或獲得神蹟。':hasContract?`鮮血契約使信仰變化減半；需達到 ${ordinary?'+80':'−80'} 信仰才能向此教堂祈禱。`:ordinary?'你對聖堂的敵意已突破門檻，暫時無法祈禱。':'你對邪教的敵意已突破門檻，暫時無法祈禱。';
  $('event-desc').textContent=`${ordinary?'鐘聲與燭光帶來短暫安寧。':'低語從黑色祭壇後傳來。'}祈禱可${prayerEffect}；破壞教堂將同時驚動兩名${ordinary?'聖騎士':'邪教徒'}。${canPray?'':blocked}`;
  $('event-actions').innerHTML=`${canPray?`<button class="b-magic" id="church-pray">祈禱：${prayerEffect}</button>`:''}<button class="b-stand" id="church-destroy">破壞教堂</button><button class="b-ghost" id="church-leave">路過</button>`;
  const pray=$('church-pray');if(pray)pray.onclick=()=>{
    if(ordinary){G.hp=G.maxhp;SFX.win();}
    else{G.gold+=darkChurchGoldReward();SFX.coin();}
    changeFaction(ordinary?100:-100,()=>advanceNode(ordinary?BALANCE.controlRestore:9));
  };
  $('church-destroy').onclick=()=>{
    changeFaction(ordinary?-200:200,()=>{G.nodeType=ordinary?'ordinaryChurchBattle':'darkChurchBattle';G.nodeStarted=false;startBattle(ordinary?'ordinaryChurch':'darkChurch');});
  };
  $('church-leave').onclick=()=>shiftFactionTowardZero(50,completeEvent);show('event');renderTop();
}
function openBloodAltarEvent(){
  const hasContract=ownsP('bloodpact');
  G.nodeStarted=true;$('event-title').textContent='🩸 鮮血祭壇';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.bloodAltar;$('event-image').alt='以鮮血繪製的儀式祭壇';
  $('event-desc').textContent=hasContract?`凝固的血液在祭壇上搏動。你已經持有${bloodContractName()}，祭壇不會產生第二份；現在只能摧毀祭壇或離開。`:'凝固的血液在祭壇上搏動。你可以簽下契約、摧毀祭壇挑戰受創的血魔，或立刻離開。簽約會立刻使最大生命減半，成為後裔前的未來最大生命增長也只有 50%。這座祭壇本局不會再次出現。';
  $('event-actions').innerHTML=`${hasContract?'':'<button class="b-magic" id="altar-take">拿取鮮血契約</button>'}<button class="b-stand" id="altar-destroy">破壞祭壇</button><button class="b-ghost" id="altar-leave">離開</button>`;
  const take=$('altar-take');if(take)take.onclick=()=>{SFX.win();grantBloodPact(completeEvent);};
  $('altar-destroy').onclick=()=>{G.nodeType='altarBattle';G.nodeStarted=false;startBattle('altarDemon');};
  $('altar-leave').onclick=completeEvent;show('event');renderTop();
}
function openBloodAltarVictory(){
  const hasContract=ownsP('bloodpact');
  G.nodeType='altarReward';G.nodeStarted=true;$('event-title').textContent='🩸 破碎的鮮血祭壇';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.bloodAltar;$('event-image').alt='破碎的鮮血儀式祭壇';
  $('event-desc').textContent=hasContract?'受創的血魔已被擊敗。你已有契約，碎石中不會出現第二份；祭壇的力量仍凝成了一次額外強化獎勵。':'受創的血魔已被擊敗。鮮血契約仍留在碎石之中：拿取時最大生命減半，成為後裔前的未來最大生命增長也只有 50%。祭壇的力量另凝成了一次額外強化獎勵。';
  $('event-actions').innerHTML=`${hasContract?'':'<button class="b-magic" id="altar-victory-take">拿取鮮血契約（不占獎勵）</button>'}<button class="b-next" id="altar-reward">進入額外獎勵 ➜</button>`;
  const take=$('altar-victory-take');if(take)take.onclick=()=>{SFX.win();grantBloodPact(openBloodAltarVictory);};
  $('altar-reward').onclick=()=>openUpgrade('event');show('event');renderTop();
}
function openBloodInvitation(source){
  $('event-title').textContent='🩸 血魔的邀請';$('event-visual').classList.add('hidden');
  $('event-desc').textContent='強化吸血賭注、鮮血契約與強化背水一戰產生共鳴。血魔邀請你成為後裔；接受後鮮血契約會進化為血魔契約，未來最大生命增長恢復 100%（過去損失不返還），三件裝備立即蛻變，並立刻開始血魔考核。';
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
    :forcedEnemy==='squirrelNest'?squirrelNestEncounter(floor)
    :forcedEnemy==='treasureMimic'?[scaledEnemy('mimic',0,floor)]
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
  enemies.filter(e=>e.type==='eagle').forEach(e=>{const eg=eagleGrowth(floor);e.maxEvasion=eg.maxEvasion;e.evasion=eg.maxEvasion;e.foldable=true;e.dodgeCounter='dive';e.divePending=false;e.broken=0;e.weakened=false;});
  enemies.filter(e=>e.type==='robot').forEach(e=>{e.robotStep=0;e.robotAction='fire';e.shield=0;e.focusAbsorb=0;});
  enemies.filter(e=>e.type==='skeleton').forEach(e=>{const sg=skeletonGrowth(floor);e.skeletonStep=0;e.skeletonAction='normal';e.boneArmor=sg.maxArmor;e.boneRage=false;});
  enemies.filter(e=>e.type==='bat').forEach((e,i)=>{e.batStep=i%3;e.batAction=batAction(e);});
  enemies.filter(e=>e.type==='cyclops').forEach(e=>{e.cyclopsStep=0;e.cyclopsAction='normal';e.eyeInterrupted=false;});
  enemies.filter(e=>e.type==='paladin').forEach(e=>{const pg=paladinGrowth(floor);e.paladinStep=e.paladinStartStep||0;e.paladinAction=paladinAction(e,floor);e.judgmentInterrupted=false;e.shield=0;e.statusResist=pg.statusResist;});
  if(enemies.some(e=>e.type==='inquisitorMounted'))enemies.filter(e=>e.type==='paladin').forEach(e=>{e.inquisitorEscort=true;e.inquisitorSync=null;});
  enemies.filter(e=>e.type==='werewolf').forEach(e=>{e.werewolfStep=0;e.werewolfAction='claw';});
  enemies.filter(e=>e.type==='mimic').forEach(e=>{e.mimicStep=0;e.mimicAction='venomBite';});
  enemies.filter(e=>e.type==='cultist').forEach(e=>{e.cultStep=e.cultStartStep||0;e.cultistAction=cultistAction(e);e.hasStolen=false;e.stolenUpgrade=null;e.lastStolen=null;e.shield=0;});
  enemies.filter(e=>e.type==='gargoyle').forEach(e=>{const gg=gargoyleGrowth(floor);e.gargStep=0;e.gargoyleAction='normal';e.gargoylePower=0;e.shield=gg.bossShield;enemies.filter(x=>x.type==='cultist').forEach(x=>x.shield=gg.cultShield);});
  enemies.filter(e=>e.type==='demon').forEach(e=>{e.bloodPower=0;e.bloodLockUses=0;e.bloodLockArmed=true;e.bloodFrenzyUses=0;});
  enemies.filter(e=>e.type==='samurai').forEach(e=>{e.samuraiStep=0;e.samuraiAction='iaido';e.mikiriOutcome=null;e.returnBlade=false;e.zanshin=false;e.statusResist=.3;e.samuraiParts=[];e.nextArmorBreak=0;});
  enemies.filter(e=>e.type==='kun').forEach(e=>{const kg=kunGrowth();e.kunBaseMaxhp=e.maxhp;e.northTide=kg.tideStart;e.kunAction='impact';e.kunForcedAction=null;e.shield=0;e.statusResist=0.7;});
  enemies.filter(e=>e.type==='peng').forEach(e=>{e.pengAttackBonus=0;e.maxEvasion=8;e.evasion=3;e.foldable=false;e.dodgeCounter=null;e.pengAction='windblade';e.pengForcedAction=null;e.eclipseCooldown=3;e.statusResist=0.7;});
  enemies.filter(e=>['cultLeader',...COURT_GARGOYLES].includes(e.type)).forEach(e=>{e.courtStep=0;e.courtAction=courtAction(e);e.shield=0;});
  G.poison=0;
  const eventSource=['altarDemon','bloodExamAltar'].includes(forcedEnemy)?'bloodAltar':forcedEnemy==='ordinaryChurch'?'ordinaryChurch':forcedEnemy==='darkChurch'?'darkChurch':forcedEnemy==='squirrelNest'?'squirrelNest':forcedEnemy==='treasureMimic'?'treasureChest':null;
  G.battle={enemies,eventSource,deck:shuffle(battleDeck()),hand:[],round:1,target:0,defense:0,pendingBust:false,
    bucklerUses:0,bucklerBroken:false,weakness:playerWeaknessFloor(),hesitation:0,corruption:0,sepsis:0,bleed:0,fracture:0,burn:0,burnTicks:0,trauma:0,traumaFresh:false,traumaDecayTicks:0,blind:0,hallucination:0,mentalDisorder:0,thirst:hasP('bloodpact')?Math.ceil(5*statusGainMultiplier()):0,buffSuppressed:0,hits:0,guardStreak:0,focus:0,
    bloodDamageStacks:0,squirrelStolenGold:0,
    stolenUpgrades:[],lastStolenUpgrade:null,lockedUpgradeUses:{},lockedSkill:null,lockedSkills:[],lastLockedSkill:null,
    controlLeft:G.control,controlCap:BALANCE.controlMax,discardMode:false,
    suitMode:false,suitSelected:null,
    heartEchoes:hasP('heartecho')?(isUp('heartecho')?2:1):0,
    bountyHuntActive:!!G.bountyHunt,
    over:false,busy:false};
  if(enemies.some(e=>e.type==='cultLeader'))Object.assign(G.battle,{obsidianCourt:true,cthulhuPhase:false,courtTotalMaxHp:enemies.reduce((sum,e)=>sum+e.maxhp,0),fanaticism:5,disciplineBrand:0,disciplinePunishMult:1.5,lastPlayerAction:null,upgradeReprieve:0,abyssDistance:null,abyssMax:20});
  const inquisitor=enemies.find(e=>e.type==='inquisitorMounted');if(inquisitor)Object.assign(G.battle,{inquisitorBattle:true,inquisitorPhase:1,inquisitorFirstMax:inquisitor.maxhp,crime:0,crimeFrozen:0,sinValue:0,sinCap:0,bloodJudgment:false,redemptionUses:0,warcryStacks:0,lastPlayerAction:null});
  const bloodExamEnemy=enemies.find(e=>e.bloodExam);if(bloodExamEnemy)addSepsis(G.battle,enemyStatusRaw(bloodExamEnemy,5));
  $('btn-duck').classList.add('hidden');
  $('btn-hit').classList.remove('hidden');$('btn-stand').classList.remove('hidden');$('btn-defend').classList.remove('hidden');$('btn-escape').classList.add('hidden');
  $('log').innerHTML='';
  const isBoss=enemies.some(e=>e.boss);
  log(`🗼 第 ${floor} 層 — 遭遇 ${enemies.map(e=>e.name).join(' + ')}！`,isBoss?'dmg':'');
  if(forcedEnemy==='altarDemon')log('🩸 祭壇崩裂後，受創的血魔現身：HP 僅有正常值的 65%，攻擊僅有 70%，但仍保留血祭、吸血與渴血機制。','dmg');
  if(forcedEnemy==='ordinaryChurch')log('⛪ 教堂警鐘響起：兩名聖騎士同時迎戰，擊敗後可進入一般獎勵。','dmg');
  if(forcedEnemy==='darkChurch')log('🕯 邪教儀式被破壞：兩名邪教徒同時迎戰，擊敗後可進入一般獎勵。','dmg');
  if(forcedEnemy==='squirrelNest')log(`🐿️ 翻找驚動了 3 隻護巢松鼠！你已找到 ${G._squirrelNestFoundGold||0} 金幣；戰勝後只會再獲得金錢獎勵。`,'dmg');
  if(forcedEnemy==='treasureMimic')log('🧰 寶箱長出利齒！獎勵暫停發放，擊敗貪噬寶箱怪後可取得 5 項牌面強化與雙倍基礎賞金回合。','dmg');
  if(enemies.some(e=>e.bloodExam)){log('🩸 血魔考官：完整 Boss 數值、50% 負面狀態抗性、所有命中 HP 的攻擊附加流血，渴血永久生效。','dmg');log('🦠 血魔考核開局：你被直接施加 5 層敗血。','dmg');}
  if(G.battle.obsidianCourt){log('🕍 黑曜聖庭：教宗封印所有強化；兩尊石像鬼各自最多封鎖一項技能，且每尊使教宗減傷 25%。','dmg');log('🔥 狂信 5/20｜📿 戒律烙印 0/3。擊倒教宗會召來真正的終極 Boss。','dmg');}
  if(G.battle.inquisitorBattle){log('⚖️ 異端審判長率兩名聖騎士迎戰：審判長永久減傷 30%，鐵騎以 5/25 層馬勢開局。','dmg');log('📜 傷害審判長或聖騎士、施加負面狀態或爆牌都會累積無上限罪證；擊殺聖騎士會額外增加 5 層。','dmg');}
  if(floor===1){
    const character=CHARACTERS.find(c=>c.id===G.character);
    if(character)log(`${character.icon} 角色：${character.name}｜${character.desc}`,'gd');
    const starters=G.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return `${p.icon} ${passiveNameWithAffix(id)}`;});
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
  if(enemies.some(e=>e.type==='werewolf'))log('🐺 狼人：狼爪造成流血，撕咬會依你的流血層數提高傷害；舔舐傷口時不攻擊，但你的流血越多，牠回復得越多。','dmg');
  if(enemies.some(e=>e.type==='mimic'))log('🧰 寶箱怪循環：毒牙啃咬 → 撕裂長舌 → 碎骨夾擊，傷及 HP 時依序施加中毒、流血與斷骨。','dmg');
  if(enemies.some(e=>e.type==='samurai'))log('⚔️ 武士：心流使所有基礎傷害永久 ×1.5，開局使用居合。20／21 點可破解見切；防禦會讓武士以殘心回血並強化燕返。','dmg');
  if(enemies.some(e=>e.type==='robot'))log('🤖 機器人循環：火焰噴射 → 電力充能 → 電弧放電 → 過熱冷卻。放電會吸收全部蓄勢。','dmg');
  if(enemies.some(e=>e.type==='cultist'))log('🕯 每名邪教徒最多暫時奪取一項被動強化；20／21 點或達到傷害門檻可提前奪回。','dmg');
  if(enemies.some(e=>e.type==='gargoyle'))log(`🗿 石像鬼開局立即展開石像守護並正常行動；石像護盾永久保留且可累加。護盾足以支付死亡教徒最大 HP 的 50% 時，會消耗護盾使其以 45% HP 復活。石像封鎖會從主動與被動中隨機鎖定一項；以 20／21 點或單次對本體造成 ${gargoyleUnlockThreshold(floor)} 傷害可解除並歸還被奪強化。邪教徒每次讚頌使石像鬼永久攻擊 +${Math.round(gargoyleGrowth(floor).prayerPower*100)}%。此魔王從第 5 大關的魔王格開始出現。`,'dmg');
  if(enemies.some(e=>e.type==='kun')){const e=enemies.find(e=>e.type==='kun');log(`☯ 終極魔王第一階段「鯤」：HP 為一般魔王約 2.5 倍，擁有 70% 負面狀態抗性；開局北冥潮 ${e.northTide}/16 層。擊倒後將化為鵬。`,'dmg');log('🌊 北冥潮每 3 回合提高 2 層；滿潮後再次發動會提高生命上限。吞海以剩餘護盾 ×2 回血，覆海前會先以神性回血並驅散負面狀態。','dmg');}
  if(enemies.some(e=>e.type==='dropbear'))log('🐨 掉落熊蓄力休息中，每第 3 回合猛攻一次（附中毒＋虛弱）！','dmg');
  if(enemies.some(e=>e.type==='demon')){
    const dg=demonGrowth(floor);
    const cycle=dg.pattern.map(a=>a==='drain'?'吸血':'普攻').join(' → ');
    log(`😈 惡魔循環：${cycle}｜吸血率 ${Math.round(dg.drainRate*100)}%，完全防住仍至少回復預定傷害的 25%；低於 15% HP 時吸血效率 ×1.5，整場最多 ${BALANCE.demonFrenzyUses} 次。從 15% 以上被打到低於 3% 時，本場僅一次鎖在 3% HP；血祭只在高於 30% HP 時發動`+(dg.sacrificeEvery?`｜每 ${dg.sacrificeEvery} 回合可能血祭強化`:'。'),'dmg');
  }
  if(dragon){
    const dg=dragonGrowth(floor);
    log(`🐲 魔龍節奏：${dg.normals} 次普攻 → 1 次龍息｜龍息中斷門檻 ${dg.interrupt}`+(dg.shield?'｜龍息前會展開龍盾':'')+'。','dmg');
    if(dragon.sleepTurns>0)log(`💤 魔龍正在沉睡！最多沉睡 2 回合；受到攻擊後，下回合必定甦醒並施加虛弱。`,'good');
    else applyDragonIntimidation('開局龍威',dragon);
  }
  enemies.filter(e=>e.type==='gargoyle').forEach(gargoyle=>{
    const locked=lockRandomSkill(gargoyle.idx);if(locked.length)log(`🔒 ${gargoyle.name}封鎖 1 項技能：「${locked[0].name}」；20／21 點或攻擊該本體造成 ${gargoyleUnlockThreshold(floor)} 傷害可解除。`,'dmg');
  });
  enemies.filter(e=>e.type==='cultist').forEach(cultist=>cultistStealUpgrade(cultist));
  updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();
  rollIntents();
  renderEnemies();
  show('battle');renderTop();
  dealNewHand();
}

function startDuck(floor){
  const heal=Math.round(4+legacyHeight(floor)*2);
  const before=G.hp;
  if(!G.nodeStarted)healPlayer(heal);
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
  return Math.round(normal*bountyGambleMultiplier(total));
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
function startBounty(boss,base,source='battle'){
  G.bounty={boss,base,source,deck:shuffle(bountyDeck()),hand:[],resolved:false,reward:0,penalty:0,bust:false,discardMode:false,
    suitMode:false,suitSelected:null,
    control:G.control,controlCap:BALANCE.controlMax};
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
  const gambleRate=gamble?`｜🎲 金錢狂賭 ×${bountyGambleMultiplier(total)}`:'';
  $('bounty-rate').textContent=total>21?(gamble&&gamble.bustPenalty?`💥 爆牌：倒扣基礎賞金 ${b.base}🪙`:'💥 爆牌：倍率 ×0'):`目前倍率 ×${Number(mult.toFixed(3))}${five?'（五龍 ×1.5）':''}${suitNotes.length?`｜${suitNotes.join('、')}`:''}${gambleRate}`;
  $('bounty-preview').textContent=b.resolved?(b.penalty>0?`豪賭倒扣 ${b.penalty}🪙`:b.bust?'賞金沒收：0🪙':`獲得 ${b.reward}🪙`):`目前可領取 ${preview}🪙`;
  $('bounty-deck-count').textContent=`賞金牌堆剩餘 ${b.deck.length} 張｜控制值 ${b.control}/${b.controlCap}，與一般關卡共用；金錢回合不回復｜傷害與防禦效果不參與計算`;
  $('bounty-hit').disabled=b.resolved;
  $('bounty-cash').textContent=b.resolved?'繼續爬塔 ➜':'領取賞金';
  const configs=[['bounty-redraw','redraw',`重抽 −${currentControlCost('redraw')}（控制 ${b.control}/${b.controlCap}）`],['bounty-peek','peek',`透視 −${currentControlCost('peek')}（控制 ${b.control}/${b.controlCap}）`],['bounty-discard','cardsharp',b.discardMode?'點選一張牌丟棄（取消）':`🤵 老千 −${currentControlCost('cardsharp')}（控制 ${b.control}/${b.controlCap}）`]];
  configs.forEach(([id,passive,label])=>{const el=$(id),cost=currentControlCost(passive);el.classList.toggle('hidden',!hasP(passive));el.textContent=label;el.disabled=b.resolved||b.control<cost;});
  const magic=$('bounty-suitmagic'),magicCost=currentControlCost('suitmage');magic.classList.toggle('hidden',!hasP('suitmage'));
  magic.textContent=b.suitMode?'🎭 選擇手牌（按此取消）':`🎭 花色魔術 −${magicCost}（控制 ${b.control}/${b.controlCap}）`;
  magic.disabled=b.resolved||b.control<magicCost;
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
    else if(!bust&&total%2===1)bountyLog(`🎲 賞金豪賭 ${total} 點：最終賞金 ×${bountyGambleMultiplier(total)}！`,'gd');
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
  if(source==='treasureChest'){advanceNode();return;}
  if(source.startsWith('event:')){if(hasP('collector'))openCardDrop(boss,source);else finishEventBattleReward(source);}
  else if(source==='battle'&&hasP('collector'))openCardDrop(boss,source);
  else if(source==='duckBattle')proceedAfterWin(false);
  else proceedAfterWin(boss);
}
function bountyRedraw(){
  const b=G.bounty,cost=currentControlCost('redraw');if(!b||b.resolved||b.control<cost)return;
  b.control-=cost;G.control=b.control;b.discardMode=false;b.hand=[];bountyDrawOne();bountyDrawOne();bountyLog(`🔄 重抽賞金手牌（控制值 −${cost}）`,'hit');renderBounty();renderTop();
}
function bountyPeek(){
  const b=G.bounty,cost=currentControlCost('peek');if(!b||b.resolved||b.control<cost)return;
  b.control-=cost;G.control=b.control;const n=isUp('peek')?4:3;
  bountyLog(`👁️ 接下來 ${n} 張：${b.deck.slice(-n).reverse().map(c=>cardLabel(c)+c.s).join('  ')}`,'hit');renderBounty();renderTop();
}
function bountyToggleDiscard(){
  const b=G.bounty,cost=currentControlCost('cardsharp');if(!b||b.resolved||b.control<cost)return;
  b.discardMode=!b.discardMode;b.suitMode=false;b.suitSelected=null;renderBounty();
}
function bountyToggleSuitMagic(){
  const b=G.bounty,cost=currentControlCost('suitmage');if(!b||b.resolved||b.control<cost)return;
  b.suitMode=!b.suitMode;b.suitSelected=null;b.discardMode=false;renderBounty();
}
function changeBountySuit(suit){
  const b=G.bounty,cost=currentControlCost('suitmage'),c=b&&b.hand[b.suitSelected];if(!c||!SUITS.includes(suit)||b.control<cost)return;
  const old=c.s;c.s=suit;c.red=suit==='♥'||suit==='♦';b.control-=cost;G.control=b.control;b.suitMode=false;b.suitSelected=null;
  bountyLog(`🎭 將 ${cardLabel(c)}${old} 變為 ${cardLabel(c)}${suit}（控制值 −${cost}）`,'good');renderBounty();renderTop();
}
function bountyDiscardCard(i){
  const b=G.bounty,cost=currentControlCost('cardsharp');if(!b||b.resolved||!b.discardMode||b.control<cost||!b.hand[i])return;
  const c=b.hand.splice(i,1)[0];b.control-=cost;G.control=b.control;b.discardMode=false;bountyLog(`🤵 老千丟棄 ${cardLabel(c)}${c.s}（控制值 −${cost}）`,'hit');renderBounty();renderTop();
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
    e.cultStep=e.cultStartStep||0;e.cultistAction=cultistAction(e);e.hasStolen=false;e.stolenUpgrade=null;e.reclaimPause=false;e.nextDmg=0;revived++;
    log(`🗿 石像鬼消耗 ${cost} 護盾，使 ${e.name}以 ${e.curhp}/${e.maxhp} HP 復活！`,'dmg');
  });
  if(revived)ensureTarget();return revived;
}
const UPGRADE_USE_LIMITS={heartecho:['heartEchoes',1]};
function lockStolenUpgradeUses(id){
  const b=G.battle,rule=UPGRADE_USE_LIMITS[id];if(!b||!rule)return;
  const [field,base]=rule,locked=Math.max(0,(b[field]||0)-base);if(locked>0){b[field]-=locked;b.lockedUpgradeUses[id]=locked;}
}
function cultistRestoreUpgrade(e,reason='歸還'){
  const b=G.battle;if(!b)return [];
  const records=(b.stolenUpgrades||[]).filter(x=>!e||x.sourceIdx===e.idx);if(!records.length)return [];
  records.forEach(record=>{
    const id=record.id,locked=b.lockedUpgradeUses[id]||0,rule=UPGRADE_USE_LIMITS[id];
    if(rule&&locked)b[rule[0]]+=locked;
    if(id==='buckler')b.bucklerBroken=false;
    delete b.lockedUpgradeUses[id];
    const holder=b.enemies&&b.enemies.find(x=>x.type==='cultist'&&x.idx===record.sourceIdx);if(holder){holder.hasStolen=false;holder.stolenUpgrade=null;}
    const p=ALL_PASSIVES.find(x=>x.id===id);log(`🌟 ${p?p.name:id}的強化已${reason}！`,'good');
  });
  const restored=new Set(records.map(x=>x.id));b.stolenUpgrades=(b.stolenUpgrades||[]).filter(x=>!restored.has(x.id));renderTop();return records;
}
function cultistStealUpgrade(e){
  const b=G.battle;if(!b)return null;
  if(e.hasStolen||e.stolenUpgrade)return e.stolenUpgrade||null;
  const all=G.upgrades.filter(id=>ownsP(id)&&!skillIsLocked(id)&&!hostileSealProtected(id)&&!upgradeStolen(id)),choices=all.length>1?all.filter(id=>id!==b.lastStolenUpgrade):all;
  if(!choices.length){e.hasStolen=false;e.shield=Math.max(e.shield||0,12);log('🕯 無強化可奪取，邪教徒改為獲得 12 點儀式護盾。','dmg');return null;}
  const id=choices[rnd(0,choices.length-1)];b.stolenUpgrades=b.stolenUpgrades||[];b.stolenUpgrades.push({id,sourceIdx:e.idx});b.lastStolenUpgrade=id;e.hasStolen=true;e.stolenUpgrade=id;e.lastStolen=id;lockStolenUpgradeUses(id);
  const shield=cultistGrowth(G.floor).shield;if(shield)e.shield=Math.max(e.shield||0,shield);
  const p=ALL_PASSIVES.find(x=>x.id===id);log(`🔒 邪教徒暫時奪取「${p?p.name:id}」的強化！被動退回基礎效果。`,'dmg');renderTop();return id;
}
function lockRandomSkill(sourceIdx=null){
  const b=G.battle,source=b&&b.enemies.find(e=>e.type==='gargoyle'&&e.curhp>0&&(sourceIdx==null||e.idx===sourceIdx));if(!b||!source||!G.passives.length)return [];
  b.lockedSkills=b.lockedSkills||[];b.lockedSkill=null;
  if(b.lockedSkills.some(x=>x.ordinary&&x.sourceIdx===source.idx))return [];
  const existing=new Set(b.lockedSkills.map(x=>x.id)),locked=[];
  for(let i=0;i<1;i++){
    let choices=G.passives.filter(id=>!hostileSealProtected(id)&&!existing.has(id)&&id!==b.lastLockedSkill&&!upgradeStolen(id));
    if(!choices.length)choices=G.passives.filter(id=>!hostileSealProtected(id)&&!existing.has(id)&&!upgradeStolen(id));
    if(!choices.length)break;
    const id=choices[rnd(0,choices.length-1)];existing.add(id);b.lockedSkills.push({id,sourceIdx:source.idx,ordinary:true});b.lastLockedSkill=id;locked.push(ALL_PASSIVES.find(p=>p.id===id)||{id,name:id});
  }
  if(!locked.length)log(bloodTrinityActive()?'🩸 血之三契拒絕石像封印，本次封鎖失敗。':'🩸 鮮血契約的陣營排斥拒絕石像封印，本次封鎖失敗。','good');
  b.discardMode=false;b.suitMode=false;b.suitSelected=null;return locked;
}
function lockCourtSkill(sourceIdx){
  const b=G.battle,source=b&&b.enemies.find(e=>e.idx===sourceIdx);if(!b||!source||!G.passives.length)return [];
  b.lockedSkills=b.lockedSkills||[];
  if(b.lockedSkills.some(x=>x.sourceIdx===sourceIdx))return [];
  const existing=new Set(b.lockedSkills.map(x=>x.id));
  const locked=[];
  for(let i=0;i<1;i++){
    const choices=G.passives.filter(id=>!hostileSealProtected(id)&&!existing.has(id)&&!upgradeStolen(id));if(!choices.length)break;
    const id=choices[rnd(0,choices.length-1)];existing.add(id);b.lockedSkills.push({id,sourceIdx});b.lastLockedSkill=id;locked.push(ALL_PASSIVES.find(p=>p.id===id)||{id,name:id});
  }
  b.discardMode=false;b.suitMode=false;b.suitSelected=null;return locked;
}
function releaseCourtLock(sourceIdx){
  const b=G.battle;if(!b)return [];
  const released=(b.lockedSkills||[]).filter(x=>x.sourceIdx===sourceIdx);b.lockedSkills=(b.lockedSkills||[]).filter(x=>x.sourceIdx!==sourceIdx);
  if(released.length){log(`🔓 石像崩裂：${released.map(x=>`「${(ALL_PASSIVES.find(p=>p.id===x.id)||{name:x.id}).name}」`).join('、')}恢復。`,'gd');renderTop();}
  return released;
}
function releaseGargoyleLocks(sourceIdx=null){
  const b=G.battle;if(!b)return false;const matches=x=>x.ordinary&&(sourceIdx==null||x.sourceIdx===sourceIdx),released=(b.lockedSkills||[]).filter(matches),hadUpgrade=(b.stolenUpgrades||[]).length>0;
  b.lockedSkill=null;b.lockedSkills=(b.lockedSkills||[]).filter(x=>!matches(x));if(hadUpgrade)cultistRestoreUpgrade(null,'解放');
  if(released.length||hadUpgrade){const names=released.map(x=>`「${(ALL_PASSIVES.find(p=>p.id===x.id)||{name:x.id}).name}」`).join('、');log(`🔓 石像封鎖破裂：${names||'技能'}已恢復${hadUpgrade?'，被邪教徒奪取的強化也已歸還':''}！`,'gd');updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();renderTop();return true;}
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
function combatHeal(amount,lifesteal=false){
  const stacks=G.battle&&G.battle.corruption||0,corruptionMult=Math.max(0.4,1-stacks*0.2),miracleMult=miracleType()==='holy'&&!lifesteal?2:1,mult=corruptionMult*miracleMult,adjusted=Math.max(0,Math.round(amount*mult));
  const before=G.hp;G.hp=Math.min(G.maxhp,G.hp+adjusted);return {healed:G.hp-before,adjusted,mult};
}
function healPlayer(amount,lifesteal=false){
  const mult=miracleType()==='holy'&&!lifesteal?2:1,before=G.hp,adjusted=Math.max(0,Math.round(amount*mult));
  G.hp=Math.min(G.maxhp,G.hp+adjusted);return {healed:G.hp-before,adjusted,mult};
}
function sepsisMultiplier(target){return 1+Math.max(0,target&&target.sepsis||0)*0.15;}
function traumaAttackMultiplier(target){return 1+Math.max(0,target&&target.trauma||0)*0.3;}
function traumaStatusMultiplier(target){return 1+Math.max(0,target&&target.trauma||0);}
function playerStatusResistance(){const antidote=hasP('antidote')?(isUp('antidote')?0.6:0.4):0;return Math.min(1,antidote+(miracleType()==='holy'?0.3:0));}
function resistedStatusAmount(target,amount){
  const raw=Math.max(0,amount||0),playerTarget=target===G.battle,resist=Math.min(1,Math.max(0,playerTarget?playerStatusResistance():target&&target.statusResist||0));
  if(raw<=0)return 0;const resisted=Math.max(1,Math.ceil(raw*(1-resist)-1e-9));return playerTarget?Math.ceil(resisted*statusGainMultiplier()):resisted;
}
function statusHeightBonus(floor=G.floor){return Math.max(0,Math.floor(Math.log2(1+chapterIndex(floor)/4)));}
function enemyStatusRankBonus(e){return e&&e.ultimate?2:e&&(e.boss||e.ultimateMinion)?1:0;}
function enemyStatusRaw(e,base){return Math.max(1,Math.round(base||1)+statusHeightBonus()+enemyStatusRankBonus(e));}
function addWeakness(e,base=3){return addLimitedStatus(G.battle,'weakness',enemyStatusRaw(e,base),9);}
function applyHesitation(e,baseThreat=3){
  const b=G.battle;if(!b)return 0;
  const threat=enemyStatusRaw(e,baseThreat),mitigation=Math.round(playerStatusResistance()*3),baseAllowance=Math.max(1,Math.min(5,6-threat+mitigation)),allowance=Math.ceil(baseAllowance*statusGainMultiplier());
  b.hesitation=b.hesitation>0?Math.min(b.hesitation,allowance):allowance;return b.hesitation;
}
function addTimedStatus(e,key,base=1,cap=5){return addLimitedStatus(G.battle,key,enemyStatusRaw(e,base),cap);}
function addPlayerPoison(amount){const gained=resistedStatusAmount(G.battle,amount);G.poison+=gained;return gained;}
function addLimitedStatus(target,key,amount,cap){if(!target)return 0;const before=Math.max(0,target[key]||0);target[key]=Math.min(cap,before+resistedStatusAmount(target,amount));return target[key]-before;}
function addTrauma(target,amount=1){
  if(!target||amount<=0)return 0;
  const gained=Math.max(0,Math.floor(amount));target.trauma=Math.max(0,target.trauma||0)+gained;
  if(gained>0)target.traumaFresh=true;
  return gained;
}
function addCappedStatusWithTrauma(target,key,amount,cap){
  if(!target)return {gained:0,traumaGained:0,remaining:0};
  const applied=resistedStatusAmount(target,amount),before=Math.max(0,target[key]||0);
  const room=Math.max(0,cap-before),gained=Math.min(room,applied),traumaGained=Math.max(0,applied-gained);
  target[key]=before+gained;if(traumaGained)addTrauma(target,traumaGained);
  return {gained,traumaGained,remaining:target[key]};
}
function addBleed(target,amount){return addCappedStatusWithTrauma(target,'bleed',amount,8);}
function addBurn(target,amount){return addCappedStatusWithTrauma(target,'burn',amount,5);}
function addSepsis(target,amount){return addLimitedStatus(target,'sepsis',amount,5);}
function triggerBleed(target,directDamage){
  if(!target||directDamage<=0||(target.bleed||0)<=0)return {damage:0,remaining:target&&target.bleed||0};
  const damage=Math.round(target.bleed*traumaStatusMultiplier(target)),decay=target===G.battle&&burnwindActive()?1:2;target.bleed=Math.max(0,target.bleed-decay);return {damage,remaining:target.bleed,decay};
}
function decayTrauma(target){
  if(!target||(target.trauma||0)<=0)return 0;
  if(target.traumaFresh){target.traumaFresh=false;return 0;}
  if(target===G.battle&&burnwindActive()){target.traumaDecayTicks=(target.traumaDecayTicks||0)+1;if(target.traumaDecayTicks<2)return 0;target.traumaDecayTicks=0;}
  target.trauma--;return 1;
}
function addFracture(target,amount){return addLimitedStatus(target,'fracture',amount,3);}
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
  if(G.battle&&G.battle.inquisitorBattle&&(INQUISITOR_LEADERS.includes(target.type)||target.inquisitorEscort))addInquisitorStatusCrime(poison,'毒物學');
  return poison;
}
function tickBurnStatus(b){
  if(!b||b.burn<=0)return null;
  const damage=Math.round(b.burn*2*traumaStatusMultiplier(b));b.burnTicks=(b.burnTicks||0)+1;
  const threshold=b===G.battle&&burnwindActive()?4:2,decays=b.burnTicks>=threshold;if(decays){b.burn=Math.max(0,b.burn-1);b.burnTicks=0;}
  return {damage,decays,remaining:b.burn,threshold,nextIn:threshold-(b.burnTicks||0)};
}
function armorBreakRate(e){
  if(e.type==='ninja'&&e.ninjaAction==='pierce'||e.type==='paladin'&&!e.inquisitorSync&&e.paladinAction==='sunder')return 0.3;
  if(e.type==='paladin'&&e.inquisitorSync==='holyCharge')return 0.4;if(e.type==='paladin'&&e.inquisitorSync==='verdictStrike')return 0.3;
  if(e.type==='inquisitorMounted')return e.inquisitorAction==='lance'?0.35:e.inquisitorAction==='trample'?0.2:e.inquisitorAction==='charge'?0.6:0;
  if(e.type==='inquisitor')return e.inquisitorAction==='sentenceSword'?0.3:e.inquisitorAction==='judgment'?0.5:0;
  if(e.type==='peng'&&e.pengAction==='riftclaw')return 0.45;if(e.type==='peng'&&e.pengAction==='inferno')return 0.6;return 0;
}
function armorBreakBonus(e,dmg,hasDefense){return hasDefense?Math.round(dmg*armorBreakRate(e)):0;}
function resolveDefenseDamage(baseDamage,defense,armorBonus=0){
  const blocked=Math.min(baseDamage,defense),net=Math.max(0,baseDamage-blocked);
  const armorWear=Math.min(Math.max(0,defense-blocked),armorBonus);
  return {blocked,net,armorWear,defenseLeft:Math.max(0,defense-blocked-armorWear)};
}
function fact(n){n=Math.min(n,10);let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
function squirrelSteal(){
  const amt=Math.min(G.gold,Math.max(10,Math.round(G.gold*0.15)));
  G.gold-=amt;G.battle.squirrelStolenGold=(G.battle.squirrelStolenGold||0)+amt;
  log(`🐿️ 松鼠偷走了 ${amt} 金幣！擊敗這次遭遇的松鼠即可取回贓物。`,'dmg');
  renderTop();
}
function recoverSquirrelGold(b){
  const amount=Math.max(0,Math.round(b&&b.squirrelStolenGold||0));if(!amount)return 0;
  G.gold+=amount;b.squirrelStolenGold=0;SFX.coin();log(`🐿️ 擊敗松鼠，取回被偷走的 ${amount} 金幣！`,'gd');renderTop();return amount;
}
function rollIntents(){
  const inquisitor=inquisitorLeader();
  if(inquisitor){inquisitor.inquisitorAction=inquisitorAction(inquisitor);const sync=inquisitor.inquisitorAction==='chargePrep'?'warcry':inquisitor.inquisitorAction==='charge'?'holyCharge':inquisitor.inquisitorAction==='judgment'?'verdictStrike':null;G.battle.enemies.filter(e=>e.inquisitorEscort&&e.curhp>0).forEach(e=>e.inquisitorSync=sync);}
  G.battle.enemies.forEach(e=>{if(e.curhp>0){
  if(e.type==='ninja')e.ninjaAction=ninjaPierces(G.battle.round)?'pierce':'normal';
  if(e.type==='zombie')e.zombieAction=zombieAction(e);
  if(e.type==='robot')e.robotAction=robotAction(e);
  if(e.type==='skeleton')e.skeletonAction=skeletonAction(e,G.floor);
  if(e.type==='bat')e.batAction=batAction(e);
  if(e.type==='cyclops')e.cyclopsAction=cyclopsAction(e,G.floor);
  if(e.type==='paladin'&&!e.inquisitorSync)e.paladinAction=paladinAction(e,G.floor);
  if(e.type==='werewolf')e.werewolfAction=werewolfAction(e);
  if(e.type==='mimic')e.mimicAction=mimicAction(e);
  if(e.type==='cultist')e.cultistAction=cultistAction(e);
  if(e.type==='gargoyle')e.gargoyleAction=gargoyleAction(e);
  if(e.type==='demon')e.demonAction=demonAction(e,G.battle.round,G.floor);
  if(e.type==='samurai'){const action=samuraiAction(e);if(action==='mikiri'&&e.samuraiAction!=='mikiri')e.mikiriOutcome=null;e.samuraiAction=action;}
  if(INQUISITOR_LEADERS.includes(e.type))e.inquisitorAction=inquisitorAction(e);
  if(e.type==='dragon')e.dragonAction=dragonAction(e,G.floor);
  if(e.type==='kun')e.kunAction=kunAction(e,G.battle.round);
  if(e.type==='peng')e.pengAction=pengAction(e);
  if(['cultLeader',...COURT_GARGOYLES].includes(e.type))e.courtAction=courtAction(e);
  if(e.type==='cthulhu')e.cthulhuAction=cthulhuAction(e);
  if(e.type==='zombie'&&e.downed)e.nextDmg=0;
  else if(e.type==='robot'&&(e.robotAction==='charge'||e.robotAction==='cool')){
    e.nextDmg=0;e.focusAbsorb=0;if(e.robotAction==='charge'){const s=robotGrowth(G.floor).chargeShield;if(s)e.shield=Math.max(e.shield||0,s);}
  }
  else if(e.type==='cultist'&&e.cultistAction==='prayer')e.nextDmg=0;
  else if(e.type==='gargoyle'&&e.gargoyleAction==='guard')e.nextDmg=0;
  else if(e.type==='skeleton'&&e.skeletonAction==='guard')e.nextDmg=0;
  else if(e.type==='cyclops'&&e.cyclopsAction==='gaze')e.nextDmg=0;
  else if(e.type==='paladin'&&e.inquisitorSync==='warcry')e.nextDmg=0;
  else if(e.type==='paladin'&&!e.inquisitorSync&&e.paladinAction==='guard')e.nextDmg=0;
  else if(e.type==='werewolf'&&e.werewolfAction==='lick')e.nextDmg=0;
  else if(e.type==='dropbear'&&!dropbearAttacks(G.battle.round))e.nextDmg=0;
  else if(e.type==='demon'&&e.demonAction==='sacrifice')e.nextDmg=0;
  else if(e.type==='samurai'&&e.samuraiAction==='mikiri'){e.nextDmg=0;e.nextArmorBreak=0;e.samuraiParts=[];}
  else if(INQUISITOR_LEADERS.includes(e.type)&&['proclamation','chargePrep','transition','confiscate'].includes(e.inquisitorAction))e.nextDmg=0;
  else if(e.type==='dragon'&&e.dragonAction==='sleep')e.nextDmg=0;
  else if(e.type==='kun'&&['pressure','devour','divinity'].includes(e.kunAction))e.nextDmg=0;
  else if(e.type==='peng'&&['rebirth','eclipse','transition'].includes(e.pengAction))e.nextDmg=0;
  else if(e.type==='disciplineGargoyle'&&['skillSeal','brandGaze'].includes(e.courtAction)||e.type==='punishmentGargoyle'&&e.courtAction==='skillSeal'||e.type==='cultLeader'&&e.courtAction==='obsidianAbsolution'||e.type==='cthulhu'&&e.cthulhuAction==='abyssRegeneration')e.nextDmg=0;
  else{
    const base=rnd(e.atk[0],e.atk[1]);
    e.baseNextDmg=base;
    if(e.type==='samurai')prepareSamuraiDamage(e,base);
    else if(e.type==='inquisitorMounted')e.nextDmg=inquisitorMountedDamage(e,base);
    else if(e.type==='inquisitor')e.nextDmg=inquisitorFootDamage(e,base);
    else if(e.type==='demon')e.nextDmg=Math.max(1,Math.round(base*(1+(e.bloodPower||0))));
    else if(e.type==='gargoyle')e.nextDmg=Math.max(1,Math.round(base*(1+(e.gargoylePower||0))));
    else if(e.type==='skeleton'&&e.boneRage)e.nextDmg=Math.max(1,Math.round(base*skeletonGrowth(G.floor).rageMult));
    else if(e.type==='cyclops'&&e.cyclopsAction==='smash')e.nextDmg=Math.max(1,Math.round(base*cyclopsGrowth(G.floor).smashMult));
    else if(e.type==='paladin'&&e.inquisitorSync==='holyCharge')e.nextDmg=Math.max(1,Math.round(base*1.8*(1+(G.battle.warcryStacks||0)*.25)));
    else if(e.type==='paladin'&&e.inquisitorSync==='verdictStrike')e.nextDmg=Math.max(1,Math.round(base*1.25*inquisitorSinMultiplier(e,true)));
    else if(e.type==='paladin'&&e.inquisitorEscort&&G.battle.inquisitorPhase===2){const own=e.paladinAction==='judgment'?paladinGrowth(G.floor).judgmentMult:1;e.nextDmg=Math.max(1,Math.round(base*own*inquisitorSinMultiplier(e,false)));}
    else if(e.type==='paladin'&&e.paladinAction==='judgment')e.nextDmg=Math.max(1,Math.round(base*paladinGrowth(G.floor).judgmentMult));
    else if(e.type==='werewolf'&&e.werewolfAction==='bite')e.nextDmg=Math.max(1,Math.round(base*werewolfBiteMultiplier()));
    else if(e.type==='mimic')e.nextDmg=Math.max(1,Math.round(base*mimicDamageMultiplier(e.mimicAction)));
    else if(e.type==='zombie'&&e.zombieAction==='bite')e.nextDmg=Math.max(1,Math.round(base*1.35));
    else if(e.type==='robot'&&e.robotAction==='fire')e.nextDmg=Math.max(1,Math.round(base*1.1));
    else if(e.type==='robot'&&e.robotAction==='electric'){
      const rg=robotGrowth(G.floor);e.focusAbsorb=Math.min(rg.focusCap,Math.floor((G.battle.focus||0)*rg.focusRate));e.nextDmg=Math.max(1,Math.round(base*1.4)+e.focusAbsorb);
    }
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='dark')e.nextDmg=Math.max(1,Math.round(base*cultistGrowth(G.floor).dark));
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='sacrifice')e.nextDmg=Math.max(1,Math.round(base*cultistGrowth(G.floor).sacrifice));
    else if(e.type==='eagle'&&e.divePending)e.nextDmg=Math.max(1,Math.round(base*eagleGrowth(G.floor).diveMult));
    else if(e.type==='dragon'&&e.dragonAction==='breath')e.nextDmg=Math.max(1,Math.round(base*dragonGrowth(G.floor).breathMult));
    else if(e.type==='kun'){
      const impact=base+G.passives.length*kunGrowth().passiveDamage;e.nextDmg=Math.max(1,Math.round(impact*(e.kunAction==='oversea'?3.5:1)));
    }
    else if(e.type==='peng'){
      const mult=e.pengAction==='riftclaw'?1.8:e.pengAction==='inferno'?2.5:1;e.nextDmg=Math.max(1,Math.round(base*mult*(1+(e.pengAttackBonus||0))));
    }
    else if(e.type==='disciplineGargoyle'||e.type==='punishmentGargoyle'){
      const mult=e.courtAction==='disciplineClaw'?1.3:e.courtAction==='toxicWhip'?1.2:e.courtAction==='poisonPunishment'?1.1:1;
      const empower=e.nextDamageBoost||1;e.nextDmg=Math.max(1,Math.round(base*mult*empower));if(e.nextDmg>0&&empower>1)e.consumeDamageBoost=true;
    }
    else if(e.type==='cultLeader'){
      const mult=e.courtAction==='sepsisRite'?1.15:['bloodDrain'].includes(e.courtAction)?1.2:e.courtAction==='profaneCommunion'?1.1:1;
      e.nextDmg=Math.max(1,Math.round(base*mult*cultFanaticismMultiplier()*(1+(e.disciplineDeathBonus||0))));
    }
    else if(e.type==='cthulhu'){
      const mult=e.cthulhuAction==='tentacleRend'?1.3:e.cthulhuAction==='abyssResonance'?1.2:e.cthulhuAction==='deepPressure'?1.1:1;
      e.nextDmg=Math.max(1,Math.round(base*mult*(1+(e.inheritedFanaticism||0)*.02)));
    }
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
  if(b.buffSuppressed>0)status.push(`🌊 威壓 ${b.buffSuppressed} 回合（無法獲得蓄勢）`);
  if(playerThirstStacks()>0)status.push(`🩸 渴血 ${playerThirstStacks()} 層（吸血倍率 ×${thirstMultiplier().toFixed(1)}）`);
  if(bloodContractSuppresses('antidote')&&ownsP('antidote'))status.push('🔒 淨化受血魔契約壓制');
  if(bloodTrinityActive())status.push('🩸 血之三契（不可封印／強化不可奪取）');
  else if(ownsP('bloodpact'))status.push('🩸 陣營排斥（鮮血契約不可封印）');
  if(playerStatusResistance()>0)status.push(`✨ 負面狀態抗性 ${Math.round(playerStatusResistance()*100)}%`);
  if(hasP('howdidwegethere'))status.push(`❓ 狀態層數 ×${statusGainMultiplier()}｜虛弱至少 3 層`);
  if(bloodDescendantActive()&&(b.bloodDamageStacks||0)>0)status.push(`🩸 後裔血性 ×${descendantDamageMultiplier().toFixed(2)}`);
  if(b.lockedSkill){const p=ALL_PASSIVES.find(x=>x.id===b.lockedSkill);status.push(`🔒 封鎖「${p?p.name:b.lockedSkill}」：20／21 點或本體傷害 ${gargoyleUnlockThreshold(G.floor)} 可解除`);}
  (b.lockedSkills||[]).forEach(x=>{const p=ALL_PASSIVES.find(item=>item.id===x.id);status.push(`🔒 石像封鎖「${p?p.name:x.id}」${x.ordinary?`：20／21 點或本體傷害 ${gargoyleUnlockThreshold(G.floor)} 可解除`:''}`);});
  if(b.obsidianCourt&&!b.cthulhuPhase)status.push(`🔥 狂信 ${b.fanaticism}/20${b.upgradeReprieve>0?' ｜ ✨ 強化暫時復原':''}`);
  if(b.cthulhuPhase)status.push(`🕳️ 深淵距離 ${b.abyssDistance}/${b.abyssMax}`);
  if(b.inquisitorBattle&&b.inquisitorPhase===1)status.push(`⚖️ 罪證 ${b.crime||0}（無上限）`);
  if(b.inquisitorBattle&&b.inquisitorPhase===2)status.push(`⚖️ 罪惡值 ${b.sinValue||0}/${b.sinCap||0}`);
  $('pl-def').textContent=status.join(' ｜ ');
  const ailments=[];
  if(G.poison>0)ailments.push(`☠ 中毒 ${G.poison} 層（每回合 −${Math.round(G.poison*traumaStatusMultiplier(b))} HP）`);
  if(b.corruption>0)ailments.push(`🧟 腐敗 ${b.corruption} 層（戰鬥回血 −${b.corruption*20}%）`);
  if(b.sepsis>0)ailments.push(`🦠 敗血 ${b.sepsis} 層（吸血者效率 +${b.sepsis*15}%）`);
  if(b.bleed>0)ailments.push(`🩸 流血 ${b.bleed} 層（下次直接傷及 HP 時額外 −${Math.round(b.bleed*traumaStatusMultiplier(b))}，發作後 −${burnwindActive()?1:2} 層）`);
  if(b.fracture>0)ailments.push(`🦴 斷骨 ${b.fracture} 層（新防禦 −${b.fracture*15}%）`);
  if(b.burn>0)ailments.push(`🔥 燒傷 ${b.burn} 層（下次 ${Math.round(b.burn*2*traumaStatusMultiplier(b))} 傷害；每 ${burnwindActive()?4:2} 次發作 −1 層）`);
  if(b.trauma>0)ailments.push(`🩹 創傷 ${b.trauma} 層（攻擊傷害 ×${traumaAttackMultiplier(b).toFixed(1)}；持續傷害 ×${traumaStatusMultiplier(b).toFixed(0)}）`);
  if(b.blind>0)ailments.push(`🌑 致盲 ${b.blind} 層（攻擊改為解除致盲；防禦 −20%）`);
  if(currentWeaknessStacks()>0)ailments.push(`📉 虛弱 ${currentWeaknessStacks()}/9（下一次攻擊 −${currentWeaknessStacks()*10}%）`);
  if(b.hesitation>0)ailments.push(`🦫 遲疑 ${b.hesitation} 層（本次行動可額外抽 ${b.hesitation} 張）`);
  if(b.disciplineBrand>0||b.cthulhuPhase)ailments.push(`📿 戒律烙印 ${b.disciplineBrand}/3（懲罰 ×${(b.disciplinePunishMult||1.5).toFixed(1)}）`);
  if(b.hallucination>0)ailments.push(`🫥 幻覺 ${b.hallucination} 層（剩餘行動；牌面有 5% 機率錯誤）`);
  if(b.mentalDisorder>0)ailments.push(`🌀 精神錯亂 ${b.mentalDisorder} 層（Hit 抽 1～2 張）`);
  $('pl-poison').textContent=ailments.join(' ｜ ');
  const limit=hesitationLimit();
  $('incoming').textContent=b.hesitation>0?`🦫 遲疑 ${b.hesitation} 層：本回合最多再抽 ${Math.max(0,limit-(b.hits||0))} 張`:'';
}
function incomingTotal(){
  const b=G.battle;if(!b||!b.enemies)return 0;
  return b.enemies.filter(e=>e.curhp>0).reduce((sum,e)=>{
    if(witchPoisonTurn(e))return sum;
    const d=Math.max(0,e.nextDmg||0),breakDamage=b.defense>0?(e.nextArmorBreak??armorBreakBonus(e,d,true)):0;return sum+d+breakDamage;
  },0);
}

function renderEnemies(){
  const b=G.battle,zone=$('enemy-zone');zone.innerHTML='';
  const courtFight=b.obsidianCourt&&!b.cthulhuPhase,inquisitorFight=!!b.inquisitorBattle,gargoyleFight=b.enemies.some(e=>e.type==='gargoyle')||courtFight||inquisitorFight;
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
      else if(e.type==='cultLeader')el.classList.add('gargoyle-center');
      else if(e.type==='disciplineGargoyle')el.classList.add('cultist-left');
      else if(e.type==='punishmentGargoyle')el.classList.add('cultist-right');
      else if(INQUISITOR_LEADERS.includes(e.type))el.classList.add('gargoyle-center');
      else if(e.inquisitorEscort)el.classList.add(e.idx===0?'cultist-left':'cultist-right');
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
    else if(e.type==='paladin'&&e.inquisitorSync==='warcry')intent='📯 戰吼（不攻擊；下回合敵方全體傷害 +25%）';
    else if(e.type==='paladin'&&e.inquisitorSync==='holyCharge')intent=`🐎 聖騎衝擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（高傷害、破防 40%，不受馬勢影響）`;
    else if(e.type==='paladin'&&e.inquisitorSync==='verdictStrike')intent=`⚖️ 裁決斬擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（罪惡加成、破防 30%）`;
    else if(e.type==='paladin'&&e.paladinAction==='guard')intent=`✝️ 聖盾禱告（不攻擊；護盾補至 ${paladinGrowth(G.floor).shield}，驅散各負面狀態 10%）`;
    else if(e.type==='paladin'&&e.paladinAction==='judgment')intent=e.judgmentInterrupted?'💥 聖盾已破，神聖裁決中斷':`⚔️ 神聖裁決 <span class="dmgtag">${e.nextDmg??'?'}</span>（打破聖盾可中斷）`;
    else if(e.type==='paladin'&&e.paladinAction==='sunder')intent=`💥 破甲斬擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（破防 30%）`;
    else if(e.type==='paladin')intent=`🗡️ 聖劍斬擊 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='werewolf'&&e.werewolfAction==='lick')intent=`👅 舔舐傷口（不攻擊；回復 ${Math.round(werewolfHealRate()*100)}% 最大生命）`;
    else if(e.type==='werewolf'&&e.werewolfAction==='bite')intent=`🦷 嗅血撕咬 <span class="dmgtag">${e.nextDmg??'?'}</span>（×${werewolfBiteMultiplier().toFixed(2)}，隨流血提高）`;
    else if(e.type==='werewolf')intent=`🐾 狼爪 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：流血 +${enemyStatusRaw(e,2)}）`;
    else if(e.type==='mimic'&&e.mimicAction==='venomBite')intent=`☠️ 毒牙啃咬 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒 +${enemyStatusRaw(e,2)}）`;
    else if(e.type==='mimic'&&e.mimicAction==='rendingTongue')intent=`🩸 撕裂長舌 <span class="dmgtag">${e.nextDmg??'?'}</span>（×1.1；傷及 HP：流血 +${enemyStatusRaw(e,2)}）`;
    else if(e.type==='mimic')intent=`🦴 碎骨夾擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（×1.35；傷及 HP：斷骨 +${enemyStatusRaw(e,1)}）`;
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
    else if(e.type==='samurai'&&e.samuraiAction==='mikiri')intent='👁️ 見切（不攻擊；20／21 點可破解，防禦則觸發殘心）';
    else if(e.type==='samurai'&&e.samuraiAction==='iaido')intent=`⚔️ 居合 <span class="dmgtag">${e.nextDmg??'?'}</span>（心流後 ×1.4、破防 40%；傷及 HP：流血 +${enemyStatusRaw(e,2)}）`;
    else if(e.type==='samurai'&&e.samuraiAction==='kesa')intent=`🗡️ 袈裟斬 <span class="dmgtag">${e.nextDmg??'?'}</span>（心流；傷及 HP：流血 +${enemyStatusRaw(e,1)}）`;
    else if(e.type==='samurai'&&e.samuraiAction==='tsubame')intent=`🪽 ${e.returnBlade?'返刃＋':''}${e.zanshin?'殘心・':''}燕返 <span class="dmgtag">${e.nextDmg??'?'}</span>（${e.samuraiParts.map(p=>p.damage).join('＋')}；破防 ${Math.round(samuraiTsubameBreak(e)*100)}%）`;
    else if(e.type==='inquisitorMounted'&&e.inquisitorAction==='proclamation')intent='📜 宣讀罪狀（不攻擊；罪證 +1、虛弱、護盾 12%）';
    else if(e.type==='inquisitorMounted'&&e.inquisitorAction==='chargePrep')intent='🐎 舉槍裁決（全體驅散 50% 負面狀態、全體護甲 30%；聖騎士戰吼）';
    else if(e.type==='inquisitorMounted')intent=`⚖️ ${{lance:'騎槍突刺',trample:'戰馬踐踏',charge:'裁決衝鋒'}[e.inquisitorAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>（馬勢 ${e.momentum}/25、破防 ${Math.round(armorBreakRate(e)*100)}%）`;
    else if(e.type==='inquisitor'&&e.inquisitorAction==='transition')intent='⚖️ 下馬整備（暫停 1 回合；下回合審判）';
    else if(e.type==='inquisitor'&&e.inquisitorAction==='confiscate')intent='💰 沒收異端財物（不攻擊；奪取金錢並轉化護盾）';
    else if(e.type==='inquisitor')intent=`⚖️ ${{sentenceSword:'斷罪劍',pyre:'火刑宣告',interrogate:'信仰拷問',judgment:'審判'}[e.inquisitorAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>${e.inquisitorAction==='judgment'?'（罪惡高倍率、全體同步裁決）':''}`;
    else if(e.type==='demon'&&e.demonAction==='sacrifice')intent='🩸 血祭：自損最多 8% HP，攻擊永久 +15%';
    else if(e.type==='demon'&&e.demonAction==='drain')intent=`🩸 吸血攻擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（吸血 ${Math.round(demonDrainRate(e)*100)}%${e.permanentThirst?'，永久渴血':demonFrenzyActive(e)?`，渴血剩 ${BALANCE.demonFrenzyUses-(e.bloodFrenzyUses||0)} 次`:''}${b.sepsis>0?`，敗血 +${b.sepsis*15}%`:''}；完全防住仍保底回復 25%）`;
    else if(e.type==='dragon'&&e.dragonAction==='sleep')intent=`💤 沉睡中（剩 ${e.sleepTurns} 回合）${e.wakeNext?'｜下回合甦醒':''}`;
    else if(e.type==='dragon'&&e.dragonAction==='breath')intent=`🔥 龍息 <span class="dmgtag">${e.nextDmg??'?'}</span>｜實際傷害達 ${dragonGrowth(G.floor).interrupt} 可中斷`;
    else if(e.type==='dragon'&&e.dragonAction==='ward')intent=`🗡 普攻 <span class="dmgtag">${e.nextDmg??'?'}</span> ＋ 🛡 展開 ${dragonGrowth(G.floor).shieldAmount} 龍盾`;
    else if(e.type==='kun'&&e.kunAction==='pressure')intent=`🌊 威壓（清除蓄勢、封鎖蓄勢 2 回合並施加 ${enemyStatusRaw(e,5)} 層虛弱）`;
    else if(e.type==='kun'&&e.kunAction==='devour')intent=`🐋 吞海（獲得 ${kunShieldAmount(e)} 護盾；下回合以剩餘護盾 ×2 回血後消耗）`;
    else if(e.type==='kun'&&e.kunAction==='divinity')intent='✨ 神性（回血、驅散所有負面狀態；下回合覆海）';
    else if(e.type==='kun'&&e.kunAction==='oversea')intent=`🌊 覆海 <span class="dmgtag">${e.nextDmg??'?'}</span>（深海撞擊 ×3.5；不附加斷骨）`;
    else if(e.type==='kun')intent=`🐋 深海撞擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（被動卡牌越多傷害越高；傷及 HP：斷骨 +1）`;
    else if(e.type==='peng'&&e.pengAction==='transition')intent='☯ 化鵬停頓（本回合不行動）';
    else if(e.type==='peng'&&e.pengAction==='rebirth')intent='🔥 浴火振翅（回復 5% HP、驅散負面狀態、施加 3 層燒傷；下回合焚天）';
    else if(e.type==='peng'&&e.pengAction==='eclipse')intent='🌑 遮天蔽日（恢復 2 層閃避、施加 3 層致盲）';
    else if(e.type==='peng'&&e.pengAction==='riftclaw')intent=`🦅 裂空爪 <span class="dmgtag">${e.nextDmg??'?'}</span>（×1.8、破防 45%）`;
    else if(e.type==='peng'&&e.pengAction==='inferno')intent=`☀️ 焚天 <span class="dmgtag">${e.nextDmg??'?'}</span>（×2.5、破防 60%；傷及 HP：流血與燒傷各 3）`;
    else if(e.type==='peng'&&e.pengAction==='flamefeather')intent=`🔥 炎羽 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：燒傷 +2）`;
    else if(e.type==='peng')intent=`🌪 風刃 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：流血 +2）`;
    else if(e.type==='disciplineGargoyle'&&e.courtAction==='skillSeal')intent='🔒 石像封印（不攻擊；最多封鎖 1 項技能）';
    else if(e.type==='disciplineGargoyle'&&e.courtAction==='brandGaze')intent='📿 烙印凝視（不攻擊；戒律烙印 +1）';
    else if(e.type==='disciplineGargoyle')intent=`🗿 戒律石爪 <span class="dmgtag">${e.nextDmg??'?'}</span>（×1.3）`;
    else if(e.type==='punishmentGargoyle'&&e.courtAction==='skillSeal')intent='🔒 石像封印（不攻擊；最多封鎖 1 項技能）';
    else if(e.type==='punishmentGargoyle'&&e.courtAction==='poisonPunishment')intent=`☠ 毒刑 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒 +2）`;
    else if(e.type==='punishmentGargoyle'&&e.courtAction==='toxicWhip')intent=`🦂 毒鞭 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒 +3）`;
    else if(e.type==='punishmentGargoyle')intent=`🗿 刑罰石爪 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cultLeader'&&e.courtAction==='obsidianAbsolution')intent='🛡 黑曜赦令（不攻擊；全體永久護盾、暫時歸還強化、石像下次傷害 ×1.3）';
    else if(e.type==='cultLeader')intent=`🕯 ${({blackScripture:'黑經誦讀',blindSermon:'盲目佈道',sepsisRite:'敗血儀式',bloodDrain:'汲血',profaneCommunion:'褻瀆共融'})[e.courtAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cthulhu'&&e.cthulhuAction==='abyssRegeneration')intent='🕳️ 深淵再生（不攻擊；回復 6%、永久護盾 12%）';
    else if(e.type==='cthulhu')intent=`🐙 ${({tentacleRend:'萬觸撕裂',namelessGaze:'不可名狀的凝視',abyssResonance:'深淵震鳴',starWhisper:'群星囈語',deepPressure:'深海威壓'})[e.cthulhuAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else intent=`🗡 本回合 <span class="dmgtag">${e.nextDmg??'?'}</span>${bearAct?' ＋🐻虛弱':''}${platyAct?' ＋🦫遲疑':''}${sqAct?' ＋🐿️偷竊':''}${dropAtk?' ＋☠＋🐻':''}${sqFlee}`;
    const sprite=e.img?`<img class="esprite" src="${encodeURI(e.img)}" alt="${e.name}" style="height:${e.h}px">`:`<div class="esprite emoji-sprite" style="font-size:${Math.round(e.h*0.85)}px">${e.emoji||'❓'}</div>`;
    const demonRageRate=e.type==='demon'?demonGrowth(G.floor).drainRate*1.5*sepsisMultiplier(b):0;
    const demonRageHeal=e.type==='demon'&&e.demonAction==='drain'?Math.round((e.nextDmg||0)*demonRageRate):0;
    const demonStatus=e.type==='demon'?(e.permanentThirst?` ｜ 🩸 永久渴血｜吸血 ${Math.round(demonRageRate*100)}%${e.demonAction==='drain'?`（完全命中回復 ${demonRageHeal} HP）`:''}`:` ｜ 🩸 渴血剩餘 ${Math.max(0,BALANCE.demonFrenzyUses-(e.bloodFrenzyUses||0))}/${BALANCE.demonFrenzyUses}｜渴血吸血 ${Math.round(demonRageRate*100)}%${e.demonAction==='drain'?`（完全命中回復 ${demonRageHeal} HP）`:''}${demonFrenzyActive(e)?'（生效中）':''}`):'';
    const sinPct=b.inquisitorPhase===2&&b.sinCap>0?Math.round((b.sinValue||0)/b.sinCap*100):0;
    const sinBar=e.type==='inquisitor'?`<div class="sin-label">⚖️ 罪惡值 ${b.sinValue||0}/${b.sinCap||0}｜${sinPct}%</div><div class="sinbar"><span style="width:${Math.min(100,sinPct)}%"></span></div>`:'';
    el.innerHTML=`
      ${sprite}
      <div class="ename">${e.name}</div>
      <div class="ebar"><span style="width:${pct}%"></span></div>
      ${sinBar}<div class="eintent">HP ${shownHp}/${e.maxhp}${e.shield>0?` ｜ 🛡 護盾 ${e.shield}`:''}${e.poison>0?` ｜ ☠ 中毒 ${e.poison} 層`:''}${e.bleed>0?` ｜ 🩸 流血 ${e.bleed} 層`:''}${e.burn>0?` ｜ 🔥 燒傷 ${e.burn} 層`:''}${e.trauma>0?` ｜ 🩹 創傷 ${e.trauma} 層`:''}${e.sepsis>0?` ｜ 🦠 敗血 ${e.sepsis} 層`:''}${e.fracture>0?` ｜ 🦴 斷骨 ${e.fracture} 層`:''}${e.statusResist>0?` ｜ ✝️ 負面狀態抗性 ${Math.round(e.statusResist*100)}%`:''}${INQUISITOR_LEADERS.includes(e.type)?' ｜ ⚖️ 永久減傷 30%':''}${e.type==='samurai'?' ｜ 🧘 心流 ×1.5':''}${e.type==='cultLeader'?` ｜ 🔥 狂信 ${b.fanaticism}/20`:''}${e.type==='cthulhu'?` ｜ 🔥 凍結狂信 ${e.inheritedFanaticism}/20`:''}${e.type==='skeleton'?` ｜ 🦴 骨甲 ${e.boneArmor}/${skeletonGrowth(G.floor).maxArmor}`:''}${e.type==='gargoyle'&&e.gargoylePower>0?` ｜ ⚔ 祈禱攻擊 +${Math.round(e.gargoylePower*100)}%`:''}${e.type==='kun'?` ｜ 🌊 北冥潮 ${e.northTide}/16`:''}${e.type==='peng'?` ｜ 🌪 焚風｜攻擊 +${Math.round((e.pengAttackBonus||0)*100)}%`:''}${e.maxEvasion>0?` ｜ 💨 閃避 ${e.evasion}/${e.maxEvasion}`:''}${e.broken>0?' ｜ 🪶 折翼':''}${e.type==='cultist'&&e.stolenUpgrade?` ｜ 🔒 ${ALL_PASSIVES.find(p=>p.id===e.stolenUpgrade)?.name||e.stolenUpgrade}`:''}${demonStatus} ｜ ${intent}</div>
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
  const b=G.battle;const c=b.deck.pop();b.hand.push(c);assignHallucination(c);SFX.draw();
  const card=document.createElement('div'),shown=shownCard(c);
  card.className='card dealing'+(shown.red?' red':'');
  card.innerHTML=`<div class="v">${cardLabel(shown)}</div><div class="s">${shown.s}</div>`;
  $('pl-cards').appendChild(card);$('deck-count').textContent=b.deck.length;
  updateTotalOnly();setTimeout(cb,260);
}
function assignHallucination(card){if(G.battle&&G.battle.hallucination&&Math.random()<.05)card._illusion=randomCard();}
function shownCard(card){return card&&(card._illusion||card._peekIllusion)||card;}
function revealHallucinations(){const b=G.battle;if(!b)return;const fooled=b.hand.filter(c=>c._illusion||c._peekIllusion);if(fooled.length)log(`🫥 幻覺揭露：${fooled.map(c=>{const fake=c._illusion||c._peekIllusion;return `${cardLabel(fake)}${fake.s}其實是 ${cardLabel(c)}${c.s}`;}).join('、')}。`,'dmg');b.hand.forEach(c=>{delete c._illusion;delete c._peekIllusion;});renderHand();}
function updateTotalOnly(){const t=handTotal(G.battle.hand);const el=$('pl-total');el.textContent=t;el.classList.toggle('bust',t>21);updateOutgoing();updateIncoming();}
function updateHandUI(){updateTotalOnly();$('deck-count').textContent=G.battle.deck.length;}
function renderHand(){
  const b=G.battle;const el=$('pl-cards');el.innerHTML='';
  b.hand.forEach((c,i)=>{
    const card=document.createElement('div'),shown=shownCard(c);
    card.className='card'+(shown.red?' red':'')+(b.discardMode?' discardable':'')+(b.suitMode?' suit-selectable':'')+(b.suitSelected===i?' suit-selected':'');
    card.innerHTML=`<div class="v">${cardLabel(shown)}</div><div class="s">${shown.s}</div>`;
    if(b.discardMode)card.onclick=()=>doDiscard(i);
    else if(b.suitMode)card.onclick=()=>{b.suitSelected=i;renderHand();renderSuitPicker('battle-suit-picker',true,s=>changeBattleSuit(s));};
    el.appendChild(card);
  });
}
function toggleDiscard(){
  const b=G.battle,cost=currentControlCost('cardsharp');if(b.over||b.busy||b.pendingBust||b.controlLeft<cost||skillIsLocked('cardsharp'))return;
  b.discardMode=!b.discardMode;b.suitMode=false;b.suitSelected=null;renderHand();updateDiscardBtn();updateSuitMagicBtn();
}
function doDiscard(i){
  const b=G.battle,cost=currentControlCost('cardsharp');if(!b.discardMode||b.controlLeft<cost||skillIsLocked('cardsharp'))return;
  b.hand.splice(i,1);b.controlLeft-=cost;G.control=b.controlLeft;b.discardMode=false;SFX.draw();
  log(`🤵 老千：丟棄一張手牌（控制值 −${cost}）`,'hit');
  renderHand();updateHandUI();updateDiscardBtn();syncButtons();renderTop();
}
function updateDiscardBtn(){
  const b=G.battle;if(!b||!ownsP('cardsharp')){$('btn-discard').classList.add('hidden');return;}
  $('btn-discard').classList.remove('hidden');
  const cost=currentControlCost('cardsharp');
  $('btn-discard').textContent=skillIsLocked('cardsharp')?'🔒 老千被封鎖':(b.discardMode?'🤵 點手牌丟棄（按此取消）':`🤵 老千 −${cost}（控制 ${b.controlLeft}/${b.controlCap}）`);
  $('btn-discard').disabled=b.over||b.busy||b.pendingBust||b.controlLeft<cost||skillIsLocked('cardsharp');
}
function renderSuitPicker(id,visible,onPick){
  const el=$(id);el.classList.toggle('hidden',!visible);
  if(!visible){el.innerHTML='';return;}
  el.innerHTML=SUITS.map(s=>`<button class="${s==='♥'||s==='♦'?'red':''}" data-suit="${s}">${s} ${suitName(s)}</button>`).join('');
  el.querySelectorAll('[data-suit]').forEach(btn=>btn.onclick=()=>onPick(btn.dataset.suit));
}
function toggleSuitMagic(){
  const b=G.battle,cost=currentControlCost('suitmage');if(!b||b.over||b.busy||b.pendingBust||b.controlLeft<cost||skillIsLocked('suitmage'))return;
  b.suitMode=!b.suitMode;b.suitSelected=null;b.discardMode=false;renderHand();updateDiscardBtn();updateSuitMagicBtn();
}
function changeBattleSuit(suit){
  const b=G.battle,cost=currentControlCost('suitmage'),c=b&&b.hand[b.suitSelected];if(!c||!SUITS.includes(suit)||b.controlLeft<cost||skillIsLocked('suitmage'))return;
  const old=c.s;c.s=suit;c.red=suit==='♥'||suit==='♦';b.controlLeft-=cost;G.control=b.controlLeft;b.suitMode=false;b.suitSelected=null;
  log(`🎭 花色魔術：${cardLabel(c)}${old} → ${cardLabel(c)}${suit}（控制值 −${cost}）`,'good');renderHand();updateHandUI();updateSuitMagicBtn();renderTop();
}
function updateSuitMagicBtn(){
  const b=G.battle,btn=$('btn-suitmagic'),cost=currentControlCost('suitmage');
  if(!b||!ownsP('suitmage')){btn.classList.add('hidden');$('battle-suit-picker').classList.add('hidden');return;}
  btn.classList.remove('hidden');btn.textContent=skillIsLocked('suitmage')?'🔒 花色魔術被封鎖':(b.suitMode?'🎭 選擇手牌（按此取消）':`🎭 花色魔術 −${cost}（控制 ${b.controlLeft}/${b.controlCap}）`);
  btn.disabled=b.over||b.busy||b.pendingBust||b.controlLeft<cost||skillIsLocked('suitmage');
  if(!b.suitMode)renderSuitPicker('battle-suit-picker',false,()=>{});
}
function syncButtons(){
  const b=G.battle;
  $('btn-hit').disabled=b.over||b.busy||b.pendingBust||(b.hesitation>0&&b.hits>=hesitationLimit());
  $('btn-stand').disabled=b.over||b.busy;
  $('btn-stand').textContent=b.blind>0?`🌑 解除致盲（${b.blind}）`:'攻擊 Attack';
  $('btn-defend').disabled=b.over||b.busy||b.pendingBust||handTotal(b.hand)>21||bloodDescendantActive();
  $('btn-defend').textContent=bloodDescendantActive()?'🩸 血魔契約：無法防禦':'防禦 Defend';
  $('btn-escape').classList.toggle('hidden',!b.cthulhuPhase);
  $('btn-escape').disabled=b.over||b.busy||b.pendingBust;
  updateAtonementButtons();
  updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();
}

function atonementGoldCost(){const b=G.battle,base=Math.max(1,Math.round(floorReward(G.floor,false)*.5));return Math.max(1,Math.round(base*Math.pow(1.6,b&&b.redemptionUses||0)));}
function updateAtonementButtons(){
  const b=G.battle,active=!!(b&&b.inquisitorBattle&&b.inquisitorPhase===2),total=active?handTotal(b.hand):0,blocked=!active||b.over||b.busy||b.pendingBust||total>21||(b.sinValue||0)<=0;
  const defs=[['btn-atonement-free',3,'🙏 無價贖罪'],['btn-atonement-gold',6,'🪙 金錢贖罪'],['btn-atonement-control',10,'🎴 控制贖罪']];
  defs.forEach(([id,rate,label])=>{const btn=$(id);btn.classList.toggle('hidden',!active);if(!active)return;const value=Math.min(b.sinValue||0,total*rate);btn.textContent=`${label}：罪惡 −${value}${id==='btn-atonement-gold'?`（${atonementGoldCost()} 金）`:id==='btn-atonement-control'?'（3 控制）':''}`;btn.disabled=blocked||(id==='btn-atonement-gold'&&G.gold<atonementGoldCost())||(id==='btn-atonement-control'&&b.controlLeft<3);});
}

function updateRedrawBtn(){
  const b=G.battle;if(!b){return;}
  if(!ownsP('redraw')){$('btn-redraw').classList.add('hidden');return;}
  $('btn-redraw').classList.remove('hidden');
  const cost=currentControlCost('redraw');
  $('btn-redraw').textContent=skillIsLocked('redraw')?'🔒 重抽被封鎖':`重抽 −${cost}（控制 ${b.controlLeft}/${b.controlCap}）`;
  $('btn-redraw').disabled=b.over||b.busy||b.controlLeft<cost||skillIsLocked('redraw');
}
function updatePeekBtn(){
  const b=G.battle;if(!b){return;}
  if(!ownsP('peek')){$('btn-peek').classList.add('hidden');return;}
  $('btn-peek').classList.remove('hidden');
  const cost=currentControlCost('peek');
  $('btn-peek').textContent=skillIsLocked('peek')?'🔒 透視被封鎖':`透視 −${cost}（控制 ${b.controlLeft}/${b.controlCap}）`;
  $('btn-peek').disabled=b.over||b.controlLeft<cost||skillIsLocked('peek');
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
  const shieldStr=bloodDescendantActive()?'（血魔契約禁止防禦）':b.blind>0?'（致盲 −20%）':shieldDef>0?`（含圓盾 +${shieldDef}）`:'';
  const fdStr=(hasP('dragonneck')&&!busted&&b.hand.length>=5)?'（🐉五龍！再回 HP）':'';
  let txt;
  if(b.blind>0){txt=t>=19&&t<=21?`🌑 可完全解除 ${b.blind} 層致盲 ｜ 🛡 防禦 ${projDef}${shieldStr}`:t<=18?`🌑 可解除 1 層致盲 ｜ 🛡 防禦 ${projDef}${shieldStr}`:'🌑 爆牌：無法解除致盲';$('outgoing').textContent=txt;return;}
  if(busted&&dmg===0) txt='🗡 爆牌：造成 0 傷害，無法防禦';
  else if(busted) txt=`🗡 爆牌：保險造成 ${dmg} 傷害，無法防禦`;
  else if(tgt&&ghostInvincible(tgt)) txt=`🗡 攻擊 ${dmg}${fdStr}（${tgt.name}無敵會擋） ｜ 🛡 防禦 ${projDef}${shieldStr}`;
  else txt=`🗡 攻擊 ${dmg}${fdStr} ｜ 🛡 防禦 ${projDef}${shieldStr}`;
  if(currentWeaknessStacks()>0){
    txt+=`（📉虛弱 −${currentWeaknessStacks()*10}%）`;
  }
  $('outgoing').textContent=txt;
}

function hit(){
  const b=G.battle;if(b.over||b.busy||b.pendingBust)return;
  if(b.hesitation>0&&b.hits>=hesitationLimit())return;
  b.discardMode=false;b.suitMode=false;b.suitSelected=null;
  b.busy=true;syncButtons();
  const rolled=b.mentalDisorder>0?rnd(1,2):1,count=b.hesitation>0?Math.min(rolled,Math.max(0,hesitationLimit()-b.hits)):rolled;let drawn=0;
  const finish=()=>{
    b.busy=false;
    if(handTotal(b.hand)>21){
      if(hasP('redraw')&&isUp('redraw')&&b.controlLeft>=currentControlCost('redraw')){
        b.pendingBust=true;
        log('💥 爆牌！可用「重抽」救牌，或按「停牌」接受爆牌。','dmg');
        syncButtons();
      } else resolveBust();
    } else syncButtons();
  };
  const drawNext=()=>{
    if(drawn>=count||handTotal(b.hand)>21){finish();return;}
    const c=b.deck.pop();b.hand.push(c);assignHallucination(c);drawn++;b.hits++;SFX.draw();
    const shown=shownCard(c),card=document.createElement('div');card.className='card dealing'+(shown.red?' red':'');card.innerHTML=`<div class="v">${cardLabel(shown)}</div><div class="s">${shown.s}</div>`;$('pl-cards').appendChild(card);
    log(`抽到 ${cardLabel(shown)}${shown.s}${c._illusion?'（你看見的牌面）':''}`,'hit');updateHandUI();setTimeout(drawNext,220);
  };
  drawNext();
}

function rapidStrikeProfile(hand,busted){
  const insN=isUp('insurance')?3:2,damageHand=busted?hand.slice(0,insN):hand;
  let pointDamage=rankDamageBase(damageHand),additive=0;const notes=[];
  const add=(value,label)=>{if(value>0){additive+=value;notes.push(`${label}+${value}`);}};
  if(!busted&&handTotal(hand)===21){pointDamage=Math.round(pointDamage*1.5);notes.push('點數21×1.5');}
  if(!busted&&hasP('doublebet')&&handTotal(hand)%2===1){const m=gambleMultiplier(handTotal(hand));pointDamage=Math.round(pointDamage*m);notes.push(`點數豪賭×${m}`);}
  if(currentWeaknessStacks()>0){const m=intimidationMult();pointDamage=Math.round(pointDamage*m);notes.push(`點數虛弱×${m.toFixed(1)}`);}
  if(!busted&&activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4){pointDamage=Math.round(pointDamage*2);notes.push('點數同花×2');}
  else if(!busted&&activeSuitMastery()==='mono'&&monoHandActive(hand)){pointDamage=Math.round(pointDamage*1.5);notes.push('點數純色×1.5');}
  if(!busted&&lastStandActive()){const m=bloodDescendantActive()?1.8:isUp('laststand')?1.6:1.5;pointDamage=Math.round(pointDamage*m);notes.push(`點數背水×${m}`);}
  if(!busted&&hasP('bulwark')&&isUp('bulwark')&&G.battle){const excess=Math.max(0,G.battle.defense-incomingTotal()),steps=Math.min(6,Math.floor(excess/10));if(steps>0){const m=1+steps*.1;pointDamage=Math.round(pointDamage*m);notes.push(`點數堡壘×${m.toFixed(1)}`);}}
  if(!busted&&bloodDescendantActive()&&G.battle&&G.battle.bloodDamageStacks>0){const m=descendantDamageMultiplier();pointDamage=Math.round(pointDamage*m);notes.push(`點數後裔×${m.toFixed(2)}`);}
  if(!busted&&hasP('doublebet'))add(isUp('doublebet')?12:8,'豪賭');
  if(hasP('facemult')){const n=hand.filter(c=>['J','Q','K'].includes(c.r)).length;add(n*(isUp('facemult')?4:3),'面牌');}
  if(!busted&&hasP('firststrike')&&G.battle&&G.battle.round===1){const total=handTotal(hand),ok=isUp('firststrike')?hand.length<=3&&total>=19&&total<=21:hand.length===2&&total===20;if(ok)add(isUp('firststrike')?30:20,'先發');}
  if(!busted&&hasP('straight')){const run=longestStraight(hand);if(run>=3)add(isUp('straight')?(run>=4?40:24):18,'連號');}
  if(!busted&&hasP('court')&&hasCourt(hand))add(isUp('court')?50:35,'宮廷');
  if(!busted&&hasP('spadeart'))add(effectiveSuitCount(hand,'♠')*(isUp('spadeart')?3:2),'黑桃');
  if(!busted&&hasP('safe21')&&handTotal(hand)>=17)add(isUp('safe21')?8:5,'安全線');
  if(!busted&&hasP('dragonneck')&&hand.length>=5)add(50+(isUp('dragonneck')?Math.round(handTotal(hand)*.5):0),'五龍');
  if(!busted&&hasP('echelon')){const extra=hand.length-2;if(extra>0)add(fact(extra+(isUp('echelon')?1:0)),'階層');}
  if(!busted&&G.battle&&G.battle.focus>0)add(G.battle.focus,'蓄勢');
  if(!busted&&activeSuitMastery()==='four_suits'&&hasFourSuits(hand))add(40,'四象');
  else if(!busted&&activeSuitMastery()==='alternating')add(alternationCount(hand)*12,'交替');
  add(affixAttackFlat(),'暗器');
  if(!busted&&hasP('bountyhunter')&&G.bountyHunt&&G.bountyHunt.bonuses.length)add(G.bountyHunt.bonuses[0],'賞金');
  const rate=isUp('thousandstrikes')?0.4:0.3,segments=Math.max(1,Math.round(Math.max(0,pointDamage)*rate)),sharpMult=affixAttackMult(),segmentDamage=Math.max(1,Math.round((1+additive)*.6*sharpMult));
  if(sharpMult>1)notes.push(`鋒利×${sharpMult.toFixed(2)}`);
  notes.push(`⚡一瞬千擊 ${segments} 段×${segmentDamage}`);
  return {dmg:segments*segmentDamage,notes,rapid:{segments,segmentDamage,pointDamage,additive,rate}};
}
function computeDamage(hand,busted){
  if(busted&&!hasP('insurance'))return {dmg:0,notes:[]};
  if(hasP('thousandstrikes'))return rapidStrikeProfile(hand,busted);
  const insN=isUp('insurance')?3:2;
  const damageHand=busted?hand.slice(0,insN):hand,plainBase=handTotal(damageHand),rankBase=rankDamageBase(damageHand);
  let dmg=rankBase;
  const notes=[];
  if(rankBase>plainBase+0.001)notes.push(`🔢牌面強化+${(rankBase-plainBase).toFixed(2)}`);
  if(!busted&&hasP('doublebet')){const v=isUp('doublebet')?12:8;dmg+=v;notes.push(`豪賭基礎+${v}`);}
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
  const affixFlat=affixAttackFlat();if(affixFlat){dmg+=affixFlat;notes.push(`暗器+${affixFlat}`);}
  if(!busted&&handTotal(hand)===21){dmg=Math.round(dmg*1.5);notes.push('21點×1.5');}
  if(hasP('doublebet')&&!busted&&handTotal(hand)%2===1){const m=gambleMultiplier(handTotal(hand));dmg=Math.round(dmg*m);notes.push('豪賭單數×'+m);}
  if(!busted&&hasP('dragonneck')&&hand.length>=5){let bonus=50;if(isUp('dragonneck'))bonus+=Math.round(handTotal(hand)*0.5);dmg+=bonus;notes.push('🐉五龍+'+bonus);}
  if(!busted&&hasP('echelon')){const extra=hand.length-2;if(extra>0){const b=fact(extra+(isUp('echelon')?1:0));dmg+=b;notes.push('📈階層+'+b);}}
  if(!busted&&G.battle&&G.battle.focus>0){dmg+=G.battle.focus;notes.push('⚡蓄勢+'+G.battle.focus);}
  if(G.battle&&currentWeaknessStacks()>0){
    const m=intimidationMult();
    dmg=Math.round(dmg*m);
    notes.push(`📉虛弱−${currentWeaknessStacks()*10}%`);
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
  const sharpMult=affixAttackMult();if(sharpMult>1){dmg=Math.round(dmg*sharpMult);notes.push(`鋒利×${sharpMult.toFixed(2)}`);}
  return {dmg:Math.max(0,Math.round(dmg)),notes};
}

function computeDefense(hand){
  const b=G.battle,t=handTotal(hand);
  if(t>21)return 0;
  const heartRate=hasP('heartguard')?(isUp('heartguard')?0.5:0.3):0;
  const repeatPenalty=Math.max(0.4,1-(b.guardStreak||0)*0.2);
  let def=Math.floor((t*(0.65+heartRate)+(hasP('clubstance')?effectiveSuitCount(hand,'♣')*(isUp('clubstance')?4:3):0)+affixDefenseFlat())*repeatPenalty);
  if(hasP('straight')){const run=longestStraight(hand);if(run>=3)def+=isUp('straight')?(run>=4?40:24):18;}
  if(hasP('court')&&isUp('court')&&hasCourt(hand))def+=25;
  if(activeSuitMastery()==='four_suits'&&hasFourSuits(hand))def+=40;
  else if(activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4)def*=2;
  else if(activeSuitMastery()==='alternating')def+=alternationCount(hand)*12;
  else if(activeSuitMastery()==='mono'&&monoHandActive(hand))def=Math.round(def*1.5);
  if(lastStandActive()&&!isUp('laststand'))def=Math.floor(def*0.8);
  if(b.blind>0)def=Math.floor(def*0.8);
  def=Math.floor(def*affixDefenseMult());
  return Math.max(1,Math.floor(def));
}

function applyHeartEcho(hand){
  const b=G.battle;if(!hasP('heartecho')||!b||b.heartEchoes<=0)return;
  const n=effectiveSuitCount(hand,'♥');if(n<=0)return;
  const result=combatHeal(n*4);b.heartEchoes--;
  log(`♥ 紅心回響：回復 ${result.healed} HP${result.mult<1?`（腐敗後）`:''}（剩 ${b.heartEchoes} 次）`,'good');renderTop();
}
function executeRapidStrikes(profile,busted=false){
  const b=G.battle,initialTarget=currentTarget(),results=[];let target=initialTarget,totalDealt=0,statusProcDone=false,used=0,transformed=false;
  log(`⚡ 一瞬千擊展開：${profile.segments} 段，每段基礎 ${profile.segmentDamage} 傷害。`,'gd');
  for(let i=0;i<profile.segments;i++){
    if(!target||target.curhp<=0){const alive=b.enemies.filter(e=>e.curhp>0);if(!alive.length)break;target=alive[rnd(0,alive.length-1)];log(`⚡ 溢出的第 ${i+1} 段轉向 ${target.name}！`,'hit');}
    b.target=target.idx;const dealt=attackEnemy(profile.segmentDamage,{busted,rapid:true,suppressStatusProc:statusProcDone});used++;
    if(dealt>0){results.push({target,dealt});totalDealt+=dealt;statusProcDone=true;}
    if(target.justTransformed){transformed=true;break;}
  }
  log(`⚡ 一瞬千擊結算：命中 ${results.length}/${used} 段，合計 ${totalDealt} 傷害。`,totalDealt>0?'gd':'dmg');
  return {dealt:totalDealt,results,initialTarget,statusTarget:results[0]&&results[0].target,transformed};
}

function resolveBust(){
  const b=G.battle,lostFocus=b.focus||0;
  b.pendingBust=false;b.guardStreak=0;b.focus=0;b.inquisitorDamageCrime=false;revealHallucinations();applyDisciplineAction('attack',true);if(b.upgradeReprieve>0)b.upgradeReprieve=0;SFX.bust();log('💥 爆牌！','dmg');
  if(lostFocus>0)log(`⚡ 蓄勢潰散：失去 ${lostFocus} 點蓄勢。`,'dmg');
  let {dmg,notes,rapid}=computeDamage(b.hand,true);
  if(b.blind>0){log('🌑 致盲中爆牌，無法解除致盲，也不會發動保險攻擊。','dmg');if(applyGamblePenalty(handTotal(b.hand),true))return;endPlayerTurn();return;}
  if(dmg>0){log(`保險生效，仍造成 ${dmg} 傷害`+(notes.length?`（${notes.join('，')}）`:''),'good');if(rapid)executeRapidStrikes(rapid,true);else attackEnemy(dmg,{busted:true});}
  else log('本回合攻擊無效。');
  if(applyGamblePenalty(handTotal(b.hand),true))return;
  eagleRecoverEvasion('爆牌');
  endPlayerTurn();
}

function attack(){
  const b=G.battle;if(b.over||b.busy)return;
  if(b.pendingBust){resolveBust();return;}
  if(b.blind>0){resolveBlind();return;}
  const t=handTotal(b.hand);
  const fiveDragon=hasP('dragonneck')&&b.hand.length>=5;
  let {dmg,notes,rapid}=computeDamage(b.hand,false);
  b.inquisitorDamageCrime=false;revealHallucinations();applyDisciplineAction('attack');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  b.guardStreak=0;
  log(`🗡 選擇攻擊，點數 ${t}`+(notes.length?`（${notes.join('，')}）`:''));
  applyHeartEcho(b.hand);
  b.focus=0;
  if(fiveDragon)log('🐉 龍頭項鍊·五龍！五張不爆觸發！','gd');
  const initialTarget=currentTarget(),rapidResult=rapid?executeRapidStrikes(rapid,false):null,attackedTarget=rapidResult&&rapidResult.statusTarget||initialTarget,dealt=rapidResult?rapidResult.dealt:attackEnemy(dmg);
  const transformed=rapidResult?rapidResult.transformed:!!(attackedTarget&&attackedTarget.justTransformed);if(transformed&&attackedTarget)attackedTarget.justTransformed=false;
  if(dealt>0&&!transformed)applyToxicology(attackedTarget,b.hand);
  if(dealt>0&&!transformed&&bloodDescendantActive()){
    const gained=addSepsis(attackedTarget,1);if(gained>0){log(`🦠 後裔攻擊：${attackedTarget.name} 敗血 +${gained}（目前 ${attackedTarget.sepsis}/5 層）。`,'good');if(G.battle.inquisitorBattle&&(INQUISITOR_LEADERS.includes(attackedTarget.type)||attackedTarget.inquisitorEscort))addInquisitorStatusCrime(gained,'敗血');}
  }
  if(dealt>0&&hasP('bountyhunter')&&b.bountyHuntActive&&G.bountyHunt&&G.bountyHunt.bonuses.length){
    const used=G.bountyHunt.bonuses.shift();log(`💰 賞金獵人加成 +${used} 已消耗。`,'gd');
    if(!G.bountyHunt.bonuses.length)G.bountyHunt=null;
  }
  if(hasP('vampire')&&dealt>0){
    const baseRate=bloodDescendantActive()?0.5:isUp('vampire')?0.3:0.2;
    if(rapidResult){let healed=0,triggers=0;rapidResult.results.forEach(hit=>{const rate=baseRate*thirstMultiplier()*sepsisMultiplier(hit.target)*.3,result=combatHeal(Math.round(hit.dealt*rate),true);healed+=result.healed;triggers++;});log(`⚡ 多段吸血：${triggers} 次分別以原效率 30% 結算，共回復 ${healed} HP。`,'good');}
    else{const sepsis=sepsisMultiplier(attackedTarget),rate=baseRate*thirstMultiplier()*sepsis,result=combatHeal(Math.round(dealt*rate),true);log(`吸血賭注（${Math.round(rate*100)}%${bloodDescendantActive()?'，後裔基礎 50%':''}${thirstMultiplier()>1?`，渴血 ${playerThirstStacks()} 層 ×${thirstMultiplier().toFixed(1)}`:''}${sepsis>1?`，敗血 +${Math.round((sepsis-1)*100)}%`:''}）：回復 ${result.healed} HP${result.mult<1?'（腐敗後）':''}`,'good');}
  }
  if(fiveDragon){let heal=50;if(isUp('dragonneck'))heal+=Math.round(t*0.2);const result=combatHeal(heal);log(`🐉 五龍回復 ${result.healed} HP${result.mult<1?'（腐敗後）':''}`,'good');renderTop();}
  if(applyGamblePenalty(t,false))return;
  endPlayerTurn();
}

function resolveBlind(){
  const b=G.battle,t=handTotal(b.hand);b.guardStreak=0;revealHallucinations();applyDisciplineAction('attack');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  if(t>=19&&t<=21){const removed=b.blind;b.blind=0;log(`🌑 ${t} 點洞穿黑暗：完全解除 ${removed} 層致盲！`,'gd');}
  else if(t>=2&&t<=18){b.blind=Math.max(0,b.blind-1);log(`🌑 ${t} 點穩住感官：解除 1 層致盲（剩餘 ${b.blind}）。`,'good');}
  else log('🌑 爆牌無法解除致盲。','dmg');
  applyHeartEcho(b.hand);if(applyGamblePenalty(t,t>21))return;endPlayerTurn();
}

function defend(){
  const b=G.battle;if(b.over||b.busy||b.pendingBust)return;
  if(bloodDescendantActive()){log('📜 血魔後裔的血魔契約使你無法選擇防禦。','dmg');syncButtons();return;}
  const t=handTotal(b.hand),gambleMult=gambleMultiplier(t),fractureMult=fractureMultiplier(b);
  revealHallucinations();applyDisciplineAction('defense');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  const def=Math.floor(computeDefense(b.hand)*gambleMult*fractureMult);
  const shield=useBuckler();
  shield.def=Math.round(shield.def*gambleMult*fractureMult*(b.blind>0?0.8:1));
  const clubBonus=hasP('clubstance')&&effectiveSuitCount(b.hand,'♣')>=3?(isUp('clubstance')?8:5):0;
  const focusGain=b.buffSuppressed>0?0:Math.ceil((def+shield.def)*BALANCE.focusRate)+clubBonus;
  b.defense+=def+shield.def;b.guardStreak++;
  b.focus=Math.min(BALANCE.focusCap,b.focus+focusGain);
  SFX.shield();
  const penalty=b.guardStreak>1?`（連續防禦效率降低）`:'';
  const shieldNote=shield.def>0?`、圓盾 +${shield.def}`:'';
  applyHeartEcho(b.hand);
  const gambleNote=hasP('doublebet')&&t%2===1?`（🎲豪賭單數×${gambleMult}）`:'';
  const fractureNote=b.fracture>0?`（🦴斷骨 −${b.fracture*15}%）`:'';
  log(`🛡 選擇防禦：獲得 ${def} 防禦${shieldNote}、蓄勢 +${focusGain}（目前 ${b.focus}）${b.buffSuppressed>0?'（威壓封鎖蓄勢）':''}${b.blind>0?'（致盲使防禦 −20%）':''}${clubBonus&&b.buffSuppressed<=0?`（♣架勢額外 +${clubBonus}）`:''}${gambleNote}${fractureNote}${penalty}`,'good');
  if(shield.broke)log('🛡 圓盾耐久耗盡，本次防禦後損毀！','dmg');
  if(applyGamblePenalty(t,false))return;
  eagleRecoverEvasion('選擇防禦');
  endPlayerTurn();
}

function escapeAbyss(){
  const b=G.battle;if(!b||!b.cthulhuPhase||b.over||b.busy||b.pendingBust)return;
  const total=handTotal(b.hand);revealHallucinations();applyDisciplineAction('escape');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  const gain=total>21?0:total===21?6:total===20?4:total>=17?3:total>=13?2:total>=2?1:0;
  b.abyssDistance=Math.min(b.abyssMax||20,(b.abyssDistance||0)+gain);
  log(`🏃 逃跑：以 ${total} 點拉開 ${gain} 層距離（深淵距離 ${b.abyssDistance}/${b.abyssMax}）。`,'good');
  endPlayerTurn();
}

function atone(kind){
  const b=G.battle;if(!b||!b.inquisitorBattle||b.inquisitorPhase!==2||b.over||b.busy||b.pendingBust||handTotal(b.hand)>21||(b.sinValue||0)<=0)return;
  const total=handTotal(b.hand),rate=kind==='control'?10:kind==='gold'?6:3,cost=kind==='gold'?atonementGoldCost():0;
  if(kind==='gold'&&G.gold<cost||kind==='control'&&b.controlLeft<3)return;
  if(kind==='gold'){G.gold-=cost;b.redemptionUses=(b.redemptionUses||0)+1;}if(kind==='control')b.controlLeft-=3;
  const wanted=total*rate,before=b.sinValue;b.sinValue=Math.max(0,b.sinValue-wanted);const reduced=before-b.sinValue;
  const finish=()=>{refreshInquisitorSinDamage();b.guardStreak=0;b.focus=0;revealHallucinations();applyDisciplineAction('atonement');applyHeartEcho(b.hand);SFX.win();log(`${kind==='control'?'🎴 控制':kind==='gold'?'🪙 金錢':'🙏 無價'}贖罪：以 ${total} 點降低 ${reduced} 罪惡值（${b.sinValue}/${b.sinCap}）${cost?`，支付 ${cost} 金幣`:''}${kind==='control'?'，消耗 3 控制值':''}。`,'gd');renderTop();endPlayerTurn();};
  if(b.bloodJudgment)finish();else changeFaction(reduced,finish,true);
}

function attackEnemy(dmg,opts={}){
  const e=currentTarget();if(!e)return 0;
  if(ghostInvincible(e)){
    SFX.shield();log(`${e.name} 處於無敵回合，攻擊被擋下！`,'dmg');floatNum(e.idx,'🛡️','#bfe6ff');return 0;
  }
  if((e.maxEvasion||0)>0){
    const total=handTotal(G.battle.hand),dodged=e.evasion>0&&(opts.busted||total<=16);
    if(dodged){
      e.evasion--;if(e.dodgeCounter==='dive')activateEagleDive(e);SFX.shield();
      log(`💨 ${e.name}消耗 1 層閃避躲開攻擊！${e.dodgeCounter==='dive'?'下一次行動改為俯衝反擊。':''}`,'dmg');floatNum(e.idx,'閃避','#bfe6ff');renderEnemies();return 0;
    }
    if(e.foldable!==false&&!opts.busted&&total>=20&&total<=21){
      e.evasion=0;e.broken=2;e.weakened=true;e.nextDmg=Math.max(1,Math.round((e.nextDmg||0)*0.75));
      log(`🪶 ${total} 點命中！${e.name}折翼：清除全部閃避，本回合攻擊 −25%。`,'gd');
    }else if(e.foldable===false&&!opts.busted&&total>=20&&total<=21&&e.evasion>0){
      const removed=Math.min(2,e.evasion);e.evasion-=removed;log(`🎯 ${total} 點貫穿高速軌跡：命中並削減 ${removed} 層閃避（剩餘 ${e.evasion}/${e.maxEvasion}）。`,'good');
    }else if(!opts.busted&&total>=17&&total<=19&&e.evasion>0){
      e.evasion--;log(`🎯 ${total} 點鎖定高速目標：命中並清除 1 層閃避。`,'good');
    }
  }
  if(e.type==='robot'&&e.robotAction==='cool'&&dmg>0){dmg=Math.round(dmg*1.4);log('❄️ 過熱弱點：對機器人最終傷害 ×1.4！','gd');}
  if(e.type==='cultist'&&e.cultistAction==='prayer'&&!livingGargoyle()&&dmg>0){dmg=Math.round(dmg*1.3);log('🕯 反噬祈禱：對邪教徒最終傷害 ×1.3！','gd');}
  if(hasP('faithneck')&&faithNecklaceHostile(e)&&dmg>0){const before=dmg;dmg=Math.max(1,Math.round(dmg*1.10));log(`📿 神蹟共鳴：對敵對勢力的傷害 ${before} → ${dmg}。`,'gd');}
  if(e.type==='cultLeader'&&dmg>0){const alive=courtGargoylesAlive().length;if(alive){const before=dmg;dmg=Math.max(1,Math.round(dmg*(1-alive*.25)));log(`🗿 ${alive} 尊存活石像使教宗減傷 ${alive*25}%：${before} → ${dmg}。`,'dmg');}}
  if(INQUISITOR_LEADERS.includes(e.type)&&dmg>0){const before=dmg;dmg=Math.max(1,Math.round(dmg*.7));log(`⚖️ 永久減傷 30%：${before} → ${dmg}。`,'dmg');}
  if(G.battle.inquisitorBattle&&dmg>0&&(INQUISITOR_LEADERS.includes(e.type)||e.inquisitorEscort)&&!G.battle.inquisitorDamageCrime){G.battle.inquisitorDamageCrime=true;addInquisitorCrime(1,'造成傷害');}
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
  if(e.type==='gargoyle'&&dmg>0&&(G.battle.lockedSkills||[]).some(x=>x.ordinary&&x.sourceIdx===e.idx)){
    const total=handTotal(G.battle.hand),threshold=gargoyleUnlockThreshold(G.floor);
    if(canBreakGargoyleLock(total,dmg,opts.busted))releaseGargoyleLocks(e.idx);
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
  if(e.type==='samurai'&&e.samuraiAction==='mikiri'&&dmg>0){
    if(!e.mikiriOutcome){
      const total=handTotal(G.battle.hand);
      if(!opts.busted&&(total===20||total===21)){e.mikiriOutcome='broken';log(`🎯 ${total} 點洞破見切！武士無法減傷或發動返刃。`,'gd');}
      else if(!opts.busted&&total>=17&&total<=19){e.mikiriOutcome='partial';e.returnBlade=true;log(`👁️ ${total} 點遭見切：本次攻擊傷害 −25%，武士準備返刃。`,'dmg');}
      else{e.mikiriOutcome='full';e.returnBlade=true;log(`👁️ 攻擊被完全見切：本次攻擊傷害 −50%，武士準備返刃。`,'dmg');}
    }
    const mult=e.mikiriOutcome==='partial'?0.75:e.mikiriOutcome==='full'?0.5:1;if(mult<1)dmg=Math.max(1,Math.round(dmg*mult));
  }
  if(dmg>0&&(e.trauma||0)>0){
    const before=dmg;dmg=Math.round(dmg*traumaAttackMultiplier(e));
    log(`🩹 ${e.name}的創傷使攻擊傷害 ${before} → ${dmg}。`,'good');
  }
  const hpBeforeHit=e.curhp;
  e.curhp-=dmg;
  if(e.type==='demon'&&dmg>0&&e.bloodLockArmed&&(e.bloodLockUses||0)<1&&hpBeforeHit>=e.maxhp*.15&&e.curhp<e.maxhp*.03){
    const lockedHp=Math.max(1,Math.ceil(e.maxhp*.03));
    e.curhp=lockedHp;e.bloodLockUses=(e.bloodLockUses||0)+1;e.bloodLockArmed=false;
    log(`🩸 鮮血鎖命：HP 鎖在 ${lockedHp}；本場唯一一次鎖血已消耗。`,'dmg');
  }
  const bleedHit=opts.suppressStatusProc?{damage:0,remaining:e.bleed||0}:triggerBleed(e,dmg);if(INQUISITOR_LEADERS.includes(e.type)&&bleedHit.damage>0)bleedHit.damage=Math.max(1,Math.round(bleedHit.damage*.7));
  if(bleedHit.damage>0)e.curhp-=bleedHit.damage;
  if(e.type==='dragon'&&e.dragonAction==='sleep'&&rawDmg>0){
    e.wakeNext=true;e.wakeShockPending=true;log('💢 魔龍受到攻擊，將在下回合甦醒並施加虛弱！','dmg');
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
  if(e.type==='inquisitorMounted'&&dmg>0){const total=handTotal(G.battle.hand),before=e.momentum||0,high=dmg>=Math.max(1,Math.round(e.maxhp*.12));if(!opts.busted&&total>=19&&total<=21)e.momentum=Math.max(0,e.momentum-2);if(high)e.momentum=Math.max(0,e.momentum-1);if(e.momentum<before)log(`🐎 精準／重擊削減 ${before-e.momentum} 層馬勢（${e.momentum}/25）。`,'good');}
  if(e.type==='cultLeader'&&dmg>0&&!opts.busted&&!opts.suppressStatusProc){const total=handTotal(G.battle.hand);if(total===20||total===21)addFanaticism(-2,`${total} 點精準命中`);}
  if(bleedHit.damage>0){log(`🩸 ${e.name}流血發作：額外 −${bleedHit.damage} HP，降為 ${bleedHit.remaining} 層。`,'good');floatNum(e.idx,'-'+bleedHit.damage,'#e45c73');}
  if(e.curhp<=0&&e.type==='kun'){
    transformKunToPeng(e,'擊倒');renderEnemies();return Math.max(0,dmg);
  }
  if(e.curhp<=0&&e.type==='cultLeader'){transformCultLeaderToCthulhu('擊倒');renderEnemies();return Math.max(0,dmg);}
  if(e.curhp<=0&&e.type==='inquisitorMounted'){transformInquisitor('擊倒');renderEnemies();return Math.max(0,dmg);}
  if(e.curhp<=0){
    const total=handTotal(G.battle.hand),directExecution=e.type==='zombie'&&!opts.busted&&(total===20||total===21);
    if(e.type==='zombie'&&!e.revived&&!directExecution){
      e.curhp=1;e.downed=true;e.downedRound=G.battle.round;e.nextDmg=0;
      log(`🧟 ${e.name}倒地但尚未死亡！下回合需造成 ${zombieFinishThreshold(G.floor)} 傷害，或以 20／21 點處決。`,'dmg');
    }else{
      if(e.type==='zombie'&&directExecution)log(`🎯 20／21 點命中要害，${e.name}無法復活！`,'gd');
      log(`${e.name} 被擊倒！`,'good');ensureTarget();
      if(e.inquisitorEscort)addInquisitorCrime(5,'擊殺聖騎士');
    }
  }
  if(e.type==='gargoyle'&&e.curhp<=0){
    const cultists=G.battle.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>x.curhp=0);
    releaseGargoyleLocks(e.idx);
    if(cultists.length)log(`🗿 石像鬼崩毀，儀式斷裂！${cultists.length} 名邪教徒隨之死亡。`,'gd');ensureTarget();
  }
  if(e.type==='cultist'&&e.curhp<=0){
    if(e.hasStolen)cultistRestoreUpgrade(e,'歸還');
    reviveCultistsFromGargoyleShield(G.battle.enemies.find(x=>x.type==='gargoyle'&&x.curhp>0));
  }
  renderEnemies();
  return Math.max(0,dmg);
}

function defeatEnemyByPoison(e){
  const b=G.battle;
  if(e.type==='kun'){transformKunToPeng(e,'毒蝕');e.justTransformed=false;return;}
  if(e.type==='cultLeader'){transformCultLeaderToCthulhu('毒蝕');return;}
  if(e.type==='inquisitorMounted'){transformInquisitor('毒蝕');e.justTransformed=false;return;}
  if(e.type==='zombie'&&!e.revived){
    e.curhp=1;e.downed=true;e.downedRound=b.round;e.nextDmg=0;
    log(`☠ ${e.name}被毒倒但尚未死亡！下回合仍可補刀。`,'dmg');
    return;
  }
  if(e.curhp<=0&&COURT_GARGOYLES.includes(e.type))onCourtGargoyleDeath(e);
  e.curhp=0;log(`☠ ${e.name}被中毒擊倒！`,'good');
  if(e.inquisitorEscort)addInquisitorCrime(5,'中毒擊殺聖騎士');
  if(COURT_GARGOYLES.includes(e.type))onCourtGargoyleDeath(e);
  if(e.type==='gargoyle'){
    const cultists=b.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>x.curhp=0);
    releaseGargoyleLocks(e.idx);
    if(cultists.length)log(`🗿 石像鬼被毒蝕崩毀，${cultists.length} 名邪教徒隨之死亡。`,'gd');
  }
  if(e.type==='cultist'){
    if(e.hasStolen)cultistRestoreUpgrade(e,'歸還');
    reviveCultistsFromGargoyleShield(b.enemies.find(x=>x.type==='gargoyle'&&x.curhp>0));
  }
  ensureTarget();
}
function triggerEnemyPoison(){
  const b=G.battle;
  b.enemies.filter(e=>e.curhp>0&&!e.downed&&(e.poison||0)>0).forEach(e=>{
    let damage=Math.round(e.poison*traumaStatusMultiplier(e));if(INQUISITOR_LEADERS.includes(e.type))damage=Math.max(1,Math.round(damage*.7));e.curhp-=damage;SFX.poison();
    log(`☠ ${e.name}中毒發作：−${damage} HP`,'good');floatNum(e.idx,`-${damage}`,'#8ee063');
    if(e.curhp<=0)defeatEnemyByPoison(e);
  });
  renderEnemies();
  return b.enemies.every(e=>e.curhp<=0);
}

function endPlayerTurn(){
  const b=G.battle;advanceFaithNecklace();b.busy=true;syncButtons();renderEnemies();
  if(b.enemies.every(e=>e.curhp<=0)){winBattle();return;}
  setTimeout(()=>{
    b.weakness=playerWeaknessFloor();b.hesitation=0;
    if((b.hallucination||0)>0)b.hallucination--;
    if((b.mentalDisorder||0)>0)b.mentalDisorder--;
    if(b.buffSuppressed>0){b.buffSuppressed--;if(b.buffSuppressed===0)log('🌊 威壓消退：你可以再次獲得蓄勢。','good');}
    if(b.burn>0){
      const burn=tickBurnStatus(b);losePlayerHp(burn.damage);
      SFX.hurt();log(`🔥 燒傷發作：−${burn.damage} HP${burn.decays?`，自然降為 ${burn.remaining} 層`:`；層數維持 ${burn.remaining}（再發作 ${burn.nextIn} 次自然 −1）`}。`,'dmg');
    }
    if(G.poison>0){
      const pd=Math.round(G.poison*traumaStatusMultiplier(b));losePlayerHp(pd);SFX.poison();
      log(`☠ 中毒發作：−${pd} HP`,'dmg');
    }
    if(G.hp<=0){renderTop();if(!tryHolyMiracleRevive()){gameOver();return;}}
    if(triggerEnemyPoison()){winBattle();return;}
    let total=0,armorBonus=0,willSteal=false,cyclopsSmashEnemy=null,bloodExamEnemy=null,kunImpactEnemy=null,pengStatusEnemy=null,pengBleed=0,pengBurn=0;
    const zombieBiteEnemies=[],robotFireEnemies=[];
    const batEvents=[],courtHitEvents=[],werewolfHitEvents=[],mimicHitEvents=[],samuraiHitEvents=[],inquisitorHitEvents=[];
    b.enemies.filter(e=>e.curhp>0).forEach(e=>{
      if(e.type==='zombie'&&e.downed){
        if(b.round>e.downedRound){
          reviveZombie(e);
          log(`🧟 ${e.name}以 ${e.curhp} HP 復活！攻擊節奏重置，下一回合從抓擊開始。`,'dmg');
        }else log(`💀 ${e.name}倒地，本回合不會行動；下一回合是補刀機會。`,'good');
        return;
      }
      if(e.type==='samurai'){
        if(e.samuraiAction==='mikiri'){
          if(!e.mikiriOutcome&&b.lastPlayerAction==='defense'){
            const before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*.08)));e.zanshin=true;
            log(`🧘 ${e.name}以殘心回復 ${e.curhp-before} HP，並強化下一次燕返。`,'dmg');
          }else if(e.mikiriOutcome==='broken')log(`🎯 ${e.name}的見切已被洞破，本回合無法反擊。`,'good');
          else if(e.returnBlade)log(`⚔️ ${e.name}完成見切，下一次燕返前將追加返刃。`,'dmg');
          else log(`👁️ ${e.name}維持見切，本回合沒有攻擊。`,'dmg');
          e.samuraiStep=(e.samuraiStep||0)+1;return;
        }
        const parts=(e.samuraiParts||[]).map(part=>({...part}));
        const damage=parts.reduce((sum,part)=>sum+part.damage,0),wear=e.nextArmorBreak||0;
        total+=damage;armorBonus+=wear;samuraiHitEvents.push({enemy:e,parts});
        if(e.samuraiAction==='iaido')log(`⚔️ ${e.name}拔刀居合，造成 ${damage} 傷害並以 40% 破防磨損 ${wear} 防禦！`,'dmg');
        else if(e.samuraiAction==='kesa')log(`🗡️ ${e.name}施展袈裟斬，造成 ${damage} 傷害！`,'dmg');
        else log(`🪽 ${e.name}施展${e.returnBlade?'返刃＋':''}${e.zanshin?'殘心・':''}燕返，分段造成 ${parts.map(part=>part.damage).join('＋')} 傷害，並磨損 ${wear} 防禦！`,'dmg');
        if(e.samuraiAction==='tsubame'){e.returnBlade=false;e.zanshin=false;}
        e.samuraiStep=(e.samuraiStep||0)+1;return;
      }
      if(e.type==='paladin'&&e.inquisitorSync){
        if(e.inquisitorSync==='warcry'){log(`📯 ${e.name}發動戰吼：下回合敵方全體傷害 +25%。`,'dmg');return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]),rate=e.inquisitorSync==='holyCharge'?0.4:0.3;total+=d;armorBonus+=Math.round(d*rate);inquisitorHitEvents.push({enemy:e,action:e.inquisitorSync,damage:d});
        log(e.inquisitorSync==='holyCharge'?`🐎 ${e.name}同步聖騎衝擊，造成 ${d} 高額傷害！`:`⚖️ ${e.name}同步裁決斬擊，造成 ${d} 傷害！`,'dmg');return;
      }
      if(INQUISITOR_LEADERS.includes(e.type)){
        const action=e.inquisitorAction;
        if(action==='transition'){e.transitionPause=Math.max(0,(e.transitionPause||0)-1);log('⚖️ 異端審判長完成下馬轉換，本回合暫停行動；下回合將立即審判。','dmg');return;}
        if(action==='proclamation'){
          addInquisitorCrime(1,'宣讀罪狀');const gained=addWeakness(e,2);e.shield=(e.shield||0)+Math.max(1,Math.round(e.maxhp*.12));log(`📜 宣讀罪狀：罪證增加、施加 ${gained} 層虛弱，並獲得 ${Math.round(e.maxhp*.12)} 護盾。`,'dmg');
        }else if(action==='chargePrep'){
          const units=inquisitorUnits();units.forEach(unit=>{const removed=halveEnemyNegativeStatuses(unit);unit.shield=(unit.shield||0)+Math.max(1,Math.round(unit.maxhp*.30));if(removed.length)log(`✨ ${unit.name}驅散：${removed.join('、')}。`,'dmg');});e.momentum=Math.min(25,(e.momentum||0)+3);b.warcryStacks=b.enemies.filter(x=>x.inquisitorEscort&&x.curhp>0).length;log(`🐎 舉槍裁決：全體驅散 50% 負面狀態並獲得 30% 戰馬護甲；馬勢 +3（${e.momentum}/25）。`,'dmg');
        }else if(action==='confiscate'){
          const base=floorReward(G.floor,false),stolen=Math.min(G.gold,Math.max(Math.round(base*.25),Math.min(Math.round(base),Math.round(G.gold*.10)))),before=e.shield||0;G.gold-=stolen;e.shield=before+Math.round(stolen*.25);log(`💰 沒收異端財物：奪取 ${stolen} 金幣，轉化為 ${e.shield-before} 護盾。`,'dmg');
        }else{
          const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]),rate=e.type==='inquisitorMounted'?(action==='lance'?0.35:action==='trample'?0.2:action==='charge'?0.6:0):(action==='sentenceSword'?0.3:action==='judgment'?0.5:0);total+=d;armorBonus+=Math.round(d*rate);inquisitorHitEvents.push({enemy:e,action,damage:d});
          const names={lance:'騎槍突刺',trample:'戰馬踐踏',charge:'裁決衝鋒',sentenceSword:'斷罪劍',pyre:'火刑宣告',interrogate:'信仰拷問',judgment:'審判'};log(`⚖️ ${e.name}發動${names[action]}，造成 ${d} 傷害！`,'dmg');
          if(action==='judgment')e.judgmentPending=false;
        }
        if(e.type==='inquisitorMounted'){
          e.inquisitorStep=(e.inquisitorStep||0)+1;const recovery=e.momentum<10?2:1,defenseBonus=b.lastPlayerAction==='defense'?1:0;e.momentum=Math.min(25,(e.momentum||0)+recovery+defenseBonus);if(action==='charge')b.warcryStacks=0;
        }else if(action!=='transition')e.inquisitorStep=(e.inquisitorStep||0)+(action==='judgment'&&e.inquisitorStep===0&&e.judgmentPending===false?0:1);
        return;
      }
      if(['cultLeader',...COURT_GARGOYLES].includes(e.type)){
        const action=e.courtAction;
        if(action==='skillSeal'){
          const locked=lockCourtSkill(e.idx);if(locked.length){addFanaticism(2,'石像封印成功');log(`🔒 ${e.name}封鎖 ${locked.length} 項技能：${locked.map(x=>`「${x.name}」`).join('、')}。`,'dmg');}else log(`🔒 ${e.name}未找到可封鎖的技能。`,'good');e.courtStep++;return;
        }
        if(action==='brandGaze'){const gained=Math.ceil(statusGainMultiplier());b.disciplineBrand=Math.min(3,(b.disciplineBrand||0)+gained);log(`📿 烙印凝視：戒律烙印 +${gained}（${b.disciplineBrand}/3）。`,'dmg');if(b.disciplineBrand>=3)triggerDisciplinePunishment();e.courtStep++;return;}
        if(action==='obsidianAbsolution'){
          e.shield=(e.shield||0)+Math.max(1,Math.round(e.maxhp*.10));courtGargoylesAlive().forEach(g=>{g.shield=(g.shield||0)+Math.max(1,Math.round(g.maxhp*.15));g.nextDamageBoost=1.3;});b.upgradeReprieve=1;
          log('🛡 黑曜赦令：教宗獲得 10%、石像獲得 15% 永久護盾；強化歸還一個完整行動，石像下次傷害 ×1.3。','dmg');e.courtStep++;return;
        }
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;courtHitEvents.push({enemy:e,action,damage:d});
        log(`🕯 ${e.name}施放 ${({disciplineClaw:'戒律石爪',punishmentClaw:'刑罰石爪',poisonPunishment:'毒刑',toxicWhip:'毒鞭',blackScripture:'黑經誦讀',blindSermon:'盲目佈道',sepsisRite:'敗血儀式',bloodDrain:'汲血',profaneCommunion:'褻瀆共融'})[action]}，造成 ${d} 傷害！`,'dmg');
        if(e.consumeDamageBoost){e.nextDamageBoost=1;e.consumeDamageBoost=false;}e.courtStep++;return;
      }
      if(e.type==='cthulhu'){
        const action=e.cthulhuAction;
        if(action==='abyssRegeneration'){const before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*.06)));e.shield=(e.shield||0)+Math.max(1,Math.round(e.maxhp*.12));log(`🕳️ 深淵再生：回復 ${e.curhp-before} HP，獲得 ${Math.round(e.maxhp*.12)} 永久護盾。`,'dmg');e.cthulhuStep++;return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;courtHitEvents.push({enemy:e,action,damage:d});log(`🐙 克蘇魯施放 ${({tentacleRend:'萬觸撕裂',namelessGaze:'不可名狀的凝視',abyssResonance:'深淵震鳴',starWhisper:'群星囈語',deepPressure:'深海威壓'})[action]}，造成 ${d} 傷害！`,'dmg');e.cthulhuStep++;return;
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
      if(e.type==='werewolf'&&e.werewolfAction==='lick'){
        const rate=werewolfHealRate(),before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*rate)));e.werewolfStep++;
        log(`👅 ${e.name}舔舐傷口：依你目前 ${b.bleed} 層流血回復 ${e.curhp-before} HP（${Math.round(rate*100)}% 最大生命）。`,'dmg');return;
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
        const locked=lockRandomSkill(e.idx);
        log(`🗿 ${e.name}施放石像守護：永久護盾 +${gg.bossShield}（目前 ${e.shield}），存活邪教徒獲得 ${gg.cultShield} 護盾${locked.length?`，並封鎖 ${locked.length} 項技能`:''}。`,'dmg');
        updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();renderTop();
        reviveCultistsFromGargoyleShield(e);e.gargStep++;return;
      }
      if(witchPoisonTurn(e)){const raw=enemyStatusRaw(e,2),gained=addPlayerPoison(raw);SFX.poison();log(`${e.name} 第5回合施放劇毒，附加 ${gained} 層中毒${gained<raw?'（異常抗性減輕）':''}！`,'dmg');return;}
      if(e.type==='kun'){
        if(e.kunDevourPending){const remaining=Math.max(0,e.shield||0),wanted=remaining*2,before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+wanted);e.shield=0;e.kunDevourPending=false;log(remaining>0?`🐋 吞海回復 ${e.curhp-before} HP，並消耗剩餘 ${remaining} 護盾。`:'💥 吞海護盾已被打破，無法回血。',remaining>0?'dmg':'good');}
        if(e.kunAction==='pressure'){const lost=b.focus||0,gained=addWeakness(e,5);b.focus=0;b.buffSuppressed=2;log(`🌊 鯤施放威壓：${lost>0?`清除 ${lost} 蓄勢，並`:''}2 回合內無法獲得蓄勢，同時施加 ${gained} 層虛弱！`,'dmg');}
        else if(e.kunAction==='devour'){const shield=kunShieldAmount(e);e.shield=(e.shield||0)+shield;e.kunDevourPending=true;log(`🐋 鯤施放吞海，獲得 ${shield} 護盾（目前 ${e.shield}）；下回合將以剩餘護盾 ×2 回血。`,'dmg');}
        else if(e.kunAction==='divinity'){const heal=Math.max(1,Math.round(e.maxhp*kunGrowth().divineHealRate)),before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+heal);const removed=ultimateDispel(e);e.kunForcedAction='oversea';log(`✨ 神性發動：鯤回復 ${e.curhp-before} HP${removed.length?`，驅散 ${removed.join('、')}`:''}；下回合將發動覆海！`,'dmg');}
        else{const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;if(e.kunAction==='impact')kunImpactEnemy=e;log(e.kunAction==='oversea'?`🌊 鯤發動覆海，造成 ${d} 傷害！`:`🐋 鯤發動深海撞擊，造成 ${d} 傷害（被動卡牌 ${G.passives.length} 張）！`,'dmg');}
        if(b.round%kunGrowth().tideEvery===0)advanceNorthTide(e);return;
      }
      if(e.type==='peng'){
        if(e.pengAction==='transition'){e.transitionPause=Math.max(0,(e.transitionPause||0)-1);log('☯ 鵬在化形後停頓，本回合沒有行動。','good');return;}
        if(e.pengAction==='rebirth'){const heal=Math.max(1,Math.round(e.maxhp*0.05)),before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+heal);const removed=ultimateDispel(e),burn=addBurn(b,enemyStatusRaw(e,3));e.pengForcedAction='inferno';log(`🔥 浴火振翅：鵬回復 ${e.curhp-before} HP${removed.length?`，驅散 ${removed.join('、')}`:''}；下回合將發動焚天！`,'dmg');if(burn.gained)log(`🔥 浴火餘焰：燒傷 +${burn.gained}（目前 ${b.burn}/5）。`,'dmg');if(burn.traumaGained)log(`🩹 溢出燒傷轉為創傷 +${burn.traumaGained}。`,'dmg');return;}
        if(e.pengAction==='eclipse'){const before=e.evasion;e.evasion=Math.min(e.maxEvasion,e.evasion+2);const blind=addBlind(b,enemyStatusRaw(e,3));log(`🌑 遮天蔽日：鵬恢復 ${e.evasion-before} 層閃避（${e.evasion}/${e.maxEvasion}），施加 ${blind} 層致盲（目前 ${b.blind}/3）。`,'dmg');return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;const wear=armorBreakBonus(e,d,b.defense>0);armorBonus+=wear;
        if(e.pengAction==='windblade'){pengStatusEnemy=e;pengBleed=2;log(`🌪 鵬揮出風刃，造成 ${d} 傷害！`,'dmg');}
        else if(e.pengAction==='flamefeather'){pengStatusEnemy=e;pengBurn=2;log(`🔥 鵬灑落炎羽，造成 ${d} 傷害！`,'dmg');}
        else if(e.pengAction==='riftclaw')log(`🦅 鵬施展裂空爪，造成 ${d} 傷害並以 45% 破防磨損 ${wear} 防禦！`,'dmg');
        else{pengStatusEnemy=e;pengBleed=3;pengBurn=3;log(`☀️ 鵬發動焚天，造成 ${d} 傷害並以 60% 破防磨損 ${wear} 防禦！`,'dmg');}
        return;
      }
      if(e.type==='dragon'){
        if(e.dragonAction==='sleep'){
          log(e.wakeNext?'💤 魔龍被驚醒，這回合仍未行動；下回合進入戰鬥！':'💤 魔龍仍在沉睡…','good');
          if(e.wakeNext){e.sleepTurns=0;e.wakeNext=false;if(e.wakeShockPending){e.wakeShockPending=false;applyDragonIntimidation('驚醒咆哮',e);}}else e.sleepTurns=Math.max(0,(e.sleepTurns||0)-1);
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
        const poisonGained=addPlayerPoison(enemyStatusRaw(e,2)),weaknessGained=addWeakness(e,4);SFX.poison();
        log(`${e.name} 蓄力後猛撲！造成 ${d} 傷害，並附加 ${poisonGained} 層中毒與 ${weaknessGained} 層虛弱！`,'dmg');
        return;
      }
      const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);total+=d;
      if(e.bloodExam)bloodExamEnemy=e;
      const wear=armorBreakBonus(e,d,b.defense>0);armorBonus+=wear;
      if(e.type==='ninja'&&e.ninjaAction==='pierce')log(wear>0?`🥷 ${e.name}施展穿刺：造成 ${d} 基礎傷害，並以 30% 破防額外磨損 ${wear} 防禦。`:`🥷 ${e.name}施展穿刺；目前沒有可供破防磨損的防禦，因此只造成 ${d} 傷害。`,'dmg');
      else if(e.type==='eagle'&&e.divePending)log(`🦅 ${e.name}俯衝反擊，造成 ${d} 傷害！`,'dmg');
      else if(e.type==='eagle')log(`🦅 ${e.name}利爪攻擊，造成 ${d} 傷害${e.weakened?'（折翼 −25%）':''}`,'dmg');
      else if(e.type==='robot'&&e.robotAction==='fire'){
        if(total>b.defense)robotFireEnemies.push(e);
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
        if(e.cyclopsAction==='smash')cyclopsSmashEnemy=e;
        log(e.cyclopsAction==='smash'?`🔨 ${e.name}發動粉碎重擊，造成 ${d} 傷害！`:`🪵 ${e.name}揮舞巨棒，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='paladin'){
        if(e.paladinAction==='judgment')log(`⚔️ ${e.name}發動神聖裁決，造成 ${d} 傷害！`,'dmg');
        else if(e.paladinAction==='sunder')log(wear>0?`💥 ${e.name}施展破甲斬擊：造成 ${d} 基礎傷害，並以 30% 破防額外磨損 ${wear} 防禦。`:`💥 ${e.name}施展破甲斬擊；目前沒有剩餘防禦可供額外磨損，只造成 ${d} 傷害。`,'dmg');
        else log(`🗡️ ${e.name}以聖劍斬擊，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='werewolf'){
        werewolfHitEvents.push({enemy:e,action:e.werewolfAction,damage:d});
        log(e.werewolfAction==='bite'?`🦷 ${e.name}嗅血撕咬，造成 ${d} 傷害（倍率 ×${werewolfBiteMultiplier().toFixed(2)}）！`:`🐾 ${e.name}以狼爪撕裂，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='mimic'){
        mimicHitEvents.push({enemy:e,action:e.mimicAction,damage:d});
        const actionName={venomBite:'毒牙啃咬',rendingTongue:'撕裂長舌',boneCrush:'碎骨夾擊'}[e.mimicAction];
        log(`🧰 ${e.name}發動${actionName}，造成 ${d} 傷害！`,'dmg');
      }
      else if(e.type==='zombie'&&e.zombieAction==='bite'){
        if(total>b.defense)zombieBiteEnemies.push(e);
        log(`🧟 ${e.name}腐敗撕咬，造成 ${d} 傷害！`,'dmg');
      }
      else log(`${e.name} 攻擊，造成 ${d} 傷害`,'dmg');
      if(e.type==='zombie')e.zombieStep=(e.zombieStep||0)+1;
      if(e.type==='eagle'){e.divePending=false;e.weakened=false;}
      if(e.type==='robot')e.robotStep=(e.robotStep||0)+1;
      if(e.type==='cultist'){
        if(e.cultistAction==='sacrifice'&&e.hasStolen)cultistRestoreUpgrade(e,'歸還');
        e.cultStep=(e.cultStep||0)+1;
      }
      if(e.type==='gargoyle')e.gargStep=(e.gargStep||0)+1;
      if(e.type==='skeleton'){e.skeletonStep=(e.skeletonStep||0)+1;e.boneRage=false;}
      if(e.type==='bat')e.batStep=(e.batStep||0)+1;
      if(e.type==='cyclops')e.cyclopsStep=(e.cyclopsStep||0)+1;
      if(e.type==='paladin')e.paladinStep=(e.paladinStep||0)+1;
      if(e.type==='werewolf')e.werewolfStep=(e.werewolfStep||0)+1;
      if(e.type==='mimic')e.mimicStep=(e.mimicStep||0)+1;
      if(bearTurn(e)){const gained=addWeakness(e,3);log(`📉 ${e.name}的重壓施加 ${gained} 層虛弱（目前 ${currentWeaknessStacks()}/9）。`,'dmg');}
      if(platypusTurn(e)){const allowance=applyHesitation(e,3);log(`🦫 ${e.name}施加遲疑：下次行動可額外抽 ${allowance} 張。`,'dmg');}
      if(e.type==='squirrel'&&b.round===1)willSteal=true;
    });
    b.enemies.filter(e=>e.curhp>0&&e.broken>0).forEach(e=>e.broken--);
    if(willSteal)squirrelSteal();
    const defenseBefore=b.defense,resolved=resolveDefenseDamage(total,b.defense,armorBonus);
    const {blocked,armorWear}=resolved;let net=resolved.net;
    if(b.defense>0)log(`🛡 防禦抵擋 ${blocked} 傷害`+(net>0?`，仍受 ${net}`:'，完全擋下'),'good');
    if(armorWear>0)log(`💥 破防額外磨損 ${armorWear} 防禦；溢出的破防不會傷害 HP。`,'dmg');
    b.defense=resolved.defenseLeft;
    if(net>0&&b.trauma>0){const before=net;net=Math.round(net*traumaAttackMultiplier(b));log(`🩹 創傷使攻擊傷害 ${before} → ${net}。`,'dmg');}
    const bleedHit=triggerBleed(b,net);losePlayerHp(net);losePlayerHp(bleedHit.damage);
    if(net>0)SFX.hurt();
    if(bleedHit.damage>0)log(`🩸 流血發作：額外 −${bleedHit.damage} HP，降為 ${bleedHit.remaining} 層。`,'dmg');
    if(bloodExamEnemy&&net>0){const result=addBleed(b,enemyStatusRaw(bloodExamEnemy,1));if(result.traumaGained)log(`🩹 流血已滿：新增的 ${result.traumaGained} 層流血轉為創傷（目前 ${b.trauma} 層）。`,'dmg');else if(result.gained>0)log(`🩸 血魔考官的攻擊命中 HP：流血 +${result.gained}（目前 ${b.bleed}/8 層）。`,'dmg');}
    if(cyclopsSmashEnemy&&net>0){const gained=addFracture(b,enemyStatusRaw(cyclopsSmashEnemy,1));if(gained>0)log(`🦴 粉碎重擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3 層，新防禦 −${b.fracture*15}%）。`,'dmg');}
    if(kunImpactEnemy&&net>0){const gained=addFracture(b,enemyStatusRaw(kunImpactEnemy,1));if(gained>0)log(`🦴 深海撞擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3）。`,'dmg');}
    if(net>0)mimicHitEvents.forEach(event=>{
      if(event.action==='venomBite'){
        const gained=addPlayerPoison(enemyStatusRaw(event.enemy,2));if(gained>0){SFX.poison();log(`☠️ 毒牙傷及 HP：中毒 +${gained}（目前 ${G.poison}）。`,'dmg');}
      }else if(event.action==='rendingTongue'){
        const result=addBleed(b,enemyStatusRaw(event.enemy,2));if(result.gained)log(`🩸 長舌傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/8）。`,'dmg');if(result.traumaGained)log(`🩹 溢出流血轉為創傷 +${result.traumaGained}。`,'dmg');
      }else{
        const gained=addFracture(b,enemyStatusRaw(event.enemy,1));if(gained)log(`🦴 夾擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3）。`,'dmg');
      }
    });
    if(net>0&&pengBleed>0){const result=addBleed(b,enemyStatusRaw(pengStatusEnemy,pengBleed));if(result.gained)log(`🩸 鵬的攻擊附加流血 +${result.gained}（目前 ${b.bleed}/8）。`,'dmg');if(result.traumaGained)log(`🩹 溢出流血轉為創傷 +${result.traumaGained}（目前 ${b.trauma}）。`,'dmg');}
    if(net>0&&pengBurn>0){const result=addBurn(b,enemyStatusRaw(pengStatusEnemy,pengBurn));if(result.gained)log(`🔥 鵬的攻擊附加燒傷 +${result.gained}（目前 ${b.burn}/5）。`,'dmg');if(result.traumaGained)log(`🩹 溢出燒傷轉為創傷 +${result.traumaGained}（目前 ${b.trauma}）。`,'dmg');}
    let werewolfDefense=defenseBefore;
    werewolfHitEvents.forEach(event=>{
      const blocked=Math.min(event.damage,werewolfDefense),hpDamage=Math.max(0,event.damage-blocked);werewolfDefense-=blocked;
      if(event.action!=='claw'||hpDamage<=0)return;
      const result=addBleed(b,enemyStatusRaw(event.enemy,2));
      if(result.gained)log(`🩸 狼爪傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/8）。`,'dmg');
      if(result.traumaGained)log(`🩹 流血已滿：溢出的 ${result.traumaGained} 層轉為創傷（目前 ${b.trauma}）。`,'dmg');
    });
    let samuraiDefense=defenseBefore;
    samuraiHitEvents.forEach(event=>event.parts.forEach(part=>{
      const blockedForPart=Math.min(part.damage,samuraiDefense),hpDamage=Math.max(0,part.damage-blockedForPart);samuraiDefense-=blockedForPart;
      if(hpDamage<=0||part.bleed<=0)return;
      const result=addBleed(b,enemyStatusRaw(event.enemy,part.bleed));
      if(result.gained)log(`🩸 ${part.kind==='iaido'?'居合':part.kind==='kesa'?'袈裟斬':part.kind==='return'?'返刃':'燕返'}傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/8）。`,'dmg');
      if(result.traumaGained)log(`🩹 流血已滿：溢出的 ${result.traumaGained} 層轉為創傷（目前 ${b.trauma}）。`,'dmg');
    }));
    let inquisitorDefense=defenseBefore;
    inquisitorHitEvents.forEach(event=>{
      const blockedForEvent=Math.min(event.damage,inquisitorDefense),hpDamage=Math.max(0,event.damage-blockedForEvent);inquisitorDefense-=blockedForEvent;if(hpDamage<=0)return;
      if(['lance','sentenceSword'].includes(event.action)){const result=addBleed(b,enemyStatusRaw(event.enemy,2));if(result.gained)log(`🩸 ${event.action==='lance'?'騎槍突刺':'斷罪劍'}傷及 HP：流血 +${result.gained}。`,'dmg');if(result.traumaGained)log(`🩹 溢出流血轉為創傷 +${result.traumaGained}。`,'dmg');}
      if(event.action==='trample'||event.action==='charge'||event.action==='judgment'){const gained=addFracture(b,enemyStatusRaw(event.enemy,1));if(gained)log(`🦴 ${event.action==='judgment'?'審判':event.action==='charge'?'裁決衝鋒':'戰馬踐踏'}傷及 HP：斷骨 +${gained}。`,'dmg');}
      if(event.action==='charge'){const result=addBleed(b,enemyStatusRaw(event.enemy,2));if(result.gained)log(`🩸 裁決衝鋒傷及 HP：流血 +${result.gained}。`,'dmg');}
      if(event.action==='pyre'){const burn=addBurn(b,enemyStatusRaw(event.enemy,3)),corruption=addLimitedStatus(b,'corruption',enemyStatusRaw(event.enemy,1),3);if(burn.gained||burn.traumaGained||corruption)log(`🔥 火刑命中：燒傷 +${burn.gained}、創傷 +${burn.traumaGained}、腐敗 +${corruption}。`,'dmg');}
      if(event.action==='interrogate'){const lost=Math.min(2,b.controlLeft||0);b.controlLeft-=lost;if(lost)log(`⛓️ 信仰拷問奪走 ${lost} 控制值。`,'dmg');else{const gained=addWeakness(event.enemy,2);log(`⛓️ 控制值已空：信仰拷問改施加 ${gained} 層虛弱。`,'dmg');}}
    });
    let courtDefense=defenseBefore;
    courtHitEvents.forEach(event=>{
      const {enemy,action}=event,blockedForEvent=Math.min(event.damage,courtDefense),hpDamage=Math.max(0,event.damage-blockedForEvent),hpHit=hpDamage>0;courtDefense-=blockedForEvent;let applied=0;
      if(hpHit&&action==='poisonPunishment')applied=addPlayerPoison(enemyStatusRaw(enemy,2));
      if(hpHit&&action==='toxicWhip')applied=addPlayerPoison(enemyStatusRaw(enemy,3));
      if(hpHit&&action==='blackScripture')applied=addLimitedStatus(b,'corruption',enemyStatusRaw(enemy,(b.fanaticism||0)>=20?2:1),3);
      if(action==='blindSermon')applied=addBlind(b,enemyStatusRaw(enemy,(b.fanaticism||0)>=20?2:1));
      if(hpHit&&action==='sepsisRite')applied=addSepsis(b,enemyStatusRaw(enemy,(b.fanaticism||0)>=20?2:1));
      if(action==='bloodDrain'&&hpHit){const wanted=Math.round(hpDamage*.5*sepsisMultiplier(b)),before=enemy.curhp;enemy.curhp=Math.min(enemy.maxhp,enemy.curhp+wanted);log(`🩸 汲血回復 ${enemy.curhp-before} HP。`,'dmg');}
      if(action==='profaneCommunion'){const rate=Math.min(.12,.03+playerNegativeTypeCount()*.015),before=enemy.curhp;enemy.curhp=Math.min(enemy.maxhp,enemy.curhp+Math.max(1,Math.round(enemy.maxhp*rate)));log(`🕯 褻瀆共融依 ${playerNegativeTypeCount()} 種負面狀態回復 ${enemy.curhp-before} HP。`,'dmg');}
      if(hpHit&&action==='tentacleRend'){const bleed=addBleed(b,enemyStatusRaw(enemy,5));const fracture=addFracture(b,enemyStatusRaw(enemy,1));applied=bleed.gained+bleed.traumaGained+fracture;}
      if(action==='namelessGaze'){applied+=addTimedStatus(enemy,'hallucination',1);applied+=addTimedStatus(enemy,'mentalDisorder',1);}
      if(action==='abyssResonance')b.abyssDistance=Math.max(0,b.abyssDistance-1);
      if(action==='starWhisper'){applied+=addBlind(b,enemyStatusRaw(enemy,1));applyHesitation(enemy,3);applied++;}
      if(action==='deepPressure'){applied+=addWeakness(enemy,4);if(hpHit)applied+=addLimitedStatus(b,'corruption',enemyStatusRaw(enemy,1),3);}
      if(applied>0&&enemy.type==='cultLeader')addFanaticism(1,'成功施加負面狀態');
      if(applied>0)log(`⚠️ ${enemy.name}成功施加 ${applied} 層／項負面效果。`,'dmg');
    });
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
    if(zombieBiteEnemies.length){
      const gained=addLimitedStatus(b,'corruption',zombieBiteEnemies.reduce((sum,e)=>sum+enemyStatusRaw(e,1),0),3);
      if(gained>0)log(`🧟 腐敗撕咬傷及 HP：腐敗 +${gained}（目前 ${b.corruption} 層，戰鬥回血 −${b.corruption*20}%）`,'dmg');
    }
    if(robotFireEnemies.length){const add=robotFireEnemies.reduce((sum,e)=>sum+enemyStatusRaw(e,robotGrowth(G.floor).burn),0),result=addBurn(b,add);if(result.gained>0)log(`🔥 火焰傷及 HP：燒傷 +${result.gained}（目前 ${b.burn}/5 層）`,'dmg');if(result.traumaGained)log(`🩹 燒傷已滿：溢出的 ${result.traumaGained} 層燒傷轉為創傷（目前 ${b.trauma} 層）。`,'dmg');}
    const demon=b.enemies.find(e=>e.type==='demon'&&e.curhp>0);
    if(demon&&demon.demonAction==='drain'){
      const baseRate=demonGrowth(G.floor).drainRate,permanent=demon.permanentThirst===true,thirstStacks=demonThirstStacks(demon),thirst=thirstStacks>0;
      if(thirst&&!permanent){
        demon.bloodFrenzyUses=(demon.bloodFrenzyUses||0)+1;
        const gained=addSepsis(b,enemyStatusRaw(demon,1));
        if(gained>0)log(`🦠 血魔進入渴血：敗血 +${gained}（目前 ${b.sepsis}/5 層）`,'dmg');
      }
      const sepsisBefore=b.sepsis,rate=baseRate*(1+thirstStacks*.1)*sepsisMultiplier(b),guaranteed=Math.round((demon.nextDmg||0)*.25);
      const wanted=Math.max(guaranteed,Math.round(net*rate)),before=demon.curhp;
      demon.curhp=Math.min(demon.maxhp,demon.curhp+wanted);
      const healed=demon.curhp-before;
      log(healed>0?`😈 惡魔吸血效率 ${Math.round(rate*100)}%${thirst?`（渴血 ${thirstStacks} 層，×${(1+thirstStacks*.1).toFixed(1)}）`:''}${!permanent&&thirst?`（低血量觸發 ${demon.bloodFrenzyUses}/${BALANCE.demonFrenzyUses}）`:''}${sepsisBefore>0?`（敗血 +${sepsisBefore*15}%）`:''}，回復 ${healed} HP${net===0?'（完全防禦保底）':''}`:'😈 惡魔吸取鮮血，但生命已滿。','dmg');
    }
    if(bloodDescendantActive()){
      const selfDamage=Math.max(1,Math.ceil(G.maxhp*0.02));losePlayerHp(selfDamage);SFX.hurt();log(`📜 血魔契約反噬：回合結束自損 ${selfDamage} HP。`,'dmg');
    }
    if(G.hp<=0){renderTop();if(!tryHolyMiracleRevive()){gameOver();return;}}
    if(b.cthulhuPhase){b.abyssDistance=Math.max(0,(b.abyssDistance||0)-1);log(`🕳️ 深淵托拽：距離自然 −1（${b.abyssDistance}/${b.abyssMax}）。`,b.abyssDistance<=3?'dmg':'');if(b.abyssDistance<=0){G.hp=0;log('🕳️ 深淵距離歸零，生命被拖入深淵！','dmg');renderTop();if(!tryHolyMiracleRevive(true)){gameOver();return;}log('✨ 復活後從深淵距離 5 重新掙扎。','gd');}}
    b.enemies.filter(e=>e.curhp>0).forEach(e=>{if(decayTrauma(e))log(`🩹 ${e.name}的創傷自然減少 1 層（剩餘 ${e.trauma}）。`,'good');});
    if(decayTrauma(b))log(`🩹 創傷自然減少 1 層（剩餘 ${b.trauma}）。`,'good');
    document.querySelector('.arena').animate(
      [{filter:'brightness(1)'},{filter:'brightness(.5) sepia(.5)'},{filter:'brightness(1)'}],{duration:300});
    if(G.hp<=0&&!tryHolyMiracleRevive()){gameOver();return;}
    if(!hasP('bulwark'))b.defense=0;
    b.round++;log(`— 第 ${b.round} 回合 —`);
    const sq=b.enemies.find(e=>e.type==='squirrel'&&e.curhp>0);
    if(sq&&b.round>squirrelEscapeTurns(G.floor)){b.over=true;syncButtons();log('🐿️ 松鼠帶著贓物逃跑了！',"dmg");delete G._squirrelNestFoundGold;setTimeout(()=>b.eventSource==='squirrelNest'?advanceNode():proceedAfterWin(false),1000);return;}
    rollIntents();renderEnemies();dealNewHand();
  },700);
}

function factionVictoryDelta(enemies){
  const cultists=enemies.filter(e=>e.type==='cultist').length,paladins=enemies.filter(e=>e.type==='paladin').length;
  if(!cultists&&!paladins)return 0;
  if(ownsP('bloodpact')&&!bloodDescendantActive()&&!G.churchSeen){
    if(cultists)log('🕯 尚未接觸教堂：擊敗邪教勢力只會微幅推動信仰。','dmg');
    if(paladins)log('⛪ 尚未接觸教堂：擊敗神教勢力只會微幅推動信仰。','dmg');
    return cultists*5-paladins*5;
  }
  const cultistValue=G.churchSeen?20:-5;
  if(cultists)log(`🕯 邪教勢力對你的敵意加深${!G.churchSeen?'（尚未接觸教堂，影響較小）':''}。`,'dmg');
  if(paladins)log('⛪ 聖堂勢力對你的敵意加深。','dmg');
  return cultists*cultistValue-paladins*20;
}
function winBattle(){
  const b=G.battle;b.over=true;syncButtons();SFX.win();
  changeFaction(factionVictoryDelta(b.enemies),()=>finishBattleVictory(b));
}
function finishBattleVictory(b){
  if(b.bountyHuntActive)G.bountyHunt=null;
  recoverSquirrelGold(b);
  if(b.eventSource==='treasureChest'){
    log('🧰 寶箱怪被擊敗，暫停的寶箱獎勵恢復發放！','gd');
    setTimeout(()=>grantTreasureChestReward(),1100);return;
  }
  if(b.eventSource==='squirrelNest'){
    const reward=squirrelNestVictoryGold();G.gold+=reward;delete G._squirrelNestFoundGold;SFX.coin();
    log(`🐿️ 松鼠窩守衛已被擊退！只取得 ${reward} 金幣，不進入賞金或其他獎勵。`,'gd');renderTop();
    setTimeout(()=>advanceNode(),1100);return;
  }
  const bossEnemy=b.enemies.find(e=>e.boss),boss=!!bossEnemy;
  if(boss){
    const chance=bossEnemy.type==='demon'?BALANCE.bloodPactDemonChance:BALANCE.bloodPactChance;
    G._bloodPactOffer=!ownsP('bloodpact')&&Math.random()<chance;
  }
  const reward=floorReward(G.floor,boss);
  log(`🏆 第 ${G.floor} 層清除！取得基礎賞金 ${reward} 的挑戰資格`,'gd');
  if(naturalHealingBlocked())log(`📜 ${bloodContractName()}：無法獲得戰後自然回血。`,'dmg');
  else{
    const result=healPlayer(BALANCE.clearHeal);log(`🔥 喘息片刻：回復 ${result.healed} HP`,'good');
  }
  if(hasP('rubyring')){const h=isUp('rubyring')?15:8,result=healPlayer(h);log(`💍 紅寶石戒指：清層回復 ${result.healed} HP`,'good');}
  if(boss&&!naturalHealingBlocked()){const result=healPlayer(30);log(`👑 擊敗魔王，回復 ${result.healed} HP！`,'good');}
  renderTop();
  const source=b.eventSource?`event:${b.eventSource}`:'battle';
  setTimeout(()=>startBounty(boss,reward,source),1100);
}
function proceedAfterWin(boss){
  if(boss){restoreControl();G.floor++;G.nodeType=null;G.nodeStarted=false;openUpgrade('boss');return;}
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
  const b=G.battle,cost=currentControlCost('redraw');if(b.over||b.busy||b.controlLeft<cost||skillIsLocked('redraw'))return;
  b.controlLeft-=cost;G.control=b.controlLeft;b.pendingBust=false;
  log(`🔄 重抽手牌（控制值 −${cost}，剩餘 ${b.controlLeft}/${b.controlCap}）`,'hit');renderTop();dealNewHand();
}
function peek(){
  const b=G.battle,cost=currentControlCost('peek');if(b.over||b.controlLeft<cost||skillIsLocked('peek'))return;
  b.controlLeft-=cost;G.control=b.controlLeft;
  const n=isUp('peek')?4:3;
  const top=b.deck.slice(-n).reverse().map(c=>{if(b.hallucination&&!c._peekIllusion&&Math.random()<.05)c._peekIllusion=randomCard();const shown=shownCard(c);return cardLabel(shown)+shown.s;}).join('  ');
  log(`👁️ 下${n}張：${top}（控制值 −${cost}，剩餘 ${b.controlLeft}/${b.controlCap}）`,'hit');syncButtons();renderTop();
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
  const cands=G.passives.filter(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return hasP(id)&&p&&p.descUp&&!G.upgrades.includes(id);});
  const canMaster=hasP('suitmage')&&isUp('suitmage')&&!G.suitMastery;
  const canDoublebetMaster=hasP('doublebet')&&isUp('doublebet')&&!G.upgrades.includes('doublebet2');
  const canTakeBloodPact=G._bloodPactOffer===true&&!ownsP('bloodpact');
  if(!cands.length&&!canMaster&&!canDoublebetMaster&&!canTakeBloodPact){finishUpgradeReward();return;}
  show('upgrade');
  const eventReward=G._upgradeReturn==='event';$('upgrade-title').textContent=eventReward?'⭐ 一般獎勵':'⭐ 魔王獎勵';$('upgrade-desc').textContent=eventReward?'選擇一項持有能力進行強化；這是事件戰鬥提供的額外獎勵。':'選擇一項強化或專精；特殊裝備可額外領取，不占用本次選擇。';
  let html='';
  if(canTakeBloodPact){
    html+=`<div class="shopitem blood-pact-item"><div class="info"><b>📜 鮮血契約（稀有額外裝備）</b><div class="desc">簽訂時最大生命減半；成為後裔前，未來最大生命增長只有 50%。獲得 5 層渴血，使吸血倍率 ×1.5；無法獲得戰後自然回血。成為後裔後，未來最大生命增長恢復 100%，過去損失不返還。</div><div class="desc" style="color:#f0a6b8">無法購買；領取後仍可選擇本次魔王強化。擊敗血魔時較容易出現。</div></div><button class="b-magic" data-bloodpact="1">簽訂契約</button></div>`;
  }
  cands.forEach(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);
    html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${passiveNameWithAffix(id)}</b>${passiveAffixId(id)?` ${affixBadge(passiveAffixId(id))}`:''}<div class="desc">目前：${p.desc}</div><div class="desc" style="color:var(--gold)">⭐ 強化後：${p.descUp}</div></div><button class="b-buy" data-up="${id}">強化</button></div>`;
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
  if(bloodPact)bloodPact.onclick=()=>{G._bloodPactOffer=false;SFX.win();grantBloodPact(openUpgrade);};
  renderTop();
}

//===== 商店 =====
function passiveRarity(id){return PASSIVE_RARITY[id]||'common';}
function rarityInfo(id){return RARITY_INFO[passiveRarity(id)]||RARITY_INFO.common;}
function shopItemWeight(p){return rarityInfo(p.id).weight*(G.character==='magician'&&SUIT_STARTERS.includes(p.id)?SUIT_SHOP_WEIGHT:1);}
function takeWeighted(pool){
  if(!pool.length)return null;
  const total=pool.reduce((sum,p)=>sum+shopItemWeight(p),0);let roll=Math.random()*total,index=0;
  for(;index<pool.length-1;index++){roll-=shopItemWeight(pool[index]);if(roll<0)break;}
  return pool.splice(index,1)[0];
}
function rollPassiveAffix(){
  if(Math.random()>=PASSIVE_AFFIX_CHANCE)return null;
  const total=PASSIVE_AFFIXES.reduce((sum,a)=>sum+a.weight,0);let roll=Math.random()*total;
  for(const affix of PASSIVE_AFFIXES){roll-=affix.weight;if(roll<0)return affix.id;}
  return PASSIVE_AFFIXES[PASSIVE_AFFIXES.length-1].id;
}
function rollShopPicks(){
  const available=ALL_PASSIVES.filter(p=>p.shop!==false&&!G.passives.includes(p.id)&&!passiveConflictsWithOwned(p.id));
  const low=available.filter(p=>['common','uncommon'].includes(passiveRarity(p.id)));
  const rare=available.filter(p=>passiveRarity(p.id)==='rare');
  const legendary=available.filter(p=>passiveRarity(p.id)==='legendary');
  const picks=[],chapter=chapterIndex(G.floor),highRoll=Math.random();
  let high=null;
  if(highRoll<0.05&&G.legendaryShopChapter!==chapter){
    high=takeWeighted(legendary);
    if(high)G.legendaryShopChapter=chapter;
  }else if(highRoll<0.30)high=takeWeighted(rare);
  if(high)picks.push(high.id);
  while(low.length&&picks.length<4){const item=takeWeighted(low);if(item)picks.push(item.id);}
  return shuffle(picks);
}
function rollRankBoosts(count){return shuffle([...CARD_RANKS]).slice(0,Math.max(0,count)).map(rank=>({rank:String(rank),type:Math.random()<0.5?'percent':'flat'}));}
function rollShopStock(){
  G._shopPicks=rollShopPicks();
  const inventoryFull=passiveInventoryFull(),chance=inventoryFull?BALANCE.rankBoostShopChanceFull:BALANCE.rankBoostShopChance;
  const rolls=inventoryFull?BALANCE.rankBoostShopRollsFull:1;
  for(let roll=0;roll<rolls;roll++){
    if(Math.random()>=chance)continue;
    const replaceable=G._shopPicks.map((id,index)=>({id,index})).filter(item=>['common','uncommon'].includes(passiveRarity(item.id)));
    if(replaceable.length){const chosen=replaceable[rnd(0,replaceable.length-1)];G._shopPicks.splice(chosen.index,1);}
  }
  G._shopRankBoosts=rollRankBoosts(4-G._shopPicks.length);
  G._shopAffixes=Object.fromEntries(G._shopPicks.map(id=>[id,rollPassiveAffix()]).filter(([,affix])=>affix));
}
function openShop(){
  show('shop');$('shop-stage').textContent=G.floor;$('shop-rate').textContent=`×${shopFloorMultiplier().toFixed(2)}`;
  G.shopRefreshCost=20;
  G._shopCards=[randomCard(),randomCard(),randomCard()];
  rollShopStock();
  if(!G.nodeStarted&&hasP('luckycoin')){const h=isUp('luckycoin')?10:5;healPlayer(h);}
  G.nodeStarted=true;
  renderShop();
}
function renderShop(){
  const picks=(G._shopPicks||[]).map(id=>ALL_PASSIVES.find(p=>p.id===id)).filter(Boolean);
  const disc=hasP('luckycoin')?`（幸運金幣 −${isUp('luckycoin')?15:10}%）`:'';
  const inventoryFull=passiveInventoryFull();
  const editRate=deckEditMultiplier().toFixed(2);
  let html=inventoryFull?'<div class="shopitem rank-boost-notice"><div class="info"><b>🔢 裝備欄已滿：牌面強化出現率提升</b><div class="desc">每次刷新會進行 2 次較高機率的牌面強化替換判定，讓已成形套裝仍能繼續成長。</div></div></div>':'';
  picks.forEach(p=>{
    const rarity=rarityInfo(p.id),badge=`<span class="rarity rarity-${passiveRarity(p.id)}">${rarity.name}</span>`,affixId=G.passives.includes(p.id)?passiveAffixId(p.id):G._shopAffixes&&G._shopAffixes[p.id],affix=passiveAffixInfo(p.id,affixId);
    if(G.passives.includes(p.id)){html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${passiveNameWithAffix(p.id)}</b> ${badge} ${affix?affixBadge(affix.id):''}<div class="desc">${affix?`${affix.desc}｜`:''}${p.desc}</div></div><div class="owned" style="padding:7px 12px">已擁有 ✓</div></div>`;return;}
    const c=price(p.cost),slots=passiveSlotCost(p.id,affixId),noRoom=passiveInventoryFull(slots);
    html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${affix?`${affix.icon} ${affix.name}・`:''}${p.name}</b> ${badge} ${affix?affixBadge(affix.id):''} — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${affix?`${affix.desc}｜`:''}${p.desc}${affixId==='ghost'?`（本件實際占用 ${slots} 格）`:''}</div></div><button class="b-buy" data-buy="${p.id}" data-cost="${c}"${noRoom?' disabled':''}>${noRoom?`需要 ${slots} 格空位`:'購買'}</button></div>`;
  });
  (G._shopRankBoosts||[]).forEach(boost=>{
    const key=String(boost.rank),isFlat=boost.type==='flat',current=isFlat?rankFlatBonus(key):rankDamagePercent(key),c=rankBoostPrice();
    html+=isFlat
      ?`<div class="shopitem rank-boost-item"><div class="info"><b>➕ ${key} 牌面增幅</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">每張 ${key} 提供的手牌基礎傷害永久 +2（目前 +${current} → +${current+2}），可無限疊加。</div></div><button class="b-buy" data-rankflat="${key}" data-cost="${c}">增幅 +2</button></div>`
      :`<div class="shopitem rank-boost-item"><div class="info"><b>🔢 ${key} 牌面倍率</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${key} 的手牌基礎傷害倍率永久 ${current}% → ${current+1}%，可無限疊加。</div></div><button class="b-buy" data-rankboost="${key}" data-cost="${c}">強化 +1%</button></div>`;
  });
  html+=`<div class="shopitem"><div class="info"><b>🧪 治療藥水</b> — <span style="color:var(--gold)">${price(60)}🪙</span><div class="desc">回復 40 HP（不超過上限）。</div></div><button class="b-buy" data-heal="1" data-cost="${price(60)}">購買</button></div>`;
  const controlCost=price(45),controlFull=G.control>=BALANCE.controlMax;
  html+=`<div class="shopitem"><div class="info"><b>🎛 控制補給</b> — <span style="color:var(--gold)">${controlCost}🪙</span><div class="desc">回復 ${BALANCE.controlShopRestore} 控制值（目前 ${G.control}/${BALANCE.controlMax}）。</div></div><button class="b-buy" data-control="1" data-cost="${controlCost}"${controlFull?' disabled':''}>${controlFull?'控制值已滿':'購買'}</button></div>`;
  const hpCost=maxHpPrice(),hpGain=playerMaxHpGain(20);
  html+=`<div class="shopitem"><div class="info"><b>💪 強健體魄</b> — <span style="color:var(--gold)">${hpCost}🪙</span><div class="desc">最大 HP +${hpGain} 並回復 20 HP${hpGain<20?'（鮮血契約使最大生命增長減半）':''}。已購買 ${G.maxHpPurchases||0} 次；每次價格 ×${BALANCE.maxHpGrowth.toFixed(2)}。</div></div><button class="b-buy" data-maxhp="1" data-cost="${hpCost}">購買</button></div>`;
  html+=`<div class="shopitem"><div class="info"><b>🃏 編輯牌庫</b><div class="desc">加入隨機牌或拆除牌庫卡牌（本次拆除 ${deckEditPrice(90)}🪙）。所有永久改牌共用指數價格：已改 ${G.deckEdits} 次，當前 ×${editRate}。目前 ${G.deck.length} 張。</div></div><button class="b-buy" id="open-deckedit">開啟</button></div>`;
  html+=`<div class="shopitem"><div class="info"><b>🎨 花色重鑄</b> — <span style="color:var(--gold)">${deckEditPrice(BALANCE.suitForgeBase)}🪙</span>${disc}<div class="desc">保留點數並永久改成指定花色；花色重鑄的基礎價格較低，每次成功改牌後仍與其他改牌共用價格成長。</div></div><button class="b-magic" id="open-suitforge">開啟</button></div>`;
  const sellables=inventoryPassives().filter(id=>!factionSealProtected(id)&&passiveAffixId(id)!=='locked').map(id=>ALL_PASSIVES.find(p=>p.id===id)).filter(Boolean);
  html+=`<div class="shopitem sell-panel"><div class="info"><b>♻️ 出售裝備（啟用欄位 ${activePassiveSlots()}/${currentPassiveLimit()}${G.sealedPassive?'，封存 1':''}）</b><div class="desc">商店購買品按實際買入價 50% 回收；開局與免費取得的裝備按基礎價格 25% 回收。「通貨膨脹」改按當前商店漲價倍率估值；鍍金使回收價 +10%。出售會失去相關強化與二次專精；血之三契與上鎖裝備不可出售。</div><div class="sell-list">${sellables.length?sellables.map(p=>`<button class="b-ghost" data-sell="${p.id}">${p.icon} ${passiveNameWithAffix(p.id)}${G.sealedPassive===p.id?'（已封存）':''}｜${passiveSellValue(p.id)}🪙</button>`).join(''):'目前沒有可出售的一般裝備。'}</div></div></div>`;
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
  rollShopStock();
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
  const cost=deckEditPrice(BALANCE.suitForgeBase),order=G.deck.map((c,i)=>({c,i})).sort((a,b)=>cardPoints(a.c)-cardPoints(b.c)||suitOrder(a.c.s)-suitOrder(b.c.s));
  $('suitforge-info').textContent=`選擇一張牌後指定新花色｜本次 ${cost}🪙｜已改牌 ${G.deckEdits} 次（×${deckEditMultiplier().toFixed(2)}）｜目前金幣 ${G.gold}🪙`;
  $('suitforge-deck').innerHTML=order.map(({c,i})=>`<div class="mini-card${c.red?' red':''}${G._forgeSel===i?' sel':''}" data-forge="${i}">${cardLabel(c)}${c.s}</div>`).join('');
  $('suitforge-deck').querySelectorAll('[data-forge]').forEach(el=>el.onclick=()=>{G._forgeSel=+el.dataset.forge;renderSuitForge();});
  renderSuitPicker('suitforge-picker',G._forgeSel!=null,s=>forgeSelectedSuit(s));
}
function forgeSelectedSuit(suit){
  const card=G.deck[G._forgeSel],cost=deckEditPrice(BALANCE.suitForgeBase);if(!card)return;
  if(card.s===suit){$('suitforge-info').textContent='這張牌已經是該花色。';return;}
  if(G.gold<cost){$('suitforge-info').textContent='金幣不足！';return;}
  const old=card.s;G.gold-=cost;card.s=suit;card.red=suit==='♥'||suit==='♦';G.deckEdits++;G._forgeSel=null;SFX.coin();
  renderSuitForge();renderTop();$('suitforge-info').textContent=`重鑄完成：${cardLabel(card)}${old} → ${cardLabel(card)}${suit}｜目前金幣 ${G.gold}🪙`;
}
function bindShop(){
  $('shop-items').querySelectorAll('button:not([data-sell])').forEach(btn=>{
    btn.onclick=()=>{
      const shopAffix=btn.dataset.buy&&G._shopAffixes&&G._shopAffixes[btn.dataset.buy];
      if(btn.dataset.buy&&passiveInventoryFull(passiveSlotCost(btn.dataset.buy,shopAffix))){btn.textContent='裝備欄空位不足';return;}
      if(btn.dataset.buy&&passiveConflictsWithOwned(btn.dataset.buy)){btn.textContent='與持有被動互斥';btn.disabled=true;return;}
      const cost=+btn.dataset.cost;
      if(G.gold<cost){btn.textContent='金幣不足';setTimeout(()=>btn.textContent='購買',900);return;}
      G.gold-=cost;SFX.coin();
      if(btn.dataset.buy){G.passives.push(btn.dataset.buy);G.passivePaid[btn.dataset.buy]=cost;G.passiveAffixes=G.passiveAffixes||{};if(shopAffix)G.passiveAffixes[btn.dataset.buy]=shopAffix;}
      else if(btn.dataset.heal)healPlayer(40);
      else if(btn.dataset.control)restoreControl(BALANCE.controlShopRestore);
      else if(btn.dataset.maxhp){G.maxhp+=playerMaxHpGain(20);healPlayer(20);G.maxHpPurchases=(G.maxHpPurchases||0)+1;}
      else if(btn.dataset.rankboost){const rank=btn.dataset.rankboost;G.rankDamage[rank]=rankDamagePercent(rank)+1;}
      else if(btn.dataset.rankflat){const rank=btn.dataset.rankflat;G.rankFlatDamage[rank]=rankFlatBonus(rank)+2;}
      btn.textContent='已購買 ✓';btn.style.background='#2ecc71';btn.style.color='#fff';btn.disabled=true;
      renderTop();
    };
  });
  $('shop-items').querySelectorAll('button[data-sell]').forEach(btn=>btn.onclick=()=>sellPassive(btn.dataset.sell));
}
function sellPassive(id){
  if(factionSealProtected(id)||passiveAffixId(id)==='locked'||!ownsP(id))return;
  const value=passiveSellValue(id),p=ALL_PASSIVES.find(item=>item.id===id),displayName=passiveNameWithAffix(id);
  G.passives=G.passives.filter(item=>item!==id);G.upgrades=G.upgrades.filter(item=>item!==id&&(id!=='doublebet'||item!=='doublebet2'));
  if(id==='suitmage')G.suitMastery=null;
  if(G.sealedPassive===id)G.sealedPassive=null;
  else restoreArchivedIfFits('出售裝備後被動欄已有空位');
  delete G.passivePaid[id];delete G.passiveAffixes[id];G.gold+=value;SFX.coin();renderShop();renderTop();
  setSaveStatus(`已出售${p?displayName:id}，獲得 ${value} 金幣。`);
}
function leaveShop(){completeEvent();}

//===== 百科 =====
function openCodex(){renderCodex();setCodexTab('passives');$('codex').classList.remove('hidden');}
function closeCodex(){$('codex').classList.add('hidden');}
function openRankDamage(){
  $('rank-damage-list').innerHTML=CARD_RANKS.map(rank=>`<div class="rank-damage-card"><div class="rank">${rank}</div><div class="mult">${rankDamagePercent(rank)}%</div><div class="muted">固定 +${rankFlatBonus(rank)}</div></div>`).join('');
  $('rank-damage').classList.remove('hidden');
}
function closeRankDamage(){$('rank-damage').classList.add('hidden');}
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
  $('codex-count').textContent=ALL_PASSIVES.length+MIRACLE_CARDS.length+PASSIVE_AFFIXES.length;
  $('codex-list').innerHTML=ALL_PASSIVES.map(p=>{
    const owned=G.passives.includes(p.id);const up=isUp(p.id);
    const action=owned
      ?'<div class="owned">✓ 已持有'+(p.id==='doublebet'&&G.upgrades.includes('doublebet2')?'（二次強化）':up?'（已強化）':'')+(p.id==='suitmage'&&G.suitMastery?`｜${masteryInfo().name}`:'')+'</div>'
      :'<div class="ccost" style="text-align:center;padding:7px">尚未獲得</div>';
    let upLine=p.descUp?`<div class="ccost" style="color:var(--gold)">⭐ 強化：${p.descUp}</div>`:'<div class="ccost">（無強化）</div>';
    if(p.id==='suitmage')upLine+=`<div class="ccost" style="color:#d7b4ff">⭐⭐ 二次專精四選一：${SUIT_MASTERIES.map(m=>m.name).join('／')}</div>`;
    if(p.id==='doublebet')upLine+=`<div class="ccost" style="color:#d7b4ff">⭐⭐ 二次強化：${DOUBLEBET_MASTERY_DESC}</div>`;
    const stars=p.id==='doublebet'&&G.upgrades.includes('doublebet2')?' ⭐⭐':up?' ⭐':'';
    const rarity=rarityInfo(p.id),source=p.id==='bloodpact'?'魔王稀有掉落｜血魔機率較高｜無法購買':`${rarity.name}｜商店基礎售價 ${p.cost}🪙`;
    return `<div class="codex-card"><div class="cn">${p.icon} ${p.name}${stars} <span class="rarity rarity-${passiveRarity(p.id)}">${rarity.name}</span></div><div class="cd">${p.desc}</div>${upLine}<div class="ccost">${source}</div>${action}</div>`;
  }).join('')+MIRACLE_CARDS.map(card=>{
    const type=card.id==='holy-miracle'?'holy':'dark',owned=miracleType()===type;
    return `<div class="codex-card miracle-card"><div class="cn">${card.icon} ${card.name} <span class="rarity rarity-special">神蹟</span></div><div class="cd">${card.desc}</div><div class="ccost">神蹟卡牌｜不占裝備欄｜無法購買</div><div class="${owned?'owned':'ccost'}">${owned?'✓ 目前持有':'目前未持有'}</div></div>`;
  }).join('')+PASSIVE_AFFIXES.map(affix=>{
    const overall=(PASSIVE_AFFIX_CHANCE*affix.weight).toFixed(1);
    return `<div class="codex-card affix-card"><div class="cn">${affix.icon} ${affix.name} <span class="rarity rarity-${affix.rarity}">${RARITY_INFO[affix.rarity].name}詞條</span></div><div class="cd">${affix.desc}</div><div class="ccost">被動出現時約 ${overall}% 機率附加｜每件最多一條</div></div>`;
  }).join('');
  $('status-count').textContent=STATUS_CODEX.length;
  $('status-list').innerHTML=STATUS_CODEX.map(status=>`<div class="codex-card status-card"><div class="cn">${status.icon} ${status.name}</div><div class="cd">${status.desc}</div></div>`).join('');
}

function gameOver(){show('end');SFX.lose();$('end-title').textContent='💀 你倒下了';$('end-title').className='big';$('end-sub').textContent=`你爬到了第 ${G.floor} 層。賭場無情，再挑戰一次？`;}

function openCharacterSelect(){
  newGame();show('character');renderTop();
  $('character-list').innerHTML=CHARACTERS.map(c=>{
    const skills=c.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return `<span>${p.icon} ${p.name}</span>`;}).join('')+(c.id==='magician'?'<span>＋ 花色技能四選二</span>':'');
    return `<div class="character-card"><div class="character-icon">${c.icon}</div><div class="character-name">${c.name}</div><div class="character-desc">${c.desc}</div><div class="character-skills">${skills}</div><button class="b-next" data-character="${c.id}">選擇 ${c.name}</button></div>`;
  }).join('');
  $('character-list').querySelectorAll('[data-character]').forEach(btn=>btn.onclick=()=>{
    newGame(btn.dataset.character);
    if(G.character==='magician')openMagicianStart();else openFaithNecklaceIntro();
  });
}
function openMagicianStart(){
  G._magicianChoosing=true;G._magicianStarters=[];show('magician-start');renderMagicianStartChoices();
}
function renderMagicianStartChoices(){
  const selected=G._magicianStarters||[];
  $('magician-start-list').innerHTML=SUIT_STARTERS.map(id=>{
    const p=ALL_PASSIVES.find(item=>item.id===id);
    const chosen=selected.includes(id);
    return `<div class="starter-choice${chosen?' selected':''}"><div class="starter-icon">${p.icon}</div><div class="starter-name">${p.name}</div><div class="starter-desc">${p.desc}</div><button class="b-magic" data-starter="${p.id}"${chosen?' disabled':''}>${chosen?'✓ 已選擇':`選擇 ${p.name}`}（${selected.length}/2）</button></div>`;
  }).join('');
  $('magician-start-list').querySelectorAll('[data-starter]').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.starter;if(!G._magicianChoosing||!SUIT_STARTERS.includes(id)||G._magicianStarters.includes(id))return;
    G._magicianStarters.push(id);G.passives.push(id);G.passivePaid[id]=0;
    if(G._magicianStarters.length>=2){G._magicianChoosing=false;delete G._magicianStarters;openFaithNecklaceIntro();return;}
    renderMagicianStartChoices();
  });
}

$('btn-hit').onclick=hit;
$('btn-stand').onclick=attack;
$('btn-defend').onclick=defend;
$('btn-escape').onclick=escapeAbyss;
$('btn-atonement-free').onclick=()=>atone('free');
$('btn-atonement-gold').onclick=()=>atone('gold');
$('btn-atonement-control').onclick=()=>atone('control');
$('btn-redraw').onclick=redraw;
$('btn-peek').onclick=peek;
$('btn-leave-shop').onclick=leaveShop;
$('shop-refresh').onclick=refreshShop;
$('btn-skip-upgrade').onclick=finishUpgradeReward;
$('btn-restart').onclick=openCharacterSelect;
$('ui-sound').onclick=()=>{const on=SFX.toggle();$('ui-sound').textContent=on?'🔊 音效':'🔇 靜音';};
$('ui-codex').onclick=openCodex;
$('ui-rank-damage').onclick=openRankDamage;
$('rank-damage-close').onclick=closeRankDamage;
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
