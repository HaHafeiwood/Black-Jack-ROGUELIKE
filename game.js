const IMG={
  slime:'slime 1751x1146.png',
  ninja:'Ninja - 480x624.png',
  ghost:'Ghost - 480x480.png',
  witch:'Witch - 480x492.png',
  dragon:'Dragon - 640x383.png',
  bloodDemon:'Demon - 640x605.png',
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
  ronin:'ronin-straw-hat-silhouette-transparent-480x624.png',
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
  ronin:IMG.ronin,
};
const ENEMY_META={
  slime:{name:'史萊姆',type:'slime',img:IMG.slime,h:120},ninja:{name:'忍者',type:'ninja',img:IMG.ninja,h:185},ghost:{name:'幽靈',type:'ghost',img:IMG.ghost,h:160},witch:{name:'女巫',type:'witch',img:IMG.witch,h:185},
  bear:{name:'熊',type:'bear',img:IMG.bear,h:180},platypus:{name:'鴨嘴獸',type:'platypus',img:IMG.platypus,h:155},squirrel:{name:'松鼠',type:'squirrel',img:IMG.squirrel,h:150},mimic:{name:'貪噬寶箱怪',type:'mimic',img:IMG.mimic,h:190},
  dropbear:{name:'掉落熊',type:'dropbear',img:IMG.dropbear,h:175},zombie:{name:'殭屍',type:'zombie',img:IMG.zombie,h:190},eagle:{name:'老鷹',type:'eagle',img:IMG.eagle,h:185},robot:{name:'機器人',type:'robot',img:IMG.robot,h:185},
  cultist:{name:'邪教徒',type:'cultist',img:IMG.cultist,h:185},skeleton:{name:'骷髏戰士',type:'skeleton',img:IMG.skeleton,h:190},bat:{name:'吸血蝙蝠',type:'bat',img:IMG.bat,h:130},cyclops:{name:'獨眼巨人',type:'cyclops',img:IMG.cyclops,h:205},
  paladin:{name:'聖騎士',type:'paladin',img:IMG.paladin,h:205},werewolf:{name:'狼人',type:'werewolf',img:IMG.werewolf,h:190},gargoyle:{name:'石像鬼',type:'gargoyle',img:IMG.gargoyle,h:205,boss:true},
  ronin:{name:'流浪武士',type:'ronin',img:IMG.ronin,h:210,elite:true},
  dragon:{name:'魔龍 · 莊家',type:'dragon',img:IMG.dragon,h:165,boss:true},bloodDemon:{name:'血魔',type:'bloodDemon',img:IMG.bloodDemon,emoji:'😈',h:175,boss:true},samurai:{name:'武士',type:'samurai',img:IMG.samurai,h:205,boss:true},
  kun:{name:'鯤 · 北冥巨獸',type:'kun',img:IMG.kun,h:225,boss:true,ultimate:true},peng:{name:'鵬 · 垂天之翼',type:'peng',img:IMG.peng,h:235,boss:true,ultimate:true},cultLeader:{name:'無面教宗・默禱者',type:'cultLeader',img:IMG.cultLeader,h:225,boss:true,ultimate:true},
  disciplineGargoyle:{name:'戒律石像鬼',type:'disciplineGargoyle',img:IMG.gargoyle,h:205,ultimateMinion:true},punishmentGargoyle:{name:'刑罰石像鬼',type:'punishmentGargoyle',img:IMG.gargoyle,h:205,ultimateMinion:true},
  cthulhu:{name:'邪神・克蘇魯',type:'cthulhu',img:IMG.cthulhu,h:240,boss:true,ultimate:true},inquisitorMounted:{name:'異端審判長・鐵騎',type:'inquisitorMounted',img:IMG.inquisitorMounted,h:230,boss:true,ultimate:true},inquisitor:{name:'異端審判長・行刑者',type:'inquisitor',img:IMG.inquisitor,h:230,boss:true,ultimate:true},
};
const EXTERNAL_BALANCE=window.BLACKJACK_BALANCE_DATA;
if(!EXTERNAL_BALANCE)throw new Error('找不到已編譯的外部敵人數值 balance-data.js');
const BASE_STAT_DATA=EXTERNAL_BALANCE.base;
const MIXED_FORMATIONS=EXTERNAL_BALANCE.mixedFormations;
const EVENT_ENEMY_RANK='elite';
function roundHalfEven(value,digits=3){
  const factor=10**digits,scaled=value*factor,lower=Math.floor(scaled),fraction=scaled-lower;
  const tolerance=Number.EPSILON*Math.max(1,Math.abs(scaled))*4;
  const rounded=fraction>0.5+tolerance?lower+1:fraction<0.5-tolerance?lower:(lower%2===0?lower:lower+1);
  return rounded/factor;
}
function compiledEnemyStats(key,rankOverride=null){
  const source=EXTERNAL_BALANCE.enemies[key],statRank=rankOverride||source?.rank,rank=source&&BASE_STAT_DATA.rankMultipliers[statRank];
  if(!source||!rank)throw new Error(`敵人 ${key} 缺少外部基礎數值`);
  return {
    hp:Math.max(1,Math.round(BASE_STAT_DATA.reference.hp*rank.hp*source.hp)),
    atk:source.attack.map(value=>Math.max(1,Math.round(BASE_STAT_DATA.reference.attack*rank.attack*value))),
    statRank,
  };
}
const ENEMIES=Object.fromEntries(Object.entries(ENEMY_META).map(([key,meta])=>[key,{...meta,...compiledEnemyStats(key)}]));
const NORMAL_POOL=['ninja','eagle','robot','cultist','skeleton','cyclops','werewolf','bats','slimes','zombies','witch','ghost','bear','platypus','squirrel','dropbear'];
const EARLY_POOL=['slimes','ninja','squirrel'];
const MID_POOL=['ninja','eagle','robot','cultist','slimes','zombies','witch','ghost','bear','platypus','squirrel'];
const CHAPTER_LENGTH=11;
const RANDOM_NODE_COUNT=9;
const REST_NODE=10;
const BOSS_NODE=11;
const LEGACY_CHAPTER_LENGTH=5;
const BASE_EVENT_CHANCE=0.30;
const EVENT_CHANCE_STEP=0.05;
const BASE_SHOP_CHANCE=0.50;
const SHOP_CHANCE_STEP=0.10;
const BLOOD_ALTAR_WEIGHT=8;
const CHURCH_EVENT_WEIGHT=30;
const SQUIRREL_NEST_EVENT_WEIGHT=16;
const TREASURE_CHEST_EVENT_WEIGHT=2;
const RONIN_EVENT_WEIGHT=5;
const REST_EVENT_WEIGHT=30;
const FAITH_NECK_CHURCH_BONUS=15;
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
  {id:'warrior',name:'戰士',icon:'⚔️',passives:['rubyring','heartguard','redraw','safe21','collector'],desc:'兼具恢復、防禦與永久牌庫塑形，安全累積攻勢。'},
  {id:'magician',name:'魔術師',icon:'🎭',passives:['suitmage'],desc:'以同花色 2／3／4 張構成三階術式；開局必須把飛刀與鐵板原子性安裝到兩個不同花色。'},
  {id:'gambler',name:'賭徒',icon:'🎲',passives:['cardsharp','doublebet'],desc:'選定幸運數字，利用老千追逐精確或倍數命中，並承擔與選號相應的爆牌反噬。'},
  {id:'samurai',name:'武士',icon:'🗡️',passives:['firststrike'],desc:'以無銘打刀居合，透過攻擊與見切累積心流；20／21 點見切可形成基礎持續 3 回合的殘心。'},
];

// 每張被動卡有 desc（基礎）與 descUp（強化）。
const ALL_PASSIVES=[
  {id:'doublebet', name:'雙倍豪賭', icon:'🎲', cost:180, shop:false, desc:'賭徒職業被動卡。每場戰鬥發牌前選擇 2～21 的幸運數字；精確命中或命中其倍數會增幅一般攻擊與防禦，爆牌則額外失去等同幸運數字的生命。選號會沿用至戰後賞金。採職業被動最高保護，不受技能封鎖。', descUp:'提高賠率：精確／倍數命中的戰鬥倍率額外 +0.20／+0.05，賞金倍率額外 +0.10／+0.03；爆牌反噬不降低。'},
  {id:'redraw',    name:'重抽機會', icon:'🔄', cost:130, desc:'解鎖重抽；每次消耗 6 控制值。控制值跨一般關卡與金錢回合共用。', descUp:'重抽消耗降為 3，且爆牌後也能重抽救牌。'},
  {id:'insurance', name:'保險機制', icon:'🛡️', cost:150, desc:'爆牌時，仍造成前兩張牌的點數傷害。', descUp:'爆牌時，仍造成前三張牌的點數傷害。'},
  {id:'peek',      name:'透視牌堆', icon:'👁️', cost:110, desc:'解鎖預覽接下來三張牌；每次消耗 6 控制值。控制值跨一般關卡與金錢回合共用。', descUp:'預覽提高為四張，消耗降為 3 控制值。'},
  {id:'vampire',   name:'吸血賭注', icon:'🩸', cost:170, desc:'成功攻擊時，回復造成傷害的 20% HP。', descUp:'成功攻擊時，回復造成傷害的 30% HP。'},
  {id:'bloodpact', name:'鮮血契約', icon:'📜', cost:null, shop:false, desc:'撿起時最大生命減半；成為血魔前，未來獲得的最大生命也減半。獲得 5 層渴血，戰後無法自然回血；世人評價與信仰項鍊的變化效率減半，只有得到足夠認同時才能向對應教堂祈禱。不可封印、不可出售。成為血魔後進化為血魔契約。'},
  {id:'safe21',    name:'安全線', icon:'🪙', cost:100, desc:'手牌達 17 點以上選擇攻擊時，額外 +5 傷害。', descUp:'手牌達 17 點以上選擇攻擊時，額外 +8 傷害。'},
  {id:'bulwark',   name:'壁壘', icon:'🏰', cost:80, desc:'防禦值不再於回合結束歸零，可持續累積。', descUp:'防禦持續累積；攻擊時每滿 10 點多餘防禦使最終傷害倍率 +0.1，最高 ×1.6，且不消耗防禦。'},
  {id:'buckler',   name:'圓盾', icon:'🛡', cost:120, desc:'選擇防禦時額外獲得 8 防禦；可使用 4 次。', descUp:'選擇防禦時額外獲得 10 防禦，且不消耗耐久。'},
  {id:'antidote',  name:'淨化', icon:'✨', cost:120, desc:'獲得 40% 負面狀態抗性，降低有害狀態的獲得層數，並提高遲疑提供的可抽牌數。與「我們是怎麼走到這一步的」互斥。', descUp:'負面狀態抗性提高為 60%，進一步降低有害層數並提高遲疑可抽牌數。'},
  {id:'howdidwegethere',name:'我們是怎麼走到這一步的',icon:'❓',cost:175,desc:'實際獲得的所有數值型狀態層數 ×1.5，無論有利或有害；永遠至少持有 3 層虛弱。與淨化互斥。',descUp:'實際獲得的所有數值型狀態層數改為 ×2；仍永遠至少持有 3 層虛弱。'},
  {id:'toxicology',name:'毒物學', icon:'⚗️', cost:145, desc:'成功攻擊時，每張 2～3 依其牌面點數對目標施加等量中毒；對單個敵人累計給予 10 層中毒後，再給予 1 層猛毒。', descUp:'適用牌面擴大為 2～4；對單個敵人累計給予猛毒的門檻降為 8 層中毒。'},
  {id:'heartguard',name:'護心鏡', icon:'🪞', cost:180, desc:'選擇防禦時，額外將手牌點數的 30% 轉為防禦。', descUp:'選擇防禦時，額外將手牌點數的 50% 轉為防禦。'},
  {id:'dragonneck',name:'龍頭項鍊', icon:'🐉', cost:200, desc:'5 張以上不爆時，額外造成 50 傷害並回復 50 HP。', descUp:'五龍時，額外造成 50 + 點數50% 傷害，並回復 50 + 點數20% HP。'},
  {id:'luckycoin', name:'幸運金幣', icon:'🍀', cost:110, desc:'商店所有價格 −10%，進入商店時回復 5 HP。', descUp:'商店所有價格 −15%，進入商店時回復 10 HP。'},
  {id:'collector', name:'蒐集家', icon:'🎴', cost:140, shop:false, desc:'戰士職業被動卡。解鎖永久加入、刪除、替換、複製、升降牌面及指定重鑄牌面的完整戰鬥牌庫塑形。採職業被動最高保護。', descUp:'一般戰鬥勝利後揭示 2 張素材牌，可收藏其中 1 張；素材區上限 3 張，只能在之後的牌庫整備中用於加入或替換。'},
  {id:'rubyring',  name:'紅寶石戒指', icon:'💍', cost:130, desc:'每清除一層回復 8 HP。', descUp:'每清除一層回復 15 HP。'},
  {id:'echelon',   name:'階層', icon:'📈', cost:150, desc:'本回合比初始多抽 n 張牌時，攻擊額外 +n! 傷害。', descUp:'同上，但 n 額外 +1（成長更快）。'},
  {id:'cardsharp', name:'老千', icon:'🤵', cost:140, desc:'解鎖丟棄單張手牌；每次消耗 3 控制值。控制值跨一般關卡與金錢回合共用。', descUp:'丟棄消耗降為 2 控制值。'},
  {id:'suitmage',  name:'花色魔術師', icon:'🎭', cost:175, shop:false, desc:'魔術師職業被動卡。同花色 2／3／4 張以上會在有效且未爆牌的攻擊或防禦中施放第一／第二／第三階術式；花色魔術每次消耗 3 控制值，每副手牌最多成功改色一次。採職業被動最高保護。', descUp:'花色魔術消耗降為 2 控制值，立即選擇一種花色專精，並解鎖商店花色增幅。'},
  {id:'firststrike',name:'先發制人',icon:'⚔️',cost:130,desc:'戰鬥第 1 回合以恰好 2 張、20 點的手牌攻擊時，額外 +20 傷害。',descUp:'第 1 回合以不超過 3 張、19～21 點的手牌攻擊時，額外 +30 傷害。'},
  {id:'straight',name:'連號',icon:'🔗',cost:145,desc:'手牌含至少 3 張連續牌面時，攻擊與防禦 +18。A 視為 1，Q-K-A 不成立。',descUp:'三連號攻防 +24；四張以上連號攻防 +40。'},
  {id:'court',name:'宮廷牌局',icon:'👑',cost:165,desc:'每張 J／Q／K 額外 +3 傷害；三者齊聚時將點數鎖定為 21 並攻擊 +35，鎖定後再抽牌必定爆牌。',descUp:'每張 J／Q／K 額外 +4 傷害；三者齊聚時鎖定 21，攻擊 +50、防禦 +25，鎖定後再抽牌必定爆牌。'},
  {id:'bountyhunter',name:'賞金獵人',icon:'💰',cost:150,desc:'以 20 或 21 點結算賞金後，下一場戰鬥首次成功攻擊額外增加「賞金倍率 ×10」傷害。',descUp:'第一次攻擊獲得完整加成，第二次成功攻擊再獲得 50% 加成。'},
  {id:'laststand',name:'背水一戰',icon:'🔥',cost:155,desc:'HP 不高於 30% 時，攻擊 ×1.5，但防禦值 −20%。',descUp:'HP 不高於 40% 時攻擊 ×1.6，且不再降低防禦。'},
  {id:'faithneck',name:'信仰項鍊',icon:'📿',cost:165,desc:'教堂出現率提高；立場明確後，每個完整戰鬥回合都會使世人對你的評價朝當前方向發展。不會被敵對勢力封印；獲得神蹟後，對敵對勢力造成的攻擊傷害 ×1.10。',descUp:'教堂出現率維持提高；使世人評價變化的速度提升。不會被敵對勢力封印，神蹟的敵對勢力傷害維持 ×1.10。'},
  {id:'inflation',name:'通貨膨脹',icon:'📊',cost:160,slots:2,resale:'market',desc:'占用 2 個裝備欄。出售時不按原買入價，而是依當前商店漲價倍率重新估值。'},
  {id:'toolkit',name:'工具包',icon:'🧰',cost:135,desc:'消耗品種類欄位 +2。',descUp:'消耗品種類欄位改為 +4。'},
  {id:'thousandstrikes',name:'一瞬千擊',icon:'⚡',cost:260,desc:'成功的一般攻擊正常結算後，將本次固定加法傷害合計為連擊值，追加等同連擊值 100% 的追擊，最多分為 5 段。追擊不受玩家正向傷害倍率影響。毒物學的原始中毒提高 50%，每次最多額外增加 3 層。',descUp:'追擊提高為連擊值 150%，最多分為 7 段。毒物學的原始中毒提高 100%，每次最多額外增加 6 層。'},
  {id:'beheading',name:'斬首',icon:'⚔️',cost:220,shop:false,desc:'成功攻擊後，若目標生命降至斬首線以下，立即將其擊倒。尚未持有時，擊敗流浪武士可選擇是否收下 5% 斬首；收下後只能透過再次擊敗流浪武士提高，最高 20%。'},
];

const SUITS=['♠','♥','♦','♣'];
const PROFESSION_PASSIVES_BY_CHARACTER=Object.freeze({warrior:['collector'],magician:['suitmage'],gambler:['doublebet']});
const PROFESSION_PASSIVES=new Set(Object.values(PROFESSION_PASSIVES_BY_CHARACTER).flat());
const SAMURAI_BOSS_UNLOCK_CHAPTER=4;
const PURIFIABLE_STATUS_DEFS=Object.freeze([
  {key:'poison',name:'中毒'},{key:'virulence',name:'猛毒'},{key:'corruption',name:'腐敗'},{key:'sepsis',name:'敗血'},
  {key:'bleed',name:'流血'},{key:'fracture',name:'斷骨'},{key:'burn',name:'燒傷'},{key:'trauma',name:'創傷'},
  {key:'blind',name:'致盲'},{key:'weakness',name:'虛弱'},{key:'hallucination',name:'幻覺'},
  {key:'mentalDisorder',name:'精神錯亂'},{key:'paralysis',name:'麻痺'}
]);
const REFLECTABLE_STATUS_KEYS=new Set(['poison','virulence','burn','bleed','trauma','weakness']);
const PHASE_STATUS_DEFS=Object.freeze([
  ...PURIFIABLE_STATUS_DEFS.slice(0,10),{key:'hesitation',name:'遲疑'},{key:'thirst',name:'渴血'},...PURIFIABLE_STATUS_DEFS.slice(10)
]);
const BLADE_DEFS={
  firststrike:{id:'firststrike',name:'無銘打刀',icon:'🗡️',sourceId:'firststrike'},
  safe21:{id:'safe21',name:'界守打刀',icon:'⚖️',sourceId:'safe21'},
  court:{id:'court',name:'三公太刀',icon:'👑',sourceId:'court'},
  insurance:{id:'insurance',name:'破綻脇差',icon:'🛡️',sourceId:'insurance'},
  peek:{id:'peek',name:'天機脇差',icon:'👁️',sourceId:'peek'},
  vampire:{id:'vampire',name:'血博腰刀',icon:'🩸',sourceId:'vampire'},
  bulwark:{id:'bulwark',name:'不動太刀',icon:'🏯',sourceId:'bulwark',type:'太刀'},
  buckler:{id:'buckler',name:'月輪脇差',icon:'🌙',sourceId:'buckler',type:'脇差'},
  antidote:{id:'antidote',name:'明鏡打刀',icon:'🪞',sourceId:'antidote',type:'打刀'},
  heartguard:{id:'heartguard',name:'鏡心打刀',icon:'🪞',sourceId:'heartguard',type:'打刀'},
  howdidwegethere:{id:'howdidwegethere',name:'萬象妖刀',icon:'🌀',sourceId:'howdidwegethere',type:'妖刀'},
  toxicology:{id:'toxicology',name:'蠱毒脇差',icon:'🐍',sourceId:'toxicology',type:'脇差'},
  dragonneck:{id:'dragonneck',name:'五龍大太刀',icon:'🐉',sourceId:'dragonneck',type:'太刀'},
  luckycoin:{id:'luckycoin',name:'招福脇差',icon:'🍀',sourceId:'luckycoin',type:'脇差'},
  rubyring:{id:'rubyring',name:'緋晶打刀',icon:'💎',sourceId:'rubyring',type:'打刀'}
};
const CARD_RANKS=['A',2,3,4,5,6,7,8,9,10,'J','Q','K'];
const PASSIVE_LIMIT=10;
const PASSIVE_RARITY={
  safe21:'common',buckler:'common',insurance:'common',
  rubyring:'uncommon',antidote:'uncommon',toxicology:'uncommon',collector:'uncommon',echelon:'uncommon',firststrike:'uncommon',straight:'uncommon',bountyhunter:'uncommon',laststand:'uncommon',toolkit:'uncommon',
  heartguard:'rare',peek:'rare',redraw:'rare',cardsharp:'rare',vampire:'rare',luckycoin:'rare',bulwark:'rare',suitmage:'rare',court:'rare',faithneck:'rare',howdidwegethere:'rare',inflation:'rare',
  doublebet:'legendary',dragonneck:'legendary',thousandstrikes:'legendary',bloodpact:'special',
  beheading:'special',
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
  {id:'four_suits',name:'四象齊聚',icon:'🧭',desc:'四種真實花色齊聚時，原本只有 1 張的花色也視為第一階術式；賞金倍率 ×1.5。'},
  {id:'flush',name:'同花大獎',icon:'🌊',desc:'每次行動第一個由至少 4 張同花形成的第三階術式，結算後再施放一次第一階安可；賞金倍率 ×1.75。'},
  {id:'alternating',name:'紅黑交替',icon:'🌓',desc:'手牌至少 4 張且完全紅黑交替時，每種花色術式計數 +1（最多視為 4 張）；賞金倍率 ×1.75。'},
  {id:'mono',name:'純色牌組',icon:'🎨',desc:'戰鬥開始依永久戰鬥牌庫鎖定唯一占比至少 40% 的主花色；有主花色時只啟用該花色且計數 +1。其後賞金沿用此鎖定，主花色過半時 ×1.5。'},
];
const DOUBLEBET_MASTERY_DESC='孤注一擲：選號時可事先啟用，將所有幸運數字倍率超過 ×1.00 的部分加倍；戰鬥爆牌生命反噬改為幸運數字 ×2，賞金爆牌改為倒扣本次基礎賞金。選定後固定至賞金結束。';

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
const SAVE_VERSION=6;
const GAME_VERSION='0.45.0';
const BLEED_CAP=12,BURN_CAP=8;
const DEVELOPER_SEED_KEY='nonolin1968@gmail.com';
const BALANCE={
  startGold:100,
  hpTierStep:BASE_STAT_DATA.heightMultipliers.hpTierStep,
  atkTierStep:BASE_STAT_DATA.heightMultipliers.attackTierStep,
  hpMicroPerFloor:BASE_STAT_DATA.heightMultipliers.hpMicroPerFloor,
  atkMicroPerFloor:BASE_STAT_DATA.heightMultipliers.attackMicroPerFloor,
  clearHeal:4,
  focusRate:0.5,
  focusCap:25,
  bucklerUses:4,
  suitForgeBase:45,
  suitEnchantWorkshop:{installBase:65,moveBase:30},
  deckWorkshop:{
    prices:{shift:35,replace:50,add:40,remove:70,duplicate:80,reforge:90},
    visitMultipliers:[1,1.35,1.70,2],fixedRestDiscount:.8,
    minCards:30,maxExactCopies:2,maxRankCopies:6,maxTenValueRatio:.4,materialLimit:3,
  },
  maxHpGrowth:1.20,
  shopGrowthPower:0.75,
  bloodDemonFrenzyUses:5,
  bloodPactChance:0.15,
  bloodPactBloodDemonChance:0.50,
  rankBoostShopChance:0.12,
  rankBoostShopChanceFull:0.65,
  rankBoostShopRollsFull:2,
  controlMax:15,
  controlRestore:3,
  controlShopRestore:6,
  samuraiFlowCap:100,
  samuraiMikiriCooldown:3,
  luckyNumber:{
    min:2,max:21,
    bands:[
      {min:2,max:5,battleExact:1.20,battleMultiple:1.08,bountyExact:1.10,bountyMultiple:1.03},
      {min:6,max:9,battleExact:1.35,battleMultiple:1.10,bountyExact:1.15,bountyMultiple:1.05},
      {min:10,max:13,battleExact:1.55,battleMultiple:1.12,bountyExact:1.20,bountyMultiple:1.07},
      {min:14,max:17,battleExact:1.80,battleMultiple:1.15,bountyExact:1.30,bountyMultiple:1.10},
      {min:18,max:20,battleExact:2.10,battleMultiple:1.00,bountyExact:1.40,bountyMultiple:1.00},
      {min:21,max:21,battleExact:2.40,battleMultiple:1.00,bountyExact:1.50,bountyMultiple:1.00},
    ],
    upgrade:{battleExact:.20,battleMultiple:.05,bountyExact:.10,bountyMultiple:.03},
  },
};
const MIRACLE_CARDS=[
  {id:'holy-miracle',icon:'✨',name:'聖輝眷顧',desc:'獲得神教堂認可時取得。提供 30% 異常抗性，使非吸血類回復量變為 2 倍，並可在致死時以 30% 最大生命復活一次。復活會清除自身所有暫時正面與負面狀態。整局只有一次復活機會，重新取得神蹟不會重置。'},
  {id:'dark-miracle',icon:'🌑',name:'深淵餽贈',desc:'獲得邪教堂認可時取得。額外提供 1 個一般裝備欄；失去認可時神蹟會消散，若裝備超額則須封存一件。封存裝備只有在被動欄重新容得下時才會恢復。'},
];
const STATUS_CODEX=[
  {icon:'☠',name:'中毒',desc:'行動階段前，每層造成 1 HP 傷害；不會自然衰減。負面狀態抗性可降低獲得的層數。'},
  {icon:'☣️',name:'猛毒',desc:'每層使中毒傷害提高 10%；每經過 10 個完整戰鬥回合自然減少 1 層。部分施毒攻擊會依其標示的「每 X 層中毒 → Y 層猛毒」規則累積。'},
  {icon:'🔥',name:'燒傷',desc:`最高 ${BURN_CAP} 層。滿層後再次獲得的燒傷會以 1：1 轉為創傷。額外抽牌時，每層造成 2 HP 傷害；每發作 2 次減少 1 層，此外每個完整回合再自然減少 1 層。敵人的燒傷則在其行動回合前發作。負面狀態抗性可降低獲得的層數。`},
  {icon:'🧟',name:'腐敗',desc:'最高 3 層，每層使戰鬥中的回血量降低 20%，最低仍保留 40% 回血；不會自然衰減。負面狀態抗性可降低獲得的層數。'},
  {icon:'🦠',name:'敗血',desc:'最高 5 層。受到吸血時，每層使吸血者的吸血效率提高 15%；不會自然衰減。負面狀態抗性可降低獲得的層數。'},
  {icon:'🩸',name:'流血',desc:`最高 ${BLEED_CAP} 層。滿層後再次獲得的流血會以 1：1 轉為創傷。直接攻擊傷及 HP 時會發作，造成等同層數的傷害，之後自然減少 2 層；完全防禦與狀態傷害不會觸發。負面狀態抗性可降低獲得的層數。`},
  {icon:'🩹',name:'創傷',desc:'可疊加。每層使受到的攻擊傷害增加 0.3 倍，受到的燒傷、中毒與流血傷害增加 1 倍；每回合自然減少 1 層。'},
  {icon:'🌑',name:'致盲',desc:'無法使用一般攻擊。以 2～18 點解除 1 層、19～21 點完全解除；爆牌無法解除。仍可防禦，但防禦量降低 20%，且不會減少致盲。'},
  {icon:'🦴',name:'斷骨',desc:'最高 3 層。每層使新獲得的防禦降低 15%，不影響已經持有的防禦；不會自然解除。負面狀態抗性可降低獲得的層數。'},
  {icon:'📉',name:'虛弱',desc:'每層使攻擊力降低 10%，最高 9 層；完成下一次行動後全部解除。負面狀態抗性可降低獲得的層數。'},
  {icon:'🪞',name:'明鏡淨化分類',desc:'可淨化：中毒、猛毒、腐敗、敗血、流血、斷骨、燒傷、創傷、致盲、虛弱、幻覺、精神錯亂、麻痺。可反射：中毒、猛毒、燒傷、流血、創傷、虛弱。遲疑、渴血、技能封鎖、戒律烙印、殘心、心流、護盾、防禦、蓄勢與敵人專屬資源均不在此分類。'},
  {icon:'🌀',name:'萬象增相分類',desc:'可增相：中毒、猛毒、腐敗、敗血、流血、斷骨、燒傷、創傷、致盲、虛弱、遲疑、渴血、幻覺、精神錯亂、麻痺。技能封鎖、戒律烙印、殘心、心流、防禦、護盾、蓄勢、契約、神蹟與其他非數值狀態不能增相。'},
  {icon:'🦫',name:'遲疑',desc:'層數代表下一次行動可額外抽牌的張數，層數越高越有利；完成行動後解除。敵人越強，給予的層數越少，但最低仍可額外抽 2 張；負面狀態抗性會提高層數。'},
  {icon:'🛡',name:'防禦',desc:'優先抵擋即將受到的傷害；一般會在承受攻擊後歸零，持有壁壘則可保留。武士的壁壘改為延長殘心，不保留防禦。'},
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
  {icon:'🧘',name:'殘心',desc:'武士的持續戰鬥狀態。以 20 點見切並實際擋住攻擊時，獲得攻擊 +25%、承受攻擊 −15%；21 點改為 +35%／−20%。基礎持續 3 個完整回合，未強化／已強化壁壘延長為 4／5 回合，期間等比例衰減；較弱殘心不會覆蓋較強殘心，見切未形成新殘心或爆牌會立即清除。不動太刀可依剩餘回合強化居合與心流收益，並讓每段殘心有一次以架勢暫停自然衰減的機會。'},
  {icon:'🌊',name:'心流',desc:'玩家武士的戰鬥資源，上限 100。無銘打刀可透過成功攻擊取得少量心流；見切不消耗心流，並依實際擋住比例、敵人招式威力、裝備及刀具能力取得心流。敵人的樓高、階級、編隊與自身強化不會額外放大收益。'},
  {icon:'🗡️',name:'架勢',desc:'武士持刀或徒手時可用的穩定防禦，依手牌點數降低整個敵方回合的攻擊傷害，不消耗心流也沒有冷卻；持有刀具且處於納刀狀態時不可使用。防禦型裝備不會提高減傷比例，確實擋住攻擊時會改為提供心流。'},
  {icon:'👁️',name:'見切',desc:'武士持刀或徒手時可用的精準防禦，依手牌點數降低整個敵方回合的攻擊傷害且不消耗心流；持有刀具且處於納刀狀態時不可使用。使用後需經過 3 次玩家行動才能再次使用，破防會削弱對應攻擊受到的減傷。'},
  {icon:'🫥',name:'幻覺',desc:'層數代表剩餘時間。持續期間看見手牌時有 5% 機率顯示成錯誤牌面；結算依照真實牌面，每完成一次行動減少 1 層。'},
  {icon:'🌀',name:'精神錯亂',desc:'層數代表剩餘時間。持續期間每次繼續抽牌會隨機抽出 1～2 張，第一張爆牌時立即停止；每完成一次行動減少 1 層。'},
  {icon:'⚡',name:'麻痺',desc:'層數代表剩餘時間，沒有疊層上限。持續期間所有控制值消耗變為 2 倍；每完成一次行動減少 1 層。負面狀態抗性可降低獲得的層數。'},
  {icon:'🕳️',name:'深淵托拽',desc:'每個完整回合都會使深淵距離縮短；歸零時生命也會歸零。逃跑行動可依手牌點數拉開距離。'},
  {icon:'🔥',name:'狂信',desc:'每層提高攻擊力；成功施加異常或封鎖技能會增加，精準命中或擊倒眷屬可削減。'},
  {icon:'⚖️',name:'罪證',desc:'傷害審判長陣營、施加負面狀態、爆牌或擊殺護衛時累積；進入審判階段後會改變世人對你的評價並轉換為罪惡值。'},
  {icon:'📜',name:'罪惡值',desc:'直接提高異端審判長陣營的傷害，審判獲得更高加成。可透過贖罪降低，再犯則會以較低效率回升至本場上限。'},
];
const CONSUMABLE_TYPE_LIMIT=3;
const CONSUMABLE_STACK_LIMIT=3;
const NORMAL_CONSUMABLE_DROP_CHANCE=0.22;
const SQUIRREL_NEST_CONSUMABLE_DROP_CHANCE=0.50;
const SQUIRREL_CONSUMABLE_STEAL_CHANCE=0.35;
const CONSUMABLES=[
  {id:'healingPotion',icon:'🧪',name:'回血藥水',rarity:'common',cost:60,target:'self',desc:'戰鬥中回復 20 HP；受到腐敗與非吸血回復倍率影響。'},
  {id:'throwingKnife',icon:'🗡️',name:'飛刀',rarity:'common',cost:35,target:'enemy',desc:'對指定敵人造成 18 點樓高成長傷害。'},
  {id:'ironPlate',icon:'🛡️',name:'鐵板',rarity:'common',cost:40,target:'self',desc:'本回合直接獲得 20 點樓高成長防禦。'},
  {id:'bomb',icon:'💣',name:'炸彈',rarity:'uncommon',cost:70,target:'all',desc:'對所有敵人造成 24 點樓高成長傷害。'},
  {id:'molotov',icon:'🔥',name:'燃燒瓶',rarity:'uncommon',cost:65,target:'enemy',desc:'對指定敵人造成 15 點樓高成長傷害，並施加 4 層燒傷。'},
  {id:'poisonVial',icon:'☠️',name:'劇毒瓶',rarity:'uncommon',cost:65,target:'enemy',desc:'對指定敵人造成 10 點樓高成長傷害，並施加 8 層中毒與 1 層猛毒。'},
  {id:'demolition',icon:'💥',name:'毀滅炸藥',rarity:'legendary',cost:120,target:'all',desc:'對所有敵人造成 50 點樓高成長傷害，自己承受 15 點傷害。'},
  {id:'weakeningPowder',icon:'📉',name:'衰弱粉塵',rarity:'uncommon',cost:55,target:'enemy',desc:'對指定敵人施加 3 層虛弱，使其本回合攻擊每層降低 10%。'},
  {id:'armorPiercer',icon:'⛏️',name:'破甲錐',rarity:'uncommon',cost:60,target:'enemy',desc:'立即破壞指定敵人 50% 的現有護盾；破壞量不會溢出為生命傷害。'},
  {id:'bandage',icon:'🩹',name:'止血繃帶',rarity:'common',cost:45,target:'self',desc:'流血 −6、創傷 −1。'},
  {id:'detox',icon:'⚗️',name:'解毒劑',rarity:'common',cost:50,target:'self',desc:'中毒 −10、猛毒 −2。'},
  {id:'whetstone',icon:'🧴',name:'磨刀石',rarity:'uncommon',cost:60,target:'self',desc:'下一次攻擊的最終傷害 ×1.200。'},
  {id:'ironskin',icon:'🧪',name:'鐵膚藥',rarity:'uncommon',cost:60,target:'self',desc:'下一次選擇防禦時，最終獲得的防禦 ×1.250。'},
  {id:'stimulant',icon:'☕',name:'提神藥',rarity:'common',cost:55,target:'self',desc:'回復 6 控制值，不超過控制上限。'},
  {id:'smokeBomb',icon:'💨',name:'煙霧彈',rarity:'rare',cost:75,target:'self',desc:'退出一般野外戰鬥且不獲得獎勵；事件與 BOSS 戰無法使用。'},
];
const SUIT_SPELL_DEFS=Object.freeze({
  healingPotion:{type:'universal',tiers:[{heal:6},{heal:11},{heal:18}],encore:{heal:6},texts:['回復 6 HP','回復 11 HP','回復 18 HP']},
  throwingKnife:{type:'attack',tiers:[{damage:6},{damage:11},{damage:18}],encore:{damage:6},texts:['單體 6 樓高傷害','單體 11 樓高傷害','單體 18 樓高傷害']},
  ironPlate:{type:'defense',tiers:[{defense:6},{defense:11},{defense:18}],encore:{defense:6},texts:['防禦 +6（樓高）','防禦 +11（樓高）','防禦 +18（樓高）']},
  bomb:{type:'attack',tiers:[{damageAll:4},{damageAll:8},{damageAll:14}],encore:{damageAll:4},texts:['全體 4 樓高傷害','全體 8 樓高傷害','全體 14 樓高傷害']},
  molotov:{type:'attack',tiers:[{burn:1},{burn:2},{burn:4}],encore:{burn:1},texts:['燒傷 +1','燒傷 +2','燒傷 +4']},
  poisonVial:{type:'attack',tiers:[{poison:2},{poison:5},{poison:8,virulence:1}],encore:{poison:2},texts:['中毒 +2','中毒 +5','中毒 +8、猛毒 +1']},
  demolition:{type:'attack',tiers:[{damageAll:8,self:3},{damageAll:15,self:5},{damageAll:26,self:8}],encore:{damageAll:8,self:3},texts:['全體 8 樓高傷害、自傷 3','全體 15 樓高傷害、自傷 5','全體 26 樓高傷害、自傷 8']},
  weakeningPowder:{type:'attack',tiers:[{weakness:1},{weakness:2},{weakness:3}],encore:{weakness:1},texts:['虛弱 +1','虛弱 +2','虛弱 +3']},
  armorPiercer:{type:'attack',tiers:[{shieldDestroy:.15},{shieldDestroy:.30},{shieldDestroy:.50}],encore:{shieldDestroy:.15},texts:['攻擊前破壞 15% 現有護盾','攻擊前破壞 30% 現有護盾','攻擊前破壞 50% 現有護盾']},
  bandage:{type:'universal',tiers:[{bleed:2},{bleed:4,trauma:1},{bleed:8,trauma:2}],encore:{bleed:2},texts:['流血 −2','流血 −4、創傷 −1','流血 −8、創傷 −2']},
  detox:{type:'universal',tiers:[{poisonRemove:3},{poisonRemove:6,virulenceRemove:1},{poisonRemove:10,virulenceRemove:2}],encore:{poisonRemove:3},texts:['中毒 −3','中毒 −6、猛毒 −1','中毒 −10、猛毒 −2']},
  whetstone:{type:'attack',tiers:[{attackMult:1.05},{attackMult:1.10},{attackMult:1.18}],encore:{attackMult:1.05},texts:['主攻擊 ×1.05','主攻擊 ×1.10','主攻擊 ×1.18']},
  ironskin:{type:'defense',tiers:[{defenseMult:1.08},{defenseMult:1.15},{defenseMult:1.25}],encore:{defenseMult:1.08},texts:['主防禦 ×1.08','主防禦 ×1.15','主防禦 ×1.25']},
  stimulant:{type:'universal',tiers:[{control:1},{control:2},{control:3}],encore:{control:1},texts:['退還本戰已花的控制 1','退還本戰已花的控制 2','退還本戰已花的控制 3']},
  smokeBomb:{type:'defense',tiers:[{enemyMult:.95},{enemyMult:.90},{enemyMult:.82}],encore:{enemyMult:.95},texts:['本回合敵方攻擊 −5%','本回合敵方攻擊 −10%','本回合敵方攻擊 −18%']},
});
const SUIT_ENCHANT_EFFECTS=Object.fromEntries(Object.entries(SUIT_SPELL_DEFS).map(([id,def])=>[id,`第一階：${def.texts[0]}｜第二階：${def.texts[1]}｜第三階：${def.texts[2]}｜安可：${def.texts[0]}`]));
const SUIT_SPELL_ATTACK_ORDER=['armorPiercer','whetstone','throwingKnife','bomb','molotov','poisonVial','demolition','weakeningPowder'];
const SUIT_SPELL_DEFENSE_ORDER=['ironskin','smokeBomb','ironPlate'];
const SUIT_SPELL_UNIVERSAL_ORDER=['healingPotion','bandage','detox','stimulant'];
let G;
function defaultRunStats(){return {
  highestFloor:0,damageDealtTotal:0,highestDamage:{amount:0,target:''},damageTakenTotal:0,highestTaken:{amount:0,enemy:'',effect:''},damageTakenByEnemy:{},
  shieldTotal:0,highestShield:0,healingTotal:0,highestHealing:0,lifestealTotal:0,highestLifesteal:0,goldGained:0,
  enemiesDefeatedTotal:0,enemyKills:{},bossesDefeatedTotal:0,bossKills:{},eventsEncounteredTotal:0,eventCounts:{},
  turns:0,busts:0,actions:{attack:0,defense:0,escape:0,atonement:0},
};}
function normalizeRunStats(value){
  const base=defaultRunStats(),src=value&&typeof value==='object'?value:{};
  Object.keys(base).forEach(key=>{if(typeof base[key]==='number')base[key]=Math.max(0,Number(src[key])||0);});
  ['damageTakenByEnemy','enemyKills','bossKills','eventCounts'].forEach(key=>{if(src[key]&&typeof src[key]==='object'&&!Array.isArray(src[key]))base[key]=Object.fromEntries(Object.entries(src[key]).map(([name,count])=>[String(name),Math.max(0,Math.round(Number(count)||0))]).filter(([,count])=>count>0));});
  Object.keys(base.actions).forEach(key=>base.actions[key]=Math.max(0,Math.round(Number(src.actions&&src.actions[key])||0)));
  if(src.highestDamage&&typeof src.highestDamage==='object')base.highestDamage={amount:Math.max(0,Number(src.highestDamage.amount)||0),target:String(src.highestDamage.target||'')};
  if(src.highestTaken&&typeof src.highestTaken==='object')base.highestTaken={amount:Math.max(0,Number(src.highestTaken.amount)||0),enemy:String(src.highestTaken.enemy||''),effect:String(src.highestTaken.effect||'')};
  return base;
}
function runStats(){if(!G.stats)G.stats=defaultRunStats();return G.stats;}
function recordDamageDealt(amount,target=''){
  const value=Math.max(0,Math.round(amount||0));if(!value)return;const s=runStats();s.damageDealtTotal+=value;
  if(value>s.highestDamage.amount)s.highestDamage={amount:value,target:String(target||'')};
}
function recordDamageTaken(amount,enemy='其他',effect='傷害'){
  const value=Math.max(0,Math.round(amount||0));if(!value)return;const s=runStats();s.damageTakenTotal+=value;
  const key=String(enemy||'其他');s.damageTakenByEnemy[key]=(s.damageTakenByEnemy[key]||0)+value;
  if(value>s.highestTaken.amount)s.highestTaken={amount:value,enemy:key,effect:String(effect||'傷害')};
}
function enemyAttackEffect(e,explicit=''){
  if(!explicit&&e?.divePending)return eagleGrowth(G.floor).thunder?'雷霆俯衝':'俯衝反擊';
  const action=explicit||e?.inquisitorSync||e?.inquisitorAction||e?.courtAction||e?.cthulhuAction||e?.roninAction||e?.samuraiAction||e?.kunAction||e?.pengAction||e?.dragonAction||e?.bloodDemonAction||e?.paladinAction||e?.mimicAction||e?.werewolfAction||e?.robotAction||e?.cultistAction||e?.gargoyleAction||e?.ninjaAction||e?.skeletonAction||e?.cyclopsAction||e?.zombieAction||e?.batAction;
  const names={impact:'深海撞擊',oversea:'覆海',windblade:'風刃',flamefeather:'炎羽',riftclaw:'裂空爪',inferno:'焚天',breath:'龍息',normal:'普通攻擊',attack:'普通攻擊',slash:'斬擊',drain:'吸血',iaido:'居合',stab:'刺突',karatake:'唐竹',kesa:'袈裟斬',tsubame:'燕返',thousandBlades:'千太刀',lance:'騎槍突刺',trample:'戰馬踐踏',charge:'裁決衝鋒',sentenceSword:'斷罪劍',pyre:'火刑',judgment:'審判',holyCharge:'聖騎衝擊',holyJudgment:'裁決斬擊',disciplineClaw:'戒律石爪',punishmentClaw:'刑罰石爪',poisonPunishment:'毒刑',toxicWhip:'毒鞭',blackScripture:'黑經誦讀',blindSermon:'盲目佈道',sepsisRite:'敗血儀式',bloodDrain:'汲血',tentacleRend:'萬觸撕裂',abyssResonance:'深淵震鳴',starWhisper:'群星囈語',deepPressure:'深海威壓',pierce:'穿刺',fire:'火焰噴射',electric:'電弧放電',dark:'邪能打擊',sacrifice:'獻祭打擊',smash:'粉碎重擊',sunder:'破甲斬擊',bite:'撕咬',claw:'利爪',venomBite:'毒牙啃咬',rendingTongue:'撕裂長舌',boneCrush:'碎骨夾擊'};
  if(names[action])return names[action];if(action)return action;
  return e?.type==='dropbear'?'蓄力猛撲':e?.type==='skeleton'&&e.boneRage?'骨刃強襲':'普通攻擊';
}
function statusDamageSource(kind){const source=G.battle&&G.battle.statusSources&&G.battle.statusSources[kind];return source||{enemy:'未知來源',effect:kind==='poison'?'中毒':kind==='burn'?'燒傷':'流血'};}
function rememberPlayerStatusSource(kind,enemy,effect){if(!G.battle||!enemy)return;G.battle.statusSources=G.battle.statusSources||{};G.battle.statusSources[kind]={enemy:enemy.name||String(enemy),effect};}
function recordHealing(amount,lifesteal=false){
  const value=Math.max(0,Math.round(amount||0));if(!value)return;const s=runStats();
  if(lifesteal){s.lifestealTotal+=value;s.highestLifesteal=Math.max(s.highestLifesteal,value);}else{s.healingTotal+=value;s.highestHealing=Math.max(s.highestHealing,value);}
}
function recordShield(amount){const value=Math.max(0,Math.round(amount||0));if(!value)return;const s=runStats();s.shieldTotal+=value;s.highestShield=Math.max(s.highestShield,value);}
function gainGold(amount){const value=Math.max(0,Math.round(amount||0));if(!value)return 0;G.gold+=value;runStats().goldGained+=value;return value;}
function recordEnemyDefeat(enemy){
  if(!enemy||enemy._statsDefeated)return;enemy._statsDefeated=true;if(enemy._developerNoDefeatStat)return;const s=runStats(),name=enemy.name||enemy.type||'未知敵人';
  s.enemiesDefeatedTotal++;s.enemyKills[name]=(s.enemyKills[name]||0)+1;
  if(enemy.boss){s.bossesDefeatedTotal++;s.bossKills[name]=(s.bossKills[name]||0)+1;}
}
const EVENT_REPORT_NAMES={faithNecklaceIntro:'命運的拾遺',shop:'商店',rest:'休息事件',ordinaryChurch:'神教堂',darkChurch:'邪教堂',squirrelNest:'松鼠窩',ronin:'流浪武士',treasureChest:'神祕寶箱',bloodAltar:'鮮血祭壇'};
function recordEventEncounter(type){const name=EVENT_REPORT_NAMES[type];if(!name)return;const s=runStats();s.eventsEncounteredTotal++;s.eventCounts[name]=(s.eventCounts[name]||0)+1;}
function normalizeSeedCode(value){
  const normalized=String(value??'').normalize('NFKC').trim();
  return normalized||generateSeedCode();
}
function parseSeedInput(value){
  const raw=String(value??'').normalize('NFKC').trim();
  if(raw===DEVELOPER_SEED_KEY)return {developerMode:true,seedCode:generateSeedCode()};
  if(raw.startsWith(DEVELOPER_SEED_KEY)){
    const suffix=raw.slice(DEVELOPER_SEED_KEY.length);
    if(/^\s+/.test(suffix))return {developerMode:true,seedCode:normalizeSeedCode(suffix)};
  }
  return {developerMode:false,seedCode:normalizeSeedCode(raw)};
}
function generateSeedCode(){
  const words=new Uint32Array(3);crypto.getRandomValues(words);
  return `BJ-${[...words].map(n=>n.toString(36).toUpperCase().padStart(7,'0')).join('-')}`;
}
function seedStateFromCode(seedCode){
  const bytes=new TextEncoder().encode(normalizeSeedCode(seedCode));
  let hash=2166136261;
  for(const byte of bytes){hash^=byte;hash=Math.imul(hash,16777619)>>>0;}
  const state=[];let x=hash>>>0;
  for(let i=0;i<4;i++){
    x=(x+0x9e3779b9)>>>0;
    let z=x;z=Math.imul(z^(z>>>16),0x21f0aaad);z=Math.imul(z^(z>>>15),0x735a2d97);z=(z^(z>>>15))>>>0;
    state.push(z);
  }
  if(state.every(n=>n===0))state[0]=0x9e3779b9;
  return state;
}
function validRngState(value){return Array.isArray(value)&&value.length===4&&value.every(n=>Number.isInteger(n)&&n>=0&&n<=0xffffffff);}
function nextSeededRandom(state){
  const rotl=(x,k)=>((x<<k)|(x>>>(32-k)))>>>0;
  const result=Math.imul(rotl(Math.imul(state[1],5)>>>0,7),9)>>>0;
  const t=(state[1]<<9)>>>0;
  state[2]=(state[2]^state[0])>>>0;state[3]=(state[3]^state[1])>>>0;state[1]=(state[1]^state[2])>>>0;state[0]=(state[0]^state[3])>>>0;
  state[2]=(state[2]^t)>>>0;state[3]=rotl(state[3],11);
  return result/4294967296;
}
function gameRandom(){
  if(!G)throw new Error('種子亂數在遊戲建立前被呼叫');
  if(!validRngState(G.rngState))G.rngState=seedStateFromCode(G.seedCode);
  G.rngCalls=(G.rngCalls||0)+1;return nextSeededRandom(G.rngState);
}
function newGame(characterId=null,seedInput=null){
  const character=CHARACTERS.find(c=>c.id===characterId)||null;
  const seedConfig=parseSeedInput(seedInput),seedCode=seedConfig.seedCode;
  G={seedCode,developerMode:seedConfig.developerMode,rngState:seedStateFromCode(seedCode),rngCalls:0,stats:defaultRunStats(),hp:START_HP,maxhp:START_HP,gold:BALANCE.startGold,floor:0,poison:0,control:BALANCE.controlMax,eventChance:BASE_EVENT_CHANCE,shopChance:BASE_SHOP_CHANCE,altarSeen:false,churchSeen:false,faction:0,miracleAlignment:null,bloodDescendant:false,miracleReviveUsed:false,restCrab:false,beheadingPercent:0,luckyNumber:null,luckyAllIn:false,luckyPendingBounty:false,fortune:0,shopFortuneVisit:null,nodeType:null,nodeStarted:false,
    character:character&&character.id,passives:character?[...character.passives]:[],passivePaid:Object.fromEntries((character?[...character.passives]:[]).map(id=>[id,0])),passiveAffixes:{},sealedPassive:null,upgrades:[],blades:character&&character.id==='samurai'?['firststrike']:[],activeBlade:character&&character.id==='samurai'?'firststrike':null,preferredBlade:character&&character.id==='samurai'?'firststrike':null,suitMastery:null,suitEnchantments:{},suitEnchantStartupDone:character?.id!=='magician',suitEnchantRecoveryPending:false,suitDamage:Object.fromEntries(SUITS.map(s=>[s,100])),suitFlatDamage:Object.fromEntries(SUITS.map(s=>[s,0])),bountyHunt:null,consumables:{throwingKnife:1,ironPlate:1},deck:[],deckEdits:0,deckWorkshopChapter:0,deckWorkshopUses:0,collectorMaterials:[],collectorStartupDone:character?.id!=='warrior',maxHpPurchases:0,rankDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),100])),rankFlatDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),0])),legendaryShopChapter:null,battle:null};
  G.deck=buildDeck();
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
function createFloorCheckpoint(){
  return {
    seedCode:G.seedCode,developerMode:!!G.developerMode,rngState:[...(G.rngState||[])],rngCalls:G.rngCalls||0,
    stats:JSON.parse(JSON.stringify(runStats())),
    hp:G.hp,maxhp:G.maxhp,gold:G.gold,floor:G.floor,poison:0,control:G.control,eventChance:G.eventChance,shopChance:G.shopChance,altarSeen:!!G.altarSeen,churchSeen:!!G.churchSeen,faction:G.faction||0,miracleAlignment:G.miracleAlignment||null,bloodDescendant:!!G.bloodDescendant,miracleReviveUsed:!!G.miracleReviveUsed,restCrab:false,beheadingPercent:G.beheadingPercent||0,luckyNumber:validLuckyNumber(G.luckyNumber)?Number(G.luckyNumber):null,luckyAllIn:!!G.luckyAllIn,luckyPendingBounty:!!G.luckyPendingBounty,fortune:saveNumber(G.fortune,0,0,5),shopFortuneVisit:G.shopFortuneVisit?{key:String(G.shopFortuneVisit.key||''),entryGranted:!!G.shopFortuneVisit.entryGranted,discountPurchase:!!G.shopFortuneVisit.discountPurchase,spendGranted:!!G.shopFortuneVisit.spendGranted}:null,nodeType:null,nodeStarted:false,
    character:G.character,passives:[...G.passives],passivePaid:{...(G.passivePaid||{})},passiveAffixes:{...(G.passiveAffixes||{})},sealedPassive:G.sealedPassive||null,upgrades:[...G.upgrades],blades:[...(G.blades||[])],activeBlade:G.activeBlade||null,preferredBlade:G.preferredBlade||null,suitMastery:G.suitMastery,suitEnchantments:{...(G.suitEnchantments||{})},suitEnchantStartupDone:G.suitEnchantStartupDone===true,suitEnchantRecoveryPending:G.suitEnchantRecoveryPending===true,suitDamage:{...(G.suitDamage||{})},suitFlatDamage:{...(G.suitFlatDamage||{})},consumables:{...(G.consumables||{})},
    bountyHunt:G.bountyHunt?JSON.parse(JSON.stringify(G.bountyHunt)):null,
    deck:G.deck.map(c=>({r:c.r,s:c.s})),deckEdits:G.deckEdits||0,deckWorkshopChapter:Number.isInteger(G.deckWorkshopChapter)?G.deckWorkshopChapter:chapterIndex(G.floor),deckWorkshopUses:G.deckWorkshopUses||0,collectorMaterials:(G.collectorMaterials||[]).map(c=>({r:c.r,s:c.s})),collectorStartupDone:G.collectorStartupDone===true,maxHpPurchases:G.maxHpPurchases||0,rankDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),rankDamagePercent(r)])),rankFlatDamage:Object.fromEntries(CARD_RANKS.map(r=>[String(r),rankFlatBonus(r)])),legendaryShopChapter:Number.isInteger(G.legendaryShopChapter)?G.legendaryShopChapter:null,
  };
}
function captureFloorCheckpoint(){G._floorCheckpoint=createFloorCheckpoint();}
function currentSaveData(){
  if(!G._floorCheckpoint)captureFloorCheckpoint();
  const progress=JSON.parse(JSON.stringify(G._floorCheckpoint));
  return {format:SAVE_FORMAT,saveVersion:SAVE_VERSION,gameVersion:GAME_VERSION,savedAt:new Date().toISOString(),checkpoint:'floor-start',progress};
}
function downloadSave(){
  if(!G||!Array.isArray(G.deck))return;
  if(G.hp<=0||!$('screen-end').classList.contains('hidden')){setSaveStatus('死亡後無法建立存檔。',true);return;}
  const data=JSON.stringify(currentSaveData(),null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob);
  const a=document.createElement('a'),date=new Date().toISOString().slice(0,10);a.href=url;a.download=`blackjack-roguelike-floor-${G.floor}-${date}.json`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  setSaveStatus(`已下載第 ${G.floor} 層 JSON 存檔。`);
}
function restoreSave(raw){
  if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.format!==SAVE_FORMAT||raw.saveVersion!==SAVE_VERSION||!raw.progress||typeof raw.progress!=='object')throw new Error(`此版本為斷層更新，只接受 v${SAVE_VERSION} 存檔。`);
  const src=raw.progress;
  const warnings=[];
  const seedCode=normalizeSeedCode(src.seedCode);
  const rngState=validRngState(src.rngState)?src.rngState.map(n=>n>>>0):seedStateFromCode(seedCode);
  let rngCalls=saveNumber(src.rngCalls,0,0,1000000000000);
  const restoreRandom=()=>{rngCalls++;return nextSeededRandom(rngState);};
  if(!validRngState(src.rngState))warnings.push('存檔缺少亂數進度，已依種子重建');
  const characterId=src.character;
  let character=CHARACTERS.find(c=>c.id===characterId)||null;
  const savedPassivePaid=src.passivePaid&&typeof src.passivePaid==='object'?src.passivePaid:{};
  let passiveSource=src.passives;
  if(!Array.isArray(passiveSource))passiveSource=character?[...character.passives]:[];
  passiveSource=passiveSource.map(item=>typeof item==='string'?item:item&&item.id).filter(Boolean).map(id=>id==='facemult'?'court':id);
  const validPassives=new Set(ALL_PASSIVES.map(p=>p.id));
  let passives=[...new Set(passiveSource.filter(id=>validPassives.has(id)))];
  if(passives.length<passiveSource.length)warnings.push('已略過未知被動');
  if(passives.includes('antidote')&&passives.includes('howdidwegethere')){passives=passives.filter(id=>id!=='howdidwegethere');warnings.push('淨化與「我們是怎麼走到這一步的」互斥，已保留淨化');}
  if(!character)character=CHARACTERS.find(c=>c.passives.every(id=>passives.includes(id)))||null;
  let professionRefund=0;
  if(character&&character.id!=='warrior'&&passives.includes('collector')){
    professionRefund=saveNumber(savedPassivePaid.collector,0,0,1000000000000);
    warnings.push(`已移除非戰士持有的蒐集家並退還 ${professionRefund} 金幣`);
  }
  if(character){
    const professionCards=new Set(PROFESSION_PASSIVES_BY_CHARACTER[character.id]||[]),before=passives.join('|');
    passives=passives.filter(id=>!signatureProtected(id)||professionCards.has(id));
    professionCards.forEach(id=>{if(!passives.includes(id))passives.push(id);});
    if(passives.join('|')!==before)warnings.push('已依角色身分校正職業被動卡');
  }
  let upgradeSource=src.upgrades||[];
  if(!Array.isArray(upgradeSource))upgradeSource=[];
  upgradeSource=upgradeSource.map(item=>typeof item==='string'?item:item&&item.id).filter(Boolean).map(id=>id==='facemult'?'court':id);
  const upgrades=[...new Set(upgradeSource.filter(id=>(id==='doublebet2'&&passives.includes('doublebet'))||(validPassives.has(id)&&passives.includes(id))))];
  if(upgrades.length<upgradeSource.length)warnings.push('已略過無法對應的強化');
  const passivePaid=Object.fromEntries(passives.map(id=>[id,saveNumber(savedPassivePaid[id]??(id==='court'?savedPassivePaid.facemult:undefined),0,0,1000000000000)]));
  const validAffixes=new Set(PASSIVE_AFFIXES.map(a=>a.id)),savedPassiveAffixes=src.passiveAffixes&&typeof src.passiveAffixes==='object'?src.passiveAffixes:{};
  const passiveAffixes=Object.fromEntries(passives.map(id=>[id,savedPassiveAffixes[id]??(id==='court'?savedPassiveAffixes.facemult:undefined)]).filter(([,affix])=>validAffixes.has(affix)));
  const savedBladeIds=new Set((Array.isArray(src.blades)?src.blades:[]).filter(id=>BLADE_DEFS[id]));
  const sealedPassive=passives.includes(src.sealedPassive)&&src.sealedPassive!=='bloodpact'&&!signatureProtected(src.sealedPassive)&&!savedBladeIds.has(src.sealedPassive)&&passiveAffixes[src.sealedPassive]!=='ghost'?src.sealedPassive:null;
  const maxhp=saveNumber(src.maxhp,START_HP,1,1000000);
  const hp=saveNumber(src.hp,maxhp,1,maxhp);
  let floor=saveNumber(src.floor,1,0,100000);
  const rawDeck=src.deck;
  let deck=Array.isArray(rawDeck)?rawDeck.map(normalizeSavedCard).filter(Boolean):[];
  if(Array.isArray(rawDeck)&&deck.length<rawDeck.length)warnings.push('已移除無法辨識的牌');
  if(!deck.length){deck=buildDeck(restoreRandom);warnings.push('缺少有效牌庫，已補回標準牌組');}
  const currentDeckWorkshopChapter=chapterIndex(floor),savedDeckWorkshopChapter=saveNumber(src.deckWorkshopChapter,currentDeckWorkshopChapter,0,100000);
  const deckWorkshopChapter=savedDeckWorkshopChapter===currentDeckWorkshopChapter?savedDeckWorkshopChapter:currentDeckWorkshopChapter;
  const deckWorkshopUses=savedDeckWorkshopChapter===currentDeckWorkshopChapter?saveNumber(src.deckWorkshopUses,0,0,100000):0;
  const collectorMaterials=character?.id==='warrior'&&passives.includes('collector')&&Array.isArray(src.collectorMaterials)?src.collectorMaterials.map(normalizeSavedCard).filter(Boolean).slice(0,BALANCE.deckWorkshop.materialLimit):[];
  const collectorStartupDone=character?.id!=='warrior'||src.collectorStartupDone===true||floor>0;
  const mastery=SUIT_MASTERIES.some(m=>m.id===src.suitMastery)&&passives.includes('suitmage')?src.suitMastery:null;
  if(mastery&&!upgrades.includes('suitmage'))upgrades.push('suitmage');
  let bountyHunt=src.bountyHunt;
  if(!bountyHunt||!Array.isArray(bountyHunt.bonuses))bountyHunt=null;
  else bountyHunt={bonuses:bountyHunt.bonuses.map(n=>saveNumber(n,0,0,1000000)).filter(n=>n>0)};
  if(bountyHunt&&!bountyHunt.bonuses.length)bountyHunt=null;
  const maxHpPurchases=src.maxHpPurchases==null?Math.max(0,Math.floor((maxhp-START_HP)/20)):saveNumber(src.maxHpPurchases,0,0,100000);
  const savedRankDamage=src.rankDamage&&typeof src.rankDamage==='object'?src.rankDamage:{};
  const rankDamage=Object.fromEntries(CARD_RANKS.map(r=>[String(r),saveNumber(savedRankDamage[String(r)],100,100,1000000)]));
  const savedRankFlatDamage=src.rankFlatDamage&&typeof src.rankFlatDamage==='object'?src.rankFlatDamage:{};
  const rankFlatDamage=Object.fromEntries(CARD_RANKS.map(r=>[String(r),saveNumber(savedRankFlatDamage[String(r)],0,0,1000000)]));
  const validConsumables=new Set(CONSUMABLES.map(item=>item.id)),savedConsumables=src.consumables&&typeof src.consumables==='object'?src.consumables:{};
  const savedEnchantments=src.suitEnchantments&&typeof src.suitEnchantments==='object'?{...src.suitEnchantments}:{};
  const suitEnchantments=Object.fromEntries(SUITS.map(s=>[s,savedEnchantments[s]]).filter(([,id])=>validConsumables.has(id)));
  const suitEnchantStartupDone=character?.id!=='magician'||src.suitEnchantStartupDone===true||Object.keys(suitEnchantments).length>=2||floor>0;
  const installedSpellTypes=new Set(Object.values(suitEnchantments).map(id=>SUIT_SPELL_DEFS[id]?.type));
  const suitEnchantRecoveryPending=character?.id==='magician'&&(src.suitEnchantRecoveryPending===true||src.suitEnchantStartupDone==null&&(!installedSpellTypes.has('attack')||!installedSpellTypes.has('defense')));
  if(suitEnchantRecoveryPending)warnings.push('舊魔術師存檔缺少必要術式，將於下一間商店進行免費補裝');
  const savedSuitDamage=src.suitDamage&&typeof src.suitDamage==='object'?src.suitDamage:{};
  const suitDamage=Object.fromEntries(SUITS.map(s=>[s,saveNumber(savedSuitDamage[s],100,100,1000000)]));
  const savedSuitFlatDamage=src.suitFlatDamage&&typeof src.suitFlatDamage==='object'?src.suitFlatDamage:{};
  const suitFlatDamage=Object.fromEntries(SUITS.map(s=>[s,saveNumber(savedSuitFlatDamage[s],0,0,1000000)]));
  const savedConsumableLimit=CONSUMABLE_TYPE_LIMIT+(passives.includes('toolkit')?(upgrades.includes('toolkit')?4:2):0);
  const consumables=Object.fromEntries(Object.entries(savedConsumables).filter(([id])=>validConsumables.has(id)).map(([id,count])=>[id,saveNumber(count,0,0,CONSUMABLE_STACK_LIMIT)]).filter(([,count])=>count>0).slice(0,savedConsumableLimit));
  const legendaryShopChapter=Number.isInteger(src.legendaryShopChapter)?src.legendaryShopChapter:null;
  const blades=character&&character.id==='samurai'?[...new Set((Array.isArray(src.blades)?src.blades:['firststrike']).filter(id=>passives.includes(id)&&BLADE_DEFS[id]))].slice(0,4):[];
  if(character&&character.id==='samurai'&&!blades.length&&passives.includes('firststrike'))blades.push('firststrike');
  const activeBlade=blades.includes(src.activeBlade)?src.activeBlade:(blades[0]||null);
  const preferredBlade=blades.includes(src.preferredBlade)?src.preferredBlade:(blades[0]||null);
  const faction=saveNumber(src.faction,0,-1000000,1000000);
  const luckyNumber=passives.includes('doublebet')&&validLuckyNumber(src.luckyNumber)?Number(src.luckyNumber):null;
  const luckyAllIn=!!(luckyNumber&&upgrades.includes('doublebet2')&&src.luckyAllIn===true),luckyPendingBounty=!!(luckyNumber&&src.luckyPendingBounty===true);
  const fortune=passives.includes('luckycoin')?saveNumber(src.fortune,0,0,5):0;
  const savedShopFortune=src.shopFortuneVisit&&typeof src.shopFortuneVisit==='object'?src.shopFortuneVisit:null;
  const shopFortuneVisit=savedShopFortune&&passives.includes('luckycoin')?{key:String(savedShopFortune.key||''),entryGranted:savedShopFortune.entryGranted===true,discountPurchase:savedShopFortune.discountPurchase===true,spendGranted:savedShopFortune.spendGranted===true}:null;
  const savedMiracle=['holy','dark'].includes(src.miracleAlignment)?src.miracleAlignment:null;
  const miracleAlignment=savedMiracle||(faction>=1000?'holy':faction<=-1000?'dark':null);
  return {
    state:{seedCode,developerMode:src.developerMode===true,rngState,rngCalls,stats:normalizeRunStats(src.stats),hp,maxhp,gold:Math.min(1000000000000,saveNumber(src.gold,0,0,1000000000000)+professionRefund),floor,poison:0,control:saveNumber(src.control,BALANCE.controlMax,0,BALANCE.controlMax),
      eventChance:Math.min(1,Math.max(BASE_EVENT_CHANCE,Number(src.eventChance)||BASE_EVENT_CHANCE)),shopChance:Math.min(1,Math.max(BASE_SHOP_CHANCE,Number(src.shopChance)||BASE_SHOP_CHANCE)),altarSeen:src.altarSeen===true,churchSeen:src.churchSeen===true,faction,miracleAlignment,bloodDescendant:src.bloodDescendant===true,miracleReviveUsed:src.miracleReviveUsed===true,restCrab:src.restCrab===true,beheadingPercent:passives.includes('beheading')?saveNumber(src.beheadingPercent,5,5,20):0,luckyNumber,luckyAllIn,luckyPendingBounty,fortune,shopFortuneVisit,nodeType:['faithNecklaceIntro','battle','duckBattle','shop','rest','ordinaryChurch','darkChurch','ordinaryChurchBattle','darkChurchBattle','squirrelNest','squirrelNestBattle','ronin','roninBattle','treasureChest','treasureChestBattle','bloodAltar','bloodAltarDeclined','bloodInvitationAltar','bloodInvitationBoss','altarBattle','altarExam','bossBloodDemon','bossExam','altarReward','boss'].includes(src.nodeType)?src.nodeType:null,
      nodeStarted:src.nodeStarted===true,
      character:character&&character.id,passives,passivePaid,passiveAffixes,sealedPassive,upgrades,blades,activeBlade,preferredBlade,suitMastery:mastery,suitEnchantments,suitEnchantStartupDone,suitEnchantRecoveryPending,suitDamage,suitFlatDamage,bountyHunt,consumables,deck,deckEdits:saveNumber(src.deckEdits,0,0,100000),deckWorkshopChapter,deckWorkshopUses,collectorMaterials,collectorStartupDone,maxHpPurchases,rankDamage,rankFlatDamage,legendaryShopChapter,battle:null},
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
    if(activePassiveSlots()>currentPassiveLimit()&&!G.sealedPassive)openSealChoice();
    const note=restored.warnings.length?`｜${[...new Set(restored.warnings)].join('；')}`:'';
    setSaveStatus(`已載入第 ${G.floor} 層存檔${note}`);
    log(`💾 存檔載入成功：從第 ${G.floor} 格恢復目前節點。${note}`,'gd');
  }catch(error){
    setSaveStatus(`讀取失敗：${error.message}`,true);
    alert(`無法讀取存檔：${error.message}`);
  }finally{$('save-file').value='';}
}
function chooseSaveFile(){$('save-file').click();}
async function copySeedCode(){
  try{await navigator.clipboard.writeText(G.seedCode);setSaveStatus(`已複製種子碼：${G.seedCode}`);}
  catch(_error){setSaveStatus(`種子碼：${G.seedCode}`);}
}

function standardDeckCards(){const d=[];for(const s of SUITS)for(const r of CARD_RANKS)d.push({r,s,red:s==='♥'||s==='♦'});return d;}
function buildDeck(randomFn=gameRandom){
  const d=standardDeckCards();
  for(let i=d.length-1;i>0;i--){const j=Math.floor(randomFn()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
  return d;
}
function handTotal(hand,allowCourt=true){
  if(G&&G.developerMode&&G.battle&&hand===G.battle.hand&&Number.isFinite(G.battle.devPointOverride))return Math.max(0,Math.round(G.battle.devPointOverride));
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
const rnd=(a,b)=>a+Math.floor(gameRandom()*(b-a+1));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(gameRandom()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function cardPoints(c){if(c.r==='A')return 11;if(['J','Q','K'].includes(c.r))return 10;return c.r;}
function randomCard(){const ranks=[2,3,4,5,6,7,8,9,10,'J','Q','K','A'];const suits=['♠','♥','♦','♣'];const s=suits[rnd(0,3)];return {r:ranks[rnd(0,12)],s,red:(s==='♥'||s==='♦')};}
function battleDeck(){return G.deck.map(c=>({...c}));}
function bountyDeck(){return buildDeck();}
function shopMult(){return hasP('luckycoin')?(isUp('luckycoin')?0.85:0.90):1;}
const ownsFortuneBlade=()=>!!(G&&(G.blades||[]).includes('luckycoin')&&ownsP('luckycoin'));
function gainFortune(amount,reason=''){
  if(!ownsFortuneBlade())return 0;const before=Math.max(0,Math.min(5,G.fortune||0));G.fortune=Math.min(5,before+Math.max(0,Math.round(amount||0)));const gained=G.fortune-before;
  if(reason)log(`🍀 ${reason}：福緣 ${gained?`+${gained}`:'已達上限'}（${G.fortune}/5）。`,gained?'gd':'good');return gained;
}
function ensureShopFortuneVisit(){
  if(!ownsFortuneBlade())return null;const key=`shop:${G.floor}`;
  if(!G.shopFortuneVisit||G.shopFortuneVisit.key!==key)G.shopFortuneVisit={key,entryGranted:false,discountPurchase:false,spendGranted:false};
  return G.shopFortuneVisit;
}
function markLuckyDiscountPurchase(cost){
  const visit=ensureShopFortuneVisit();if(!visit||G.nodeType!=='shop'||Math.max(0,Number(cost)||0)<=0||shopMult()>=1)return false;visit.discountPurchase=true;return true;
}
function settleShopFortune(){
  const visit=ensureShopFortuneVisit();if(!visit||visit.spendGranted||!visit.discountPurchase)return 0;visit.spendGranted=true;return gainFortune(1,'消費之福');
}
function applyLuckyCoinShopEntry(){
  if(!hasP('luckycoin'))return {healed:0,fortune:0};const visit=ensureShopFortuneVisit();if(visit?.entryGranted)return {healed:0,fortune:0,duplicate:true};
  const result=healPlayer(isUp('luckycoin')?10:5);if(visit)visit.entryGranted=true;return {healed:result.healed,fortune:visit&&result.healed>=1?gainFortune(1,'入店之福'):0};
}
function shopFloorMultiplier(){
  const floor=G&&G.floor?G.floor:1;
  return Math.pow(floorReward(floor,false)/floorReward(1,false),BALANCE.shopGrowthPower);
}
function price(base){return Math.max(0,Math.round(base*shopFloorMultiplier()*shopMult()));}
function suitForgePrice(){return price(BALANCE.suitForgeBase);}
function maxHpPrice(){return Math.min(1000000000,price(Math.round(90*Math.pow(BALANCE.maxHpGrowth,G.maxHpPurchases||0))));}
function rankDamagePercent(rank){return Math.max(100,Math.round(G&&G.rankDamage&&G.rankDamage[String(rank)]||100));}
function rankFlatBonus(rank){return Math.max(0,Math.round(G&&G.rankFlatDamage&&G.rankFlatDamage[String(rank)]||0));}
function suitDamagePercent(suit){return Math.max(100,Math.round(G&&G.suitDamage&&G.suitDamage[suit]||100));}
function suitFlatBonus(suit){return Math.max(0,Math.round(G&&G.suitFlatDamage&&G.suitFlatDamage[suit]||0));}
function rankBoostPrice(){return price(55);}
function rankDamageBase(hand){
  if(!hand.length)return 0;
  const values=hand.map(c=>c.r==='A'?11:['J','Q','K'].includes(c.r)?10:c.r);
  let total=values.reduce((sum,n)=>sum+n,0),soft=hand.reduce((n,c)=>n+(c.r==='A'),0);
  while(total>21&&soft>0){const i=hand.findIndex((c,index)=>c.r==='A'&&values[index]===11);if(i<0)break;values[i]=1;total-=10;soft--;}
  const actual=handTotal(hand),scale=actual===21&&hasP('court')&&hasCourt(hand)&&total>0?21/total:1;
  return values.reduce((sum,value,i)=>sum+(value*rankDamagePercent(hand[i].r)/100+rankFlatBonus(hand[i].r))*suitDamagePercent(hand[i].s)/100+suitFlatBonus(hand[i].s),0)*scale;
}
function floorReward(floor,boss=false){const height=legacyHeight(floor);return Math.round((boss?100:60)+height*(boss?10:8));}
function deckPoints(){return G.deck.reduce((s,c)=>s+cardPoints(c),0);}
const suitOrder=s=>({'♠':0,'♥':1,'♦':2,'♣':3}[s]??9);
const suitName=s=>({'♠':'黑桃','♥':'紅心','♦':'方塊','♣':'梅花'}[s]||s);
function rawSuitCount(hand,suit){return hand.filter(c=>c.s===suit).length;}
function dominantSuit(deck=G&&G.deck){
  if(!Array.isArray(deck)||!deck.length)return null;
  const counts=SUITS.map(s=>[s,rawSuitCount(deck,s)]).sort((a,b)=>b[1]-a[1]||suitOrder(a[0])-suitOrder(b[0]));
  return counts[0][1]/deck.length>=0.4&&counts[0][1]>counts[1][1]?counts[0][0]:null;
}
function effectiveSuitCount(hand,suit){
  const raw=rawSuitCount(hand,suit),mastery=activeSuitMastery(),main=G.battle?.suitMainSuit??G.bounty?.suitMainSuit??dominantSuit();
  if(mastery==='mono'&&main)return main===suit?Math.min(4,raw+1):0;
  if(mastery==='alternating'&&fullyAlternating(hand))return Math.min(4,raw+1);
  if(mastery==='four_suits'&&hasFourSuits(hand)&&raw===1)return 2;
  return raw;
}
function hasFourSuits(hand){return SUITS.every(s=>rawSuitCount(hand,s)>0);}
function maxSameSuit(hand){return Math.max(...SUITS.map(s=>rawSuitCount(hand,s)),0);}
function alternationCount(hand){let n=0;for(let i=1;i<hand.length;i++)if(hand[i].red!==hand[i-1].red)n++;return n;}
function fullyAlternating(hand){return hand.length>=4&&alternationCount(hand)===hand.length-1;}
function monoHandActive(hand,deck=G&&G.deck){const main=dominantSuit(deck);return !!main&&rawSuitCount(hand,main)>hand.length/2;}
function masteryInfo(){return SUIT_MASTERIES.find(m=>m.id===G.suitMastery);}
function activeSuitMastery(){return skillIsLocked('suitmage')||!isUp('suitmage')?null:G.suitMastery;}
function spellTierForCount(count){return count>=4?3:count===3?2:count===2?1:0;}
function spellCompatible(type,action){return type==='universal'||type===action;}
function suitSpellPlan(action,hand,mainSuit=G.battle?.suitMainSuit??null){
  if(!hasP('suitmage')||!Array.isArray(hand)||handTotal(hand)>21||!['attack','defense'].includes(action))return [];
  const mastery=activeSuitMastery(),raw=Object.fromEntries(SUITS.map(s=>[s,rawSuitCount(hand,s)])),four=mastery==='four_suits'&&hasFourSuits(hand),alternating=mastery==='alternating'&&fullyAlternating(hand);
  const sources=[];
  SUITS.forEach(suit=>{
    const id=G.suitEnchantments&&G.suitEnchantments[suit],def=SUIT_SPELL_DEFS[id];if(!def||!spellCompatible(def.type,action))return;
    let count=raw[suit];if(mastery==='mono'&&mainSuit)count=mainSuit===suit?Math.min(4,count+1):0;else if(alternating)count=Math.min(4,count+1);else if(four&&count===1)count=2;
    const tier=spellTierForCount(count);if(tier)sources.push({id,suit,tier,rawCount:raw[suit],count});
  });
  const merged=[];
  sources.forEach(source=>{const found=merged.find(entry=>entry.id===source.id);if(found){found.tier=Math.min(3,Math.max(found.tier,source.tier)+1);found.sources.push(source);}else merged.push({...source,sources:[source]});});
  if(mastery==='flush'){
    const encoreSource=sources.find(source=>source.rawCount>=4&&source.tier===3);if(encoreSource){const entry=merged.find(item=>item.id===encoreSource.id);if(entry)entry.encore=true;}
  }
  return merged.sort((a,b)=>{
    const order=action==='attack'?[...SUIT_SPELL_ATTACK_ORDER,...SUIT_SPELL_UNIVERSAL_ORDER]:[...SUIT_SPELL_DEFENSE_ORDER,...SUIT_SPELL_UNIVERSAL_ORDER];return order.indexOf(a.id)-order.indexOf(b.id)||suitOrder(a.suit)-suitOrder(b.suit);
  });
}
function suitSpellPlanText(action,hand=G.battle?.hand||[]){
  const plan=suitSpellPlan(action,hand);return plan.length?plan.map(entry=>{const def=SUIT_SPELL_DEFS[entry.id];return `${entry.suit}${consumableInfo(entry.id)?.name||entry.id} ${['','Ⅰ','Ⅱ','Ⅲ'][entry.tier]}：${def.texts[entry.tier-1]}${entry.sources.length>1?`（${entry.sources.length} 個同名來源合併）`:''}${entry.encore?`＋安可「${def.texts[0]}」`:''}`;}).join('、'):'無可施放術式';
}
const sequenceRank=c=>c.r==='A'?1:c.r==='J'?11:c.r==='Q'?12:c.r==='K'?13:c.r;
function longestStraight(hand){
  const ranks=[...new Set(hand.map(sequenceRank))].sort((a,b)=>a-b);let best=0,run=0,prev=null;
  ranks.forEach(r=>{run=prev!=null&&r===prev+1?run+1:1;best=Math.max(best,run);prev=r;});return best;
}
function hasCourt(hand){return ['J','Q','K'].every(r=>hand.some(c=>c.r===r));}
function controlCostFor(id,upgraded){
  if(id==='redraw'||id==='peek')return upgraded?3:6;
  if(id==='cardsharp')return upgraded?2:3;
  if(id==='suitmage')return upgraded?2:3;
  return Infinity;
}
function paralysisActive(){return !!(G&&G.battle&&!G.battle.over&&(G.battle.paralysis||0)>0);}
function scaledControlCost(cost){return Math.max(0,Math.round(cost))*(paralysisActive()?2:1);}
function currentControlCost(id){return scaledControlCost(controlCostFor(id,isUp(id)));}
function lastStandActive(){if(!hasP('laststand'))return false;return G.hp/G.maxhp<=(isUp('laststand')?0.4:0.3);}
function bloodInvitationEligible(){return !G.bloodDescendant&&ownsP('vampire')&&G.upgrades.includes('vampire')&&ownsP('bloodpact')&&ownsP('laststand')&&G.upgrades.includes('laststand');}
function bloodDescendantActive(){return !!(G&&G.bloodDescendant);}
function descendantDamageMultiplier(){return 1+Math.max(0,G.battle&&G.battle.bloodDamageStacks||0)*0.05;}
function losePlayerHp(amount,source=null,track=true){
  const damage=Math.max(0,Math.round(amount||0));if(damage<=0)return 0;
  G.hp-=damage;if(track){const info=source||{enemy:'自身／環境',effect:'生命損失'};recordDamageTaken(damage,info.enemy,info.effect);}
  const b=G.battle;
  if(bloodDescendantActive()&&b&&!b.over){b.bloodDamageStacks=(b.bloodDamageStacks||0)+1;log(`🩸 血魔血性：本場傷害倍率提高至 ×${descendantDamageMultiplier().toFixed(2)}。`,'dmg');}
  return damage;
}
function clearPlayerCombatStatuses(){
  G.poison=0;const b=G.battle;if(!b||b.over)return;
  if((b.stolenUpgrades||[]).length)cultistRestoreUpgrade(null,'由神蹟歸還');
  const persistentCourtLocks=b.obsidianCourt&&!b.cthulhuPhase?[...(b.lockedSkills||[])]:[];b.lockedSkill=null;b.lockedSkills=persistentCourtLocks;
  const permanentBrand=b.cthulhuPhase?Math.max(0,b.disciplineBrand||0):0;
  Object.assign(b,{defense:0,focus:0,guardStreak:0,weakness:playerWeaknessFloor(),hesitation:0,buffSuppressed:0,corruption:0,sepsis:0,bleed:0,fracture:0,burn:0,burnTicks:0,burnRoundTicks:0,trauma:0,traumaFresh:false,traumaDecayTicks:0,virulence:0,virulenceTicks:0,blind:0,hallucination:0,mentalDisorder:0,paralysis:0,bloodDamageStacks:0,disciplineBrand:permanentBrand});
}
function tryHolyMiracleRevive(fromAbyss=false){
  if(G.hp>0||miracleType()!=='holy'||G.miracleReviveUsed)return false;
  const before=G.hp;G.miracleReviveUsed=true;G.hp=Math.max(1,Math.round(G.maxhp*0.30));recordHealing(G.hp-Math.max(0,before),false);clearPlayerCombatStatuses();SFX.win();
  if(fromAbyss&&G.battle&&G.battle.cthulhuPhase)G.battle.abyssDistance=5;
  if(G.battle&&!G.battle.over)log(`✨ 聖輝眷顧：從死亡中復甦，生命回復至 ${G.hp} HP；所有正面與負面狀態歸零！`,'gd');
  setSaveStatus('聖輝眷顧的唯一復活機會已消耗。');renderTop();return true;
}
function doublebetMasteryOwned(){return ownsP('doublebet')&&G.upgrades.includes('doublebet2');}
function doublebetMastered(){return doublebetMasteryOwned();}
const validLuckyNumber=value=>Number.isInteger(Number(value))&&Number(value)>=BALANCE.luckyNumber.min&&Number(value)<=BALANCE.luckyNumber.max;
function luckyNumberBand(number){return BALANCE.luckyNumber.bands.find(band=>number>=band.min&&number<=band.max)||null;}
function luckyHitType(total,number=G.luckyNumber){
  if(total>21)return 'bust';
  if(!validLuckyNumber(number))return 'unselected';
  if(total===Number(number))return 'exact';
  if(total>0&&total%Number(number)===0)return 'multiple';
  return 'miss';
}
const luckyHitLabel=type=>({exact:'精確命中',multiple:'倍數命中',miss:'未命中',bust:'爆牌',unselected:'尚未選號'}[type]||'未命中');
function luckyNumberProfile(total,context='battle',number=G.luckyNumber,allIn=G.luckyAllIn){
  const type=luckyHitType(total,number),band=luckyNumberBand(Number(number)),active=!!band&&hasP('doublebet')&&type!=='bust',suffix=type==='exact'?'Exact':type==='multiple'?'Multiple':null;
  let multiplier=1;
  if(active&&suffix){multiplier=band[`${context}${suffix}`]||1;if(isUp('doublebet'))multiplier+=BALANCE.luckyNumber.upgrade[`${context}${suffix}`]||0;if(allIn&&doublebetMastered())multiplier=1+(multiplier-1)*2;}
  return {number:validLuckyNumber(number)?Number(number):null,type,label:luckyHitLabel(type),multiplier:Number(multiplier.toFixed(6)),active:active&&!!suffix,allIn:!!allIn&&doublebetMastered()};
}
function gamblePenalty(total,busted=false){
  if(!busted||!hasP('doublebet')||!validLuckyNumber(G.luckyNumber))return 0;
  return Number(G.luckyNumber)*(G.luckyAllIn&&doublebetMastered()?2:1);
}
function applyGamblePenalty(total,busted=false){
  const battle=G.battle;if(busted&&battle?.luckyBustResolved)return false;if(busted&&battle)battle.luckyBustResolved=true;
  const penalty=gamblePenalty(total,busted);if(penalty<=0)return false;
  losePlayerHp(penalty,{enemy:'自身',effect:'幸運數字爆牌反噬'});log(`🎲 幸運數字 ${G.luckyNumber} 爆牌反噬${G.luckyAllIn&&doublebetMastered()?'（孤注一擲 ×2）':''}：−${penalty} HP`,'dmg');renderTop();
  if(G.hp<=0){if(tryHolyMiracleRevive())return false;gameOver();return true;}return false;
}
function playerThirstStacks(){return Math.max(0,Number(G.battle&&G.battle.thirst)||(hasP('bloodpact')?Math.ceil(5*statusGainMultiplier()):0));}
function thirstMultiplier(){return 1+playerThirstStacks()*0.1;}
function naturalHealingBlocked(){return hasP('bloodpact');}
function playerMaxHpGain(base){return Math.max(0,Math.round(Math.max(0,base||0)*(ownsP('bloodpact')&&!bloodDescendantActive()?0.5:1)));}
function bountyGambleProfile(total=G.bounty?handTotal(G.bounty.hand,false):0){return luckyNumberProfile(total,'bounty',G.bounty?.luckyNumber??G.luckyNumber,G.bounty?.luckyAllIn??G.luckyAllIn);}
function bountyGambleMultiplier(total){return bountyGambleProfile(total).multiplier;}
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
function show(s){
  for(const x of['character','magician-start','battle','bounty','shop','event','treasure-reward','upgrade','drop','end'])$('screen-'+x).classList.add('hidden');
  $('screen-'+s).classList.remove('hidden');
  $('topbar').classList.toggle('hidden',s==='character'||s==='magician-start');
  const saveButton=$('ui-save'),ended=s==='end';
  saveButton.disabled=ended;
  saveButton.classList.toggle('hidden',ended);
}
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
  log(`📿 信仰項鍊：世人對你的評價朝當前方向發展${ownsP('bloodpact')?'（鮮血契約使影響減弱）':''}。`,'good');return applied;
}
const activeInventoryPassives=()=>inventoryPassives().filter(id=>id!==G.sealedPassive||signatureProtected(id)||bladePassiveProtected(id));
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
const professionPassiveOwner=id=>Object.keys(PROFESSION_PASSIVES_BY_CHARACTER).find(characterId=>PROFESSION_PASSIVES_BY_CHARACTER[characterId].includes(id))||null;
const professionPassiveProtected=id=>PROFESSION_PASSIVES.has(id);
const signatureProtected=professionPassiveProtected;
const bladeDef=id=>BLADE_DEFS[id]||null;
const bladePassiveProtected=id=>playerIsSamurai()&&!!bladeDef(id)&&(G.blades||[]).includes(id);
const activeBladeDef=()=>playerIsSamurai()&&G.activeBlade&&(G.blades||[]).includes(G.activeBlade)&&ownsP(G.activeBlade)?bladeDef(G.activeBlade):null;
const hasActiveBlade=()=>!!activeBladeDef();
function removeBladeForPassive(id){
  if(!G||!(G.blades||[]).includes(id))return false;
  G.blades=G.blades.filter(bladeId=>bladeId!==id);
  if(G.activeBlade===id)G.activeBlade=G.blades.find(bladeId=>ownsP(bladeId))||null;
  if(G.preferredBlade===id)G.preferredBlade=G.blades.find(bladeId=>ownsP(bladeId))||null;
  if(G.battle&&playerIsSamurai()&&!G.activeBlade)G.battle.samuraiWeaponState=null;
  return true;
}
const factionSealProtected=id=>(id==='bloodpact'&&ownsP('bloodpact'))||bloodTrinityProtected(id);
const hostileSealProtected=id=>signatureProtected(id)||id==='faithneck'||factionSealProtected(id);
const skillLockProtected=id=>hostileSealProtected(id);
const bloodContractSuppresses=id=>id==='antidote'&&bloodDescendantActive()&&ownsP('bloodpact');
const bloodContractName=()=>bloodDescendantActive()?'血魔契約':'鮮血契約';
const lockedSkillIds=()=>{const b=G.battle;if(!b||b.over)return [];return [...new Set([b.lockedSkill,...(b.lockedSkills||[]).map(x=>typeof x==='string'?x:x.id)].filter(Boolean))];};
const lockedSkillId=()=>lockedSkillIds()[0]||null;
const skillIsLocked=id=>lockedSkillIds().includes(id)&&!skillLockProtected(id)&&!bladePassiveProtected(id);
const hasP=id=>ownsP(id)&&(G.sealedPassive!==id||signatureProtected(id)||bladePassiveProtected(id))&&!skillIsLocked(id)&&!bloodContractSuppresses(id);
const activeAffixCount=affixId=>G.passives.reduce((count,id)=>count+(hasP(id)&&passiveAffixId(id)===affixId?1:0),0);
const affixAttackFlat=()=>activeAffixCount('hidden_weapon')*2;
const affixDefenseFlat=()=>activeAffixCount('lining')*2;
const affixAttackMult=()=>1+activeAffixCount('sharp')*.01;
const affixDefenseMult=()=>1+activeAffixCount('guardian')*.01;
function affixBadge(affixId){const a=PASSIVE_AFFIXES.find(x=>x.id===affixId);return a?`<span class="rarity rarity-${a.rarity}" title="${a.desc}">${a.icon} ${a.name}</span>`:'';}
function passiveNameWithAffix(id,affixId=passiveAffixId(id)){
  const p=ALL_PASSIVES.find(x=>x.id===id),a=PASSIVE_AFFIXES.find(x=>x.id===affixId);
  const blade=bladePassiveProtected(id)?bladeDef(id):null,name=`${p?p.name:id}${blade?`（刀具：${blade.name}）`:''}`;
  return `${a?`${a.icon} ${a.name}・`:''}${name}`;
}
const PASSIVE_CONFLICTS={antidote:['howdidwegethere'],howdidwegethere:['antidote']};
const passiveConflictsWithOwned=id=>(PASSIVE_CONFLICTS[id]||[]).some(other=>G.passives.includes(other));
const upgradeStolen=id=>!!(G.battle&&!G.battle.over&&(G.battle.stolenUpgrades||[]).some(x=>x.id===id)&&!hostileSealProtected(id)&&!bladePassiveProtected(id));
const upgradesGloballySealed=id=>!!(G.battle&&!G.battle.over&&G.battle.obsidianCourt&&!G.battle.cthulhuPhase&&(G.battle.upgradeReprieve||0)<=0&&!hostileSealProtected(id)&&!bladePassiveProtected(id));
const isUp=id=>G.upgrades.includes(id)&&(bladePassiveProtected(id)||(!upgradeStolen(id)&&!upgradesGloballySealed(id)&&!skillIsLocked(id)&&!bloodContractSuppresses(id)));

function sealCandidates(){return inventoryPassives().filter(id=>!hostileSealProtected(id)&&!bladePassiveProtected(id)&&passiveAffixId(id)!=='ghost');}
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
    const p=ALL_PASSIVES.find(x=>x.id===id);const stolen=upgradeStolen(id),locked=skillIsLocked(id),sealed=G.sealedPassive===id&&!bladePassiveProtected(id),up=isUp(id);
    let txt=passiveDescription(p,up),stars=up?' ⭐':'';
    if(id==='beheading')txt=`成功攻擊後，若目標生命降至 ${G.beheadingPercent||5}% 以下，立即將其擊倒；只能透過再次擊敗流浪武士提高，最高 20%。`;
    if(id==='doublebet'&&validLuckyNumber(G.luckyNumber))txt+=`｜目前幸運數字：${G.luckyNumber}${G.luckyAllIn?'（孤注一擲）':''}${G.luckyPendingBounty?'，正等待沿用至賞金':''}`;
    const affix=passiveAffixInfo(id);if(affix)txt=`${affix.icon} ${affix.name}（${RARITY_INFO[affix.rarity].name}詞條）：${affix.desc}｜${txt}`;
    if(id==='doublebet'&&doublebetMastered()){txt+=`｜⭐⭐ 孤注一擲：${DOUBLEBET_MASTERY_DESC}`;stars=' ⭐⭐';}
    if(id==='suitmage'){const enchanted=SUITS.filter(s=>G.suitEnchantments&&G.suitEnchantments[s]).map(s=>{const item=consumableInfo(G.suitEnchantments[s]);return `${s}${suitName(s)}＝${item.icon}${item.name}（${SUIT_ENCHANT_EFFECTS[item.id]}）`;});if(enchanted.length)txt+=`｜目前附魔：${enchanted.join('；')}`;}
    if(stolen){txt=`🔒 強化暫時被邪教徒奪取｜${passiveDescription(p,false)}`;stars=' 🔒';}
    if(id==='suitmage'&&G.suitMastery&&up){const m=masteryInfo();txt+=`｜${m.icon} ${m.name}：${m.desc}`;stars=' ⭐';}
    if(id==='suitmage'&&G.suitMastery==='mono'&&up){const main=dominantSuit();txt+=main?`（目前主花色：${main}${suitName(main)}）`:'（目前沒有花色達到牌庫 40%）';}
    if(G.bloodDescendant&&id==='vampire'){txt='血魔強化：成功攻擊時，回復造成傷害的 50% HP。';stars=' 🩸';}
    if(G.bloodDescendant&&id==='laststand'){txt='血魔強化：HP 不高於 40% 時攻擊 ×1.8；成功攻擊會施加 1 層敗血。';stars=' 🩸';}
    if(G.bloodDescendant&&id==='bloodpact'){txt='血魔強化：未來最大生命增長恢復 100%，但過去損失不返還；無法防禦；每回合結束自損最大 HP 2%；每次扣血使本場傷害倍率 +5%；淨化失效。';stars=' 🩸';}
    if(bloodContractSuppresses(id)){txt='🔒 被血魔契約壓制：本技能及其強化效果完全失效。';stars=' 🔒';}
    if(bloodTrinityProtected(id))txt=`🩸 血之三契：不可封印，強化不可被奪取。｜${txt}`;
    else if(id==='bloodpact')txt=`🩸 契約烙印：不可封印。｜${txt}`;
    if(locked){txt=`🔒 被石像鬼暫時封鎖｜${txt}`;stars=' 🔒';}
    if(sealed){txt=`📦 裝備已封存：不占用啟用欄位，效果暫停，但仍可在商店出售。｜${txt}`;stars=' 📦';}
    const displayName=id==='bloodpact'?bloodContractName():p.name;
    return `<div class="pcard-chip" title="${txt}"><div class="pn">${p.icon} ${affix?`${affix.icon} ${affix.name}・`:''}${displayName}${stars}</div><div class="pd">${txt}</div></div>`;
  }).join('')+(miracle==='holy'?`<div class="pcard-chip"><div class="pn">✨ 聖輝眷顧</div><div class="pd">30% 異常抗性；非吸血類回復量 ×2；致死時以 30% 最大生命復活一次並清除所有暫時狀態（${G.miracleReviveUsed?'本局已使用':'本局可用'}）。不占裝備欄。</div></div>`:miracle==='dark'?'<div class="pcard-chip"><div class="pn">🌑 深淵餽贈</div><div class="pd">一般裝備欄 +1。不占裝備欄。</div></div>':miracleBlocked()?'<div class="pcard-chip"><div class="pn">🩸 神蹟排斥</div><div class="pd">血魔無法獲得教堂神蹟。</div></div>':'');
}

function renderTop(){
  $('ui-hp').textContent=Math.max(0,G.hp);$('ui-maxhp').textContent=G.maxhp;
  $('ui-gold').textContent=G.gold;$('ui-control').textContent=G.control;$('ui-floor').textContent=G.floor;
  const seedChars=[...(G.seedCode||'')],seedLabel=seedChars.length>14?`${seedChars.slice(0,6).join('')}…${seedChars.slice(-5).join('')}`:seedChars.join('');
  $('ui-seed').textContent=`${G.developerMode?'🛠️':'🌱'} ${seedLabel}`;$('ui-seed').classList.toggle('developer-seed',!!G.developerMode);$('ui-seed').title=`${G.developerMode?'開發人員模式｜':''}種子：${G.seedCode}\n已使用 ${G.rngCalls||0} 次亂數；${G.developerMode?'點擊開啟控制台':'點擊複製'}`;
  $('ui-blades').classList.toggle('hidden',!playerIsSamurai());
  if(G.floor===0){$('ui-map').innerHTML='<span class="node cur">第 0 層｜📿 命運的拾遺</span>';renderPassives();return;}
  const pos=chapterPosition(G.floor),chapter=chapterIndex(G.floor)+1;
  if(isBossFloor(G.floor))$('ui-map').innerHTML=`<span class="node cur">第 ${chapter} 大關｜${isUltimateBossFloor(G.floor)?'☯ 終極魔王':'👑 魔王'}</span>`;
  else if(isRestFloor(G.floor))$('ui-map').innerHTML=`<span class="node cur">第 ${chapter} 大關｜🔥 休息</span>`;
  else $('ui-map').innerHTML=`<span class="node">第 ${chapter} 大關 ${pos}/${CHAPTER_LENGTH}｜事件 ${Math.round((G.eventChance||BASE_EVENT_CHANCE)*100)}%｜商店權重 ${Math.round((G.shopChance||BASE_SHOP_CHANCE)*100)}</span>`;
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
const playerIsSamurai=()=>G&&G.character==='samurai';
const samuraiDefenseActionsAvailable=()=>playerIsSamurai()&&G.battle&&(!hasActiveBlade()||G.battle.samuraiWeaponState==='drawn');
const SAMURAI_BULWARK_DESC='武士專屬：殘心的持續時間由3個完整回合延長為4個完整回合，並在期間逐步衰減。下一次見切未形成新殘心或爆牌時，殘心仍會立即結束。';
const SAMURAI_BULWARK_DESC_UP='武士專屬強化：殘心的持續時間延長為5個完整回合，並在期間逐步衰減。下一次見切未形成新殘心或爆牌時，殘心仍會立即結束。';
const SAMURAI_BUCKLER_DESC='武士專屬：選擇架勢或見切時，圓盾提供8點防禦等價；實際擋傷後基礎轉為4心流。每場戰鬥可使用4次；敵方沒有攻擊時仍消耗耐久，但不取得心流。';
const SAMURAI_BUCKLER_DESC_UP='武士專屬強化：選擇架勢或見切時，圓盾提供10點防禦等價；實際擋傷後基礎轉為5心流，且不消耗耐久。';
const SAMURAI_HEARTGUARD_DESC='武士專屬：選擇架勢或見切時，護心鏡提供相當於手牌點數30%的防禦等價；實際擋傷後按50%轉為心流，不直接提高架勢或見切的百分比減傷。心流收益仍受架勢15／見切35的總上限限制。';
const SAMURAI_HEARTGUARD_DESC_UP='武士專屬強化：選擇架勢或見切時，護心鏡提供相當於手牌點數50%的防禦等價；實際擋傷後按50%轉為心流，不直接提高架勢或見切的百分比減傷。心流收益仍受架勢15／見切35的總上限限制。';
const SAMURAI_STRAIGHT_DESC='武士專屬：手牌含至少3張連續牌面時，攻擊仍+18；架勢或見切另取得18點防禦等價，實際擋傷後基礎轉為9心流。心流收益仍受架勢15／見切35的總上限限制。A視為1，Q-K-A不成立。';
const SAMURAI_STRAIGHT_DESC_UP='武士專屬強化：三連號攻擊+24並提供24點防禦等價，基礎轉為12心流；四張以上連號攻擊+40並提供40點防禦等價，基礎轉為20心流。實際收益仍受架勢15／見切35的總上限限制。';
function passiveDescription(p,upgraded=false){
  if(p?.id==='bulwark'&&playerIsSamurai())return upgraded?SAMURAI_BULWARK_DESC_UP:SAMURAI_BULWARK_DESC;
  if(p?.id==='buckler'&&playerIsSamurai())return upgraded?SAMURAI_BUCKLER_DESC_UP:SAMURAI_BUCKLER_DESC;
  if(p?.id==='heartguard'&&playerIsSamurai())return upgraded?SAMURAI_HEARTGUARD_DESC_UP:SAMURAI_HEARTGUARD_DESC;
  if(p?.id==='straight'&&playerIsSamurai())return upgraded?SAMURAI_STRAIGHT_DESC_UP:SAMURAI_STRAIGHT_DESC;
  return upgraded&&p?.descUp?p.descUp:p?.desc||'';
}
const playerZanshinDuration=()=>playerIsSamurai()&&hasP('bulwark')?(isUp('bulwark')?5:4):3;
const persistentDefenseActive=()=>hasP('bulwark')&&!playerIsSamurai();
const bulwarkCounterattackActive=()=>persistentDefenseActive()&&isUp('bulwark');
function samuraiMikiriRate(total){
  if(total>21)return 0;
  if(total===21)return 1;
  if(total===20)return .9;
  if(total>=17)return .8;
  if(total>=13)return .6;
  return total>=2?.35:0;
}
function samuraiStanceRate(total){
  if(total>21)return 0;
  if(total===21)return .55;
  if(total===20)return .5;
  if(total>=17)return .45;
  if(total>=13)return .35;
  return total>=2?.25:0;
}
function samuraiAdjustedGuardRate(baseRate){
  const b=G.battle;if(!b)return 0;
  let rate=baseRate*fractureMultiplier(b)*(b.blind>0?.8:1);
  if(lastStandActive()&&!isUp('laststand'))rate*=.8;
  return Math.max(0,Math.min(1,rate));
}
function samuraiActionThreatWeight(e){
  if(!e)return 1;
  if(e.type==='dragon'&&e.dragonAction==='breath')return 2;
  if(e.type==='dropbear')return 2.3;
  if(e.type==='cyclops'&&e.cyclopsAction==='smash')return 1.8;
  if(e.type==='kun'&&e.kunAction==='oversea')return 3.5;
  if(e.type==='peng')return {riftclaw:1.8,inferno:2.5}[e.pengAction]||1;
  if(e.type==='samurai')return {iaido:1.4,tsubame:1.6}[e.samuraiAction]||1;
  if(e.type==='ronin')return {iaido:1.4,tsubame:1.3,thousandBlades:2.5}[e.roninAction]||1;
  if(e.type==='robot'&&e.robotAction==='electric')return 1.4;
  if(e.type==='skeleton'&&e.boneRage)return 1.35;
  if(e.type==='paladin')return {sunder:1.2,judgment:1.5}[e.paladinAction]||1;
  if(e.type==='inquisitorMounted')return {lance:1.2,trample:1.4,charge:2.5}[e.inquisitorAction]||1;
  if(e.type==='inquisitor')return {sentenceSword:1.3,pyre:1.2,judgment:1.8}[e.inquisitorAction]||1;
  return 1;
}
function addSamuraiFlow(amount,reason){
  const b=G.battle;if(!playerIsSamurai()||!b)return 0;
  const before=b.samuraiFlow||0;b.samuraiFlow=Math.min(BALANCE.samuraiFlowCap,Math.max(0,before+amount));
  const gained=b.samuraiFlow-before;if(gained>0)log(`🌊 ${reason}：心流 +${roundHalfEven(gained)}（${roundHalfEven(b.samuraiFlow)}/${BALANCE.samuraiFlowCap}）。`,'good');
  return gained;
}
function playerZanshinProfile(){
  const b=G.battle;if(!playerIsSamurai()||!b||(b.samuraiZanshinTurns||0)<=0)return null;
  const duration=Math.max(1,b.samuraiZanshinDuration||3),ratio=Math.max(0,Math.min(1,b.samuraiZanshinTurns/duration));
  return {attack:1+(b.samuraiZanshinAttack||0)*ratio,reduction:(b.samuraiZanshinReduction||0)*ratio,turns:b.samuraiZanshinTurns,duration,strong:(b.samuraiZanshinAttack||0)>=.35};
}
function clearPlayerZanshin(reason=''){
  const b=G.battle;if(!b)return;
  const active=(b.samuraiZanshinTurns||0)>0;b.samuraiZanshinAttack=0;b.samuraiZanshinReduction=0;b.samuraiZanshinTurns=0;b.samuraiZanshinDuration=0;b.samuraiZanshinFresh=false;b.samuraiZanshinRefreshed=false;b.samuraiZanshinGuardUsed=false;b.samuraiZanshinPreserved=false;
  if(active&&reason)log(`🧘 殘心消散：${reason}。`,'dmg');
}
function grantPlayerZanshin(strong=false){
  const b=G.battle;if(!b)return false;
  const attack=strong?.35:.25,reduction=strong?.20:.15,duration=playerZanshinDuration();
  if((b.samuraiZanshinAttack||0)>attack)return false;
  b.samuraiZanshinAttack=attack;b.samuraiZanshinReduction=reduction;b.samuraiZanshinTurns=duration;b.samuraiZanshinDuration=duration;b.samuraiZanshinFresh=true;b.samuraiZanshinRefreshed=true;b.samuraiZanshinGuardUsed=false;b.samuraiZanshinPreserved=false;
  log(`🧘 ${strong?'強殘心':'殘心'}形成：攻擊 +${Math.round(attack*100)}%、承受攻擊 −${Math.round(reduction*100)}%，將於 ${duration} 個完整回合內逐步衰減。`,'gd');return true;
}
function settlePlayerZanshin(actionMode){
  const b=G.battle;if(!b)return;
  if(actionMode==='mikiri'&&!b.samuraiZanshinRefreshed){clearPlayerZanshin('本次見切未形成新的殘心');return;}
  if(!(b.samuraiZanshinTurns>0))return;
  if(b.samuraiZanshinFresh)b.samuraiZanshinFresh=false;
  else if(b.samuraiZanshinPreserved){b.samuraiZanshinPreserved=false;log(`🏯 守心：本回合保留 ${b.samuraiZanshinTurns}/${b.samuraiZanshinDuration} 回合殘心。`,'gd');}
  else if(--b.samuraiZanshinTurns<=0)clearPlayerZanshin();
}
const immovableBladeActive=()=>G.activeBlade==='bulwark'&&hasActiveBlade();
function immovableIaidoMultiplier(zanshin=playerZanshinProfile()){return 1.10+Math.max(0,zanshin?.turns||0)*.05;}
function immovableResonanceGain(zanshin=playerZanshinProfile(),flow=G.battle?.samuraiFlow||0){return immovableBladeActive()&&zanshin?zanshin.turns+(flow>=50?2:0):0;}
function immovableUltimateMultiplier(zanshin=playerZanshinProfile()){return zanshin?1.50+zanshin.turns*.10:1.50;}
function immovableGuardReady(actionBlocked=0){
  const b=G.battle;return !!(b&&immovableBladeActive()&&playerZanshinProfile()&&(b.samuraiFlow||0)>=25&&!b.samuraiZanshinGuardUsed&&actionBlocked>=1);
}
function preserveImmovableZanshin(actionBlocked){
  const b=G.battle;if(!immovableGuardReady(actionBlocked))return false;
  b.samuraiZanshinGuardUsed=true;b.samuraiZanshinPreserved=true;return true;
}
function immovableUnfallenReady(total,actionBlocked){
  const b=G.battle,zanshin=playerZanshinProfile();return !!(b&&immovableBladeActive()&&total===20&&actionBlocked>=1&&(b.samuraiFlow||0)>=75&&zanshin?.strong);
}
const moonBladeActive=()=>G.activeBlade==='buckler'&&hasActiveBlade();
const mirrorBladeActive=()=>G.activeBlade==='antidote'&&hasActiveBlade();
const heartBladeActive=()=>G.activeBlade==='heartguard'&&hasActiveBlade();
const myriadBladeActive=()=>G.activeBlade==='howdidwegethere'&&hasActiveBlade();
const poisonBladeActive=()=>G.activeBlade==='toxicology'&&hasActiveBlade();
function playerPurifiableStatusValue(key){return Math.max(0,key==='poison'?G.poison||0:G.battle?.[key]||0);}
function playerPurifiableStatuses(){return PURIFIABLE_STATUS_DEFS.filter(status=>playerPurifiableStatusValue(status.key)>0);}
function mirrorUnblemishedActive(flow=G.battle?.samuraiFlow||0){return mirrorBladeActive()&&flow>=50&&playerPurifiableStatuses().length===0;}
function mirrorUltimateMultiplier(){return 1.75+Math.min(6,playerPurifiableStatuses().length)*.10;}
function playerPhaseStatusValue(key){
  if(key==='weakness')return currentWeaknessStacks();
  if(key==='thirst')return playerThirstStacks();
  return playerPurifiableStatusValue(key);
}
function playerPhaseStatuses(){return PHASE_STATUS_DEFS.filter(status=>playerPhaseStatusValue(status.key)>0);}
function myriadPhaseMultiplier(flow=G.battle?.samuraiFlow||0){return 1+Math.min(flow>=25?8:6,playerPhaseStatuses().length)*.05;}
function myriadUltimateMultiplier(){return 1.50+Math.min(8,playerPhaseStatuses().length)*.10;}
function phaseStatusCap(key){return {corruption:3,sepsis:5,bleed:BLEED_CAP,fracture:3,burn:BURN_CAP,blind:3,weakness:9,hesitation:5,hallucination:5,mentalDisorder:5}[key]??Infinity;}
function setPlayerPhaseStatus(key,value){
  const b=G.battle;if(!b)return;
  if(key==='poison')G.poison=Math.max(0,value||0);
  else b[key]=Math.max(0,value||0);
}
function amplifyMyriadStatuses(){
  const b=G.battle;if(!b||!myriadBladeActive())return [];
  const increased=[];PHASE_STATUS_DEFS.forEach(status=>{const before=playerPhaseStatusValue(status.key),cap=phaseStatusCap(status.key);if(before<=0||before>=cap)return;setPlayerPhaseStatus(status.key,Math.min(cap,before+1));const after=playerPhaseStatusValue(status.key);if(after>before)increased.push({...status,before,after});});
  const flow=Math.min(12,increased.length*2);if(flow>0)addSamuraiFlow(flow,'萬象妖刀・增相');
  log(increased.length?`🌀 增相：${increased.map(status=>status.name).join('、')}各增加 1；心流 +${flow}。`:'🌀 增相：目前沒有可增加的既有狀態。',increased.length?'gd':'good');return increased;
}
function myriadAffinityAmount(key=G.battle?.samuraiAffinityStatus,flow=G.battle?.samuraiFlow||0,iaido=G.battle?.samuraiWeaponState==='sheathed'){
  const stacks=REFLECTABLE_STATUS_KEYS.has(key)?playerPhaseStatusValue(key):0,shared=flow>=75&&iaido&&playerPhaseStatuses().length>=4,cap=shared?10:5,rate=shared?1:.5;
  return {key,stacks,shared,raw:stacks>0?Math.min(cap,Math.ceil(stacks*rate)):0,cap,rate};
}
function settleMyriadAffinity(dealt,target,flowAtSubmit,iaido=false,ultimate=false){
  const b=G.battle;if(!b||!myriadBladeActive())return [];
  if(ultimate){const copied=[];[...REFLECTABLE_STATUS_KEYS].forEach(key=>{const stacks=playerPhaseStatusValue(key),raw=Math.min(5,Math.ceil(stacks*.5)),applied=raw?applyReflectedStatus(target,key,raw):0;if(applied>0)copied.push({key,raw,applied});});if(copied.length)log(`🌀 萬象歸一：向${target.name}複製 ${copied.map(item=>`${PURIFIABLE_STATUS_DEFS.find(status=>status.key===item.key)?.name||item.key} ${item.applied}`).join('、')}。`,'gd');return copied;}
  if(dealt<=0)return [];
  if(flowAtSubmit<50)return [];
  const profile=myriadAffinityAmount(b.samuraiAffinityStatus,flowAtSubmit,iaido);if(profile.raw<=0)return [];
  const applied=applyReflectedStatus(target,profile.key,profile.raw),name=PURIFIABLE_STATUS_DEFS.find(status=>status.key===profile.key)?.name||profile.key;
  if(applied>0)log(`🌀 ${profile.shared?'共相':'同病'}：${target.name}獲得 ${applied} 層${name}${applied<profile.raw?'（受抗性降低）':''}。`,'gd');return applied?[{key:profile.key,raw:profile.raw,applied}]:[];
}
function enemyPoisonTickDamage(target,layers=target?.poison||0,virulence=target?.virulence||0,trauma=target?.trauma||0){
  if(!target||layers<=0)return 0;
  let damage=Math.round(layers*(1+Math.max(0,trauma))*(1+Math.max(0,virulence)*.1));
  if(INQUISITOR_LEADERS.includes(target.type))damage=Math.max(1,Math.round(damage*.7));
  return Math.max(0,damage);
}
function poisonTemperFlowGain(poison,flowAtSubmit=G.battle?.samuraiFlow||0){return Math.min(flowAtSubmit>=25?10:5,roundHalfEven(Math.max(0,poison)*(flowAtSubmit>=25?1:.5),0));}
function poisonDrawSnapshot(target=currentTarget(),flow=G.battle?.samuraiFlow||0,ultimate=false){
  const poison=Math.max(0,target?.poison||0),base=Math.min(ultimate?30:flow>=50?15:10,poison),multiplier=ultimate?3:flow>=50?2.5:2,remove=ultimate?base:flow>=75?Math.ceil(base/2):base;
  const tick=enemyPoisonTickDamage(target,base,target?.virulence||0,target?.trauma||0);
  return {target,targetType:target?.type||null,poison,virulence:Math.max(0,target?.virulence||0),trauma:Math.max(0,target?.trauma||0),base,remove,multiplier,tick,damage:Math.round(tick*multiplier),ultimate,flow};
}
function poisonDrawTargetStillValid(snapshot){return !!(snapshot?.target&&G.battle?.enemies?.includes(snapshot.target)&&snapshot.target.curhp>0&&!snapshot.target.downed&&snapshot.target.type===snapshot.targetType&&!snapshot.target.justTransformed);}
function settlePoisonBurst(snapshot,directDamage=0,newPoison=0){
  if(!snapshot?.base||!poisonDrawTargetStillValid(snapshot)||(!snapshot.ultimate&&directDamage<=0))return {triggered:false,damage:0,removed:0,transformed:false};
  const target=snapshot.target,oldPoisonRemaining=Math.max(0,(target.poison||0)-Math.max(0,newPoison)),removed=Math.min(snapshot.remove,oldPoisonRemaining);
  if(removed<=0)return {triggered:false,damage:0,removed:0,transformed:false};
  target.poison=Math.max(0,(target.poison||0)-removed);const damage=snapshot.damage;
  target.curhp-=damage;recordDamageDealt(damage,`${target.name}（${snapshot.ultimate?'百毒穿心':'毒拔'}）`);SFX.poison();
  log(`🐍 ${snapshot.ultimate?'百毒穿心':'毒拔'}引爆：以 ${snapshot.base} 層中毒按正常發作 ${snapshot.tick} ×${snapshot.multiplier.toFixed(1)}，額外 −${damage} HP；移除 ${removed} 層，中毒剩餘 ${target.poison}。`,'gd');floatNum(target.idx,`-${damage}`,'#8ee063');
  if(target.curhp<=0)defeatEnemyByStatus(target,snapshot.ultimate?'百毒穿心':'毒拔');const transformed=target.type!==snapshot.targetType;renderEnemies();return {triggered:true,damage,removed,transformed};
}
function grantPoisonTemperFlow(poison,flowAtSubmit,ultimate=false){
  if(!poisonBladeActive()||ultimate||poison<=0)return 0;const flow=poisonTemperFlowGain(poison,flowAtSubmit);if(flow>0)addSamuraiFlow(flow,`蠱毒脇差・${flowAtSubmit>=25?'毒脈':'淬毒'}`);return flow;
}
function clearMoonCounter(reason=''){
  const b=G.battle;if(!b)return false;
  const active=!!b.samuraiMoonCounter;b.samuraiMoonCounter=false;
  if(active&&reason)log(`🌙 盾返消散：${reason}。`,'dmg');
  return active;
}
function grantMoonCounter(actionBlocked=0){
  const b=G.battle;if(!b||!moonBladeActive()||!b.samuraiBucklerParticipated||actionBlocked<1)return false;
  b.samuraiMoonCounter=true;return true;
}
function moonCounterMultiplier(iaido=false,flow=G.battle?.samuraiFlow||0,ultimate=false){
  if(ultimate)return 2;
  if(!G.battle?.samuraiMoonCounter)return iaido?1.15:1;
  if(iaido&&flow>=50)return 1.35;
  return (iaido?1.15:1)*(flow>=50?1.25:1.15);
}
function repairMoonBuckler(){
  const b=G.battle;if(!b||isUp('buckler')||(b.bucklerUses||0)<=0)return false;
  b.bucklerUses=Math.max(0,b.bucklerUses-1);b.bucklerBroken=false;
  log(`🌙 缺月復圓：恢復 1 次圓盾耐久（${BALANCE.bucklerUses-b.bucklerUses}/${BALANCE.bucklerUses}）。`,'gd');return true;
}
function settleMoonCounterAttack(dealt,flowAtSubmit=G.battle?.samuraiFlow||0){
  const b=G.battle;if(!b||!b.samuraiMoonCounter||dealt<=0)return false;
  clearMoonCounter();log('🌙 盾返命中並消耗。','good');
  if(flowAtSubmit>=75&&!isUp('buckler'))repairMoonBuckler();
  return true;
}
function samuraiDefenseFlowBonus(hand,consume=false){
  const b=G.battle;if(!playerIsSamurai()||!b)return {flow:0,heartguardEquivalent:0,heartguardFlow:0,heartguardRate:.5,heartguardMinimumApplied:false,otherEquivalent:0,bucklerBroke:false,bucklerUsed:false,bucklerFlow:0,moonFlow:false};
  const total=handTotal(hand);let baseline=Math.floor(total*.65);
  if(lastStandActive()&&!isUp('laststand'))baseline=Math.floor(baseline*.8);
  if(b.blind>0)baseline=Math.floor(baseline*.8);
  const defenseEquivalent=Math.max(0,computeDefense(hand)-baseline),heartguardEquivalent=Math.min(defenseEquivalent,heartguardDefenseEquivalent(hand)),otherEquivalent=Math.max(0,defenseEquivalent-heartguardEquivalent),buckler=consume?useBuckler():{def:bucklerDefense(),broke:false};
  const moonFlow=moonBladeActive()&&(b.samuraiFlow||0)>=25,bucklerRate=moonFlow?.75:.5;
  const heartRate=heartBladeActive()?1:.5,iron=b.ironskin||1,heartguardNormalFlow=roundHalfEven(heartguardEquivalent*heartRate*iron,0),minimum=heartBladeActive()&&(b.samuraiFlow||0)>=25?4:0,heartguardFlow=Math.max(minimum,heartguardNormalFlow),minimumBonus=Math.max(0,heartguardFlow-heartguardNormalFlow);
  const flow=roundHalfEven((otherEquivalent*.5+heartguardEquivalent*heartRate+buckler.def*bucklerRate)*iron,0)+minimumBonus;
  return {flow:Math.max(0,flow),heartguardEquivalent,heartguardFlow,heartguardRate:heartRate,heartguardMinimumApplied:minimumBonus>0,otherEquivalent,bucklerBroke:buckler.broke,bucklerUsed:buckler.def>0,bucklerFlow:roundHalfEven(buckler.def*bucklerRate,0),moonFlow};
}
function samuraiGuardFlowReward(mode,equipment,mikiriFlow=0,total=handTotal(G.battle?.hand||[]),submitFlow=G.battle?.samuraiDefenseSubmitFlow??G.battle?.samuraiFlow??0){
  const cap=mode==='mikiri'?35:15,base=mode==='mikiri'?mikiriFlow:0,clear=heartBladeActive()&&submitFlow>=75&&(total===20||total===21)?4:0;
  return {cap,base,equipment:Math.max(0,equipment?.flow||0),clear,total:roundHalfEven(Math.min(cap,base+Math.max(0,equipment?.flow||0)+clear),0)};
}
function settleHeartBladeNoHarm(attackCount,actionBlocked,hpDamage){
  const b=G.battle;if(!b?.samuraiHeartBladeSubmitted||b.samuraiDefenseSubmitFlow<50||attackCount<1||actionBlocked<1||hpDamage>0||!['stance','mikiri'].includes(b.samuraiGuardMode))return 0;
  const cap=b.samuraiGuardMode==='mikiri'?35:15,remaining=Math.max(0,cap-(b.samuraiDefenseFlowAwarded||0)),gain=Math.min(3,remaining);if(gain>0)addSamuraiFlow(gain,'鏡心打刀・無傷');return gain;
}
function samuraiAttackFlow(total,iaido=false,firstStrike=false){
  if(!G.battle||total>21)return 0;
  return (iaido?7:4)+(total===21?4:total===20?2:0)+(iaido&&firstStrike?5:0);
}
function samuraiIaidoMultiplier(){
  const b=G.battle;
  if(G.activeBlade==='bulwark')return immovableIaidoMultiplier();
  if(G.activeBlade==='buckler')return 1.15;
  if(G.activeBlade==='safe21')return 1.15;
  if(G.activeBlade==='court')return 1.2+Math.min(3,b?.samuraiCourtSeals||0)*.15;
  if(G.activeBlade==='insurance')return 1.2;
  if(G.activeBlade==='peek')return 1.15;
  if(G.activeBlade==='vampire')return 1.15;
  if(G.activeBlade==='antidote')return mirrorUnblemishedActive()?1.30:1.15;
  if(G.activeBlade==='heartguard')return 1.15;
  if(G.activeBlade==='howdidwegethere')return 1.15;
  if(G.activeBlade==='toxicology')return 1.15;
  if(G.activeBlade==='dragonneck')return dragonIaidoMultiplier(b?.hand?.length||0);
  if(G.activeBlade==='luckycoin')return fortuneAttackProfile(handTotal(b?.hand||[]),b?.samuraiFlow||0,true,false).multiplier;
  if(G.activeBlade==='rubyring')return 1.15;
  return (isUp('firststrike')?1.5:1.35)+((b?.samuraiFlow||0)>=50?.15:0);
}
function dragonBladeActive(){return G.activeBlade==='dragonneck'&&hasActiveBlade();}
function dragonIaidoMultiplier(cardCount){return cardCount>=5?1.30:cardCount===4?1.20:cardCount===3?1.15:1.10;}
function dragonWalkGain(cardCount,fiveDragonTriggered=false,dealt=1,ultimate=false){
  if(!dragonBladeActive()||ultimate||dealt<=0||cardCount<3)return 0;
  return Math.min(10,(cardCount>=5?6:cardCount===4?4:2)+(fiveDragonTriggered?4:0));
}
function dragonBreathGain(healed,submitFlow,ultimate=false){return dragonBladeActive()&&!ultimate&&submitFlow>=25?Math.min(8,Math.floor(Math.max(0,healed||0)/10)):0;}
function dragonFiveHealAmount(total){return 50+(isUp('dragonneck')?Math.round(total*.2):0);}
function dragonFiveHealPreview(total){
  if(!G.battle)return {raw:0,adjusted:0,healed:0,flow:0};
  const raw=dragonFiveHealAmount(total),mult=Math.max(.4,1-Math.max(0,G.battle.corruption||0)*.2)*(miracleType()==='holy'?2:1),adjusted=Math.max(0,Math.round(raw*mult)),healed=Math.min(Math.max(0,G.maxhp-G.hp),adjusted);
  return {raw,adjusted,healed,flow:dragonBreathGain(healed,G.battle.samuraiFlow||0,false)};
}
const fortuneBladeActive=()=>G.activeBlade==='luckycoin'&&hasActiveBlade();
function fortuneAttackProfile(total=handTotal(G.battle?.hand||[]),flow=G.battle?.samuraiFlow||0,iaido=G.battle?.samuraiWeaponState==='sheathed',ultimate=false){
  const stacks=Math.max(0,Math.min(5,G.fortune||0)),prepared=fortuneBladeActive()&&!ultimate&&stacks>0&&total<=21,minor=prepared&&flow>=25&&total>=17&&total<=21,great=prepared&&flow>=75&&total===21;
  return {stacks,prepared,minor,great,flowGain:prepared?(minor?9:6):0,multiplier:ultimate?1.60+Math.min(5,stacks)*.10:prepared&&flow>=50?(iaido?1.25:1.10):iaido?1.15:1};
}
function fortuneUltimateHealPreview(stacks=Math.min(5,G.fortune||0)){
  const raw=Math.max(0,Math.min(5,stacks))*10,mult=G.battle?Math.max(.4,1-Math.max(0,G.battle.corruption||0)*.2)*(miracleType()==='holy'?2:1):1,adjusted=Math.max(0,Math.round(raw*mult));
  return {raw,adjusted,healed:Math.min(Math.max(0,G.maxhp-G.hp),adjusted)};
}
function settleFortuneAttack(profile,dealt){
  if(!profile?.prepared||dealt<=0)return {triggered:false,spent:0,flow:0};const spent=profile.great?0:1;if(spent)G.fortune=Math.max(0,(G.fortune||0)-spent);
  const flow=addSamuraiFlow(profile.flowGain,`招福脇差・${profile.great?'大吉':profile.minor?'小吉':'開運'}`);log(`🍀 ${profile.great?'大吉：21 點命中，福緣不消耗':`開運命中：消耗 1 層福緣（剩餘 ${G.fortune}/5）`}。`,'gd');return {triggered:true,spent,flow};
}
function settleFortuneUltimate(spend){
  const used=Math.min(5,Math.max(0,Math.min(G.fortune||0,Math.round(spend||0))));G.fortune=Math.max(0,(G.fortune||0)-used);const healing=combatHeal(used*10);
  log(`🍀 一擲萬福消耗 ${used} 層福緣（剩餘 ${G.fortune}/5），以 ${used*10} 基礎治療回復 ${healing.healed} HP${healing.mult<1?'（腐敗後）':''}。`,'gd');return {used,healing};
}
const rubyBladeActive=()=>G.activeBlade==='rubyring'&&hasActiveBlade();
function rubyBladeAttackProfile(total=handTotal(G.battle?.hand||[]),flow=G.battle?.samuraiFlow||0,hpSnapshot=G.hp,iaido=G.battle?.samuraiWeaponState==='sheathed',ultimate=false){
  const hp=Math.max(0,Math.floor(Number(hpSnapshot)||0)),valid=rubyBladeActive()&&total<=21,flawless=valid&&!ultimate&&flow>=75&&(total===20||total===21),rate=ultimate?.5:flawless?.15:flow>=50?.10:.05,fixed=valid?Math.floor(hp*rate):0,bloodReflection=valid&&!ultimate&&flow>=25?Math.min(6,Math.max(1,Math.floor(hp/25))):0;
  return {hp,total,flow,valid,ultimate,iaido,flawless,rate,fixed,bloodReflection,multiplier:ultimate?1.75:iaido?1.15:1,shieldPierce:ultimate?.5:flawless?.3:0,label:ultimate?'紅玉':flawless?'無瑕':flow>=50?'盛華':'紅光'};
}
function applyRubyPostMultiplierDamage(profile,ruby){
  if(!profile||!ruby?.valid||ruby.fixed<=0)return profile;
  profile.rubyProfile=ruby;profile.rubyFlat=ruby.fixed;profile.notes=[...(profile.notes||[]),`💎${ruby.label}+${ruby.fixed}（提交 HP ${ruby.hp}）`];
  if(profile.rapid){profile.rapid.postMultiplierFlat=(profile.rapid.postMultiplierFlat||0)+ruby.fixed;profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0)+(profile.rapid.iaidoFollowBonus||0)+(profile.rapid.postMultiplierFlat||0);}
  else profile.dmg=Math.max(0,profile.dmg+ruby.fixed);
  return profile;
}
function settleRubyBloodReflection(profile,dealt){
  if(!profile?.bloodReflection||dealt<=0)return 0;return addSamuraiFlow(profile.bloodReflection,`緋晶打刀・血映（提交 HP ${profile.hp}）`);
}
function settleRubyUltimate(){const healing=combatHeal(15);log(`💎 緋晶打刀・紅玉：以 15 基礎治療回復 ${healing.healed} HP${healing.mult<1?'（腐敗後）':''}。`,'gd');return healing;}
function clearDragonSheath(){if(G.battle)G.battle.samuraiDragonSheath=false;}
function selectDragonSheath(enabled){
  const b=G.battle;if(!b||!dragonBladeActive()||b.over||b.busy||b.dealReady===false||b.pendingBust||handTotal(b.hand)>21||(b.samuraiFlow||0)<75||b.hand.length<5)return false;
  b.samuraiDragonSheath=!!enabled;renderDragonSheathControls();updateOutgoing();return true;
}
function renderDragonSheathControls(){
  const b=G.battle,el=$('battle-dragon-sheath-picker');if(!el)return;
  const eligible=!!(b&&dragonBladeActive()&&!b.over&&!b.pendingBust&&(b.samuraiFlow||0)>=75&&b.hand.length>=5&&handTotal(b.hand)<=21),visible=!!(b&&dragonBladeActive()&&!b.over&&!b.pendingBust);
  el.classList.toggle('hidden',!visible);if(!visible){el.innerHTML='';return;}if(b.samuraiDragonSheath&&!eligible)b.samuraiDragonSheath=false;
  const selected=!!b.samuraiDragonSheath&&eligible;
  el.innerHTML=`<div class="blood-wager-title">🐉 五龍大太刀・乘龍歸鞘</div><div class="muted">${eligible?'若本次普通攻擊確實觸發五龍，所有傷害、治療、心流與命中效果結算後免費納刀；不觸發主動收刀刀技。':'需要提交時已有 75 心流、至少 5 張牌且未爆牌。'} 納刀後必須再次居合拔刀，才能使用架勢或見切。</div><div class="btns"><button class="${selected?'b-ghost':'b-magic'}" data-dragon-sheath="normal"${b.busy||b.dealReady===false?' disabled':''}>正常出刀</button><button class="${selected?'b-magic':'b-ghost'}" data-dragon-sheath="return"${eligible&&!b.busy&&b.dealReady!==false?'':' disabled'}>乘龍歸鞘</button></div>`;
  el.querySelector('[data-dragon-sheath="normal"]')?.addEventListener('click',()=>selectDragonSheath(false));el.querySelector('[data-dragon-sheath="return"]')?.addEventListener('click',()=>selectDragonSheath(true));
}
function advanceCourtSequence(hand){
  const b=G.battle;if(!b||G.activeBlade!=='court')return false;
  const expected=b.samuraiCourtExpected||'J';if(!hand.some(c=>c.r===expected))return false;
  if(expected==='K'){b.samuraiCourtSeals=Math.min(3,(b.samuraiCourtSeals||0)+1);b.samuraiCourtExpected='J';log(`👑 朝儀完成：獲得 1 枚三公印（${b.samuraiCourtSeals}/3），下一張等待 J。`,'gd');}
  else{b.samuraiCourtExpected=expected==='J'?'Q':'K';log(`👑 朝儀推進：${expected} 已就位，下一張等待 ${b.samuraiCourtExpected}。`,'good');}
  addSamuraiFlow((b.samuraiFlow||0)>=25?8:6,'三公太刀朝儀');return true;
}
function fateUltimateCards(){
  const b=G.battle;if(!b||G.activeBlade!=='peek')return [];
  return (b.samuraiFatePreview||[]).filter((card,index,list)=>b.deck.includes(card)&&list.indexOf(card)===index);
}
function closeFatePicker(){
  const el=$('battle-fate-picker');if(el){el.classList.add('hidden');el.innerHTML='';}
  if(G.battle){G.battle.samuraiFatePickerMode=null;G.battle.samuraiFateSwapHand=null;G.battle.samuraiFateSwapFuture=null;}
}
function fateCardHtml(card){const shown=shownCard(card);return `<div class="fate-card${shown.red?' red':''}">${cardLabel(shown)}${shown.s}</div>`;}
function chooseFateCard(card,mode){
  const b=G.battle,index=b&&b.deck.indexOf(card);if(!b||index<0||b.samuraiFateUsed||G.activeBlade!=='peek')return;
  const wasNext=index===b.deck.length-1;
  b.deck.splice(index,1);b.samuraiFateUsed=true;b.samuraiFateGuided=null;b.samuraiFateGuideDrawn=false;b.samuraiFateSevered=null;
  if(mode==='guide'){
    b.deck.push(card);b.samuraiFateGuided=card;
    log(`👁️ 天機脇差・引牌：選定 ${cardLabel(shownCard(card))}${shownCard(card).s} 為下一張天機。`,'good');
  }else{
    const wouldBust=wasNext&&handTotal([...b.hand,card])>21;b.deck.unshift(card);b.samuraiFateSevered={card,wouldBust};
    log(`✂️ 天機脇差・斬離：${cardLabel(shownCard(card))}${shownCard(card).s} 已移至本場牌堆底部。`,'good');
  }
  closeFatePicker();$('deck-count').textContent=b.deck.length;syncButtons();renderTop();
}
function skipFateCut(){if(G.battle)G.battle.samuraiFateUsed=true;closeFatePicker();syncButtons();}
function renderFatePicker(){
  const b=G.battle,el=$('battle-fate-picker');if(!b||!el)return;
  if(b.samuraiFatePickerMode==='ultimate'){
    const future=fateUltimateCards(),handSelected=Number.isInteger(b.samuraiFateSwapHand)?b.samuraiFateSwapHand:null,chosen=b.samuraiFateSwapFuture;
    const visibleHand=b.hand.map((card,index)=>index===handSelected&&chosen?shownCard(chosen):shownCard(card)),shownTotal=handSelected!==null&&chosen?handTotal(visibleHand):null;
    el.innerHTML=`<div class="fate-picker-title">⚡ 斬斷因果：選擇一張手牌與一張預覽牌交換</div><div class="muted">手牌</div><div class="fate-picker-cards">${b.hand.map((card,index)=>`<button class="fate-choice${handSelected===index?' selected':''}" data-fate-hand="${index}">${fateCardHtml(card)}</button>`).join('')}</div><div class="muted" style="margin-top:8px">預覽牌</div><div class="fate-picker-cards">${future.map((card,index)=>`<button class="fate-choice${chosen===card?' selected':''}" data-fate-future="${index}">${fateCardHtml(card)}</button>`).join('')}</div><div class="fate-picker-summary">${shownTotal===null?'各選一張後確認。':`你看見的交換後點數：${shownTotal}`}</div><div class="btns"><button class="b-magic" id="fate-ultimate-confirm"${handSelected===null||!chosen?' disabled':''}>確認並發動必殺</button><button class="b-ghost" id="fate-picker-cancel">取消</button></div>`;
    el.querySelectorAll('[data-fate-hand]').forEach(button=>button.onclick=()=>{b.samuraiFateSwapHand=+button.dataset.fateHand;renderFatePicker();});
    el.querySelectorAll('[data-fate-future]').forEach(button=>button.onclick=()=>{b.samuraiFateSwapFuture=future[+button.dataset.fateFuture];renderFatePicker();});
    $('fate-ultimate-confirm').onclick=confirmFateUltimate;$('fate-picker-cancel').onclick=closeFatePicker;el.classList.remove('hidden');return;
  }
  const cards=(b.samuraiFatePreview||[]).filter(card=>b.deck.includes(card));
  el.innerHTML=`<div class="fate-picker-title">👁️ 天機脇差：選擇一張未來牌</div><div class="fate-picker-cards">${cards.map((card,index)=>`<div class="fate-choice">${fateCardHtml(card)}<div class="btns"><button class="b-magic" data-fate-guide="${index}">引牌</button><button class="b-ghost" data-fate-sever="${index}">斬離</button></div></div>`).join('')}</div><div class="btns"><button class="b-ghost" id="fate-picker-cancel">只查看</button></div>`;
  el.querySelectorAll('[data-fate-guide]').forEach(button=>button.onclick=()=>chooseFateCard(cards[+button.dataset.fateGuide],'guide'));
  el.querySelectorAll('[data-fate-sever]').forEach(button=>button.onclick=()=>chooseFateCard(cards[+button.dataset.fateSever],'sever'));
  $('fate-picker-cancel').onclick=skipFateCut;el.classList.remove('hidden');
}
function openFateUltimatePicker(){
  const b=G.battle;if(!b||!samuraiUltimateInfo()?.ready)return;
  b.samuraiFatePickerMode='ultimate';b.samuraiFateSwapHand=null;b.samuraiFateSwapFuture=null;renderFatePicker();
}
function confirmFateUltimate(){
  const b=G.battle,handIndex=b?.samuraiFateSwapHand,future=b?.samuraiFateSwapFuture,deckIndex=b&&b.deck.indexOf(future);
  if(!b||!Number.isInteger(handIndex)||!b.hand[handIndex]||deckIndex<0)return;
  const handCard=b.hand[handIndex];b.hand[handIndex]=future;b.deck[deckIndex]=handCard;b.pendingBust=false;b.samuraiFateGuided=null;b.samuraiFateGuideDrawn=false;b.samuraiFateSevered=null;
  closeFatePicker();renderHand();updateHandUI();
  if(handTotal(b.hand)>21){
    log('⚡ 斬斷因果失敗：真正牌面仍然爆牌！','dmg');b.samuraiUltimate=null;resolveBust();b.samuraiFlow=0;b.samuraiWeaponState='sheathed';log('🗡️ 必殺失敗，心流歸零並收刀。','dmg');return;
  }
  b.samuraiUltimate='peek';attack();
}
function bloodWagerCost(percent){return Math.max(1,Math.round(G.maxhp*Math.max(0,percent)/100));}
function bloodWagerRaiseCap(flow){return flow>=75?3:flow>=50?2:flow>=25?1:0;}
function clearBloodWager(){
  const b=G.battle;if(!b)return;
  b.samuraiBloodWager=0;b.samuraiBloodBasePercent=0;b.samuraiBloodReward=0;b.samuraiBloodRaises=0;b.samuraiBloodRaiseCap=0;b.samuraiBloodUltimate=false;
}
function forfeitBloodWager(reason,resetStreak=true){
  const b=G.battle;if(!b)return false;
  const hadWager=(b.samuraiBloodWager||0)>0,hadStreak=(b.samuraiBloodStreak||0)>0;
  if(hadWager||resetStreak&&hadStreak)log(`🩸 ${reason}：${hadWager?'本次血籌作廢':''}${hadWager&&resetStreak&&hadStreak?'，':''}${resetStreak&&hadStreak?'連莊歸零':''}。`,'dmg');
  clearBloodWager();if(resetStreak)b.samuraiBloodStreak=0;return hadWager||hadStreak;
}
function placeBloodWager(percent){
  const b=G.battle,blade=activeBladeDef(),cost=bloodWagerCost(percent),rewards={5:8,10:16,15:25};
  if(!b||blade?.id!=='vampire'||b.over||b.busy||b.pendingBust||b.blind>0||b.dealReady===false||(b.samuraiBloodWager||0)>0||!rewards[percent]||G.hp<=cost)return;
  losePlayerHp(cost,{enemy:'自身／血博腰刀',effect:`${percent}% 血籌`});b.samuraiBloodWager=cost;b.samuraiBloodBasePercent=percent;b.samuraiBloodReward=rewards[percent];b.samuraiBloodRaises=0;b.samuraiBloodRaiseCap=bloodWagerRaiseCap(b.samuraiFlow||0);
  log(`🩸 血博：支付 ${cost} HP，押下 ${percent}% 血籌；本次最多可加注 ${b.samuraiBloodRaiseCap} 次。`,'dmg');renderTop();syncButtons();updateOutgoing();
}
function raiseBloodWager(){
  const b=G.battle,cost=bloodWagerCost(5);
  if(!b||(b.samuraiBloodWager||0)<=0||(b.samuraiBloodRaises||0)>=(b.samuraiBloodRaiseCap||0)||(b.samuraiFlow||0)<25||G.hp<=cost)return;
  b.samuraiFlow-=25;losePlayerHp(cost,{enemy:'自身／血博腰刀',effect:'加注'});b.samuraiBloodWager+=cost;b.samuraiBloodRaises++;
  log(`🩸 加注 ${b.samuraiBloodRaises}/${b.samuraiBloodRaiseCap}：再支付 ${cost} HP 與 25 心流；本次傷害 +30%、吸血效率 +20%。`,'dmg');renderTop();syncButtons();updateOutgoing();
}
function resolveBloodWager(dealt,healed,ultimate=false){
  const b=G.battle,wager=Math.max(0,b&&b.samuraiBloodWager||0);if(!b||!wager)return;
  const full=healed>=wager,ratio=Math.min(1,healed/wager),reward=ratio>=.5?Math.round((b.samuraiBloodReward||0)*ratio):0,large=(b.samuraiBloodBasePercent||0)>=15||(b.samuraiBloodRaises||0)>0;
  if(!ultimate){if(reward>0)addSamuraiFlow(reward,`血博回收 ${healed}/${wager} HP`);else log(`🩸 血博失利：只回收 ${healed}/${wager} HP，未達半數，無法獲得心流。`,'dmg');}
  if(full&&large){b.samuraiBloodStreak=ultimate?3:Math.min(3,(b.samuraiBloodStreak||0)+1);log(`🩸 連莊成立：目前 ${b.samuraiBloodStreak}/3 層，後續攻擊每層 ×1.10。`,'gd');}
  else if(!full&&(b.samuraiBloodStreak||0)>0){b.samuraiBloodStreak=0;log('🩸 未能全數吸回血籌，連莊歸零。','dmg');}
  if(ultimate&&dealt<=0){const backlash=bloodWagerCost(15);losePlayerHp(backlash,{enemy:'自身／血博腰刀',effect:'血本無歸反噬'});log(`🩸 血本無歸未造成傷害，再失去 ${backlash} HP！`,'dmg');}
  clearBloodWager();
}
function renderBloodWagerControls(){
  const b=G.battle,el=$('battle-blood-wager'),blade=activeBladeDef();if(!el)return;
  const visible=!!(b&&blade?.id==='vampire'&&!b.over&&!b.pendingBust&&b.blind<=0);el.classList.toggle('hidden',!visible);if(!visible){el.innerHTML='';return;}
  const wager=b.samuraiBloodWager||0,raises=b.samuraiBloodRaises||0,cap=b.samuraiBloodRaiseCap||0,streak=b.samuraiBloodStreak||0,blocked=b.busy||b.dealReady===false;
  if(!wager){
    el.innerHTML=`<div class="blood-wager-title">🩸 血博腰刀｜連莊 ${streak}/3</div><div class="muted">斬擊前支付最大生命下注；實際吸回至少半數才獲得心流，全部吸回大注可累積連莊。</div><div class="btns">${[5,10,15].map(p=>`<button class="b-magic" data-blood-wager="${p}"${blocked||G.hp<=bloodWagerCost(p)?' disabled':''}>押 ${p}%（-${bloodWagerCost(p)} HP）</button>`).join('')}</div>`;
    el.querySelectorAll('[data-blood-wager]').forEach(button=>button.onclick=()=>placeBloodWager(+button.dataset.bloodWager));return;
  }
  const damageMult=(1+raises*.3)*Math.pow(1.1,streak),lifestealMult=1+raises*.2,cost=bloodWagerCost(5),canRaise=!blocked&&raises<cap&&(b.samuraiFlow||0)>=25&&G.hp>cost;
  el.innerHTML=`<div class="blood-wager-title">🩸 已押 ${wager} HP｜加注 ${raises}/${cap}｜連莊 ${streak}/3</div><div class="muted">本次刀傷 ×${damageMult.toFixed(2)}；吸血效率 ×${lifestealMult.toFixed(2)}。下注後攻擊才會結算。</div><div class="btns"><button class="b-magic" id="blood-wager-raise"${canRaise?'':' disabled'}>加注（-25 心流／-${cost} HP）</button></div>`;
  $('blood-wager-raise').onclick=raiseBloodWager;
}
function clearMyriadAffinity(){if(G.battle)G.battle.samuraiAffinityStatus=null;}
function selectMyriadAffinity(key){
  const b=G.battle;if(!b||!myriadBladeActive()||(b.samuraiFlow||0)<50||!REFLECTABLE_STATUS_KEYS.has(key)||playerPhaseStatusValue(key)<=0||b.over||b.busy||b.dealReady===false||b.pendingBust)return false;
  b.samuraiAffinityStatus=key;renderMyriadAffinityControls();updateOutgoing();updateIncoming();return true;
}
function renderMyriadAffinityControls(){
  const b=G.battle,el=$('battle-affinity-picker');if(!el)return;
  const visible=!!(b&&myriadBladeActive()&&!b.over&&!b.pendingBust);el.classList.toggle('hidden',!visible);if(!visible){el.innerHTML='';return;}
  const flow=b.samuraiFlow||0,available=PHASE_STATUS_DEFS.filter(status=>REFLECTABLE_STATUS_KEYS.has(status.key)&&playerPhaseStatusValue(status.key)>0),selected=b.samuraiAffinityStatus,profile=myriadAffinityAmount(selected,flow,b.samuraiWeaponState==='sheathed'),blocked=b.busy||b.dealReady===false||flow<50;
  el.innerHTML=`<div class="blood-wager-title">🌀 萬象妖刀・同病</div><div class="muted">${flow<50?`心流 ${roundHalfEven(flow)}/50，達標後可選擇要傳染的狀態。`:available.length?'攻擊前可自由重選，不消耗行動或亂數。':'目前沒有可選擇的可反射狀態。'}${selected&&profile.stacks>0?`目前選擇：${PURIFIABLE_STATUS_DEFS.find(status=>status.key===selected)?.name||selected} ${profile.stacks} 層，預計施加 ${profile.raw} 層${profile.shared?'（共相）':''}。`:''}</div><div class="btns">${available.map(status=>`<button class="${selected===status.key?'b-magic':'b-ghost'}" data-affinity-status="${status.key}"${blocked?' disabled':''}>${status.name} ${playerPhaseStatusValue(status.key)}</button>`).join('')}</div>`;
  el.querySelectorAll('[data-affinity-status]').forEach(button=>button.onclick=()=>selectMyriadAffinity(button.dataset.affinityStatus));
}
function clearPoisonDraw(){if(G.battle)G.battle.samuraiPoisonDraw=false;}
function selectPoisonDraw(enabled){
  const b=G.battle,target=currentTarget();if(!b||!poisonBladeActive()||b.over||b.busy||b.dealReady===false||b.pendingBust||b.samuraiWeaponState!=='sheathed')return false;
  if(enabled&&(!(target?.poison>0)||handTotal(b.hand)>21))return false;
  b.samuraiPoisonDraw=!!enabled;renderPoisonDrawControls();updateOutgoing();return true;
}
function renderPoisonDrawControls(){
  const b=G.battle,el=$('battle-poison-draw-picker');if(!el)return;
  const target=currentTarget(),visible=!!(b&&poisonBladeActive()&&!b.over&&!b.pendingBust);el.classList.toggle('hidden',!visible);if(!visible){el.innerHTML='';return;}
  const flow=b.samuraiFlow||0,canChoose=b.samuraiWeaponState==='sheathed'&&target?.poison>0&&handTotal(b.hand)<=21&&!b.busy&&b.dealReady!==false,selected=!!b.samuraiPoisonDraw&&canChoose,profile=poisonDrawSnapshot(target,flow,false),rawPoison=toxicologyPoison(b.hand||[]),actualPoison=rawPoison&&target?resistedStatusAmount(target,rawPoison):0,temper=poisonTemperFlowGain(actualPoison,flow);
  if(b.samuraiPoisonDraw&&!canChoose)b.samuraiPoisonDraw=false;
  el.innerHTML=`<div class="blood-wager-title">🐍 蠱毒脇差・居合選擇</div><div class="muted">${target?`${target.name}：中毒 ${target.poison||0}／猛毒 ${target.virulence||0}`:'目前沒有目標'}。${canChoose?`毒拔預計以 ${profile.base} 層計算、移除 ${profile.remove} 層，正常毒傷 ${profile.tick} ×${profile.multiplier.toFixed(1)}＝${profile.damage}；毒物學預計施毒 ${actualPoison}，${flow>=25?'毒脈':'淬毒'}預計 +${temper} 心流。`:'只有納刀且目前目標持有中毒時才能選擇毒拔。'}</div><div class="btns"><button class="${selected?'b-ghost':'b-magic'}" data-poison-draw="normal"${b.busy||b.dealReady===false?' disabled':''}>普通居合 ×1.15</button><button class="${selected?'b-magic':'b-ghost'}" data-poison-draw="burst"${canChoose?'':' disabled'}>毒拔居合 ×1.15</button></div>`;
  el.querySelector('[data-poison-draw="normal"]')?.addEventListener('click',()=>selectPoisonDraw(false));el.querySelector('[data-poison-draw="burst"]')?.addEventListener('click',()=>selectPoisonDraw(true));
}
function resetSafeLineTracking(){
  const b=G.battle;if(!b)return;
  const total=handTotal(b.hand||[]);b.samuraiSafeLineReached=total>=17&&total<=21;b.samuraiSafeLineFirstTotal=b.samuraiSafeLineReached?total:0;b.samuraiSafeLineExtraDraws=0;
}
function recordSafeLineDraw(previousTotal){
  const b=G.battle;if(!b)return;
  const total=handTotal(b.hand||[]);
  if(!b.samuraiSafeLineReached&&previousTotal<17&&total>=17){b.samuraiSafeLineReached=true;b.samuraiSafeLineFirstTotal=total;b.samuraiSafeLineExtraDraws=0;}
  else if(b.samuraiSafeLineReached)b.samuraiSafeLineExtraDraws=(b.samuraiSafeLineExtraDraws||0)+1;
}
function samuraiSafeLineProfile(){
  const b=G.battle,total=b?handTotal(b.hand):0,extra=Math.max(0,b&&b.samuraiSafeLineExtraDraws||0),valid=!!(b&&b.samuraiSafeLineReached&&total>=17&&total<=21);
  return {valid,total,extra,perfect:valid&&total===21&&extra===0,guard:valid&&extra===0,over:valid&&extra>0};
}
function samuraiUltimateInfo(){
  const b=G.battle,blade=activeBladeDef();if(!b||!blade||!isUp(blade.sourceId))return null;
  if(blade.id==='firststrike')return {id:'firststrike',name:'無想一閃',ready:b.samuraiWeaponState==='sheathed'&&(b.samuraiFlow||0)>=100&&b.hand.length<=3&&handTotal(b.hand)>=19&&handTotal(b.hand)<=21,requirement:'納刀｜100 心流｜不超過 3 張且 19～21 點'};
  if(blade.id==='safe21')return {id:'safe21',name:'界線斷決',ready:(b.samuraiFlow||0)>=100&&handTotal(b.hand)>=17&&handTotal(b.hand)<=21,requirement:'100 心流｜17～21 點'};
  if(blade.id==='court')return {id:'court',name:'三公會審',ready:(b.samuraiFlow||0)>=100&&(b.samuraiCourtSeals||0)>=3&&handTotal(b.hand)<=21,requirement:'100 心流｜3 枚三公印｜未爆牌'};
  if(blade.id==='insurance')return {id:'insurance',name:'一命勘定',ready:(b.samuraiFlow||0)>=100&&b.pendingBust&&handTotal(b.hand)>21,requirement:'100 心流｜已爆牌並等待結算'};
  if(blade.id==='peek')return {id:'peek',name:'斬斷因果',ready:(b.samuraiFlow||0)>=100&&fateUltimateCards().length>0,requirement:'100 心流｜本手已使用透視｜交換手牌與預覽牌'};
  if(blade.id==='vampire')return {id:'vampire',name:'血本無歸',ready:(b.samuraiFlow||0)>=100&&!(b.samuraiBloodWager>0)&&G.hp>Math.max(1,Math.round(G.maxhp*.3))&&handTotal(b.hand)<=21,requirement:'100 心流｜尚未下注｜支付30%最大生命｜未爆牌'};
  if(blade.id==='bulwark')return {id:'bulwark',name:'一念不動',ready:(b.samuraiFlow||0)>=100&&!!playerZanshinProfile()&&handTotal(b.hand)<=21,requirement:'100 心流｜持有殘心｜未爆牌'};
  if(blade.id==='buckler')return {id:'buckler',name:'滿月返照',ready:(b.samuraiFlow||0)>=100&&!!b.samuraiMoonCounter&&handTotal(b.hand)<=21,requirement:'100 心流｜盾返就緒｜未爆牌'};
  if(blade.id==='antidote')return {id:'antidote',name:'明鏡止水',ready:(b.samuraiFlow||0)>=100&&handTotal(b.hand)<=21,requirement:'100 心流｜未爆牌'};
  if(blade.id==='heartguard')return {id:'heartguard',name:'護心一文字',ready:(b.samuraiFlow||0)>=100&&handTotal(b.hand)>=17&&handTotal(b.hand)<=21,requirement:'100 心流｜17～21 點｜未爆牌'};
  if(blade.id==='howdidwegethere')return {id:'howdidwegethere',name:'萬象歸一',ready:(b.samuraiFlow||0)>=100&&playerPhaseStatuses().length>=3&&handTotal(b.hand)<=21,requirement:'100 心流｜至少 3 種可增相狀態｜未爆牌'};
  if(blade.id==='toxicology')return {id:'toxicology',name:'百毒穿心',ready:(b.samuraiFlow||0)>=100&&(currentTarget()?.poison||0)>=1&&handTotal(b.hand)<=21,requirement:'100 心流｜目前目標至少 1 層中毒｜未爆牌'};
  if(blade.id==='dragonneck')return {id:'dragonneck',name:'五龍吞天',ready:(b.samuraiFlow||0)>=100&&b.hand.length>=5&&handTotal(b.hand)<=21&&!b.pendingBust,requirement:'100 心流｜至少 5 張｜未爆牌'};
  if(blade.id==='luckycoin')return {id:'luckycoin',name:'一擲萬福',ready:(b.samuraiFlow||0)>=100&&(G.fortune||0)>=3&&handTotal(b.hand)>=17&&handTotal(b.hand)<=21&&!b.pendingBust,requirement:'100 心流｜至少 3 層福緣｜17～21 點｜未爆牌'};
  if(blade.id==='rubyring')return {id:'rubyring',name:'緋晶一閃',ready:(b.samuraiFlow||0)>=100&&handTotal(b.hand)>=17&&handTotal(b.hand)<=21&&!b.pendingBust,requirement:'100 心流｜17～21 點｜未爆牌'};
  return null;
}
function useSamuraiUltimate(){
  const b=G.battle,ultimate=samuraiUltimateInfo();if(!b||!ultimate||!ultimate.ready||b.over||b.busy||b.dealReady===false||(b.blind>0&&ultimate.id!=='antidote'))return;
  if(ultimate.id==='peek'){openFateUltimatePicker();return;}
  if(ultimate.id==='vampire'){
    const stake=Math.max(1,Math.round(G.maxhp*.3));losePlayerHp(stake,{enemy:'自身／血博腰刀',effect:'血本無歸'});b.samuraiBloodWager=stake;b.samuraiBloodBasePercent=30;b.samuraiBloodReward=0;b.samuraiBloodRaises=0;b.samuraiBloodRaiseCap=0;b.samuraiBloodUltimate=true;
    log(`🩸 必殺・血本無歸：支付 ${stake} HP，將性命押上刀鋒！`,'dmg');renderTop();
  }
  b.samuraiUltimate=ultimate.id;if(ultimate.id==='insurance')resolveBust();else attack();
}
function settleSamuraiUltimate(ultimate,name){
  const b=G.battle;if(!b||!ultimate)return;
  if(ultimate==='bulwark')clearPlayerZanshin();
  if(ultimate==='buckler')clearMoonCounter();
  b.samuraiFlow=0;b.samuraiWeaponState='sheathed';if(ultimate==='peek')b.samuraiFatePreview=[];
  log(`🗡️ ${name}施放完畢，${ultimate==='bulwark'?'殘心消散、':ultimate==='buckler'?'盾返消耗、':ultimate==='antidote'?'可淨化狀態已清除、':ultimate==='howdidwegethere'?'自身狀態保留、':''}心流歸零並直接收刀。`,'gd');
}
function switchBattleBlade(id){
  const b=G.battle,available=(G.blades||[]).filter(bladeId=>ownsP(bladeId)&&bladeDef(bladeId));
  if(!playerIsSamurai()||!b||b.over||b.busy||b.dealReady===false||b.pendingBust||b.samuraiWeaponState!=='sheathed'||!available.includes(id)||G.activeBlade===id)return false;
  if(b.samuraiFateGuided)cancelFateGuide('更換刀具');
  if(G.activeBlade==='vampire')forfeitBloodWager('更換刀具');
  clearMoonCounter('更換刀具');clearMyriadAffinity();clearPoisonDraw();clearDragonSheath();closeFatePicker();G.activeBlade=id;
  if(G.activeBlade==='safe21')resetSafeLineTracking();
  log(`🗡️ 居合前換刀：改用${bladeDef(G.activeBlade).name}。`,'good');syncButtons();updateOutgoing();
  return true;
}
function renderBattleBladePicker(){
  const el=$('battle-blade-picker'),b=G.battle,blades=(G.blades||[]).filter(id=>ownsP(id)&&bladeDef(id));if(!el)return;
  const visible=playerIsSamurai()&&b&&!b.over&&!b.busy&&b.dealReady!==false&&!b.pendingBust&&b.samuraiWeaponState==='sheathed'&&blades.length>1;
  el.classList.toggle('hidden',!visible);if(!visible){el.innerHTML='';return;}
  el.innerHTML=`<span class="muted">目前使用刀（換刀不改優先刀）：</span>${blades.map(id=>{const blade=bladeDef(id),active=G.activeBlade===id,preferred=G.preferredBlade===id;return `<button class="b-ghost${active?' active':''}" data-battle-blade="${id}"${active?' disabled':''}>${blade.icon} ${blade.name}${preferred?' ⭐':''}</button>`;}).join('')}`;
  el.querySelectorAll('[data-battle-blade]').forEach(button=>button.onclick=()=>switchBattleBlade(button.dataset.battleBlade));
}
function samuraiFirstStrikeWindow(){
  const b=G.battle;return !!(b&&(b.round===1||(playerIsSamurai()&&b.samuraiWeaponState==='sheathed'&&(b.samuraiFlow||0)>=100)));
}
function squirrelEscapeTurns(floor){return Math.max(3,6-Math.floor((legacyHeight(floor)-1)/10));}
function squirrelHpMultiplier(floor){
  const normal=floorScaling(floor).hp;
  const height=legacyHeight(floor);
  if(height>=31)return normal;
  const convergence=0.55+0.45*((height-1)/30);
  return 1+(normal-1)*convergence;
}
function bloodDemonGrowth(floor){
  const tier=floorScaling(floor).tier;
  const stage=Math.min(4,tier);
  const extra=Math.max(0,tier-4);
  return {
    stage,
    drainRate:0.7+stage*0.1,
    pattern:stage<2?['normal','normal','drain']:['normal','drain'],
    sacrificeEvery:extra>0?Math.max(3,7-Math.floor((extra-1)/2)):0,
  };
}
function bloodDemonFrenzyActive(e){return e.curhp<e.maxhp*.15&&(e.bloodFrenzyUses||0)<BALANCE.bloodDemonFrenzyUses;}
function bloodDemonThirstActive(e){return !!(e&&e.permanentThirst)||bloodDemonFrenzyActive(e);}
function bloodDemonThirstStacks(e){return bloodDemonThirstActive(e)?5:0;}
function bloodDemonDrainRate(e){return bloodDemonGrowth(G.floor).drainRate*(1+bloodDemonThirstStacks(e)*.1)*sepsisMultiplier(G.battle);}
function bloodDemonAction(e,round,floor){
  const growth=bloodDemonGrowth(floor);
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
function samuraiTsubameMult(){return 0.8;}
function samuraiTsubameBreak(){return 0.25;}
function zanshinAttackMultiplier(e){return 1+Math.max(0,Number(e&&e.zanshinAttack)||0);}
function setZanshin(e,attackBonus,reduction){
  if(!e||!['samurai','ronin'].includes(e.type))return;
  const attacksUntilMikiri=e.type==='ronin'?4:3;
  e.zanshin=true;e.zanshinAttack=Math.max(0,attackBonus);e.zanshinReduction=Math.max(0,reduction);
  e.zanshinAttackDecay=e.zanshinAttack/attacksUntilMikiri;e.zanshinReductionDecay=e.zanshinReduction/attacksUntilMikiri;e.zanshinFresh=true;
}
function setMikiriZanshin(e,total,busted=false){
  const low=busted||(total>=2&&total<=16),mid=!busted&&total>=17&&total<=19;if(!low&&!mid)return false;
  setZanshin(e,low?0.35:0.25,low?0.20:0.15);
  log(`🧘 ${e.name}刷新殘心：攻擊 +${low?35:25}%、受到傷害 −${low?20:15}%，效果將逐次遞減至下次見切結束。`,'dmg');return true;
}
function decayZanshin(e){
  if(!e?.zanshin)return;
  e.zanshinAttack=Math.max(0,(e.zanshinAttack||0)-(e.zanshinAttackDecay||0));
  e.zanshinReduction=Math.max(0,(e.zanshinReduction||0)-(e.zanshinReductionDecay||0));
}
function finishMikiriZanshin(e){
  if(!e?.zanshin)return;
  if(e.zanshinFresh){e.zanshinFresh=false;return;}
  e.zanshin=false;e.zanshinAttack=0;e.zanshinReduction=0;e.zanshinAttackDecay=0;e.zanshinReductionDecay=0;
  log(`🍂 ${e.name}的殘心在見切結束後消散。`,'good');
}
function prepareSamuraiDamage(e,base){
  const zanshin=zanshinAttackMultiplier(e),flow=Math.max(1,Math.round(base*1.5*zanshin));e.samuraiParts=[];e.nextArmorBreak=0;
  if(e.samuraiAction==='iaido'){const damage=Math.max(1,Math.round(base*1.5*1.4*zanshin));e.samuraiParts=[{kind:'iaido',damage,breakRate:.4,bleed:2}];}
  else if(e.samuraiAction==='kesa')e.samuraiParts=[{kind:'kesa',damage:flow,breakRate:0,bleed:1}];
  else if(e.samuraiAction==='tsubame'){
    const mult=samuraiTsubameMult(e),breakRate=samuraiTsubameBreak(e),damage=Math.max(1,Math.round(base*1.5*zanshin*mult));
    e.samuraiParts.push({kind:'tsubame1',damage,breakRate,bleed:0},{kind:'tsubame2',damage,breakRate,bleed:2});
  }
  e.nextDmg=e.samuraiParts.reduce((sum,part)=>sum+part.damage,0);e.nextArmorBreak=e.samuraiParts.reduce((sum,part)=>sum+Math.round(part.damage*part.breakRate),0);
}
function roninExecutionPercent(){return Math.min(20,10+floorScaling(G.floor).tier*2);}
function roninAction(e){if(e.roninForcedAction){const action=e.roninForcedAction;e.roninForcedAction=null;return action;}if((e.roninStep||0)===0)return 'iaido';return ['stab','karatake','mikiri','tsubame'][((e.roninStep||0)-1)%4];}
function prepareRoninDamage(e,base){
  const flow=2.5*zanshinAttackMultiplier(e);e.roninParts=[];e.nextArmorBreak=0;
  if(e.roninAction==='iaido')e.roninParts=[{kind:'iaido',damage:Math.max(1,Math.round(base*flow*1.4)),breakRate:.4,bleed:0}];
  else if(e.roninAction==='stab')e.roninParts=[{kind:'stab',damage:Math.max(1,Math.round(base*flow)),breakRate:.3,bleed:0}];
  else if(e.roninAction==='karatake')e.roninParts=[{kind:'karatake',damage:Math.max(1,Math.round(base*flow)),breakRate:0,bleed:2}];
  else if(e.roninAction==='tsubame'){
    const mult=.65,breakRate=.25,damage=Math.max(1,Math.round(base*flow*mult));
    e.roninParts.push({kind:'tsubame1',damage,breakRate,bleed:0},{kind:'tsubame2',damage,breakRate,bleed:2});
  }
  else if(e.roninAction==='thousandBlades'){
    const damage=Math.max(1,Math.round(base*flow*.5));
    e.roninParts=Array.from({length:5},(_,i)=>({kind:`thousand${i+1}`,damage,breakRate:0,bleed:0}));
  }
  e.nextDmg=e.roninParts.reduce((sum,part)=>sum+part.damage,0);e.nextArmorBreak=e.roninParts.reduce((sum,part)=>sum+Math.round(part.damage*part.breakRate),0);
}
function resolveMikiriBust(){
  const b=G.battle;if(!b)return 0;let triggered=0;
  b.enemies.filter(e=>['samurai','ronin'].includes(e.type)&&e.curhp>0&&(e.samuraiAction==='mikiri'||e.roninAction==='mikiri')).forEach(e=>{
    const hadZanshin=!!e.zanshin;e.mikiriOutcome='full';e.mikiriBustResolved=true;setMikiriZanshin(e,0,true);
    if(e.type==='ronin'&&hadZanshin){e.roninForcedAction='thousandBlades';triggered++;log(`⚔️ 爆牌踏入既有殘心：${e.name}刷新殘心，並將下一回合改為「千太刀」！`,'dmg');}
  });
  if(triggered){renderEnemies();updateIncoming();}return triggered;
}
function kunGrowth(){return {tideStart:6,tideCap:16,tideStep:2,tideEvery:3,shieldBaseRate:0.20,shieldPerTide:0.02,maxHpGrowthRate:0.05,divineHealRate:0.06,coverEvery:8,passiveDamage:2};}
function kunAction(e,round){
  if(e.kunForcedAction){const action=e.kunForcedAction;e.kunForcedAction=null;return action;}
  if(round>1&&round%kunGrowth().coverEvery===0)return 'divinity';
  const roll=gameRandom();return roll<0.45?'impact':roll<0.75?'devour':'pressure';
}
function kunShieldAmount(e){
  const missing=Math.max(0,e.maxhp-e.curhp),rate=.20+Math.max(0,e.northTide||0)*.02;
  return Math.max(0,Math.round(missing*rate));
}
function reduceNorthTide(e,amount,reason){
  if(!e||e.type!=='kun'||amount<=0||(e.northTide||0)<=0)return 0;
  const before=e.northTide||0;e.northTide=Math.max(0,before-amount);const reduced=before-e.northTide;
  if(reduced>0)log(`🌊 ${reason}：北冥潮 −${reduced}（${e.northTide}/${kunGrowth().tideCap}）。`,'gd');
  return reduced;
}
function beginKunEbbAction(){if(G.battle)G.battle.kunEbbAction={enemy:null,amount:0,reason:'',damage:0,busted:false,resolved:false};}
function queueKunEbb(e,amount,reason,damage=0,busted=false){
  const state=G.battle&&G.battle.kunEbbAction;if(!state||state.resolved||!e||e.type!=='kun')return;
  state.enemy=e;state.damage+=Math.max(0,damage||0);state.busted=state.busted||busted;
  if(!busted&&amount>state.amount){state.amount=Math.min(2,amount);state.reason=reason;}
}
function resolveKunEbbAction(){
  const state=G.battle&&G.battle.kunEbbAction;if(!state||state.resolved)return 0;state.resolved=true;
  const e=state.enemy;if(!state.busted&&e&&e.type==='kun'&&state.damage>=Math.max(1,e.maxhp*.10)&&state.amount<1){state.amount=1;state.reason='重擊破潮';}
  const reduced=!state.busted&&e&&e.type==='kun'?reduceNorthTide(e,state.amount,state.reason):0;
  G.battle.kunEbbAction=null;return reduced;
}
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
  if(e.eclipseCooldown<=0&&gameRandom()<0.12){e.eclipseCooldown=5;return 'eclipse';}
  const roll=gameRandom();return roll<0.30?'windblade':roll<0.55?'flamefeather':roll<0.80?'riftclaw':'rebirth';
}
function ultimateDispel(e){
  const removed=[];
  [['poison','中毒'],['virulence','猛毒'],['bleed','流血'],['burn','燒傷'],['trauma','創傷'],['fracture','斷骨'],['sepsis','敗血'],['corruption','腐敗']].forEach(([key,name])=>{if((e[key]||0)>0){removed.push(name);e[key]=0;}});
  e.virulenceTicks=0;e.burnTicks=0;e.burnRoundTicks=0;e.traumaFresh=false;return removed;
}
function addBlind(target,amount,source=null){return addLimitedStatus(target,'blind',amount,3,source);}
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
  log('🌪 焚風：燒傷需額外抽牌發作 4 次才減層，且完整回合減層間隔延長為 2 回合；流血發作只減 1 層、創傷每 2 回合才自然減少 1 層。鵬可閃避但不會折翼。','dmg');
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
  const numeric=[G.poison,b.virulence,b.corruption,b.sepsis,b.bleed,b.fracture,b.burn,b.trauma,b.blind,b.disciplineBrand,b.weakness,b.hallucination,b.mentalDisorder,b.paralysis];
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
  b.virulence=Math.ceil((b.virulence||0)*1.5);
  b.weakness=Math.min(9,Math.ceil((b.weakness||0)*1.5));
  b.hallucination=Math.min(5,Math.ceil((b.hallucination||0)*1.5));
  b.mentalDisorder=Math.min(5,Math.ceil((b.mentalDisorder||0)*1.5));
  b.paralysis=Math.ceil((b.paralysis||0)*1.5);
  if((b.hesitation||0)>0)b.hesitation=Math.max(1,Math.floor(b.hesitation/1.5));
}
function triggerDisciplinePunishment(){
  const b=G.battle;if(!b)return;
  amplifyPlayerStackStatuses();
  const leaderBase=cultLeaderAlive()?.baseNextDmg||Math.round((ENEMIES.cultLeader.atk[0]+ENEMIES.cultLeader.atk[1])/2*floorScaling(G.floor).atk);
  const extra=Math.max(1,Math.round(leaderBase*(b.disciplinePunishMult||1.5)));
  const resolved=resolveDefenseDamage(extra,b.defense,0);b.defense=resolved.defenseLeft;losePlayerHp(resolved.net,{enemy:cultLeaderAlive()?.name||'無面教宗',effect:'戒律懲罰'});
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
  courtGargoylesAlive().forEach(e=>{e.curhp=0;recordEnemyDefeat(e);onCourtGargoyleDeath(e,true);});b.lockedSkills=[];b.lockedSkill=null;
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
  if(e&&e.inquisitorEscort&&(e.forsakenEscort||G.battle&&G.battle.inquisitorLeaderFallen))return 1;
  const per100=INQUISITOR_LEADERS.includes(e.type)?(judgment ? 0.05 : 0.02):(judgment ? 0.025 : 0.01);
  return 1+inquisitorSinValue()/100*per100;
}
function inquisitorEscortAftermathMultiplier(e){return e&&e.forsakenEscort ? .65 : 1;}
function refreshInquisitorSinDamage(){
  const b=G.battle;if(!b||b.inquisitorPhase!==2)return;
  b.enemies.filter(e=>e.curhp>0).forEach(e=>{
    const base=e.baseNextDmg;if(!base)return;
    if(e.type==='inquisitor')e.nextDmg=inquisitorFootDamage(e,base);
    else if(e.inquisitorEscort&&e.inquisitorSync==='verdictStrike')e.nextDmg=Math.max(1,Math.round(base*1.25*inquisitorSinMultiplier(e,true)*inquisitorEscortAftermathMultiplier(e)));
    else if(e.inquisitorEscort&&!e.inquisitorSync&&e.paladinAction!=='guard'){const own=e.paladinAction==='judgment'?paladinGrowth(G.floor).judgmentMult:1;e.nextDmg=Math.max(1,Math.round(base*own*inquisitorSinMultiplier(e,false)*inquisitorEscortAftermathMultiplier(e)));}
  });
}
function weakenInquisitorEscorts(cause='擊倒'){
  const b=G.battle;if(!b||!b.inquisitorBattle||b.inquisitorPhase!==2||b.inquisitorLeaderFallen)return;
  b.inquisitorLeaderFallen=true;b.warcryStacks=0;
  const escorts=b.enemies.filter(e=>e.inquisitorEscort&&e.curhp>0);
  escorts.forEach(e=>{
    e.forsakenEscort=true;e.shield=0;e.statusResist=Math.min(e.statusResist==null?.5:e.statusResist,.2);e.inquisitorSync=null;e.nextDamageBoost=1;e.judgmentInterrupted=false;
    e.paladinAction=paladinAction(e,G.floor);
    if(e.paladinAction==='guard')e.nextDmg=0;
    else if(e.baseNextDmg){const own=e.paladinAction==='judgment'?paladinGrowth(G.floor).judgmentMult:1;e.nextDmg=Math.max(1,Math.round(e.baseNextDmg*own*.65));}
  });
  if(escorts.length)log(`⚖️ ${cause}異端審判長後，神聖加護崩解！存活護衛失去全部護盾與罪惡值加成，攻擊永久 −35%、聖盾效力 −50%，異常抗性降至 20%。`,'gd');
}
function addInquisitorCrime(points,reason=''){
  const b=G.battle;if(!b||!b.inquisitorBattle||points<=0)return 0;
  if(b.inquisitorLeaderFallen)return 0;
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
  log(`📜 ${b.bloodJudgment?'血魔以眾所憎惡之身接受審判':`${b.crimeFrozen} 層罪證使世人對你的評價變為「${publicReputation()}」`}；罪惡值 ${b.sinValue}/${b.sinCap||0}。審判長暫停 1 回合，之後立即審判。`,'dmg');
  ensureTarget();rollIntents();syncButtons();renderEnemies();return true;
}
function scaledEnemy(k,idx,floor,rankOverride=null){
  const t=rankOverride?{...ENEMIES[k],...compiledEnemyStats(k,rankOverride)}:ENEMIES[k];
  const scale=floorScaling(floor);
  const hs=k==='squirrel'?squirrelHpMultiplier(floor):scale.hp;
  const as=scale.atk;
  const hp=Math.max(1,Math.round(t.hp*hs));
  const atk=[Math.max(1,Math.round(t.atk[0]*as)),Math.max(1,Math.round(t.atk[1]*as))];
  return {...t,atk,key:k,idx,curhp:hp,maxhp:hp,nextDmg:null};
}
function applyEnemyFormationStats(e,hpMult=1,attackMult=1,formationId=''){
  e.maxhp=e.curhp=Math.max(1,Math.round(e.maxhp*hpMult));
  e.atk=e.atk.map(value=>Math.max(1,Math.round(value*attackMult)));
  e.formationHpMult=hpMult;e.formationAttackMult=attackMult;e.formationId=formationId;return e;
}
function sameSpeciesFormation(enemies){
  const count=enemies.length;if(count<=1)return enemies;
  const cfg=BASE_STAT_DATA.sameSpeciesFormation;
  const hpTotal=Math.min(cfg.hpTotalCap,cfg.hpTotalBase+(count-1)*cfg.hpPerExtraEnemy);
  const attackTotal=Math.min(cfg.attackTotalCap,cfg.attackTotalBase+(count-1)*cfg.attackPerExtraEnemy);
  const hpMult=roundHalfEven(hpTotal/count),attackMult=roundHalfEven(attackTotal/count);
  enemies.forEach(e=>applyEnemyFormationStats(e,hpMult,attackMult,`same:${e.key}:${count}`));return enemies;
}
function mixedFormation(formationId,enemies){
  const rules=MIXED_FORMATIONS[formationId];if(!rules)throw new Error(`混合編隊 ${formationId} 缺少外部倍率`);
  enemies.forEach(e=>{const mult=rules[e.key];if(!mult)throw new Error(`混合編隊 ${formationId} 缺少 ${e.key} 倍率`);applyEnemyFormationStats(e,mult.hp,mult.attack,formationId);});return enemies;
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
  return sameSpeciesFormation(arr);
}
function zombieEncounter(floor){
  const count=rnd(1,2),arr=[];
  for(let i=0;i<count;i++){
    const e=scaledEnemy('zombie',i,floor);e.zombieStep=0;e.zombieAction='normal';e.downed=false;e.revived=false;e.downedRound=-1;arr.push(e);
  }
  return sameSpeciesFormation(arr);
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
  const statuses=[['poison','中毒'],['virulence','猛毒'],['bleed','流血'],['fracture','斷骨'],['sepsis','敗血'],['burn','燒傷'],['corruption','腐敗'],['trauma','創傷']],removed=[];
  statuses.forEach(([key,name])=>{const stacks=Math.max(0,e[key]||0);if(stacks<=0)return;const amount=Math.max(1,Math.ceil(stacks*0.1));e[key]=Math.max(0,stacks-amount);removed.push(`${name} −${amount}`);});
  if((e.virulence||0)<=0)e.virulenceTicks=0;
  return removed;
}
function batEncounter(floor){
  const count=rnd(2,batMaxCount(floor)),arr=[];
  for(let i=0;i<count;i++){
    const e=scaledEnemy('bat',i,floor);e.name=`吸血蝙蝠 ${i+1}`;e.batStep=i%3;e.batAction=batAction(e);arr.push(e);
  }
  return sameSpeciesFormation(arr);
}
function gargoyleEncounter(floor){
  const boss=scaledEnemy('gargoyle',0,floor);boss.gargStep=0;boss.gargoyleAction='normal';boss.shield=0;
  const cultists=[1,2].map((idx,i)=>{
    const e=scaledEnemy('cultist',idx,floor);e.name=i===0?'左翼邪教徒':'右翼邪教徒';e.cultStartStep=i===0?0:2;return e;
  });
  return mixedFormation('gargoyleParty',[boss,...cultists]);
}
function factionEnemyType(){
  if(bloodDescendantActive())return gameRandom()<0.5?'cultist':'paladin';
  if(ownsP('bloodpact')&&Math.abs(G.faction||0)<80)return gameRandom()<0.5?'cultist':'paladin';
  return (G.faction||0)<0?'paladin':'cultist';
}
function factionEncounter(type,count,floor,rankOverride=null){
  return sameSpeciesFormation(Array.from({length:count},(_,i)=>{
    const e=scaledEnemy(type,i,floor,rankOverride);e.name=count>1?`${type==='cultist'?'邪教徒':'聖騎士'} ${i+1}`:e.name;
    if(type==='cultist')e.cultStartStep=i*2;
    if(type==='paladin')e.paladinStartStep=i*2;
    return e;
  }));
}
function squirrelNestEncounter(floor,rankOverride=null){
  return sameSpeciesFormation(Array.from({length:3},(_,i)=>{const e=scaledEnemy('squirrel',i,floor,rankOverride);e.name=`護巢松鼠 ${i+1}`;return e;}));
}
function obsidianCourtEligible(){return (G.faction||0)>=800||ownsP('bloodpact');}
function obsidianCourtEncounter(floor){
  const order=['disciplineGargoyle','cultLeader','punishmentGargoyle'];
  const enemies=order.map((key,idx)=>scaledEnemy(key,idx,floor));
  enemies.forEach(e=>{e.statusResist=e.type==='cultLeader'?0.7:0.5;e.shield=0;});
  return mixedFormation('obsidianCourt',enemies);
}
function inquisitorEncounter(floor){
  const left=scaledEnemy('paladin',0,floor),leader=scaledEnemy('inquisitorMounted',1,floor),right=scaledEnemy('paladin',2,floor);
  left.name='左翼聖騎士';right.name='右翼聖騎士';left.paladinStartStep=0;right.paladinStartStep=2;
  leader.statusResist=.7;leader.shield=0;leader.momentum=5;leader.inquisitorStep=0;leader.inquisitorAction='lance';
  return mixedFormation('inquisitorParty',[left,leader,right]);
}
function inquisitorEligible(){return bloodDescendantActive()||(G.faction||0)<=-800;}
function ultimateEncounter(floor){
  const entries=[{key:'kun',weight:1}];
  if(obsidianCourtEligible())entries.push({key:'court',weight:1});
  if(inquisitorEligible())entries.push({key:'inquisitor',weight:1});
  const pick=weightedBossKey(entries);
  return pick==='court'?obsidianCourtEncounter(floor):pick==='inquisitor'?inquisitorEncounter(floor):[scaledEnemy('kun',0,floor)];
}
function weightedBossKey(entries){const total=entries.reduce((sum,item)=>sum+item.weight,0);let roll=gameRandom()*total;for(const item of entries){roll-=item.weight;if(roll<0)return item.key;}return entries[entries.length-1].key;}
function genEncounter(floor){
  if(isBossFloor(floor)){
    if(isUltimateBossFloor(floor))return ultimateEncounter(floor);
    const gargoyleAllowed=ownsP('bloodpact')||(G.faction||0)>=120;
    const bosses=[{key:'dragon',weight:1},{key:'bloodDemon',weight:1}];
    if(chapterIndex(floor)+1>=SAMURAI_BOSS_UNLOCK_CHAPTER)bosses.push({key:'samurai',weight:.85});
    if(gargoyleAllowed)bosses.push({key:'gargoyle',weight:1});const bk=weightedBossKey(bosses);
    return bk==='gargoyle'?gargoyleEncounter(floor):[scaledEnemy(bk,0,floor)];
  }
  const height=legacyHeight(floor);
  let pool=floor===1?EARLY_POOL:(height<6?MID_POOL:NORMAL_POOL);
  if(height<3)pool=pool.filter(x=>x!=='eagle');
  if(height<4)pool=pool.filter(x=>x!=='robot');
  if(height<4)pool=pool.filter(x=>x!=='zombies');
  if(height<6)pool=pool.filter(x=>x!=='cultist');
  if(height<11)pool=pool.filter(x=>x!=='cyclops');
  const pick=pool[Math.floor(gameRandom()*pool.length)];
  if(pick==='slimes')return slimeEncounter(floor);
  if(pick==='zombies')return zombieEncounter(floor);
  if(pick==='bats')return batEncounter(floor);
  if(pick==='cultist')return factionEncounter(factionEnemyType(),1,floor);
  return [scaledEnemy(pick,0,floor)];
}

//===== 十一格大關：1～9 動態戰鬥／事件、10 休息、11 魔王 =====
function rollEventType(){
  const shopWeight=Math.round(Math.min(1,Math.max(0,G.shopChance||BASE_SHOP_CHANCE))*100);
  const entries=[
    {type:'shop',weight:shopWeight},
    ...(!G.altarSeen?[{type:'bloodAltar',weight:BLOOD_ALTAR_WEIGHT}]:[]),
    {type:'squirrelNest',weight:SQUIRREL_NEST_EVENT_WEIGHT},
    {type:'ronin',weight:RONIN_EVENT_WEIGHT},
    {type:'treasureChest',weight:TREASURE_CHEST_EVENT_WEIGHT},
    {type:'church',weight:CHURCH_EVENT_WEIGHT+(hasP('faithneck')?FAITH_NECK_CHURCH_BONUS:0)},
    {type:'rest',weight:REST_EVENT_WEIGHT},
  ];
  const total=entries.reduce((sum,item)=>sum+item.weight,0);let roll=gameRandom()*total,selected=entries[entries.length-1].type;
  for(const item of entries){roll-=item.weight;if(roll<0){selected=item.type;break;}}
  if(selected==='shop')G.shopChance=BASE_SHOP_CHANCE;
  else G.shopChance=Math.min(1,(G.shopChance||BASE_SHOP_CHANCE)+SHOP_CHANCE_STEP);
  if(selected==='bloodAltar')G.altarSeen=true;
  if(selected==='church')return gameRandom()<0.5?'ordinaryChurch':'darkChurch';
  return selected;
}
function decideCurrentNode(){
  if(isBossFloor(G.floor))return 'boss';
  if(isRestFloor(G.floor))return 'rest';
  if(chapterPosition(G.floor)<=RANDOM_NODE_COUNT&&gameRandom()<(G.eventChance||BASE_EVENT_CHANCE))return rollEventType();
  return 'battle';
}
function enterCurrentNode(){
  if(!G._floorCheckpoint||G._floorCheckpoint.floor!==G.floor)captureFloorCheckpoint();
  if(G._developerSkipFloorStat)delete G._developerSkipFloorStat;
  else runStats().highestFloor=Math.max(runStats().highestFloor,G.floor);
  if(G.floor===0&&!G.nodeType)G.nodeType='faithNecklaceIntro';
  if(!G.nodeType){G.nodeType=decideCurrentNode();G.nodeStarted=false;}
  if(!G.nodeStarted){if(G._developerSkipEventStat)delete G._developerSkipEventStat;else recordEventEncounter(G.nodeType);}
  if(['shop','rest','ordinaryChurch','darkChurch','ordinaryChurchBattle','darkChurchBattle','squirrelNest','squirrelNestBattle','ronin','roninBattle','treasureChest','treasureChestBattle','bloodAltar','bloodAltarDeclined','bloodInvitationAltar','altarBattle','altarExam','altarReward'].includes(G.nodeType))G.eventChance=BASE_EVENT_CHANCE;
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
  if(G.nodeType==='ronin'){openRoninEvent();return;}
  if(G.nodeType==='roninBattle'){startBattle('ronin');return;}
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
  if(G.nodeType==='altarBattle'){startBattle('altarBloodDemon');return;}
  if(G.nodeType==='altarExam'){startBattle('bloodExamAltar');return;}
  if(G.nodeType==='bossBloodDemon'){startBattle('normalBloodDemon');return;}
  if(G.nodeType==='bossExam'){startBattle('bloodExamBoss');return;}
  if(G.nodeType==='altarReward'){openBloodAltarVictory();return;}
  startBattle();
}
function restoreControl(amount=BALANCE.controlRestore){const before=G.control;G.control=Math.min(BALANCE.controlMax,G.control+amount);return G.control-before;}
function advanceNode(controlRestore=BALANCE.controlRestore){restoreControl(controlRestore);G.floor++;syncDeckWorkshopChapter();G.nodeType=null;G.nodeStarted=false;G.restCrab=false;enterCurrentNode();}
function completeEvent(){advanceNode();}
function openRestEvent(){
  const fixed=isRestFloor(G.floor);
  if(!G.nodeStarted)G.restCrab=gameRandom()<CRAB_REST_CHANCE;
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
  $('event-desc').textContent=`${message} 離開休息格時回復 6 控制值。`;
  const bladeActions=playerIsSamurai()?'<button class="b-magic" id="open-blade-forge">🔥 開啟被動鍛造</button>':'';
  const workshopActions=fixed&&deckWorkshopAllowed()?`<button class="b-magic" id="open-rest-deck-workshop">🎴 牌庫工坊（固定營地 8 折）</button>`:'';
  $('event-actions').innerHTML=`${bladeActions}${workshopActions}<button class="b-next" id="btn-event-continue">${crab?'隨著起舞':'休息後繼續'} ➜</button>`;
  if($('open-blade-forge'))$('open-blade-forge').onclick=openBladeForge;
  if($('open-rest-deck-workshop'))$('open-rest-deck-workshop').onclick=()=>openDeckEdit('fixedRest');
  $('btn-event-continue').onclick=()=>advanceNode(6);show('event');renderTop();
}
function squirrelNestSearchGold(){return Math.max(15,Math.round(floorReward(G.floor,false)*1.3));}
function squirrelNestVictoryGold(){return Math.max(30,Math.round(floorReward(G.floor,false)));}
function openSquirrelNestEvent(){
  G.nodeStarted=true;$('event-title').textContent='🐿️ 松鼠窩';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.squirrelNest;$('event-image').alt='堆滿果實與亮晶晶物品的松鼠窩';
  $('event-desc').textContent='樹洞裡塞滿堅果、落葉與幾枚閃亮的金幣。你可以冒險翻找，也可以安靜離開。';
  $('event-actions').innerHTML='<button class="b-magic" id="squirrel-search">翻找松鼠窩</button><button class="b-ghost" id="squirrel-leave">離開</button>';
  $('squirrel-search').onclick=()=>{
    const found=squirrelNestSearchGold();gainGold(found);SFX.coin();const foundItemId=grantConsumableDrop('翻找松鼠窩',SQUIRREL_NEST_CONSUMABLE_DROP_CHANCE,false),foundItem=consumableInfo(foundItemId);renderTop();
    if(gameRandom()<SQUIRREL_AMBUSH_CHANCE){
      G._squirrelNestFoundGold=found;G.nodeType='squirrelNestBattle';G.nodeStarted=false;startBattle('squirrelNest');if(foundItem)log(`🎁 你在松鼠窩先翻到 ${foundItem.icon}${foundItem.name} ×1；小心別被牠們偷回去。`,'gd');return;
    }
    $('event-desc').textContent=`你翻出了 ${found} 金幣${foundItem?`與 1 個${foundItem.name}`:''}，附近的松鼠似乎都不在家。`;
    $('event-actions').innerHTML='<button class="b-next" id="squirrel-found-leave">帶著金幣離開 ➜</button>';
    $('squirrel-found-leave').onclick=completeEvent;
  };
  $('squirrel-leave').onclick=completeEvent;show('event');renderTop();
}
function openRoninEvent(){
  const owns=ownsP('beheading');
  G.nodeStarted=true;$('event-title').textContent='⚔️ 流浪武士';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.ronin;$('event-image').alt='戴著斗笠、獨自行走的流浪武士';
  const reward=owns?`再次勝利會使你的斬首線由 ${G.beheadingPercent||5}% 提高至 ${Math.min(20,(G.beheadingPercent||5)+3)}%。`:'勝利後可選擇收下初始斬首線 5% 的「斬首」，或拒絕並在日後再次獲得選擇。';
  $('event-desc').textContent=`一名戴著斗笠的武士攔在路中央，邀請你進行一場可能致命的決鬥。心流使他的所有攻擊傷害 ×2.5，所有攻擊都可能斬首。${reward}`;
  $('event-actions').innerHTML=`<button class="b-stand" id="ronin-challenge">${owns?'再次挑戰流浪武士':'接受決鬥'}</button><button class="b-ghost" id="ronin-leave">婉拒挑戰</button>`;
  $('ronin-challenge').onclick=()=>{G.nodeType='roninBattle';G.nodeStarted=false;startBattle('ronin');};$('ronin-leave').onclick=completeEvent;show('event');renderTop();
}
function grantTreasureChestReward(){
  const boosts=rollRankBoosts(5),rewards=[];
  boosts.forEach(boost=>{
    const rank=String(boost.rank);
    if(boost.type==='flat'){const before=rankFlatBonus(rank),after=before+2;G.rankFlatDamage[rank]=after;rewards.push({rank,type:'flat',before,after,label:'固定傷害'});}
    else{const before=rankDamagePercent(rank),after=before+1;G.rankDamage[rank]=after;rewards.push({rank,type:'percent',before,after,label:'傷害倍率'});}
  });
  const itemId=grantConsumableDrop('神祕寶箱',1,false),item=consumableInfo(itemId),base=floorReward(G.floor,false)*2;
  G._treasureReward={rewards,itemId,base};
  $('treasure-reward-list').innerHTML=rewards.map(reward=>`<div class="rank-damage-card treasure-reward-card"><div class="rank">${reward.rank}</div><div class="mult">${reward.type==='flat'?`固定 +${reward.after}`:`${reward.after}%`}</div><div class="muted">${reward.label}<br>${reward.type==='flat'?`+${reward.before} → +${reward.after}`:`${reward.before}% → ${reward.after}%`}</div></div>`).join('');
  $('treasure-reward-extra').innerHTML=`${item?`🎒 另外獲得 ${item.icon}${item.name} ×1`:'🎒 背包沒有空位，未能帶走消耗品'}<br>🪙 接著進行基礎賞金 ${base} 的 21 點賞金回合。`;
  $('treasure-reward-continue').onclick=()=>{
    const reward=G._treasureReward;if(!reward)return;G._treasureReward=null;
    startBounty(false,reward.base,'treasureChest');
    bountyLog(`🎁 寶箱的 5 項牌面強化：${reward.rewards.map(entry=>`${entry.rank} ${entry.type==='flat'?'固定傷害 +2':'倍率 +1%'}`).join('、')}。`,'gd');
    bountyLog(item?`🎒 寶箱另外掉落 ${item.icon}${item.name} ×1。`:`🎒 背包沒有空位，寶箱中的消耗品無法帶走。`,item?'gd':'dmg');
    bountyLog(`💰 寶箱賞金以本層普通基礎賞金的 2 倍計算：${reward.base} 金幣。`,'gd');
    renderBounty();renderTop();
  };
  show('treasure-reward');renderTop();
}
function openTreasureChestEvent(){
  G.nodeStarted=true;$('event-title').textContent='🧰 神祕寶箱';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.treasureChest;$('event-image').alt='緊閉的奇幻寶箱';
  $('event-desc').textContent='一只沉重的寶箱靜靜躺在路中央。你可以直接離開，或冒險開啟它。';
  $('event-actions').innerHTML='<button class="b-magic" id="treasure-open">開啟寶箱</button><button class="b-ghost" id="treasure-leave">離開</button>';
  $('treasure-open').onclick=()=>{
    if(gameRandom()<TREASURE_MIMIC_CHANCE){G.nodeType='treasureChestBattle';G.nodeStarted=false;startBattle('treasureMimic');return;}
    grantTreasureChestReward();
  };
  $('treasure-leave').onclick=completeEvent;show('event');renderTop();
}
function openFaithNecklaceIntro(){
  if(!G.nodeStarted&&G.nodeType!=='faithNecklaceIntro')recordEventEncounter('faithNecklaceIntro');
  G.nodeType='faithNecklaceIntro';G.nodeStarted=true;$('event-title').textContent='📿 第 0 層・命運的拾遺';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.faithNecklace;$('event-image').alt='靜置於石階上的信仰項鍊';
  $('event-desc').textContent='啟程之前，你在無人注視的石階上發現一條信仰項鍊。你可以將它撿起，也可以不受其牽引，直接離開。';
  $('event-actions').innerHTML='<button class="b-magic" id="faith-intro-take">撿取信仰項鍊</button><button class="b-ghost" id="faith-intro-leave">離開</button>';
  const finish=take=>{
    if(take&&!ownsP('faithneck')){G.passives.push('faithneck');G.passivePaid.faithneck=0;SFX.coin();}
    G.floor=1;G.nodeType=null;G.nodeStarted=false;
    if(G.character==='warrior'&&!G.collectorStartupDone){openDeckEdit('startup');return;}
    enterCurrentNode();
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
  const blocked=bloodDescendantActive()?'血魔契約使雙方陣營都將你視為仇敵，無法祈禱或獲得神蹟。':hasContract?'鮮血契約使評價變化減半；目前尚未得到此教堂足夠的認同。':ordinary?'你對聖堂的敵意已突破門檻，暫時無法祈禱。':'你對邪教的敵意已突破門檻，暫時無法祈禱。';
  $('event-desc').textContent=`${ordinary?'鐘聲與燭光帶來短暫安寧。':'低語從黑色祭壇後傳來。'}祈禱可${prayerEffect}；破壞教堂將同時驚動兩名${ordinary?'聖騎士':'邪教徒'}。${canPray?'':blocked}`;
  $('event-actions').innerHTML=`${canPray?`<button class="b-magic" id="church-pray">祈禱：${prayerEffect}</button>`:''}<button class="b-stand" id="church-destroy">破壞教堂</button><button class="b-ghost" id="church-leave">路過</button>`;
  const pray=$('church-pray');if(pray)pray.onclick=()=>{
    if(ordinary){healPlayer(G.maxhp-G.hp);SFX.win();}
    else{gainGold(darkChurchGoldReward());SFX.coin();}
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
  $('event-desc').textContent=hasContract?`凝固的血液在祭壇上搏動。你已經持有${bloodContractName()}，祭壇不會產生第二份；現在只能摧毀祭壇或離開。`:'凝固的血液在祭壇上搏動。你可以簽下契約、摧毀祭壇挑戰菁英血魔，或立刻離開。簽約會立刻使最大生命減半，成為血魔前的未來最大生命增長也只有 50%。這座祭壇本局不會再次出現。';
  $('event-actions').innerHTML=`${hasContract?'':'<button class="b-magic" id="altar-take">拿取鮮血契約</button>'}<button class="b-stand" id="altar-destroy">破壞祭壇</button><button class="b-ghost" id="altar-leave">離開</button>`;
  const take=$('altar-take');if(take)take.onclick=()=>{SFX.win();grantBloodPact(completeEvent);};
  $('altar-destroy').onclick=()=>{G.nodeType='altarBattle';G.nodeStarted=false;startBattle('altarBloodDemon');};
  $('altar-leave').onclick=completeEvent;show('event');renderTop();
}
function openBloodAltarVictory(){
  const hasContract=ownsP('bloodpact');
  G.nodeType='altarReward';G.nodeStarted=true;$('event-title').textContent='🩸 破碎的鮮血祭壇';$('event-visual').classList.remove('hidden');$('event-image').src=EVENT_IMG.bloodAltar;$('event-image').alt='破碎的鮮血儀式祭壇';
  $('event-desc').textContent=hasContract?'菁英血魔已被擊敗。你已有契約，碎石中不會出現第二份；祭壇的力量仍凝成了一次額外強化獎勵。':'菁英血魔已被擊敗。鮮血契約仍留在碎石之中：拿取時最大生命減半，成為血魔前的未來最大生命增長也只有 50%。祭壇的力量另凝成了一次額外強化獎勵。';
  $('event-actions').innerHTML=`${hasContract?'':'<button class="b-magic" id="altar-victory-take">拿取鮮血契約（不占獎勵）</button>'}<button class="b-next" id="altar-reward">進入額外獎勵 ➜</button>`;
  const take=$('altar-victory-take');if(take)take.onclick=()=>{SFX.win();grantBloodPact(openBloodAltarVictory);};
  $('altar-reward').onclick=()=>openUpgrade('event');show('event');renderTop();
}
function openBloodInvitation(source){
  $('event-title').textContent='🩸 血魔的邀請';$('event-visual').classList.add('hidden');
  $('event-desc').textContent='強化吸血賭注、鮮血契約與強化背水一戰產生共鳴。血魔邀請你成為血魔；接受後鮮血契約會進化為血魔契約，未來最大生命增長恢復 100%（過去損失不返還），三件裝備立即蛻變，並立刻開始血魔考核。';
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
  else{G.nodeType='bossBloodDemon';startBattle('normalBloodDemon');}
}
function altarEliteBloodDemonEncounter(floor){
  const e=scaledEnemy('bloodDemon',0,floor,EVENT_ENEMY_RANK);e.name='菁英血魔';e.boss=false;e.eventBoss=true;e.elite=true;return [e];
}
function bloodExamEncounter(floor,eventBattle=false){
  const e=scaledEnemy('bloodDemon',0,floor);e.name='血魔考官';e.boss=!eventBattle;e.eventBoss=eventBattle;e.bloodExam=true;e.permanentThirst=true;e.statusResist=0.5;return [e];
}

function developerEncounter(key,floor){
  if(!G.developerMode)return genEncounter(floor);
  const aliases={
    slimes:()=>slimeEncounter(floor),zombies:()=>zombieEncounter(floor),bats:()=>batEncounter(floor),
    gargoyleParty:()=>gargoyleEncounter(floor),obsidianCourt:()=>obsidianCourtEncounter(floor),
    inquisitorParty:()=>inquisitorEncounter(floor),squirrelNest:()=>squirrelNestEncounter(floor),
    twoCultists:()=>factionEncounter('cultist',2,floor),twoPaladins:()=>factionEncounter('paladin',2,floor),
  };
  if(aliases[key])return aliases[key]();
  if(ENEMIES[key])return [scaledEnemy(key,0,floor)];
  return [scaledEnemy('slime',0,floor)];
}

//===== 戰鬥 =====
let luckyPickerState=null;
function clearLuckyNumber(){G.luckyNumber=null;G.luckyAllIn=false;G.luckyPendingBounty=false;}
function renderLuckyNumberPicker(){
  const state=luckyPickerState;if(!state)return;
  $('lucky-number-grid').innerHTML=Array.from({length:BALANCE.luckyNumber.max-BALANCE.luckyNumber.min+1},(_,index)=>index+BALANCE.luckyNumber.min).map(number=>`<button type="button" data-lucky-number="${number}" class="${state.number===number?'active':''}">${number}</button>`).join('');
  $('lucky-number-grid').querySelectorAll('[data-lucky-number]').forEach(button=>button.onclick=()=>{state.number=Number(button.dataset.luckyNumber);renderLuckyNumberPicker();});
  const mastered=doublebetMasteryOwned(),allInRow=$('lucky-all-in-row'),allIn=$('lucky-all-in');allInRow.classList.toggle('hidden',!mastered);allIn.checked=mastered&&state.allIn;allIn.onchange=()=>{state.allIn=allIn.checked;renderLuckyNumberPicker();};
  const exact=validLuckyNumber(state.number)?luckyNumberProfile(state.number,state.context==='bounty'?'bounty':'battle',state.number,state.allIn):null,multiple=validLuckyNumber(state.number)&&state.number*2<=21?luckyNumberProfile(state.number*2,state.context==='bounty'?'bounty':'battle',state.number,state.allIn):null;
  $('lucky-number-summary').textContent=exact?`幸運數字 ${state.number}｜精確命中 ×${exact.multiplier.toFixed(2)}${multiple?`｜其他倍數 ×${multiple.multiplier.toFixed(2)}`:'｜21 點內沒有其他倍數'}${state.allIn?'｜已啟用孤注一擲':''}`:'請先選擇 2～21。';
  $('lucky-number-confirm').disabled=!validLuckyNumber(state.number);
}
function requestLuckyNumber(context,onConfirm){
  luckyPickerState={context,number:null,allIn:false,onConfirm};
  $('lucky-number-context').textContent=context==='bounty'?'本次賞金沒有前置戰鬥；選定後直到賞金結束都不可更換。':'敵人與公開規則已確認；選定後將固定至本場戰鬥及其戰後賞金結束。';
  renderLuckyNumberPicker();$('lucky-number-picker').classList.remove('hidden');
}
function confirmLuckyNumber(){
  const state=luckyPickerState;if(!state||!validLuckyNumber(state.number))return;
  G.luckyNumber=state.number;G.luckyAllIn=!!state.allIn&&doublebetMasteryOwned();G.luckyPendingBounty=false;
  if(state.context==='bounty'&&G.bounty){G.bounty.luckyNumber=G.luckyNumber;G.bounty.luckyAllIn=G.luckyAllIn;}
  $('lucky-number-picker').classList.add('hidden');luckyPickerState=null;
  const message=`🎲 幸運數字已選定為 ${G.luckyNumber}${G.luckyAllIn?'，並啟用「孤注一擲」':''}；在${state.context==='bounty'?'本次賞金':'本場戰鬥與戰後賞金'}結束前不可更換。`;
  if(state.context==='bounty')bountyLog(message,'gd');else log(message,'gd');
  state.onConfirm();
}
function selectPreferredBattleBlade(){
  if(!playerIsSamurai())return null;
  const preferred=(G.blades||[]).includes(G.preferredBlade)&&ownsP(G.preferredBlade)?G.preferredBlade:(G.blades||[]).find(id=>ownsP(id))||null;
  G.preferredBlade=preferred;G.activeBlade=preferred;return preferred;
}
function startBattle(forcedEnemy=null){
  const floor=G.floor;
  if(!forcedEnemy&&!isBossFloor(floor)&&G.nodeType==='battle'&&gameRandom()<0.12){G.nodeType='duckBattle';G.nodeStarted=false;startDuck(floor);return;}
  clearLuckyNumber();
  G.nodeStarted=true;
  selectPreferredBattleBlade();
  const enemies=String(forcedEnemy||'').startsWith('dev:')?developerEncounter(String(forcedEnemy).slice(4),floor)
    :forcedEnemy==='paladin'?[scaledEnemy('paladin',0,floor)]
    :forcedEnemy==='ordinaryChurch'?factionEncounter('paladin',2,floor,EVENT_ENEMY_RANK)
    :forcedEnemy==='darkChurch'?factionEncounter('cultist',2,floor,EVENT_ENEMY_RANK)
    :forcedEnemy==='squirrelNest'?squirrelNestEncounter(floor,EVENT_ENEMY_RANK)
    :forcedEnemy==='ronin'?[scaledEnemy('ronin',0,floor)]
    :forcedEnemy==='treasureMimic'?[scaledEnemy('mimic',0,floor,EVENT_ENEMY_RANK)]
    :forcedEnemy==='altarBloodDemon'?altarEliteBloodDemonEncounter(floor)
    :forcedEnemy==='normalBloodDemon'?[scaledEnemy('bloodDemon',0,floor)]
    :forcedEnemy==='bloodExamAltar'?bloodExamEncounter(floor,true)
    :forcedEnemy==='bloodExamBoss'?bloodExamEncounter(floor,false)
    :genEncounter(floor);
  if(!forcedEnemy&&G.nodeType==='boss'&&enemies.some(e=>e.type==='bloodDemon')&&bloodInvitationEligible()){G.nodeType='bloodInvitationBoss';G.nodeStarted=false;openBloodInvitation('boss');return;}
  const dragon=enemies.find(e=>e.type==='dragon');
  if(dragon){
    const dg=dragonGrowth(floor);
    dragon.dragonStep=0;dragon.shield=0;dragon.breathInterrupted=false;dragon.wakeNext=false;dragon.wakeShockPending=false;
    dragon.sleepTurns=gameRandom()<dg.sleepChance?2:0;
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
  enemies.filter(e=>e.type==='bloodDemon').forEach(e=>{e.bloodPower=0;e.bloodLockUses=0;e.bloodLockArmed=true;e.bloodFrenzyUses=0;});
  enemies.filter(e=>e.type==='samurai').forEach(e=>{e.samuraiStep=0;e.samuraiAction='iaido';e.mikiriOutcome=null;e.mikiriBustResolved=false;e.zanshin=false;e.zanshinAttack=0;e.zanshinReduction=0;e.statusResist=.3;e.samuraiParts=[];e.nextArmorBreak=0;});
  enemies.filter(e=>e.type==='ronin').forEach(e=>{e.roninStep=0;e.roninAction='iaido';e.roninForcedAction=null;e.mikiriOutcome=null;e.mikiriBustResolved=false;e.zanshin=false;e.zanshinAttack=0;e.zanshinReduction=0;e.statusResist=.3;e.roninParts=[];e.nextArmorBreak=0;e.executionPercent=roninExecutionPercent();});
  enemies.filter(e=>e.type==='kun').forEach(e=>{const kg=kunGrowth();e.kunBaseMaxhp=e.maxhp;e.northTide=kg.tideStart;e.kunAction='impact';e.kunForcedAction=null;e.shield=0;e.statusResist=0.7;});
  enemies.filter(e=>e.type==='peng').forEach(e=>{e.pengAttackBonus=0;e.maxEvasion=8;e.evasion=3;e.foldable=false;e.dodgeCounter=null;e.pengAction='windblade';e.pengForcedAction=null;e.eclipseCooldown=3;e.statusResist=0.7;});
  enemies.filter(e=>['cultLeader',...COURT_GARGOYLES].includes(e.type)).forEach(e=>{e.courtStep=0;e.courtAction=courtAction(e);e.shield=0;});
  enemies.filter(e=>e.type==='cthulhu').forEach(e=>{e.statusResist=.7;e.shield=0;e.cthulhuStep=0;e.cthulhuAction='tentacleRend';e.inheritedFanaticism=5;});
  G.poison=0;
  const eventSource=['altarBloodDemon','bloodExamAltar'].includes(forcedEnemy)?'bloodAltar':forcedEnemy==='ordinaryChurch'?'ordinaryChurch':forcedEnemy==='darkChurch'?'darkChurch':forcedEnemy==='squirrelNest'?'squirrelNest':forcedEnemy==='ronin'?'ronin':forcedEnemy==='treasureMimic'?'treasureChest':null;
  G.battle={enemies,eventSource,deck:shuffle(battleDeck()),hand:[],round:1,target:0,defense:0,pendingBust:false,
    bucklerUses:0,bucklerBroken:false,luckyBustResolved:false,weakness:playerWeaknessFloor(),hesitation:0,corruption:0,sepsis:0,bleed:0,fracture:0,burn:0,burnTicks:0,burnRoundTicks:0,trauma:0,traumaFresh:false,traumaDecayTicks:0,virulence:0,virulenceTicks:0,blind:0,hallucination:0,mentalDisorder:0,paralysis:0,thirst:hasP('bloodpact')?Math.ceil(5*statusGainMultiplier()):0,buffSuppressed:0,hits:0,guardStreak:0,focus:0,
    bloodDamageStacks:0,
    samuraiFlow:0,samuraiWeaponState:playerIsSamurai()?'sheathed':null,samuraiGuardMode:null,samuraiGuardRate:0,samuraiDefenseFlow:0,samuraiDefenseSubmitFlow:0,samuraiDefenseFlowAwarded:0,samuraiHeartBladeSubmitted:false,samuraiBucklerParticipated:false,samuraiMoonFlowActive:false,samuraiMoonCounter:false,samuraiMirrorFlowThisEnemyTurn:0,samuraiAffinityStatus:null,samuraiPoisonDraw:false,samuraiDragonSheath:false,samuraiZanshinAttack:0,samuraiZanshinReduction:0,samuraiZanshinTurns:0,samuraiZanshinDuration:0,samuraiZanshinFresh:false,samuraiZanshinRefreshed:false,samuraiZanshinGuardUsed:false,samuraiZanshinPreserved:false,mikiriCooldown:0,samuraiCourtExpected:'J',samuraiCourtSeals:0,samuraiSafeLineReached:false,samuraiSafeLineFirstTotal:0,samuraiSafeLineExtraDraws:0,samuraiFateUsed:false,samuraiFatePreview:[],samuraiFateGuided:null,samuraiFateGuideDrawn:false,samuraiFateSevered:null,samuraiFatePickerMode:null,samuraiBloodWager:0,samuraiBloodBasePercent:0,samuraiBloodReward:0,samuraiBloodRaises:0,samuraiBloodRaiseCap:0,samuraiBloodStreak:0,samuraiBloodUltimate:false,
    stolenUpgrades:[],lastStolenUpgrade:null,lockedUpgradeUses:{},lockedSkill:null,lockedSkills:[],lastLockedSkill:null,
    controlLeft:G.control,controlCap:BALANCE.controlMax,discardMode:false,
    suitMode:false,suitSelected:null,suitMagicUsed:false,suitMagicSpent:0,suitMagicRefunded:0,suitMainSuit:activeSuitMastery()==='mono'?dominantSuit(G.deck):null,suitSpellEnemyMult:1,
    bountyHuntActive:!!G.bountyHunt,
    over:false,busy:false,dealReady:false};
  if(enemies.some(e=>e.type==='cultLeader'))Object.assign(G.battle,{obsidianCourt:true,cthulhuPhase:false,courtTotalMaxHp:enemies.reduce((sum,e)=>sum+e.maxhp,0),fanaticism:5,disciplineBrand:0,disciplinePunishMult:1.5,lastPlayerAction:null,upgradeReprieve:0,abyssDistance:null,abyssMax:20});
  if(enemies.some(e=>e.type==='cthulhu')&&!G.battle.obsidianCourt)Object.assign(G.battle,{cthulhuPhase:true,fanaticism:5,disciplineBrand:0,disciplinePunishMult:1.5,lastPlayerAction:null,abyssDistance:10,abyssMax:20});
  const inquisitor=enemies.find(e=>e.type==='inquisitorMounted');if(inquisitor)Object.assign(G.battle,{inquisitorBattle:true,inquisitorPhase:1,inquisitorFirstMax:inquisitor.maxhp,crime:0,crimeFrozen:0,sinValue:0,sinCap:0,bloodJudgment:false,redemptionUses:0,warcryStacks:0,lastPlayerAction:null});
  const bloodExamEnemy=enemies.find(e=>e.bloodExam);if(bloodExamEnemy)addSepsis(G.battle,enemyStatusRaw(bloodExamEnemy,5),bloodExamEnemy);
  $('btn-duck').classList.add('hidden');
  $('btn-hit').classList.remove('hidden');$('btn-stand').classList.remove('hidden');$('btn-defend').classList.remove('hidden');$('btn-escape').classList.add('hidden');
  $('btn-sheath').classList.toggle('hidden',!hasActiveBlade());
  $('pl-hint').textContent=playerIsSamurai()?(hasActiveBlade()?'納刀時可免費換刀，但必須先以居合拔刀才能使用架勢或見切；見切不消耗心流、仍有 3 次行動冷卻，主動收刀不提供減傷。':'目前沒有刀具：攻擊的最終傷害固定為 1；徒手仍可使用架勢與不消耗心流的見切。'):'抽牌後選擇攻擊或防禦；防禦會為下一次攻擊蓄勢，爆牌會失去全部蓄勢！';
  $('log').innerHTML='';
  const isBoss=enemies.some(e=>e.boss);
  log(`🗼 第 ${floor} 層 — 遭遇 ${enemies.map(e=>e.name).join(' + ')}！`,isBoss?'dmg':'');
  if(forcedEnemy==='altarBloodDemon')log('🩸 祭壇崩裂後，菁英血魔現身：使用菁英階級基礎數值（HP ×1.450、攻擊 ×1.100），並保留血祭、吸血與渴血機制。','dmg');
  if(forcedEnemy==='ordinaryChurch')log('⛪ 教堂警鐘響起：兩名聖騎士同時迎戰，擊敗後可進入一般獎勵。','dmg');
  if(forcedEnemy==='darkChurch')log('🕯 邪教儀式被破壞：兩名邪教徒同時迎戰，擊敗後可進入一般獎勵。','dmg');
  if(forcedEnemy==='squirrelNest')log(`🐿️ 翻找驚動了 3 隻護巢松鼠！你已找到 ${G._squirrelNestFoundGold||0} 金幣；戰勝後只會再獲得金錢獎勵。`,'dmg');
  if(forcedEnemy==='ronin')log(`⚔️ 流浪武士接受決鬥：心流使所有攻擊 ×2.5；當生命低於 ${roninExecutionPercent()}% 且攻擊穿透防禦時會被斬首。`,'dmg');
  if(forcedEnemy==='treasureMimic')log('🧰 寶箱長出利齒！獎勵暫停發放，擊敗貪噬寶箱怪後可取得 5 項牌面強化與雙倍基礎賞金回合。','dmg');
  if(enemies.some(e=>e.bloodExam)){log('🩸 血魔考官：完整 Boss 數值、50% 負面狀態抗性、所有命中 HP 的攻擊附加流血，渴血永久生效。','dmg');log('🦠 血魔考核開局：你被直接施加 5 層敗血。','dmg');}
  if(G.battle.obsidianCourt){log('🕍 黑曜聖庭：教宗封印所有非刀具來源的強化；兩尊石像鬼各自最多封鎖一項非刀具技能，且每尊使教宗減傷 25%。','dmg');log('🔥 狂信 5/20｜📿 戒律烙印 0/3。擊倒教宗會召來真正的終極 Boss。','dmg');}
  if(G.battle.inquisitorBattle){log('⚖️ 異端審判長率兩名聖騎士迎戰：審判長永久減傷 30%，鐵騎以 5/25 層馬勢開局。','dmg');log('📜 傷害審判長或聖騎士、施加負面狀態或爆牌都會累積無上限罪證；擊殺聖騎士會額外增加 5 層。','dmg');}
  if(floor===1){
    const character=CHARACTERS.find(c=>c.id===G.character);
    if(character)log(`${character.icon} 角色：${character.name}｜${character.desc}`,'gd');
    const starters=G.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return `${p.icon} ${passiveNameWithAffix(id)}`;});
    log(`🎁 起始被動：${starters.join('、')}`,'gd');
    if(playerIsSamurai())log(hasActiveBlade()?'🗡️ 優先刀目前為納刀。首次攻擊必須以居合拔刀，之後才能使用架勢或不消耗心流的見切。':'✊ 目前沒有刀具：攻擊的最終傷害固定為 1；徒手可正常使用架勢與見切。','gd');
  }
  if(enemies[0].key==='slime'){
    const buffed=enemies[0].maxhp>ENEMIES.slime.hp;
    log(`史萊姆群：共 ${enemies.length} 隻`);
  }else if(floor>1){
    const scale=floorScaling(floor);
    const hpScale=enemies.length===1&&enemies[0].type==='squirrel'?squirrelHpMultiplier(floor):scale.hp;
    log(`敵人成長：第 ${scale.tier+1} 階、本大關節點 ${chapterPosition(floor)}/${CHAPTER_LENGTH}｜HP ×${hpScale.toFixed(2)}、攻擊 ×${scale.atk.toFixed(2)}`);
  }
  if(enemies.some(e=>e.type==='squirrel')){const turns=squirrelEscapeTurns(floor);log(`🐿️ 每隻松鼠第 1 回合各自偷竊金錢，並有 ${Math.round(SQUIRREL_CONSUMABLE_STEAL_CHANCE*100)}% 機率再偷 1 個消耗品；第 ${turns} 回合結束後帶著各自贓物逃跑。`,'dmg');}
  if(enemies.some(e=>e.type==='ninja'))log('🥷 忍者每第 3 回合使用穿刺；額外 30% 只磨損仍存在的防禦，不會轉為 HP 傷害。','dmg');
  if(enemies.some(e=>e.type==='zombie'))log(`🧟 殭屍群：共 ${enemies.length} 隻。兩次抓擊後撕咬；首次倒地後需補刀，否則以 30% HP 復活。`,'dmg');
  if(enemies.some(e=>e.type==='eagle')){const eg=eagleGrowth(floor);log(`🦅 老鷹擁有 ${eg.maxEvasion} 層閃避：16 點以下會被閃避，17～19 點可命中，20／21 點造成折翼。${eg.thunder?'成功閃避後會以雷霆俯衝反擊，傷及 HP 時施加麻痺。':''}`,'dmg');}
  if(enemies.some(e=>e.type==='skeleton')){const sg=skeletonGrowth(floor);log(`💀 骷髏戰士擁有 ${sg.maxArmor} 層骨甲：一般攻擊消耗 1 層並減傷 40%；20／21 點可直接粉碎全部骨甲。骨盾架勢恢復 ${sg.recover} 層。`,'dmg');}
  if(enemies.some(e=>e.type==='bat'))log(`🦇 蝙蝠群：共 ${enemies.length} 隻，行動節奏彼此錯開。每兩次撕咬後吸血，回復實際 HP 傷害的 50%；完全防禦時不會回血。`,'dmg');
  if(enemies.some(e=>e.type==='cyclops'))log(`👁️ 獨眼巨人：${legacyHeight(floor)>=26?'巨棒揮擊 → 凝視 → 粉碎重擊':'兩次巨棒揮擊 → 凝視 → 粉碎重擊'}。凝視時以 18～21 點成功攻擊可打眼中斷；重擊傷及 HP 會施加 1 層斷骨。`,'dmg');
  if(enemies.some(e=>e.type==='paladin')){const pg=paladinGrowth(floor),cycle=pg.pattern.map(a=>({normal:'斬擊',sunder:'破甲斬擊',guard:'聖盾',judgment:'神聖裁決'}[a])).join(' → ');log(`✝️ 聖騎士：${cycle}。破甲斬擊具有 30% 破防；聖盾提供 ${pg.shield} 護盾並驅散各負面狀態 10%${pg.pattern.includes('judgment')?'；裁決前打破聖盾即可中斷':''}。負面狀態施加量減半（向上取整）。`,'dmg');}
  if(enemies.some(e=>e.type==='werewolf'))log('🐺 狼人：狼爪造成流血，撕咬會依你的流血層數提高傷害；舔舐傷口時不攻擊，但你的流血越多，牠回復得越多。','dmg');
  if(enemies.some(e=>e.type==='mimic'))log('🧰 寶箱怪循環：毒牙啃咬 → 撕裂長舌 → 碎骨夾擊，傷及 HP 時依序施加中毒、流血與斷骨。','dmg');
  if(enemies.some(e=>e.type==='samurai'))log('⚔️ 武士：心流使所有基礎傷害永久 ×1.5，開局使用居合。20／21 點可破解見切；防禦會讓武士以殘心回血並強化燕返。','dmg');
  if(enemies.some(e=>e.type==='robot'))log('🤖 機器人循環：火焰噴射 → 電力充能 → 電弧放電 → 過熱冷卻。放電會吸收全部蓄勢，傷及 HP 時施加麻痺。','dmg');
  if(enemies.some(e=>e.type==='cultist'))log('🕯 每名邪教徒最多暫時奪取一項被動強化；20／21 點或達到傷害門檻可提前奪回。','dmg');
  if(enemies.some(e=>e.type==='gargoyle'))log(`🗿 石像鬼開局立即展開石像守護並正常行動；石像護盾永久保留且可累加。護盾足以支付死亡教徒最大 HP 的 50% 時，會消耗護盾使其以 45% HP 復活。石像封鎖會從主動與被動中隨機鎖定一項；以 20／21 點或單次對本體造成 ${gargoyleUnlockThreshold(floor)} 傷害可解除並歸還被奪強化。邪教徒每次讚頌使石像鬼永久攻擊 +${Math.round(gargoyleGrowth(floor).prayerPower*100)}%。此魔王從第 5 大關的魔王格開始出現。`,'dmg');
  if(enemies.some(e=>e.type==='kun')){const e=enemies.find(e=>e.type==='kun');log(`☯ 終極魔王第一階段「鯤」：HP 為一般魔王約 2.5 倍，擁有 70% 負面狀態抗性；開局北冥潮 ${e.northTide}/16 層。擊倒後將化為鵬。`,'dmg');log('🌊 北冥潮每 3 回合提高 2 層；滿潮後再次發動會提高生命上限。精準、重擊、擊破吞海，以及完全防住撞擊或覆海都能使潮位下降。','dmg');}
  if(enemies.some(e=>e.type==='dropbear'))log('🐨 掉落熊蓄力休息中，每第 3 回合猛攻一次（附中毒＋虛弱）！','dmg');
  enemies.filter(e=>['witch','dropbear','mimic','punishmentGargoyle'].includes(e.type)).forEach(e=>{
    const normal=enemyVirulenceRule(e,e.type==='mimic'?'venomBite':e.type==='dropbear'?'pounce':e.type==='punishmentGargoyle'?'poisonPunishment':'witchPoison');
    let detail=`每累積施加 ${normal.threshold} 層實際中毒，額外施加 ${normal.yield} 層猛毒`;
    if(e.type==='punishmentGargoyle'){const whip=enemyVirulenceRule(e,'toxicWhip');detail+=`；毒鞭則為 ${whip.threshold} 層中毒 → ${whip.yield} 層猛毒`;}
    log(`☣️ ${e.name}的施毒特性：${detail}。高度提升時轉換門檻會下降、猛毒量會提高。`,'dmg');
  });
  if(enemies.some(e=>e.type==='bloodDemon')){
    const dg=bloodDemonGrowth(floor);
    const cycle=dg.pattern.map(a=>a==='drain'?'吸血':'普攻').join(' → ');
    log(`😈 血魔循環：${cycle}｜吸血率 ${Math.round(dg.drainRate*100)}%，完全防住仍至少回復預定傷害的 25%；低於 15% HP 時吸血效率 ×1.5，整場最多 ${BALANCE.bloodDemonFrenzyUses} 次。從 15% 以上被打到低於 3% 時，本場僅一次鎖在 3% HP；血祭只在高於 30% HP 時發動`+(dg.sacrificeEvery?`｜每 ${dg.sacrificeEvery} 回合可能血祭強化`:'。'),'dmg');
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
  if(ownsP('doublebet'))requestLuckyNumber('battle',dealNewHand);else dealNewHand();
}

function startDuck(floor){
  clearLuckyNumber();
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
  $('btn-sheath').classList.add('hidden');
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
  if(hand.length>=5&&total<=21)mult*=1.5;
  if(activeSuitMastery()==='four_suits'&&hasFourSuits(hand))mult*=1.5;
  else if(activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4)mult*=1.75;
  else if(activeSuitMastery()==='alternating'&&fullyAlternating(hand))mult*=1.75;
  else if(activeSuitMastery()==='mono'&&G.bounty?.suitMainSuit&&rawSuitCount(hand,G.bounty.suitMainSuit)>hand.length/2)mult*=1.5;
  return mult;
}
function bountyGambleReward(base,total,hand){
  const normal=Math.round(base*bountyMultiplier(total,hand));
  return Math.round(normal*bountyGambleMultiplier(total));
}
function bountyBustPenaltyAmount(b=G.bounty,gold=G.gold){
  if(!b||!hasP('doublebet')||!validLuckyNumber(b.luckyNumber))return 0;
  const requested=b.luckyAllIn&&doublebetMastered()?b.base:Number(b.luckyNumber);return Math.min(Math.max(0,gold||0),Math.max(0,requested||0));
}
function bountySuitNotes(hand){
  const notes=[];
  if(activeSuitMastery()==='four_suits'&&hasFourSuits(hand))notes.push('四象 ×1.5');
  else if(activeSuitMastery()==='flush'&&maxSameSuit(hand)>=4)notes.push('同花 ×1.75');
  else if(activeSuitMastery()==='alternating'&&fullyAlternating(hand))notes.push('紅黑交替 ×1.75');
  else if(activeSuitMastery()==='mono'&&G.bounty?.suitMainSuit&&rawSuitCount(hand,G.bounty.suitMainSuit)>hand.length/2)notes.push(`純色 ${G.bounty.suitMainSuit}${suitName(G.bounty.suitMainSuit)} ×1.5`);
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
  const hasPrecedingBattle=source==='battle'||source.startsWith('event:'),inheritedMainSuit=activeSuitMastery()==='mono'?(hasPrecedingBattle?(G.battle?.suitMainSuit??dominantSuit(G.deck)):dominantSuit(G.deck)):null;
  const inherited=ownsP('doublebet')&&G.luckyPendingBounty&&validLuckyNumber(G.luckyNumber);
  if(ownsP('doublebet')&&!inherited)clearLuckyNumber();
  G.bounty={boss,base,source,deck:shuffle(bountyDeck()),hand:[],resolved:false,reward:0,penalty:0,bust:false,discardMode:false,luckyNumber:inherited?G.luckyNumber:null,luckyAllIn:inherited&&!!G.luckyAllIn,
    suitMode:false,suitSelected:null,suitMagicUsed:false,suitMainSuit:inheritedMainSuit,
    control:G.control,controlCap:BALANCE.controlMax};
  G.luckyPendingBounty=false;show('bounty');$('bounty-log').innerHTML='';renderBounty();renderTop();
  const begin=()=>{bountyDrawOne();bountyDrawOne();bountyLog(`🪙 基礎賞金 ${base}，決定要安全領取還是繼續追求倍率。`,'gd');renderBounty();renderTop();};
  if(ownsP('doublebet')&&!inherited)requestLuckyNumber('bounty',begin);else begin();
}
function renderBounty(){
  const b=G.bounty;if(!b)return;
  const ready=!ownsP('doublebet')||validLuckyNumber(b.luckyNumber);
  const total=handTotal(b.hand,false),five=b.hand.length>=5&&total<=21;
  const mult=total>21?0:bountyMultiplier(total,b.hand);
  const preview=b.resolved?b.reward:(total>21?0:bountyGambleReward(b.base,total,b.hand));
  $('bounty-base').textContent=`${b.base}🪙`;
  $('bounty-cards').innerHTML=b.hand.map((c,i)=>`<div class="card${c.red?' red':''}${b.discardMode?' discardable':''}${b.suitMode?' suit-selectable':''}${b.suitSelected===i?' suit-selected':''}" data-bi="${i}"><div class="v">${cardLabel(c)}</div><div class="s">${c.s}</div></div>`).join('');
  if(b.discardMode)$('bounty-cards').querySelectorAll('[data-bi]').forEach(el=>el.onclick=()=>bountyDiscardCard(+el.dataset.bi));
  else if(b.suitMode)$('bounty-cards').querySelectorAll('[data-bi]').forEach(el=>el.onclick=()=>{b.suitSelected=+el.dataset.bi;renderBounty();});
  $('bounty-total').textContent=total;$('bounty-total').classList.toggle('bust',total>21);
  const suitNotes=bountySuitNotes(b.hand);
  const gamble=bountyGambleProfile(total),gambleRate=gamble.number?`｜🎲 ${gamble.label} ×${gamble.multiplier.toFixed(2)}`:'';
  $('bounty-lucky').textContent=!ownsP('doublebet')?'':gamble.number?`🎲 幸運數字 ${gamble.number}${b.luckyAllIn?'｜孤注一擲啟用中':''}｜目前：${gamble.label}`:'🎲 尚未選擇幸運數字';
  const bustLoss=gamble.number?(b.luckyAllIn&&doublebetMastered()?b.base:gamble.number):0;
  $('bounty-rate').textContent=total>21?`💥 爆牌：賞金歸零${bustLoss?`，將損失最多 ${bustLoss}🪙`:''}`:`目前倍率 ×${Number(mult.toFixed(3))}${five?'（五龍 ×1.5）':''}${suitNotes.length?`｜${suitNotes.join('、')}`:''}${gambleRate}`;
  $('bounty-preview').textContent=b.resolved?(b.penalty>0?`爆牌倒扣 ${b.penalty}🪙`:b.bust?'賞金沒收：0🪙':`獲得 ${b.reward}🪙`):`目前可領取 ${preview}🪙`;
  $('bounty-deck-count').textContent=`賞金牌堆剩餘 ${b.deck.length} 張｜控制值 ${b.control}/${b.controlCap}，與一般關卡共用；金錢回合不回復｜傷害、防禦與術式不參與計算${activeSuitMastery()==='mono'?(b.suitMainSuit?`｜沿用主花色 ${b.suitMainSuit}${suitName(b.suitMainSuit)}`:'｜本局沒有純色主花色'):''}`;
  $('bounty-hit').disabled=b.resolved||!ready;
  $('bounty-cash').textContent=b.resolved?'繼續爬塔 ➜':'領取賞金';$('bounty-cash').disabled=!ready;
  const configs=[['bounty-redraw','redraw',`重抽 −${currentControlCost('redraw')}（控制 ${b.control}/${b.controlCap}）`],['bounty-peek','peek',`透視 −${currentControlCost('peek')}（控制 ${b.control}/${b.controlCap}）`],['bounty-discard','cardsharp',b.discardMode?'點選一張牌丟棄（取消）':`🤵 老千 −${currentControlCost('cardsharp')}（控制 ${b.control}/${b.controlCap}）`]];
  configs.forEach(([id,passive,label])=>{const el=$(id),cost=currentControlCost(passive);el.classList.toggle('hidden',!hasP(passive));el.textContent=label;el.disabled=b.resolved||!ready||b.control<cost;});
  const magic=$('bounty-suitmagic'),magicCost=currentControlCost('suitmage');magic.classList.toggle('hidden',!hasP('suitmage'));
  magic.textContent=b.suitMagicUsed?'🎭 本副手牌已改色':b.suitMode?'🎭 選擇手牌（按此取消）':`🎭 花色魔術 −${magicCost}（控制 ${b.control}/${b.controlCap}）`;
  magic.disabled=b.resolved||!ready||b.suitMagicUsed||b.control<magicCost;
  renderSuitPicker('bounty-suit-picker',b.suitMode&&b.suitSelected!=null,s=>changeBountySuit(s));
}
function bountyHit(){
  const b=G.bounty;if(!b||b.resolved||(ownsP('doublebet')&&!validLuckyNumber(b.luckyNumber)))return;
  b.discardMode=false;b.suitMode=false;b.suitSelected=null;const c=bountyDrawOne();bountyLog(`抽到 ${cardLabel(c)}${c.s}`,'hit');
  if(handTotal(b.hand,false)>21){bountyLog('💥 爆牌！本層賞金全數沒收。','dmg');resolveBounty(true);}else renderBounty();
}
function bountyCash(){
  const b=G.bounty;if(!b)return;
  if(ownsP('doublebet')&&!validLuckyNumber(b.luckyNumber))return;
  if(b.resolved){leaveBounty();return;}
  resolveBounty(false);
}
function resolveBounty(bust){
  const b=G.bounty;if(!b||b.resolved)return;
  b.bust=bust;b.resolved=true;
  const total=handTotal(b.hand,false);
  b.reward=bust?0:bountyGambleReward(b.base,total,b.hand);b.penalty=0;
  const gamble=bountyGambleProfile(total);
  if(gamble.number&&hasP('doublebet')){
    if(bust){b.penalty=bountyBustPenaltyAmount(b);G.gold-=b.penalty;bountyLog(`🎲 幸運數字 ${gamble.number} 賞金爆牌：${b.luckyAllIn&&doublebetMastered()?'孤注一擲倒扣基礎賞金':'倒扣等同幸運數字的金幣'}，實際失去 ${b.penalty} 金幣。`,'dmg');}
    else if(gamble.active)bountyLog(`🎲 幸運數字 ${gamble.number}・${gamble.label}：賞金 ×${gamble.multiplier.toFixed(2)}！`,'gd');
    else bountyLog(`🎲 幸運數字 ${gamble.number} 未命中：本次沒有額外賞金倍率。`,'');
  }
  if(!bust&&hasP('bountyhunter')&&(total===20||total===21)){
    const bonus=Math.round(bountyMultiplier(total,b.hand)*10);
    G.bountyHunt={bonuses:isUp('bountyhunter')?[bonus,Math.round(bonus*0.5)]:[bonus]};
    bountyLog(`💰 賞金獵人：下一場戰鬥首擊 +${bonus}`+(isUp('bountyhunter')?`，第二擊 +${Math.round(bonus*0.5)}`:'')+'。','good');
  }
  if(b.reward>0){gainGold(b.reward);SFX.coin();bountyLog(`🏆 賞金結算：獲得 ${b.reward} 金幣！`,'gd');}
  renderBounty();renderTop();
}
function leaveBounty(){
  const b=G.bounty;if(!b||!b.resolved)return;
  const boss=b.boss,source=b.source;G.bounty=null;clearLuckyNumber();
  if(source==='treasureChest'){advanceNode();return;}
  if(source.startsWith('event:'))finishEventBattleReward(source);
  else if(collectorMaterialDropEligible(boss,source))openCardDrop(false,source);
  else if(source==='duckBattle')proceedAfterWin(false);
  else proceedAfterWin(boss);
}
function bountyRedraw(){
  const b=G.bounty,cost=currentControlCost('redraw');if(!b||b.resolved||(ownsP('doublebet')&&!validLuckyNumber(b.luckyNumber))||b.control<cost)return;
  b.control-=cost;G.control=b.control;b.discardMode=false;b.suitMode=false;b.suitSelected=null;b.suitMagicUsed=false;b.hand=[];bountyDrawOne();bountyDrawOne();bountyLog(`🔄 重抽賞金手牌（控制值 −${cost}）`,'hit');renderBounty();renderTop();
}
function bountyPeek(){
  const b=G.bounty,cost=currentControlCost('peek');if(!b||b.resolved||(ownsP('doublebet')&&!validLuckyNumber(b.luckyNumber))||b.control<cost)return;
  b.control-=cost;G.control=b.control;const n=isUp('peek')?4:3;
  bountyLog(`👁️ 接下來 ${n} 張：${b.deck.slice(-n).reverse().map(c=>cardLabel(c)+c.s).join('  ')}`,'hit');renderBounty();renderTop();
}
function bountyToggleDiscard(){
  const b=G.bounty,cost=currentControlCost('cardsharp');if(!b||b.resolved||(ownsP('doublebet')&&!validLuckyNumber(b.luckyNumber))||b.control<cost)return;
  b.discardMode=!b.discardMode;b.suitMode=false;b.suitSelected=null;renderBounty();
}
function bountyToggleSuitMagic(){
  const b=G.bounty,cost=currentControlCost('suitmage');if(!b||b.resolved||b.suitMagicUsed||(ownsP('doublebet')&&!validLuckyNumber(b.luckyNumber))||b.control<cost)return;
  b.suitMode=!b.suitMode;b.suitSelected=null;b.discardMode=false;renderBounty();
}
function changeBountySuit(suit){
  const b=G.bounty,cost=currentControlCost('suitmage'),c=b&&b.hand[b.suitSelected];if(!c||!SUITS.includes(suit)||b.suitMagicUsed||b.control<cost)return;
  if(c.s===suit){b.suitMode=false;b.suitSelected=null;renderBounty();return;}
  const old=c.s;c.s=suit;c.red=suit==='♥'||suit==='♦';b.control-=cost;b.suitMagicUsed=true;G.control=b.control;b.suitMode=false;b.suitSelected=null;
  bountyLog(`🎭 將 ${cardLabel(c)}${old} 變為 ${cardLabel(c)}${suit}（控制值 −${cost}）`,'good');renderBounty();renderTop();
}
function bountyDiscardCard(i){
  const b=G.bounty,cost=currentControlCost('cardsharp');if(!b||b.resolved||!b.discardMode||b.control<cost||!b.hand[i])return;
  const c=b.hand.splice(i,1)[0];b.control-=cost;G.control=b.control;b.discardMode=false;bountyLog(`🤵 老千丟棄 ${cardLabel(c)}${c.s}（控制值 −${cost}）`,'hit');renderBounty();renderTop();
}

function frontAlive(){return G.battle.enemies.find(e=>e.curhp>0);}
function ghostInvincible(e){return e.type==='ghost'&&G.battle.round%3===0;}
function witchPoisonTurn(e){return e.type==='witch'&&G.battle.round%5===0;}
function bearTurn(e){return e.type==='bear'&&(G.battle.round===1||G.battle.round%5===0);}
function platypusTurn(e){return e.type==='platypus'&&(G.battle.round===1||G.battle.round%3===0);}
function dropbearAttacks(r){return r%3===0;} // 休息 2 回合、第 3 回合猛攻
function ninjaPierces(r){return r%3===0;}
function zombieAction(e){return (e.zombieStep||0)%3===2?'bite':'normal';}
function zombieFinishThreshold(floor){return Math.min(24,12+floorScaling(floor).tier*2);}
function skeletonGrowth(floor){const height=legacyHeight(floor);return {maxArmor:3,recover:height>=16?2:1,guardEvery:height>=31?2:3,rageMult:1.35,damageReduction:0.4};}
function skeletonAction(e,floor){const sg=skeletonGrowth(floor);return (e.skeletonStep||0)%sg.guardEvery===sg.guardEvery-1?'guard':'normal';}
function eagleGrowth(floor){const tier=floorScaling(floor).tier;return {maxEvasion:tier>=2?2:1,diveMult:tier>=4?1.6:1.4,thunder:tier>=4,paralysis:1};}
function robotGrowth(floor){const tier=floorScaling(floor).tier;return {burn:tier>=2?3:2,paralysis:tier>=4?2:1,focusRate:tier>=2?0.75:0.5,chargeShield:tier>=4?12:0};}
function robotAction(e){return ['fire','charge','electric','cool'][(e.robotStep||0)%4];}
function refreshRobotElectric(e){
  if(e.type!=='robot'||e.robotAction!=='electric')return;
  const rg=robotGrowth(G.floor);e.focusAbsorb=Math.floor((G.battle.focus||0)*rg.focusRate);e.nextDmg=Math.max(1,Math.round((e.baseNextDmg||0)*1.4)+e.focusAbsorb);
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
const UPGRADE_USE_LIMITS={};
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
  const all=G.upgrades.filter(id=>ownsP(id)&&!skillIsLocked(id)&&!hostileSealProtected(id)&&!bladePassiveProtected(id)&&!upgradeStolen(id)),choices=all.length>1?all.filter(id=>id!==b.lastStolenUpgrade):all;
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
    let choices=G.passives.filter(id=>!skillLockProtected(id)&&!bladePassiveProtected(id)&&!existing.has(id)&&id!==b.lastLockedSkill&&!upgradeStolen(id));
    if(!choices.length)choices=G.passives.filter(id=>!skillLockProtected(id)&&!bladePassiveProtected(id)&&!existing.has(id)&&!upgradeStolen(id));
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
    const choices=G.passives.filter(id=>!skillLockProtected(id)&&!bladePassiveProtected(id)&&!existing.has(id)&&!upgradeStolen(id));if(!choices.length)break;
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
  const before=G.hp;G.hp=Math.min(G.maxhp,G.hp+adjusted);const healed=G.hp-before;recordHealing(healed,lifesteal);return {healed,adjusted,mult};
}
function healPlayer(amount,lifesteal=false){
  const mult=miracleType()==='holy'&&!lifesteal?2:1,before=G.hp,adjusted=Math.max(0,Math.round(amount*mult));
  G.hp=Math.min(G.maxhp,G.hp+adjusted);const healed=G.hp-before;recordHealing(healed,lifesteal);return {healed,adjusted,mult};
}
function sepsisMultiplier(target){return 1+Math.max(0,target&&target.sepsis||0)*0.15;}
function traumaAttackMultiplier(target){return 1+Math.max(0,target&&target.trauma||0)*0.3;}
function traumaStatusMultiplier(target){return 1+Math.max(0,target&&target.trauma||0);}
function playerStatusResistance(){const antidote=hasP('antidote')?(isUp('antidote')?0.6:0.4):0;return Math.min(1,antidote+(miracleType()==='holy'?0.3:0));}
function resistedStatusAmount(target,amount){
  const raw=Math.max(0,amount||0),playerTarget=target===G.battle,resist=Math.min(1,Math.max(0,playerTarget?playerStatusResistance():target&&target.statusResist||0));
  if(raw<=0)return 0;const resisted=Math.max(1,Math.ceil(raw*(1-resist)-1e-9));return playerTarget?Math.ceil(resisted*statusGainMultiplier()):resisted;
}
function applyReflectedStatus(target,key,amount){
  if(!target||target.curhp<=0||amount<=0||!REFLECTABLE_STATUS_KEYS.has(key))return 0;
  const applied=resistedStatusAmount(target,amount);if(applied<=0)return 0;
  if(key==='weakness'){const before=Math.max(0,target.weakness||0);target.weakness=Math.min(9,before+applied);return target.weakness-before;}
  if(key==='burn'||key==='bleed'){
    const cap=key==='burn'?BURN_CAP:BLEED_CAP,before=Math.max(0,target[key]||0),gained=Math.min(Math.max(0,cap-before),applied),overflow=applied-gained;
    target[key]=before+gained;if(overflow>0){target.trauma=Math.max(0,target.trauma||0)+overflow;target.traumaFresh=true;}return gained+overflow;
  }
  target[key]=Math.max(0,target[key]||0)+applied;if(key==='virulence'&&target[key]===applied)target.virulenceTicks=0;if(key==='trauma')target.traumaFresh=true;return applied;
}
function reflectPurificationReduction(key,raw,actual,source){
  const b=G.battle,reduced=Math.max(0,Math.floor(raw)-Math.floor(actual));
  if(!b||!mirrorBladeActive()||!hasP('antidote')||!REFLECTABLE_STATUS_KEYS.has(key)||reduced<=0||!source||source.curhp<=0)return 0;
  const reflected=applyReflectedStatus(source,key,reduced);if(reflected<=0)return 0;
  const status=PURIFIABLE_STATUS_DEFS.find(item=>item.key===key),room=Math.max(0,10-(b.samuraiMirrorFlowThisEnemyTurn||0)),flow=Math.min(room,reflected);
  b.samuraiMirrorFlowThisEnemyTurn=(b.samuraiMirrorFlowThisEnemyTurn||0)+flow;if(flow>0)addSamuraiFlow(flow,`明鏡打刀・返照 ${status?.name||key}`);
  log(`🪞 返照：淨化抗性抵銷 ${reduced} 層${status?.name||key}，${source.name}實際承受 ${reflected} 層反射${flow?`，轉為 ${flow} 心流`:''}。`,'gd');return reflected;
}
function resistedPlayerStatusAmount(key,amount,source=null){const actual=resistedStatusAmount(G.battle,amount);reflectPurificationReduction(key,amount,actual,source);return actual;}
function statusHeightBonus(floor=G.floor){return Math.max(0,Math.floor(Math.log2(1+chapterIndex(floor)/4)));}
function enemyStatusRankBonus(e){return e&&e.ultimate?2:e&&(e.boss||e.ultimateMinion)?1:0;}
function enemyStatusRaw(e,base){return Math.max(1,Math.round(base||1)+statusHeightBonus()+enemyStatusRankBonus(e));}
function addWeakness(e,base=3){return addLimitedStatus(G.battle,'weakness',enemyStatusRaw(e,base),9,e);}
function applyHesitation(e,baseThreat=3){
  const b=G.battle;if(!b)return 0;
  const threat=enemyStatusRaw(e,baseThreat),mitigation=Math.round(playerStatusResistance()*3),baseAllowance=Math.max(2,Math.min(5,6-threat+mitigation)),allowance=Math.ceil(baseAllowance*statusGainMultiplier());
  b.hesitation=b.hesitation>0?Math.min(b.hesitation,allowance):allowance;return b.hesitation;
}
function addTimedStatus(e,key,base=1,cap=5){return addLimitedStatus(G.battle,key,enemyStatusRaw(e,base),cap,e);}
function addParalysis(e,base=1){const b=G.battle;if(!b)return 0;const raw=enemyStatusRaw(e,base),gained=resistedPlayerStatusAmount('paralysis',raw,e);b.paralysis=Math.max(0,b.paralysis||0)+gained;return gained;}
function addPlayerPoison(amount,source=null){const gained=resistedPlayerStatusAmount('poison',amount,source);G.poison+=gained;return gained;}
function enemyVirulenceRule(e,action=''){
  const nature={witch:[2,1],dropbear:[6,1],mimic:[4,1],punishmentGargoyle:[4,2]}[e&&e.type]||[8,1];
  const height=Math.max(0,chapterIndex(G.floor)),threshold=Math.max(2,nature[0]-Math.floor(height/3));
  const yieldPerTrigger=nature[1]+Math.floor(height/8)+(action==='toxicWhip'?1:0);
  return {threshold,yield:yieldPerTrigger};
}
function addEnemyPoison(e,amount,action=''){
  const poison=addPlayerPoison(amount,e),rule=enemyVirulenceRule(e,action);if(poison<=0)return {poison:0,virulence:0,...rule};
  const effects={witchPoison:'劇毒',pounce:'猛撲劇毒',venomBite:'毒牙中毒',poisonPunishment:'毒刑',toxicWhip:'毒鞭'};rememberPlayerStatusSource('poison',e,effects[action]||'中毒');
  e.virulenceProgress=(e.virulenceProgress||0)+poison;const triggers=Math.floor(e.virulenceProgress/rule.threshold);e.virulenceProgress%=rule.threshold;
  const rawVirulence=triggers*rule.yield,virulence=rawVirulence>0?resistedPlayerStatusAmount('virulence',rawVirulence,e):0;
  if(virulence>0){const had=(G.battle.virulence||0)>0;G.battle.virulence=(G.battle.virulence||0)+virulence;if(!had)G.battle.virulenceTicks=0;log(`☣️ ${e.name}的毒性突破：每 ${rule.threshold} 層中毒轉為 ${rule.yield} 層猛毒，本次猛毒 +${virulence}（目前 ${G.battle.virulence}）。`,'dmg');}
  return {poison,virulence,threshold:rule.threshold,yield:rule.yield,progress:e.virulenceProgress};
}
function addLimitedStatus(target,key,amount,cap,source=null){if(!target)return 0;const before=Math.max(0,target[key]||0),applied=target===G.battle?resistedPlayerStatusAmount(key,amount,source):resistedStatusAmount(target,amount);target[key]=Math.min(cap,before+applied);return target[key]-before;}
function addTrauma(target,amount=1){
  if(!target||amount<=0)return 0;
  const gained=Math.max(0,Math.floor(amount));target.trauma=Math.max(0,target.trauma||0)+gained;
  if(gained>0)target.traumaFresh=true;
  return gained;
}
function addCappedStatusWithTrauma(target,key,amount,cap,source=null){
  if(!target)return {gained:0,traumaGained:0,remaining:0};
  const applied=target===G.battle?resistedPlayerStatusAmount(key,amount,source):resistedStatusAmount(target,amount),before=Math.max(0,target[key]||0);
  const room=Math.max(0,cap-before),gained=Math.min(room,applied),traumaGained=Math.max(0,applied-gained);
  target[key]=before+gained;if(traumaGained)addTrauma(target,traumaGained);
  return {gained,traumaGained,remaining:target[key]};
}
function addBleed(target,amount,source=null,effect='流血'){const result=addCappedStatusWithTrauma(target,'bleed',amount,BLEED_CAP,source);if(target===G.battle&&(result.gained||result.traumaGained)&&source)rememberPlayerStatusSource('bleed',source,effect);return result;}
function addBurn(target,amount,source=null,effect='燒傷'){const result=addCappedStatusWithTrauma(target,'burn',amount,BURN_CAP,source);if(target===G.battle&&(result.gained||result.traumaGained)&&source)rememberPlayerStatusSource('burn',source,effect);return result;}
function addSepsis(target,amount,source=null){return addLimitedStatus(target,'sepsis',amount,5,source);}
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
function addFracture(target,amount,source=null){return addLimitedStatus(target,'fracture',amount,3,source);}
function setPlayerPurifiableStatus(key,value){
  const b=G.battle,next=Math.max(0,value||0);if(!b)return;
  if(key==='poison')G.poison=next;else b[key]=next;
  if(key==='virulence'&&next===0)b.virulenceTicks=0;
  if(key==='burn'&&next===0){b.burnTicks=0;b.burnRoundTicks=0;}
  if(key==='trauma'&&next===0){b.traumaFresh=false;b.traumaDecayTicks=0;}
}
function purgePlayerStatuses(amountPerType=1,target=null,reflect=false,reflectCap=Infinity){
  const removed=[];PURIFIABLE_STATUS_DEFS.forEach(status=>{
    const before=playerPurifiableStatusValue(status.key);if(before<=0)return;
    const amount=Math.min(before,Math.max(0,amountPerType)),after=before-amount;setPlayerPurifiableStatus(status.key,after);
    let reflected=0;if(reflect&&REFLECTABLE_STATUS_KEYS.has(status.key))reflected=applyReflectedStatus(target,status.key,Math.min(amount,reflectCap));
    removed.push({...status,amount,reflected});
  });return removed;
}
function settleMirrorPurgingIaido(dealt,target,flowAtSubmit){
  if(!mirrorBladeActive()||dealt<=0||flowAtSubmit<25)return [];
  const breaking=flowAtSubmit>=75,removed=purgePlayerStatuses(breaking?2:1,target,breaking);if(!removed.length)return removed;
  const flow=Math.min(10,removed.length*2);if(flow>0)addSamuraiFlow(flow,'明鏡打刀・祓斬');
  log(`🪞 ${breaking?'破邪祓斬':'祓斬'}：${removed.map(item=>`${item.name} −${item.amount}${item.reflected?`（反射 ${item.reflected}）`:''}`).join('、')}${flow?`，心流 +${flow}`:''}。`,'gd');return removed;
}
function settleMirrorUltimate(target){
  const removed=purgePlayerStatuses(Infinity,target,true,10);if(removed.length)log(`🪞 明鏡止水：清除 ${removed.map(item=>`${item.name} ${item.amount}`).join('、')}${removed.some(item=>item.reflected)?`；反射 ${removed.filter(item=>item.reflected).map(item=>`${item.name} ${item.reflected}`).join('、')}`:''}。`,'gd');
  else log('🪞 明鏡止水：心境本已澄明，沒有可淨化狀態。','good');return removed;
}
function fractureMultiplier(target){return Math.max(0.55,1-Math.max(0,target&&target.fracture||0)*0.15);}
function toxicologyPoisonProfile(hand,allowThousand=true){
  if(!hasP('toxicology'))return 0;
  const maxRank=isUp('toxicology')?4:3;
  const base=hand.reduce((sum,c)=>sum+(typeof c.r==='number'&&c.r>=2&&c.r<=maxRank?c.r:0),0),thousand=allowThousand&&hasP('thousandstrikes'),extra=thousand?(isUp('thousandstrikes')?Math.min(6,base):Math.min(3,Math.ceil(base*.5))):0;
  return {base,extra,total:base+extra};
}
function toxicologyPoison(hand,allowThousand=true){const profile=toxicologyPoisonProfile(hand,allowThousand);return profile&&profile.total||0;}
function applyToxicology(target,hand,allowThousand=true){
  const profile=toxicologyPoisonProfile(hand,allowThousand);if(!profile)return 0;const rawPoison=profile.total,poison=resistedStatusAmount(target,rawPoison);
  if(!target||target.curhp<=0||target.downed||poison<=0)return 0;
  target.poison=(target.poison||0)+poison;SFX.poison();
  log(`⚗️ 毒物學：原始 ${profile.base} 層${profile.extra?`，一瞬千擊增幅後 ${rawPoison} 層`:''}，${target.name} 抗性後實得 ${poison} 層${poison<rawPoison?`（抵銷 ${rawPoison-poison}）`:''}（目前 ${target.poison} 層）`,'good');
  const threshold=isUp('toxicology')?8:10;target.toxicologyProgress=(target.toxicologyProgress||0)+poison;
  const virulenceGained=Math.floor(target.toxicologyProgress/threshold);target.toxicologyProgress%=threshold;
  if(virulenceGained>0){const hadVirulence=(target.virulence||0)>0;target.virulence=(target.virulence||0)+virulenceGained;if(!hadVirulence)target.virulenceTicks=0;log(`☣️ 毒性突破：${target.name} 猛毒 +${virulenceGained}（目前 ${target.virulence} 層，中毒傷害 +${target.virulence*10}%｜進度 ${target.toxicologyProgress}/${threshold}）。`,'good');}
  if(G.battle&&G.battle.inquisitorBattle&&(INQUISITOR_LEADERS.includes(target.type)||target.inquisitorEscort))addInquisitorStatusCrime(poison,'毒物學');
  if(virulenceGained>0&&G.battle&&G.battle.inquisitorBattle&&(INQUISITOR_LEADERS.includes(target.type)||target.inquisitorEscort))addInquisitorStatusCrime(virulenceGained,'猛毒');
  return poison;
}
function virulenceMultiplier(target){return 1+Math.max(0,target&&target.virulence||0)*0.1;}
function decayVirulence(target){
  if(!target||(target.virulence||0)<=0){if(target)target.virulenceTicks=0;return 0;}
  target.virulenceTicks=(target.virulenceTicks||0)+1;if(target.virulenceTicks<10)return 0;
  target.virulenceTicks=0;target.virulence--;return 1;
}
function tickBurnStatus(b){
  if(!b||b.burn<=0)return null;
  const damage=Math.round(b.burn*2*traumaStatusMultiplier(b));b.burnTicks=(b.burnTicks||0)+1;
  const threshold=b===G.battle&&burnwindActive()?4:2,decays=b.burnTicks>=threshold;if(decays){b.burn=Math.max(0,b.burn-1);b.burnTicks=0;}
  return {damage,decays,remaining:b.burn,threshold,nextIn:threshold-(b.burnTicks||0)};
}
function triggerBurnOnDraw(){
  const b=G.battle;if(!b||b.over||b.burn<=0)return true;
  const burn=tickBurnStatus(b);losePlayerHp(burn.damage,statusDamageSource('burn'));SFX.hurt();
  log(`🔥 額外抽牌引燃燒傷：−${burn.damage} HP${burn.decays?`，自然降為 ${burn.remaining} 層`:`；層數維持 ${burn.remaining}（再額外抽 ${burn.nextIn} 張自然 −1）`}。`,'dmg');
  renderTop();updateIncoming();
  if(G.hp<=0&&!tryHolyMiracleRevive()){gameOver();return false;}
  return true;
}
function decayPlayerBurnByRound(){
  const b=G.battle;if(!b||b.burn<=0){if(b)b.burnRoundTicks=0;return 0;}
  const threshold=burnwindActive()?2:1;b.burnRoundTicks=(b.burnRoundTicks||0)+1;if(b.burnRoundTicks<threshold)return 0;
  b.burnRoundTicks=0;b.burn--;return 1;
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
function squirrelSteal(enemy){
  if(!enemy||enemy.type!=='squirrel'||enemy.curhp<=0)return 0;
  const amt=Math.min(G.gold,Math.max(10,Math.round(G.gold*0.15)));
  G.gold-=amt;enemy.stolenGold=(enemy.stolenGold||0)+amt;
  log(`🐿️ ${enemy.name}偷走了 ${amt} 金幣！擊敗牠即可取回這一份贓物。`,'dmg');
  const carried=CONSUMABLES.filter(item=>consumableCount(item.id)>0);
  if(carried.length&&gameRandom()<SQUIRREL_CONSUMABLE_STEAL_CHANCE){const item=carried[rnd(0,carried.length-1)];removeConsumable(item.id);enemy.stolenConsumables=enemy.stolenConsumables||{};enemy.stolenConsumables[item.id]=(enemy.stolenConsumables[item.id]||0)+1;log(`🎒 ${enemy.name}又偷走了 1 個${item.icon}${item.name}！擊敗這隻松鼠才能取回。`,'dmg');}
  renderTop();return amt;
}
function recoverSquirrelGold(enemy){
  const amount=Math.max(0,Math.round(enemy&&enemy.stolenGold||0)),items=Object.entries(enemy&&enemy.stolenConsumables||{}).filter(([,count])=>count>0);
  if(amount){G.gold+=amount;enemy.stolenGold=0;log(`🐿️ 擊敗 ${enemy.name}，取回牠偷走的 ${amount} 金幣！`,'gd');}
  items.forEach(([id,count])=>{const item=consumableInfo(id);if(!item)return;G.consumables=G.consumables||{};G.consumables[id]=Math.min(CONSUMABLE_STACK_LIMIT,consumableCount(id)+count);log(`🎒 從 ${enemy.name} 身上取回 ${item.icon}${item.name} ×${count}。`,'gd');});
  if(enemy)enemy.stolenConsumables={};if(amount||items.length)SFX.coin();renderTop();return amount;
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
  if(e.type==='bloodDemon')e.bloodDemonAction=bloodDemonAction(e,G.battle.round,G.floor);
  if(e.type==='samurai'){const action=samuraiAction(e);if(action==='mikiri'&&e.samuraiAction!=='mikiri')e.mikiriOutcome=null;e.samuraiAction=action;}
  if(e.type==='ronin'){const action=roninAction(e);if(action==='mikiri'&&e.roninAction!=='mikiri')e.mikiriOutcome=null;e.roninAction=action;}
  if(INQUISITOR_LEADERS.includes(e.type))e.inquisitorAction=inquisitorAction(e);
  if(e.type==='dragon')e.dragonAction=dragonAction(e,G.floor);
  if(e.type==='kun')e.kunAction=kunAction(e,G.battle.round);
  if(e.type==='peng')e.pengAction=pengAction(e);
  if(['cultLeader',...COURT_GARGOYLES].includes(e.type))e.courtAction=courtAction(e);
  if(e.type==='cthulhu')e.cthulhuAction=cthulhuAction(e);
  if(e.type==='zombie'&&e.downed)e.nextDmg=0;
  else if(e.type==='robot'&&(e.robotAction==='charge'||e.robotAction==='cool')){
    e.nextDmg=0;e.focusAbsorb=0;
  }
  else if(e.type==='cultist'&&e.cultistAction==='prayer')e.nextDmg=0;
  else if(e.type==='gargoyle'&&e.gargoyleAction==='guard')e.nextDmg=0;
  else if(e.type==='skeleton'&&e.skeletonAction==='guard')e.nextDmg=0;
  else if(e.type==='cyclops'&&e.cyclopsAction==='gaze')e.nextDmg=0;
  else if(e.type==='paladin'&&e.inquisitorSync==='warcry')e.nextDmg=0;
  else if(e.type==='paladin'&&!e.inquisitorSync&&e.paladinAction==='guard')e.nextDmg=0;
  else if(e.type==='werewolf'&&e.werewolfAction==='lick')e.nextDmg=0;
  else if(e.type==='dropbear'&&!dropbearAttacks(G.battle.round))e.nextDmg=0;
  else if(e.type==='bloodDemon'&&e.bloodDemonAction==='sacrifice')e.nextDmg=0;
  else if(e.type==='samurai'&&e.samuraiAction==='mikiri'){e.nextDmg=0;e.nextArmorBreak=0;e.samuraiParts=[];}
  else if(e.type==='ronin'&&e.roninAction==='mikiri'){e.nextDmg=0;e.nextArmorBreak=0;e.roninParts=[];}
  else if(INQUISITOR_LEADERS.includes(e.type)&&['proclamation','chargePrep','transition','confiscate'].includes(e.inquisitorAction))e.nextDmg=0;
  else if(e.type==='dragon'&&e.dragonAction==='sleep')e.nextDmg=0;
  else if(e.type==='kun'&&['pressure','devour','divinity'].includes(e.kunAction))e.nextDmg=0;
  else if(e.type==='peng'&&['rebirth','eclipse','transition'].includes(e.pengAction))e.nextDmg=0;
  else if(e.type==='disciplineGargoyle'&&['skillSeal','brandGaze'].includes(e.courtAction)||e.type==='punishmentGargoyle'&&e.courtAction==='skillSeal'||e.type==='cultLeader'&&e.courtAction==='obsidianAbsolution'||e.type==='cthulhu'&&e.cthulhuAction==='abyssRegeneration')e.nextDmg=0;
  else{
    const base=rnd(e.atk[0],e.atk[1]);
    e.baseNextDmg=base;
    if(e.type==='samurai')prepareSamuraiDamage(e,base);
    else if(e.type==='ronin')prepareRoninDamage(e,base);
    else if(e.type==='inquisitorMounted')e.nextDmg=inquisitorMountedDamage(e,base);
    else if(e.type==='inquisitor')e.nextDmg=inquisitorFootDamage(e,base);
    else if(e.type==='bloodDemon')e.nextDmg=Math.max(1,Math.round(base*(1+(e.bloodPower||0))));
    else if(e.type==='gargoyle')e.nextDmg=Math.max(1,Math.round(base*(1+(e.gargoylePower||0))));
    else if(e.type==='skeleton'&&e.boneRage)e.nextDmg=Math.max(1,Math.round(base*skeletonGrowth(G.floor).rageMult));
    else if(e.type==='cyclops'&&e.cyclopsAction==='smash')e.nextDmg=Math.max(1,Math.round(base*cyclopsGrowth(G.floor).smashMult));
    else if(e.type==='paladin'&&e.inquisitorSync==='holyCharge')e.nextDmg=Math.max(1,Math.round(base*1.8*(1+(G.battle.warcryStacks||0)*.25)*inquisitorEscortAftermathMultiplier(e)));
    else if(e.type==='paladin'&&e.inquisitorSync==='verdictStrike')e.nextDmg=Math.max(1,Math.round(base*1.25*inquisitorSinMultiplier(e,true)*inquisitorEscortAftermathMultiplier(e)));
    else if(e.type==='paladin'&&e.inquisitorEscort&&G.battle.inquisitorPhase===2){const own=e.paladinAction==='judgment'?paladinGrowth(G.floor).judgmentMult:1;e.nextDmg=Math.max(1,Math.round(base*own*inquisitorSinMultiplier(e,false)*inquisitorEscortAftermathMultiplier(e)));}
    else if(e.type==='paladin'&&e.paladinAction==='judgment')e.nextDmg=Math.max(1,Math.round(base*paladinGrowth(G.floor).judgmentMult));
    else if(e.type==='werewolf'&&e.werewolfAction==='bite')e.nextDmg=Math.max(1,Math.round(base*werewolfBiteMultiplier()));
    else if(e.type==='mimic')e.nextDmg=Math.max(1,Math.round(base*mimicDamageMultiplier(e.mimicAction)));
    else if(e.type==='zombie'&&e.zombieAction==='bite')e.nextDmg=Math.max(1,Math.round(base*1.35));
    else if(e.type==='robot'&&e.robotAction==='fire')e.nextDmg=Math.max(1,Math.round(base*1.1));
    else if(e.type==='robot'&&e.robotAction==='electric'){
      const rg=robotGrowth(G.floor);e.focusAbsorb=Math.floor((G.battle.focus||0)*rg.focusRate);e.nextDmg=Math.max(1,Math.round(base*1.4)+e.focusAbsorb);
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
function setTarget(idx){const b=G.battle;if(b.over)return;const e=b.enemies.find(x=>x.idx===idx&&x.curhp>0);if(!e)return;b.target=idx;if(b.samuraiPoisonDraw&&!(e.poison>0))clearPoisonDraw();renderEnemies();renderPoisonDrawControls();updateOutgoing();}

function vitalBarMarkup(hp,maxhp,shield=0,planned=0,extraClass='',showLabel=true){
  hp=Math.max(0,Math.round(hp||0));maxhp=Math.max(1,Math.round(maxhp||1));shield=Math.max(0,Math.round(shield||0));planned=Math.max(0,Math.round(planned||0));
  const scale=Math.max(maxhp,hp+shield+planned,1),pct=value=>Math.max(0,value/scale*100);
  const details=[shield>0?`🛡 ${shield}`:'',planned>0?`◻ 預計 ${planned}`:''].filter(Boolean).join(' ｜ ');
  return `<div class="combat-vitals ${extraClass}">${showLabel?`<div class="vital-label">❤ HP ${hp}/${maxhp}</div>`:''}<div class="vitalbar" role="img" aria-label="生命 ${hp}/${maxhp}，長期護盾 ${shield}，預計護盾 ${planned}"><span class="vital-hp" style="width:${pct(hp)}%"></span><span class="vital-shield" style="width:${pct(shield)}%"></span><span class="vital-planned" style="width:${pct(planned)}%"></span></div><div class="vital-legend">${details||'　'}</div></div>`;
}
function projectedPlayerShield(){
  const b=G.battle;if(!b||!b.hand.length||handTotal(b.hand)>21||bloodDescendantActive()||playerIsSamurai())return 0;
  return defenseActionProfile(b.hand,false).total;
}
function projectedEnemyShield(e){
  const b=G.battle;if(!b||!e||e.curhp<=0)return 0;
  if(e.type==='robot'&&e.robotAction==='charge')return Math.max(0,robotGrowth(G.floor).chargeShield-(e.shield||0));
  if(e.type==='paladin'&&!e.inquisitorSync&&e.paladinAction==='guard')return Math.max(0,paladinGrowth(G.floor).shield-(e.shield||0));
  if(e.type==='gargoyle'&&e.gargoyleAction==='guard')return gargoyleGrowth(G.floor).bossShield;
  if(e.type==='cultist'){
    const guardian=b.enemies.find(x=>x.type==='gargoyle'&&x.curhp>0&&x.gargoyleAction==='guard');
    if(guardian)return Math.max(0,gargoyleGrowth(G.floor).cultShield-(e.shield||0));
  }
  if(e.type==='dragon'&&e.dragonAction==='ward')return Math.max(0,dragonGrowth(G.floor).shieldAmount-(e.shield||0));
  if(e.type==='kun'&&e.kunAction==='devour')return kunShieldAmount(e);
  if(e.type==='inquisitorMounted'&&e.inquisitorAction==='proclamation')return Math.max(1,Math.round(e.maxhp*.12));
  if(inquisitorLeader()?.inquisitorAction==='chargePrep'&&(INQUISITOR_LEADERS.includes(e.type)||e.inquisitorEscort))return Math.max(1,Math.round(e.maxhp*.30));
  if(e.type==='cultLeader'&&e.courtAction==='obsidianAbsolution')return Math.max(1,Math.round(e.maxhp*.10));
  if(COURT_GARGOYLES.includes(e.type)&&b.enemies.some(x=>x.type==='cultLeader'&&x.curhp>0&&x.courtAction==='obsidianAbsolution'))return Math.max(1,Math.round(e.maxhp*.15));
  if(e.type==='cthulhu'&&e.cthulhuAction==='abyssRegeneration')return Math.max(1,Math.round(e.maxhp*.12));
  return 0;
}
function renderPlayerVitals(){
  const el=$('player-vitals');if(!el)return;
  if(!G.battle){el.innerHTML='';return;}
  const b=G.battle,flow=Math.max(0,Math.min(BALANCE.samuraiFlowCap,b.samuraiFlow||0));
  const bloodInfo=playerIsSamurai()&&G.activeBlade==='vampire'?` ｜ 🩸 血籌 ${b.samuraiBloodWager||0}｜連莊 ${b.samuraiBloodStreak||0}/3`:'';
  const flowBar=playerIsSamurai()?`<div class="samurai-flow"><div class="samurai-flow-label">🌊 心流 ${roundHalfEven(flow)}/${BALANCE.samuraiFlowCap}${bloodInfo}</div><div class="samurai-flow-track" role="progressbar" aria-label="心流" aria-valuemin="0" aria-valuemax="${BALANCE.samuraiFlowCap}" aria-valuenow="${roundHalfEven(flow)}"><span style="width:${flow/BALANCE.samuraiFlowCap*100}%"></span></div></div>`:'';
  el.innerHTML=vitalBarMarkup(G.hp,G.maxhp,b.defense||0,projectedPlayerShield(),'player-vitals-bar')+flowBar;
}

function updateIncoming(){
  const b=G.battle;
  const status=[];
  if(playerIsSamurai())status.push(`${hasActiveBlade()?`🗡️ ${activeBladeDef().name}・${b.samuraiWeaponState==='sheathed'?'納刀（架勢／見切不可用）':'持刀'}`:'✊ 徒手'}${G.activeBlade==='peek'&&b.samuraiFateGuideDrawn?' ｜ 👁️ 天機待應驗':''} ｜ 👁️ 見切${(b.mikiriCooldown||0)>0?`冷卻 ${b.mikiriCooldown}`:samuraiDefenseActionsAvailable()?'就緒':'待居合拔刀'}`);
  if(ownsP('doublebet')&&validLuckyNumber(G.luckyNumber)){const lucky=luckyNumberProfile(b.hand?.length?handTotal(b.hand):0,'battle');status.push(`🎲 幸運數字 ${G.luckyNumber}${G.luckyAllIn?'・孤注一擲':''}｜${lucky.label}${lucky.active?` ×${lucky.multiplier.toFixed(2)}`:''}`);}
  if(hasP('suitmage'))status.push(`🎭 術式：同花色 2／3／4 張＝Ⅰ／Ⅱ／Ⅲ階${activeSuitMastery()==='mono'?(b.suitMainSuit?`｜純色主花色 ${b.suitMainSuit}${suitName(b.suitMainSuit)}`:'｜純色未鎖定（沒有唯一達 40% 的花色）'):''}｜改色 ${b.suitMagicUsed?'已使用':'可用'}｜提神可退 ${Math.max(0,(b.suitMagicSpent||0)-(b.suitMagicRefunded||0))}`);
  const zanshin=playerIsSamurai()?playerZanshinProfile():null;if(zanshin)status.push(`🧘 殘心 ${zanshin.turns}/${zanshin.duration}（攻擊 +${Math.round((zanshin.attack-1)*100)}%｜承傷 −${Math.round(zanshin.reduction*100)}%）`);
  if(zanshin&&immovableBladeActive())status.push(`🏯 守心${b.samuraiZanshinGuardUsed?'已使用':(b.samuraiFlow||0)>=25?'可用':'待心流 25'}${zanshin.strong&&(b.samuraiFlow||0)>=75?' ｜ 不墜就緒：20 點見切可刷新強殘心':''}`);
  if(moonBladeActive()&&b.samuraiMoonCounter)status.push('🌙 盾返就緒');
  if(mirrorBladeActive()){const mirrorStatuses=playerPurifiableStatuses();status.push(`🪞 明鏡 ${mirrorStatuses.length?`${mirrorStatuses.length} 種可淨化狀態`:'無垢'}｜返照心流 ${b.samuraiMirrorFlowThisEnemyTurn||0}/10${(b.samuraiFlow||0)>=25?'｜祓斬就緒':''}`);}
  if(fortuneBladeActive())status.push(`🍀 福緣 ${G.fortune||0}/5`);
  if(myriadBladeActive()){const phases=playerPhaseStatuses(),affinity=myriadAffinityAmount();status.push(`🌀 萬象 ${phases.length} 種｜異相 ×${myriadPhaseMultiplier().toFixed(2)}${affinity.key&&affinity.stacks?`｜${affinity.shared?'共相':'同病'} ${PURIFIABLE_STATUS_DEFS.find(item=>item.key===affinity.key)?.name||affinity.key}→${affinity.raw}`:''}`);}
  if(playerIsSamurai()&&G.activeBlade==='safe21'&&b.samuraiSafeLineReached){const line=samuraiSafeLineProfile();if(line.valid)status.push(line.extra>0?`⚖️ 越線 ${line.extra} 張`:`⚖️ 安全線 ${b.samuraiSafeLineFirstTotal} 點`);}
  if(b.defense>0||persistentDefenseActive())status.push(`🛡 目前防禦 ${b.defense}`);
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
  if(bloodDescendantActive()&&(b.bloodDamageStacks||0)>0)status.push(`🩸 血魔血性 ×${descendantDamageMultiplier().toFixed(2)}`);
  if(b.lockedSkill){const p=ALL_PASSIVES.find(x=>x.id===b.lockedSkill);status.push(`🔒 封鎖「${p?p.name:b.lockedSkill}」：20／21 點或本體傷害 ${gargoyleUnlockThreshold(G.floor)} 可解除`);}
  (b.lockedSkills||[]).forEach(x=>{const p=ALL_PASSIVES.find(item=>item.id===x.id);status.push(`🔒 石像封鎖「${p?p.name:x.id}」${x.ordinary?`：20／21 點或本體傷害 ${gargoyleUnlockThreshold(G.floor)} 可解除`:''}`);});
  if(b.obsidianCourt&&!b.cthulhuPhase)status.push(`🔥 狂信 ${b.fanaticism}/20${b.upgradeReprieve>0?' ｜ ✨ 強化暫時復原':''}`);
  if(b.cthulhuPhase)status.push(`🕳️ 深淵距離 ${b.abyssDistance}/${b.abyssMax}`);
  if(b.inquisitorBattle&&b.inquisitorPhase===1)status.push(`⚖️ 罪證 ${b.crime||0}（無上限）`);
  if(b.inquisitorBattle&&b.inquisitorPhase===2)status.push(`⚖️ 罪惡值 ${b.sinValue||0}/${b.sinCap||0}`);
  $('pl-def').textContent=status.join(' ｜ ');
  const ailments=[];
  if(G.poison>0)ailments.push(`☠ 中毒 ${G.poison} 層（每回合 −${Math.round(G.poison*traumaStatusMultiplier(b)*virulenceMultiplier(b))} HP）`);
  if(b.virulence>0)ailments.push(`☣️ 猛毒 ${b.virulence} 層（中毒傷害 +${b.virulence*10}%｜${10-(b.virulenceTicks||0)} 回合後 −1）`);
  if(b.corruption>0)ailments.push(`🧟 腐敗 ${b.corruption} 層（戰鬥回血 −${b.corruption*20}%）`);
  if(b.sepsis>0)ailments.push(`🦠 敗血 ${b.sepsis} 層（吸血者效率 +${b.sepsis*15}%）`);
  if(b.bleed>0)ailments.push(`🩸 流血 ${b.bleed}/${BLEED_CAP} 層（下次直接傷及 HP 時額外 −${Math.round(b.bleed*traumaStatusMultiplier(b))}，發作後 −${burnwindActive()?1:2} 層）`);
  if(b.fracture>0)ailments.push(`🦴 斷骨 ${b.fracture} 層（新防禦 −${b.fracture*15}%）`);
  if(b.burn>0)ailments.push(`🔥 燒傷 ${b.burn}/${BURN_CAP} 層（下一次額外抽牌 −${Math.round(b.burn*2*traumaStatusMultiplier(b))} HP；每 ${burnwindActive()?4:2} 次額外抽牌發作及每 ${burnwindActive()?2:1} 個完整回合各 −1 層）`);
  if(b.trauma>0)ailments.push(`🩹 創傷 ${b.trauma} 層（攻擊傷害 ×${traumaAttackMultiplier(b).toFixed(1)}；持續傷害 ×${traumaStatusMultiplier(b).toFixed(0)}）`);
  if(b.blind>0)ailments.push(`🌑 致盲 ${b.blind} 層（攻擊改為解除致盲；防禦 −20%）`);
  if(currentWeaknessStacks()>0)ailments.push(`📉 虛弱 ${currentWeaknessStacks()}/9（下一次攻擊 −${currentWeaknessStacks()*10}%）`);
  if(b.hesitation>0)ailments.push(`🦫 遲疑 ${b.hesitation} 層（本次行動可額外抽 ${b.hesitation} 張）`);
  if(b.disciplineBrand>0||b.cthulhuPhase)ailments.push(`📿 戒律烙印 ${b.disciplineBrand}/3（懲罰 ×${(b.disciplinePunishMult||1.5).toFixed(1)}）`);
  if(b.hallucination>0)ailments.push(`🫥 幻覺 ${b.hallucination} 層（剩餘行動；牌面有 5% 機率錯誤）`);
  if(b.mentalDisorder>0)ailments.push(`🌀 精神錯亂 ${b.mentalDisorder} 層（Hit 抽 1～2 張）`);
  if(b.paralysis>0)ailments.push(`⚡ 麻痺 ${b.paralysis} 層（剩餘行動；控制消耗 ×2）`);
  $('pl-poison').textContent=ailments.join(' ｜ ');
  const limit=hesitationLimit();
  $('incoming').textContent=b.hesitation>0?`🦫 遲疑 ${b.hesitation} 層：本回合最多再抽 ${Math.max(0,limit-(b.hits||0))} 張`:'';
  renderPlayerVitals();
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
    const shownHp=e.downed?0:Math.max(0,e.curhp),plannedShield=projectedEnemyShield(e);
    const bearAct=bearTurn(e)&&alive;
    const platyAct=platypusTurn(e)&&alive;
    const sqAct=e.type==='squirrel'&&b.round===1&&alive;
    const sqFlee=e.type==='squirrel'&&alive?`（${Math.max(0,squirrelEscapeTurns(G.floor)+1-b.round)} 回合後逃跑）`:'';
    const dropRest=e.type==='dropbear'&&alive&&!dropbearAttacks(b.round);
    const dropAtk=e.type==='dropbear'&&alive&&dropbearAttacks(b.round);
    let intent;
    if(e.type==='zombie'&&e.downed)intent=`💀 倒地｜補刀需 ${zombieFinishThreshold(G.floor)} 傷害，20／21 點可直接處決`;
    else if(poisonAct){const vr=enemyVirulenceRule(e,'witchPoison');intent=`☠ 本回合附加 2 層中毒（每 ${vr.threshold} 中毒 → ${vr.yield} 猛毒）`;}
    else if(dropRest)intent='💤 蓄力休息中…';
    else if(dropAtk){const vr=enemyVirulenceRule(e,'pounce');intent=`🐨 猛撲 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒＋虛弱｜每 ${vr.threshold} 中毒 → ${vr.yield} 猛毒）`;}
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
    else if(e.type==='mimic'&&e.mimicAction==='venomBite'){const vr=enemyVirulenceRule(e,'venomBite');intent=`☠️ 毒牙啃咬 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒 +${enemyStatusRaw(e,2)}｜每 ${vr.threshold} 中毒 → ${vr.yield} 猛毒）`;}
    else if(e.type==='mimic'&&e.mimicAction==='rendingTongue')intent=`🩸 撕裂長舌 <span class="dmgtag">${e.nextDmg??'?'}</span>（×1.1；傷及 HP：流血 +${enemyStatusRaw(e,2)}）`;
    else if(e.type==='mimic')intent=`🦴 碎骨夾擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（×1.35；傷及 HP：斷骨 +${enemyStatusRaw(e,1)}）`;
    else if(e.type==='ninja'&&e.ninjaAction==='pierce')intent=`🗡️ 穿刺 <span class="dmgtag">${e.nextDmg??'?'}</span>（💥 破防 30%）`;
    else if(e.type==='zombie'&&e.zombieAction==='bite')intent=`🧟 腐敗撕咬 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP 時附加腐敗）`;
    else if(e.type==='eagle'&&e.divePending){const eg=eagleGrowth(G.floor);intent=`${eg.thunder?'⚡ 雷霆俯衝':'🦅 俯衝反擊'} <span class="dmgtag">${e.nextDmg??'?'}</span>（×${eg.diveMult}${eg.thunder?'｜傷及 HP 時施加麻痺':''}）`;}
    else if(e.type==='robot'&&e.robotAction==='charge')intent=`⚡ 電力充能（本回合不攻擊）${e.shield>0?`｜獲得 ${e.shield} 護盾`:''}`;
    else if(e.type==='robot'&&e.robotAction==='electric')intent=`⚡ 電弧放電 <span class="dmgtag">${e.nextDmg??'?'}</span>（吸收蓄勢 +${e.focusAbsorb}｜傷及 HP 時施加麻痺）`;
    else if(e.type==='robot'&&e.robotAction==='cool')intent='❄️ 過熱冷卻（不攻擊、受到傷害 ×1.4）';
    else if(e.type==='robot'&&e.robotAction==='fire')intent=`🔥 火焰噴射 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP 時附加燒傷）`;
    else if(e.type==='cultist'&&e.cultistAction==='prayer')intent=gargoyleFight?`🕯 石像讚頌（不攻擊；石像鬼永久攻擊 +${Math.round(gargoyleGrowth(G.floor).prayerPower*100)}%）`:'🕯 反噬祈禱（不攻擊、受到傷害 ×1.3）';
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='dark')intent=`🌑 邪能打擊 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cultist'&&e.hasStolen&&e.cultistAction==='sacrifice')intent=`🩸 獻祭釋放 <span class="dmgtag">${e.nextDmg??'?'}</span>（攻擊後歸還強化）`;
    else if(e.type==='gargoyle'&&e.gargoyleAction==='guard')intent=`🗿 石像守護（護盾永久累加 +${gargoyleGrowth(G.floor).bossShield}，並嘗試復活教徒）`;
    else if(e.type==='ronin'&&e.roninAction==='mikiri')intent=`👁️ 見切（不攻擊；防禦或爆牌時回復 10% HP，20／21 點可破解）｜⚔️ 斬首線 ${e.executionPercent}%`;
    else if(e.type==='ronin'&&e.roninAction==='iaido')intent=`⚔️ 居合 <span class="dmgtag">${e.nextDmg??'?'}</span>（開局高傷、破防 40%）｜斬首線 ${e.executionPercent}%`;
    else if(e.type==='ronin'&&e.roninAction==='stab')intent=`🗡️ 刺突 <span class="dmgtag">${e.nextDmg??'?'}</span>（破防 30%）｜斬首線 ${e.executionPercent}%`;
    else if(e.type==='ronin'&&e.roninAction==='karatake')intent=`🩸 唐竹 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：流血 +${enemyStatusRaw(e,2)}）｜斬首線 ${e.executionPercent}%`;
    else if(e.type==='ronin'&&e.roninAction==='tsubame')intent=`🪽 燕返 <span class="dmgtag">${e.nextDmg??'?'}</span>（${e.roninParts.map(p=>p.damage).join('＋')}；流血＋破防）｜斬首線 ${e.executionPercent}%`;
    else if(e.type==='ronin'&&e.roninAction==='thousandBlades')intent=`⚔️ 千太刀 <span class="dmgtag">${e.nextDmg??'?'}</span>（${e.roninParts.map(p=>p.damage).join('＋')}；五連斬，斬後收刀）｜斬首線 ${e.executionPercent}%`;
    else if(e.type==='samurai'&&e.samuraiAction==='mikiri')intent='👁️ 見切（不攻擊；防禦或爆牌時回復 8% HP，20／21 點可破解）';
    else if(e.type==='samurai'&&e.samuraiAction==='iaido')intent=`⚔️ 居合 <span class="dmgtag">${e.nextDmg??'?'}</span>（心流後 ×1.4、破防 40%；傷及 HP：流血 +${enemyStatusRaw(e,2)}）`;
    else if(e.type==='samurai'&&e.samuraiAction==='kesa')intent=`🗡️ 袈裟斬 <span class="dmgtag">${e.nextDmg??'?'}</span>（心流；傷及 HP：流血 +${enemyStatusRaw(e,1)}）`;
    else if(e.type==='samurai'&&e.samuraiAction==='tsubame')intent=`🪽 燕返 <span class="dmgtag">${e.nextDmg??'?'}</span>（${e.samuraiParts.map(p=>p.damage).join('＋')}；破防 ${Math.round(samuraiTsubameBreak(e)*100)}%）`;
    else if(e.type==='inquisitorMounted'&&e.inquisitorAction==='proclamation')intent='📜 宣讀罪狀（不攻擊；罪證 +1、虛弱、護盾 12%）';
    else if(e.type==='inquisitorMounted'&&e.inquisitorAction==='chargePrep')intent='🐎 舉槍裁決（全體驅散 50% 負面狀態、全體護甲 30%；聖騎士戰吼）';
    else if(e.type==='inquisitorMounted')intent=`⚖️ ${{lance:'騎槍突刺',trample:'戰馬踐踏',charge:'裁決衝鋒'}[e.inquisitorAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>（馬勢 ${e.momentum}/25、破防 ${Math.round(armorBreakRate(e)*100)}%）`;
    else if(e.type==='inquisitor'&&e.inquisitorAction==='transition')intent='⚖️ 下馬整備（暫停 1 回合；下回合審判）';
    else if(e.type==='inquisitor'&&e.inquisitorAction==='confiscate')intent='💰 沒收異端財物（不攻擊；奪取金錢並轉化護盾）';
    else if(e.type==='inquisitor')intent=`⚖️ ${{sentenceSword:'斷罪劍',pyre:'火刑宣告',interrogate:'信仰拷問',judgment:'審判'}[e.inquisitorAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>${e.inquisitorAction==='judgment'?'（罪惡高倍率、全體同步裁決）':''}`;
    else if(e.type==='bloodDemon'&&e.bloodDemonAction==='sacrifice')intent='🩸 血祭：自損最多 8% HP，攻擊永久 +15%';
    else if(e.type==='bloodDemon'&&e.bloodDemonAction==='drain')intent=`🩸 吸血攻擊 <span class="dmgtag">${e.nextDmg??'?'}</span>（吸血 ${Math.round(bloodDemonDrainRate(e)*100)}%${e.permanentThirst?'，永久渴血':bloodDemonFrenzyActive(e)?`，渴血剩 ${BALANCE.bloodDemonFrenzyUses-(e.bloodFrenzyUses||0)} 次`:''}${b.sepsis>0?`，敗血 +${b.sepsis*15}%`:''}；完全防住仍保底回復 25%）`;
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
    else if(e.type==='punishmentGargoyle'&&e.courtAction==='poisonPunishment'){const vr=enemyVirulenceRule(e,'poisonPunishment');intent=`☠ 毒刑 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒 +2｜每 ${vr.threshold} 中毒 → ${vr.yield} 猛毒）`;}
    else if(e.type==='punishmentGargoyle'&&e.courtAction==='toxicWhip'){const vr=enemyVirulenceRule(e,'toxicWhip');intent=`🦂 毒鞭 <span class="dmgtag">${e.nextDmg??'?'}</span>（傷及 HP：中毒 +3｜每 ${vr.threshold} 中毒 → ${vr.yield} 猛毒）`;}
    else if(e.type==='punishmentGargoyle')intent=`🗿 刑罰石爪 <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cultLeader'&&e.courtAction==='obsidianAbsolution')intent='🛡 黑曜赦令（不攻擊；全體永久護盾、暫時歸還強化、石像下次傷害 ×1.3）';
    else if(e.type==='cultLeader')intent=`🕯 ${({blackScripture:'黑經誦讀',blindSermon:'盲目佈道',sepsisRite:'敗血儀式',bloodDrain:'汲血',profaneCommunion:'褻瀆共融'})[e.courtAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else if(e.type==='cthulhu'&&e.cthulhuAction==='abyssRegeneration')intent='🕳️ 深淵再生（不攻擊；回復 6%、永久護盾 12%）';
    else if(e.type==='cthulhu')intent=`🐙 ${({tentacleRend:'萬觸撕裂',namelessGaze:'不可名狀的凝視',abyssResonance:'深淵震鳴',starWhisper:'群星囈語',deepPressure:'深海威壓'})[e.cthulhuAction]} <span class="dmgtag">${e.nextDmg??'?'}</span>`;
    else intent=`🗡 本回合 <span class="dmgtag">${e.nextDmg??'?'}</span>${bearAct?' ＋🐻虛弱':''}${platyAct?' ＋🦫遲疑':''}${sqAct?' ＋🐿️偷竊':''}${dropAtk?' ＋☠＋🐻':''}${sqFlee}`;
    const sprite=e.img?`<img class="esprite" src="${encodeURI(e.img)}" alt="${e.name}" style="height:${e.h}px">`:`<div class="esprite emoji-sprite" style="font-size:${Math.round(e.h*0.85)}px">${e.emoji||'❓'}</div>`;
    const bloodDemonRageRate=e.type==='bloodDemon'?bloodDemonGrowth(G.floor).drainRate*1.5*sepsisMultiplier(b):0;
    const bloodDemonRageHeal=e.type==='bloodDemon'&&e.bloodDemonAction==='drain'?Math.round((e.nextDmg||0)*bloodDemonRageRate):0;
    const bloodDemonStatus=e.type==='bloodDemon'?(e.permanentThirst?` ｜ 🩸 永久渴血｜吸血 ${Math.round(bloodDemonRageRate*100)}%${e.bloodDemonAction==='drain'?`（完全命中回復 ${bloodDemonRageHeal} HP）`:''}`:` ｜ 🩸 渴血剩餘 ${Math.max(0,BALANCE.bloodDemonFrenzyUses-(e.bloodFrenzyUses||0))}/${BALANCE.bloodDemonFrenzyUses}｜渴血吸血 ${Math.round(bloodDemonRageRate*100)}%${e.bloodDemonAction==='drain'?`（完全命中回復 ${bloodDemonRageHeal} HP）`:''}${bloodDemonFrenzyActive(e)?'（生效中）':''}`):'';
    const sinPct=b.inquisitorPhase===2&&b.sinCap>0?Math.round((b.sinValue||0)/b.sinCap*100):0;
    const sinBar=e.type==='inquisitor'?`<div class="sin-label">⚖️ 罪惡值 ${b.sinValue||0}/${b.sinCap||0}｜${sinPct}%</div><div class="sinbar"><span style="width:${Math.min(100,sinPct)}%"></span></div>`:'';
    el.innerHTML=`
      ${sprite}
      <div class="ename">${e.name}</div>
      ${vitalBarMarkup(shownHp,e.maxhp,e.shield||0,plannedShield,'enemy-vitals',false)}
      ${sinBar}<div class="eintent">HP ${shownHp}/${e.maxhp}${e.shield>0?` ｜ 🛡 護盾 ${e.shield}`:''}${e.poison>0?` ｜ ☠ 中毒 ${e.poison} 層`:''}${e.virulence>0?` ｜ ☣️ 猛毒 ${e.virulence} 層（中毒 +${e.virulence*10}%｜${10-(e.virulenceTicks||0)} 回合後 −1）`:''}${e.bleed>0?` ｜ 🩸 流血 ${e.bleed} 層`:''}${e.burn>0?` ｜ 🔥 燒傷 ${e.burn} 層`:''}${e.trauma>0?` ｜ 🩹 創傷 ${e.trauma} 層`:''}${e.sepsis>0?` ｜ 🦠 敗血 ${e.sepsis} 層`:''}${e.fracture>0?` ｜ 🦴 斷骨 ${e.fracture} 層`:''}${e.weakness>0?` ｜ 📉 虛弱 ${e.weakness} 層（攻擊 −${e.weakness*10}%）`:''}${e.statusResist>0?` ｜ ✝️ 負面狀態抗性 ${Math.round(e.statusResist*100)}%`:''}${INQUISITOR_LEADERS.includes(e.type)?' ｜ ⚖️ 永久減傷 30%':''}${e.forsakenEscort?' ｜ 🕯 失勢（攻擊 −35%｜聖盾 −50%）':''}${e.type==='samurai'?' ｜ 🧘 心流 ×1.5':''}${e.zanshin?` ｜ 🧘 殘心（攻擊 +${Math.round((e.zanshinAttack||0)*100)}%｜減傷 ${Math.round((e.zanshinReduction||0)*100)}%）`:''}${e.type==='cultLeader'?` ｜ 🔥 狂信 ${b.fanaticism}/20`:''}${e.type==='cthulhu'?` ｜ 🔥 凍結狂信 ${e.inheritedFanaticism}/20`:''}${e.type==='skeleton'?` ｜ 🦴 骨甲 ${e.boneArmor}/${skeletonGrowth(G.floor).maxArmor}`:''}${e.type==='gargoyle'&&e.gargoylePower>0?` ｜ ⚔ 祈禱攻擊 +${Math.round(e.gargoylePower*100)}%`:''}${e.type==='kun'?` ｜ 🌊 北冥潮 ${e.northTide}/16`:''}${e.type==='peng'?` ｜ 🌪 焚風｜攻擊 +${Math.round((e.pengAttackBonus||0)*100)}%`:''}${e.maxEvasion>0?` ｜ 💨 閃避 ${e.evasion}/${e.maxEvasion}`:''}${e.broken>0?' ｜ 🪶 折翼':''}${e.type==='cultist'&&e.stolenUpgrade?` ｜ 🔒 ${ALL_PASSIVES.find(p=>p.id===e.stolenUpgrade)?.name||e.stolenUpgrade}`:''}${bloodDemonStatus} ｜ ${intent}</div>
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
  closeFatePicker();b.samuraiFateUsed=false;b.samuraiFatePreview=[];b.samuraiFateGuided=null;b.samuraiFateGuideDrawn=false;b.samuraiFateSevered=null;
  clearBloodWager();
  b.hand=[];b.pendingBust=false;b.luckyBustResolved=false;b.hits=0;b.discardMode=false;b.suitMode=false;b.suitSelected=null;b.suitMagicUsed=false;b.suitSpellEnemyMult=1;b.samuraiDragonSheath=false;b.samuraiSafeLineReached=false;b.samuraiSafeLineFirstTotal=0;b.samuraiSafeLineExtraDraws=0;$('pl-cards').innerHTML='';
  $('battle-suit-picker').classList.add('hidden');
  b.busy=true;b.dealReady=false;syncButtons();
  dealOne(()=>dealOne(()=>{
    updateHandUI();
    // 讓第二張起手牌的動畫完整顯示後才開放操作，避免玩家把第三張誤認為第二張。
    setTimeout(()=>{if(G.battle!==b||b.over)return;b.dealReady=true;b.busy=false;syncButtons();updateDiscardBtn();},180);
  }));
}
function dealOne(cb){
  const b=G.battle,previousTotal=handTotal(b.hand);const c=b.deck.pop();b.hand.push(c);recordSafeLineDraw(previousTotal);assignHallucination(c);SFX.draw();
  const card=document.createElement('div'),shown=shownCard(c);
  card.className='card dealing'+(shown.red?' red':'');
  card.innerHTML=`<div class="v">${cardLabel(shown)}</div><div class="s">${shown.s}</div>`;
  $('pl-cards').appendChild(card);$('deck-count').textContent=b.deck.length;
  updateTotalOnly();setTimeout(cb,260);
}
function assignHallucination(card){if(G.battle&&G.battle.hallucination&&gameRandom()<.05)card._illusion=randomCard();}
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
  if(b.samuraiFateGuided){b.samuraiFateGuided=null;b.samuraiFateGuideDrawn=false;log('👁️ 老千改動了手牌，天機應驗失效。','dmg');}
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('老千改動手牌');
  b.hand.splice(i,1);resetSafeLineTracking();b.controlLeft-=cost;G.control=b.controlLeft;b.discardMode=false;SFX.draw();
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
  const b=G.battle,cost=currentControlCost('suitmage');if(!b||b.over||b.busy||b.dealReady===false||b.pendingBust||b.suitMagicUsed||b.controlLeft<cost||skillIsLocked('suitmage'))return;
  b.suitMode=!b.suitMode;b.suitSelected=null;b.discardMode=false;renderHand();updateDiscardBtn();updateSuitMagicBtn();
}
function changeBattleSuit(suit){
  const b=G.battle,cost=currentControlCost('suitmage'),c=b&&b.hand[b.suitSelected];if(!c||!SUITS.includes(suit)||b.suitMagicUsed||b.controlLeft<cost||skillIsLocked('suitmage'))return;
  if(c.s===suit){b.suitMode=false;b.suitSelected=null;renderHand();updateSuitMagicBtn();return;}
  if(b.samuraiFateGuided)cancelFateGuide('花色魔術改動手牌');
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('花色魔術改動手牌');
  const old=c.s;c.s=suit;c.red=suit==='♥'||suit==='♦';resetSafeLineTracking();b.controlLeft-=cost;b.suitMagicSpent=(b.suitMagicSpent||0)+cost;b.suitMagicUsed=true;G.control=b.controlLeft;b.suitMode=false;b.suitSelected=null;
  log(`🎭 花色魔術：${cardLabel(c)}${old} → ${cardLabel(c)}${suit}（控制值 −${cost}）`,'good');renderHand();updateHandUI();updateSuitMagicBtn();renderTop();
}
function updateSuitMagicBtn(){
  const b=G.battle,btn=$('btn-suitmagic'),cost=currentControlCost('suitmage');
  if(!b||!ownsP('suitmage')){btn.classList.add('hidden');$('battle-suit-picker').classList.add('hidden');return;}
  btn.classList.remove('hidden');btn.textContent=skillIsLocked('suitmage')?'🔒 花色魔術被封鎖':b.suitMagicUsed?'🎭 本副手牌已改色':(b.suitMode?'🎭 選擇手牌（按此取消）':`🎭 花色魔術 −${cost}（控制 ${b.controlLeft}/${b.controlCap}）`);
  btn.disabled=b.over||b.busy||b.dealReady===false||b.pendingBust||b.suitMagicUsed||b.controlLeft<cost||skillIsLocked('suitmage');
  if(!b.suitMode)renderSuitPicker('battle-suit-picker',false,()=>{});
}
function syncButtons(){
  const b=G.battle;
  const dealing=b.dealReady===false,samuraiGuardAvailable=!playerIsSamurai()||samuraiDefenseActionsAvailable();
  $('btn-hit').disabled=b.over||b.busy||dealing||b.pendingBust||(b.hesitation>0&&b.hits>=hesitationLimit());
  $('btn-hit').textContent='抽牌 Hit';
  $('btn-stand').disabled=b.over||b.busy||dealing;
  $('btn-stand').textContent=b.pendingBust?'💥 接受爆牌結算':b.blind>0?`🌑 解除致盲（${b.blind}）`:playerIsSamurai()?(hasActiveBlade()?(b.samuraiWeaponState==='sheathed'?'⚔️ 居合':'🗡️ 斬擊'):'攻擊 Attack'):'攻擊 Attack';
  $('btn-defend').disabled=b.over||b.busy||dealing||b.pendingBust||handTotal(b.hand)>21||bloodDescendantActive()||!samuraiGuardAvailable;
  if(bloodDescendantActive())$('btn-defend').textContent='🩸 血魔契約：無法防禦';
  else if(playerIsSamurai()){
    const rate=samuraiAdjustedGuardRate(samuraiStanceRate(handTotal(b.hand)));
    $('btn-defend').textContent=samuraiGuardAvailable?`🗡️ 架勢 ${Math.round(rate*100)}%`:'🗡️ 納刀中不可使用架勢';
  }else $('btn-defend').textContent='防禦 Defend';
  const mikiriBtn=$('btn-mikiri');mikiriBtn.classList.toggle('hidden',!playerIsSamurai());
  if(playerIsSamurai()){
    const rate=samuraiAdjustedGuardRate(samuraiMikiriRate(handTotal(b.hand))),ready=(b.mikiriCooldown||0)<=0;
    mikiriBtn.textContent=!samuraiGuardAvailable?'👁️ 納刀中不可使用見切':ready?`👁️ 見切 ${Math.round(rate*100)}%（不消耗心流）`:`👁️ 見切冷卻 ${b.mikiriCooldown}`;
    mikiriBtn.disabled=b.over||b.busy||dealing||b.pendingBust||handTotal(b.hand)>21||bloodDescendantActive()||!ready||!samuraiGuardAvailable;
  }
  const sheathBtn=$('btn-sheath');sheathBtn.classList.toggle('hidden',!hasActiveBlade());
  sheathBtn.disabled=!hasActiveBlade()||b.over||b.busy||dealing||b.pendingBust||b.samuraiWeaponState!=='drawn';
  sheathBtn.textContent=b.samuraiWeaponState==='sheathed'?'🗡️ 已納刀':'🗡️ 收刀';
  const ultimateBtn=$('btn-ultimate'),ultimate=samuraiUltimateInfo();ultimateBtn.classList.toggle('hidden',!ultimate);
  if(ultimate){ultimateBtn.textContent=`⚡ 必殺・${ultimate.name}`;ultimateBtn.title=ultimate.requirement;ultimateBtn.disabled=b.over||b.busy||dealing||(b.blind>0&&ultimate.id!=='antidote')||!ultimate.ready;}
  renderBattleBladePicker();
  renderBloodWagerControls();
  renderMyriadAffinityControls();
  renderPoisonDrawControls();
  renderDragonSheathControls();
  $('btn-escape').classList.toggle('hidden',!b.cthulhuPhase);
  $('btn-escape').disabled=b.over||b.busy||b.pendingBust;
  const consumableTotal=Object.values(G.consumables||{}).reduce((sum,count)=>sum+count,0),consumableBtn=$('btn-consumables');
  consumableBtn.textContent=`🎒 消耗品 ${consumableTotal}`;
  consumableBtn.disabled=b.over||b.busy||dealing||b.pendingBust||consumableTotal<=0;
  updateAtonementButtons();
  updateRedrawBtn();updatePeekBtn();updateDiscardBtn();updateSuitMagicBtn();
}

function atonementGoldCost(){const b=G.battle,base=Math.max(1,Math.round(floorReward(G.floor,false)*.5));return Math.max(1,Math.round(base*Math.pow(1.6,b&&b.redemptionUses||0)));}
function updateAtonementButtons(){
  const b=G.battle,active=!!(b&&b.inquisitorBattle&&b.inquisitorPhase===2),total=active?handTotal(b.hand):0,blocked=!active||b.over||b.busy||b.pendingBust||total>21||(b.sinValue||0)<=0;
  const defs=[['btn-atonement-free',3,'🙏 無價贖罪'],['btn-atonement-gold',6,'🪙 金錢贖罪'],['btn-atonement-control',10,'🎴 控制贖罪']],controlCost=scaledControlCost(3);
  defs.forEach(([id,rate,label])=>{const btn=$(id);btn.classList.toggle('hidden',!active);if(!active)return;const value=Math.min(b.sinValue||0,total*rate);btn.textContent=`${label}：罪惡 −${value}${id==='btn-atonement-gold'?`（${atonementGoldCost()} 金）`:id==='btn-atonement-control'?`（${controlCost} 控制）`:''}`;btn.disabled=blocked||(id==='btn-atonement-gold'&&G.gold<atonementGoldCost())||(id==='btn-atonement-control'&&b.controlLeft<controlCost);});
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

function previewPlayerLifesteal(dmg,rapid,target){
  if(!hasP('vampire')||dmg<=0)return null;
  const b=G.battle,bloodBlade=playerIsSamurai()&&G.activeBlade==='vampire'&&hasActiveBlade(),bloodMult=bloodBlade?(b.samuraiBloodUltimate?2:1+(b.samuraiBloodRaises||0)*.2):1;
  const baseRate=bloodDescendantActive()?0.5:isUp('vampire')?0.3:0.2,rate=baseRate*thirstMultiplier()*sepsisMultiplier(target)*bloodMult,corruptionMult=Math.max(0.4,1-Math.max(0,G.battle?.corruption||0)*0.2);
  let adjusted=0;
  if(rapid){
    const segments=Math.max(0,rapid.segments||0),segmentDamage=Math.max(0,rapid.segmentDamage||0),firstBonus=Math.max(0,(rapid.iaidoFlatBonus||0)+(rapid.iaidoFollowBonus||0)+(rapid.postMultiplierFlat||0));
    for(let i=0;i<segments;i++)adjusted+=Math.max(0,Math.round(Math.round((segmentDamage+(i===0?firstBonus:0))*rate*.3)*corruptionMult));
  }else adjusted=Math.max(0,Math.round(Math.round(dmg*rate)*corruptionMult));
  return {amount:Math.min(Math.max(0,G.maxhp-G.hp),adjusted),adjusted,rate,rapid:!!rapid};
}

function applyAttackSpellMultiplier(profile,mult){
  if(!profile||!(mult>1))return profile;
  const fixed=Math.max(0,profile.rubyFlat||0);
  if(profile.rapid){
    profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*mult));
    profile.rapid.iaidoFlatBonus=Math.round((profile.rapid.iaidoFlatBonus||0)*mult);
    profile.rapid.iaidoFollowBonus=Math.round((profile.rapid.iaidoFollowBonus||0)*mult);
    profile.rapid.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0)+(profile.rapid.iaidoFollowBonus||0)+(profile.rapid.postMultiplierFlat||0);
    profile.dmg=profile.rapid.dmg;
  }else profile.dmg=Math.max(0,Math.round(Math.max(0,profile.dmg-fixed)*mult)+fixed);
  return profile;
}

function updateOutgoing(){
  if(!G.battle){$('outgoing').textContent='';return;}
  const b=G.battle;
  if(!b.hand.length){$('outgoing').textContent='';return;}
  const t=handTotal(b.hand);
  const busted=t>21;
  const outgoingProfile=computeDamage(b.hand,busted),attackSpells=busted?[]:suitSpellPlan('attack',b.hand,b.suitMainSuit),defenseSpells=busted?[]:suitSpellPlan('defense',b.hand,b.suitMainSuit),spellAtkMult=spellAttackMultiplier(attackSpells);applyAttackSpellMultiplier(outgoingProfile,spellAtkMult);let {dmg,rapid,thousand}=outgoingProfile;
  const tgt=currentTarget();
  const defenseProfile=busted||bloodDescendantActive()||playerIsSamurai()?null:defenseActionProfile(b.hand,false,defenseSpells),shieldDef=defenseProfile?.shield.def||0;
  const projDef=defenseProfile?.total||0;
  const shieldStr=bloodDescendantActive()?'（血魔契約禁止防禦）':b.ironskin>1?`（🧪鐵膚 ×${b.ironskin.toFixed(3)}）`:b.blind>0?'（致盲 −20%）':shieldDef>0?`（含圓盾 +${shieldDef}）`:'';
  const samuraiReady=playerIsSamurai()&&(b.mikiriCooldown||0)<=0,guardAvailable=!playerIsSamurai()||samuraiDefenseActionsAvailable(),stanceRate=playerIsSamurai()?samuraiAdjustedGuardRate(samuraiStanceRate(t)):0,mikiriRate=playerIsSamurai()?samuraiAdjustedGuardRate(samuraiMikiriRate(t)):0;
  const luckyPreview=ownsP('doublebet')&&validLuckyNumber(G.luckyNumber)?luckyNumberProfile(t,'battle'):null,luckyPreviewStr=luckyPreview?`🎲 ${luckyPreview.label}${luckyPreview.active?` ×${luckyPreview.multiplier.toFixed(2)}`:''}${G.luckyAllIn?'（孤注一擲）':''}`:'';
  const defensePreview=playerIsSamurai()?guardAvailable?`🗡️ 架勢 ${Math.round(stanceRate*100)}%｜${samuraiReady?`👁️ 見切 ${Math.round(mikiriRate*100)}%（不消耗心流）`:`👁️ 見切冷卻 ${b.mikiriCooldown}`}`:'🗡️ 納刀中：須先以居合拔刀才能使用架勢或見切':`🛡 防禦 ${projDef}${shieldStr}${defenseProfile?.lucky.active?`（🎲${defenseProfile.lucky.label} ×${defenseProfile.lucky.multiplier.toFixed(2)}）`:''}`;
  const fdStr=(hasP('dragonneck')&&!busted&&b.hand.length>=5)?'（🐉五龍！再回 HP）':'';
  const safeLine=playerIsSamurai()&&G.activeBlade==='safe21'?samuraiSafeLineProfile():null,safeLineStr=safeLine?.perfect?` ｜ ⚖️ 完美守線：承傷 −${(b.samuraiFlow||0)>=25?30:25}%`:safeLine?.guard?` ｜ ⚖️ 守線：承傷 −${(b.samuraiFlow||0)>=25?30:25}%`:safeLine?.over?` ｜ ⚖️ 越線 ${Math.min(2,safeLine.extra)} 張：心流 +${Math.min(2,safeLine.extra)*8}`:'',immovableStr=immovableBladeActive()&&b.samuraiWeaponState==='sheathed'?` ｜ 🏯 殘心居合 ×${immovableIaidoMultiplier().toFixed(2)}`:'',moonStr=moonBladeActive()?(b.samuraiMoonCounter?` ｜ 🌙 ${b.samuraiWeaponState==='sheathed'&&(b.samuraiFlow||0)>=50?'輪返居合 ×1.35':b.samuraiWeaponState==='sheathed'?'居合 ×1.15 × 盾返 ×1.15':`盾返 ×${(b.samuraiFlow||0)>=50?'1.25':'1.15'}`}`:b.samuraiWeaponState==='sheathed'?' ｜ 🌙 普通居合 ×1.15':''):'';
  const heartEquipment=heartBladeActive()?samuraiDefenseFlowBonus(b.hand,false):null,heartStance=heartEquipment?samuraiGuardFlowReward('stance',heartEquipment,0,t,b.samuraiFlow||0):null,heartMikiri=heartEquipment?samuraiGuardFlowReward('mikiri',heartEquipment,0,t,b.samuraiFlow||0):null,heartStr=heartEquipment?` ｜ 🪞 護心鏡${isUp('heartguard')?'50%':'30%'}防禦等價，本手實際 ${heartEquipment.heartguardEquivalent}；心鏡流轉預計 +${heartEquipment.heartguardFlow}${heartEquipment.heartguardMinimumApplied?'（定心最低4）':''}｜架勢目前最多 +${heartStance.total}/15、見切裝備目前 +${heartMikiri.total}/35${(b.samuraiFlow||0)>=50?'｜完全防住可再 +3':''}${(b.samuraiFlow||0)>=75&&(t===20||t===21)?'｜澄心 +4 已計入':''}`:'';
  const poisonPreview=poisonBladeActive()&&tgt?poisonDrawSnapshot(tgt,b.samuraiFlow||0,false):null,poisonApplied=poisonBladeActive()&&tgt?resistedStatusAmount(tgt,toxicologyPoison(b.hand)):0,poisonStr=poisonBladeActive()?` ｜ 🐍 目標中毒 ${tgt?.poison||0}／猛毒 ${tgt?.virulence||0}${b.samuraiPoisonDraw&&poisonPreview?.base?`｜毒拔計算 ${poisonPreview.base}、移除 ${poisonPreview.remove}、額外毒傷 ${poisonPreview.damage}${(b.samuraiFlow||0)>=75?`、保留 ${Math.max(0,(tgt?.poison||0)-poisonPreview.remove)}`:''}`:''}｜${(b.samuraiFlow||0)>=25?'毒脈':'淬毒'}預計 +${poisonTemperFlowGain(poisonApplied,b.samuraiFlow||0)} 心流`:'';
  const thousandStr=thousand?` ｜ ⚡ 連擊值 ${Number(thousand.comboValue.toFixed(2))}，追擊 ${thousand.total}${thousand.segments.length?`（${thousand.segments.join('、')}）`:'（不產生追擊）'}`:'';
  const dragonHeal=dragonBladeActive()&&b.hand.length>=5&&!busted?dragonFiveHealPreview(t):null,dragonWalk=dragonBladeActive()&&!busted?dragonWalkGain(b.hand.length,b.hand.length>=5,1,false):0,dragonStr=dragonBladeActive()?` ｜ 🐉 ${b.hand.length} 張${b.samuraiWeaponState==='sheathed'?`居合 ×${dragonIaidoMultiplier(b.hand.length).toFixed(2)}`:'斬擊'}${dragonWalk?`｜龍行命中預計 +${dragonWalk} 心流`:''}${dragonHeal?`｜五龍治療預計 ${dragonHeal.healed} HP${(b.samuraiFlow||0)>=25?`、龍息 +${dragonHeal.flow} 心流`:''}`:''}${(b.samuraiFlow||0)>=50&&b.hand.length>=5&&!busted?'｜龍威 40% 護盾穿透':''}${b.samuraiDragonSheath?'｜乘龍歸鞘已選擇':''}`:'';
  const fortunePreview=fortuneBladeActive()?fortuneAttackProfile(t,b.samuraiFlow||0,b.samuraiWeaponState==='sheathed',false):null,fortuneUlt=fortuneBladeActive()&&isUp('luckycoin')?samuraiUltimateInfo():null,fortuneHeal=fortuneBladeActive()?fortuneUltimateHealPreview(Math.min(5,G.fortune||0)):null,fortuneUnmet=fortuneBladeActive()?[...(!isUp('luckycoin')?['來源未強化']:[]),...((b.samuraiFlow||0)<100?[`心流 ${b.samuraiFlow||0}/100`]:[]),...((G.fortune||0)<3?[`福緣 ${G.fortune||0}/3`]:[]),...(t<17||t>21?[`手牌 ${t} 點`]:[]),...(b.pendingBust||busted?['已爆牌']:[])]:[],fortuneStr=fortunePreview?` ｜ 🍀 福緣 ${fortunePreview.stacks}/5${fortunePreview.prepared?`｜預備使用 1 層，命中 +${fortunePreview.flowGain} 心流${fortunePreview.great?'（大吉：不消耗）':''}`:'｜本次不會使用'}${fortunePreview.multiplier>1?`｜${b.samuraiWeaponState==='sheathed'?'居合':'斬擊'} ×${fortunePreview.multiplier.toFixed(2)}`:''}｜一擲萬福${fortuneUlt?.ready?`可用：消耗 ${Math.min(5,G.fortune||0)} 層、×${(1.6+Math.min(5,G.fortune||0)*.1).toFixed(2)}、治療基礎 ${fortuneHeal.raw}`:`未滿足：${fortuneUnmet.join('、')||'條件檢查中'}`}`:'';
  const rubyPreview=rubyBladeActive()?rubyBladeAttackProfile(t,b.samuraiFlow||0,G.hp,b.samuraiWeaponState==='sheathed',false):null,rubyUltimate=rubyBladeActive()&&isUp('rubyring')?samuraiUltimateInfo():null,rubyUltimatePreview=rubyBladeActive()?rubyBladeAttackProfile(t,b.samuraiFlow||0,G.hp,b.samuraiWeaponState==='sheathed',true):null,rubyUnmet=rubyBladeActive()?[...(!isUp('rubyring')?['來源未強化']:[]),...((b.samuraiFlow||0)<100?[`心流 ${b.samuraiFlow||0}/100`]:[]),...(t<17||t>21?[`手牌 ${t} 點`]:[]),...(b.pendingBust||busted?['已爆牌']:[])]:[],rubyStr=rubyPreview?` ｜ 💎 提交 HP ${rubyPreview.hp}｜${rubyPreview.label}固定 +${rubyPreview.fixed}${rubyPreview.bloodReflection?`｜命中後血映 +${rubyPreview.bloodReflection} 心流`:''}${rubyPreview.shieldPierce?`｜護盾穿透 ${Math.round(rubyPreview.shieldPierce*100)}%`:''}｜緋晶一閃${rubyUltimate?.ready?`可用：正常攻擊 ×1.75 後固定 +${rubyUltimatePreview.fixed}、治療 15`:`未滿足：${rubyUnmet.join('、')||'條件檢查中'}`}`:'';
  const lifesteal=!busted&&!b.blind?previewPlayerLifesteal(tgt&&ghostInvincible(tgt)?0:dmg,rapid,tgt):null;
  const lifestealStr=lifesteal?` ｜ 🩸 吸血預估上限 +${lifesteal.amount}${lifesteal.adjusted>lifesteal.amount?'（受目前缺失生命限制）':''}${lifesteal.rapid?'（多段效率 30%）':''}`:'';
  let txt;
  if(b.blind>0){txt=t>=19&&t<=21?`🌑 可完全解除 ${b.blind} 層致盲 ｜ ${defensePreview}`:t<=18?`🌑 可解除 1 層致盲 ｜ ${defensePreview}`:'🌑 爆牌：無法解除致盲';$('outgoing').textContent=txt;return;}
  if(busted&&dmg===0) txt=`🗡 爆牌：造成 0 傷害，無法防禦${luckyPreview?.number&&hasP('doublebet')?`｜幸運數字反噬 −${gamblePenalty(t,true)} HP`:''}`;
  else if(busted) txt=`🗡 爆牌：保險造成 ${dmg} 傷害（不受幸運數字增幅），無法防禦${luckyPreview?.number&&hasP('doublebet')?`｜幸運數字反噬 −${gamblePenalty(t,true)} HP`:''}`;
  else if(tgt&&ghostInvincible(tgt)) txt=`${playerIsSamurai()&&hasActiveBlade()?(b.samuraiWeaponState==='sheathed'?'⚔️ 居合':'🗡️ 斬擊'):'🗡 攻擊'} ${dmg}${fdStr}（${tgt.name}無敵會擋）${luckyPreviewStr?` ｜ ${luckyPreviewStr}`:''}${lifestealStr}${safeLineStr}${immovableStr}${moonStr}${heartStr}${poisonStr}${dragonStr}${fortuneStr}${rubyStr}${thousandStr} ｜ ${defensePreview}`;
  else txt=`${playerIsSamurai()&&hasActiveBlade()?(b.samuraiWeaponState==='sheathed'?'⚔️ 居合':'🗡️ 斬擊'):'🗡 攻擊'} ${dmg}${fdStr}${luckyPreviewStr?` ｜ ${luckyPreviewStr}`:''}${lifestealStr}${safeLineStr}${immovableStr}${moonStr}${heartStr}${poisonStr}${dragonStr}${fortuneStr}${rubyStr}${thousandStr} ｜ ${defensePreview}`;
  if(hasP('suitmage')&&!busted)txt+=` ｜ 🎭 攻擊術式：${suitSpellPlanText('attack',b.hand)}｜防禦術式：${suitSpellPlanText('defense',b.hand)}${b.suitMagicUsed?'｜本副手牌已改色':''}${b.suitMainSuit?`｜主花色 ${b.suitMainSuit}${suitName(b.suitMainSuit)}`:''}${Math.max(0,(b.suitMagicSpent||0)-(b.suitMagicRefunded||0))?`｜提神藥可退還 ${Math.max(0,b.suitMagicSpent-b.suitMagicRefunded)}`:''}`;
  if(currentWeaknessStacks()>0){
    txt+=`（📉虛弱 −${currentWeaknessStacks()*10}%）`;
  }
  $('outgoing').textContent=txt;
}

function cancelFateGuide(reason=''){
  const b=G.battle;if(!b||!b.samuraiFateGuided)return;
  b.samuraiFateGuided=null;b.samuraiFateGuideDrawn=false;
  if(reason)log(`👁️ ${reason}，天機應驗失效。`,'dmg');
}
function fateGuideFlow(total){return total===21?25:total===20?20:total===19?15:total>=17?10:5;}
function fateSeverFlow(total){return total===21?20:total===20?16:total===19?12:8;}
function resolveFateDraw(card){
  const b=G.battle;if(!b)return;
  if(card===b.samuraiFateGuided){b.samuraiFateGuideDrawn=true;log('👁️ 引牌已到手：必須立即攻擊才能使天機應驗。','good');}
  if(b.samuraiFateSevered){
    const sever=b.samuraiFateSevered;b.samuraiFateSevered=null;
    if(sever.wouldBust&&handTotal(b.hand)<=21&&G.activeBlade==='peek'&&hasActiveBlade()){
      const gained=fateSeverFlow(handTotal(b.hand));addSamuraiFlow(gained,'天機脇差・避凶');log(`✂️ 避凶成功：原牌會造成爆牌，改抽後為 ${handTotal(b.hand)} 點。`,'good');
    }
  }
}

function hit(){
  const b=G.battle;if(b.over||b.busy||b.dealReady===false||b.pendingBust)return;
  if(b.hesitation>0&&b.hits>=hesitationLimit())return;
  b.discardMode=false;b.suitMode=false;b.suitSelected=null;
  b.busy=true;syncButtons();
  const rolled=b.mentalDisorder>0?rnd(1,2):1,count=b.hesitation>0?Math.min(rolled,Math.max(0,hesitationLimit()-b.hits)):rolled;let drawn=0;
  const finish=()=>{
    b.busy=false;
    if(handTotal(b.hand)>21){
      if(playerIsSamurai())clearMoonCounter('爆牌');
      if(playerIsSamurai())clearMyriadAffinity();
      if(playerIsSamurai())clearPoisonDraw();
      const redrawRescue=hasP('redraw')&&isUp('redraw')&&b.controlLeft>=currentControlCost('redraw'),insuranceUltimate=playerIsSamurai()&&G.activeBlade==='insurance'&&isUp('insurance')&&(b.samuraiFlow||0)>=100;
      if(redrawRescue||insuranceUltimate){
        b.pendingBust=true;
        log(`💥 爆牌！${redrawRescue?'可用「重抽」救牌；':''}${insuranceUltimate?'可選擇必殺「一命勘定」；':''}也可按「停牌」接受普通爆牌結算。`,'dmg');
        syncButtons();
      } else resolveBust();
    } else syncButtons();
  };
  const drawNext=()=>{
    if(drawn>=count||handTotal(b.hand)>21){finish();return;}
    if(b.samuraiFateGuideDrawn)cancelFateGuide('應驗牌到手後仍繼續抽牌');
    const previousTotal=handTotal(b.hand),c=b.deck.pop();b.hand.push(c);recordSafeLineDraw(previousTotal);assignHallucination(c);drawn++;b.hits++;SFX.draw();
    resolveFateDraw(c);
    const shown=shownCard(c),card=document.createElement('div');card.className='card dealing'+(shown.red?' red':'');card.innerHTML=`<div class="v">${cardLabel(shown)}</div><div class="s">${shown.s}</div>`;$('pl-cards').appendChild(card);
    log(`抽到 ${cardLabel(shown)}${shown.s}${c._illusion?'（你看見的牌面）':''}`,'hit');updateHandUI();if(!triggerBurnOnDraw())return;setTimeout(drawNext,220);
  };
  drawNext();
}

function thousandStrikeRankSuitCombo(hand){
  if(!hand.length)return 0;
  const values=hand.map(c=>c.r==='A'?11:['J','Q','K'].includes(c.r)?10:c.r);let total=values.reduce((sum,n)=>sum+n,0),soft=hand.reduce((n,c)=>n+(c.r==='A'),0);
  while(total>21&&soft>0){const i=hand.findIndex((c,index)=>c.r==='A'&&values[index]===11);if(i<0)break;values[i]=1;total-=10;soft--;}
  const actual=handTotal(hand),scale=actual===21&&hasP('court')&&hasCourt(hand)&&total>0?21/total:1;
  return hand.reduce((sum,c)=>sum+rankFlatBonus(c.r)*suitDamagePercent(c.s)/100+suitFlatBonus(c.s),0)*scale;
}
function thousandStrikeSegments(total,maxSegments=isUp('thousandstrikes')?7:5){
  const amount=Math.max(0,Math.round(total||0)),count=Math.min(amount,Math.max(1,maxSegments));if(!count)return [];
  const base=Math.floor(amount/count),remainder=amount%count;return Array.from({length:count},(_,i)=>base+(i<remainder?1:0));
}
function thousandStrikeProfile(comboValue){
  if(!hasP('thousandstrikes')||comboValue<=0)return {comboValue:Math.max(0,comboValue||0),total:0,segments:[]};
  const rate=isUp('thousandstrikes')?1.5:1,preNegative=Math.round(comboValue*rate),negativeMult=currentWeaknessStacks()>0?intimidationMult():1,total=Math.max(0,Math.round(preNegative*negativeMult)),segments=thousandStrikeSegments(total,isUp('thousandstrikes')?7:5);
  return {comboValue,rate,negativeMult,total,segments};
}
function thousandStrikeLifestealAmount(actualHpDamage,normalRate){return Math.max(0,Math.round(Math.max(0,actualHpDamage||0)*Math.max(0,normalRate||0)*.3));}
function applyLuckyAttackProfile(profile,hand,busted=false){
  const lucky=luckyNumberProfile(handTotal(hand),'battle');if(busted||!lucky.active||lucky.multiplier<=1)return profile;
  profile.notes=[...(profile.notes||[]),`🎲幸運數字${lucky.number}・${lucky.label}×${lucky.multiplier.toFixed(2)}`];
  if(profile.rapid){
    const boosted=Math.max(0,Math.round(profile.dmg*lucky.multiplier)),segments=Math.max(1,profile.rapid.segments||1),segmentDamage=Math.max(1,Math.floor(boosted/segments));
    profile.rapid.segmentDamage=segmentDamage;profile.rapid.iaidoFlatBonus=(profile.rapid.iaidoFlatBonus||0)+Math.max(0,boosted-segmentDamage*segments);profile.dmg=boosted;
  }else profile.dmg=Math.max(0,Math.round(profile.dmg*lucky.multiplier));
  profile.luckyNumber=lucky.number;profile.luckyHit=lucky.type;profile.luckyMultiplier=lucky.multiplier;return profile;
}
function applySamuraiBladeDamage(profile,hand,busted,options={}){
  const b=G.battle,ultimate=b?.samuraiUltimate||null;
  const bloodAttack=G.activeBlade==='vampire'&&((b?.samuraiBloodWager||0)>0||ultimate==='vampire');
  const safeProfile=G.activeBlade==='safe21'?samuraiSafeLineProfile():null,safeAttack=!!(safeProfile&&safeProfile.valid);
  const moonUltimate=ultimate==='buckler',moonCounterAttack=G.activeBlade==='buckler'&&!!b?.samuraiMoonCounter&&!moonUltimate,mirrorUltimate=ultimate==='antidote',mirrorClean=mirrorUnblemishedActive(),mirrorAttack=G.activeBlade==='antidote'&&mirrorClean&&!mirrorUltimate,heartUltimate=ultimate==='heartguard',myriadUltimate=ultimate==='howdidwegethere',myriadAttack=G.activeBlade==='howdidwegethere'&&!myriadUltimate,poisonUltimate=ultimate==='toxicology',dragonUltimate=ultimate==='dragonneck',dragonAttack=G.activeBlade==='dragonneck',fortuneUltimate=ultimate==='luckycoin',fortuneAttack=G.activeBlade==='luckycoin'&&!fortuneUltimate,rubyUltimate=ultimate==='rubyring',rubyAttack=G.activeBlade==='rubyring'&&!rubyUltimate;
  if(!playerIsSamurai()||!b||!hasActiveBlade()||(b.samuraiWeaponState!=='sheathed'&&ultimate!==G.activeBlade&&!bloodAttack&&!safeAttack&&!moonCounterAttack&&!mirrorAttack&&!myriadAttack&&!dragonAttack&&!fortuneAttack&&!rubyAttack))return profile;
  if(busted){
    if(G.activeBlade!=='insurance'||!hasP('insurance')||profile.dmg<=0)return profile;
    const ultimate=b.samuraiUltimate==='insurance',mult=(b.samuraiFlow||0)>=50?1.6:1.4,breach=(b.samuraiFlow||0)>=25?Math.min(10,Math.max(0,handTotal(hand)-21)):0;
    profile.notes=[...(profile.notes||[]),`🛡️逆拔×${mult.toFixed(2)}`];
    if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*mult));profile.rapid.iaidoFlatBonus=(profile.rapid.iaidoFlatBonus||0)+breach;profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+profile.rapid.iaidoFlatBonus;}
    else profile.dmg=Math.max(1,Math.round(profile.dmg*mult)+breach);
    if(breach)profile.notes.push(`破綻計價+${breach}`);
    if((b.samuraiFlow||0)>=75){profile.shieldPierce=.5;profile.notes.push('拒絕免責：無視50%護盾');}
    if(ultimate){
      profile.shieldPierce=1;
      if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*2));profile.rapid.iaidoFlatBonus=Math.round((profile.rapid.iaidoFlatBonus||0)*2);profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+profile.rapid.iaidoFlatBonus;}
      else profile.dmg=Math.max(1,Math.round(profile.dmg*2));
      profile.notes.push('⚡一命勘定×2','完全無視護盾');
    }
    profile.insuranceReverse=true;return profile;
  }
  const iaido=b.samuraiWeaponState==='sheathed',fortuneProfile=fortuneAttackProfile(handTotal(hand),b.samuraiFlow||0,iaido,fortuneUltimate),immovableUltimate=ultimate==='bulwark',mult=immovableUltimate?immovableUltimateMultiplier():moonUltimate?2:mirrorUltimate?mirrorUltimateMultiplier():heartUltimate?1.75:myriadUltimate?myriadUltimateMultiplier():poisonUltimate?1.75:dragonUltimate?2.10:fortuneUltimate?fortuneProfile.multiplier:rubyUltimate?1.75:fortuneAttack?fortuneProfile.multiplier:moonCounterAttack?moonCounterMultiplier(iaido,b.samuraiFlow||0):myriadAttack?Number(((iaido?1.15:1)*myriadPhaseMultiplier(b.samuraiFlow||0)).toFixed(6)):mirrorAttack&&!iaido?1.15:iaido?samuraiIaidoMultiplier():1,court=G.activeBlade==='court',fateBlade=G.activeBlade==='peek',faceBonus=court&&(b.samuraiFlow||0)>=50?Math.min(3,hand.filter(c=>['J','Q','K'].includes(c.r)).length)*.05:0,bonus=G.activeBlade==='firststrike'&&(b.samuraiFlow||0)>=75?Math.round(handTotal(hand)*.5):0,finalMult=mult+faceBonus;
  profile.notes=[...(profile.notes||[])];if(iaido||ultimate||bloodAttack||moonCounterAttack||mirrorAttack||myriadAttack||fortuneAttack||rubyAttack)profile.notes.push(`${immovableUltimate?'⚡一念不動':moonUltimate?'⚡滿月返照':mirrorUltimate?'⚡明鏡止水':heartUltimate?'⚡護心一文字':myriadUltimate?'⚡萬象歸一':poisonUltimate?'⚡百毒穿心':dragonUltimate?'⚡五龍吞天':fortuneUltimate?'⚡一擲萬福':rubyUltimate?'⚡緋晶一閃':fortuneAttack&&fortuneProfile.prepared?(iaido&&fortuneProfile.multiplier===1.25?'🍀福斬居合':fortuneProfile.multiplier===1.10?'🍀福斬':'🍀開運預備'):moonCounterAttack?(iaido&&(b.samuraiFlow||0)>=50?'🌙輪返居合':'🌙盾返'):mirrorAttack?(iaido?'🪞無垢居合':'🪞無垢斬擊'):myriadAttack?(iaido?'🌀異相居合':'🌀異相斬擊'):iaido?'🗡️居合':ultimate?'⚡必殺基礎':'🩸血博斬擊'}×${finalMult.toFixed(2)}`);
  if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*finalMult));profile.rapid.iaidoFlatBonus=bonus;profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+bonus;}
  else profile.dmg=Math.max(0,Math.round(profile.dmg*finalMult)+bonus);
  if(bonus>0)profile.notes.push(`🌊澄明居合+${bonus}`);
  if(court){
    profile.courtSeals=Math.min(3,b.samuraiCourtSeals||0);
    if(profile.courtSeals>=3&&(b.samuraiFlow||0)>=75){profile.shieldPierce=.5;profile.notes.push('👑三公印：無視50%護盾');}
  }
  if(fateBlade&&!ultimate&&b.samuraiFateGuideDrawn&&b.hand.includes(b.samuraiFateGuided)&&handTotal(hand)>=19&&handTotal(hand)<=21&&(b.samuraiFlow||0)>=50){profile.shieldPierce=.5;profile.notes.push('👁️看破：無視50%護盾');}
  if(moonCounterAttack&&iaido&&isUp('buckler')&&(b.samuraiFlow||0)>=75){profile.shieldPierce=.4;profile.notes.push('🌕 缺月復圓：無視40%護盾');}
  if(mirrorAttack&&iaido){profile.shieldPierce=.3;profile.notes.push('🪞無垢居合：無視30%護盾');}
  if(myriadAttack&&iaido&&(b.samuraiFlow||0)>=75&&playerPhaseStatuses().length>=4){profile.shieldPierce=.4;profile.notes.push('🌀共相居合：無視40%護盾');}
  if(G.activeBlade==='toxicology'&&!poisonUltimate&&iaido&&b.samuraiPoisonDraw&&(b.samuraiFlow||0)>=75){profile.shieldPierce=.4;profile.notes.push('🐍留毒：毒拔直接攻擊無視40%護盾');}
  if(dragonAttack&&!dragonUltimate&&(b.samuraiFlow||0)>=50&&hand.length>=5){profile.shieldPierce=Math.max(profile.shieldPierce||0,.4);profile.notes.push('🐉龍威：無視40%護盾');}
  if(G.activeBlade==='vampire'&&bloodAttack){
    const raises=b.samuraiBloodRaises||0,streak=b.samuraiBloodStreak||0,bloodMult=(1+raises*.3)*Math.pow(1.1,streak);
    if(bloodMult!==1){
      if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*bloodMult));profile.rapid.iaidoFlatBonus=Math.round((profile.rapid.iaidoFlatBonus||0)*bloodMult);profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0);}
      else profile.dmg=Math.max(1,Math.round(profile.dmg*bloodMult));
      profile.notes.push(`🩸血博×${bloodMult.toFixed(2)}`);
    }
  }
  if(G.activeBlade==='safe21'&&safeAttack&&ultimate!=='safe21'){
    const lineMult=safeProfile.perfect?1.5:safeProfile.guard?1.15:1+Math.min(2,safeProfile.extra)*((b.samuraiFlow||0)>=50?.25:.20);
    if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*lineMult));profile.rapid.iaidoFlatBonus=Math.round((profile.rapid.iaidoFlatBonus||0)*lineMult);profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0);}
    else profile.dmg=Math.max(1,Math.round(profile.dmg*lineMult));
    profile.notes.push(`${safeProfile.perfect?'⚖️完美守線':safeProfile.guard?'⚖️守線':`⚖️越線${Math.min(2,safeProfile.extra)}張`}×${lineMult.toFixed(2)}`);
    if((b.samuraiFlow||0)>=75&&safeProfile.guard&&safeProfile.total>=19){profile.shieldPierce=.4;profile.notes.push('⚖️界眼：無視40%護盾');}
  }
  if(ultimate==='firststrike'){
    const finisher=1.75;profile.shieldPierce=.5;
    if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*finisher));profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0);}
    else profile.dmg=Math.max(1,Math.round(profile.dmg*finisher));
    profile.notes.push('⚡無想一閃×1.75','無視50%護盾');
  }else if(ultimate==='court'){
    const segmentDamage=Math.max(1,Math.round(profile.dmg*.7));profile.rapid={segments:3,segmentDamage,pointDamage:profile.dmg,additive:0,rate:.7,shieldPierce:profile.shieldPierce||0,ultimateCourt:true};profile.dmg=segmentDamage*3;profile.notes.push(`⚡三公會審 3段×${segmentDamage}`);
  }else if(ultimate==='peek'){
    const finisher=1.35;profile.shieldPierce=.5;
    if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*finisher));profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0);}
    else profile.dmg=Math.max(1,Math.round(profile.dmg*finisher));
    profile.notes.push('⚡斬斷因果×1.35','無視50%護盾');
  }else if(ultimate==='safe21'){
    const finisher=1.75;profile.shieldPierce=.5;
    if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*finisher));profile.rapid.iaidoFlatBonus=Math.round((profile.rapid.iaidoFlatBonus||0)*finisher);profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0);}
    else profile.dmg=Math.max(1,Math.round(profile.dmg*finisher));
    profile.notes.push('⚡界線斷決×1.75','無視50%護盾');
  }else if(ultimate==='vampire'){
    const finisher=2.25;profile.shieldPierce=.5;
    if(profile.rapid){profile.rapid.segmentDamage=Math.max(1,Math.round(profile.rapid.segmentDamage*finisher));profile.rapid.iaidoFlatBonus=Math.round((profile.rapid.iaidoFlatBonus||0)*finisher);profile.dmg=profile.rapid.segments*profile.rapid.segmentDamage+(profile.rapid.iaidoFlatBonus||0);}
    else profile.dmg=Math.max(1,Math.round(profile.dmg*finisher));
    profile.notes.push('⚡血本無歸×2.25','無視50%護盾');
  }else if(ultimate==='bulwark'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='buckler'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='antidote'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='heartguard'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='howdidwegethere'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='toxicology'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='dragonneck'){
    profile.shieldPierce=.6;profile.notes.push('無視60%護盾');
  }else if(ultimate==='luckycoin'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }else if(ultimate==='rubyring'){
    profile.shieldPierce=.5;profile.notes.push('無視50%護盾');
  }
  if(rubyAttack&&(b.samuraiFlow||0)>=75&&(handTotal(hand)===20||handTotal(hand)===21)){profile.shieldPierce=Math.max(profile.shieldPierce||0,.3);profile.notes.push('💎無瑕：無視30%護盾');}
  profile.moonCounterAttack=moonCounterAttack;profile.moonUltimate=moonUltimate;
  return profile;
}
function finalizeSamuraiAttackDamage(profile,hand,busted,options={}){
  if(playerIsSamurai()&&!busted&&!hasActiveBlade())return {dmg:1,notes:[...(profile.notes||[]),'✊徒手傷害固定為1']};
  const result=applySamuraiBladeDamage(profile,hand,busted,options),zanshin=!busted&&playerIsSamurai()?playerZanshinProfile():null;
  if(zanshin&&hasActiveBlade()){
    if(result.rapid){result.rapid.segmentDamage=Math.max(1,Math.round(result.rapid.segmentDamage*zanshin.attack));result.rapid.iaidoFlatBonus=Math.round((result.rapid.iaidoFlatBonus||0)*zanshin.attack);result.dmg=result.rapid.segments*result.rapid.segmentDamage+(result.rapid.iaidoFlatBonus||0);}
    else result.dmg=Math.max(0,Math.round(result.dmg*zanshin.attack));
    result.notes=[...(result.notes||[]),`🧘殘心×${zanshin.attack.toFixed(2)}`];
  }
  const ruby=rubyBladeAttackProfile(handTotal(hand),options.submitFlow??G.battle?.samuraiFlow??0,options.hpSnapshot??G.hp,G.battle?.samuraiWeaponState==='sheathed',G.battle?.samuraiUltimate==='rubyring');
  return !busted&&ruby.valid?applyRubyPostMultiplierDamage(result,ruby):result;
}
function computeDamage(hand,busted,options={}){
  if(G.developerMode&&Number.isFinite(G.battle?.devDamageOverride)){const mult=G.battle?.whetstone||1;return {dmg:Math.max(0,Math.round(G.battle.devDamageOverride*mult)),notes:['🛠 強制傷害',...(mult>1?[`🧴磨刀石×${mult.toFixed(3)}`]:[])]};}
  if(busted&&!hasP('insurance'))return {dmg:0,notes:[]};
  const insN=isUp('insurance')?3:2;
  const damageHand=busted?hand.slice(0,insN):hand,plainBase=handTotal(damageHand),rankBase=rankDamageBase(damageHand);
  const thousandEligible=!busted&&hasP('thousandstrikes');let comboValue=thousandEligible?thousandStrikeRankSuitCombo(hand):0,dmg=rankBase;
  const notes=[];
  if(rankBase>plainBase+0.001)notes.push(`🔢牌面強化+${(rankBase-plainBase).toFixed(2)}`);
  if(hasP('court')){const f=hand.filter(c=>['J','Q','K'].includes(c.r)).length;if(f){const v=(isUp('court')?4:3)*f;dmg+=v;if(thousandEligible)comboValue+=v;notes.push(`宮廷面牌+${v}`);}}
  if(!busted&&hasP('firststrike')&&samuraiFirstStrikeWindow()){
    const t=handTotal(hand),ok=isUp('firststrike')?hand.length<=3&&t>=19&&t<=21:hand.length===2&&t===20;
    if(ok){const v=isUp('firststrike')?30:20;dmg+=v;if(thousandEligible)comboValue+=v;notes.push(`⚔️先發+${v}`);}
  }
  if(!busted&&hasP('straight')){
    const run=longestStraight(hand);if(run>=3){const v=isUp('straight')?(run>=4?40:24):18;dmg+=v;if(thousandEligible)comboValue+=v;notes.push(`🔗連號+${v}`);}
  }
  if(!busted&&hasP('court')&&hasCourt(hand)){const v=isUp('court')?50:35;dmg+=v;if(thousandEligible)comboValue+=v;notes.push(`👑宮廷+${v}`);}
  if(!busted&&hasP('safe21')&&handTotal(hand)>=17){const v=isUp('safe21')?8:5;dmg+=v;if(thousandEligible)comboValue+=v;notes.push('安全線+'+v);}
  const affixFlat=affixAttackFlat();if(affixFlat){dmg+=affixFlat;if(thousandEligible)comboValue+=affixFlat;notes.push(`暗器+${affixFlat}`);}
  if(!busted&&handTotal(hand)===21){dmg=Math.round(dmg*1.5);notes.push('21點×1.5');}
  if(!busted&&hasP('dragonneck')&&hand.length>=5){let bonus=50;if(isUp('dragonneck'))bonus+=Math.round(handTotal(hand)*0.5);dmg+=bonus;if(thousandEligible)comboValue+=bonus;notes.push('🐉五龍+'+bonus);}
  if(!busted&&hasP('echelon')){const extra=hand.length-2;if(extra>0){const value=fact(extra+(isUp('echelon')?1:0));dmg+=value;if(thousandEligible)comboValue+=value;notes.push('📈階層+'+value);}}
  if(!busted&&G.battle&&G.battle.focus>0){dmg+=G.battle.focus;notes.push('⚡蓄勢+'+G.battle.focus);}
  if(G.battle&&currentWeaknessStacks()>0){
    const m=intimidationMult();
    dmg=Math.round(dmg*m);
    notes.push(`📉虛弱−${currentWeaknessStacks()*10}%`);
  }
  if(!busted&&lastStandActive()){
    const m=bloodDescendantActive()?1.8:isUp('laststand')?1.6:1.5;dmg=Math.round(dmg*m);notes.push(`🔥背水×${m}`);
  }
  if(!busted&&bulwarkCounterattackActive()&&G.battle){
    const excess=Math.max(0,G.battle.defense-incomingTotal()),steps=Math.min(6,Math.floor(excess/10));
    if(steps>0){const m=1+steps*0.1;dmg=Math.round(dmg*m);notes.push(`🏰堡壘反攻×${m.toFixed(1)}`);}
  }
  if(!busted&&hasP('bountyhunter')&&G.bountyHunt&&G.bountyHunt.bonuses.length){const v=G.bountyHunt.bonuses[0];dmg+=v;if(thousandEligible)comboValue+=v;notes.push(`💰賞金獵人+${v}`);}
  if(!busted&&bloodDescendantActive()&&G.battle&&G.battle.bloodDamageStacks>0){const m=descendantDamageMultiplier();dmg=Math.round(dmg*m);notes.push(`🩸血魔血性×${m.toFixed(2)}`);}
  const sharpMult=affixAttackMult();if(sharpMult>1){dmg=Math.round(dmg*sharpMult);notes.push(`鋒利×${sharpMult.toFixed(2)}`);}
  if((G.battle?.whetstone||1)>1){dmg=Math.round(dmg*G.battle.whetstone);notes.push(`🧴磨刀石×${G.battle.whetstone.toFixed(3)}`);}
  const profile=applyLuckyAttackProfile({dmg:Math.max(0,Math.round(dmg)),notes,thousand:thousandEligible?thousandStrikeProfile(comboValue):null},hand,busted);
  return finalizeSamuraiAttackDamage(profile,hand,busted,options);
}

function computeDefense(hand,options={}){
  const b=G.battle,t=handTotal(hand);
  if(G.developerMode&&Number.isFinite(b?.devDefenseOverride))return Math.max(0,Math.round(b.devDefenseOverride));
  if(t>21)return 0;
  const heartRate=!options.ignoreHeartguard&&hasP('heartguard')?(isUp('heartguard')?0.5:0.3):0;
  const repeatPenalty=Math.max(0.4,1-(b.guardStreak||0)*0.2);
  let def=Math.floor((t*(0.65+heartRate)+affixDefenseFlat())*repeatPenalty);
  if(hasP('straight')){const run=longestStraight(hand);if(run>=3)def+=isUp('straight')?(run>=4?40:24):18;}
  if(hasP('court')&&isUp('court')&&hasCourt(hand))def+=25;
  if(lastStandActive()&&!isUp('laststand'))def=Math.floor(def*0.8);
  if(b.blind>0)def=Math.floor(def*0.8);
  def=Math.floor(def*affixDefenseMult());
  return Math.max(1,Math.floor(def));
}
function heartguardDefenseEquivalent(hand){
  if(!hasP('heartguard')||handTotal(hand)>21)return 0;
  return Math.max(0,computeDefense(hand)-computeDefense(hand,{ignoreHeartguard:true}));
}
function defenseActionProfile(hand,consume=false,spellPlan=null){
  const b=G.battle,t=handTotal(hand),fractureMult=fractureMultiplier(b),shield=consume?useBuckler():{def:bucklerDefense(),broke:false};
  let def=Math.floor(computeDefense(hand)*fractureMult);shield.def=Math.round(shield.def*fractureMult*(b.blind>0?.8:1));
  const ironskinMult=b.ironskin||1;if(ironskinMult>1){def=Math.round(def*ironskinMult);shield.def=Math.round(shield.def*ironskinMult);}
  const lucky=luckyNumberProfile(t,'battle'),beforeLucky=def+shield.def;
  if(lucky.active&&lucky.multiplier>1&&beforeLucky>0){
    const total=Math.round(beforeLucky*lucky.multiplier),shieldShare=Math.round(shield.def/beforeLucky*total);shield.def=shieldShare;def=Math.max(0,total-shieldShare);
  }
  const spellMult=spellDefenseMultiplier(spellPlan);if(spellMult>1){def=Math.round(def*spellMult);shield.def=Math.round(shield.def*spellMult);}
  return {def,shield,total:def+shield.def,lucky,fractureMult,ironskinMult,spellMult};
}

function executeRapidStrikes(profile,busted=false){
  const b=G.battle,initialTarget=currentTarget(),results=[];let target=initialTarget,totalDealt=0,statusProcDone=false,used=0,transformed=false;
  log(`⚡ 多段攻擊展開：${profile.segments} 段，每段基礎 ${profile.segmentDamage} 傷害。`,'gd');
  for(let i=0;i<profile.segments;i++){
    if(!target||target.curhp<=0){const alive=b.enemies.filter(e=>e.curhp>0);if(!alive.length)break;target=alive[rnd(0,alive.length-1)];log(`⚡ 溢出的第 ${i+1} 段轉向 ${target.name}！`,'hit');}
    b.target=target.idx;const postMultiplierFlat=i===0?(profile.postMultiplierFlat||0):0,segmentDamage=profile.segmentDamage+(i===0?(profile.iaidoFlatBonus||0)+(profile.iaidoFollowBonus||0)+postMultiplierFlat:0),dealt=attackEnemy(segmentDamage,{busted,rapid:true,suppressStatusProc:statusProcDone,shieldPierce:profile.shieldPierce||0,postMultiplierFlat});used++;
    if(dealt>0){results.push({target,dealt});totalDealt+=dealt;statusProcDone=true;}
    if(target.justTransformed){transformed=true;break;}
  }
  log(`⚡ 多段攻擊結算：命中 ${results.length}/${used} 段，合計 ${totalDealt} 傷害。`,totalDealt>0?'gd':'dmg');
  return {dealt:totalDealt,results,initialTarget,statusTarget:results[0]&&results[0].target,transformed};
}
function settleThousandBeheading(target){
  if(!target||target.curhp<=0||target.downed||!hasP('beheading'))return 0;const threshold=target.maxhp*(Math.max(5,G.beheadingPercent||5)/100);if(target.curhp>threshold)return 0;
  const damage=Math.max(0,target.curhp);target.curhp=0;if(damage)recordDamageDealt(damage,`${target.name}（斬首）`);log(`⚔️ 斬首：所有追擊完成後，${target.name}落入 ${Math.max(5,G.beheadingPercent||5)}% 斬首線！`,'gd');
  if(target.type==='kun'){resolveKunEbbAction();transformKunToPeng(target,'斬首');}
  else if(target.type==='cultLeader')transformCultLeaderToCthulhu('斬首');
  else if(target.type==='inquisitorMounted')transformInquisitor('斬首');
  else if(target.type==='zombie'&&!target.revived){target.curhp=1;target.downed=true;target.downedRound=G.battle.round;target.nextDmg=0;log(`🧟 ${target.name}被斬倒，但仍須依殭屍規則完成處決。`,'dmg');}
  else{
    log(`${target.name} 被擊倒！`,'good');recordEnemyDefeat(target);if(target.type==='inquisitor')weakenInquisitorEscorts('擊倒');ensureTarget();if(target.type==='squirrel')recoverSquirrelGold(target);if(target.inquisitorEscort)addInquisitorCrime(5,'擊殺聖騎士');
    if(target.type==='gargoyle'){const cultists=G.battle.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>{x.curhp=0;recordEnemyDefeat(x);});releaseGargoyleLocks(target.idx);if(cultists.length)log(`🗿 石像鬼崩毀，儀式斷裂！${cultists.length} 名邪教徒隨之死亡。`,'gd');ensureTarget();}
    if(target.type==='cultist'){if(target.hasStolen)cultistRestoreUpgrade(target,'歸還');reviveCultistsFromGargoyleShield(G.battle.enemies.find(x=>x.type==='gargoyle'&&x.curhp>0));}
  }
  renderEnemies();return damage;
}
function executeThousandStrikes(profile,originalTarget){
  const b=G.battle,segments=profile?.segments||[];if(!b||!segments.length)return {dealt:0,lastTarget:originalTarget,byTarget:[]};
  const totals=new Map();let target=originalTarget,lastTarget=null,totalHpDamage=0,originalTransformed=false;
  for(let i=0;i<segments.length;i++){
    if(!target||target.curhp<=0||target.downed){const alive=b.enemies.filter(e=>e.curhp>0&&!e.downed);if(!alive.length)break;target=alive[rnd(0,alive.length-1)];}
    b.target=target.idx;lastTarget=target;const beforeHp=Math.max(0,target.curhp),beforeType=target.type,dealt=attackEnemy(segments[i],{followup:true,suppressStatusProc:true,suppressBeheading:true}),transformed=target.type!==beforeType||target.justTransformed,actual=transformed?Math.max(0,Math.min(beforeHp,dealt)):Math.max(0,Math.min(beforeHp,beforeHp-Math.max(0,target.curhp)));
    totalHpDamage+=actual;const entry=totals.get(target)||{target,damage:0,hits:0};entry.damage+=actual;entry.hits++;totals.set(target,entry);if(transformed){if(target===originalTarget)originalTransformed=true;else target.justTransformed=false;target=null;}
  }
  const byTarget=[...totals.values()];log(`⚡ 一瞬千擊：連擊值 ${Number(profile.comboValue.toFixed(2))}，追擊總額 ${profile.total}，${segments.length} 段（${segments.join('、')}）。`,'gd');
  byTarget.forEach(entry=>log(`⚡ ${entry.target.name} 承受 ${entry.hits} 段追擊，實際 HP 傷害 ${entry.damage}${entry.damage?'':'（完全抵擋）'}。`,entry.damage?'good':'dmg'));
  return {dealt:totalHpDamage,lastTarget:lastTarget||originalTarget,byTarget,originalTransformed};
}
function recordPlayedFloor(){runStats().highestFloor=Math.max(runStats().highestFloor,G.floor);}

function resolveBust(){
  const b=G.battle,lostFocus=b.focus||0,blade=activeBladeDef(),wasSheathed=playerIsSamurai()&&!!blade&&b.samuraiWeaponState==='sheathed',ultimate=b.samuraiUltimate||null,insuranceReverse=(wasSheathed||ultimate==='insurance')&&blade?.id==='insurance'&&hasP('insurance'),flowBefore=b.samuraiFlow||0;
  if(b.samuraiFateGuided)cancelFateGuide('爆牌');closeFatePicker();
  if(playerIsSamurai())clearPlayerZanshin('爆牌');
  if(playerIsSamurai())clearMoonCounter('爆牌');
  if(playerIsSamurai())clearMyriadAffinity();
  if(playerIsSamurai())clearPoisonDraw();
  if(playerIsSamurai())clearDragonSheath();
  if(playerIsSamurai())clearDragonSheath();
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('爆牌');
  recordPlayedFloor();
  runStats().busts++;runStats().actions.attack++;
  b.pendingBust=false;b.guardStreak=0;b.focus=0;b.inquisitorDamageCrime=false;revealHallucinations();applyDisciplineAction('attack',true);if(b.upgradeReprieve>0)b.upgradeReprieve=0;SFX.bust();log('💥 爆牌！','dmg');resolveMikiriBust();
  if(lostFocus>0)log(`⚡ 蓄勢潰散：失去 ${lostFocus} 點蓄勢。`,'dmg');
  beginKunEbbAction();
  const profile=computeDamage(b.hand,true);let {dmg,notes,rapid,shieldPierce=0}=profile;b.samuraiUltimate=null;
  b.whetstone=0;
  if(b.blind>0){if(wasSheathed)b.samuraiWeaponState='drawn';log('🌑 致盲中爆牌，無法解除致盲，也不會發動保險攻擊。','dmg');resolveKunEbbAction();if(applyGamblePenalty(handTotal(b.hand),true))return;endPlayerTurn();return;}
  if(rapid)rapid.shieldPierce=shieldPierce;
  let dealt=0;
  if(dmg>0){log(`${ultimate==='insurance'?'⚡ 必殺・一命勘定':insuranceReverse?'🛡️ 破綻脇差・逆拔':'保險生效'}，造成 ${dmg} 傷害`+(notes.length?`（${notes.join('，')}）`:''),'good');dealt=rapid?executeRapidStrikes(rapid,true).dealt:attackEnemy(dmg,{busted:true,shieldPierce});}
  else log('本回合攻擊無效。');
  if(wasSheathed||ultimate==='insurance'){
    if(insuranceReverse){
      if(ultimate==='insurance'){b.samuraiFlow=0;b.samuraiWeaponState='sheathed';log('🗡️ 一命勘定結算完畢，心流歸零並直接收刀。','gd');}
      else{if(dealt>0)addSamuraiFlow(10,'破綻脇差逆拔命中');const renewed=flowBefore>=100;b.samuraiWeaponState=renewed?'sheathed':'drawn';log(renewed?'🛡️ 續保生效：逆拔後直接回到納刀狀態。':'🗡️ 逆拔完成，破綻脇差進入出鞘狀態。',renewed?'gd':'good');}
    }else{b.samuraiWeaponState='drawn';log(`🗡️ 居合因爆牌失敗，但${blade.name}仍已出鞘。`,'dmg');}
  }
  resolveKunEbbAction();
  if(applyGamblePenalty(handTotal(b.hand),true))return;
  eagleRecoverEvasion('爆牌');
  endPlayerTurn();
}

function attack(){
  const b=G.battle;if(b.over||b.busy||b.dealReady===false)return;
  if(b.pendingBust){resolveBust();return;}
  recordPlayedFloor();
  if(b.blind>0&&b.samuraiUltimate!=='antidote'){clearPoisonDraw();clearDragonSheath();runStats().actions.attack++;resolveBlind();return;}
  runStats().actions.attack++;
  const t=handTotal(b.hand),spellPlan=suitSpellPlan('attack',b.hand,b.suitMainSuit),blade=activeBladeDef(),ultimate=b.samuraiUltimate||null,samuraiIaido=playerIsSamurai()&&!!blade&&b.samuraiWeaponState==='sheathed',safeLine=blade?.id==='safe21'?samuraiSafeLineProfile():null,safeLineFlow=b.samuraiFlow||0,zanshinBefore=playerIsSamurai()?playerZanshinProfile():null,moonCounterBefore=blade?.id==='buckler'&&!!b.samuraiMoonCounter,moonFlowBefore=b.samuraiFlow||0,flowAtSubmit=b.samuraiFlow||0,hpAtSubmit=Math.max(0,Math.floor(G.hp)),fortuneProfileAtSubmit=blade?.id==='luckycoin'?fortuneAttackProfile(t,b.samuraiFlow||0,samuraiIaido,ultimate==='luckycoin'):null,fortuneUltimateSpend=ultimate==='luckycoin'?Math.min(5,Math.max(0,G.fortune||0)):0;
  const dragonSheathChosen=blade?.id==='dragonneck'&&!ultimate&&!!b.samuraiDragonSheath&&flowAtSubmit>=75&&b.hand.length>=5&&t<=21;clearDragonSheath();
  const poisonDrawChosen=blade?.id==='toxicology'&&samuraiIaido&&!ultimate&&!!b.samuraiPoisonDraw,poisonSnapshot=blade?.id==='toxicology'&&(poisonDrawChosen||ultimate==='toxicology')?poisonDrawSnapshot(currentTarget(),flowAtSubmit,ultimate==='toxicology'):null;
  if(blade?.id==='vampire'&&!ultimate&&(b.samuraiBloodStreak||0)>0&&!(b.samuraiBloodWager||0)){b.samuraiBloodStreak=0;log('🩸 未續下血籌便出刀，連莊歸零。','dmg');}
  const firstStrikeFlow=blade?.id==='firststrike'&&samuraiIaido&&hasP('firststrike')&&samuraiFirstStrikeWindow()&&(isUp('firststrike')?b.hand.length<=3&&t>=19&&t<=21:b.hand.length===2&&t===20);
  const fiveDragon=hasP('dragonneck')&&b.hand.length>=5&&t<=21;
  const damageProfile=computeDamage(b.hand,false,{hpSnapshot:hpAtSubmit,submitFlow:flowAtSubmit});const thousandProfile=!ultimate?damageProfile.thousand:null,spellMainMult=spellAttackMultiplier(spellPlan);if(spellMainMult>1){applyAttackSpellMultiplier(damageProfile,spellMainMult);damageProfile.notes=[...(damageProfile.notes||[]),`🎭磨刀術式×${spellMainMult.toFixed(3)}`];}let {dmg,notes,rapid,courtSeals=0,shieldPierce=0,rubyProfile=null,rubyFlat=0}=damageProfile;
  clearPoisonDraw();
  b.samuraiUltimate=null;
  b.whetstone=0;
  b.inquisitorDamageCrime=false;revealHallucinations();applyDisciplineAction('attack');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  b.guardStreak=0;
  const ultimateName=ultimate==='firststrike'?'無想一閃':ultimate==='safe21'?'界線斷決':ultimate==='court'?'三公會審':ultimate==='peek'?'斬斷因果':ultimate==='vampire'?'血本無歸':ultimate==='bulwark'?'一念不動':ultimate==='buckler'?'滿月返照':ultimate==='antidote'?'明鏡止水':ultimate==='heartguard'?'護心一文字':ultimate==='howdidwegethere'?'萬象歸一':ultimate==='toxicology'?'百毒穿心':ultimate==='dragonneck'?'五龍吞天':ultimate==='luckycoin'?'一擲萬福':ultimate==='rubyring'?'緋晶一閃':null;
  log(`${ultimateName?`⚡ 必殺・${ultimateName}`:samuraiIaido?`⚔️ ${blade.name}・居合`:playerIsSamurai()&&blade?`🗡️ ${blade.name}・斬擊`:'🗡 選擇攻擊'}，點數 ${t}`+(notes.length?`（${notes.join('，')}）`:''));
  if(samuraiIaido)b.samuraiWeaponState='drawn';
  b.focus=0;
  if(fiveDragon)log('🐉 龍頭項鍊·五龍！五張不爆觸發！','gd');
  beginKunEbbAction();
  const initialTarget=currentTarget();applySuitArmorPierce(spellPlan,initialTarget);
  if(rapid)rapid.shieldPierce=shieldPierce;
  const rapidResult=rapid?executeRapidStrikes(rapid,false):null,attackedTarget=rapidResult&&rapidResult.statusTarget||initialTarget,dealt=rapidResult?rapidResult.dealt:attackEnemy(dmg,{shieldPierce,suppressBeheading:!!thousandProfile,postMultiplierFlat:rubyFlat});
  const thousandResult=thousandProfile?.segments?.length?executeThousandStrikes(thousandProfile,initialTarget):{dealt:0,lastTarget:attackedTarget,byTarget:[],originalTransformed:false};
  if(thousandProfile)settleThousandBeheading(thousandResult.lastTarget||attackedTarget);
  if((samuraiIaido||ultimate==='court')&&blade?.id==='court'){
    const returned=!ultimate&&courtSeals>=3&&(b.samuraiFlow||0)>=100?1:0;b.samuraiCourtSeals=returned;
    if(courtSeals)log(`👑 ${ultimate?'三公會審':'居合'}消耗 ${courtSeals} 枚三公印${returned?'；滿朝不散返還 1 枚':''}。`,'good');
  }
  if(!ultimate&&blade?.id==='peek'&&b.samuraiFateGuideDrawn&&b.hand.includes(b.samuraiFateGuided)){
    if(dealt>0){
      addSamuraiFlow(t<=16?5:t<=18?10:t===19?15:t===20?20:25,'天機脇差・應驗');
      if((b.samuraiFlow||0)>=100){b.samuraiFlow=Math.max(0,b.samuraiFlow-25);b.samuraiWeaponState='sheathed';log('👁️ 先知：應驗攻擊後消耗 25 心流並收刀，可於下一副手牌更換刀具。','gd');}
    }else log('👁️ 應驗攻擊未能造成傷害，沒有獲得心流。','dmg');
    b.samuraiFateGuided=null;b.samuraiFateGuideDrawn=false;
  }
  if(blade?.id==='safe21'&&(safeLine?.valid||ultimate==='safe21')){
    if(ultimate==='safe21'){b.samuraiGuardMode='safeUltimate';b.samuraiGuardRate=.4;log('⚖️ 界線斷決：本回合受到的攻擊傷害降低 40%。','gd');}
    else if(dealt>0&&safeLine.guard){const gained=safeLine.perfect?12:6;b.samuraiGuardMode='safeLine';b.samuraiGuardRate=safeLineFlow>=25?.30:.25;addSamuraiFlow(gained,safeLine.perfect?'界守打刀・完美守線':'界守打刀・守線');log(`⚖️ 守線成立：本回合受到的攻擊傷害降低 ${Math.round(b.samuraiGuardRate*100)}%。`,'good');}
    else if(dealt>0&&safeLine.over)addSamuraiFlow(Math.min(2,safeLine.extra)*8,`界守打刀・越線 ${Math.min(2,safeLine.extra)} 張`);
  }
  if(blade?.id==='bulwark'&&dealt>0&&!ultimate&&zanshinBefore){const gained=immovableResonanceGain(zanshinBefore,b.samuraiFlow||0);if(gained>0)addSamuraiFlow(gained,`${blade.name}・${(b.samuraiFlow||0)>=50?'長念':'心流共鳴'}`);}
  if(moonCounterBefore&&!ultimate)settleMoonCounterAttack(dealt,moonFlowBefore);
  if(blade?.id==='luckycoin'&&!ultimate)settleFortuneAttack(fortuneProfileAtSubmit,dealt);
  if(blade?.id==='rubyring'&&!ultimate)settleRubyBloodReflection(rubyProfile,dealt);
  if(blade?.id==='antidote'){if(ultimate==='antidote')settleMirrorUltimate(attackedTarget);else if(samuraiIaido)settleMirrorPurgingIaido(dealt,attackedTarget,flowAtSubmit);}
  if(blade?.id==='howdidwegethere')settleMyriadAffinity(dealt,attackedTarget,flowAtSubmit,samuraiIaido,ultimate==='howdidwegethere');
  if(ultimate&&!['dragonneck','luckycoin','rubyring'].includes(ultimate))settleSamuraiUltimate(ultimate,ultimateName);
  if(playerIsSamurai()&&blade&&dealt>0&&!ultimate){
    if(blade.id==='court')advanceCourtSequence(b.hand);
    else if(blade.id==='firststrike')addSamuraiFlow(samuraiAttackFlow(t,samuraiIaido,firstStrikeFlow),`${blade.name}${samuraiIaido?'居合':'斬擊'}命中`);
    else if(blade.id==='dragonneck'){const gain=dragonWalkGain(b.hand.length,fiveDragon,dealt,false);if(gain)addSamuraiFlow(gain,`${blade.name}・龍行${fiveDragon?'（五龍）':''}`);}
  }
  resolveKunEbbAction();
  const transformed=rapidResult?rapidResult.transformed:!!(attackedTarget&&(attackedTarget.justTransformed||thousandResult.originalTransformed));if(transformed&&attackedTarget)attackedTarget.justTransformed=false;
  const toxicologyApplied=dealt>0&&!transformed?applyToxicology(attackedTarget,b.hand,!ultimate):0;
  if(toxicologyApplied>0)grantPoisonTemperFlow(toxicologyApplied,flowAtSubmit,ultimate==='toxicology');
  const poisonBurstResult=poisonSnapshot?settlePoisonBurst(poisonSnapshot,rapidResult?rapidResult.results.filter(hit=>hit.target===poisonSnapshot.target).reduce((sum,hit)=>sum+hit.dealt,0):attackedTarget===poisonSnapshot.target?dealt:0,attackedTarget===poisonSnapshot.target?toxicologyApplied:0):null,actionTransformed=transformed||!!poisonBurstResult?.transformed;if(poisonBurstResult?.transformed&&poisonSnapshot.target)poisonSnapshot.target.justTransformed=false;
  if(dealt>0&&!actionTransformed&&attackedTarget?.curhp>0&&bloodDescendantActive()){
    const gained=addSepsis(attackedTarget,1);if(gained>0){log(`🦠 血魔攻擊：${attackedTarget.name} 敗血 +${gained}（目前 ${attackedTarget.sepsis}/5 層）。`,'good');if(G.battle.inquisitorBattle&&(INQUISITOR_LEADERS.includes(attackedTarget.type)||attackedTarget.inquisitorEscort))addInquisitorStatusCrime(gained,'敗血');}
  }
  if(dealt>0&&hasP('bountyhunter')&&b.bountyHuntActive&&G.bountyHunt&&G.bountyHunt.bonuses.length){
    const used=G.bountyHunt.bonuses.shift();log(`💰 賞金獵人加成 +${used} 已消耗。`,'gd');
    if(!G.bountyHunt.bonuses.length)G.bountyHunt=null;
  }
  let vampireHealed=0;
  if(hasP('vampire')&&dealt>0){
    const baseRate=bloodDescendantActive()?0.5:isUp('vampire')?0.3:0.2,bloodMult=blade?.id==='vampire'?(ultimate==='vampire'?2:1+(b.samuraiBloodRaises||0)*.2):1;
    if(rapidResult){let triggers=0;rapidResult.results.forEach(hit=>{const rate=baseRate*thirstMultiplier()*sepsisMultiplier(hit.target)*bloodMult*.3,result=combatHeal(Math.round(hit.dealt*rate),true);vampireHealed+=result.healed;triggers++;});log(`⚡ 多段吸血：${triggers} 次分別以原效率 30% 結算，共回復 ${vampireHealed} HP${bloodMult>1?`（血博吸血 ×${bloodMult.toFixed(2)}）`:''}。`,'good');}
    else{const sepsis=sepsisMultiplier(attackedTarget),rate=baseRate*thirstMultiplier()*sepsis*bloodMult,result=combatHeal(Math.round(dealt*rate),true);vampireHealed=result.healed;log(`吸血賭注（${Math.round(rate*100)}%${bloodDescendantActive()?'，血魔基礎 50%':''}${bloodMult>1?`，血博 ×${bloodMult.toFixed(2)}`:''}${thirstMultiplier()>1?`，渴血 ${playerThirstStacks()} 層 ×${thirstMultiplier().toFixed(1)}`:''}${sepsis>1?`，敗血 +${Math.round((sepsis-1)*100)}%`:''}）：回復 ${result.healed} HP${result.mult<1?'（腐敗後）':''}`,'good');}
  }
  if(hasP('vampire')&&thousandResult.dealt>0){const baseRate=bloodDescendantActive()?0.5:isUp('vampire')?0.3:0.2,bloodMult=blade?.id==='vampire'?(ultimate==='vampire'?2:1+(b.samuraiBloodRaises||0)*.2):1,normalRate=baseRate*thirstMultiplier()*bloodMult,result=combatHeal(thousandStrikeLifestealAmount(thousandResult.dealt,normalRate),true);vampireHealed+=result.healed;log(`⚡ 一瞬千擊吸血：追擊實際造成 ${thousandResult.dealt} HP 傷害，合計後以正常效率 30% 回復 ${result.healed} HP。`,'good');}
  if(blade?.id==='vampire'&&(b.samuraiBloodWager||0)>0)resolveBloodWager(dealt+thousandResult.dealt,vampireHealed,ultimate==='vampire');
  let fiveDragonHealing=null;
  if(fiveDragon){fiveDragonHealing=combatHeal(dragonFiveHealAmount(t));log(`🐉 五龍回復 ${fiveDragonHealing.healed} HP${fiveDragonHealing.mult<1?'（腐敗後）':''}`,'good');if(blade?.id==='dragonneck'&&!ultimate){const gain=dragonBreathGain(fiveDragonHealing.healed,flowAtSubmit,false);if(gain)addSamuraiFlow(gain,`${blade.name}・龍息（實際回復 ${fiveDragonHealing.healed} HP）`);}renderTop();}
  if(dragonSheathChosen&&fiveDragon){b.samuraiWeaponState='sheathed';log('🐉 乘龍歸鞘：五龍的傷害、治療與心流結算完成後免費納刀；本次不觸發主動收刀刀技。','gd');}
  if(ultimate==='dragonneck')settleSamuraiUltimate(ultimate,ultimateName);
  if(ultimate==='luckycoin'){
    settleFortuneUltimate(fortuneUltimateSpend);renderTop();settleSamuraiUltimate(ultimate,ultimateName);
  }
  if(ultimate==='rubyring'){
    settleRubyUltimate();renderTop();settleSamuraiUltimate(ultimate,ultimateName);
  }
  applySuitEnchantments('attack',spellPlan,attackedTarget);
  if(G.hp<=0&&!tryHolyMiracleRevive()){gameOver();return;}
  if(b.enemies.every(e=>e.curhp<=0)){winBattle();return;}
  if(applyGamblePenalty(t,false))return;
  endPlayerTurn();
}

function resolveBlind(){
  const b=G.battle,t=handTotal(b.hand);if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('致盲迫使本次攻擊改為解盲');b.guardStreak=0;revealHallucinations();applyDisciplineAction('attack');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  if(t>=19&&t<=21){const removed=b.blind;b.blind=0;log(`🌑 ${t} 點洞穿黑暗：完全解除 ${removed} 層致盲！`,'gd');}
  else if(t>=2&&t<=18){b.blind=Math.max(0,b.blind-1);log(`🌑 ${t} 點穩住感官：解除 1 層致盲（剩餘 ${b.blind}）。`,'good');}
  else log('🌑 爆牌無法解除致盲。','dmg');
  if(applyGamblePenalty(t,t>21))return;endPlayerTurn();
}

function samuraiDefend(){
  const b=G.battle;if(!b||b.over||b.busy||b.dealReady===false||b.pendingBust||handTotal(b.hand)>21)return;
  if(!samuraiDefenseActionsAvailable()){log('🗡️ 目前處於納刀狀態，必須先以居合拔刀才能使用架勢。','dmg');syncButtons();return;}
  if(bloodDescendantActive()){log('📜 血魔契約使血魔無法選擇防禦。','dmg');syncButtons();return;}
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('選擇防禦');
  recordPlayedFloor();runStats().actions.defense++;
  const total=handTotal(b.hand),spellPlan=suitSpellPlan('defense',b.hand,b.suitMainSuit),rate=samuraiAdjustedGuardRate(samuraiStanceRate(total)),equipment=samuraiDefenseFlowBonus(b.hand,true);
  revealHallucinations();applyDisciplineAction('defense');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  b.samuraiGuardMode='stance';b.samuraiGuardRate=rate;b.samuraiDefenseFlow=Math.min(15,equipment.flow);b.samuraiDefenseSubmitFlow=b.samuraiFlow||0;b.samuraiDefenseFlowAwarded=0;b.samuraiHeartBladeSubmitted=heartBladeActive();b.samuraiBucklerParticipated=equipment.bucklerUsed;b.samuraiMoonFlowActive=equipment.moonFlow;b.samuraiZanshinRefreshed=false;b.guardStreak=0;b.focus=0;b.ironskin=0;
  const projected=Math.round(incomingTotal()*rate);SFX.shield();
  log(`🗡️ 架勢：本回合攻擊減傷 ${Math.round(rate*100)}%；若實際擋住攻擊，防禦型裝備可轉為最多 ${b.samuraiDefenseFlow} 心流。`,'good');
  b.suitSpellEnemyMult=spellSmokeMultiplier(spellPlan);applySuitEnchantments('defense',spellPlan,currentTarget());
  if(equipment.bucklerBroke)log('🛡 圓盾耐久耗盡，本次架勢後損毀！','dmg');
  if(applyGamblePenalty(total,false))return;
  eagleRecoverEvasion('使用架勢');endPlayerTurn();
}
function samuraiMikiri(){
  const b=G.battle;if(!playerIsSamurai()||!b||b.over||b.busy||b.dealReady===false||b.pendingBust||handTotal(b.hand)>21||(b.mikiriCooldown||0)>0)return;
  if(!samuraiDefenseActionsAvailable()){log('🗡️ 目前處於納刀狀態，必須先以居合拔刀才能使用見切。','dmg');syncButtons();return;}
  if(bloodDescendantActive()){log('📜 血魔契約使血魔無法選擇見切。','dmg');syncButtons();return;}
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('使用見切');
  recordPlayedFloor();runStats().actions.defense++;
  const total=handTotal(b.hand),spellPlan=suitSpellPlan('defense',b.hand,b.suitMainSuit),rate=samuraiAdjustedGuardRate(samuraiMikiriRate(total)),equipment=samuraiDefenseFlowBonus(b.hand,true);
  revealHallucinations();applyDisciplineAction('defense');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  b.samuraiGuardMode='mikiri';b.samuraiGuardRate=rate;b.samuraiDefenseFlow=equipment.flow;b.samuraiDefenseSubmitFlow=b.samuraiFlow||0;b.samuraiDefenseFlowAwarded=0;b.samuraiHeartBladeSubmitted=heartBladeActive();b.samuraiBucklerParticipated=equipment.bucklerUsed;b.samuraiMoonFlowActive=equipment.moonFlow;b.samuraiZanshinRefreshed=false;b.mikiriCooldown=BALANCE.samuraiMikiriCooldown+1;b.guardStreak=0;b.focus=0;b.ironskin=0;
  const projected=Math.round(incomingTotal()*rate);SFX.shield();
  log(`👁️ 見切：本回合攻擊減傷 ${Math.round(rate*100)}%，不消耗心流（目前 ${roundHalfEven(b.samuraiFlow||0)}/${BALANCE.samuraiFlowCap}）。`,'good');
  b.suitSpellEnemyMult=spellSmokeMultiplier(spellPlan);applySuitEnchantments('defense',spellPlan,currentTarget());
  if(equipment.bucklerBroke)log('🛡 圓盾耐久耗盡，本次見切後損毀！','dmg');
  if(applyGamblePenalty(total,false))return;
  eagleRecoverEvasion('使用見切');endPlayerTurn();
}
function samuraiSheath(){
  const b=G.battle;if(!playerIsSamurai()||!hasActiveBlade()||!b||b.over||b.busy||b.dealReady===false||b.pendingBust||b.samuraiWeaponState!=='drawn')return;
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('主動收刀');
  recordPlayedFloor();runStats().actions.defense++;
  const total=handTotal(b.hand);
  revealHallucinations();applyDisciplineAction('defense');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  if(myriadBladeActive())amplifyMyriadStatuses();
  b.samuraiWeaponState='sheathed';b.samuraiGuardMode=null;b.samuraiGuardRate=0;b.samuraiDefenseFlow=0;b.samuraiDefenseFlowAwarded=0;b.samuraiHeartBladeSubmitted=false;b.guardStreak=0;b.focus=0;b.ironskin=0;
  log(`🗡️ 收刀：${activeBladeDef().name}回到納刀狀態；本動作不提供減傷，下一次攻擊將再次發動居合。`,'good');
  if(applyGamblePenalty(total,false))return;endPlayerTurn();
}
function defend(){
  const b=G.battle;if(b.over||b.busy||b.dealReady===false||b.pendingBust)return;
  if(playerIsSamurai()){samuraiDefend();return;}
  if(bloodDescendantActive()){log('📜 血魔契約使血魔無法選擇防禦。','dmg');syncButtons();return;}
  recordPlayedFloor();
  runStats().actions.defense++;
  const t=handTotal(b.hand),spellPlan=suitSpellPlan('defense',b.hand,b.suitMainSuit),profile=defenseActionProfile(b.hand,true,spellPlan),{shield,lucky,fractureMult,ironskinMult,spellMult}=profile;let {def}=profile;
  revealHallucinations();applyDisciplineAction('defense');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  if(ironskinMult>1)b.ironskin=0;
  const focusGain=b.buffSuppressed>0?0:Math.ceil((def+shield.def)*BALANCE.focusRate);
  b.defense+=def+shield.def;recordShield(def+shield.def);b.guardStreak++;
  b.focus=Math.min(BALANCE.focusCap,b.focus+focusGain);
  SFX.shield();
  const penalty=b.guardStreak>1?`（連續防禦效率降低）`:'';
  const shieldNote=shield.def>0?`、圓盾 +${shield.def}`:'';
  const gambleNote=lucky.active?`（🎲幸運數字 ${lucky.number}・${lucky.label} ×${lucky.multiplier.toFixed(2)}）`:'';
  const fractureNote=b.fracture>0?`（🦴斷骨 −${b.fracture*15}%）`:'';
  log(`🛡 選擇防禦：獲得 ${def} 防禦${shieldNote}、蓄勢 +${focusGain}（目前 ${b.focus}）${ironskinMult>1?`（🧪鐵膚 ×${ironskinMult.toFixed(3)}）`:''}${spellMult>1?`（🎭鐵膚術式 ×${spellMult.toFixed(3)}）`:''}${b.buffSuppressed>0?'（威壓封鎖蓄勢）':''}${b.blind>0?'（致盲使防禦 −20%）':''}${gambleNote}${fractureNote}${penalty}`,'good');
  b.suitSpellEnemyMult=spellSmokeMultiplier(spellPlan);applySuitEnchantments('defense',spellPlan,currentTarget());
  if(shield.broke)log('🛡 圓盾耐久耗盡，本次防禦後損毀！','dmg');
  if(applyGamblePenalty(t,false))return;
  eagleRecoverEvasion('選擇防禦');
  endPlayerTurn();
}

function escapeAbyss(){
  const b=G.battle;if(!b||!b.cthulhuPhase||b.over||b.busy||b.pendingBust)return;
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('選擇逃跑');
  recordPlayedFloor();
  runStats().actions.escape++;
  const total=handTotal(b.hand);revealHallucinations();applyDisciplineAction('escape');if(b.upgradeReprieve>0)b.upgradeReprieve=0;
  const gain=total>21?0:total===21?6:total===20?4:total>=17?3:total>=13?2:total>=2?1:0;
  b.abyssDistance=Math.min(b.abyssMax||20,(b.abyssDistance||0)+gain);
  log(`🏃 逃跑：以 ${total} 點拉開 ${gain} 層距離（深淵距離 ${b.abyssDistance}/${b.abyssMax}）。`,'good');
  endPlayerTurn();
}

function atone(kind){
  const b=G.battle;if(!b||!b.inquisitorBattle||b.inquisitorPhase!==2||b.over||b.busy||b.pendingBust||handTotal(b.hand)>21||(b.sinValue||0)<=0)return;
  const total=handTotal(b.hand),rate=kind==='control'?10:kind==='gold'?6:3,cost=kind==='gold'?atonementGoldCost():0,controlCost=scaledControlCost(3);
  if(kind==='gold'&&G.gold<cost||kind==='control'&&b.controlLeft<controlCost)return;
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('選擇贖罪');
  recordPlayedFloor();runStats().actions.atonement++;
  if(kind==='gold'){G.gold-=cost;b.redemptionUses=(b.redemptionUses||0)+1;}if(kind==='control')b.controlLeft-=controlCost;
  const wanted=total*rate,before=b.sinValue;b.sinValue=Math.max(0,b.sinValue-wanted);const reduced=before-b.sinValue;
  const finish=()=>{refreshInquisitorSinDamage();b.guardStreak=0;b.focus=0;revealHallucinations();applyDisciplineAction('atonement');SFX.win();log(`${kind==='control'?'🎴 控制':kind==='gold'?'🪙 金錢':'🙏 無價'}贖罪：以 ${total} 點降低 ${reduced} 罪惡值（${b.sinValue}/${b.sinCap}）${cost?`，支付 ${cost} 金幣`:''}${kind==='control'?`，消耗 ${controlCost} 控制值`:''}。`,'gd');renderTop();endPlayerTurn();};
  if(b.bloodJudgment)finish();else changeFaction(reduced,finish,true);
}

function attackEnemy(dmg,opts={}){
  const e=currentTarget();if(!e)return 0;
  if(ghostInvincible(e)){
    SFX.shield();log(`${e.name} 處於無敵回合，攻擊被擋下！`,'dmg');floatNum(e.idx,'🛡️','#bfe6ff');return 0;
  }
  if((!opts.consumable||opts.allowEvasion)&&(e.maxEvasion||0)>0){
    const total=handTotal(G.battle.hand),dodged=e.evasion>0&&(opts.busted||total<=16);
    if(dodged){
      e.evasion--;if(e.dodgeCounter==='dive')activateEagleDive(e);SFX.shield();
      log(`💨 ${e.name}消耗 1 層閃避躲開攻擊！${e.dodgeCounter==='dive'?`下一次行動改為${eagleGrowth(G.floor).thunder?'雷霆俯衝':'俯衝反擊'}。`:''}`,'dmg');floatNum(e.idx,'閃避','#bfe6ff');renderEnemies();return 0;
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
  let protectedFlat=Math.max(0,Math.min(dmg,Number(opts.postMultiplierFlat)||0));
  if(e.type==='robot'&&e.robotAction==='cool'&&dmg>0){dmg=Math.round(Math.max(0,dmg-protectedFlat)*1.4)+protectedFlat;log('❄️ 過熱弱點：對機器人最終傷害 ×1.4！','gd');}
  if(e.type==='cultist'&&e.cultistAction==='prayer'&&!livingGargoyle()&&dmg>0){dmg=Math.round(Math.max(0,dmg-protectedFlat)*1.3)+protectedFlat;log('🕯 反噬祈禱：對邪教徒最終傷害 ×1.3！','gd');}
  if(!opts.consumable&&!opts.followup&&hasP('faithneck')&&faithNecklaceHostile(e)&&dmg>0){const before=dmg;dmg=Math.max(1,Math.round(Math.max(0,dmg-protectedFlat)*1.10)+protectedFlat);log(`📿 神蹟共鳴：對敵對勢力的傷害 ${before} → ${dmg}。`,'gd');}
  if(e.type==='cultLeader'&&dmg>0){const alive=courtGargoylesAlive().length;if(alive){const before=dmg,mult=1-alive*.25;dmg=Math.max(1,Math.round(dmg*mult));protectedFlat=Math.round(protectedFlat*mult);log(`🗿 ${alive} 尊存活石像使教宗減傷 ${alive*25}%：${before} → ${dmg}。`,'dmg');}}
  if(e.zanshin&&dmg>0&&(e.zanshinReduction||0)>0){const before=dmg,mult=1-e.zanshinReduction;dmg=Math.max(1,Math.round(dmg*mult));protectedFlat=Math.round(protectedFlat*mult);log(`🧘 殘心減傷 ${Math.round(e.zanshinReduction*100)}%：${before} → ${dmg}。`,'dmg');}
  if(INQUISITOR_LEADERS.includes(e.type)&&dmg>0){const before=dmg;dmg=Math.max(1,Math.round(dmg*.7));protectedFlat=Math.round(protectedFlat*.7);log(`⚖️ 永久減傷 30%：${before} → ${dmg}。`,'dmg');}
  if(G.battle.inquisitorBattle&&dmg>0&&(INQUISITOR_LEADERS.includes(e.type)||e.inquisitorEscort)&&!G.battle.inquisitorDamageCrime){G.battle.inquisitorDamageCrime=true;addInquisitorCrime(1,'造成傷害');}
  if(e.type==='zombie'&&e.downed){
    const threshold=zombieFinishThreshold(G.floor),total=handTotal(G.battle.hand);
    const finished=opts.consumable?dmg>=threshold:!opts.busted&&(dmg>=threshold||total===20||total===21);
    if(finished){
      e.curhp=0;e.downed=false;e.deadPermanent=true;SFX.crit();
      recordDamageDealt(dmg,e.name);
      recordEnemyDefeat(e);
      log(`💥 成功補刀！${e.name}被永久處決。`,'gd');floatNum(e.idx,'處決','#ffd24a');ensureTarget();renderEnemies();return Math.max(0,dmg);
    }
    log(opts.busted?`💥 爆牌保險無法處決倒地殭屍！`:`🧟 補刀失敗：需要 ${threshold} 傷害，或使用 20／21 點手牌。`,'dmg');
    renderEnemies();return 0;
  }
  const rawDmg=dmg,kunDevourShield=e.type==='kun'&&e.kunDevourPending&&(e.shield||0)>0;
  if((e.shield||0)>0&&dmg>0){
    const shieldBefore=e.shield;
    const pierce=Math.max(0,Math.min(1,Number(opts.shieldPierce)||0));
    const effectiveShield=Math.round(e.shield*(1-pierce));
    const blocked=Math.min(effectiveShield,dmg);e.shield=Math.max(0,e.shield-blocked);dmg-=blocked;SFX.shield();
    log(`🛡 ${e.name}的護盾抵擋 ${blocked} 傷害${pierce?`（無視 ${Math.round(pierce*100)}% 護盾）`:''}${dmg>0?`，穿透 ${dmg}`:'，完全擋下'}。`,'dmg');
    if(e.type==='paladin'&&e.paladinAction==='judgment'&&shieldBefore>0&&e.shield===0){e.judgmentInterrupted=true;log('💥 聖盾被完全打破，神聖裁決中斷！','gd');}
    if(kunDevourShield&&e.shield===0)queueKunEbb(e,2,'擊破吞海護盾',0,!!opts.busted);
  }
  if(!opts.consumable&&e.type==='gargoyle'&&dmg>0&&(G.battle.lockedSkills||[]).some(x=>x.ordinary&&x.sourceIdx===e.idx)){
    const total=handTotal(G.battle.hand),threshold=gargoyleUnlockThreshold(G.floor);
    if(canBreakGargoyleLock(total,dmg,opts.busted))releaseGargoyleLocks(e.idx);
    else log(`🔒 石像封鎖未破：需 20／21 點，或單次對本體造成 ${threshold} 傷害（本次 ${dmg}）。`,'dmg');
  }
  if(!opts.consumable&&e.type==='cultist'&&e.hasStolen&&!opts.busted&&dmg>0){
    const total=handTotal(G.battle.hand),threshold=cultistReclaimThreshold(G.floor);
    if(total===20||total===21||dmg>=threshold){cultistRestoreUpgrade(e,'奪回');e.cultStep=3;e.cultistAction='prayer';e.reclaimPause=true;e.nextDmg=0;log(livingGargoyle()?'✨ 儀式被擊破！邪教徒本回合失去行動，這次無法強化石像鬼。':'✨ 儀式被擊破！邪教徒本回合失去行動，下一回合進入反噬祈禱。','gd');}
  }
  if(!opts.consumable&&e.type==='cyclops'&&e.cyclopsAction==='gaze'&&!opts.busted&&dmg>0){
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
  if(!opts.consumable&&((e.type==='samurai'&&e.samuraiAction==='mikiri')||(e.type==='ronin'&&e.roninAction==='mikiri'))&&dmg>0){
    if(!e.mikiriOutcome){
      const total=handTotal(G.battle.hand);
      if(!opts.busted&&(total===20||total===21)){e.mikiriOutcome='broken';log(`🎯 ${total} 點洞破見切！${e.name}無法回血或刷新殘心。`,'gd');}
      else if(!opts.busted&&total>=17&&total<=19){e.mikiriOutcome='partial';setMikiriZanshin(e,total);log(`👁️ ${total} 點遭見切：本次攻擊傷害 −25%。`,'dmg');}
      else{e.mikiriOutcome='full';setMikiriZanshin(e,total,!!opts.busted);log(`👁️ 攻擊被完全見切：本次攻擊傷害 −50%。`,'dmg');}
    }
    const mult=e.mikiriOutcome==='partial'?0.75:e.mikiriOutcome==='full'?0.5:1;if(mult<1)dmg=Math.max(1,Math.round(dmg*mult));
  }
  if(!opts.consumable&&dmg>0&&(e.trauma||0)>0){
    const before=dmg;dmg=Math.round(Math.max(0,dmg-protectedFlat)*traumaAttackMultiplier(e))+protectedFlat;
    log(`🩹 ${e.name}的創傷使攻擊傷害 ${before} → ${dmg}。`,'good');
  }
  if(!opts.consumable&&!opts.followup&&!opts.suppressBeheading&&!opts.busted&&hasP('beheading')&&dmg>0&&e.curhp-dmg<=e.maxhp*(Math.max(5,G.beheadingPercent||5)/100)){
    dmg=Math.max(dmg,e.curhp);log(`⚔️ 斬首：${e.name}落入 ${G.beheadingPercent||5}% 斬首線，這次攻擊直接結束其目前型態！`,'gd');
  }
  const hpBeforeHit=e.curhp;
  e.curhp-=dmg;recordDamageDealt(dmg,e.name);
  if(!opts.consumable&&e.type==='kun'&&dmg>0){
    const total=handTotal(G.battle.hand),divinePrecision=e.kunAction==='divinity'&&!opts.busted&&(total===20||total===21),precision=!opts.busted&&(total===20||total===21);
    queueKunEbb(e,divinePrecision?2:precision?1:0,divinePrecision?'神性回合精準破潮':`${total} 點精準命中`,dmg,!!opts.busted);
  }
  if(e.type==='bloodDemon'&&dmg>0&&e.bloodLockArmed&&(e.bloodLockUses||0)<1&&hpBeforeHit>=e.maxhp*.15&&e.curhp<e.maxhp*.03){
    const lockedHp=Math.max(1,Math.ceil(e.maxhp*.03));
    e.curhp=lockedHp;e.bloodLockUses=(e.bloodLockUses||0)+1;e.bloodLockArmed=false;
    log(`🩸 鮮血鎖命：HP 鎖在 ${lockedHp}；本場唯一一次鎖血已消耗。`,'dmg');
  }
  const bleedHit=opts.suppressStatusProc?{damage:0,remaining:e.bleed||0}:triggerBleed(e,dmg);if(INQUISITOR_LEADERS.includes(e.type)&&bleedHit.damage>0)bleedHit.damage=Math.max(1,Math.round(bleedHit.damage*.7));
  if(bleedHit.damage>0){e.curhp-=bleedHit.damage;recordDamageDealt(bleedHit.damage,`${e.name}（流血）`);}
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
  if(!opts.consumable&&e.type==='inquisitorMounted'&&dmg>0){const total=handTotal(G.battle.hand),before=e.momentum||0,high=dmg>=Math.max(1,Math.round(e.maxhp*.12));if(!opts.busted&&total>=19&&total<=21)e.momentum=Math.max(0,e.momentum-2);if(high)e.momentum=Math.max(0,e.momentum-1);if(e.momentum<before)log(`🐎 精準／重擊削減 ${before-e.momentum} 層馬勢（${e.momentum}/25）。`,'good');}
  if(!opts.consumable&&e.type==='cultLeader'&&dmg>0&&!opts.busted&&!opts.suppressStatusProc){const total=handTotal(G.battle.hand);if(total===20||total===21)addFanaticism(-2,`${total} 點精準命中`);}
  if(bleedHit.damage>0){log(`🩸 ${e.name}流血發作：額外 −${bleedHit.damage} HP，降為 ${bleedHit.remaining} 層。`,'good');floatNum(e.idx,'-'+bleedHit.damage,'#e45c73');}
  if(e.curhp<=0&&e.type==='kun'){
    resolveKunEbbAction();
    transformKunToPeng(e,'擊倒');renderEnemies();return Math.max(0,dmg);
  }
  if(e.curhp<=0&&e.type==='cultLeader'){transformCultLeaderToCthulhu('擊倒');renderEnemies();return Math.max(0,dmg);}
  if(e.curhp<=0&&e.type==='inquisitorMounted'){transformInquisitor('擊倒');renderEnemies();return Math.max(0,dmg);}
  if(e.curhp<=0){
    const total=handTotal(G.battle.hand),directExecution=e.type==='zombie'&&!opts.consumable&&!opts.busted&&(total===20||total===21);
    if(e.type==='zombie'&&!e.revived&&!directExecution){
      e.curhp=1;e.downed=true;e.downedRound=G.battle.round;e.nextDmg=0;
      log(`🧟 ${e.name}倒地但尚未死亡！下回合需造成 ${zombieFinishThreshold(G.floor)} 傷害，或以 20／21 點處決。`,'dmg');
    }else{
      if(e.type==='zombie'&&directExecution)log(`🎯 20／21 點命中要害，${e.name}無法復活！`,'gd');
      log(`${e.name} 被擊倒！`,'good');recordEnemyDefeat(e);if(e.type==='inquisitor')weakenInquisitorEscorts('擊倒');ensureTarget();
      if(e.type==='squirrel')recoverSquirrelGold(e);
      if(e.inquisitorEscort)addInquisitorCrime(5,'擊殺聖騎士');
    }
  }
  if(e.type==='gargoyle'&&e.curhp<=0){
    const cultists=G.battle.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>{x.curhp=0;recordEnemyDefeat(x);});
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

function consumablePower(base){return Math.max(1,Math.round(base*floorScaling(G.floor).atk));}
function spellPayload(entry,encore=false){const def=SUIT_SPELL_DEFS[entry.id];return encore?def.encore:def.tiers[entry.tier-1];}
function spellTag(entry,encore=false){const item=consumableInfo(entry.id);return `🎭 ${entry.suit}${suitName(entry.suit)}・${item?.name||entry.id}${encore?'安可':` ${['','Ⅰ','Ⅱ','Ⅲ'][entry.tier]}`}`;}
function spellAttackMultiplier(plan){return (plan||[]).filter(e=>e.id==='whetstone').reduce((mult,e)=>mult*(spellPayload(e).attackMult||1)*(e.encore?(spellPayload(e,true).attackMult||1):1),1);}
function spellDefenseMultiplier(plan){return (plan||[]).filter(e=>e.id==='ironskin').reduce((mult,e)=>mult*(spellPayload(e).defenseMult||1)*(e.encore?(spellPayload(e,true).defenseMult||1):1),1);}
function spellSmokeMultiplier(plan){return (plan||[]).filter(e=>e.id==='smokeBomb').reduce((mult,e)=>mult*(spellPayload(e).enemyMult||1)*(e.encore?(spellPayload(e,true).enemyMult||1):1),1);}
function applySuitArmorPierce(plan,target){
  (plan||[]).filter(entry=>entry.id==='armorPiercer').forEach(entry=>[false,...(entry.encore?[true]:[])].forEach(encore=>{
    if(!target||target.curhp<=0||!target.shield)return;const rate=spellPayload(entry,encore).shieldDestroy||0,removed=Math.min(target.shield,Math.ceil(target.shield*rate));target.shield-=removed;log(`${spellTag(entry,encore)}：破壞 ${target.name} ${removed} 點護盾。`,'good');
  }));
}
function currentSpellTarget(original){
  const b=G.battle;if(original&&original.curhp>0&&!original.justTransformed)return original;const next=b.enemies.find(e=>e.curhp>0);if(next)b.target=next.idx;return next||null;
}
function spellDamage(target,amount,entry,encore=false){return consumableDamage(target,amount,{icon:'🎭',name:spellTag(entry,encore).replace('🎭 ','')},{allowEvasion:true});}
function applyOneSuitSpell(entry,action,originalTarget,encore=false){
  const b=G.battle,p=spellPayload(entry,encore),tag=spellTag(entry,encore);let target=currentSpellTarget(originalTarget);
  if(entry.id==='whetstone'||entry.id==='ironskin'||entry.id==='smokeBomb'||entry.id==='armorPiercer')return;
  if(entry.id==='healingPotion'){const result=combatHeal(p.heal);log(`${tag}：回復 ${result.healed} HP。`,'good');return;}
  if(entry.id==='bandage'){const bleed=Math.min(p.bleed||0,b.bleed||0),trauma=Math.min(p.trauma||0,b.trauma||0);b.bleed-=bleed;b.trauma-=trauma;log(`${tag}：流血 −${bleed}${p.trauma!=null?`、創傷 −${trauma}`:''}。`,'good');return;}
  if(entry.id==='detox'){const poison=Math.min(p.poisonRemove||0,G.poison||0),virulence=Math.min(p.virulenceRemove||0,b.virulence||0);G.poison-=poison;b.virulence-=virulence;if(!b.virulence)b.virulenceTicks=0;log(`${tag}：中毒 −${poison}${p.virulenceRemove!=null?`、猛毒 −${virulence}`:''}。`,'good');return;}
  if(entry.id==='stimulant'){const refundable=Math.max(0,(b.suitMagicSpent||0)-(b.suitMagicRefunded||0)),wanted=Math.min(p.control||0,refundable),before=b.controlLeft;b.controlLeft=Math.min(b.controlCap,b.controlLeft+wanted);const actual=b.controlLeft-before;b.suitMagicRefunded=(b.suitMagicRefunded||0)+actual;G.control=b.controlLeft;log(`${tag}：退還本場花色魔術控制 ${actual}。`,'good');return;}
  if(entry.id==='ironPlate'){const gained=consumablePower(p.defense);b.defense+=gained;recordShield(gained);log(`${tag}：防禦 +${gained}。`,'good');return;}
  if(!target)return;
  if(entry.id==='throwingKnife'){spellDamage(target,p.damage,entry,encore);return;}
  if(entry.id==='bomb'||entry.id==='demolition'){
    [...b.enemies].filter(e=>e.curhp>0).forEach(e=>spellDamage(e,p.damageAll,entry,encore));
    if(entry.id==='demolition'){losePlayerHp(p.self,{enemy:'自身',effect:`${tag}反噬`});log(`${tag}：自己承受 ${p.self} 傷害。`,'dmg');}
    return;
  }
  target=currentSpellTarget(originalTarget);if(!target)return;
  if(entry.id==='molotov'){const result=addBurn(target,p.burn);log(`${tag}：${target.name}燒傷 +${result.gained}。`,'good');}
  else if(entry.id==='poisonVial'){const poison=resistedStatusAmount(target,p.poison||0),virulence=resistedStatusAmount(target,p.virulence||0);target.poison=(target.poison||0)+poison;target.virulence=(target.virulence||0)+virulence;if(virulence&&target.virulence===virulence)target.virulenceTicks=0;log(`${tag}：${target.name}中毒 +${poison}${p.virulence?`、猛毒 +${virulence}`:''}。`,'good');}
  else if(entry.id==='weakeningPowder'){const gained=applyConsumableWeakness(target,p.weakness);log(`${tag}：${target.name}虛弱 +${gained}。`,'good');}
}
function applySuitEnchantments(action,plan,target){
  const b=G.battle;if(!b||!Array.isArray(plan)||!plan.length)return;
  const postOrder=action==='attack'?[...SUIT_SPELL_ATTACK_ORDER.filter(id=>!['armorPiercer','whetstone'].includes(id)),...SUIT_SPELL_UNIVERSAL_ORDER]:['ironPlate',...SUIT_SPELL_UNIVERSAL_ORDER];
  for(const id of postOrder){const entry=plan.find(item=>item.id===id);if(!entry)continue;if(action==='attack'&&!b.enemies.some(e=>e.curhp>0))break;applyOneSuitSpell(entry,action,target,false);if(entry.encore)applyOneSuitSpell(entry,action,target,true);if(G.hp<=0)break;}
  renderTop();renderEnemies();
}
function canSmokeEscape(){const b=G.battle;return !!(b&&!b.eventSource&&G.nodeType==='battle'&&!b.enemies.some(e=>e.boss||e.ultimate||e.eventBoss));}
function applyConsumableWeakness(e,amount){
  const gained=resistedStatusAmount(e,amount),before=Math.min(9,Math.max(0,e.weakness||0)),after=Math.min(9,before+gained);if(after<=before)return 0;
  if((e.nextDmg||0)>0){const oldMult=Math.max(.1,1-before*.1),newMult=Math.max(.1,1-after*.1);e.nextDmg=Math.max(1,Math.round(e.nextDmg/oldMult*newMult));}
  e.weakness=after;return after-before;
}
function consumableDamage(target,amount,item,opts={}){
  if(!target||target.curhp<=0)return 0;const previous=G.battle.target;G.battle.target=target.idx;
  const dealt=attackEnemy(consumablePower(amount),{consumable:true,suppressStatusProc:true,...opts});
  if(G.battle.enemies.some(e=>e.idx===previous&&e.curhp>0))G.battle.target=previous;else ensureTarget();
  if(dealt>0)log(`${item.icon} ${item.name}直接造成 ${dealt} 傷害；不觸發攻擊型被動。`,'gd');return dealt;
}
function openConsumableBag(){if(!G.battle||G.battle.over)return;renderConsumableBag();$('consumable-bag').classList.remove('hidden');}
function closeConsumableBag(){$('consumable-bag').classList.add('hidden');}
function renderConsumableBag(){
  const b=G.battle,used=!!(b&&b.consumableUsedRound===b.round),items=CONSUMABLES.filter(item=>consumableCount(item.id)>0);
  $('consumable-bag-summary').textContent=`攜帶 ${consumableTypeCount()}/${consumableTypeLimit()} 種｜每種最多 ${CONSUMABLE_STACK_LIMIT} 個｜${used?'本回合已使用':'本回合尚可使用 1 件'}｜指定型道具作用於目前攻擊目標。`;
  $('consumable-bag-list').innerHTML=items.length?items.map(item=>{const smokeBlocked=item.id==='smokeBomb'&&!canSmokeEscape(),disabled=!b||b.over||b.busy||b.pendingBust||b.dealReady===false||used||smokeBlocked;return `<div class="codex-card consumable-card"><div class="cn">${item.icon} ${item.name} ×${consumableCount(item.id)}</div><div class="cd">直接使用：${item.desc}${ownsP('suitmage')?`<br>附魔術式：${SUIT_ENCHANT_EFFECTS[item.id]}`:''}</div><div class="sell-list"><button class="b-buy" data-use-consumable="${item.id}"${disabled?' disabled':''}>${smokeBlocked?'此戰無法逃跑':used?'本回合已使用':'使用'}</button><button class="b-ghost" data-discard-consumable="${item.id}">丟棄 1 個</button></div></div>`;}).join(''):'<div class="muted">目前沒有消耗品。</div>';
  $('consumable-bag-list').querySelectorAll('[data-use-consumable]').forEach(btn=>btn.onclick=()=>useConsumable(btn.dataset.useConsumable));
  $('consumable-bag-list').querySelectorAll('[data-discard-consumable]').forEach(btn=>btn.onclick=()=>discardConsumable(btn.dataset.discardConsumable));
}
function discardConsumable(id){const item=consumableInfo(id);if(!item||!removeConsumable(id))return;log(`🗑️ 丟棄 ${item.name} ×1。`,'dmg');renderConsumableBag();renderTop();}
function useConsumable(id){
  const b=G.battle,item=consumableInfo(id);if(!b||!item||!consumableCount(id)||b.over||b.busy||b.pendingBust||b.dealReady===false||b.consumableUsedRound===b.round)return;
  if(id==='smokeBomb'&&!canSmokeEscape())return;
  const target=currentTarget();if(item.target==='enemy'&&(!target||target.curhp<=0))return;
  removeConsumable(id);b.consumableUsedRound=b.round;closeConsumableBag();SFX.coin();log(`${item.icon} 使用${item.name}！`,'gd');
  if(id==='healingPotion'){const result=combatHeal(20);log(`🧪 回復 ${result.healed} HP${result.mult!==1?`（回復倍率 ×${result.mult.toFixed(2)}）`:''}。`,'good');}
  else if(id==='throwingKnife')consumableDamage(target,18,item);
  else if(id==='ironPlate'){const gained=consumablePower(20);b.defense+=gained;recordShield(gained);log(`🛡️ 鐵板提供 ${gained} 防禦。`,'good');}
  else if(id==='bomb'){[...b.enemies].filter(e=>e.curhp>0).forEach(e=>consumableDamage(e,24,item));}
  else if(id==='molotov'){const originalType=target.type;consumableDamage(target,15,item);if(target.curhp>0&&target.type===originalType){const result=addBurn(target,4);log(`🔥 ${target.name}獲得 ${result.gained} 層燒傷${result.traumaGained?`，溢出轉為 ${result.traumaGained} 層創傷`:''}。`,'good');}}
  else if(id==='poisonVial'){const originalType=target.type;consumableDamage(target,10,item);if(target.curhp>0&&target.type===originalType){const poison=resistedStatusAmount(target,8),virulence=resistedStatusAmount(target,1);target.poison=(target.poison||0)+poison;target.virulence=(target.virulence||0)+virulence;if(virulence&&target.virulence===virulence)target.virulenceTicks=0;log(`☠️ ${target.name}中毒 +${poison}、猛毒 +${virulence}。`,'good');if(b.inquisitorBattle&&(INQUISITOR_LEADERS.includes(target.type)||target.inquisitorEscort))addInquisitorStatusCrime(poison+virulence,'劇毒瓶');}}
  else if(id==='demolition'){[...b.enemies].filter(e=>e.curhp>0).forEach(e=>consumableDamage(e,50,item));losePlayerHp(15,{enemy:'自身',effect:'毀滅炸藥'});log('💥 爆風反噬：自己承受 15 傷害。','dmg');}
  else if(id==='weakeningPowder'){const gained=applyConsumableWeakness(target,3);log(`📉 ${target.name}虛弱 +${gained}（本回合攻擊 −${(target.weakness||0)*10}%）。`,'good');if(gained&&b.inquisitorBattle&&(INQUISITOR_LEADERS.includes(target.type)||target.inquisitorEscort))addInquisitorStatusCrime(gained,'衰弱粉塵');}
  else if(id==='armorPiercer'){const removed=Math.min(target.shield||0,Math.ceil((target.shield||0)*.5));target.shield=Math.max(0,(target.shield||0)-removed);log(`⛏️ 破壞 ${target.name} ${removed} 點護盾；沒有溢出生命傷害。`,'good');}
  else if(id==='bandage'){const bleed=Math.min(6,b.bleed||0),trauma=Math.min(1,b.trauma||0);b.bleed-=bleed;b.trauma-=trauma;log(`🩹 流血 −${bleed}、創傷 −${trauma}。`,'good');}
  else if(id==='detox'){const poison=Math.min(10,G.poison||0),virulence=Math.min(2,b.virulence||0);G.poison-=poison;b.virulence-=virulence;if(!b.virulence)b.virulenceTicks=0;log(`⚗️ 中毒 −${poison}、猛毒 −${virulence}。`,'good');}
  else if(id==='whetstone'){b.whetstone=1.2;log('🧴 下一次攻擊最終傷害 ×1.200。','good');}
  else if(id==='ironskin'){b.ironskin=1.25;log('🧪 下一次選擇防禦的最終防禦 ×1.250。','good');}
  else if(id==='stimulant'){const before=b.controlLeft;b.controlLeft=Math.min(b.controlCap,b.controlLeft+6);G.control=b.controlLeft;log(`☕ 控制值回復 ${b.controlLeft-before}（${b.controlLeft}/${b.controlCap}）。`,'good');}
  else if(id==='smokeBomb'){b.over=true;clearLuckyNumber();syncButtons();log('💨 你撤離了這場野外戰鬥，沒有獲得任何獎勵。','dmg');renderTop();setTimeout(()=>advanceNode(),700);return;}
  renderTop();renderEnemies();updateHandUI();syncButtons();
  if(G.hp<=0&&!tryHolyMiracleRevive()){gameOver();return;}
  if(b.enemies.every(e=>e.curhp<=0)){winBattle();return;}
}

function defeatEnemyByStatus(e,effect='中毒'){
  const b=G.battle;
  const cause=effect==='燒傷'?'灼燒':'毒蝕';
  if(e.type==='kun'){transformKunToPeng(e,cause);e.justTransformed=false;return;}
  if(e.type==='cultLeader'){transformCultLeaderToCthulhu(cause);return;}
  if(e.type==='inquisitorMounted'){transformInquisitor(cause);e.justTransformed=false;return;}
  if(e.type==='zombie'&&!e.revived){
    e.curhp=1;e.downed=true;e.downedRound=b.round;e.nextDmg=0;
    log(`☠ ${e.name}被${effect}擊倒但尚未死亡！下回合仍可補刀。`,'dmg');
    return;
  }
  if(e.curhp<=0&&COURT_GARGOYLES.includes(e.type))onCourtGargoyleDeath(e);
  e.curhp=0;recordEnemyDefeat(e);log(`☠ ${e.name}被${effect}擊倒！`,'good');if(e.type==='inquisitor')weakenInquisitorEscorts(cause);
  if(e.type==='squirrel')recoverSquirrelGold(e);
  if(e.inquisitorEscort)addInquisitorCrime(5,`${effect}擊殺聖騎士`);
  if(COURT_GARGOYLES.includes(e.type))onCourtGargoyleDeath(e);
  if(e.type==='gargoyle'){
    const cultists=b.enemies.filter(x=>x.type==='cultist'&&x.curhp>0);cultists.forEach(x=>{x.curhp=0;recordEnemyDefeat(x);});
    releaseGargoyleLocks(e.idx);
    if(cultists.length)log(`🗿 石像鬼被${effect}崩毀，${cultists.length} 名邪教徒隨之死亡。`,'gd');
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
    const damage=enemyPoisonTickDamage(e);e.curhp-=damage;recordDamageDealt(damage,`${e.name}（中毒）`);SFX.poison();
    log(`☠ ${e.name}中毒發作：−${damage} HP${e.virulence>0?`（☣️ 猛毒 ${e.virulence} 層 ×${virulenceMultiplier(e).toFixed(1)}）`:''}`,'good');floatNum(e.idx,`-${damage}`,'#8ee063');
    if(e.curhp<=0)defeatEnemyByStatus(e,'中毒');
  });
  renderEnemies();
  return b.enemies.every(e=>e.curhp<=0);
}
function triggerEnemyBurn(){
  const b=G.battle;
  b.enemies.filter(e=>e.curhp>0&&!e.downed&&(e.burn||0)>0).forEach(e=>{
    const burn=tickBurnStatus(e);let damage=burn.damage;if(INQUISITOR_LEADERS.includes(e.type))damage=Math.max(1,Math.round(damage*.7));
    e.curhp-=damage;recordDamageDealt(damage,`${e.name}（燒傷）`);SFX.hurt();
    log(`🔥 ${e.name}燒傷發作：−${damage} HP${burn.decays?`，降為 ${burn.remaining} 層`:`（再發作 ${burn.nextIn} 次 −1 層）`}。`,'good');floatNum(e.idx,`-${damage}`,'#ff844d');
    if(e.curhp<=0)defeatEnemyByStatus(e,'燒傷');
  });
  renderEnemies();return b.enemies.every(e=>e.curhp<=0);
}

function endPlayerTurn(){
  const b=G.battle;runStats().turns++;advanceFaithNecklace();b.busy=true;syncButtons();renderEnemies();
  if(b.enemies.every(e=>e.curhp<=0)){winBattle();return;}
  setTimeout(()=>{
    b.samuraiMirrorFlowThisEnemyTurn=0;
    b.weakness=playerWeaknessFloor();b.hesitation=0;
    if((b.hallucination||0)>0)b.hallucination--;
    if((b.mentalDisorder||0)>0)b.mentalDisorder--;
    if((b.paralysis||0)>0){b.paralysis--;if(b.paralysis===0)log('⚡ 麻痺消退：控制消耗恢復正常。','good');}
    if(b.buffSuppressed>0){b.buffSuppressed--;if(b.buffSuppressed===0)log('🌊 威壓消退：你可以再次獲得蓄勢。','good');}
    if(G.poison>0){
      const pd=Math.round(G.poison*traumaStatusMultiplier(b)*virulenceMultiplier(b));losePlayerHp(pd,statusDamageSource('poison'));SFX.poison();
      log(`☠ 中毒發作：−${pd} HP${b.virulence>0?`（☣️ 猛毒 ${b.virulence} 層 ×${virulenceMultiplier(b).toFixed(1)}）`:''}`,'dmg');
    }
    if(G.hp<=0){renderTop();if(!tryHolyMiracleRevive()){gameOver();return;}}
    if(triggerEnemyPoison()){winBattle();return;}
    if(triggerEnemyBurn()){winBattle();return;}
    let total=0,armorBonus=0,cyclopsSmashEnemy=null,bloodExamEnemy=null,kunImpactEnemy=null,pengStatusEnemy=null,pengBleed=0,pengBurn=0;
    const incomingSources=[],addIncoming=(enemy,damage,effect='')=>{const mult=Math.max(0,Math.min(1,b.suitSpellEnemyMult||1)),value=Math.max(0,Math.round((damage||0)*mult));total+=value;if(value)incomingSources.push({enemy:enemy.name,enemyRef:enemy,effect:effect||enemyAttackEffect(enemy),damage:value});};
    const squirrelThieves=[];
    const zombieBiteEnemies=[],robotFireEnemies=[],eagleThunderDives=[],dropbearHitEvents=[];
    const batEvents=[],courtHitEvents=[],werewolfHitEvents=[],mimicHitEvents=[],samuraiHitEvents=[],roninHitEvents=[],inquisitorHitEvents=[];
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
          if(e.mikiriOutcome==='broken')log(`🎯 ${e.name}的見切已被洞破，本回合無法反擊。`,'good');
          else if(b.lastPlayerAction==='defense'||e.mikiriBustResolved){
            const before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*.08)));
            log(`🧘 ${e.name}以見切回復 ${e.curhp-before} HP${e.mikiriBustResolved?'；爆牌同時刷新殘心':'；防禦不會觸發殘心'}。`,'dmg');
          }else log(`👁️ ${e.name}完成見切，本回合沒有攻擊。`,'dmg');
          finishMikiriZanshin(e);e.mikiriBustResolved=false;
          e.samuraiStep=(e.samuraiStep||0)+1;return;
        }
        const parts=(e.samuraiParts||[]).map(part=>({...part}));
        const damage=parts.reduce((sum,part)=>sum+part.damage,0),wear=e.nextArmorBreak||0;
        addIncoming(e,damage);armorBonus+=wear;samuraiHitEvents.push({enemy:e,parts});
        if(e.samuraiAction==='iaido')log(`⚔️ ${e.name}拔刀居合，造成 ${damage} 傷害並以 40% 破防磨損 ${wear} 防禦！`,'dmg');
        else if(e.samuraiAction==='kesa')log(`🗡️ ${e.name}施展袈裟斬，造成 ${damage} 傷害！`,'dmg');
        else log(`🪽 ${e.name}施展燕返，分段造成 ${parts.map(part=>part.damage).join('＋')} 傷害，並磨損 ${wear} 防禦！`,'dmg');
        decayZanshin(e);
        e.samuraiStep=(e.samuraiStep||0)+1;return;
      }
      if(e.type==='ronin'){
        if(e.roninAction==='mikiri'){
          if(e.mikiriOutcome==='broken')log(`🎯 ${e.name}的見切被洞破，無法回血或刷新殘心。`,'good');
          else if(b.lastPlayerAction==='defense'||e.mikiriBustResolved){
            const before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*.10)));
            log(`🧘 ${e.name}以見切回復 ${e.curhp-before} HP${e.mikiriBustResolved?'；爆牌同時刷新殘心':'；防禦不會觸發殘心'}。`,'dmg');
          }else log(`👁️ ${e.name}完成見切，本回合沒有攻擊。`,'dmg');
          finishMikiriZanshin(e);e.mikiriBustResolved=false;
          e.roninStep=(e.roninStep||0)+1;return;
        }
        const parts=(e.roninParts||[]).map(part=>({...part})),damage=parts.reduce((sum,part)=>sum+part.damage,0),wear=e.nextArmorBreak||0;
        addIncoming(e,damage);armorBonus+=wear;roninHitEvents.push({enemy:e,parts});
        const actionName={iaido:'居合',stab:'刺突',karatake:'唐竹',tsubame:'燕返',thousandBlades:'千太刀'}[e.roninAction];
        log(`⚔️ ${e.name}施展${actionName}，造成 ${parts.length>1?parts.map(part=>part.damage).join('＋'):damage} 傷害${wear?`，並磨損 ${wear} 防禦`:''}！`,'dmg');
        if(e.roninAction==='thousandBlades'){e.roninForcedAction='iaido';log(`🗡️ ${e.name}五斬後收刀；下一回合固定使用居合。`,'dmg');}
        decayZanshin(e);e.roninStep=(e.roninStep||0)+1;return;
      }
      if(e.type==='paladin'&&e.inquisitorSync){
        if(e.inquisitorSync==='warcry'){log(`📯 ${e.name}發動戰吼：下回合敵方全體傷害 +25%。`,'dmg');return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]),rate=e.inquisitorSync==='holyCharge'?0.4:0.3;addIncoming(e,d,enemyAttackEffect(e,e.inquisitorSync));armorBonus+=Math.round(d*rate);inquisitorHitEvents.push({enemy:e,action:e.inquisitorSync,damage:d});
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
          const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]),rate=e.type==='inquisitorMounted'?(action==='lance'?0.35:action==='trample'?0.2:action==='charge'?0.6:0):(action==='sentenceSword'?0.3:action==='judgment'?0.5:0);addIncoming(e,d,enemyAttackEffect(e,action));armorBonus+=Math.round(d*rate);inquisitorHitEvents.push({enemy:e,action,damage:d});
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
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d,enemyAttackEffect(e,action));courtHitEvents.push({enemy:e,action,damage:d});
        log(`🕯 ${e.name}施放 ${({disciplineClaw:'戒律石爪',punishmentClaw:'刑罰石爪',poisonPunishment:'毒刑',toxicWhip:'毒鞭',blackScripture:'黑經誦讀',blindSermon:'盲目佈道',sepsisRite:'敗血儀式',bloodDrain:'汲血',profaneCommunion:'褻瀆共融'})[action]}，造成 ${d} 傷害！`,'dmg');
        if(e.consumeDamageBoost){e.nextDamageBoost=1;e.consumeDamageBoost=false;}e.courtStep++;return;
      }
      if(e.type==='cthulhu'){
        const action=e.cthulhuAction;
        if(action==='abyssRegeneration'){const before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+Math.max(1,Math.round(e.maxhp*.06)));e.shield=(e.shield||0)+Math.max(1,Math.round(e.maxhp*.12));log(`🕳️ 深淵再生：回復 ${e.curhp-before} HP，獲得 ${Math.round(e.maxhp*.12)} 永久護盾。`,'dmg');e.cthulhuStep++;return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d,enemyAttackEffect(e,action));courtHitEvents.push({enemy:e,action,damage:d});log(`🐙 克蘇魯施放 ${({tentacleRend:'萬觸撕裂',namelessGaze:'不可名狀的凝視',abyssResonance:'深淵震鳴',starWhisper:'群星囈語',deepPressure:'深海威壓'})[action]}，造成 ${d} 傷害！`,'dmg');e.cthulhuStep++;return;
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
        const pg=paladinGrowth(G.floor),before=e.shield||0,shieldPower=e.forsakenEscort?Math.max(1,Math.round(pg.shield*.5)):pg.shield;e.shield=Math.max(before,shieldPower);e.judgmentInterrupted=false;e.paladinStep++;
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
      if(e.type==='robot'&&e.robotAction==='charge'){
        const amount=robotGrowth(G.floor).chargeShield,before=e.shield||0;e.shield=Math.max(before,amount);
        log(`⚡ ${e.name}進行電力充能，護盾 ${before} → ${e.shield}，本回合沒有攻擊。`,'dmg');e.robotStep++;return;
      }
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
      if(witchPoisonTurn(e)){const raw=enemyStatusRaw(e,2),result=addEnemyPoison(e,raw,'witchPoison');SFX.poison();log(`${e.name} 在第 ${b.round} 回合施放劇毒，附加 ${result.poison} 層中毒${result.poison<raw?'（異常抗性減輕）':''}！`,'dmg');return;}
      if(e.type==='kun'){
        if(e.kunDevourPending){const remaining=Math.max(0,e.shield||0),wanted=remaining*2,before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+wanted);e.shield=0;e.kunDevourPending=false;log(remaining>0?`🐋 吞海回復 ${e.curhp-before} HP，並消耗剩餘 ${remaining} 護盾。`:'💥 吞海護盾已被打破，無法回血。',remaining>0?'dmg':'good');}
        if(e.kunAction==='pressure'){const lost=b.focus||0,gained=addWeakness(e,5);b.focus=0;b.buffSuppressed=2;log(`🌊 鯤施放威壓：${lost>0?`清除 ${lost} 蓄勢，並`:''}2 回合內無法獲得蓄勢，同時施加 ${gained} 層虛弱！`,'dmg');}
        else if(e.kunAction==='devour'){const shield=kunShieldAmount(e);e.shield=(e.shield||0)+shield;e.kunDevourPending=true;log(`🐋 鯤施放吞海，獲得 ${shield} 護盾（目前 ${e.shield}）；下回合將以剩餘護盾 ×2 回血。`,'dmg');}
        else if(e.kunAction==='divinity'){const heal=Math.max(1,Math.round(e.maxhp*kunGrowth().divineHealRate)),before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+heal);const removed=ultimateDispel(e);e.kunForcedAction='oversea';log(`✨ 神性發動：鯤回復 ${e.curhp-before} HP${removed.length?`，驅散 ${removed.join('、')}`:''}；下回合將發動覆海！`,'dmg');}
        else{const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d);if(e.kunAction==='impact')kunImpactEnemy=e;log(e.kunAction==='oversea'?`🌊 鯤發動覆海，造成 ${d} 傷害！`:`🐋 鯤發動深海撞擊，造成 ${d} 傷害（被動卡牌 ${G.passives.length} 張）！`,'dmg');}
        return;
      }
      if(e.type==='peng'){
        if(e.pengAction==='transition'){e.transitionPause=Math.max(0,(e.transitionPause||0)-1);log('☯ 鵬在化形後停頓，本回合沒有行動。','good');return;}
        if(e.pengAction==='rebirth'){const heal=Math.max(1,Math.round(e.maxhp*0.05)),before=e.curhp;e.curhp=Math.min(e.maxhp,e.curhp+heal);const removed=ultimateDispel(e),burn=addBurn(b,enemyStatusRaw(e,3),e,'浴火餘焰');e.pengForcedAction='inferno';log(`🔥 浴火振翅：鵬回復 ${e.curhp-before} HP${removed.length?`，驅散 ${removed.join('、')}`:''}；下回合將發動焚天！`,'dmg');if(burn.gained)log(`🔥 浴火餘焰：燒傷 +${burn.gained}（目前 ${b.burn}/${BURN_CAP}）。`,'dmg');if(burn.traumaGained)log(`🩹 溢出燒傷轉為創傷 +${burn.traumaGained}。`,'dmg');return;}
        if(e.pengAction==='eclipse'){const before=e.evasion;e.evasion=Math.min(e.maxEvasion,e.evasion+2);const blind=addBlind(b,enemyStatusRaw(e,3),e);log(`🌑 遮天蔽日：鵬恢復 ${e.evasion-before} 層閃避（${e.evasion}/${e.maxEvasion}），施加 ${blind} 層致盲（目前 ${b.blind}/3）。`,'dmg');return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d);const wear=armorBreakBonus(e,d,b.defense>0);armorBonus+=wear;
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
          else{const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d,'龍息');log(`🔥 魔龍噴吐龍息，造成 ${d} 傷害！`,'dmg');}
          e.shield=0;e.breathInterrupted=false;e.dragonStep=(e.dragonStep||0)+1;
          return;
        }
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d);
        log(`🐲 魔龍普攻，造成 ${d} 傷害`,'dmg');
        if(e.dragonAction==='ward'){
          const shield=dragonGrowth(G.floor).shieldAmount;e.shield=Math.max(e.shield||0,shield);
          log(`🛡 魔龍為龍息蓄力，展開 ${shield} 點龍盾！`,'dmg');
        }
        e.dragonStep=(e.dragonStep||0)+1;
        return;
      }
      if(e.type==='bloodDemon'&&e.bloodDemonAction==='sacrifice'){
        const floorHp=Math.ceil(e.maxhp*0.3);
        const cost=Math.min(Math.max(1,Math.round(e.maxhp*0.08)),Math.max(0,e.curhp-floorHp));
        if(cost>0){
          e.curhp-=cost;e.bloodPower=(e.bloodPower||0)+0.15;SFX.hurt();
      log(`🩸 血魔發動血祭：自損 ${cost} HP，本場攻擊永久 +15%（目前 +${Math.round(e.bloodPower*100)}%）。`,'dmg');
          floatNum(e.idx,`-${cost}`,'#d94b64');
        }
        return;
      }
      if(e.type==='dropbear'){
        if(!dropbearAttacks(b.round)){log(`${e.name} 正在蓄力休息…`);return;}
        const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d);
        dropbearHitEvents.push({enemy:e});
        log(`${e.name} 蓄力後猛撲！造成 ${d} 傷害！`,'dmg');
        return;
      }
      const d=e.nextDmg!=null?e.nextDmg:rnd(e.atk[0],e.atk[1]);addIncoming(e,d);
      if(e.bloodExam)bloodExamEnemy=e;
      const wear=armorBreakBonus(e,d,b.defense>0);armorBonus+=wear;
      if(e.type==='ninja'&&e.ninjaAction==='pierce')log(playerIsSamurai()&&b.samuraiGuardMode?`🥷 ${e.name}施展穿刺：造成 ${d} 基礎傷害，30% 破防會削弱本次見切／架勢。`:wear>0?`🥷 ${e.name}施展穿刺：造成 ${d} 基礎傷害，並以 30% 破防額外磨損 ${wear} 防禦。`:`🥷 ${e.name}施展穿刺；目前沒有可供破防磨損的防禦，因此只造成 ${d} 傷害。`,'dmg');
      else if(e.type==='eagle'&&e.divePending){const eg=eagleGrowth(G.floor);if(eg.thunder)eagleThunderDives.push(e);log(`${eg.thunder?'⚡':'🦅'} ${e.name}${eg.thunder?'雷霆俯衝':'俯衝反擊'}，造成 ${d} 傷害！`,'dmg');}
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
        else if(e.paladinAction==='sunder')log(playerIsSamurai()&&b.samuraiGuardMode?`💥 ${e.name}施展破甲斬擊：造成 ${d} 基礎傷害，30% 破防會削弱本次見切／架勢。`:wear>0?`💥 ${e.name}施展破甲斬擊：造成 ${d} 基礎傷害，並以 30% 破防額外磨損 ${wear} 防禦。`:`💥 ${e.name}施展破甲斬擊；目前沒有剩餘防禦可供額外磨損，只造成 ${d} 傷害。`,'dmg');
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
      if(e.type==='squirrel'&&b.round===1)squirrelThieves.push(e);
    });
    const samuraiActionMode=b.samuraiGuardMode,zanshinBefore=playerZanshinProfile();let samuraiActionBlockedTotal=0;
    if(playerIsSamurai()&&incomingSources.length&&((b.samuraiGuardMode&&b.samuraiGuardRate>0)||zanshinBefore)){
      let mikiriFlow=0,guardBlocked=0,actionBlockedTotal=0;
      const sourceFactors=new Map();
      incomingSources.forEach(source=>{
        const raw=source.damage,breakRate=armorBreakRate(source.enemyRef),breakMult=1-breakRate;
        const actionRate=Math.max(0,Math.min(1,(b.samuraiGuardRate||0)*breakMult)),zanshinRate=Math.max(0,Math.min(1,(zanshinBefore?.reduction||0)*breakMult));
        const rate=1-(1-actionRate)*(1-zanshinRate),reduced=Math.max(0,Math.round(raw*(1-rate))),blocked=Math.max(0,raw-reduced),actionReduced=Math.max(0,Math.round(raw*(1-actionRate))),actionBlocked=Math.max(0,raw-actionReduced);
        source.rawDamage=raw;source.damage=reduced;source.mikiriBlocked=actionBlocked;sourceFactors.set(source.enemyRef,raw>0?reduced/raw:1);guardBlocked+=blocked;actionBlockedTotal+=actionBlocked;
        if(b.samuraiGuardMode==='mikiri'&&raw>0)mikiriFlow+=8*(actionBlocked/raw)*samuraiActionThreatWeight(source.enemyRef);
      });
      total=incomingSources.reduce((sum,source)=>sum+source.damage,0);
      const scaleEvent=event=>{event.damage=Math.max(0,Math.round(event.damage*(sourceFactors.get(event.enemy)??1)));};
      [...batEvents,...courtHitEvents,...werewolfHitEvents,...mimicHitEvents,...inquisitorHitEvents].forEach(scaleEvent);
      samuraiHitEvents.forEach(event=>event.parts.forEach(part=>part.damage=Math.max(0,Math.round(part.damage*(sourceFactors.get(event.enemy)??1)))));
      roninHitEvents.forEach(event=>event.parts.forEach(part=>part.damage=Math.max(0,Math.round(part.damage*(sourceFactors.get(event.enemy)??1)))));
      const guardName=b.samuraiGuardMode==='mikiri'?'👁️ 見切':b.samuraiGuardMode==='safeLine'?'⚖️ 守線':b.samuraiGuardMode==='safeUltimate'?'⚡ 界線斷決':b.samuraiGuardMode==='stance'?'🗡️ 架勢':'🧘 殘心';
      log(`${guardName}${zanshinBefore&&b.samuraiGuardMode?'與殘心共同':''}減少 ${guardBlocked} 點攻擊傷害；破防會削弱本次百分比減傷。`,'good');
      samuraiActionBlockedTotal=actionBlockedTotal;
      if(actionBlockedTotal>0&&(b.samuraiGuardMode==='stance'||b.samuraiGuardMode==='mikiri')){
        const reward=samuraiGuardFlowReward(b.samuraiGuardMode,{flow:b.samuraiDefenseFlow||0},mikiriFlow,handTotal(b.hand),b.samuraiDefenseSubmitFlow);b.samuraiDefenseFlowAwarded=reward.total;
        addSamuraiFlow(reward.total,b.samuraiGuardMode==='mikiri'?'見切敵方攻勢':'架勢承受攻勢');
        if(reward.clear>0)log(`🪞 澄心：${handTotal(b.hand)} 點防守額外計入 ${reward.clear} 心流（仍受本次 ${reward.cap} 上限限制）。`,'gd');
      }
      if(b.samuraiGuardMode==='stance'&&preserveImmovableZanshin(actionBlockedTotal))log('🏯 不動太刀・守心成立：本段殘心本回合不會自然衰減。','gd');
      if((b.samuraiGuardMode==='stance'||b.samuraiGuardMode==='mikiri')&&grantMoonCounter(actionBlockedTotal))log(`🌙 圓盾${b.bucklerBroken?'雖已在本次防守後損毀，仍':''}成功擋傷並形成盾返。`,'gd');
      if(b.samuraiGuardMode==='mikiri'&&actionBlockedTotal>0){
        const totalPoint=handTotal(b.hand);
        if(totalPoint===21)grantPlayerZanshin(true);
        else if(totalPoint===20){const unfallen=immovableUnfallenReady(totalPoint,actionBlockedTotal);if(grantPlayerZanshin(unfallen)&&unfallen)log('🏯 不墜：20 點見切維持強殘心，並刷新完整持續時間。','gd');}
      }
    }
    b.enemies.filter(e=>e.curhp>0&&e.broken>0).forEach(e=>e.broken--);
    squirrelThieves.forEach(squirrelSteal);
    const defenseBefore=b.defense,resolved=resolveDefenseDamage(total,b.defense,armorBonus);
    const {blocked,armorWear}=resolved;let net=resolved.net;
    if(b.defense>0)log(`🛡 防禦抵擋 ${blocked} 傷害`+(net>0?`，仍受 ${net}`:'，完全擋下'),'good');
    if(armorWear>0)log(`💥 破防額外磨損 ${armorWear} 防禦；溢出的破防不會傷害 HP。`,'dmg');
    let kunDefenseLeft=defenseBefore;
    incomingSources.forEach(source=>{
      const sourceBlocked=Math.min(kunDefenseLeft,source.damage);kunDefenseLeft-=sourceBlocked;
      if(source.enemyRef?.type==='kun'&&sourceBlocked>=source.damage){
        if(source.enemyRef.kunAction==='oversea')reduceNorthTide(source.enemyRef,3,'完全防禦覆海');
        else if(source.enemyRef.kunAction==='impact')reduceNorthTide(source.enemyRef,1,'完全防禦深海撞擊');
      }
    });
    b.enemies.filter(e=>e.type==='kun'&&e.curhp>0&&b.round%kunGrowth().tideEvery===0).forEach(advanceNorthTide);
    b.defense=resolved.defenseLeft;
    if(net>0&&b.trauma>0){const before=net;net=Math.round(net*traumaAttackMultiplier(b));log(`🩹 創傷使攻擊傷害 ${before} → ${net}。`,'dmg');}
    settleHeartBladeNoHarm(incomingSources.length,samuraiActionBlockedTotal,net);
    let attributionDefense=defenseBefore;
    const damageParts=incomingSources.map(source=>{const blockedPart=Math.min(attributionDefense,source.damage);attributionDefense-=blockedPart;return {...source,hp:source.damage-blockedPart};}).filter(part=>part.hp>0);
    const roninExecutionPart=damageParts.find(part=>part.enemyRef?.type==='ronin'&&G.hp-net<=G.maxhp*((part.enemyRef.executionPercent||roninExecutionPercent())/100));
    const roninExecutionSource=roninExecutionPart?.enemyRef||null;
    if(roninExecutionSource){const line=roninExecutionSource.executionPercent||roninExecutionPercent();log(`⚔️ 斬首：攻擊穿透防禦，生命將落入 ${line}% 斬首線！`,'dmg');}
    const baseAttributed=damageParts.reduce((sum,part)=>sum+part.hp,0);let attributed=0;
    damageParts.forEach((part,index)=>{const share=index===damageParts.length-1?net-attributed:Math.floor(net*part.hp/Math.max(1,baseAttributed));attributed+=share;recordDamageTaken(share,part.enemy,roninExecutionSource&&part.enemyRef===roninExecutionSource?'斬首':part.effect);});
    if(net>0&&!damageParts.length)recordDamageTaken(net,'未知敵人','攻擊');
    const bleedHit=triggerBleed(b,net);losePlayerHp(net,null,false);losePlayerHp(bleedHit.damage,statusDamageSource('bleed'));
    if(net>0)SFX.hurt();
    if(bleedHit.damage>0)log(`🩸 流血發作：額外 −${bleedHit.damage} HP，降為 ${bleedHit.remaining} 層。`,'dmg');
    damageParts.filter(part=>part.enemyRef?.type==='robot'&&part.enemyRef.robotAction==='electric').forEach(part=>{
      const gained=addParalysis(part.enemyRef,robotGrowth(G.floor).paralysis);
      if(gained>0)log(`⚡ 電弧傷及 HP：麻痺 +${gained}（剩餘 ${b.paralysis} 次行動）。`,'dmg');
    });
    damageParts.filter(part=>eagleThunderDives.includes(part.enemyRef)).forEach(part=>{
      const gained=addParalysis(part.enemyRef,eagleGrowth(G.floor).paralysis);
      if(gained>0)log(`⚡ 雷霆俯衝傷及 HP：麻痺 +${gained}（剩餘 ${b.paralysis} 次行動）。`,'dmg');
    });
    dropbearHitEvents.forEach(event=>{
      const hpHit=damageParts.some(part=>part.enemyRef===event.enemy);
      if(!hpHit){log('🛡 掉落熊的猛撲被完全擋下，未附加中毒或虛弱。','good');return;}
      const poisonResult=addEnemyPoison(event.enemy,enemyStatusRaw(event.enemy,2),'pounce'),weaknessGained=addWeakness(event.enemy,4);SFX.poison();
      log(`☠ 猛撲傷及 HP：中毒 +${poisonResult.poison}、虛弱 +${weaknessGained}。`,'dmg');
    });
    const hpHitByEnemy=enemy=>damageParts.some(part=>part.enemyRef===enemy);
    if(bloodExamEnemy&&hpHitByEnemy(bloodExamEnemy)){const result=addBleed(b,enemyStatusRaw(bloodExamEnemy,1),bloodExamEnemy,'血魔撕裂');if(result.traumaGained)log(`🩹 流血已滿：新增的 ${result.traumaGained} 層流血轉為創傷（目前 ${b.trauma} 層）。`,'dmg');else if(result.gained>0)log(`🩸 血魔考官的攻擊命中 HP：流血 +${result.gained}（目前 ${b.bleed}/${BLEED_CAP} 層）。`,'dmg');}
    if(cyclopsSmashEnemy&&hpHitByEnemy(cyclopsSmashEnemy)){const gained=addFracture(b,enemyStatusRaw(cyclopsSmashEnemy,1),cyclopsSmashEnemy);if(gained>0)log(`🦴 粉碎重擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3 層，新防禦 −${b.fracture*15}%）。`,'dmg');}
    if(kunImpactEnemy&&hpHitByEnemy(kunImpactEnemy)){const gained=addFracture(b,enemyStatusRaw(kunImpactEnemy,1),kunImpactEnemy);if(gained>0)log(`🦴 深海撞擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3）。`,'dmg');}
    if(net>0)mimicHitEvents.forEach(event=>{
      if(event.action==='venomBite'){
        const result=addEnemyPoison(event.enemy,enemyStatusRaw(event.enemy,2),'venomBite');if(result.poison>0){SFX.poison();log(`☠️ 毒牙傷及 HP：中毒 +${result.poison}（目前 ${G.poison}）。`,'dmg');}
      }else if(event.action==='rendingTongue'){
        const result=addBleed(b,enemyStatusRaw(event.enemy,2),event.enemy,'撕裂長舌・流血');if(result.gained)log(`🩸 長舌傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/${BLEED_CAP}）。`,'dmg');if(result.traumaGained)log(`🩹 溢出流血轉為創傷 +${result.traumaGained}。`,'dmg');
      }else{
        const gained=addFracture(b,enemyStatusRaw(event.enemy,1),event.enemy);if(gained)log(`🦴 夾擊傷及 HP：斷骨 +${gained}（目前 ${b.fracture}/3）。`,'dmg');
      }
    });
    if(pengStatusEnemy&&hpHitByEnemy(pengStatusEnemy)&&pengBleed>0){const result=addBleed(b,enemyStatusRaw(pengStatusEnemy,pengBleed),pengStatusEnemy,`${enemyAttackEffect(pengStatusEnemy)}・流血`);if(result.gained)log(`🩸 鵬的攻擊附加流血 +${result.gained}（目前 ${b.bleed}/${BLEED_CAP}）。`,'dmg');if(result.traumaGained)log(`🩹 溢出流血轉為創傷 +${result.traumaGained}（目前 ${b.trauma}）。`,'dmg');}
    if(pengStatusEnemy&&hpHitByEnemy(pengStatusEnemy)&&pengBurn>0){const result=addBurn(b,enemyStatusRaw(pengStatusEnemy,pengBurn),pengStatusEnemy,`${enemyAttackEffect(pengStatusEnemy)}・燒傷`);if(result.gained)log(`🔥 鵬的攻擊附加燒傷 +${result.gained}（目前 ${b.burn}/${BURN_CAP}）。`,'dmg');if(result.traumaGained)log(`🩹 溢出燒傷轉為創傷 +${result.traumaGained}（目前 ${b.trauma}）。`,'dmg');}
    let werewolfDefense=defenseBefore;
    werewolfHitEvents.forEach(event=>{
      const blocked=Math.min(event.damage,werewolfDefense),hpDamage=Math.max(0,event.damage-blocked);werewolfDefense-=blocked;
      if(event.action!=='claw'||hpDamage<=0)return;
      const result=addBleed(b,enemyStatusRaw(event.enemy,2),event.enemy,'狼爪流血');
      if(result.gained)log(`🩸 狼爪傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/${BLEED_CAP}）。`,'dmg');
      if(result.traumaGained)log(`🩹 流血已滿：溢出的 ${result.traumaGained} 層轉為創傷（目前 ${b.trauma}）。`,'dmg');
    });
    let samuraiDefense=defenseBefore;
    samuraiHitEvents.forEach(event=>event.parts.forEach(part=>{
      const blockedForPart=Math.min(part.damage,samuraiDefense),hpDamage=Math.max(0,part.damage-blockedForPart);samuraiDefense-=blockedForPart;
      if(hpDamage<=0||part.bleed<=0)return;
      const result=addBleed(b,enemyStatusRaw(event.enemy,part.bleed),event.enemy,`${part.kind==='iaido'?'居合':part.kind==='kesa'?'袈裟斬':'燕返'}・流血`);
      if(result.gained)log(`🩸 ${part.kind==='iaido'?'居合':part.kind==='kesa'?'袈裟斬':'燕返'}傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/${BLEED_CAP}）。`,'dmg');
      if(result.traumaGained)log(`🩹 流血已滿：溢出的 ${result.traumaGained} 層轉為創傷（目前 ${b.trauma}）。`,'dmg');
    }));
    let roninDefense=defenseBefore;
    roninHitEvents.forEach(event=>event.parts.forEach(part=>{
      const blockedForPart=Math.min(part.damage,roninDefense),hpDamage=Math.max(0,part.damage-blockedForPart);roninDefense-=blockedForPart;
      if(hpDamage<=0)return;
      if(part.bleed>0){const actionName=part.kind==='karatake'?'唐竹':'燕返',result=addBleed(b,enemyStatusRaw(event.enemy,part.bleed),event.enemy,`${actionName}・流血`);if(result.gained)log(`🩸 ${actionName}傷及 HP：流血 +${result.gained}（目前 ${b.bleed}/${BLEED_CAP}）。`,'dmg');if(result.traumaGained)log(`🩹 流血已滿：溢出的 ${result.traumaGained} 層轉為創傷（目前 ${b.trauma}）。`,'dmg');}
    }));
    if(roninExecutionSource&&G.hp>0){
      log('⚔️ 流浪武士完成斬首，決鬥結束！','dmg');
      losePlayerHp(G.hp,{enemy:roninExecutionSource.name,effect:'斬首'});SFX.crit();
    }
    let inquisitorDefense=defenseBefore;
    inquisitorHitEvents.forEach(event=>{
      const blockedForEvent=Math.min(event.damage,inquisitorDefense),hpDamage=Math.max(0,event.damage-blockedForEvent);inquisitorDefense-=blockedForEvent;if(hpDamage<=0)return;
      if(['lance','sentenceSword'].includes(event.action)){const result=addBleed(b,enemyStatusRaw(event.enemy,2),event.enemy,`${enemyAttackEffect(event.enemy,event.action)}・流血`);if(result.gained)log(`🩸 ${event.action==='lance'?'騎槍突刺':'斷罪劍'}傷及 HP：流血 +${result.gained}。`,'dmg');if(result.traumaGained)log(`🩹 溢出流血轉為創傷 +${result.traumaGained}。`,'dmg');}
      if(event.action==='trample'||event.action==='charge'||event.action==='judgment'){const gained=addFracture(b,enemyStatusRaw(event.enemy,1),event.enemy);if(gained)log(`🦴 ${event.action==='judgment'?'審判':event.action==='charge'?'裁決衝鋒':'戰馬踐踏'}傷及 HP：斷骨 +${gained}。`,'dmg');}
      if(event.action==='charge'){const result=addBleed(b,enemyStatusRaw(event.enemy,2),event.enemy,'裁決衝鋒・流血');if(result.gained)log(`🩸 裁決衝鋒傷及 HP：流血 +${result.gained}。`,'dmg');}
      if(event.action==='pyre'){const burn=addBurn(b,enemyStatusRaw(event.enemy,3),event.enemy,'火刑・燒傷'),corruption=addLimitedStatus(b,'corruption',enemyStatusRaw(event.enemy,1),3,event.enemy);if(burn.gained||burn.traumaGained||corruption)log(`🔥 火刑命中：燒傷 +${burn.gained}、創傷 +${burn.traumaGained}、腐敗 +${corruption}。`,'dmg');}
      if(event.action==='interrogate'){const lost=Math.min(2,b.controlLeft||0);b.controlLeft-=lost;if(lost)log(`⛓️ 信仰拷問奪走 ${lost} 控制值。`,'dmg');else{const gained=addWeakness(event.enemy,2);log(`⛓️ 控制值已空：信仰拷問改施加 ${gained} 層虛弱。`,'dmg');}}
    });
    let courtDefense=defenseBefore;
    courtHitEvents.forEach(event=>{
      const {enemy,action}=event,blockedForEvent=Math.min(event.damage,courtDefense),hpDamage=Math.max(0,event.damage-blockedForEvent),hpHit=hpDamage>0;courtDefense-=blockedForEvent;let applied=0;
      if(hpHit&&action==='poisonPunishment'){const result=addEnemyPoison(enemy,enemyStatusRaw(enemy,2),action);applied=result.poison+result.virulence;}
      if(hpHit&&action==='toxicWhip'){const result=addEnemyPoison(enemy,enemyStatusRaw(enemy,3),action);applied=result.poison+result.virulence;}
      if(hpHit&&action==='blackScripture')applied=addLimitedStatus(b,'corruption',enemyStatusRaw(enemy,(b.fanaticism||0)>=20?2:1),3,enemy);
      if(action==='blindSermon')applied=addBlind(b,enemyStatusRaw(enemy,(b.fanaticism||0)>=20?2:1),enemy);
      if(hpHit&&action==='sepsisRite')applied=addSepsis(b,enemyStatusRaw(enemy,(b.fanaticism||0)>=20?2:1),enemy);
      if(action==='bloodDrain'&&hpHit){const wanted=Math.round(hpDamage*.5*sepsisMultiplier(b)),before=enemy.curhp;enemy.curhp=Math.min(enemy.maxhp,enemy.curhp+wanted);log(`🩸 汲血回復 ${enemy.curhp-before} HP。`,'dmg');}
      if(action==='profaneCommunion'){const rate=Math.min(.12,.03+playerNegativeTypeCount()*.015),before=enemy.curhp;enemy.curhp=Math.min(enemy.maxhp,enemy.curhp+Math.max(1,Math.round(enemy.maxhp*rate)));log(`🕯 褻瀆共融依 ${playerNegativeTypeCount()} 種負面狀態回復 ${enemy.curhp-before} HP。`,'dmg');}
      if(hpHit&&action==='tentacleRend'){const bleed=addBleed(b,enemyStatusRaw(enemy,5),enemy,'萬觸撕裂・流血');const fracture=addFracture(b,enemyStatusRaw(enemy,1),enemy);applied=bleed.gained+bleed.traumaGained+fracture;}
      if(action==='namelessGaze'){applied+=addTimedStatus(enemy,'hallucination',1);applied+=addTimedStatus(enemy,'mentalDisorder',1);}
      if(action==='abyssResonance')b.abyssDistance=Math.max(0,b.abyssDistance-1);
      if(action==='starWhisper'){applied+=addBlind(b,enemyStatusRaw(enemy,1),enemy);applyHesitation(enemy,3);applied++;}
      if(action==='deepPressure'){applied+=addWeakness(enemy,4);if(hpHit)applied+=addLimitedStatus(b,'corruption',enemyStatusRaw(enemy,1),3,enemy);}
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
    const landedZombieBites=zombieBiteEnemies.filter(hpHitByEnemy);
    if(landedZombieBites.length){
      const source=landedZombieBites[landedZombieBites.length-1],gained=addLimitedStatus(b,'corruption',landedZombieBites.reduce((sum,e)=>sum+enemyStatusRaw(e,1),0),3,source);
      if(gained>0)log(`🧟 腐敗撕咬傷及 HP：腐敗 +${gained}（目前 ${b.corruption} 層，戰鬥回血 −${b.corruption*20}%）`,'dmg');
    }
    const landedRobotFire=robotFireEnemies.filter(hpHitByEnemy);
    if(landedRobotFire.length){const add=landedRobotFire.reduce((sum,e)=>sum+enemyStatusRaw(e,robotGrowth(G.floor).burn),0),source=landedRobotFire[landedRobotFire.length-1],result=addBurn(b,add,source,'火焰噴射・燒傷');if(result.gained>0)log(`🔥 火焰傷及 HP：燒傷 +${result.gained}（目前 ${b.burn}/${BURN_CAP} 層）`,'dmg');if(result.traumaGained)log(`🩹 燒傷已滿：溢出的 ${result.traumaGained} 層燒傷轉為創傷（目前 ${b.trauma} 層）。`,'dmg');}
    const bloodDemon=b.enemies.find(e=>e.type==='bloodDemon'&&e.curhp>0);
    if(bloodDemon&&bloodDemon.bloodDemonAction==='drain'){
      const baseRate=bloodDemonGrowth(G.floor).drainRate,permanent=bloodDemon.permanentThirst===true,thirstStacks=bloodDemonThirstStacks(bloodDemon),thirst=thirstStacks>0;
      if(thirst&&!permanent){
        bloodDemon.bloodFrenzyUses=(bloodDemon.bloodFrenzyUses||0)+1;
        const gained=addSepsis(b,enemyStatusRaw(bloodDemon,1),bloodDemon);
        if(gained>0)log(`🦠 血魔進入渴血：敗血 +${gained}（目前 ${b.sepsis}/5 層）`,'dmg');
      }
      const sepsisBefore=b.sepsis,rate=baseRate*(1+thirstStacks*.1)*sepsisMultiplier(b),guaranteed=Math.round((bloodDemon.nextDmg||0)*.25);
      const wanted=Math.max(guaranteed,Math.round(net*rate)),before=bloodDemon.curhp;
      bloodDemon.curhp=Math.min(bloodDemon.maxhp,bloodDemon.curhp+wanted);
      const healed=bloodDemon.curhp-before;
      log(healed>0?`😈 血魔吸血效率 ${Math.round(rate*100)}%${thirst?`（渴血 ${thirstStacks} 層，×${(1+thirstStacks*.1).toFixed(1)}）`:''}${!permanent&&thirst?`（低血量觸發 ${bloodDemon.bloodFrenzyUses}/${BALANCE.bloodDemonFrenzyUses}）`:''}${sepsisBefore>0?`（敗血 +${sepsisBefore*15}%）`:''}，回復 ${healed} HP${net===0?'（完全防禦保底）':''}`:'😈 血魔吸取鮮血，但生命已滿。','dmg');
    }
    if(bloodDescendantActive()){
      const selfDamage=Math.max(1,Math.ceil(G.maxhp*0.02));losePlayerHp(selfDamage,{enemy:'自身',effect:'血魔契約反噬'});SFX.hurt();log(`📜 血魔契約反噬：回合結束自損 ${selfDamage} HP。`,'dmg');
    }
    if(G.hp<=0){renderTop();if(!tryHolyMiracleRevive()){gameOver();return;}}
    if(b.cthulhuPhase){b.abyssDistance=Math.max(0,(b.abyssDistance||0)-1);log(`🕳️ 深淵托拽：距離自然 −1（${b.abyssDistance}/${b.abyssMax}）。`,b.abyssDistance<=3?'dmg':'');if(b.abyssDistance<=0){losePlayerHp(Math.max(0,G.hp),{enemy:'邪神・克蘇魯',effect:'深淵托拽'});G.hp=0;log('🕳️ 深淵距離歸零，生命被拖入深淵！','dmg');renderTop();if(!tryHolyMiracleRevive(true)){gameOver();return;}log('✨ 復活後從深淵距離 5 重新掙扎。','gd');}}
    b.enemies.filter(e=>e.curhp>0).forEach(e=>{if(decayTrauma(e))log(`🩹 ${e.name}的創傷自然減少 1 層（剩餘 ${e.trauma}）。`,'good');if(decayVirulence(e))log(`☣️ ${e.name}的猛毒經過 10 回合自然減少 1 層（剩餘 ${e.virulence}）。`,'good');e.weakness=0;});
    if(decayTrauma(b))log(`🩹 創傷自然減少 1 層（剩餘 ${b.trauma}）。`,'good');
    if(decayVirulence(b))log(`☣️ 猛毒經過 10 回合自然減少 1 層（剩餘 ${b.virulence}）。`,'good');
    if(decayPlayerBurnByRound())log(`🔥 回合經過：燒傷自然減少 1 層（剩餘 ${b.burn}）。`,'good');
    document.querySelector('.arena').animate(
      [{filter:'brightness(1)'},{filter:'brightness(.5) sepia(.5)'},{filter:'brightness(1)'}],{duration:300});
    if(G.hp<=0&&!tryHolyMiracleRevive()){gameOver();return;}
    if(!persistentDefenseActive())b.defense=0;
    if(playerIsSamurai()){
      settlePlayerZanshin(samuraiActionMode);
      b.samuraiGuardMode=null;b.samuraiGuardRate=0;
      b.samuraiDefenseFlow=0;b.samuraiDefenseSubmitFlow=0;b.samuraiDefenseFlowAwarded=0;b.samuraiHeartBladeSubmitted=false;b.samuraiBucklerParticipated=false;b.samuraiMoonFlowActive=false;b.samuraiZanshinRefreshed=false;
      if((b.mikiriCooldown||0)>0){b.mikiriCooldown--;if(b.mikiriCooldown===0)log('👁️ 見切冷卻完成。','good');}
    }
    b.round++;log(`— 第 ${b.round} 回合 —`);
    const sq=b.enemies.find(e=>e.type==='squirrel'&&e.curhp>0);
    if(sq&&b.round>squirrelEscapeTurns(G.floor)){b.over=true;clearLuckyNumber();syncButtons();log('🐿️ 松鼠帶著贓物逃跑了！',"dmg");delete G._squirrelNestFoundGold;setTimeout(()=>b.eventSource==='squirrelNest'?advanceNode():proceedAfterWin(false),1000);return;}
    rollIntents();renderEnemies();dealNewHand();
  },700);
}

function factionVictoryDelta(enemies){
  const cultists=enemies.filter(e=>e.type==='cultist').length,paladins=enemies.filter(e=>e.type==='paladin').length;
  if(!cultists&&!paladins)return 0;
  if(ownsP('bloodpact')&&!bloodDescendantActive()&&!G.churchSeen){
    if(cultists)log('🕯 尚未接觸教堂：擊敗邪教勢力只會微幅改變世人評價。','dmg');
    if(paladins)log('⛪ 尚未接觸教堂：擊敗神教勢力只會微幅改變世人評價。','dmg');
    return cultists*5-paladins*5;
  }
  const cultistValue=G.churchSeen?20:-5;
  if(cultists)log(`🕯 邪教勢力對你的敵意加深${!G.churchSeen?'（尚未接觸教堂，影響較小）':''}。`,'dmg');
  if(paladins)log('⛪ 聖堂勢力對你的敵意加深。','dmg');
  return cultists*cultistValue-paladins*20;
}
function winBattle(){
  const b=G.battle;if(!b||b.over)return;b.over=true;syncButtons();SFX.win();
  changeFaction(factionVictoryDelta(b.enemies),()=>finishBattleVictory(b));
}
let roninVictoryContinuation=null;
function openRoninBeheadingChoice(after){
  const b=G.battle;if(!b||b.roninRewardPending||b.roninRewardResolved)return false;
  b.roninRewardPending=true;roninVictoryContinuation=after;
  const noRoom=passiveInventoryFull(passiveSlotCost('beheading')),$accept=$('ronin-beheading-accept');
  $accept.disabled=noRoom;$('ronin-beheading-refuse').disabled=false;
  $('ronin-beheading-status').textContent=noRoom?'一般被動欄已滿；目前無法收下斬首，但仍可拒絕並繼續。':'';
  $('ronin-beheading-choice').classList.remove('hidden');return true;
}
function resolveRoninBeheadingChoice(accept){
  const b=G.battle;if(!b||!b.roninRewardPending||b.roninRewardResolved)return false;
  if(accept&&passiveInventoryFull(passiveSlotCost('beheading'))){$('ronin-beheading-status').textContent='一般被動欄空位不足，無法收下斬首。';return false;}
  b.roninRewardPending=false;b.roninRewardResolved=true;
  $('ronin-beheading-accept').disabled=true;$('ronin-beheading-refuse').disabled=true;$('ronin-beheading-choice').classList.add('hidden');
  if(accept){
    if(!ownsP('beheading'))G.passives.push('beheading');
    G.passivePaid=G.passivePaid||{};G.passivePaid.beheading=0;G.passiveAffixes=G.passiveAffixes||{};delete G.passiveAffixes.beheading;G.beheadingPercent=5;
    log('流浪武士承認你的勝利：獲得被動「斬首」，斬首線 5%。','gd');
  }else{
    G.beheadingPercent=ownsP('beheading')?Math.max(5,G.beheadingPercent||5):0;
    log('你拒絕了斬首之技。流浪武士沒有勉強你。','gd');
  }
  renderTop();const continuation=roninVictoryContinuation;roninVictoryContinuation=null;if(continuation)continuation();return true;
}
function finishBattleVictory(b){
  b.enemies.filter(e=>e.curhp<=0).forEach(recordEnemyDefeat);
  G.luckyPendingBounty=ownsP('doublebet')&&validLuckyNumber(G.luckyNumber);
  if(b.bountyHuntActive)G.bountyHunt=null;
  b.enemies.filter(e=>e.type==='squirrel').forEach(recoverSquirrelGold);
  if(b.eventSource==='treasureChest'){
    log('🧰 寶箱怪被擊敗，暫停的寶箱獎勵恢復發放！','gd');
    setTimeout(()=>grantTreasureChestReward(),1100);return;
  }
  if(b.eventSource==='squirrelNest'){
    clearLuckyNumber();
    const reward=squirrelNestVictoryGold();gainGold(reward);delete G._squirrelNestFoundGold;SFX.coin();
    log(`🐿️ 松鼠窩守衛已被擊退！只取得 ${reward} 金幣，不進入賞金或其他獎勵。`,'gd');renderTop();
    setTimeout(()=>advanceNode(),1100);return;
  }
  if(b.eventSource==='ronin'){
    if(!ownsP('beheading')){
      openRoninBeheadingChoice(()=>continueBattleVictory(b));return;
    }else if((G.beheadingPercent||5)<20){
      const before=G.beheadingPercent||5;G.beheadingPercent=Math.min(20,before+3);
      log(`⚔️ 再次勝過流浪武士：斬首線 ${before}% → ${G.beheadingPercent}%。`,'gd');
    }else log('⚔️ 你的斬首已達 20% 上限；本次勝利仍提供一般事件戰鬥獎勵。','gd');
    renderTop();
  }
  continueBattleVictory(b);
}
function continueBattleVictory(b){
  const bossEnemy=b.enemies.find(e=>e.boss),boss=!!bossEnemy;
  if(boss){
    const chance=bossEnemy.type==='bloodDemon'?BALANCE.bloodPactBloodDemonChance:BALANCE.bloodPactChance;
    G._bloodPactOffer=!ownsP('bloodpact')&&gameRandom()<chance;
  }
  const reward=floorReward(G.floor,boss);
  log(`🏆 第 ${G.floor} 層清除！取得基礎賞金 ${reward} 的挑戰資格`,'gd');
  if(naturalHealingBlocked())log(`📜 ${bloodContractName()}：無法獲得戰後自然回血。`,'dmg');
  else{
    const result=healPlayer(BALANCE.clearHeal);log(`🔥 喘息片刻：回復 ${result.healed} HP`,'good');
  }
  if(hasP('rubyring')){const h=isUp('rubyring')?15:8,result=healPlayer(h);log(`💍 紅寶石戒指：清層回復 ${result.healed} HP`,'good');}
  if(boss&&!naturalHealingBlocked()){const result=healPlayer(30);log(`👑 擊敗魔王，回復 ${result.healed} HP！`,'good');}
  if(!boss&&!b.eventSource&&G.nodeType==='battle')grantConsumableDrop('一般戰鬥',NORMAL_CONSUMABLE_DROP_CHANCE);
  renderTop();
  const source=b.eventSource?`event:${b.eventSource}`:'battle';
  setTimeout(()=>startBounty(boss,reward,source),1100);
}
function proceedAfterWin(boss){
  if(boss){restoreControl();G.floor++;G.nodeType=null;G.nodeStarted=false;openUpgrade('boss');return;}
  G.eventChance=Math.min(1,(G.eventChance||BASE_EVENT_CHANCE)+EVENT_CHANCE_STEP);
  advanceNode();
}
//===== 強化蒐集家：一般戰鬥素材 =====
const collectorMaterialDropEligible=(boss=false,source='battle')=>source==='battle'&&!boss&&G.character==='warrior'&&isUp('collector');
function openCardDrop(boss,source='battle'){
  G._dropBoss=boss;G._dropSource=source;
  G._drops=[{card:randomCard()},{card:randomCard()}];G._dropChosen=false;G._dropReplacePending=null;
  show('drop');
  renderDrop();
}
function renderDrop(){
  const materials=G.collectorMaterials||[];
  $('drop-list').innerHTML=`<div class="muted">揭示 2 張素材牌，可收藏其中 1 張或全部放棄。素材不會直接加入戰鬥牌庫。收藏 ${materials.length}/${BALANCE.deckWorkshop.materialLimit}：${materials.map(card=>`${cardLabel(card)}${card.s}`).join('、')||'無'}</div>`+G._drops.map((d,i)=>{
    const c=d.card;
    const action=G._dropChosen?`<div class="owned">${d.chosen?'✓ 已收藏為素材':'未選擇'}</div>`:`<button class="b-buy" data-pick="${i}">收藏此素材</button>`;
    return `<div class="codex-card"><div class="cn" style="font-size:24px;${c.red?'color:#e74c3c':''}">${cardLabel(c)}${c.s}</div>${action}</div>`;
  }).join('')+(G._dropReplacePending?`<div class="codex-card"><div class="cn">素材區已滿：選擇要被替換的舊素材</div><div class="btns">${materials.map((card,index)=>`<button class="b-buy" data-replace-material="${index}">${cardLabel(card)}${card.s}</button>`).join('')}</div></div>`:'');
  $('drop-list').querySelectorAll('button[data-pick]').forEach(btn=>{
    btn.onclick=()=>{const i=+btn.dataset.pick;if(G._dropChosen||!G._drops[i])return;if(materials.length<BALANCE.deckWorkshop.materialLimit){G.collectorMaterials.push(cloneCard(G._drops[i].card));G._drops[i].chosen=true;G._dropChosen=true;SFX.coin();}else G._dropReplacePending={dropIndex:i};renderDrop();};
  });
  $('drop-list').querySelectorAll('[data-replace-material]').forEach(button=>button.onclick=()=>{if(!G._dropReplacePending||G._dropChosen)return;const dropIndex=G._dropReplacePending.dropIndex,index=+button.dataset.replaceMaterial;G.collectorMaterials[index]=cloneCard(G._drops[dropIndex].card);G._drops[dropIndex].chosen=true;G._dropChosen=true;G._dropReplacePending=null;SFX.coin();renderDrop();});
}
function finishEventBattleReward(source){
  if(source==='event:bloodAltar'){openBloodAltarVictory();return;}
  openUpgrade('event'); // 教堂破壞戰鬥等事件共用的一般獎勵出口
}
function finishDrop(){
  const source=G._dropSource||'battle';G._dropReplacePending=null;
  if(source.startsWith('event:'))finishEventBattleReward(source);else proceedAfterWin(G._dropBoss);
}

function redraw(){
  const b=G.battle,cost=currentControlCost('redraw');if(b.over||b.busy||b.controlLeft<cost||skillIsLocked('redraw'))return;
  if(G.activeBlade==='vampire'&&(b.samuraiBloodWager||b.samuraiBloodStreak))forfeitBloodWager('重抽手牌');
  b.controlLeft-=cost;G.control=b.controlLeft;b.pendingBust=false;
  log(`🔄 重抽手牌（控制值 −${cost}，剩餘 ${b.controlLeft}/${b.controlCap}）`,'hit');renderTop();dealNewHand();
}
function peek(){
  const b=G.battle,cost=currentControlCost('peek');if(b.over||b.controlLeft<cost||skillIsLocked('peek'))return;
  b.controlLeft-=cost;G.control=b.controlLeft;
  const n=isUp('peek')?4:3;
  const cards=b.deck.slice(-n).reverse();b.samuraiFatePreview=cards;
  const top=cards.map(c=>{if(b.hallucination&&!c._peekIllusion&&gameRandom()<.05)c._peekIllusion=randomCard();const shown=shownCard(c);return cardLabel(shown)+shown.s;}).join('  ');
  log(`👁️ 下${n}張：${top}（控制值 −${cost}，剩餘 ${b.controlLeft}/${b.controlCap}）`,'hit');
  if(playerIsSamurai()&&G.activeBlade==='peek'&&hasActiveBlade()&&!b.samuraiFateUsed){b.samuraiFatePickerMode='cut';renderFatePicker();}
  else closeFatePicker();
  syncButtons();renderTop();
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
  const cands=G.passives.filter(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);return id!=='suitmage'&&hasP(id)&&p&&p.descUp&&!G.upgrades.includes(id);});
  const canMaster=hasP('suitmage')&&(!G.suitMastery||!G.upgrades.includes('suitmage'));
  const canDoublebetMaster=hasP('doublebet')&&isUp('doublebet')&&!G.upgrades.includes('doublebet2');
  const canTakeBloodPact=G._bloodPactOffer===true&&!ownsP('bloodpact');
  if(!cands.length&&!canMaster&&!canDoublebetMaster&&!canTakeBloodPact){finishUpgradeReward();return;}
  show('upgrade');
  const eventReward=G._upgradeReturn==='event';$('upgrade-title').textContent=eventReward?'⭐ 一般獎勵':'⭐ 魔王獎勵';$('upgrade-desc').textContent=eventReward?'選擇一項持有能力進行強化；這是事件戰鬥提供的額外獎勵。':'選擇一項強化或專精；特殊裝備可額外領取，不占用本次選擇。';
  let html='';
  if(canTakeBloodPact){
    html+=`<div class="shopitem blood-pact-item"><div class="info"><b>📜 鮮血契約（稀有額外裝備）</b><div class="desc">簽訂時最大生命減半；成為血魔前，未來最大生命增長只有 50%。獲得 5 層渴血，使吸血倍率 ×1.5；無法獲得戰後自然回血。成為血魔後，未來最大生命增長恢復 100%，過去損失不返還。</div><div class="desc" style="color:#f0a6b8">無法購買；領取後仍可選擇本次魔王強化。擊敗血魔時較容易出現。</div></div><button class="b-magic" data-bloodpact="1">簽訂契約</button></div>`;
  }
  cands.forEach(id=>{const p=ALL_PASSIVES.find(x=>x.id===id);
    html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${passiveNameWithAffix(id)}</b>${passiveAffixId(id)?` ${affixBadge(passiveAffixId(id))}`:''}<div class="desc">目前：${passiveDescription(p,false)}</div><div class="desc" style="color:var(--gold)">⭐ 強化後：${passiveDescription(p,true)}</div></div><button class="b-buy" data-up="${id}">強化</button></div>`;
  });
  if(canMaster){
    html+=`<div class="center big" style="color:#d7b4ff">🎭 花色魔術師強化（專精四選一，永久互斥）</div>`;
    SUIT_MASTERIES.forEach(m=>{html+=`<div class="shopitem mastery-item"><div class="info"><b>${m.icon} ${m.name}</b><div class="desc">花色魔術控制消耗 4 → 3。｜${m.desc}</div></div><button class="b-magic" data-mastery="${m.id}">強化並專精</button></div>`;});
  }
  if(canDoublebetMaster){
    html+=`<div class="shopitem mastery-item"><div class="info"><b>🎲 孤注一擲（二次強化）</b><div class="desc">${DOUBLEBET_MASTERY_DESC}</div></div><button class="b-magic" data-doublebet2="1">二次強化</button></div>`;
  }
  $('upgrade-list').innerHTML=html;
  $('upgrade-list').querySelectorAll('button[data-up]').forEach(btn=>{
    btn.onclick=()=>{if(!isUp(btn.dataset.up))G.upgrades.push(btn.dataset.up);SFX.win();finishUpgradeReward();};
  });
  $('upgrade-list').querySelectorAll('button[data-mastery]').forEach(btn=>{
    btn.onclick=()=>{if(!G.upgrades.includes('suitmage'))G.upgrades.push('suitmage');G.suitMastery=btn.dataset.mastery;SFX.win();finishUpgradeReward();};
  });
  const doublebet2=$('upgrade-list').querySelector('button[data-doublebet2]');
  if(doublebet2)doublebet2.onclick=()=>{if(!G.upgrades.includes('doublebet2'))G.upgrades.push('doublebet2');SFX.win();finishUpgradeReward();};
  const bloodPact=$('upgrade-list').querySelector('button[data-bloodpact]');
  if(bloodPact)bloodPact.onclick=()=>{G._bloodPactOffer=false;SFX.win();grantBloodPact(openUpgrade);};
  renderTop();
}

//===== 商店 =====
function consumableInfo(id){return CONSUMABLES.find(item=>item.id===id)||null;}
function consumableCount(id){return Math.max(0,Math.round(G.consumables&&G.consumables[id]||0));}
function consumableTypeCount(){return Object.values(G.consumables||{}).filter(count=>count>0).length;}
function consumableTypeLimit(){return CONSUMABLE_TYPE_LIMIT+(hasP('toolkit')?(isUp('toolkit')?4:2):0);}
function canCarryConsumable(id){return consumableCount(id)<CONSUMABLE_STACK_LIMIT&&(consumableCount(id)>0||consumableTypeCount()<consumableTypeLimit());}
function addConsumable(id,count=1){
  if(!consumableInfo(id)||!canCarryConsumable(id))return 0;G.consumables=G.consumables||{};
  const before=consumableCount(id);G.consumables[id]=Math.min(CONSUMABLE_STACK_LIMIT,before+Math.max(1,Math.round(count)));return G.consumables[id]-before;
}
function removeConsumable(id,count=1){
  const before=consumableCount(id);if(!before)return 0;G.consumables[id]=Math.max(0,before-Math.max(1,Math.round(count)));if(!G.consumables[id])delete G.consumables[id];return before-(G.consumables[id]||0);
}
function rollConsumable(pool=CONSUMABLES){
  if(!pool.length)return null;const weight={common:50,uncommon:30,rare:15,legendary:5},total=pool.reduce((sum,item)=>sum+weight[item.rarity],0);let roll=gameRandom()*total;
  for(const item of pool){roll-=weight[item.rarity];if(roll<0)return item.id;}return pool[0].id;
}
function grantConsumableDrop(source,chance=1,announce=true){
  if(chance<1&&gameRandom()>=chance)return null;const pool=CONSUMABLES.filter(item=>canCarryConsumable(item.id));
  if(!pool.length){if(announce)log(`🎒 ${source}發現了消耗品，但背包已滿，無法帶走。`,'dmg');return null;}
  const id=rollConsumable(pool),item=consumableInfo(id);addConsumable(id);SFX.coin();if(announce)log(`🎁 ${source}掉落：${item.icon} ${item.name} ×1。`,'gd');renderTop();return id;
}
function passiveRarity(id){return PASSIVE_RARITY[id]||'common';}
function rarityInfo(id){return RARITY_INFO[passiveRarity(id)]||RARITY_INFO.common;}
function shopItemWeight(p){return rarityInfo(p.id).weight;}
function takeWeighted(pool){
  if(!pool.length)return null;
  const total=pool.reduce((sum,p)=>sum+shopItemWeight(p),0);let roll=gameRandom()*total,index=0;
  for(;index<pool.length-1;index++){roll-=shopItemWeight(pool[index]);if(roll<0)break;}
  return pool.splice(index,1)[0];
}
function rollPassiveAffix(){
  if(gameRandom()>=PASSIVE_AFFIX_CHANCE)return null;
  const total=PASSIVE_AFFIXES.reduce((sum,a)=>sum+a.weight,0);let roll=gameRandom()*total;
  for(const affix of PASSIVE_AFFIXES){roll-=affix.weight;if(roll<0)return affix.id;}
  return PASSIVE_AFFIXES[PASSIVE_AFFIXES.length-1].id;
}
function rollShopPicks(){
  const available=ALL_PASSIVES.filter(p=>p.shop!==false&&!G.passives.includes(p.id)&&!passiveConflictsWithOwned(p.id));
  const low=available.filter(p=>['common','uncommon'].includes(passiveRarity(p.id)));
  const rare=available.filter(p=>passiveRarity(p.id)==='rare');
  const legendary=available.filter(p=>passiveRarity(p.id)==='legendary');
  const picks=[],chapter=chapterIndex(G.floor),highRoll=gameRandom();
  let high=null;
  if(!G._shopHighRaritySeen){
    if(highRoll<0.05&&G.legendaryShopChapter!==chapter){
      high=takeWeighted(legendary);
      if(high)G.legendaryShopChapter=chapter;
    }else if(highRoll<0.30)high=takeWeighted(rare);
    if(high){picks.push(high.id);G._shopHighRaritySeen=true;}
  }
  while(low.length&&picks.length<4){const item=takeWeighted(low);if(item)picks.push(item.id);}
  return shuffle(picks);
}
function rollRankBoosts(count){return shuffle([...CARD_RANKS]).slice(0,Math.max(0,count)).map(rank=>({rank:String(rank),type:gameRandom()<0.5?'percent':'flat'}));}
function rollShopStock(){
  G._shopPicks=rollShopPicks();
  const inventoryFull=passiveInventoryFull(),chance=inventoryFull?BALANCE.rankBoostShopChanceFull:BALANCE.rankBoostShopChance;
  const rolls=inventoryFull?BALANCE.rankBoostShopRollsFull:1;
  for(let roll=0;roll<rolls;roll++){
    if(gameRandom()>=chance)continue;
    const replaceable=G._shopPicks.map((id,index)=>({id,index})).filter(item=>['common','uncommon'].includes(passiveRarity(item.id)));
    if(replaceable.length){const chosen=replaceable[rnd(0,replaceable.length-1)];G._shopPicks.splice(chosen.index,1);}
  }
  G._shopRankBoosts=rollRankBoosts(4-G._shopPicks.length);
  G._shopSuitBoost=ownsP('suitmage')&&G.upgrades.includes('suitmage')?{suit:SUITS[rnd(0,SUITS.length-1)],type:gameRandom()<.5?'percent':'flat'}:null;
  G._shopAffixes=Object.fromEntries(G._shopPicks.map(id=>[id,rollPassiveAffix()]).filter(([,affix])=>affix));
  G._shopConsumable=rollConsumable();
}
function shopPurchaseKey(type,id=''){return `${type}:${String(id)}`;}
function shopPurchaseDone(type,id=''){return (G._shopPurchases||[]).includes(shopPurchaseKey(type,id));}
function markShopPurchase(type,id=''){G._shopPurchases=G._shopPurchases||[];const key=shopPurchaseKey(type,id);if(!G._shopPurchases.includes(key))G._shopPurchases.push(key);}
function openShop(){
  show('shop');$('shop-stage').textContent=G.floor;$('shop-rate').textContent=`×${shopFloorMultiplier().toFixed(2)}`;
  ensureShopFortuneVisit();
  G.shopRefreshCost=20;
  G._shopPurchases=[];
  G._shopHighRaritySeen=false;
  G._shopCards=[randomCard(),randomCard(),randomCard()];
  rollShopStock();
  if(!G.nodeStarted)applyLuckyCoinShopEntry();
  G.nodeStarted=true;
  renderShop();
  if(G.suitEnchantRecoveryPending&&G.character==='magician')openSuitEnchantFlow('recovery',0);
}
function renderShop(){
  const picks=(G._shopPicks||[]).map(id=>ALL_PASSIVES.find(p=>p.id===id)).filter(Boolean);
  const disc=hasP('luckycoin')?`（幸運金幣 −${isUp('luckycoin')?15:10}%）`:'';
  const inventoryFull=passiveInventoryFull();
  const fortuneVisit=ensureShopFortuneVisit(),fortuneInfo=fortuneVisit?`<div class="shopitem rank-boost-notice"><div class="info"><b>🍀 招福脇差・福緣 ${G.fortune||0}/5</b><div class="desc">入店之福：${fortuneVisit.entryGranted?'本次已判定':'尚未判定'}｜折扣消費：${fortuneVisit.discountPurchase?'已符合，離店時 +1':'尚未符合'}${fortuneVisit.spendGranted?'（已領取）':''}${fortuneVisit.discountPurchase&&!fortuneVisit.spendGranted&&(G.fortune||0)>=5?'｜目前已滿，離店取得會溢出':''}。每間商店兩種來源各最多一次。</div></div></div>`:'';
  let html=fortuneInfo+(inventoryFull?'<div class="shopitem rank-boost-notice"><div class="info"><b>🔢 裝備欄已滿：牌面強化出現率提升</b><div class="desc">每次刷新會進行 2 次較高機率的牌面強化替換判定，讓已成形套裝仍能繼續成長。</div></div></div>':'');
  picks.forEach(p=>{
    const rarity=rarityInfo(p.id),badge=`<span class="rarity rarity-${passiveRarity(p.id)}">${rarity.name}</span>`,affixId=G.passives.includes(p.id)?passiveAffixId(p.id):G._shopAffixes&&G._shopAffixes[p.id],affix=passiveAffixInfo(p.id,affixId);
    if(G.passives.includes(p.id)){html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${passiveNameWithAffix(p.id)}</b> ${badge} ${affix?affixBadge(affix.id):''}<div class="desc">${affix?`${affix.desc}｜`:''}${passiveDescription(p,isUp(p.id))}</div></div><div class="owned" style="padding:7px 12px">已擁有 ✓</div></div>`;return;}
    if(shopPurchaseDone('passive',p.id)){html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${affix?`${affix.icon} ${affix.name}・`:''}${p.name}</b> ${badge} ${affix?affixBadge(affix.id):''}<div class="desc">${affix?`${affix.desc}｜`:''}${passiveDescription(p,false)}</div></div><div class="owned" style="padding:7px 12px">本批已購買 ✓</div></div>`;return;}
    const c=price(p.cost),slots=passiveSlotCost(p.id,affixId),noRoom=passiveInventoryFull(slots);
    html+=`<div class="shopitem"><div class="info"><b>${p.icon} ${affix?`${affix.icon} ${affix.name}・`:''}${p.name}</b> ${badge} ${affix?affixBadge(affix.id):''} — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${affix?`${affix.desc}｜`:''}${passiveDescription(p,false)}${affixId==='ghost'?`（本件實際占用 ${slots} 格）`:''}</div></div><button class="b-buy" data-buy="${p.id}" data-cost="${c}"${noRoom?' disabled':''}>${noRoom?`需要 ${slots} 格空位`:'購買'}</button></div>`;
  });
  (G._shopRankBoosts||[]).forEach(boost=>{
    const key=String(boost.rank),isFlat=boost.type==='flat',current=isFlat?rankFlatBonus(key):rankDamagePercent(key),c=rankBoostPrice(),done=shopPurchaseDone(isFlat?'rankflat':'rankboost',key);
    html+=isFlat
      ?`<div class="shopitem rank-boost-item"><div class="info"><b>➕ ${key} 牌面增幅</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">每張 ${key} 提供的手牌基礎傷害永久 +2（目前 +${current}${done?'':` → +${current+2}`}），可無限疊加。</div></div><button class="b-buy" data-rankflat="${key}" data-cost="${c}"${done?' disabled':''}>${done?'本批已購買':'增幅 +2'}</button></div>`
      :`<div class="shopitem rank-boost-item"><div class="info"><b>🔢 ${key} 牌面倍率</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${key} 的手牌基礎傷害倍率永久 ${current}%${done?'':` → ${current+1}%`}，可無限疊加。</div></div><button class="b-buy" data-rankboost="${key}" data-cost="${c}"${done?' disabled':''}>${done?'本批已購買':'強化 +1%'}</button></div>`;
  });
  if(G._shopSuitBoost){const boost=G._shopSuitBoost,key=boost.suit,isFlat=boost.type==='flat',current=isFlat?suitFlatBonus(key):suitDamagePercent(key),c=rankBoostPrice(),done=shopPurchaseDone(isFlat?'suitflat':'suitboost',key);html+=isFlat
    ?`<div class="shopitem rank-boost-item"><div class="info"><b>🎭 ${key}${suitName(key)}增幅</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">每張 ${key} 的手牌基礎傷害永久 +2（目前 +${current}${done?'':` → +${current+2}`}）。</div></div><button class="b-buy" data-suitflat="${key}" data-cost="${c}"${done?' disabled':''}>${done?'本批已購買':'增幅 +2'}</button></div>`
    :`<div class="shopitem rank-boost-item"><div class="info"><b>🎭 ${key}${suitName(key)}倍率</b> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${key} 的手牌基礎傷害倍率永久 ${current}%${done?'':` → ${current+1}%`}。</div></div><button class="b-buy" data-suitboost="${key}" data-cost="${c}"${done?' disabled':''}>${done?'本批已購買':'強化 +1%'}</button></div>`;}
  const healDone=shopPurchaseDone('heal'),healFull=G.hp>=G.maxhp;
  html+=`<div class="shopitem"><div class="info"><b>🩺 治療服務</b> — <span style="color:var(--gold)">${price(60)}🪙</span><div class="desc">立即回復 40 HP；與可攜帶的回血藥水分開計算。</div></div><button class="b-buy" data-heal="1" data-cost="${price(60)}"${healDone||healFull?' disabled':''}>${healDone?'本批已購買':healFull?'生命值已滿':'接受治療'}</button></div>`;
  const controlCost=price(45),controlFull=G.control>=BALANCE.controlMax,controlDone=shopPurchaseDone('control');
  html+=`<div class="shopitem"><div class="info"><b>🎛 控制補給</b> — <span style="color:var(--gold)">${controlCost}🪙</span><div class="desc">回復 ${BALANCE.controlShopRestore} 控制值（目前 ${G.control}/${BALANCE.controlMax}）。</div></div><button class="b-buy" data-control="1" data-cost="${controlCost}"${controlFull||controlDone?' disabled':''}>${controlDone?'本批已購買':controlFull?'控制值已滿':'購買'}</button></div>`;
  const consumable=consumableInfo(G._shopConsumable),consumableDone=consumable&&shopPurchaseDone('consumable',consumable.id),consumableFull=consumable&&!canCarryConsumable(consumable.id);
  if(consumable){const c=price(consumable.cost),rarity=RARITY_INFO[consumable.rarity]||RARITY_INFO.common;html+=`<div class="shopitem consumable-card"><div class="info"><b>${consumable.icon} ${consumable.name}</b> <span class="rarity rarity-${consumable.rarity}">${rarity.name}</span> — <span style="color:var(--gold)">${c}🪙</span>${disc}<div class="desc">${consumable.desc}｜持有 ${consumableCount(consumable.id)}/${CONSUMABLE_STACK_LIMIT}，背包 ${consumableTypeCount()}/${consumableTypeLimit()} 種。</div></div><button class="b-buy" data-consumable="${consumable.id}" data-cost="${c}"${consumableDone||consumableFull?' disabled':''}>${consumableDone?'本批已購買':consumableFull?'背包已滿':'購買'}</button></div>`;}
  if(ownsP('suitmage')){const enchantCost=price(BALANCE.suitEnchantWorkshop.installBase);html+=`<div class="shopitem consumable-card"><div class="info"><b>🎭 花色附魔工房</b> — <span style="color:var(--gold)">新附魔 ${enchantCost}🪙／移位 ${price(BALANCE.suitEnchantWorkshop.moveBase)}🪙</span><div class="desc">可安裝或覆蓋三階術式，也可付費交換術式與空槽；所有操作都在最終確認後才扣除資源。</div></div><button class="b-magic" data-enchant-service="1" data-cost="${enchantCost}">進入附魔工房</button></div>`;}
  const hpCost=maxHpPrice(),hpGain=playerMaxHpGain(20),maxHpDone=shopPurchaseDone('maxhp');
  html+=`<div class="shopitem"><div class="info"><b>💪 強健體魄</b> — <span style="color:var(--gold)">${hpCost}🪙</span><div class="desc">最大 HP +${hpGain} 並回復 20 HP${hpGain<20?'（鮮血契約使最大生命增長減半）':''}。已購買 ${G.maxHpPurchases||0} 次；每次價格 ×${BALANCE.maxHpGrowth.toFixed(2)}。</div></div><button class="b-buy" data-maxhp="1" data-cost="${hpCost}"${maxHpDone?' disabled':''}>${maxHpDone?'本批已購買':'購買'}</button></div>`;
  if(deckWorkshopAllowed()){const visit=ensureDeckWorkshopVisit('shop');html+=`<div class="shopitem"><div class="info"><b>🎴 戰士專屬牌庫工坊</b><div class="desc">永久加入、刪除、替換、複製、升降或指定重鑄戰鬥牌庫；本次造訪最多成功一次。素材 ${G.collectorMaterials.length}/${BALANCE.deckWorkshop.materialLimit}，本大關已改 ${G.deckWorkshopUses||0} 次。</div></div><button class="b-buy" id="open-deckedit">${visit.used?'檢視（本次已使用）':'開啟工坊'}</button></div>`;}
  if(G.character==='magician')html+=`<div class="shopitem"><div class="info"><b>🎨 魔術師專屬花色重鑄</b> — <span style="color:var(--gold)">${suitForgePrice()}🪙</span>${disc}<div class="desc">保留牌面並永久改成指定花色，只修改戰鬥牌庫。</div></div><button class="b-magic" id="open-suitforge">開啟</button></div>`;
  const sellables=inventoryPassives().filter(id=>!hostileSealProtected(id)&&passiveAffixId(id)!=='locked').map(id=>ALL_PASSIVES.find(p=>p.id===id)).filter(Boolean);
  html+=`<div class="shopitem sell-panel"><div class="info"><b>♻️ 出售裝備（啟用欄位 ${activePassiveSlots()}/${currentPassiveLimit()}${G.sealedPassive?'，封存 1':''}）</b><div class="desc">商店購買品按實際買入價 50% 回收；開局與免費取得的裝備按基礎價格 25% 回收。「通貨膨脹」改按當前商店漲價倍率估值；鍍金使回收價 +10%。簽名卡、血之三契與上鎖裝備不可出售。出售已轉化為刀具的來源被動，會連帶失去該刀具；失去全部刀具後，武士徒手攻擊固定造成 1 傷害。</div><div class="sell-list">${sellables.length?sellables.map(p=>`<button class="b-ghost" data-sell="${p.id}">${p.icon} ${passiveNameWithAffix(p.id)}${G.sealedPassive===p.id?'（已封存）':''}｜${passiveSellValue(p.id)}🪙</button>`).join(''):'目前沒有可出售的一般裝備。'}</div></div></div>`;
  $('shop-items').innerHTML=html;bindShop();
  if($('open-deckedit'))$('open-deckedit').onclick=()=>openDeckEdit('shop');
  if($('open-suitforge'))$('open-suitforge').onclick=openSuitForge;
  $('shop-refresh').textContent=`🔄 刷新商品（${price(G.shopRefreshCost)}🪙）`;
  renderTop();
}
function refreshShop(){
  const cost=price(G.shopRefreshCost);
  if(G.gold<cost){const btn=$('shop-refresh');const old=btn.textContent;btn.textContent='金幣不足';setTimeout(()=>btn.textContent=old,900);return;}
  G.gold-=cost;markLuckyDiscountPurchase(cost);SFX.coin();
  G.shopRefreshCost*=2;
  G._shopPurchases=[];
  G._shopCards=[randomCard(),randomCard(),randomCard()];
  rollShopStock();
  renderShop();
}
//===== 戰士職業被動：永久戰鬥牌庫塑形 =====
const cloneCard=card=>({r:card.r,s:card.s,red:card.s==='♥'||card.s==='♦'});
function validateCombatDeck(deck){
  const cfg=BALANCE.deckWorkshop;if(!Array.isArray(deck)||deck.length<cfg.minCards)return {ok:false,reason:`戰鬥牌庫不得少於 ${cfg.minCards} 張`};
  const exact={},ranks={};let tenValue=0;
  for(const card of deck){
    const normalized=normalizeSavedCard(card);if(!normalized)return {ok:false,reason:'牌庫包含無效牌'};
    const exactKey=`${normalized.r}|${normalized.s}`,rankKey=String(normalized.r);exact[exactKey]=(exact[exactKey]||0)+1;ranks[rankKey]=(ranks[rankKey]||0)+1;
    if([10,'J','Q','K'].includes(normalized.r))tenValue++;
  }
  if(Object.values(exact).some(count=>count>cfg.maxExactCopies))return {ok:false,reason:`完全相同的牌面與花色最多 ${cfg.maxExactCopies} 張`};
  if(Object.values(ranks).some(count=>count>cfg.maxRankCopies))return {ok:false,reason:`同一印刷牌面最多 ${cfg.maxRankCopies} 張`};
  if(tenValue/deck.length>cfg.maxTenValueRatio+1e-12)return {ok:false,reason:`10、J、Q、K 合計不得超過牌庫 ${Math.round(cfg.maxTenValueRatio*100)}%`};
  return {ok:true,reason:''};
}
function syncDeckWorkshopChapter(){const chapter=chapterIndex(Math.max(1,G.floor||1));if(G.deckWorkshopChapter!==chapter){G.deckWorkshopChapter=chapter;G.deckWorkshopUses=0;}return chapter;}
function deckWorkshopVisitMultiplier(){syncDeckWorkshopChapter();const rates=BALANCE.deckWorkshop.visitMultipliers,uses=Math.max(0,G.deckWorkshopUses||0);return rates[Math.min(uses,rates.length-1)];}
function deckWorkshopPrice(type,source=G._deckWorkshopVisit?.source||'shop'){
  const base=BALANCE.deckWorkshop.prices[type];if(!base)return 0;
  if(source==='startup')return base;
  const chapter=syncDeckWorkshopChapter(),chapterFloor=chapter*CHAPTER_LENGTH+1,growth=floorReward(chapterFloor,false)/floorReward(1,false),discount=source==='fixedRest'?BALANCE.deckWorkshop.fixedRestDiscount:1;
  return Math.max(0,Math.round(base*growth*deckWorkshopVisitMultiplier()*discount*(source==='shop'?shopMult():1)));
}
function ensureDeckWorkshopVisit(source){const key=`${source}:${source==='startup'?'initial':G.floor}`;if(!G._deckWorkshopVisit||G._deckWorkshopVisit.key!==key)G._deckWorkshopVisit={key,source,used:false};return G._deckWorkshopVisit;}
function deckWorkshopAllowed(){return G.character==='warrior'&&ownsP('collector');}
function deckWorkshopCandidateCard(rank,suit){return normalizeSavedCard({r:rank,s:suit});}
function performDeckWorkshopOperation(type,payload={}){
  const visit=G._deckWorkshopVisit;if(!deckWorkshopAllowed())return {ok:false,reason:'只有持有蒐集家的戰士可以使用結構改牌'};
  if(!visit||visit.used)return {ok:false,reason:'本次造訪已完成一次結構改牌'};
  const next=G.deck.map(cloneCard),selected=Number.isInteger(payload.deckIndex)?payload.deckIndex:G._deckWorkshopSelection,materials=G.collectorMaterials||[];
  let priceType=type,materialIndex=null;
  const requireSelected=()=>Number.isInteger(selected)&&selected>=0&&selected<next.length;
  if(type==='shift'){
    if(!requireSelected())return {ok:false,reason:'請先選擇牌庫中的牌'};
    const index=CARD_RANKS.map(String).indexOf(String(next[selected].r)),target=index+Math.sign(Number(payload.delta)||0);if(target<0||target>=CARD_RANKS.length)return {ok:false,reason:'牌面已到升降界線'};
    next[selected].r=CARD_RANKS[target];
  }else if(type==='replace'){
    if(!requireSelected())return {ok:false,reason:'請先選擇要替換的牌'};const card=normalizeSavedCard(payload.card);if(!card)return {ok:false,reason:'替換牌無效'};next[selected]=card;
  }else if(type==='add'){
    const card=normalizeSavedCard(payload.card);if(!card)return {ok:false,reason:'加入牌無效'};next.push(card);
  }else if(type==='remove'){
    if(!requireSelected())return {ok:false,reason:'請先選擇要刪除的牌'};next.splice(selected,1);
  }else if(type==='duplicate'){
    if(!requireSelected())return {ok:false,reason:'請先選擇要複製的牌'};next.push(cloneCard(next[selected]));
  }else if(type==='reforge'){
    if(!requireSelected())return {ok:false,reason:'請先選擇要重鑄的牌'};const rank=CARD_RANKS.find(value=>String(value)===String(payload.rank));if(rank==null)return {ok:false,reason:'指定牌面無效'};next[selected].r=rank;
  }else if(type==='materialAdd'||type==='materialReplace'){
    materialIndex=Number(payload.materialIndex);const card=materials[materialIndex];if(!card)return {ok:false,reason:'素材不存在'};
    if(type==='materialReplace'){if(!requireSelected())return {ok:false,reason:'請先選擇要替換的牌'};next[selected]=cloneCard(card);priceType='replace';}
    else{next.push(cloneCard(card));priceType='add';}
  }else return {ok:false,reason:'未知的牌庫操作'};
  const validation=validateCombatDeck(next);if(!validation.ok)return validation;
  const cost=deckWorkshopPrice(priceType,visit.source);if(G.gold<cost)return {ok:false,reason:`金幣不足，需要 ${cost} 金幣`};
  G.gold-=cost;if(visit.source==='shop')markLuckyDiscountPurchase(cost);G.deck=next;if(materialIndex!=null)G.collectorMaterials.splice(materialIndex,1);G.deckEdits=(G.deckEdits||0)+1;syncDeckWorkshopChapter();G.deckWorkshopUses=(G.deckWorkshopUses||0)+1;visit.used=true;G._deckWorkshopSelection=null;SFX.coin();renderTop();
  return {ok:true,cost};
}
function deckWorkshopRun(type,payload={}){const result=performDeckWorkshopOperation(type,payload);G._deckWorkshopMessage=result.ok?`改牌完成，支付 ${result.cost} 金幣。本次造訪不可再進行結構改牌。`:result.reason;renderDeckEdit();}
function openDeckEdit(source='shop'){
  if(!deckWorkshopAllowed())return false;const visit=ensureDeckWorkshopVisit(source);G._deckWorkshopSelection=null;G._deckWorkshopChoices=[randomCard(),randomCard(),randomCard()];G._deckWorkshopMessage='';renderDeckEdit();$('deckedit').classList.remove('hidden');return !visit.used;
}
function removeSelectedCard(){deckWorkshopRun('remove');}
function closeDeckEdit(){
  const source=G._deckWorkshopVisit?.source;$('deckedit').classList.add('hidden');
  if(source==='startup'){G.collectorStartupDone=true;G.nodeType=null;G.nodeStarted=false;enterCurrentNode();}
  else if(source==='fixedRest')openRestEvent();else if(source==='shop')renderShop();
}
function renderDeckEdit(){
  const visit=G._deckWorkshopVisit||ensureDeckWorkshopVisit('shop'),used=visit.used,source=visit.source,selected=G.deck[G._deckWorkshopSelection],materials=G.collectorMaterials||[],cost=type=>deckWorkshopPrice(type,source),disabled=used?' disabled':'';
  $('deckedit-close').textContent=source==='startup'?(used?'完成整備並出發':'跳過並維持標準牌庫'):'關閉 ✕';
  $('deckedit-info').textContent=`戰鬥牌庫 ${G.deck.length} 張｜本大關已完成 ${G.deckWorkshopUses||0} 次結構改牌（本次倍率 ×${deckWorkshopVisitMultiplier().toFixed(2)}）｜素材 ${materials.length}/${BALANCE.deckWorkshop.materialLimit}｜金幣 ${G.gold}🪙${G._deckWorkshopMessage?`｜${G._deckWorkshopMessage}`:''}`;
  const choices=(G._deckWorkshopChoices||[]).map((card,index)=>`<button class="b-buy" data-workshop-replace="${index}"${disabled}>${cardLabel(card)}${card.s}（${cost('replace')}🪙）</button>`).join('');
  const rankOptions=CARD_RANKS.map(rank=>`<option value="${rank}">${rank}</option>`).join(''),suitOptions=SUITS.map(suit=>`<option value="${suit}">${suit}${suitName(suit)}</option>`).join('');
  const materialButtons=materials.length?materials.map((card,index)=>`<span>${cardLabel(card)}${card.s} <button class="b-buy" data-material-add="${index}"${disabled}>加入 ${cost('add')}🪙</button> <button class="b-buy" data-material-replace="${index}"${disabled}>替換 ${cost('replace')}🪙</button></span>`).join(' '):'<span class="muted">沒有收藏素材。</span>';
  $('deckedit-actions').innerHTML=`<div class="btns"><button class="b-magic" data-workshop-shift="-1"${disabled}>降一階（${cost('shift')}🪙）</button><button class="b-magic" data-workshop-shift="1"${disabled}>升一階（${cost('shift')}🪙）</button></div><div class="muted" style="margin-top:8px">三選一替換：${choices}</div><details style="margin-top:10px"><summary>進階牌庫塑形</summary><div class="btns" style="margin-top:8px"><label>牌面 <select id="deckedit-rank">${rankOptions}</select></label><label>花色 <select id="deckedit-suit">${suitOptions}</select></label><button class="b-buy" id="deckedit-custom-add"${disabled}>加入（${cost('add')}🪙）</button><button class="b-buy" id="deckedit-remove"${disabled}>刪除（${cost('remove')}🪙）</button><button class="b-buy" id="deckedit-duplicate"${disabled}>複製（${cost('duplicate')}🪙）</button><button class="b-buy" id="deckedit-reforge"${disabled}>指定牌面重鑄（${cost('reforge')}🪙）</button></div><div style="margin-top:8px"><b>素材收藏：</b> ${materialButtons}</div></details>`;
  const order=G.deck.map((card,index)=>({card,index})).sort((a,b)=>cardPoints(a.card)-cardPoints(b.card)||suitOrder(a.card.s)-suitOrder(b.card.s));
  $('deckedit-deck').innerHTML=order.map(({card,index})=>`<div class="mini-card${card.red?' red':''}${G._deckWorkshopSelection===index?' sel':''}" data-workshop-card="${index}">${cardLabel(card)}${card.s}</div>`).join('');
  $('deckedit-add').innerHTML=selected?`<div class="muted">已選：${cardLabel(selected)}${selected.s}</div>`:'<div class="muted">尚未選牌；加入操作不需要先選牌。</div>';
  $('deckedit-deck').querySelectorAll('[data-workshop-card]').forEach(el=>el.onclick=()=>{G._deckWorkshopSelection=+el.dataset.workshopCard;renderDeckEdit();});
  $('deckedit-actions').querySelectorAll('[data-workshop-shift]').forEach(button=>button.onclick=()=>deckWorkshopRun('shift',{delta:+button.dataset.workshopShift}));
  $('deckedit-actions').querySelectorAll('[data-workshop-replace]').forEach(button=>button.onclick=()=>deckWorkshopRun('replace',{card:G._deckWorkshopChoices[+button.dataset.workshopReplace]}));
  $('deckedit-actions').querySelectorAll('[data-material-add]').forEach(button=>button.onclick=()=>deckWorkshopRun('materialAdd',{materialIndex:+button.dataset.materialAdd}));
  $('deckedit-actions').querySelectorAll('[data-material-replace]').forEach(button=>button.onclick=()=>deckWorkshopRun('materialReplace',{materialIndex:+button.dataset.materialReplace}));
  const readCard=()=>deckWorkshopCandidateCard($('deckedit-rank').value,$('deckedit-suit').value);
  $('deckedit-custom-add').onclick=()=>deckWorkshopRun('add',{card:readCard()});$('deckedit-remove').onclick=()=>deckWorkshopRun('remove');$('deckedit-duplicate').onclick=()=>deckWorkshopRun('duplicate');$('deckedit-reforge').onclick=()=>deckWorkshopRun('reforge',{rank:$('deckedit-rank').value});
}
//===== 花色重鑄 =====
function openSuitForge(){if(G.character!=='magician')return false;G._forgeSel=null;renderSuitForge();$('suitforge').classList.remove('hidden');return true;}
function closeSuitForge(){$('suitforge').classList.add('hidden');renderShop();}
function renderSuitForge(){
  const cost=suitForgePrice(),order=G.deck.map((c,i)=>({c,i})).sort((a,b)=>cardPoints(a.c)-cardPoints(b.c)||suitOrder(a.c.s)-suitOrder(b.c.s));
  $('suitforge-info').textContent=`魔術師專屬服務：選擇一張戰鬥牌後指定新花色｜本次 ${cost}🪙｜目前金幣 ${G.gold}🪙`;
  $('suitforge-deck').innerHTML=order.map(({c,i})=>`<div class="mini-card${c.red?' red':''}${G._forgeSel===i?' sel':''}" data-forge="${i}">${cardLabel(c)}${c.s}</div>`).join('');
  $('suitforge-deck').querySelectorAll('[data-forge]').forEach(el=>el.onclick=()=>{G._forgeSel=+el.dataset.forge;renderSuitForge();});
  renderSuitPicker('suitforge-picker',G._forgeSel!=null,s=>forgeSelectedSuit(s));
}
function performSuitForge(deckIndex,suit){
  if(G.character!=='magician')return {ok:false,reason:'只有魔術師可以使用永久花色重鑄'};
  const card=G.deck[deckIndex],cost=suitForgePrice();if(!card)return {ok:false,reason:'請先選擇一張牌'};
  if(card.s===suit)return {ok:false,reason:'這張牌已經是該花色'};
  const next=G.deck.map(cloneCard);next[deckIndex]={r:card.r,s:suit,red:suit==='♥'||suit==='♦'};const validation=validateCombatDeck(next);if(!validation.ok)return validation;
  if(G.gold<cost)return {ok:false,reason:`金幣不足，需要 ${cost} 金幣`};
  const old=card.s;G.gold-=cost;markLuckyDiscountPurchase(cost);G.deck=next;SFX.coin();renderTop();return {ok:true,cost,old,card:G.deck[deckIndex]};
}
function forgeSelectedSuit(suit){
  const result=performSuitForge(G._forgeSel,suit);if(!result.ok){$('suitforge-info').textContent=result.reason;return;}
  G._forgeSel=null;renderSuitForge();$('suitforge-info').textContent=`重鑄完成：${cardLabel(result.card)}${result.old} → ${cardLabel(result.card)}${suit}｜目前金幣 ${G.gold}🪙`;
}
function bindShop(){
  $('shop-items').querySelectorAll('button:not([data-sell]):not([data-enchant-service])').forEach(btn=>{
    btn.onclick=()=>{
      const shopAffix=btn.dataset.buy&&G._shopAffixes&&G._shopAffixes[btn.dataset.buy];
      const purchaseType=btn.dataset.buy?'passive':btn.dataset.consumable?'consumable':btn.dataset.heal?'heal':btn.dataset.control?'control':btn.dataset.maxhp?'maxhp':btn.dataset.rankboost?'rankboost':btn.dataset.rankflat?'rankflat':btn.dataset.suitboost?'suitboost':btn.dataset.suitflat?'suitflat':null;
      const purchaseId=btn.dataset.buy||btn.dataset.consumable||btn.dataset.rankboost||btn.dataset.rankflat||btn.dataset.suitboost||btn.dataset.suitflat||'';
      if(purchaseType&&shopPurchaseDone(purchaseType,purchaseId))return;
      if(btn.dataset.buy&&passiveInventoryFull(passiveSlotCost(btn.dataset.buy,shopAffix))){btn.textContent='裝備欄空位不足';return;}
      if(btn.dataset.buy&&passiveConflictsWithOwned(btn.dataset.buy)){btn.textContent='與持有被動互斥';btn.disabled=true;return;}
      const cost=+btn.dataset.cost;
      if(G.gold<cost){const old=btn.textContent;btn.textContent='金幣不足';setTimeout(()=>btn.textContent=old,900);return;}
      G.gold-=cost;markLuckyDiscountPurchase(cost);SFX.coin();
      if(btn.dataset.buy){G.passives.push(btn.dataset.buy);G.passivePaid[btn.dataset.buy]=cost;G.passiveAffixes=G.passiveAffixes||{};if(shopAffix)G.passiveAffixes[btn.dataset.buy]=shopAffix;}
      else if(btn.dataset.consumable)addConsumable(btn.dataset.consumable);
      else if(btn.dataset.heal)healPlayer(40);
      else if(btn.dataset.control)restoreControl(BALANCE.controlShopRestore);
      else if(btn.dataset.maxhp){G.maxhp+=playerMaxHpGain(20);healPlayer(20);G.maxHpPurchases=(G.maxHpPurchases||0)+1;}
      else if(btn.dataset.rankboost){const rank=btn.dataset.rankboost;G.rankDamage[rank]=rankDamagePercent(rank)+1;}
      else if(btn.dataset.rankflat){const rank=btn.dataset.rankflat;G.rankFlatDamage[rank]=rankFlatBonus(rank)+2;}
      else if(btn.dataset.suitboost){const suit=btn.dataset.suitboost;G.suitDamage[suit]=suitDamagePercent(suit)+1;}
      else if(btn.dataset.suitflat){const suit=btn.dataset.suitflat;G.suitFlatDamage[suit]=suitFlatBonus(suit)+2;}
      if(purchaseType)markShopPurchase(purchaseType,purchaseId);
      renderShop();renderTop();
    };
  });
  const enchantButton=$('shop-items').querySelector('[data-enchant-service]');if(enchantButton)enchantButton.onclick=()=>openSuitEnchantFlow('shop',+enchantButton.dataset.cost);
  $('shop-items').querySelectorAll('button[data-sell]').forEach(btn=>btn.onclick=()=>sellPassive(btn.dataset.sell));
}
function sellPassive(id){
  if(hostileSealProtected(id)||passiveAffixId(id)==='locked'||!ownsP(id))return;
  const value=passiveSellValue(id),p=ALL_PASSIVES.find(item=>item.id===id),displayName=passiveNameWithAffix(id),lostBlade=removeBladeForPassive(id),bladeName=bladeDef(id)?.name;
  G.passives=G.passives.filter(item=>item!==id);G.upgrades=G.upgrades.filter(item=>item!==id&&(id!=='doublebet'||item!=='doublebet2'));
  if(id==='suitmage')G.suitMastery=null;
  if(id==='luckycoin'){G.fortune=0;G.shopFortuneVisit=null;}
  if(G.sealedPassive===id)G.sealedPassive=null;
  else restoreArchivedIfFits('出售裝備後被動欄已有空位');
  delete G.passivePaid[id];delete G.passiveAffixes[id];gainGold(value);SFX.coin();renderShop();renderTop();
  setSaveStatus(`已出售${p?displayName:id}，獲得 ${value} 金幣${lostBlade?`；${bladeName||'對應刀具'}也隨之消失${hasActiveBlade()?'':'，目前徒手攻擊固定為 1 傷害'}`:''}。`);
}
function leaveShop(){settleShopFortune();completeEvent();}

//===== 百科 =====
function openCodex(){renderCodex();setCodexTab('passives');$('codex').classList.remove('hidden');}
function closeCodex(){$('codex').classList.add('hidden');}
function openRankDamage(){
  $('rank-damage-list').innerHTML=CARD_RANKS.map(rank=>`<div class="rank-damage-card"><div class="rank">${rank}</div><div class="mult">${rankDamagePercent(rank)}%</div><div class="muted">固定 +${rankFlatBonus(rank)}</div></div>`).join('')+(ownsP('suitmage')?SUITS.map(suit=>{const enchant=G.suitEnchantments&&consumableInfo(G.suitEnchantments[suit]);return `<div class="rank-damage-card"><div class="rank">${suit}</div><div class="mult">${suitDamagePercent(suit)}%</div><div class="muted">固定 +${suitFlatBonus(suit)}${enchant?`<br>${enchant.icon}${enchant.name}`:''}</div></div>`;}).join(''):'');
  $('rank-damage').classList.remove('hidden');
}
function closeRankDamage(){$('rank-damage').classList.add('hidden');}
function immovableBladeRows(up){
  const b=G.battle,zanshin=playerZanshinProfile(),flow=Math.max(0,b?.samuraiFlow||0),turns=zanshin?.turns||0,resonance=immovableBladeActive()&&zanshin?turns+(flow>=50?2:0):0,ultimateMult=zanshin?immovableUltimateMultiplier(zanshin):null;
  const unmet=[];if(!immovableBladeActive())unmet.push('不動太刀未裝備');if(!up)unmet.push('壁壘未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(!zanshin)unmet.push('沒有殘心');if(b&&handTotal(b.hand||[])>21)unmet.push('已爆牌');
  return [
    ['類型','太刀'],
    ['刀具定位','不動太刀以殘心剩餘時間強化居合與心流收益。架勢可以暫緩一次殘心衰減；高心流時，20 點見切也能維持強殘心。必殺可將尚未消散的殘心一次轉化為斬擊。'],
    ['殘心居合',`倍率為 ×1.10 ＋ 殘心剩餘回合 ×0.05；目前 ${turns} 回合，倍率 ×${immovableIaidoMultiplier(zanshin).toFixed(2)}。殘心自身攻擊倍率另行套用。`],
    ['心流共鳴',`持有殘心且成功造成攻擊傷害時，每次攻擊取得剩餘回合數的心流；目前預計 +${resonance}。多段只觸發一次，爆牌保險與必殺不觸發。`],
    ['心流 25・守心',!zanshin?'目前沒有殘心。':b?.samuraiZanshinGuardUsed?'本段殘心：已使用。':flow>=25?'本段殘心：可用；以架勢實際降低至少 1 點攻擊傷害時，跳過該回合自然衰減。':`本段尚未使用；心流 ${flow}/25。`],
    ['心流 50・長念',`${flow>=50?'已生效':'未達條件'}；心流共鳴改為「剩餘回合 +2」。`],
    ['心流 75・不墜',`${flow>=75?'心流條件已滿足':'心流條件未滿足'}${zanshin?.strong?'，目前持有強殘心':'，目前沒有強殘心'}；符合時以 20 點見切實際擋傷可刷新強殘心。`],
    ['必殺・一念不動',`${up?'倍率為 ×1.50 ＋ 殘心剩餘回合 ×0.10；無視 50% 護盾，結束後清除殘心、心流歸零並收刀。':'強化「壁壘」後解鎖。'}目前預計倍率：${ultimateMult?`×${ultimateMult.toFixed(2)}`:'無殘心'}；${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function moonBladeRows(up){
  const b=G.battle,flow=Math.max(0,b?.samuraiFlow||0),ready=!!b?.samuraiMoonCounter,active=moonBladeActive(),iaido=b?.samuraiWeaponState==='sheathed';
  const remaining=up?'無限':`${Math.max(0,BALANCE.bucklerUses-(b?.bucklerUses||0))}/${BALANCE.bucklerUses}${b?.bucklerBroken?'（已損毀）':''}`,bucklerFlow=up?(flow>=25&&active?8:5):(flow>=25&&active?6:4);
  const counterMult=!ready?'尚未就緒':iaido?(flow>=50?'輪返居合 ×1.35':`普通居合 ×1.15，再乘盾返 ×1.15`):`盾返斬擊 ×${flow>=50?'1.25':'1.15'}`;
  const unmet=[];if(!active)unmet.push('月輪脇差未裝備');if(!up)unmet.push('圓盾未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(!ready)unmet.push('盾返未就緒');if(b&&handTotal(b.hand||[])>21)unmet.push('已爆牌');
  return [
    ['類型','脇差'],
    ['刀具定位','月輪脇差以圓盾成功擋傷後形成盾返，強化下一次攻擊。高心流時可提高圓盾的心流轉換，並以反擊修復有限耐久；強化圓盾則能持續形成盾返並穿透護盾。'],
    ['圓盾耐久',remaining],
    ['盾返',`${ready?'就緒':'未就緒'}；下一次以月輪脇差實際造成攻擊傷害時消耗。一般盾返 ×1.15，心流 50 時斬擊提高為 ×1.25。`],
    ['普通居合','×1.15。心流不足 50 的盾返居合會另乘盾返 ×1.15；心流 50 以上改為單一 ×1.35。'],
    ['心流 25・圓流',`${active&&flow>=25?'已生效':'未生效'}；圓盾本次預計提供 ${bucklerFlow} 心流（${up?'10':'8'} 點防禦等價按 ${active&&flow>=25?'75':'50'}% 換算）。`],
    ['下一次盾返',counterMult],
    ['心流 75・缺月復圓',up?`${active&&flow>=75&&ready?'已符合':'尚未符合'}；盾返居合無視 40% 護盾，普通盾返斬擊不穿透。`:`${active&&flow>=75&&ready&&(b?.bucklerUses||0)>0?'可修復 1 次耐久':'目前不可修復'}；成功的盾返攻擊每次最多恢復 1 次，且不超過 4 次上限。`],
    ['必殺・滿月返照',`${up?'最終傷害 ×2、無視 50% 護盾；不疊加居合、盾返、輪返或耐久修復，結束後盾返清除、心流歸零並收刀。':'強化「圓盾」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function mirrorBladeRows(up){
  const b=G.battle,flow=Math.max(0,b?.samuraiFlow||0),active=mirrorBladeActive(),statuses=playerPurifiableStatuses(),statusText=statuses.length?statuses.map(status=>`${status.name} ${playerPurifiableStatusValue(status.key)}`).join('、'):'無',ultimateMult=1.75+Math.min(6,statuses.length)*.10;
  const unmet=[];if(!active)unmet.push('明鏡打刀未裝備');if(!up)unmet.push('淨化未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(b&&handTotal(b.hand||[])>21)unmet.push('已爆牌');
  return [
    ['類型','打刀'],
    ['刀具定位','明鏡打刀以淨化抗性返還敵方狀態，並以居合逐步清理自身；不會驅散敵方護盾、閃避、骨甲、殘心或任何專屬資源。'],
    ['目前可淨化狀態',statusText],
    ['基礎・返照',`明鏡打刀使用中，淨化抗性實際抵銷中毒、猛毒、燒傷、流血、創傷或虛弱時，向有效施加者反射；反射套用敵方抗性，並按敵人實得層數轉為心流。每個敵方回合最多 10 心流；目前已取得 ${b?.samuraiMirrorFlowThisEnemyTurn||0}/10。`],
    ['普通居合','×1.15。'],
    ['心流 25・祓斬',`${active&&flow>=25?'已生效':'未達條件'}；居合實際造成傷害後，每種可淨化狀態移除 1 層／回合，每種 +2 心流，每次最多 10。`],
    ['心流 50・無垢',`${active&&flow>=50&&!statuses.length?'已生效':'未生效'}；提交攻擊時沒有任何可淨化狀態，斬擊 ×1.15；居合改用單一 ×1.30並無視 30% 護盾。`],
    ['心流 75・破邪',`${active&&flow>=75?'已生效':'未達條件'}；祓斬每種移除 2 層／回合，仍只按狀態種類取得心流；可反射狀態的實際移除量會施加給攻擊目標，但不提供返照心流。`],
    ['必殺・明鏡止水',`${up?`依發動前狀態種類為 ×1.75 至 ×2.35；目前 ${statuses.length} 種，預計 ×${ultimateMult.toFixed(2)}。無視 50% 護盾，攻擊後無論傷害都清除全部可淨化狀態；可反射狀態每種最多反射 10 層。`:'強化「淨化」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function heartBladeRows(up){
  const b=G.battle,flow=Math.max(0,b?.samuraiFlow||0),active=heartBladeActive(),hand=b?.hand||[],total=handTotal(hand),equipment=samuraiDefenseFlowBonus(hand,false),stance=samuraiGuardFlowReward('stance',equipment,0,total,flow),mikiri=samuraiGuardFlowReward('mikiri',equipment,0,total,flow),unmet=[];
  if(!active)unmet.push('鏡心打刀未裝備');if(!up)unmet.push('護心鏡未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(total<17||total>21)unmet.push(`手牌 ${total} 點（需要17～21）`);
  return [
    ['類型','打刀'],
    ['刀具定位','鏡心打刀把護心鏡提供的防禦等價完整轉為心流。高心流時，低點數防守維持最低收益；完全防住攻勢或以 20／21 點防守可取得額外心流。操作穩定，但單次收益低於天機脇差的精準應驗。'],
    ['護心鏡防禦等價',`${up?'手牌點數 50%':'手牌點數 30%'}；目前實際增加 ${equipment.heartguardEquivalent} 點防禦等價。護心鏡不直接提高架勢或見切的百分比減傷。`],
    ['基礎・心鏡流轉',`${active?'目前使用中':'目前未使用'}；實際擋傷後，護心鏡部分按 100% 轉換，其他防禦來源仍按原比例。本手護心鏡預計 +${equipment.heartguardFlow} 心流。`],
    ['普通居合','×1.15。'],
    ['防禦心流預覽',`架勢預計最多 +${stance.total}/15；見切的裝備與澄心部分預計 +${mikiri.total}/35，見切招式心流會依實際敵方攻勢另行加入。沒有敵方攻擊或未實際擋傷時均為 0。`],
    ['心流 25・定心',`${active&&flow>=25?'已生效':'未達條件'}；心鏡流轉成功時，護心鏡部分最低 4 心流${equipment.heartguardMinimumApplied?'（本次已套用）':''}。`],
    ['心流 50・無傷',`${active&&flow>=50?'已符合心流條件':'未達心流條件'}；有敵方有效攻擊、架勢或見切實際擋傷，且所有敵方攻擊最終未損失 HP 時，再 +3 心流。`],
    ['心流 75・澄心',`${active&&flow>=75&&(total===20||total===21)?'本手已符合，預計額外 +4':'尚未符合'}；提交時已有 75 心流並以 20／21 點架勢或見切實際擋傷時成立。`],
    ['必殺・護心一文字',`${up?'最終傷害 ×1.75、無視 50% 護盾，不疊加普通居合；結算後心流歸零並收刀。':'強化「護心鏡」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function myriadBladeRows(up){
  const b=G.battle,flow=Math.max(0,b?.samuraiFlow||0),active=myriadBladeActive(),statuses=playerPhaseStatuses(),names=statuses.length?statuses.map(status=>`${status.name} ${playerPhaseStatusValue(status.key)}`).join('、'):'無',phaseMult=myriadPhaseMultiplier(flow),iaido=b?.samuraiWeaponState==='sheathed',affinity=myriadAffinityAmount(b?.samuraiAffinityStatus,flow,iaido);
  const increasable=statuses.filter(status=>playerPhaseStatusValue(status.key)<phaseStatusCap(status.key)),sheathFlow=Math.min(12,increasable.length*2),shared=active&&flow>=75&&iaido&&statuses.length>=4,ultimateMult=myriadUltimateMultiplier(),unmet=[];
  if(!active)unmet.push('萬象妖刀未裝備');if(!up)unmet.push('來源被動未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(statuses.length<3)unmet.push(`可增相狀態 ${statuses.length}/3`);if(b&&handTotal(b.hand||[])>21)unmet.push('已爆牌');
  const selectedName=PURIFIABLE_STATUS_DEFS.find(status=>status.key===affinity.key)?.name;
  return [
    ['類型','妖刀'],
    ['刀具定位','萬象妖刀把自身既有的有利與有害數值狀態化為傷害、心流與傳染能力；不會增加技能封鎖、戒律烙印、殘心、心流、防禦、護盾、蓄勢、契約或神蹟。'],
    ['目前可增相狀態',`${statuses.length} 種：${names}`],
    ['基礎・異相',`每種狀態使最終傷害 +5%；目前 ×${phaseMult.toFixed(2)}。基礎最多 6 種，心流 25・百相提高為 8 種；普通居合 ×1.15 另行套用。`],
    ['主動收刀・增相',`${increasable.length?`預計增加：${increasable.map(status=>status.name).join('、')}`:'目前沒有可增加狀態'}；預計取得 ${sheathFlow} 心流。只增加已存在且未達上限的數值，不再次套用來源被動倍率；必殺收刀不觸發。`],
    ['心流 50・同病',`${selectedName&&affinity.stacks?`目前選擇 ${selectedName} ${affinity.stacks} 層，預計施加 ${affinity.raw} 層`:'目前未選擇可反射狀態'}；實際造成傷害後複製 50%，向上取整且最多 5 層，目標抗性照常生效。`],
    ['心流 75・共相',`${shared?'門檻已滿足':'尚未滿足'}；至少 4 種狀態的居合改為複製 100%、最多 10 層，並無視 40% 護盾；沒有同病選擇時仍可穿透護盾。`],
    ['必殺・萬象歸一',`${up?`依目前 ${statuses.length} 種狀態，預計倍率 ×${ultimateMult.toFixed(2)}；無視 50% 護盾，將全部可反射狀態各複製 50%、最多 5 層，自身不減少且不再觸發同病／共相。`:'強化「我們是怎麼走到這一步的」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function poisonBladeRows(up){
  const b=G.battle,flow=Math.max(0,b?.samuraiFlow||0),active=poisonBladeActive(),target=b?currentTarget():null,poison=Math.max(0,target?.poison||0),virulence=Math.max(0,target?.virulence||0),normal=poisonDrawSnapshot(target,flow,false),ultimate=poisonDrawSnapshot(target,flow,true),rawPoison=toxicologyPoison(b?.hand||[]),actualPoison=target&&rawPoison?resistedStatusAmount(target,rawPoison):0,temper=poisonTemperFlowGain(actualPoison,flow),unmet=[];
  if(!active)unmet.push('蠱毒脇差未裝備');if(!up)unmet.push('毒物學未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(poison<1)unmet.push('目標沒有中毒');if(b&&handTotal(b.hand||[])>21)unmet.push('已爆牌');
  return [
    ['類型','脇差'],
    ['刀具定位','蠱毒脇差把毒物學實際施加的中毒轉為心流，或以居合及必殺消耗攻擊前既有中毒，提前結算狀態傷害。'],
    ['目前目標',target?`${target.name}｜中毒 ${poison} 層｜猛毒 ${virulence} 層｜創傷 ${target.trauma||0} 層`:'目前沒有有效目標'],
    ['基礎・淬毒',`本次毒物學預計實際施加 ${actualPoison} 層中毒，預計取得 ${temper} 心流。基礎按實得中毒 ×0.5、每次最多 5；不計消耗品、附魔、反射、爆牌保險或必殺。`],
    ['普通居合','×1.15。納刀且目標至少有 1 層中毒時，可免費切換為毒拔居合。'],
    ['毒拔居合',poison?`目前預計以 ${normal.base} 層計算，移除 ${normal.remove} 層；正常中毒發作 ${normal.tick} ×${normal.multiplier.toFixed(1)}＝額外 ${normal.damage} HP 傷害。直接攻擊必須傷及原目標 HP 才會引爆，本次新施毒保留。`:'目標需要至少 1 層既有中毒。'],
    ['心流 25・毒脈',`${active&&flow>=25?'已生效':'未達條件'}；淬毒改按實得中毒 1：1 取得心流，每次最多 10。`],
    ['心流 50・蝕心',`${active&&flow>=50?'已生效':'未達條件'}；毒拔上限提高為 15 層，按正常中毒傷害 ×2.5 引爆。`],
    ['心流 75・留毒',`${active&&flow>=75?'已生效':'未達條件'}；按完整 ${normal.base} 層計算傷害，實際只移除 ${normal.remove} 層，預計保留至少 ${Math.max(0,poison-normal.remove)} 層既有中毒；直接攻擊無視 40% 護盾。`],
    ['必殺・百毒穿心',`${up?`目前引爆基數 ${ultimate.base}/30，正常中毒發作 ${ultimate.tick} ×3＝${ultimate.damage} HP；移除 ${ultimate.remove} 層，超過 30 層及本次新施毒保留。直接攻擊 ×1.75、無視 50% 護盾，即使未傷及 HP 仍可引爆。`:'強化「毒物學」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function dragonBladeRows(up){
  const b=G.battle,active=dragonBladeActive(),flow=Math.max(0,b?.samuraiFlow||0),hand=b?.hand||[],count=hand.length,total=handTotal(hand),five=count>=5&&total<=21&&hasP('dragonneck'),heal=five?dragonFiveHealPreview(total):null,unmet=[];
  if(!active)unmet.push('五龍大太刀未裝備');if(!up)unmet.push('龍頭項鍊未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(count<5)unmet.push(`手牌 ${count}/5 張`);if(total>21||b?.pendingBust)unmet.push('已爆牌');
  return [
    ['類型','太刀'],
    ['刀具定位','五龍大太刀以三至五張手牌逐步提高居合與心流收益；五張不爆時結合龍頭項鍊的追加傷害、治療與戰術性收刀。'],
    ['普通居合','提交時 2／3／4／5 張以上分別為 ×1.10／×1.15／×1.20／×1.30；爆牌不成立，必殺不疊加。'],
    ['目前手牌',`${count} 張、${total} 點；${b?.samuraiWeaponState==='sheathed'?`普通居合預計 ×${dragonIaidoMultiplier(count).toFixed(2)}`:'目前為出鞘狀態'}。`],
    ['基礎・龍行','普通斬擊或居合實際傷及 HP 時，3／4／5 張以上取得 2／4／6 心流；五龍確實成立再 +4，每次最多 10。消耗品、狀態、反射、保險與必殺均不觸發。'],
    ['本次龍行',count>=3&&total<=21?`主要攻擊傷及 HP 後預計 +${dragonWalkGain(count,five,1,false)} 心流。`:'目前牌數不足或已爆牌。'],
    ['心流 25・龍息',`${active&&flow>=25?'心流條件已滿足':'心流條件未滿足'}；五龍實際治療後，每真正回復 10 HP 取得 1 心流，最多 8。${heal?`目前預計治療 ${heal.healed} HP、取得 ${heal.flow} 心流。`:''}`],
    ['心流 50・龍威',`${active&&flow>=50&&count>=5&&total<=21?'目前已生效':'目前未生效'}；五張以上普通攻擊的整體主要傷害無視 40% 護盾，狀態傷害不受影響。`],
    ['心流 75・乘龍歸鞘',`${active&&flow>=75&&count>=5&&total<=21?'目前可選擇':'目前未達條件'}；五龍確實結算後才免費納刀，不觸發主動收刀刀技。納刀後不能使用架勢或見切，必須再次居合拔刀。`],
    ['必殺・五龍吞天',`${up?'最終傷害 ×2.10、無視 60% 護盾；龍頭項鍊的追加傷害與治療各結算一次，不觸發龍行、龍息或龍威，之後心流歸零並收刀。':'強化「龍頭項鍊」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`]
  ];
}
function fortuneBladeRows(up){
  const b=G.battle,active=fortuneBladeActive(),flow=Math.max(0,b?.samuraiFlow||0),total=handTotal(b?.hand||[]),iaido=b?.samuraiWeaponState==='sheathed',profile=fortuneAttackProfile(total,flow,iaido,false),spend=Math.min(5,Math.max(0,G.fortune||0)),heal=fortuneUltimateHealPreview(spend),unmet=[];
  if(!active)unmet.push('招福脇差未裝備');if(!up)unmet.push('幸運金幣未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(spend<3)unmet.push(`福緣 ${spend}/3`);if(total<17||total>21)unmet.push(`手牌 ${total} 點（需要17～21）`);if(b?.pendingBust)unmet.push('已爆牌');
  return [
    ['類型','脇差'],
    ['刀具定位','招福脇差把商店累積的好運帶入戰鬥，以跨戰鬥保留、最多 5 層的福緣換取穩定心流；不新增隨機擲硬幣。'],
    ['福緣',`${G.fortune||0}/5；持刀後，入店之福在治療實際回復 HP 時 +1，消費之福在完成受幸運金幣折扣的付費交易並離店時再 +1。每次商店最多 2 層，跨戰鬥與換刀保留。`],
    ['普通居合','固定 ×1.15；必殺不疊加。'],
    ['基礎・開運',`持有福緣的普通斬擊或居合預備 1 層；實際傷及 HP 才消耗並取得 6 心流。${profile.prepared?`本次命中預計 +${profile.flowGain}。`:'本次未預備。'}`],
    ['心流 25・小吉',`${active&&flow>=25&&total>=17&&total<=21?'目前符合':'目前未符合'}；17～21 點命中時，開運提高為 9 心流。`],
    ['心流 50・福斬',`${active&&profile.prepared&&flow>=50?`目前${iaido?'居合使用單一 ×1.25':'斬擊 ×1.10'}`:'目前未生效'}；居合不重複乘普通居合。未傷及 HP 時不消耗福緣。`],
    ['心流 75・大吉',`${profile.great?'目前已符合：21 點成功命中取得 9 心流但不消耗福緣':'需要提交時已有 75 心流、21 點及至少 1 層福緣'}。`],
    ['必殺・一擲萬福',`${up?`消耗目前最多 5 層福緣；3／4／5 層時最終 ×1.90／×2.00／×2.10、無視 50% 護盾，並以 30／40／50 HP 為基礎治療。現在預計消耗 ${spend} 層、×${(1.6+spend*.1).toFixed(2)}、基礎治療 ${heal.raw}。施放後心流歸零並收刀。`:'強化「幸運金幣」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`],
    ['出售連動','出售幸運金幣時同步失去招福脇差，並清除全部福緣。']
  ];
}
function rubyBladeRows(up){
  const b=G.battle,active=rubyBladeActive(),flow=Math.max(0,b?.samuraiFlow||0),total=handTotal(b?.hand||[]),hp=Math.max(0,Math.floor(G.hp)),iaido=b?.samuraiWeaponState==='sheathed',profile=rubyBladeAttackProfile(total,flow,hp,iaido,false),ultimate=rubyBladeAttackProfile(total,flow,hp,iaido,true),unmet=[];
  if(!active)unmet.push('緋晶打刀未裝備');if(!up)unmet.push('紅寶石戒指未強化');if(flow<100)unmet.push(`心流 ${flow}/100`);if(total<17||total>21)unmet.push(`手牌 ${total} 點（需要17～21）`);if(b?.pendingBust)unmet.push('已爆牌');
  return [
    ['類型','打刀'],
    ['刀具定位','緋晶打刀依提交攻擊時的目前 HP「實際數值」追加倍率後固定傷害，不使用生命比例，也沒有傷害上限；固定傷害不再被居合、殘心、花色或其他攻擊倍率放大。'],
    ['目前快照預覽',`目前 HP ${hp}；普通攻擊預計使用「${profile.label}」追加 ${profile.fixed} 固定傷害${profile.bloodReflection?`，成功傷及 HP 後血映 +${profile.bloodReflection} 心流`:''}${profile.shieldPierce?`，護盾穿透 ${Math.round(profile.shieldPierce*100)}%`:''}。`],
    ['普通居合','×1.15；紅光固定傷害在倍率完成後加入，不再被居合放大。'],
    ['基礎・紅光','非必殺斬擊或居合追加 floor（提交 HP ×5%）固定傷害；屬同一次主要攻擊，多段只加入一次。'],
    ['心流 25・血映','非必殺攻擊實際傷及 HP 後，取得 min（6，max（1，floor（提交 HP ÷25）））心流；完全被擋時不取得。'],
    ['心流 50・盛華','固定傷害提高為 floor（提交 HP ×10%），取代紅光而不疊加。'],
    ['心流 75・無瑕','20／21 點時固定傷害提高為 floor（提交 HP ×15%），取代紅光與盛華，整體主要攻擊無視 30% 護盾。'],
    ['必殺・緋晶一閃',`${up?`正常攻擊 ×1.75 後追加 floor（提交 HP ×50%）固定傷害，整體無視 50% 護盾；現在預計追加 ${ultimate.fixed}。成功施放後以 15 HP 為基礎治療，心流歸零並收刀；不疊加普通居合、紅光、盛華、無瑕或血映。`:'強化「紅寶石戒指」後解鎖。'}${unmet.length?`未滿足：${unmet.join('、')}`:'目前可發動'}。`],
    ['來源效果','鍛造後仍保留紅寶石戒指每清除一層回復 8／15 HP 的原有效果、強化與詞條；出售來源時同步失去本刀。']
  ];
}
function bladeForgeRows(blade){
  const source=ALL_PASSIVES.find(p=>p.id===blade.sourceId),up=isUp(blade.sourceId);let rows=[['來源被動',source?`${source.icon} ${source.name}${up?' ⭐':''}`:blade.sourceId]];
  if(blade.id==='firststrike')rows.push(['先發制人',up?'第 1 回合以不超過 3 張、19～21 點攻擊時 +30 傷害':'第 1 回合以恰好 2 張、20 點攻擊時 +20 傷害'],['居合倍率',`${up?'×1.50':'×1.35'}；心流達 50 再 +0.15`],['心流 75・澄明居合','額外增加手牌點數 ×0.5 傷害。'],['心流 100・極意','符合牌型的居合可再次觸發先發制人。'],['必殺・無想一閃',up?'納刀、100 心流、不超過 3 張且 19～21 點時可選用；最終 ×1.75、無視 50% 護盾，施放後心流歸零並收刀。':'強化來源被動後解鎖。'],['心流累積','斬擊 +4、居合 +7；20 點再 +2、21 點再 +4，居合觸發先發制人再 +5。']);
  else if(blade.id==='safe21')rows.push(['守線','手牌第一次到達 17 點以上便記錄安全線；立即攻擊時最終 ×1.15、獲得 6 心流，並使本回合承受的攻擊傷害 −25%。'],['完美守線','第一次到達安全線便是 21 點時，改為最終 ×1.50、獲得 12 心流，並保留守線減傷。'],['越線','到達安全線後繼續抽牌並成功攻擊：每多抽 1 張最終倍率 +0.20、心流 +8，最多計算 2 張；不獲得守線減傷。'],['普通居合','×1.15。'],['心流 25','守線與完美守線的承傷減免提高至 30%。'],['心流 50','越線每張的倍率加成提高至 +0.25。'],['心流 75','19～21 點守線無視 40% 護盾。'],['必殺・界線斷決',up?'100 心流且 17～21 點時可選用；不受持刀或納刀限制，最終 ×1.75、無視 50% 護盾，本回合承傷 −40%。施放後心流歸零並收刀。':'強化來源被動後解鎖。']);
  else if(blade.id==='court')rows.push(['朝儀','成功攻擊依序完成 J → Q → K；未抽到目標不重設，每次行動最多推進一次。完成 K 獲得 1 枚三公印，最多 3 枚。'],['朝儀心流','每次推進 +6；目前心流達 25 時改為 +8。'],['居合倍率','基礎 ×1.20；每枚三公印 +0.15，居合後消耗全部三公印。'],['心流 50','居合手牌每種 J／Q／K 再 +0.05 倍，最多 +0.15。'],['心流 75','持有 3 枚三公印居合時無視 50% 護盾。'],['心流 100・滿朝不散','普通居合消耗 3 枚三公印後返還 1 枚；必殺不返還。'],['必殺・三公會審',up?'100 心流、3 枚三公印且未爆牌時可選用；不受持刀或納刀限制，發動 3 段各 70% 裁決，施放後心流與印記歸零並收刀。':'強化來源被動後解鎖。']);
  else if(blade.id==='insurance')rows.push(['逆拔',`納刀爆牌時以${up?'前 3 張':'前 2 張'}觸發保險攻擊並 ×1.40；命中獲得 10 心流。爆牌與豪賭代價照常結算。`],['心流 25・破綻計價','逆拔增加「爆牌點數 −21」傷害，最多 +10。'],['心流 50・加倍理賠','逆拔倍率提高為 ×1.60。'],['心流 75・拒絕免責','逆拔無視 50% 護盾。'],['心流 100・續保','普通逆拔後直接回到納刀狀態，且不消耗心流。'],['必殺・一命勘定',up?'100 心流且已爆牌時可選用；不受持刀或納刀限制，逆拔最終再 ×2 並完全無視護盾，施放後心流歸零並收刀。':'強化來源被動後解鎖。'],['普通居合','×1.20；一般斬擊與居合不提供心流。']);
  else if(blade.id==='peek')rows.push(['裁牌','每副手牌首次透視後可選一張預覽牌：引牌使其成為下一張；斬離使其移至本場牌堆底部。再次透視只能查看。'],['引牌・應驗','抽到引牌後立刻成功攻擊：2～16／17～18／19／20／21 點分別獲得 5／10／15／20／25 心流。繼續抽牌、改動手牌、防禦、爆牌或換刀都會失敗。'],['斬離・避凶','若斬離的是原本即將抽到且會導致爆牌的牌，而下一張安全牌為 2～18／19／20／21 點，分別獲得 8／12／16／20 心流。'],['居合倍率','×1.15。'],['心流 50・看破','引牌以 19～21 點應驗時無視 50% 護盾。'],['心流 100・先知','應驗攻擊結束後消耗 25 心流並自動收刀，方便下一副手牌更換刀具。'],['必殺・斬斷因果',up?'100 心流且本手使用過透視時可選用；交換一張手牌與一張預覽牌後立即攻擊，最終 ×1.35、無視 50% 護盾。可挽救爆牌，不限持刀或納刀；結束後心流歸零並收刀。':'強化來源被動後解鎖。']);
  else if(blade.id==='vampire')rows.push(['血博','斬擊前可支付最大生命的 5%／10%／15% 作為血籌；實際吸回血籌至少一半，分別按回收比例獲得最多 8／16／25 心流。'],['加注','下注時依心流 25／50／75，鎖定本次最多可加注 1／2／3 次。每次消耗 25 心流與 5% 最大生命，使本次傷害 +30%、吸血效率 +20%。'],['連莊','15% 血籌或曾加注的血籌若全數吸回，獲得 1 層；最多 3 層，每層使後續有下注的攻擊 ×1.10。未全數吸回、未續注攻擊、防禦、爆牌、收刀、換刀或改動手牌時歸零。'],['普通居合','×1.15；一般血博斬擊不會自動收刀。'],['必殺・血本無歸',up?'100 心流、未下注且未爆牌時可選用；支付 30% 最大生命，最終傷害 ×2.25、吸血效率 ×2、無視 50% 護盾。完全吸回血籌時連莊直接升至 3 層；若未造成傷害，再失去 15% 最大生命。施放後心流歸零並收刀。':'強化來源被動後解鎖。']);
  else if(blade.id==='bulwark')rows.push(...immovableBladeRows(up));
  else if(blade.id==='buckler')rows.push(...moonBladeRows(up));
  else if(blade.id==='antidote')rows.push(...mirrorBladeRows(up));
  else if(blade.id==='heartguard')rows.push(...heartBladeRows(up));
  else if(blade.id==='howdidwegethere')rows.push(...myriadBladeRows(up));
  else if(blade.id==='toxicology')rows.push(...poisonBladeRows(up));
  else if(blade.id==='dragonneck')rows.push(...dragonBladeRows(up));
  else if(blade.id==='luckycoin')rows.push(...fortuneBladeRows(up));
  else if(blade.id==='rubyring')rows.push(...rubyBladeRows(up));
  rows.push(['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
  return rows;
}
function bladeForgeCard(blade){
  const source=ALL_PASSIVES.find(p=>p.id===blade.sourceId),rows=bladeForgeRows(blade),preferred=G.preferredBlade===blade.id;
  return `<section class="codex-card blade-card${preferred?' active':''}"><div class="cn">${blade.icon} ${blade.name}${preferred?'（優先）':''}</div><div class="blade-source">由「${source?source.name:blade.sourceId}」轉化</div><div class="blade-data">${rows.map(([name,value])=>`<b>${name}</b><span>${value}</span>`).join('')}</div></section>`;
}
function setPreferredBlade(id){
  if(G.battle&&!G.battle.over){setSaveStatus('戰鬥中只能更換目前使用刀；優先刀必須在戰鬥外修改。',true);return;}
  if(!(G.blades||[]).includes(id)||!bladeDef(id))return;G.preferredBlade=id;setSaveStatus(`已將${bladeDef(id).name}標記為優先刀；下場戰鬥會預設選擇。`);renderBladeViewer();if(!$('blade-forge').classList.contains('hidden'))renderBladeForge();renderTop();
}
function forgeBlade(id){
  const blade=bladeDef(id);if(!blade||!ownsP(blade.sourceId)||(G.blades||[]).includes(id)||(G.blades||[]).length>=4)return;
  G.blades=G.blades||[];G.blades.push(id);if(!G.activeBlade)G.activeBlade=id;if(!G.preferredBlade)G.preferredBlade=id;if(G.sealedPassive===id)G.sealedPassive=null;setSaveStatus(`${ALL_PASSIVES.find(p=>p.id===blade.sourceId).name}已鍛成「${blade.name}」。`);renderBladeForge();renderTop();
}
function unforgeBlade(id){
  const blade=bladeDef(id);if(!blade||!(G.blades||[]).includes(id)||(G.blades||[]).length<=1)return;
  G.blades=G.blades.filter(bladeId=>bladeId!==id);if(G.activeBlade===id)G.activeBlade=G.blades[0]||null;if(G.preferredBlade===id)G.preferredBlade=G.blades[0]||null;setSaveStatus(`${blade.name}已轉回被動「${ALL_PASSIVES.find(p=>p.id===blade.sourceId).name}」。`);renderBladeForge();renderTop();
}
function openBladeForgeDetail(id){
  const blade=bladeDef(id);if(!blade)return;
  $('blade-forge-detail-content').innerHTML=bladeForgeCard(blade);
  $('blade-forge-detail').classList.remove('hidden');
}
function closeBladeForgeDetail(){$('blade-forge-detail').classList.add('hidden');$('blade-forge-detail-content').innerHTML='';}
function renderBladeForge(){
  const defs=Object.values(BLADE_DEFS).filter(blade=>ownsP(blade.sourceId)),owned=defs.filter(blade=>(G.blades||[]).includes(blade.id)),available=defs.filter(blade=>!(G.blades||[]).includes(blade.id));
  const entry=(blade,forged)=>{const source=ALL_PASSIVES.find(p=>p.id===blade.sourceId),preferred=G.preferredBlade===blade.id;return `<div class="blade-forge-entry${preferred?' preferred':''}"><div class="forge-title">${forged?blade.icon:source.icon} ${forged?blade.name:source.name}${preferred?' ⭐':''}</div><div class="muted">${forged?`由「${source.name}」鍛造`:`可鍛造為「${blade.name}」`}</div><div class="btns"><button class="b-ghost" data-forge-detail="${blade.id}">詳細資料</button>${forged?`<button class="b-magic" data-forge-prefer="${blade.id}"${preferred?' disabled':''}>${preferred?'目前優先':'標記優先'}</button><button class="b-ghost" data-unforge="${blade.id}"${owned.length<=1?' disabled':''}>轉回被動</button>`:`<button class="b-magic" data-forge="${blade.id}"${owned.length>=4?' disabled':''}>鍛造</button>`}</div></div>`;};
  $('blade-forge-available').innerHTML=available.length?available.map(blade=>entry(blade,false)).join(''):'<div class="muted">目前沒有可鍛造的被動。</div>';
  $('blade-forge-owned').innerHTML=owned.length?owned.map(blade=>entry(blade,true)).join(''):'<div class="muted">尚未鍛造刀具。</div>';
  $('blade-forge').querySelectorAll('[data-forge-detail]').forEach(button=>button.onclick=()=>openBladeForgeDetail(button.dataset.forgeDetail));
  $('blade-forge').querySelectorAll('[data-forge]').forEach(button=>button.onclick=()=>forgeBlade(button.dataset.forge));
  $('blade-forge').querySelectorAll('[data-unforge]').forEach(button=>button.onclick=()=>unforgeBlade(button.dataset.unforge));
  $('blade-forge').querySelectorAll('[data-forge-prefer]').forEach(button=>button.onclick=()=>setPreferredBlade(button.dataset.forgePrefer));
}
function openBladeForge(){if(!playerIsSamurai()||G.nodeType!=='rest')return;closeBladeForgeDetail();renderBladeForge();$('blade-forge').classList.remove('hidden');}
function closeBladeForge(){closeBladeForgeDetail();$('blade-forge').classList.add('hidden');}
function renderBladeViewer(){
  const blades=(G.blades||[]).map(bladeDef).filter(Boolean),active=activeBladeDef(),inBattle=!!(G.battle&&!G.battle.over);
  $('blade-viewer-summary').textContent=blades.length?`持有 ${blades.length}/4 把刀。⭐ 優先刀會在每場戰鬥開局自動選擇；納刀期間可在戰鬥畫面自由換刀，但戰鬥中不能修改優先刀。`:'目前沒有刀具。武士徒手攻擊的最終傷害固定為 1，仍可使用架勢與見切。';
  $('blade-viewer-list').innerHTML=blades.length?blades.map(blade=>{
    const source=ALL_PASSIVES.find(p=>p.id===blade.sourceId),up=isUp(blade.sourceId),isActive=active&&active.id===blade.id;
    let rows=[['來源被動',source?`${source.icon} ${source.name}${up?' ⭐':''}`:blade.sourceId]];
    if(blade.id==='firststrike')rows.push(['先發制人',up?'第 1 回合以不超過 3 張、19～21 點攻擊時 +30 傷害':'第 1 回合以恰好 2 張、20 點攻擊時 +20 傷害'],['居合倍率',`${up?'×1.50':'×1.35'}；心流達 50 再 +0.15`],['澄明居合','心流達 75：額外增加手牌點數 ×0.5 傷害'],['極意','心流達 100：符合牌型的居合可再次觸發先發制人'],['必殺・無想一閃',up?'納刀、100 心流、不超過 3 張且 19～21 點時可選用；最終 ×1.75、無視 50% 護盾，施放後心流歸零並收刀。':'強化「先發制人」後解鎖。'],['心流累積','成功斬擊 +4；成功居合 +7；20 點再 +2、21 點再 +4；居合同時觸發先發制人再 +5。'],['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='safe21')rows.push(['守線','手牌第一次到達 17 點以上便記錄安全線；立即攻擊時最終 ×1.15、獲得 6 心流，並使本回合承受的攻擊傷害 −25%。'],['完美守線','第一次到達安全線便是 21 點時，改為最終 ×1.50、獲得 12 心流，並保留守線減傷。'],['越線','到達安全線後繼續抽牌並成功攻擊：每多抽 1 張最終倍率 +0.20、心流 +8，最多計算 2 張；不獲得守線減傷。'],['普通居合','×1.15。'],['心流 25','守線與完美守線的承傷減免提高至 30%。'],['心流 50','越線每張的倍率加成提高至 +0.25。'],['心流 75','19～21 點守線無視 40% 護盾。'],['必殺・界線斷決',up?'100 心流且 17～21 點時可選用；不受持刀或納刀限制，最終 ×1.75、無視 50% 護盾，本回合承傷 −40%。施放後心流歸零並收刀。':'強化「安全線」後解鎖。'],['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='court')rows.push(['朝儀','成功攻擊依序完成 J → Q → K；未抽到目標不重設，每次行動最多推進一次。完成 K 獲得 1 枚三公印，最多 3 枚。'],['朝儀心流','每次推進 +6 心流；目前心流達 25 時改為 +8。'],['居合倍率','基礎 ×1.20；每枚三公印 +0.15，居合後消耗全部三公印。'],['心流 50','居合手牌每種 J／Q／K 再 +0.05 倍，最多 +0.15。'],['心流 75','持有 3 枚三公印居合時無視 50% 護盾。'],['心流 100・滿朝不散','普通居合消耗 3 枚三公印後返還 1 枚；必殺不返還。'],['必殺・三公會審',up?'100 心流、3 枚三公印且未爆牌時可選用；不受持刀或納刀限制，發動 3 段各 70% 裁決，施放後心流與印記歸零並收刀。':'強化「宮廷牌局」後解鎖。'],['目前朝儀',G.battle?`等待 ${G.battle.samuraiCourtExpected||'J'}｜三公印 ${G.battle.samuraiCourtSeals||0}/3`:'每場戰鬥由 J 開始。'],['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='insurance')rows.push(['逆拔',`納刀時爆牌會以${up?'前 3 張':'前 2 張'}觸發保險攻擊並 ×1.40；命中獲得 10 心流。爆牌與豪賭代價照常結算。`],['心流 25・破綻計價','逆拔增加「爆牌點數 −21」傷害，最多 +10。'],['心流 50・加倍理賠','逆拔倍率提高為 ×1.60。'],['心流 75・拒絕免責','逆拔無視 50% 護盾。'],['心流 100・續保','普通逆拔後直接回到納刀狀態，且不消耗心流。'],['必殺・一命勘定',up?'100 心流且已爆牌時可選用；不受持刀或納刀限制，逆拔最終再 ×2 並完全無視護盾，施放後心流歸零並收刀。':'強化「保險機制」後解鎖。'],['普通居合','×1.20；一般斬擊與居合不提供心流。'],['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='peek')rows.push(['裁牌','每副手牌首次透視後可選一張預覽牌：引牌使其成為下一張；斬離使其移至本場牌堆底部。再次透視只能查看。'],['引牌・應驗','抽到引牌後立刻成功攻擊：2～16／17～18／19／20／21 點分別獲得 5／10／15／20／25 心流。繼續抽牌、改動手牌、防禦、爆牌或換刀都會失敗。'],['斬離・避凶','若斬離的是原本即將抽到且會導致爆牌的牌，而下一張安全牌為 2～18／19／20／21 點，分別獲得 8／12／16／20 心流。'],['居合倍率','×1.15。'],['心流 50・看破','引牌以 19～21 點應驗時無視 50% 護盾。'],['心流 100・先知','應驗攻擊結束後消耗 25 心流並自動收刀，方便下一副手牌更換刀具。'],['必殺・斬斷因果',up?'100 心流且本手使用過透視時可選用；交換一張手牌與一張預覽牌後立即攻擊，最終 ×1.35、無視 50% 護盾。可挽救爆牌，不限持刀或納刀；結束後心流歸零並收刀。':'強化「透視牌堆」後解鎖。'],['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='vampire')rows.push(['血博','斬擊前可支付最大生命的 5%／10%／15% 作為血籌；實際吸回血籌至少一半，分別按回收比例獲得最多 8／16／25 心流。'],['加注','下注時依心流 25／50／75，鎖定本次最多可加注 1／2／3 次。每次消耗 25 心流與 5% 最大生命，使本次傷害 +30%、吸血效率 +20%。'],['連莊','15% 血籌或曾加注的血籌若全數吸回，獲得 1 層；最多 3 層，每層使後續有下注的攻擊 ×1.10。未全數吸回、未續注攻擊、防禦、爆牌、收刀、換刀或改動手牌時歸零。'],['普通居合','×1.15；一般血博斬擊不會自動收刀。'],['必殺・血本無歸',up?'100 心流、未下注且未爆牌時可選用；支付 30% 最大生命，最終傷害 ×2.25、吸血效率 ×2、無視 50% 護盾。完全吸回血籌時連莊直接升至 3 層；若未造成傷害，再失去 15% 最大生命。施放後心流歸零並收刀。':'強化「吸血賭注」後解鎖。'],['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='bulwark')rows.push(...immovableBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='buckler')rows.push(...moonBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='antidote')rows.push(...mirrorBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='howdidwegethere')rows.push(...myriadBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='toxicology')rows.push(...poisonBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='dragonneck')rows.push(...dragonBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='luckycoin')rows.push(...fortuneBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    else if(blade.id==='rubyring')rows.push(...rubyBladeRows(up),['保護規則','刀具型態不會被封印、封存，強化不會被奪取或暫時失效；出售來源被動仍會連帶失去刀具。']);
    const preferred=G.preferredBlade===blade.id;
    return `<section class="codex-card blade-card${isActive?' active':''}"><div class="cn">${blade.icon} ${blade.name}${isActive?'（裝備中）':''}${preferred?' ⭐優先':''}</div><div class="blade-source">由「${source?source.name:blade.sourceId}」轉化</div><div class="blade-data">${rows.map(([name,value])=>`<b>${name}</b><span>${value}</span>`).join('')}</div><div class="btns"><button class="b-magic" data-view-prefer="${blade.id}"${preferred||inBattle?' disabled':''}>${preferred?'目前優先刀':inBattle?'戰鬥中不可修改':'標記為優先刀'}</button></div></section>`;
  }).join(''):'<div class="codex-card blade-card"><div class="cn">✊ 徒手</div><div class="cd">攻擊按鈕恢復顯示為「攻擊」；完成所有傷害計算後，最終傷害固定為 1。見切與架勢仍可使用。</div></div>';
  $('blade-viewer-list').querySelectorAll('[data-view-prefer]').forEach(button=>button.onclick=()=>setPreferredBlade(button.dataset.viewPrefer));
}
function openBladeViewer(){if(!playerIsSamurai())return;renderBladeViewer();$('blade-viewer').classList.remove('hidden');}
function closeBladeViewer(){$('blade-viewer').classList.add('hidden');}
function enemyGuideData(e){
  const action=(name,desc)=>({name,desc}),simple=(passive='無特殊被動。')=>({passives:[passive],actions:[action('普通攻擊','造成 1.0 倍基礎攻擊傷害。')]});
  const guides={
    slime:()=>simple('群體數量會隨大關高度增加；超過同時上場上限後，額外數量會轉為生命與攻擊成長。'),
    ninja:()=>({passives:['穿刺的破防只額外磨損仍存在的防禦，溢出部分不會轉為 HP 傷害。'],actions:[action('普通攻擊','造成 1.0 倍基礎攻擊傷害。'),action('穿刺','每第 3 回合使用；造成 1.0 倍傷害，並額外磨損相當於傷害 30% 的現有防禦。')]}),
    ghost:()=>({passives:['每第 3 回合進入無敵；無敵會使玩家攻擊完全無效。'],actions:[action('幽靈攻擊','非無敵回合造成 1.0 倍基礎攻擊傷害。'),action('無敵','第 3、6、9……回合生效；該回合仍會執行原定動作。')]}),
    witch:()=>({passives:['每逢第 5、10、15……回合固定改為施放劇毒。'],actions:[action('魔法攻擊','非施毒回合造成 1.0 倍基礎攻擊傷害。'),action('劇毒','每第 5 回合不造成直接傷害，施加 2 層中毒；實際層數受高度、狀態倍率與抗性影響。')]}),
    bear:()=>({passives:['第 1 回合與之後每第 5 回合的攻擊具有重壓效果。'],actions:[action('熊掌攻擊','造成 1.0 倍基礎攻擊傷害。'),action('重壓','在指定回合隨攻擊施加 3 層虛弱；實際層數受狀態倍率與抗性影響。')]}),
    platypus:()=>({passives:['第 1 回合與之後每第 3 回合的攻擊附加遲疑。高度提高後遲疑會從可額外抽 3 張逐漸壓低，但不會低於 2 張。'],actions:[action('鴨嘴獸攻擊','造成 1.0 倍基礎攻擊傷害。'),action('遲疑打擊','隨攻擊限制下一次行動的額外抽牌數；顯示的遲疑層數就是仍可額外抽取的張數。')]}),
    squirrel:()=>({passives:[`第 ${squirrelEscapeTurns(G.floor)} 回合結束後逃跑。每隻松鼠分別保存自己偷走的金錢與消耗品；被擊敗時只返還該隻松鼠持有的贓物。`],actions:[action('偷竊攻擊',`第 1 回合攻擊後獨立偷取金錢；若玩家持有消耗品，另有 ${Math.round(SQUIRREL_CONSUMABLE_STEAL_CHANCE*100)}% 機率偷走其中 1 個。`),action('普通攻擊','其餘回合造成 1.0 倍基礎攻擊傷害。'),action('逃跑','逃跑時間到達後帶走仍持有的全部贓物並結束戰鬥。')]}),
    mimic:()=>{const vr=enemyVirulenceRule(e,'venomBite');return {passives:['三種攻擊依固定循環使用；附加狀態只在攻擊實際傷及 HP 時觸發。'],actions:[action('毒牙啃咬',`造成 1.0 倍傷害並施加 2 層中毒；每累積給予 ${vr.threshold} 層中毒，再施加 ${vr.yield} 層猛毒。`),action('撕裂長舌','造成 1.1 倍傷害並施加 2 層流血。'),action('碎骨夾擊','造成 1.35 倍傷害並施加 1 層斷骨。')]};},
    dropbear:()=>({passives:['固定休息 2 回合，第 3 回合發動猛撲，之後重複。'],actions:[action('蓄力休息','不攻擊。'),action('蓄力猛撲','造成高額基礎傷害；實際傷及 HP 時施加 2 層中毒與 4 層虛弱。')]}),
    zombie:()=>({passives:[`首次 HP 歸零時倒地；需單次造成至少 ${zombieFinishThreshold(G.floor)} 傷害補刀，20／21 點可直接處決。未補刀會以 30% HP 復活，復活後攻擊循環重設。`],actions:[action('抓擊','連續使用 2 次，造成 1.0 倍基礎攻擊傷害。'),action('腐敗撕咬','第 3 次行動使用；造成傷害，實際傷及 HP 時施加腐敗。'),action('倒地','倒地期間不行動，等待補刀或復活判定。')]}),
    eagle:()=>{const eg=eagleGrowth(G.floor),paralysis=enemyStatusRaw(e,eg.paralysis);return {passives:[`擁有 ${e.maxEvasion||eg.maxEvasion} 層閃避。16 點以下的攻擊會消耗 1 層閃避並完全失效；17～19 點可命中並削減 1 層；20／21 點會擊破全部閃避、使老鷹折翼 2 回合，但該次攻擊傷害 −25%。`,`成功閃避後，下一次行動改為${eg.thunder?'雷霆俯衝':'俯衝反擊'}。折翼期間無法閃避。`],actions:[action('利爪攻擊','造成 1.0 倍基礎攻擊傷害。'),action(eg.thunder?'雷霆俯衝':'俯衝反擊',`成功閃避後使用，造成 ${eg.diveMult.toFixed(1)} 倍傷害。${eg.thunder?`傷及 HP 時施加 ${paralysis} 層麻痺。`:''}`)]};},
    robot:()=>{const rg=robotGrowth(G.floor),paralysis=enemyStatusRaw(e,rg.paralysis);return {passives:['依「火焰噴射 → 電力充能 → 電弧放電 → 過熱冷卻」循環行動。'],actions:[action('火焰噴射',`造成 1.0 倍傷害；傷及 HP 時施加 ${rg.burn} 層燒傷。`),action('電力充能',`不攻擊；高樓層時獲得 ${rg.chargeShield} 護盾。`),action('電弧放電',`造成 1.4 倍基礎傷害，無上限吸收玩家蓄勢的 ${Math.round(rg.focusRate*100)}%，將吸收量加入傷害並清除玩家全部蓄勢；傷及 HP 時施加 ${paralysis} 層麻痺。`),action('過熱冷卻','不攻擊；該回合受到的傷害 ×1.4。')]};},
    cultist:()=>{const cg=cultistGrowth(G.floor);return {passives:[`戰鬥開始時最多奪取 1 個已強化被動；若沒有可奪取強化則獲得 12 護盾。20／21 點或單次傷害達 ${cultistReclaimThreshold(G.floor)} 可奪回強化。`,`死亡、獻祭完成或儀式被擊破時歸還奪取的強化。`],actions:[action('普通攻擊','造成 1.0 倍基礎攻擊傷害。'),action('邪能打擊',`持有奪取強化時造成 ×${cg.dark.toFixed(2)} 傷害；未持有時視為普通攻擊。`),action('獻祭釋放',`持有奪取強化時造成 ×${cg.sacrifice.toFixed(2)} 傷害，攻擊後歸還強化。`),action('祈禱',`不攻擊。石像鬼關卡中使石像鬼永久攻擊 +${Math.round(gargoyleGrowth(G.floor).prayerPower*100)}%；其他關卡中進入受到傷害 ×1.3 的反噬狀態。`)]};},
    skeleton:()=>{const sg=skeletonGrowth(G.floor);return {passives:[`擁有 ${sg.maxArmor} 層骨甲；骨甲使一般命中減傷 ${Math.round(sg.damageReduction*100)}%，每次命中消耗 1 層，20／21 點會粉碎全部骨甲。`,`骨甲耗盡後進入骨刃強襲，攻擊 ×${sg.rageMult}。`],actions:[action('揮劍斬擊','造成 1.0 倍基礎攻擊傷害。'),action('骨刃強襲',`骨甲耗盡時造成 ×${sg.rageMult} 傷害。`),action('骨盾架勢',`每 ${sg.guardEvery} 次行動使用，不攻擊並恢復 ${sg.recover} 層骨甲。`)]};},
    bat:()=>({passives:['各蝙蝠的行動起點彼此錯開。'],actions:[action('撕咬','連續使用 2 次，造成 1.0 倍基礎攻擊傷害。'),action('吸血撕咬','第 3 次行動使用；回復實際 HP 傷害的 50%，被完全防禦時不回復。')]}),
    cyclops:()=>({passives:[`此高度的循環長度為 ${cyclopsGrowth(G.floor).cycleLength} 回合。凝視回合受到 18～21 點成功攻擊會中斷下一次粉碎重擊。`],actions:[action('巨棒揮擊','造成 1.0 倍基礎攻擊傷害。'),action('獨眼凝視','不攻擊；設定下一回合粉碎重擊，可被指定點數命中中斷。'),action('粉碎重擊','造成 2.0 倍傷害；實際傷及 HP 時施加 1 層斷骨。')]}),
    paladin:()=>{const pg=paladinGrowth(G.floor);return {passives:['固定擁有 50% 負面狀態抗性。','聖盾禱告會同時驅散每種現有負面狀態的 10%。'],actions:[action('聖劍斬擊','造成 1.0 倍基礎攻擊傷害。'),action('破甲斬擊','造成 1.0 倍傷害，並額外磨損傷害 30% 的現有防禦。'),action('聖盾禱告',`不攻擊；護盾補至 ${pg.shield}，並驅散負面狀態。`),action('神聖裁決',`造成 ×${pg.judgmentMult} 傷害；裁決前的聖盾被打破時中斷。`),action('戰吼／聖騎衝擊／裁決斬擊','審判長編隊的同步動作：戰吼使下回合全體傷害 +25%；衝擊為高傷害與 40% 破防；裁決斬擊具有罪惡加成與 30% 破防。')]};},
    werewolf:()=>({passives:['攻擊與治療會依玩家流血層數增強。'],actions:[action('狼爪','造成 1.0 倍傷害；實際傷及 HP 時施加 2 層流血。'),action('嗅血撕咬','倍率為 1.2＋每層流血 0.05，最高 ×1.5。'),action('舔舐傷口','不攻擊；回復最大生命的 10%＋每層流血 1%，最高 18%。')]}),
    gargoyle:()=>{const gg=gargoyleGrowth(G.floor);return {passives:[`開局與守護獲得的護盾永久保留。護盾達到復活消耗時，可消耗相當於教徒最大生命 ${Math.round(gg.reviveCostRate*100)}% 的護盾，使死亡教徒以 ${Math.round(gg.reviveHpRate*100)}% HP 復活。`,`每隻石像鬼最多封鎖 1 張技能；20／21 點或對本體造成至少 ${gargoyleUnlockThreshold(G.floor)} 傷害可解除。石像鬼死亡時連帶教徒死亡。`],actions:[action('石爪攻擊','造成 1.0 倍基礎攻擊傷害。'),action('石像守護',`每第 3 次行動使用；不攻擊，永久護盾 +${gg.bossShield}，並嘗試復活教徒。`)]};},
    dragon:()=>{const dg=dragonGrowth(G.floor);return {passives:[`開局有 ${Math.round(dg.sleepChance*100)}% 機率沉睡 2 回合；被攻擊後該回合仍沉睡，下回合甦醒並施加虛弱。`,`此高度以 ${dg.normals} 次普通行動接 1 次龍息；單次實際傷害達 ${dg.interrupt} 可中斷龍息。`],actions:[action('普通攻擊','造成較低的 1.0 倍基礎攻擊傷害。'),action('龍盾普攻',`高樓層在龍息前使用；攻擊並展開 ${dg.shieldAmount} 龍盾。`),action('龍息',`造成 ×${dg.breathMult.toFixed(2)} 傷害；達中斷門檻則該回合不攻擊。`),action('沉睡','不行動；依沉睡或驚醒規則推進。')]};},
    bloodDemon:()=>{const dg=bloodDemonGrowth(G.floor);return {passives:[`攻擊節奏隨高度由「2 普攻 1 吸血」提高至最高「1 普攻 1 吸血」，不會進一步變成連續吸血。此高度的吸血基礎效率為 ${Math.round(dg.drainRate*100)}%。`,`HP 低於 15% 時進入 5 層渴血，最多觸發 ${BALANCE.bloodDemonFrenzyUses} 次；吸血效率因此 ×1.5。`,'吸血回合即使完全未穿透防禦，仍至少按預定傷害的 25% 計算回復量。'],actions:[action('普通攻擊','造成 1.0 倍基礎攻擊傷害。'),action('吸血攻擊','造成攻擊傷害，依實際 HP 傷害、渴血、敗血與保底規則回復生命。'),action('血祭','第 6 大關起按週期使用；HP 高於 30% 時自損最多 8% 最大生命，本場攻擊永久 +15%。血量不足時跳過血祭並回到攻擊循環。')]};},
    ronin:()=>({passives:[`事件菁英，心流使所有攻擊傷害永久 ×2.5。所有實際攻擊都帶有 ${e.executionPercent||roninExecutionPercent()}% 斬首；攻擊必須穿透防禦，且結算後生命落入斬首線才會立即死亡。`,'開局固定使用居合，之後循環「刺突 → 唐竹 → 見切 → 燕返」。既有殘心尚未消失時，若玩家在見切期間爆牌，殘心會刷新且下一回合改為千太刀；五斬後收刀，再下一回合固定居合。'],actions:[action('居合','開局或千太刀收刀後使用；心流後再 ×1.4，具有 40% 破防。'),action('刺突','造成心流 ×2.5 傷害，並額外磨損傷害 30% 的現有防禦。'),action('唐竹','造成心流 ×2.5 傷害；傷及 HP 時施加 2 層流血。'),action('見切','不攻擊。20／21 點完全破解；17～19 點攻擊傷害 −25% 並刷新較弱殘心；2～16 點或爆牌使攻擊傷害 −50% 並刷新完整殘心。玩家防禦或爆牌時回復 10% 最大生命，但防禦不會觸發殘心。'),action('燕返','分成兩段，每段為心流後 ×0.65，具有 25% 破防，第二段傷及 HP 時施加 2 層流血。殘心的攻擊加成會依當下剩餘強度套用。'),action('千太刀','流浪武士帶著既有殘心進入見切且玩家爆牌時觸發；連續 5 斬，每斬為心流後 ×0.5。每一斬都帶有斬首，施放後收刀，下一回合固定居合。')]}),
    samurai:()=>({passives:['心流使所有基礎攻擊傷害永久 ×1.5。','開局固定使用居合，之後循環「袈裟斬 → 見切 → 燕返」。殘心會提高所有攻擊並提供減傷，隨後續攻擊逐次遞減，在下一次見切結束時消失；再次觸發會刷新。'],actions:[action('居合','心流後再 ×1.4，具有 40% 破防；傷及 HP 時施加 2 層流血。'),action('袈裟斬','心流 1.5 倍傷害；傷及 HP 時施加 1 層流血。'),action('見切','不攻擊。20／21 點完全破解；17～19 點攻擊傷害 −25% 並刷新攻擊 +25%、減傷 15% 的殘心；2～16 點或爆牌使攻擊傷害 −50% 並刷新攻擊 +35%、減傷 20% 的殘心。玩家防禦或爆牌時回復 8% 最大生命，但防禦不會觸發殘心。'),action('燕返','分為 2 段，每段為心流後 ×0.8、破防 25%；第二段傷及 HP 時施加 2 層流血。殘心的攻擊加成會依當下剩餘強度套用。')]}),
    kun:()=>{const kg=kunGrowth();return {passives:[`終極 Boss，70% 負面狀態抗性，生命為同層一般 Boss 的 2.5 倍。北冥潮開局 ${kg.tideStart} 層、上限 ${kg.tideCap}，每 3 回合增加 ${kg.tideStep} 層；滿潮後再次發動會使生命上限與生命提高 ${Math.round(kg.maxHpGrowthRate*100)}%。`,`退潮規則：20／21 點成功命中本體 −1；單次攻擊行動對本體造成至少最大生命 10% 傷害 −1；擊破吞海護盾 −2；神性準備回合以 20／21 點命中 −2；完全防禦深海撞擊 −1；完全防禦覆海 −3。`,`同一次攻擊行動只採最高退潮值，多段攻擊只結算一次；一般攻擊行動最多 −2。北冥潮最低 0；鯤轉化為鵬時全部清除，每層轉為鵬永久攻擊 +2%。`,`深海撞擊傷害會依玩家持有的被動卡牌數增加。HP 歸零後轉化為鵬。`],actions:[action('深海撞擊','45% 行動機率，可連續使用；造成攻擊傷害，實際傷及 HP 時施加 1 層斷骨。'),action('吞海',`30% 行動機率；獲得「已損失生命 ×（${Math.round(kg.shieldBaseRate*100)}%＋每層北冥潮 ${Math.round(kg.shieldPerTide*100)}%）」的護盾。下回合以剩餘護盾 ×2 回血，然後消耗剩餘護盾。`),action('威壓','25% 行動機率；清除蓄勢、封鎖蓄勢 2 回合並施加 5 層虛弱。'),action('神性',`每第 ${kg.coverEvery} 回合使用；回復 ${Math.round(kg.divineHealRate*100)}% 最大生命並驅散所有負面狀態，下回合固定覆海。`),action('覆海','造成深海撞擊 3.5 倍傷害，不附加斷骨。')]};},
    peng:()=>({passives:[`終極 Boss，70% 負面狀態抗性，閃避上限 ${e.maxEvasion||8} 層。16 點以下的攻擊會消耗 1 層閃避並完全失效；17～19 點可命中並削減 1 層；20／21 點可命中並削減 2 層。鵬不會因閃避被削盡而折翼。`,`焚風使燒傷需要 4 次額外抽牌發作才減層，完整回合自然減層也延長為每 2 回合一次，並延長流血與創傷的恢復時間。由鯤轉化時清除原護盾，獲得最大生命 15% 護盾、驅散全部負面狀態並停頓 1 回合；剩餘北冥潮每層轉為永久攻擊 +2%。`],actions:[action('風刃','造成 1.0 倍傷害；傷及 HP 時施加 2 層流血。'),action('炎羽','造成 1.0 倍傷害；傷及 HP 時施加 2 層燒傷。'),action('裂空爪','造成 1.8 倍傷害並具有 45% 破防。'),action('浴火振翅','不攻擊；回復 5% HP、驅散負面狀態並施加 3 層燒傷，下回合固定焚天。'),action('焚天','造成 2.5 倍傷害、60% 破防；傷及 HP 時施加 3 層流血與 3 層燒傷。'),action('遮天蔽日','低機率使用；恢復 2 層閃避並施加 3 層致盲。')]}),
    disciplineGargoyle:()=>({passives:['50% 負面狀態抗性，永久護盾。死亡時使教宗永久攻擊 +25%，並使狂信 −5。'],actions:[action('戒律石爪','造成 1.3 倍傷害。'),action('石像封印','不攻擊；最多封鎖 1 項主動或被動技能。'),action('烙印凝視','不攻擊；戒律烙印 +1。')]}),
    punishmentGargoyle:()=>{const vr=enemyVirulenceRule(e,'toxicWhip');return {passives:['50% 負面狀態抗性，永久護盾。死亡時使玩家當時的中毒層數翻倍，並使狂信 −5。'],actions:[action('刑罰石爪','造成 1.0 倍基礎攻擊傷害。'),action('毒刑','造成 1.1 倍傷害；傷及 HP 時施加 2 層中毒。'),action('石像封印','不攻擊；最多封鎖 1 項主動或被動技能。'),action('毒鞭',`造成 1.2 倍傷害；傷及 HP 時施加 3 層中毒。每 ${vr.threshold} 層中毒轉化 ${vr.yield} 層猛毒。`)]};},
    cultLeader:()=>({passives:[`終極 Boss 第一階段，70% 負面狀態抗性。兩尊石像鬼存活時各提供 25% 減傷；教宗死亡時石像鬼一同死亡。`,`狂信開局 5 層、上限 20；每層使攻擊 +2%。教宗成功施加負面效果時狂信 +1；玩家以 20／21 點成功命中教宗時狂信 −2；任一石像鬼死亡時狂信 −5。所有非刀具來源的玩家強化在本階段被封印。`,`戒律烙印在連續使用相同行動時 +1、切換行動時 −1；達 3 層觸發戒律懲罰後重設為 1。懲罰會將玩家負面狀態按規則放大、造成教宗基礎攻擊 ×1.5 的額外傷害，之後每次倍率再 +0.5，並使敵方全體回復 5% 與獲得 10% 永久護盾。`],actions:[action('黑經誦讀','造成 1.0 倍以上傷害；傷及 HP 時施加腐敗，滿狂信時層數提高。'),action('盲目佈道','造成 1.0 倍以上傷害並施加致盲，滿狂信時層數提高。'),action('敗血儀式','造成 1.15 倍傷害；傷及 HP 時施加敗血。'),action('汲血','造成 1.2 倍傷害，回復實際 HP 傷害的 50%。'),action('褻瀆共融','造成 1.1 倍傷害，並依玩家持有的負面狀態種類回復更多生命。'),action('黑曜赦令','石像鬼存活時使用；不攻擊，敵方全體獲得永久護盾，暫時歸還玩家強化 1 回合，石像鬼下一次傷害 ×1.3。')]}),
    cthulhu:()=>({passives:[`終極 Boss 第二階段，70% 負面狀態抗性，生命上限等於第一階段教宗與兩尊石像鬼生命上限總和。繼承並凍結第一階段狂信，每層攻擊 +2%。`,`深淵距離開局 10、上限 20，每回合自然 −1；歸零時玩家 HP 歸零，復活後距離從 5 開始。逃跑行動依點數增加距離：2～12 點 +1、13～16 點 +2、17～19 點 +3、20 點 +4、21 點 +6。`,`戒律烙印永久存在，即使歸零也保留；連續使用相同行動 +1、切換行動 −1、爆牌直接 +2。達 3 層會觸發戒律懲罰，深淵距離直接再 −2；托拽不套用一般的 1.5 倍狀態放大。`],actions:[action('萬觸撕裂','造成 1.3 倍傷害；傷及 HP 時施加 5 層流血與 1 層斷骨。'),action('不可名狀的凝視','造成至少 1.0 倍傷害，施加幻覺與精神錯亂。'),action('深淵震鳴','造成 1.2 倍傷害；除自然托拽外再使深淵距離 −1。'),action('群星囈語','造成至少 1.0 倍傷害，施加致盲與遲疑。'),action('深海威壓','造成 1.1 倍傷害，施加虛弱；傷及 HP 時施加腐敗。'),action('深淵再生','唯一無攻擊動作；回復 6% 最大生命並獲得 12% 最大生命的永久護盾。')]}),
    inquisitorMounted:()=>({passives:['終極 Boss 第一階段，70% 負面狀態抗性與永久 30% 減傷。馬勢開局 5、上限 25；低於 10 時回復速度提高，每層使騎馬攻擊 +3%。玩家以 19～21 點成功命中時馬勢 −2；單次傷害至少達審判長最大生命 12% 時再 −1，兩項可同時觸發。','每次玩家攻擊行動傷及審判長陣營、施加負面狀態、爆牌或擊殺聖騎士都會增加罪證；罪證無上限。'],actions:[action('騎槍突刺','造成 1.2 倍傷害並受馬勢與戰吼加成；傷及 HP 時施加 2 層流血。'),action('戰馬踐踏','造成 1.05 倍傷害並受馬勢與戰吼加成；傷及 HP 時施加 1 層斷骨。'),action('宣讀罪狀','不攻擊；罪證 +1、施加虛弱並獲得最大生命 12% 護盾。'),action('舉槍裁決','裁決衝鋒準備；不攻擊，全體驅散 50% 負面狀態並獲得最大生命 30% 戰馬護甲，聖騎士同步戰吼。'),action('裁決衝鋒','造成 2.4 倍傷害並受馬勢與戰吼加成，具有高破防；傷及 HP 時施加流血與斷骨。')]}),
    inquisitor:()=>({passives:['終極 Boss 第二階段，70% 負面狀態抗性與永久 30% 減傷。第二型態最大生命＝第一型態原始生命 ×（1.5＋剩餘馬勢 ×0.05）。','罪證按 1：100 轉化並形成罪惡值；罪惡值無倍率上限，會提高審判長與聖騎士傷害。後續再犯以原罪證效果 80% 增加，但不超過開局罪惡值上限。','審判長完全死亡後，存活聖騎士立即失去全部護盾與罪惡值加成；攻擊永久 −35%、聖盾效力 −50%，異常抗性降至 20%。'],actions:[action('下馬整備','轉階後停頓 1 回合，下回合固定審判。'),action('斷罪劍','造成 1.2 倍傷害並受罪惡值加成；傷及 HP 時施加 2 層流血。'),action('火刑宣告','造成 1.1 倍傷害並受罪惡值加成；傷及 HP 時施加 3 層燒傷與 1 層腐敗。'),action('信仰拷問','造成 1.0 倍傷害；傷及 HP 時奪取 2 控制值，控制值為 0 時改施加 2 層虛弱。'),action('沒收異端財物','不攻擊；奪取金錢並將其中 25% 轉化為護盾。'),action('審判','無前搖，造成 1.4 倍傷害並使用較高罪惡值加成；傷及 HP 時施加斷骨，存活聖騎士同步使用裁決斬擊。')]}),
  };
  return (guides[e.type]||(()=>simple()))();
}
function openEnemyInfo(){if(!G.battle)return;renderEnemyInfo();$('enemy-info').classList.remove('hidden');}
function closeEnemyInfo(){$('enemy-info').classList.add('hidden');}
function renderEnemyInfo(){
  const b=G.battle;if(!b){$('enemy-info-list').innerHTML='<div class="muted">目前不在戰鬥中。</div>';return;}
  const enemyTypes=[...new Map(b.enemies.map(e=>[e.type,e])).values()];
  $('enemy-info-list').innerHTML=enemyTypes.map(e=>{
    const guide=enemyGuideData(e),name=ENEMIES[e.type]?.name||e.name;
    return `<section class="enemy-info-card"><div class="enemy-info-title"><span>${escapeHtml(name)}</span></div><div class="enemy-info-group"><div>被動與特殊規則</div>${guide.passives.map(text=>`<div class="enemy-info-passive">${escapeHtml(text)}</div>`).join('')}</div><div class="enemy-info-group"><div>所有動作</div>${guide.actions.map(item=>`<div class="enemy-info-row"><b>${escapeHtml(item.name)}</b><span>${escapeHtml(item.desc)}</span></div>`).join('')}</div></section>`;
  }).join('');
}
function setCodexTab(tab){
  const status=tab==='status',consumables=tab==='consumables',passives=!status&&!consumables;
  $('codex-passive-panel').classList.toggle('hidden',!passives);
  $('codex-status-panel').classList.toggle('hidden',!status);
  $('codex-consumable-panel').classList.toggle('hidden',!consumables);
  [['passives',passives],['status',status],['consumables',consumables]].forEach(([id,active])=>{$(`codex-tab-${id}`).classList.toggle('active',active);$(`codex-tab-${id}`).setAttribute('aria-selected',String(active));});
}
function renderCodex(){
  $('codex-count').textContent=ALL_PASSIVES.length+MIRACLE_CARDS.length+PASSIVE_AFFIXES.length;
  $('codex-list').innerHTML=ALL_PASSIVES.map(p=>{
    const owned=G.passives.includes(p.id);const up=isUp(p.id);
    const action=owned
      ?'<div class="owned">✓ 已持有'+(p.id==='doublebet'&&G.upgrades.includes('doublebet2')?'（二次強化）':up?'（已強化）':'')+(p.id==='suitmage'&&G.suitMastery?`｜${masteryInfo().name}`:'')+'</div>'
      :'<div class="ccost" style="text-align:center;padding:7px">尚未獲得</div>';
    let upLine=p.descUp?`<div class="ccost" style="color:var(--gold)">⭐ 強化：${passiveDescription(p,true)}</div>`:'<div class="ccost">（無強化）</div>';
    if(p.id==='suitmage')upLine+=`<div class="ccost" style="color:#d7b4ff">⭐ 強化時立即專精四選一：${SUIT_MASTERIES.map(m=>m.name).join('／')}</div>`;
    if(p.id==='doublebet')upLine+=`<div class="ccost" style="color:#d7b4ff">⭐⭐ 二次強化：${DOUBLEBET_MASTERY_DESC}</div>`;
    const stars=p.id==='doublebet'&&G.upgrades.includes('doublebet2')?' ⭐⭐':up?' ⭐':'';
    const rarity=rarityInfo(p.id),source=p.id==='bloodpact'?'魔王稀有掉落｜血魔機率較高｜無法購買':p.id==='beheading'?'流浪武士事件專屬｜無法購買或一般強化':signatureProtected(p.id)?'職業被動卡｜無法購買、出售、丟棄、封印或封存｜不受技能封鎖與強化奪取':`${rarity.name}｜商店基礎售價 ${p.cost}🪙`;
    const bladeDetail=playerIsSamurai()&&bladeDef(p.id)?`<button class="b-ghost" type="button" data-codex-blade-detail="${p.id}">查看「${bladeDef(p.id).name}」詳細</button>`:'';
    return `<div class="codex-card"><div class="cn">${p.icon} ${p.name}${stars} <span class="rarity rarity-${passiveRarity(p.id)}">${rarity.name}</span></div><div class="cd">${passiveDescription(p,false)}</div>${upLine}<div class="ccost">${source}</div>${action}${bladeDetail}</div>`;
  }).join('')+MIRACLE_CARDS.map(card=>{
    const type=card.id==='holy-miracle'?'holy':'dark',owned=miracleType()===type;
    return `<div class="codex-card miracle-card"><div class="cn">${card.icon} ${card.name} <span class="rarity rarity-special">神蹟</span></div><div class="cd">${card.desc}</div><div class="ccost">神蹟卡牌｜不占裝備欄｜無法購買</div><div class="${owned?'owned':'ccost'}">${owned?'✓ 目前持有':'目前未持有'}</div></div>`;
  }).join('')+PASSIVE_AFFIXES.map(affix=>{
    const overall=(PASSIVE_AFFIX_CHANCE*affix.weight).toFixed(1);
    return `<div class="codex-card affix-card"><div class="cn">${affix.icon} ${affix.name} <span class="rarity rarity-${affix.rarity}">${RARITY_INFO[affix.rarity].name}詞條</span></div><div class="cd">${affix.desc}</div><div class="ccost">被動出現時約 ${overall}% 機率附加｜每件最多一條</div></div>`;
  }).join('');
  $('codex-list').querySelectorAll('[data-codex-blade-detail]').forEach(button=>button.onclick=()=>openBladeForgeDetail(button.dataset.codexBladeDetail));
  $('status-count').textContent=STATUS_CODEX.length;
  $('status-list').innerHTML=STATUS_CODEX.map(status=>{
    let desc=status.desc;
    if(status.name==='防禦'&&playerIsSamurai())desc='優先抵擋即將受到的傷害；武士持有壁壘時不會保留防禦，壁壘改為延長殘心。';
    if(status.name==='殘心'&&playerIsSamurai())desc='以 20 點見切並實際擋住攻擊時，獲得攻擊 +25%、承受攻擊 −15%；21 點改為 +35%／−20%。基礎持續 3 個完整回合，未強化／已強化壁壘延長為 4／5 回合，期間等比例衰減；較弱殘心不覆蓋較強殘心，見切未形成新殘心或爆牌會立即清除。不動太刀以剩餘回合強化居合與心流共鳴；心流 25 的守心可讓每段殘心跳過一次架勢回合的自然衰減。';
    return `<div class="codex-card status-card"><div class="cn">${status.icon} ${status.name}</div><div class="cd">${desc}</div></div>`;
  }).join('');
  $('consumable-codex-list').innerHTML=CONSUMABLES.map(item=>{const rarity=RARITY_INFO[item.rarity]||RARITY_INFO.common,count=consumableCount(item.id);return `<div class="codex-card consumable-card"><div class="cn">${item.icon} ${item.name} <span class="rarity rarity-${item.rarity}">${rarity.name}</span></div><div class="cd">${item.desc}</div><div class="ccost">商店基礎售價 ${item.cost}🪙｜不可出售，可自行丟棄｜附魔：${SUIT_ENCHANT_EFFECTS[item.id]}｜目前持有 ${count}/${CONSUMABLE_STACK_LIMIT}</div></div>`;}).join('')+`<div class="codex-card consumable-card"><div class="cn">🎁 取得與失去</div><div class="cd">所有角色開局獲得飛刀與鐵板各 1 個。一般戰鬥有 ${Math.round(NORMAL_CONSUMABLE_DROP_CHANCE*100)}% 機率掉落；翻找松鼠窩有 ${Math.round(SQUIRREL_NEST_CONSUMABLE_DROP_CHANCE*100)}% 機率找到；神祕寶箱固定附帶 1 個。松鼠會各自偷竊並在被擊敗時返還，若成功逃跑則會帶走贓物。</div><div class="ccost">所有種類也可能在商店販售；消耗品不可出售，但可從背包丟棄。</div></div>`;
}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function publicReputation(value=G.faction||0,blood=G.bloodDescendant){
  if(blood)return '世人已無法用常理評價你的存在';
  if(value>=1000)return '被視為行走世間的聖者';if(value>=500)return '廣受敬仰';if(value>=100)return '普遍受到信賴';
  if(value<=-1000)return '被視為必須避諱的災厄';if(value<=-500)return '廣受畏懼與憎惡';if(value<=-100)return '多數人對你抱持敵意';return '褒貶不一，尚無定論';
}
function reportDetails(title,total,entries,suffix=''){
  const rows=Object.entries(entries||{}).filter(([,value])=>Number(value)>0).sort((a,b)=>b[1]-a[1]);if(!rows.length)return '';
  return `<details><summary>${escapeHtml(title)}：${total}${escapeHtml(suffix)}</summary><div class="death-breakdown">${rows.map(([name,value])=>`<span>${escapeHtml(name)}</span><b>${value}${escapeHtml(suffix)}</b>`).join('')}</div></details>`;
}
function renderDeathReport(){
  const s=runStats(),highestTaken=s.highestTaken.amount?`${s.highestTaken.amount}｜${s.highestTaken.enemy}・${s.highestTaken.effect}`:'0';
  const reportedFloor=G.developerMode?s.highestFloor:Math.max(s.highestFloor,G.floor);
  const highestDamage=s.highestDamage.amount?`${s.highestDamage.amount}${s.highestDamage.target?`｜${s.highestDamage.target}`:''}`:'0';
  const deckCounts={};G.deck.forEach(card=>{const name=`${cardLabel(card)}${card.s}`;deckCounts[name]=(deckCounts[name]||0)+1;});
  const deckText=Object.entries(deckCounts).map(([name,count])=>`${escapeHtml(name)}${count>1?` ×${count}`:''}`).join('、');
  const passiveText=G.passives.length?G.passives.map(id=>{const name=id==='bloodpact'?bloodContractName():passiveNameWithAffix(id),stars=id==='doublebet'&&G.upgrades.includes('doublebet2')?' ⭐⭐':G.upgrades.includes(id)?' ⭐':'',sealed=G.sealedPassive===id?'（封存）':'',mastery=id==='suitmage'&&masteryInfo()?`（${masteryInfo().name}）`:'';return `${escapeHtml(name)}${stars}${escapeHtml(mastery)}${sealed}`;}).join('、'):'無';
  const consumableText=CONSUMABLES.filter(item=>consumableCount(item.id)>0).map(item=>`${item.icon} ${escapeHtml(item.name)} ×${consumableCount(item.id)}`).join('、')||'無';
  const actionRows={攻擊:s.actions.attack,防禦:s.actions.defense,逃離深淵:s.actions.escape,贖罪:s.actions.atonement};
  $('death-report').innerHTML=`
    <div class="death-summary">
      <div class="death-stat">🌱 種子<b>${escapeHtml(G.seedCode)}</b></div><div class="death-stat">🗼 最高樓層<b>${reportedFloor}</b></div>
      <div class="death-stat">⚔️ 最高傷害<b>${escapeHtml(highestDamage)}</b></div><div class="death-stat">💥 總傷害<b>${s.damageDealtTotal}</b></div>
      <div class="death-stat">🩸 最高承受傷害<b>${escapeHtml(highestTaken)}</b></div><div class="death-stat">🩹 總承受傷害<b>${s.damageTakenTotal}</b></div>
      <div class="death-stat">🛡️ 最高護盾量<b>${s.highestShield}</b></div><div class="death-stat">🛡️ 總護盾量<b>${s.shieldTotal}</b></div>
      <div class="death-stat">💚 最高回復量<b>${s.highestHealing}</b></div><div class="death-stat">💚 總回復量<b>${s.healingTotal}</b></div>
      <div class="death-stat">🧛 最高吸血量<b>${s.highestLifesteal}</b></div><div class="death-stat">🧛 總吸血量<b>${s.lifestealTotal}</b></div>
      <div class="death-stat">🪙 總獲得金錢<b>${s.goldGained}</b></div><div class="death-stat">⚔️ 擊敗敵人／Boss<b>${s.enemiesDefeatedTotal}／${s.bossesDefeatedTotal}</b></div>
      <div class="death-stat">🧭 遇見事件<b>${s.eventsEncounteredTotal}</b></div><div class="death-stat">🗣️ 世人對你的評價<b>${escapeHtml(publicReputation())}</b></div>
      <div class="death-stat">⏳ 完成戰鬥回合<b>${s.turns}</b></div><div class="death-stat">💥 爆牌次數<b>${s.busts}</b></div>
    </div>
    ${reportDetails('承受傷害來源',s.damageTakenTotal,s.damageTakenByEnemy,'')}
    ${reportDetails('擊敗敵人',s.enemiesDefeatedTotal,s.enemyKills,' 隻')}
    ${reportDetails('擊敗 Boss',s.bossesDefeatedTotal,s.bossKills,' 隻')}
    ${reportDetails('遇見事件',s.eventsEncounteredTotal,s.eventCounts,' 次')}
    ${reportDetails('行動統計',Object.values(actionRows).reduce((sum,value)=>sum+value,0),actionRows,' 次')}
    <details><summary>牌庫、被動與消耗品</summary><div class="death-loadout"><b>牌庫（${G.deck.length} 張）</b><br>${deckText||'無'}<br><br><b>被動（${G.passives.length} 件）</b><br>${passiveText}<br><br><b>消耗品（${consumableTypeCount()} 種）</b><br>${consumableText}</div></details>`;
}
function gameOver(){
  show('end');renderTop();SFX.lose();$('end-title').textContent='💀 你倒下了';$('end-title').className='big';$('end-sub').textContent=`你爬到了第 ${G.floor} 層。賭場無情，再挑戰一次？`;
  try{renderDeathReport();}
  catch(error){
    console.error('死亡報告產生失敗',error);
    $('death-report').innerHTML=`<div class="death-summary"><div class="death-stat">🌱 種子<b>${escapeHtml(G.seedCode||'未知')}</b></div><div class="death-stat">🗼 最高樓層<b>${G.floor}</b></div></div><div class="muted">完整統計暫時無法顯示，但本局結果仍已保留。</div>`;
  }
}

const DEVELOPER_ENCOUNTERS=[
  ['slimes','史萊姆群'],['ninja','忍者'],['ghost','幽靈'],['witch','女巫'],['bear','熊'],['platypus','鴨嘴獸'],['squirrel','松鼠'],['squirrelNest','三隻松鼠'],['mimic','寶箱怪'],['dropbear','掉落熊'],['zombies','殭屍群'],['eagle','老鷹'],['robot','機器人'],['twoCultists','兩名邪教徒'],['skeleton','骷髏戰士'],['bats','蝙蝠群'],['cyclops','獨眼巨人'],['twoPaladins','兩名聖騎士'],['werewolf','狼人'],['ronin','流浪武士'],['gargoyleParty','石像鬼與邪教徒'],['dragon','魔龍'],['bloodDemon','血魔'],['samurai','武士'],['kun','鯤'],['peng','鵬'],['obsidianCourt','無面教宗與雙石像鬼'],['cthulhu','克蘇魯'],['inquisitorParty','異端審判長與雙聖騎士'],
];
const DEVELOPER_EVENTS=[
  ['faithNecklaceIntro','第 0 層・信仰項鍊'],['shop','商店'],['rest','休息營地'],['ordinaryChurch','神教堂'],['darkChurch','邪教堂'],['ordinaryChurchBattle','破壞神教堂'],['darkChurchBattle','破壞邪教堂'],['squirrelNest','松鼠窩'],['ronin','流浪武士'],['treasureChest','神祕寶箱'],['bloodAltar','鮮血祭壇'],
];
const DEVELOPER_STATUS_FIELDS=[
  ['poison','☠ 中毒'],['virulence','☣️ 猛毒'],['corruption','🧟 腐敗'],['sepsis','🦠 敗血'],['bleed','🩸 流血'],['fracture','🦴 斷骨'],['burn','🔥 燒傷'],['trauma','🩹 創傷'],['blind','🌑 致盲'],['weakness','📉 虛弱'],['hesitation','🦫 遲疑'],['thirst','🩸 渴血'],['hallucination','🫥 幻覺'],['mentalDisorder','🌀 精神錯亂'],['paralysis','⚡ 麻痺'],['buffSuppressed','🌊 正面效果壓制'],['disciplineBrand','📿 戒律烙印'],['evasion','💨 閃避'],['broken','🪶 折翼'],['statusResist','✝️ 異常抗性'],
];
const DEVELOPER_PLAYER_STATUSES=new Set(['poison','virulence','corruption','sepsis','bleed','fracture','burn','trauma','blind','weakness','hesitation','thirst','hallucination','mentalDisorder','paralysis','buffSuppressed','disciplineBrand']);
const DEVELOPER_ENEMY_STATUSES=new Set(['poison','virulence','corruption','sepsis','bleed','fracture','burn','trauma','blind','weakness','hesitation','thirst','hallucination','mentalDisorder','evasion','broken','statusResist']);
function developerAllowed(){return !!(G&&G.developerMode);}
function developerMessage(message,error=false){const el=$('developer-message');if(!el)return;el.textContent=message;el.classList.toggle('error',error);}
function developerDirectNumber(id,{fallback=0,min=0,max=Number.MAX_SAFE_INTEGER,blank=undefined}={}){
  const raw=$(id).value.trim();if(raw===''&&blank!==undefined)return blank;const value=Number(raw);
  if(!Number.isFinite(value))return fallback;return Math.min(max,Math.max(min,Math.round(value)));
}
function developerStandardDeck(){const cards=[];for(const s of SUITS)for(const r of CARD_RANKS)cards.push({r,s,red:s==='♥'||s==='♦'});return cards;}
function developerRefreshGame(){
  renderTop();
  if(G.battle){ensureTarget();renderEnemies();updateHandUI();updateIncoming();syncButtons();}
  renderDeveloperConsole(false);
}
function openDeveloperConsole(){if(!developerAllowed())return;renderDeveloperConsole(true);$('developer-console').classList.remove('hidden');}
function closeDeveloperConsole(){$('developer-console').classList.add('hidden');}
function developerEnemy(){const b=G.battle;if(!b)return null;const idx=Number($('dev-enemy-target').value);return b.enemies.find(e=>e.idx===idx)||b.enemies[0]||null;}
function renderDeveloperEnemyFields(){
  const e=developerEnemy();if(!e)return;
  $('dev-enemy-hp').value=Math.max(0,e.curhp||0);$('dev-enemy-maxhp').value=Math.max(1,e.maxhp||1);$('dev-enemy-shield').value=Math.max(0,e.shield||0);$('dev-enemy-damage').value=Math.max(0,e.nextDmg||0);
}
function renderDeveloperConsole(resetMessage=false){
  if(!developerAllowed())return;
  if(resetMessage)developerMessage('直接修改不增加累計戰鬥與經濟統計；正常遊玩產生的後續結果仍會記錄。');
  $('dev-hp').value=G.hp;$('dev-maxhp').value=G.maxhp;$('dev-gold').value=G.gold;$('dev-control').value=G.control;$('dev-floor').value=G.floor;$('dev-faction').value=G.faction||0;
  $('dev-toggle-blood').textContent=G.bloodDescendant?'解除血魔':'成為血魔';
  if(!$('dev-passive-select').options.length)$('dev-passive-select').innerHTML=ALL_PASSIVES.map(p=>`<option value="${p.id}">${p.icon} ${escapeHtml(p.name)}</option>`).join('');
  if(!$('dev-affix-select').options.length)$('dev-affix-select').innerHTML='<option value="">無詞條</option>'+PASSIVE_AFFIXES.map(a=>`<option value="${a.id}">${a.icon} ${escapeHtml(a.name)}</option>`).join('');
  $('dev-passive-list').innerHTML=G.passives.length?G.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id),affix=PASSIVE_AFFIXES.find(a=>a.id===G.passiveAffixes[id]);return `<span class="developer-chip${G.upgrades.includes(id)?' up':''}">${p?.icon||'🎴'} ${escapeHtml(p?.name||id)}${affix?`｜${affix.icon}${escapeHtml(affix.name)}`:''}${G.upgrades.includes(id)?' ⭐':''}${G.sealedPassive===id?' 📦':''}</span>`;}).join(''):'<span class="muted">目前沒有被動。</span>';
  if(!$('dev-consumable-select').options.length)$('dev-consumable-select').innerHTML=CONSUMABLES.map(item=>`<option value="${item.id}">${item.icon} ${escapeHtml(item.name)}</option>`).join('');
  const devConsumableId=$('dev-consumable-select').value;$('dev-consumable-count').value=consumableCount(devConsumableId);
  const carriedConsumables=CONSUMABLES.filter(item=>consumableCount(item.id)>0);
  $('dev-consumable-list').innerHTML=carriedConsumables.length?carriedConsumables.map(item=>`<button type="button" class="developer-chip" data-dev-consumable="${item.id}">${item.icon} ${escapeHtml(item.name)} ×${consumableCount(item.id)}</button>`).join(''):'<span class="muted">目前沒有消耗品。</span>';
  $('dev-consumable-list').querySelectorAll('[data-dev-consumable]').forEach(btn=>btn.onclick=()=>{$('dev-consumable-select').value=btn.dataset.devConsumable;$('dev-consumable-count').value=consumableCount(btn.dataset.devConsumable);});
  if(!$('dev-card-rank').options.length)$('dev-card-rank').innerHTML=CARD_RANKS.map(r=>`<option value="${r}">${r}</option>`).join('');
  if(!$('dev-card-suit').options.length)$('dev-card-suit').innerHTML=SUITS.map(s=>`<option value="${s}">${s}</option>`).join('');
  $('dev-deck-list').innerHTML=G.deck.map((c,i)=>`<button type="button" class="mini-card${c.red?' red':''}" data-dev-card-index="${i}" title="點擊直接移除">${cardLabel(c)}${c.s}</button>`).join('')||'<span class="muted">牌庫為空。</span>';
  $('dev-deck-list').querySelectorAll('[data-dev-card-index]').forEach(btn=>btn.onclick=()=>{if(!developerAllowed())return;G.deck.splice(Number(btn.dataset.devCardIndex),1);developerMessage('已直接移除 1 張牌，不計入死亡報告。');developerRefreshGame();});
  if(!$('dev-encounter-select').options.length)$('dev-encounter-select').innerHTML=DEVELOPER_ENCOUNTERS.map(([id,name])=>`<option value="${id}">${escapeHtml(name)}</option>`).join('');
  if(!$('dev-event-select').options.length)$('dev-event-select').innerHTML=DEVELOPER_EVENTS.map(([id,name])=>`<option value="${id}">${escapeHtml(name)}</option>`).join('');
  if(!$('dev-status-select').options.length)$('dev-status-select').innerHTML=DEVELOPER_STATUS_FIELDS.map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
  const inBattle=!!(G.battle&&!G.battle.over),b=G.battle;
  $('dev-battle-unavailable').classList.toggle('hidden',inBattle);$('dev-battle-controls').classList.toggle('hidden',!inBattle);$('dev-status-unavailable').classList.toggle('hidden',inBattle);$('dev-status-controls').classList.toggle('hidden',!inBattle);
  if(inBattle){
    const oldTarget=$('dev-enemy-target').value;$('dev-enemy-target').innerHTML=b.enemies.map(e=>`<option value="${e.idx}">${escapeHtml(e.name)}｜HP ${Math.max(0,e.curhp)}/${e.maxhp}</option>`).join('');if([...$('dev-enemy-target').options].some(o=>o.value===oldTarget))$('dev-enemy-target').value=oldTarget;
    $('dev-status-target').innerHTML='<option value="player">玩家</option>'+b.enemies.map(e=>`<option value="enemy:${e.idx}">${escapeHtml(e.name)}</option>`).join('');
    $('dev-point-override').value=Number.isFinite(b.devPointOverride)?b.devPointOverride:'';$('dev-damage-override').value=Number.isFinite(b.devDamageOverride)?b.devDamageOverride:'';$('dev-defense-override').value=Number.isFinite(b.devDefenseOverride)?b.devDefenseOverride:'';$('dev-player-shield').value=Math.max(0,b.defense||0);renderDeveloperEnemyFields();
  }
  $('dev-runtime-info').textContent=`種子：${G.seedCode}\n亂數呼叫：${G.rngCalls||0}\n節點：${G.nodeType||'尚未決定'}\n存檔點：${G._floorCheckpoint?`第 ${G._floorCheckpoint.floor} 層`:'尚未建立'}\n戰鬥：${inBattle?`第 ${b.round} 回合｜${b.enemies.map(e=>e.name).join('、')}`:'無'}`;
}
function developerApplyPlayer(){
  if(!developerAllowed())return;G.maxhp=developerDirectNumber('dev-maxhp',{fallback:G.maxhp,min:1});G.hp=developerDirectNumber('dev-hp',{fallback:G.hp,min:0,max:G.maxhp});G.gold=developerDirectNumber('dev-gold',{fallback:G.gold,min:0});G.control=developerDirectNumber('dev-control',{fallback:G.control,min:0});G.faction=developerDirectNumber('dev-faction',{fallback:G.faction,min:-999999999,max:999999999});syncMiracleAlignment();developerMessage('已直接套用玩家數值；累計戰鬥與經濟統計未增加。');developerRefreshGame();
}
function developerJumpFloor(){
  if(!developerAllowed())return;const floor=developerDirectNumber('dev-floor',{fallback:G.floor,min:0,max:999999});closeDeveloperConsole();G.floor=floor;G.nodeType=null;G.nodeStarted=false;G.battle=null;G.restCrab=false;G._floorCheckpoint=null;G._developerSkipFloorStat=true;enterCurrentNode();
}
function developerToggleBlood(){if(!developerAllowed())return;G.bloodDescendant=!G.bloodDescendant;syncMiracleAlignment();developerMessage(G.bloodDescendant?'已直接切換為血魔。':'已直接解除血魔。');developerRefreshGame();}
function developerPassiveAdd(){
  if(!developerAllowed())return;const id=$('dev-passive-select').value,affix=$('dev-affix-select').value;if(!ALL_PASSIVES.some(p=>p.id===id))return;
  if(professionPassiveProtected(id)&&professionPassiveOwner(id)!==G.character){developerMessage('職業被動卡只能由所屬角色持有。',true);return;}
  if(!G.passives.includes(id)){G.passives.push(id);G.passivePaid[id]=0;}if(affix)G.passiveAffixes[id]=affix;else delete G.passiveAffixes[id];developerMessage(`已直接獲得／更新「${ALL_PASSIVES.find(p=>p.id===id).name}」。`);developerRefreshGame();
}
function developerPassiveUpgrade(){if(!developerAllowed())return;const id=$('dev-passive-select').value;if(!G.passives.includes(id)){developerMessage('請先取得該被動。',true);return;}const i=G.upgrades.indexOf(id);if(i>=0)G.upgrades.splice(i,1);else G.upgrades.push(id);developerMessage(`${ALL_PASSIVES.find(p=>p.id===id)?.name||id}：${i>=0?'已取消強化':'已強化'}。`);developerRefreshGame();}
function developerPassiveRemove(){
  if(!developerAllowed())return;const id=$('dev-passive-select').value,index=G.passives.indexOf(id);if(index<0){developerMessage('目前未持有該被動。',true);return;}if(professionPassiveProtected(id)){developerMessage('職業被動卡受最高保護，不能強制移除。',true);return;}const lostBlade=removeBladeForPassive(id);G.passives.splice(index,1);delete G.passivePaid[id];delete G.passiveAffixes[id];G.upgrades=G.upgrades.filter(x=>x!==id&&(id!=='doublebet'||x!=='doublebet2'));if(G.sealedPassive===id)G.sealedPassive=null;if(id==='suitmage')G.suitMastery=null;developerMessage(`已強制丟棄「${ALL_PASSIVES.find(p=>p.id===id)?.name||id}」，上鎖詞條亦可移除${lostBlade?'，對應刀具也已移除':''}。`);developerRefreshGame();
}
function developerConsumableAdd(){
  if(!developerAllowed())return;const id=$('dev-consumable-select').value,item=consumableInfo(id);if(!item)return;G.consumables=G.consumables||{};const before=consumableCount(id);G.consumables[id]=Math.min(CONSUMABLE_STACK_LIMIT,before+1);developerMessage(before>=CONSUMABLE_STACK_LIMIT?`${item.name} 已達 ${CONSUMABLE_STACK_LIMIT} 個上限。`:`已直接獲得 1 個${item.name}；不計入經濟統計。`,before>=CONSUMABLE_STACK_LIMIT);developerRefreshGame();
}
function developerConsumableSet(){
  if(!developerAllowed())return;const id=$('dev-consumable-select').value,item=consumableInfo(id);if(!item)return;const count=developerDirectNumber('dev-consumable-count',{fallback:consumableCount(id),min:0,max:CONSUMABLE_STACK_LIMIT});G.consumables=G.consumables||{};if(count>0)G.consumables[id]=count;else delete G.consumables[id];developerMessage(`已直接將${item.name}設為 ${count} 個；不計入經濟統計。`);developerRefreshGame();
}
function developerConsumableRemove(){
  if(!developerAllowed())return;const id=$('dev-consumable-select').value,item=consumableInfo(id);if(!item)return;G.consumables=G.consumables||{};delete G.consumables[id];developerMessage(`已直接移除所有${item.name}。`);developerRefreshGame();
}
function developerForceNode(type,isEvent){
  if(!developerAllowed())return;closeDeveloperConsole();G.battle=null;G.nodeStarted=false;G._floorCheckpoint=null;if(isEvent){G.nodeType=type;G._developerSkipEventStat=true;enterCurrentNode();}else{G.nodeType='battle';startBattle(`dev:${type}`);}
}
function developerApplyOverrides(){if(!developerAllowed()||!G.battle)return;const b=G.battle;b.devPointOverride=developerDirectNumber('dev-point-override',{fallback:null,min:0,blank:null});b.devDamageOverride=developerDirectNumber('dev-damage-override',{fallback:null,min:0,blank:null});b.devDefenseOverride=developerDirectNumber('dev-defense-override',{fallback:null,min:0,blank:null});b.defense=developerDirectNumber('dev-player-shield',{fallback:b.defense,min:0});developerMessage('已直接套用戰鬥覆寫與護盾；未記入死亡報告。');developerRefreshGame();}
function developerClearOverrides(){if(!developerAllowed()||!G.battle)return;delete G.battle.devPointOverride;delete G.battle.devDamageOverride;delete G.battle.devDefenseOverride;developerMessage('已清除點數、傷害與防禦覆寫。');developerRefreshGame();}
function developerApplyEnemy(kill=false){
  if(!developerAllowed()||!G.battle)return;const e=developerEnemy();if(!e)return;
  e.maxhp=developerDirectNumber('dev-enemy-maxhp',{fallback:e.maxhp,min:1});e.curhp=kill?0:developerDirectNumber('dev-enemy-hp',{fallback:e.curhp,min:0,max:e.maxhp});e.shield=developerDirectNumber('dev-enemy-shield',{fallback:e.shield,min:0});e.nextDmg=developerDirectNumber('dev-enemy-damage',{fallback:e.nextDmg,min:0});if(kill)e._developerNoDefeatStat=true;developerMessage(kill?`已直接將 ${e.name} HP 歸零；不計入擊殺統計。`:`已直接修改 ${e.name} 的數值。`);developerRefreshGame();
}
function developerStatusTarget(){const raw=$('dev-status-target').value;if(raw==='player')return {kind:'player',target:G.battle};const idx=Number(raw.split(':')[1]);return {kind:'enemy',target:G.battle.enemies.find(e=>e.idx===idx)};}
function developerSetStatus(){
  if(!developerAllowed()||!G.battle)return;const {kind,target}=developerStatusTarget(),key=$('dev-status-select').value,rawValue=Math.max(0,Number($('dev-status-value').value)||0),value=key==='statusResist'?Math.min(1,rawValue>1?rawValue/100:rawValue):Math.min(999999,Math.round(rawValue));if(!target)return;
  const allowed=kind==='player'?DEVELOPER_PLAYER_STATUSES:DEVELOPER_ENEMY_STATUSES;if(!allowed.has(key)){developerMessage('這個狀態不適用於所選對象。',true);return;}if(kind==='player'&&key==='poison')G.poison=value;else target[key]=value;if(key==='virulence')target.virulenceTicks=0;developerMessage(`已直接將${kind==='player'?'玩家':target.name}的狀態設為「${DEVELOPER_STATUS_FIELDS.find(x=>x[0]===key)?.[1]} ${value}」。`);developerRefreshGame();
}
function developerClearStatuses(){
  if(!developerAllowed()||!G.battle)return;const {kind,target}=developerStatusTarget();if(!target)return;const allowed=kind==='player'?DEVELOPER_PLAYER_STATUSES:DEVELOPER_ENEMY_STATUSES;allowed.forEach(key=>{if(kind==='player'&&key==='poison')G.poison=0;else target[key]=0;});developerMessage(`已直接清除${kind==='player'?'玩家':target.name}的可編輯狀態。`);developerRefreshGame();
}
function developerForceDeath(){if(!developerAllowed())return;closeDeveloperConsole();if(G.battle){G.battle.over=true;G.battle.busy=false;}G.hp=0;gameOver();}

function openCharacterSelect(){
  newGame();show('character');renderTop();
  $('character-seed').value=G.seedCode;
  $('character-list').innerHTML=CHARACTERS.map(c=>{
    const displayName=c.id==='samurai'?'（未完成）武士':c.name;
    const skills=c.passives.map(id=>{const p=ALL_PASSIVES.find(x=>x.id===id),name=c.id==='samurai'&&id==='firststrike'?'先發制人（刀具：無銘打刀）':p.name;return `<span>${p.icon} ${name}</span>`;}).join('')+(c.id==='magician'?'<span>＋ 起始飛刀／鐵板原子安裝為兩個不同花色術式</span>':'')+(c.id==='samurai'?'<span>＋ 見切、心流與納刀／居合</span>':'')+'<span>＋ 飛刀 ×1、鐵板 ×1</span>';
    return `<div class="character-card"><div class="character-icon">${c.icon}</div><div class="character-name">${displayName}</div><div class="character-desc">${c.desc}</div><div class="character-skills">${skills}</div><button class="b-next" data-character="${c.id}">選擇 ${displayName}</button></div>`;
  }).join('');
  $('character-list').querySelectorAll('[data-character]').forEach(btn=>btn.onclick=()=>{
    newGame(btn.dataset.character,$('character-seed').value);$('character-seed').value=G.seedCode;
    if(G.character==='magician')openMagicianStart();else openFaithNecklaceIntro();
  });
}
function openMagicianStart(){
  G._suitEnchantFlow={source:'startup',step:'startup',knifeSuit:null,plateSuit:null,cost:0};show('magician-start');renderSuitEnchantFlow();
}
function openSuitEnchantFlow(source,cost=0,remaining=1){
  G._suitEnchantFlow={source,step:source==='recovery'?'recovery':'item',cost:Math.max(0,Math.round(cost)),moveCost:price(BALANCE.suitEnchantWorkshop.moveBase),remaining:Math.max(1,Math.round(remaining)),itemId:null,suit:null,moveA:null,moveB:null};show('magician-start');renderSuitEnchantFlow();
}
function closeSuitEnchantFlow(){
  const flow=G._suitEnchantFlow;if(!flow)return;delete G._suitEnchantFlow;
  if(flow.source==='startup')openFaithNecklaceIntro();else{show('shop');renderShop();}
}
function suitEnchantBack(){
  const flow=G._suitEnchantFlow;if(!flow)return;
  if(flow.source==='startup'||flow.source==='recovery')return;
  if(flow.step==='confirm'){flow.step='suit';flow.suit=null;renderSuitEnchantFlow();}
  else if(flow.step==='suit'){flow.step='item';flow.itemId=null;renderSuitEnchantFlow();}
  else if(flow.step==='moveConfirm'){flow.step='moveB';flow.moveB=null;renderSuitEnchantFlow();}
  else if(flow.step==='moveB'){flow.step='moveA';flow.moveA=null;renderSuitEnchantFlow();}
  else if(flow.step==='moveA'){flow.step='item';renderSuitEnchantFlow();}
  else closeSuitEnchantFlow();
}
function renderSuitEnchantFlow(){
  const flow=G._suitEnchantFlow;if(!flow)return;const list=$('magician-start-list'),startup=flow.source==='startup',carried=CONSUMABLES.filter(item=>consumableCount(item.id)>0);
  $('suit-enchant-title').textContent=startup?'🎭 起始術式安裝':flow.source==='recovery'?'🎭 舊存檔術式修復':'🎭 花色附魔工房';
  if(flow.step==='startup'){
    $('suit-enchant-desc').textContent='先將飛刀（攻擊術式）與鐵板（防禦術式）分配到兩個不同花色；按下最終確認後才會一起消耗，不能略過。';
    const chooser=(id,label,selected)=>`<div class="starter-choice"><div class="starter-name">${label}</div><div class="starter-desc">${SUIT_ENCHANT_EFFECTS[id]}</div><div class="btns">${SUITS.map(s=>`<button class="${selected===s?'b-magic':'b-ghost'}" data-start-item="${id}" data-start-suit="${s}">${s}${suitName(s)}</button>`).join('')}</div></div>`;
    const valid=SUITS.includes(flow.knifeSuit)&&SUITS.includes(flow.plateSuit)&&flow.knifeSuit!==flow.plateSuit&&consumableCount('throwingKnife')>0&&consumableCount('ironPlate')>0;
    list.innerHTML=chooser('throwingKnife','🗡️ 飛刀',flow.knifeSuit)+chooser('ironPlate','🛡️ 鐵板',flow.plateSuit)+`<div class="starter-choice selected"><div class="starter-name">原子確認</div><div class="starter-desc">${flow.knifeSuit?`飛刀 → ${flow.knifeSuit}${suitName(flow.knifeSuit)}`:'尚未選擇飛刀花色'}｜${flow.plateSuit?`鐵板 → ${flow.plateSuit}${suitName(flow.plateSuit)}`:'尚未選擇鐵板花色'}</div><button class="b-magic" data-start-confirm="1"${valid?'':' disabled'}>確認並同時安裝</button></div>`;
    list.querySelectorAll('[data-start-item]').forEach(btn=>btn.onclick=()=>{if(btn.dataset.startItem==='throwingKnife')flow.knifeSuit=btn.dataset.startSuit;else flow.plateSuit=btn.dataset.startSuit;renderSuitEnchantFlow();});
    const confirm=list.querySelector('[data-start-confirm]');if(confirm)confirm.onclick=confirmMagicianStartup;return;
  }
  if(flow.step==='recovery'){
    const installed=new Set(Object.values(G.suitEnchantments||{}).map(id=>SUIT_SPELL_DEFS[id]?.type)),needAttack=!installed.has('attack'),needDefense=!installed.has('defense');
    if(!needAttack&&!needDefense){G.suitEnchantRecoveryPending=false;closeSuitEnchantFlow();return;}
    const id=needAttack?'throwingKnife':'ironPlate',item=consumableInfo(id);$('suit-enchant-desc').textContent='舊魔術師存檔缺少必要的攻擊或防禦術式。系統提供僅供安裝的補發道具，不會加入背包；完成缺項後才可離開。';
    list.innerHTML=SUITS.map(s=>`<div class="starter-choice"><div class="starter-icon">${s}</div><div class="starter-name">${item.icon}${item.name} → ${s}${suitName(s)}</div><div class="starter-desc">${SUIT_ENCHANT_EFFECTS[id]}${G.suitEnchantments?.[s]?`｜將覆蓋 ${consumableInfo(G.suitEnchantments[s])?.name}`:''}</div><button class="b-magic" data-recovery-suit="${s}">安裝缺少術式</button></div>`).join('');
    list.querySelectorAll('[data-recovery-suit]').forEach(btn=>btn.onclick=()=>{G.suitEnchantments[btn.dataset.recoverySuit]=id;renderSuitEnchantFlow();});return;
  }
  if(flow.step==='item'){
    $('suit-enchant-desc').textContent=`選擇消耗品以新附魔／覆蓋（${flow.cost} 金幣），或支付 ${flow.moveCost} 金幣移動／交換兩個花色的既有術式。確認前不會消耗資源。`;
    list.innerHTML=carried.map(item=>`<div class="starter-choice"><div class="starter-icon">${item.icon}</div><div class="starter-name">${item.name} ×${consumableCount(item.id)}</div><div class="starter-desc">${SUIT_ENCHANT_EFFECTS[item.id]}</div><button class="b-magic" data-enchant-item="${item.id}">新附魔／覆蓋</button></div>`).join('')+`<div class="starter-choice"><div class="starter-name">🔁 術式移位</div><div class="starter-desc">交換兩個花色（可與空槽交換），費用 ${flow.moveCost} 金幣。</div><button class="b-magic" data-enchant-move="1">選擇來源</button></div><div class="starter-choice"><div class="starter-name">返回</div><div class="starter-desc">不消耗任何資源並返回商店。</div><button class="b-ghost" data-enchant-back="1">退出附魔工房</button></div>`;
    list.querySelectorAll('[data-enchant-item]').forEach(button=>button.onclick=()=>{flow.itemId=button.dataset.enchantItem;flow.step='suit';renderSuitEnchantFlow();});
    list.querySelector('[data-enchant-move]').onclick=()=>{flow.step='moveA';renderSuitEnchantFlow();};
  }else if(flow.step==='moveA'||flow.step==='moveB'){
    const choosingA=flow.step==='moveA';$('suit-enchant-desc').textContent=choosingA?'選擇要移動的術式來源花色。':'選擇目的花色；兩槽內容會交換。';
    list.innerHTML=SUITS.map(s=>{const item=consumableInfo(G.suitEnchantments?.[s]);const disabled=choosingA?!item:s===flow.moveA;return `<div class="starter-choice"><div class="starter-name">${s}${suitName(s)}：${item?`${item.icon}${item.name}`:'空槽'}</div><button class="b-magic" data-move-suit="${s}"${disabled?' disabled':''}>選擇</button></div>`;}).join('')+'<button class="b-ghost" data-enchant-back="1">返回</button>';
    list.querySelectorAll('[data-move-suit]').forEach(btn=>btn.onclick=()=>{if(choosingA){flow.moveA=btn.dataset.moveSuit;flow.step='moveB';}else{flow.moveB=btn.dataset.moveSuit;flow.step='moveConfirm';}renderSuitEnchantFlow();});
  }else if(flow.step==='moveConfirm'){
    const a=consumableInfo(G.suitEnchantments?.[flow.moveA]),c=consumableInfo(G.suitEnchantments?.[flow.moveB]);$('suit-enchant-desc').textContent='最終確認後才會扣除金幣。';list.innerHTML=`<div class="starter-choice selected"><div class="starter-name">${flow.moveA}${a?.name||'空槽'} ↔ ${flow.moveB}${c?.name||'空槽'}</div><div class="starter-desc">費用 ${flow.moveCost} 金幣</div><button class="b-magic" data-move-confirm="1"${G.gold<flow.moveCost?' disabled':''}>確認移位</button></div><button class="b-ghost" data-enchant-back="1">返回</button>`;list.querySelector('[data-move-confirm]').onclick=confirmSuitMove;
  }else if(flow.step==='suit'){
    const item=consumableInfo(flow.itemId);if(!item||!consumableCount(item.id)){flow.step='item';flow.itemId=null;renderSuitEnchantFlow();return;}
    $('suit-enchant-desc').textContent=`第二步：選擇「${item.name}」要附魔的花色。每個花色都會顯示目前附魔。`;
    list.innerHTML=SUITS.map(suit=>{const old=G.suitEnchantments&&consumableInfo(G.suitEnchantments[suit]);const same=old?.id===item.id;return `<div class="starter-choice"><div class="starter-icon">${suit}</div><div class="starter-name">${suitName(suit)}</div><div class="starter-desc">目前附魔：${old?`${old.icon} ${old.name}（${SUIT_ENCHANT_EFFECTS[old.id]}）`:'無'}</div><button class="b-magic" data-enchant-suit="${suit}"${same?' disabled':''}>${same?'已是相同術式':`選擇${suitName(suit)}`}</button></div>`;}).join('')+'<div class="starter-choice"><div class="starter-name">返回上一步</div><div class="starter-desc">重新選擇消耗品，不消耗任何資源。</div><button class="b-ghost" data-enchant-back="1">返回選擇道具</button></div>';
    list.querySelectorAll('[data-enchant-suit]').forEach(button=>button.onclick=()=>{flow.suit=button.dataset.enchantSuit;flow.step='confirm';renderSuitEnchantFlow();});
  }else{
    const item=consumableInfo(flow.itemId),old=G.suitEnchantments&&consumableInfo(G.suitEnchantments[flow.suit]);if(!item||!SUITS.includes(flow.suit)||!consumableCount(item.id)){flow.step='item';flow.itemId=null;flow.suit=null;renderSuitEnchantFlow();return;}
    $('suit-enchant-desc').textContent='第三步：確認附魔。只有按下確認後才會消耗道具與金錢。';
    list.innerHTML=`<div class="starter-choice selected"><div class="starter-icon">${flow.suit}</div><div class="starter-name">${flow.suit}${suitName(flow.suit)}：${old?`${old.icon}${old.name}`:'無'} → ${item.icon}${item.name}</div><div class="starter-desc">新效果：${SUIT_ENCHANT_EFFECTS[item.id]}${startup?'｜開局免金幣':`｜費用 ${flow.cost} 金幣`}</div><button class="b-magic" data-enchant-confirm="1"${!startup&&G.gold<flow.cost?' disabled':''}>${!startup&&G.gold<flow.cost?'金幣不足':'確認並附魔'}</button></div><div class="starter-choice"><div class="starter-name">返回上一步</div><div class="starter-desc">返回花色選擇，不消耗任何資源。</div><button class="b-ghost" data-enchant-back="1">返回選擇花色</button></div>`;
    list.querySelector('[data-enchant-confirm]').onclick=confirmSuitEnchant;
  }
  list.querySelectorAll('[data-enchant-back]').forEach(button=>button.onclick=suitEnchantBack);
}
function confirmMagicianStartup(){
  const flow=G._suitEnchantFlow;if(!flow||flow.source!=='startup'||flow.knifeSuit===flow.plateSuit||!SUITS.includes(flow.knifeSuit)||!SUITS.includes(flow.plateSuit)||consumableCount('throwingKnife')<1||consumableCount('ironPlate')<1)return;
  removeConsumable('throwingKnife');removeConsumable('ironPlate');G.suitEnchantments[flow.knifeSuit]='throwingKnife';G.suitEnchantments[flow.plateSuit]='ironPlate';G.suitEnchantStartupDone=true;SFX.coin();closeSuitEnchantFlow();
}
function confirmSuitMove(){
  const flow=G._suitEnchantFlow;if(!flow||flow.step!=='moveConfirm'||!SUITS.includes(flow.moveA)||!SUITS.includes(flow.moveB)||flow.moveA===flow.moveB||!G.suitEnchantments?.[flow.moveA]||G.gold<flow.moveCost)return;
  const a=G.suitEnchantments[flow.moveA],b=G.suitEnchantments[flow.moveB];G.gold-=flow.moveCost;markLuckyDiscountPurchase(flow.moveCost);if(b)G.suitEnchantments[flow.moveA]=b;else delete G.suitEnchantments[flow.moveA];G.suitEnchantments[flow.moveB]=a;SFX.coin();flow.step='item';flow.moveA=null;flow.moveB=null;renderTop();renderSuitEnchantFlow();
}
function confirmSuitEnchant(){
  const flow=G._suitEnchantFlow,item=flow&&consumableInfo(flow.itemId);if(!flow||flow.step!=='confirm'||!item||!SUITS.includes(flow.suit)||!consumableCount(item.id)||flow.source!=='startup'&&G.gold<flow.cost)return;
  const old=G.suitEnchantments&&consumableInfo(G.suitEnchantments[flow.suit]);if(old?.id===item.id)return;if(flow.source!=='startup'){G.gold-=flow.cost;markLuckyDiscountPurchase(flow.cost);}removeConsumable(item.id);G.suitEnchantments=G.suitEnchantments||{};G.suitEnchantments[flow.suit]=item.id;SFX.coin();
  setSaveStatus(`${flow.suit}${suitName(flow.suit)}：${old?old.name:'無'} → ${item.name}。`);renderTop();
  flow.step='item';flow.itemId=null;flow.suit=null;renderSuitEnchantFlow();
}

$('btn-hit').onclick=hit;
$('btn-stand').onclick=attack;
$('btn-defend').onclick=defend;
$('btn-mikiri').onclick=samuraiMikiri;
$('btn-sheath').onclick=samuraiSheath;
$('btn-ultimate').onclick=useSamuraiUltimate;
$('btn-consumables').onclick=openConsumableBag;
$('consumable-bag-close').onclick=closeConsumableBag;
$('btn-enemy-info').onclick=openEnemyInfo;
$('enemy-info-close').onclick=closeEnemyInfo;
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
$('ui-blades').onclick=openBladeViewer;
$('blade-viewer-close').onclick=closeBladeViewer;
$('blade-forge-close').onclick=closeBladeForge;
$('blade-forge-detail-close').onclick=closeBladeForgeDetail;
$('blade-forge-detail').onclick=event=>{if(event.target===event.currentTarget)closeBladeForgeDetail();};
$('ui-seed').onclick=()=>G.developerMode?openDeveloperConsole():copySeedCode();
$('developer-close').onclick=closeDeveloperConsole;
$('dev-apply-player').onclick=developerApplyPlayer;
$('dev-jump-floor').onclick=developerJumpFloor;
$('dev-toggle-blood').onclick=developerToggleBlood;
$('dev-restore-control').onclick=()=>{if(!developerAllowed())return;G.control=BALANCE.controlMax;developerMessage('控制值已直接回滿。');developerRefreshGame();};
$('dev-force-death').onclick=developerForceDeath;
$('dev-passive-add').onclick=developerPassiveAdd;
$('dev-passive-upgrade').onclick=developerPassiveUpgrade;
$('dev-passive-remove').onclick=developerPassiveRemove;
$('dev-consumable-select').onchange=()=>{$('dev-consumable-count').value=consumableCount($('dev-consumable-select').value);};
$('dev-consumable-add').onclick=developerConsumableAdd;
$('dev-consumable-set').onclick=developerConsumableSet;
$('dev-consumable-remove').onclick=developerConsumableRemove;
$('dev-card-add').onclick=()=>{if(!developerAllowed())return;let rank=$('dev-card-rank').value;if(/^\d+$/.test(rank))rank=Number(rank);const suit=$('dev-card-suit').value;G.deck.push({r:rank,s:suit,red:suit==='♥'||suit==='♦'});developerMessage(`已直接加入 ${rank}${suit}。`);developerRefreshGame();};
$('dev-deck-standard').onclick=()=>{if(!developerAllowed())return;G.deck=developerStandardDeck();developerMessage('已直接重設為未洗牌的標準 52 張牌庫，不消耗種子亂數。');developerRefreshGame();};
$('dev-deck-clear').onclick=()=>{if(!developerAllowed())return;G.deck=[];developerMessage('已直接清空牌庫。');developerRefreshGame();};
$('dev-force-encounter').onclick=()=>developerForceNode($('dev-encounter-select').value,false);
$('dev-force-event').onclick=()=>developerForceNode($('dev-event-select').value,true);
$('dev-apply-overrides').onclick=developerApplyOverrides;
$('dev-clear-overrides').onclick=developerClearOverrides;
$('dev-enemy-target').onchange=renderDeveloperEnemyFields;
$('dev-apply-enemy').onclick=()=>developerApplyEnemy(false);
$('dev-kill-enemy').onclick=()=>developerApplyEnemy(true);
$('dev-status-apply').onclick=developerSetStatus;
$('dev-status-clear-target').onclick=developerClearStatuses;
$('dev-reroll-intents').onclick=()=>{if(!developerAllowed()||!G.battle||G.battle.over){developerMessage('目前沒有可重骰的戰鬥。',true);return;}rollIntents();developerMessage('已消耗種子亂數並重骰敵方行動。');developerRefreshGame();};
$('dev-capture-checkpoint').onclick=()=>{if(!developerAllowed())return;captureFloorCheckpoint();developerMessage(`已用目前直接修改後的狀態重建第 ${G.floor} 層存檔點；死亡報告統計仍未增加。`);renderDeveloperConsole(false);};
$('seed-randomize').onclick=()=>{$('character-seed').value=generateSeedCode();};
$('rank-damage-close').onclick=closeRankDamage;
$('codex-tab-passives').onclick=()=>setCodexTab('passives');
$('codex-tab-status').onclick=()=>setCodexTab('status');
$('codex-tab-consumables').onclick=()=>setCodexTab('consumables');
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
$('lucky-number-confirm').onclick=confirmLuckyNumber;
$('suitforge-close').onclick=closeSuitForge;
$('ronin-beheading-accept').onclick=()=>resolveRoninBeheadingChoice(true);
$('ronin-beheading-refuse').onclick=()=>resolveRoninBeheadingChoice(false);

openCharacterSelect();
