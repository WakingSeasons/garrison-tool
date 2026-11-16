export const CORE = ['炎','萨尔贡','维多利亚','谢拉格','阿戈尔','叙拉古','卡西米尔','乌萨斯','伊比利亚','莱塔尼亚'];
export const ADDON = ['精准','迅捷','灵巧','坚守','助力','远见','奇迹','投资人','突袭','不屈','调和','协防干员','独行','绝技','聚合','奥术'];
export const BOSSES = ['假想敌：胄','假想敌：铳','假想敌：管','盐风主教昆图斯','阿利斯泰尔，帝国余晖','萨米的意志','假想敌：械','假想敌：茧','假想敌：鳍','矩兽'];
export const TYPES = ['特异','飞行','频次','元素','持续','隐匿','折射','致命','复苏'];
export const clean = text => String(text || '').replace(/[\s·:：，,。“”\-_|]/g,'');
export function parseOcrLines(lines) {
  const r={mode:null,difficulty:null,level:null,boss:null,types:[],alliances:[],raw:lines.map(l=>l.text).join('\n')};
  for (const line of lines) {
    const s=clean(line.text);
    const level=s.match(/规程等级(\d{1,2})/);
    if(level && +level[1]>=1 && +level[1]<=20){r.mode='独立模拟';r.level=+level[1];r.difficulty='规程等级'+r.level;}
    for(const d of ['标准模拟','险境模拟','绝境模拟','终极模拟','极速模拟']) if(s.includes(d)){r.difficulty=d;r.mode=d==='极速模拟'?'独立模拟':'同盟模拟';}
    for(const b of BOSSES) if(s.includes(clean(b)))r.boss=b;
    if(s.includes('特训敌人')||line.kind==='type') for(const t of TYPES) if(s.includes(t)&&!r.types.includes(t))r.types.push(t);
    for(const name of [...CORE,...ADDON]) if(s===name||s==='附加盟约'+name)r.alliances.push({name,state:line.state||'uncertain',bbox:line.bbox,confidence:line.confidence});
  }
  return r;
}
export function mergeResults(results) {
  const out={alliances:[],types:[],conflicts:[],missing:[],complete:false};
  for(const key of ['mode','difficulty','level','boss']) {
    const values=[...new Set(results.map(r=>r[key]).filter(v=>v!==null&&v!==undefined&&v!==''))];
    out[key]=values.length===1?values[0]:null;
    if(values.length>1)out.conflicts.push(({mode:'模拟方式',difficulty:'难度',level:'等级',boss:'Boss'})[key]+'不同：'+values.join(' / '));
  }
  const typeSets=results.map(r=>r.types||[]).filter(a=>a.length);
  if(typeSets.length>1&&typeSets.every(a=>a.length>=2)&&typeSets.some(a=>a.some(t=>!typeSets[0].includes(t))))out.conflicts.push('特训敌人类型不一致，请确认两张截图来自同一局。');
  out.types=[...new Set(results.flatMap(r=>r.types||[]))];
  const map=new Map();
  for(const a of results.flatMap(r=>r.alliances||[])){
    const old=map.get(a.name);
    if(!old)map.set(a.name,{...a});
    else if(old.state==='conflict')continue;
    else if(a.state!=='uncertain'&&old.state!=='uncertain'&&old.state!==a.state){map.set(a.name,{...a,state:'conflict'});out.conflicts.push(a.name+'状态不同，请确认是否切换了选择或混入另一局。');}
    else if(old.state==='uncertain')map.set(a.name,{...a});
  }
  out.alliances=[...map.values()].map(a=>({...a,state:a.state==='conflict'?'uncertain':a.state}));
  if(!out.mode||!out.difficulty)out.missing.push('模拟方式 / 难度');
  if(!out.boss)out.missing.push('Boss');
  const expected=out.mode==='独立模拟'?2:3;
  if(out.types.length<expected)out.missing.push('特训敌人（'+out.types.length+'/'+expected+'）');
  for(const [label,names]of [['核心盟约',CORE],['附加盟约',ADDON]]){
    const missing=names.filter(n=>!out.alliances.some(a=>a.name===n&&a.state!=='uncertain'));
    if(missing.length)out.missing.push(label+'：'+missing.join('、'));
  }
  out.complete=!out.missing.length&&!out.conflicts.length;
  return out;
}
export function validateFiles(files,current=0) {
  if(files.length+current>2)return '每局最多上传两张截图。请先移除一张再添加。';
  if(files.some(f=>!['image/png','image/jpeg','image/webp','image/bmp'].includes(f.type)))return '请选择 PNG、JPG、WebP 或 BMP 图片。';
  if(files.some(f=>f.size>20*1024*1024))return '单张图片请小于 20 MB。';
  return '';
}
export function formatReport(r,count) {
  const lines=['卫戍协议·规程 · 本局识别结果','', '模拟方式：'+(r.mode||'未识别'),'难度：'+(r.difficulty||'未识别'),'Boss：'+(r.boss||'未识别'),'特训敌人：'+(r.types.join('、')||'未识别'),''];
  for(const [title,names]of [['核心盟约',CORE],['附加盟约',ADDON]]) {
    lines.push(title);
    for(const[state,label]of [['active','点亮'],['inactive','置灰'],['uncertain','待确认']]){
      const found=r.alliances.filter(a=>names.includes(a.name)&&a.state===state).map(a=>a.name);
      if(found.length)lines.push('  '+label+'：'+found.join('、'));
    }
    const unseen=names.filter(n=>!r.alliances.some(a=>a.name===n));if(unseen.length)lines.push('  未识别：'+unseen.join('、'));lines.push('');
  }
  if(r.conflicts.length)lines.push('⚠ 图片信息冲突',...r.conflicts.map(s=>'  '+s),'请移除不同局的截图；冲突消除前不使用合并结果。','');
  if(r.missing.length)lines.push(count<2?'需要补充第 2 张截图':'已达到两张上限，请替换拍摄不全的截图',...r.missing.map(s=>'  缺少 / 待确认：'+s),'建议：第一张保留左上角难度、完整核心盟约和右侧敌方信息；第二张向下滚动，拍全附加盟约名称。两张保留一些重叠盟约。','');
  else if(!r.conflicts.length)lines.push('本次基础字段已齐全，请对照原图核对。','');
  lines.push('可将上述盟约状态套用到 Wiki 的本局 BAN 位，并更新敌方资料的本局筛选。标记对象的 BAN 状态按盟约推断，尚未直接识别画面底部的禁用干员名单，请对照游戏核对。');
  return lines.join('\n');
}
