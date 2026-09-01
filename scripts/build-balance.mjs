import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const scriptDir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(scriptDir,'..');
const files={
  base:'data/base-stats.json',
  enemies:'data/enemies.json',
  mixedFormations:'data/mixed-formations.json',
};

const data={};
for(const [key,relative] of Object.entries(files)){
  data[key]=JSON.parse(await readFile(path.join(root,relative),'utf8'));
}

const positive=(value,label)=>{
  if(!Number.isFinite(value)||value<=0)throw new Error(`${label} 必須是正數`);
};
const roundHalfEven=(value,digits=3)=>{
  const factor=10**digits,scaled=value*factor,lower=Math.floor(scaled),fraction=scaled-lower;
  const tolerance=Number.EPSILON*Math.max(1,Math.abs(scaled))*4;
  const rounded=fraction>0.5+tolerance?lower+1:fraction<0.5-tolerance?lower:(lower%2===0?lower:lower+1);
  return rounded/factor;
};
const threeDecimals=(value,label)=>{
  positive(value,label);
  if(Math.abs(value-roundHalfEven(value))>1e-12)throw new Error(`${label} 必須以四捨六入五成雙保留至小數點後第 3 位`);
};
const exactKeys=(value,allowed,label)=>{
  const unexpected=Object.keys(value).filter(key=>!allowed.includes(key));
  if(unexpected.length)throw new Error(`${label} 含有不屬於基礎數值的欄位：${unexpected.join('、')}`);
};
threeDecimals(data.base.reference?.hp,'reference.hp');
threeDecimals(data.base.reference?.attack,'reference.attack');
for(const [rank,values] of Object.entries(data.base.rankMultipliers||{})){
  threeDecimals(values.hp,`rankMultipliers.${rank}.hp`);
  threeDecimals(values.attack,`rankMultipliers.${rank}.attack`);
}
for(const [key,value] of Object.entries(data.base.heightMultipliers||{}))threeDecimals(value,`heightMultipliers.${key}`);
for(const [key,value] of Object.entries(data.base.sameSpeciesFormation||{}))threeDecimals(value,`sameSpeciesFormation.${key}`);

for(const [key,enemy] of Object.entries(data.enemies)){
  // 敵人被動與技能倍率（如心流、北冥潮）必須留在遊戲邏輯，不得寫進基礎數值表。
  exactKeys(enemy,['rank','hp','attack'],key);
  const rank=data.base.rankMultipliers?.[enemy.rank];
  if(!rank)throw new Error(`${key} 使用不存在的階級 ${enemy.rank}`);
  threeDecimals(enemy.hp,`${key}.hp`);
  if(!Array.isArray(enemy.attack)||enemy.attack.length!==2)throw new Error(`${key}.attack 必須是兩項陣列`);
  enemy.attack.forEach((value,index)=>threeDecimals(value,`${key}.attack[${index}]`));
  if(enemy.attack[0]>enemy.attack[1])throw new Error(`${key}.attack 下限不可高於上限`);
}

for(const [formation,members] of Object.entries(data.mixedFormations)){
  for(const [key,mult] of Object.entries(members)){
    exactKeys(mult,['hp','attack'],`${formation}.${key}`);
    if(!data.enemies[key])throw new Error(`${formation} 引用了不存在的敵人 ${key}`);
    threeDecimals(mult.hp,`${formation}.${key}.hp`);
    threeDecimals(mult.attack,`${formation}.${key}.attack`);
  }
}

const banner='// 此檔案由 scripts/build-balance.mjs 依三個 data/*.json 自動產生，請勿直接編輯。\n';
const output=`${banner}window.BLACKJACK_BALANCE_DATA=${JSON.stringify(data)};\n`;
await writeFile(path.join(root,'balance-data.js'),output,'utf8');
console.log(`已編譯 ${Object.keys(data.enemies).length} 種敵人與 ${Object.keys(data.mixedFormations).length} 組混合編隊。`);
