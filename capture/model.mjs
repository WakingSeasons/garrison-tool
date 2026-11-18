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
  const out={alliances:[],types:[],conflictFields:{}};
  for(const key of ['mode','difficulty','level','boss']) {
    const values=[...new Set(results.map(r=>r[key]).filter(v=>v!==null&&v!==undefined&&v!==''))];
    out[key]=values.length===1?values[0]:null;
    if(values.length>1)out.conflictFields[key]=true;
  }
  const sets=results.map(r=>r.types||[]).filter(a=>a.length);
  if(sets.length>1&&sets.every(a=>a.length>=2)&&sets.some(a=>a.some(t=>!sets[0].includes(t))))out.conflictFields.types=true;
  out.types=[...new Set(results.flatMap(r=>r.types||[]))];
  const map=new Map(),conflicting=new Set();
  for(const a of results.flatMap(r=>r.alliances||[])){
    const old=map.get(a.name);
    if(!old)map.set(a.name,{...a});
    else if(conflicting.has(a.name))continue;
    else if(a.state!=='uncertain'&&old.state!=='uncertain'&&old.state!==a.state){conflicting.add(a.name);map.set(a.name,{...a,state:'uncertain'});}
    else if(old.state==='uncertain')map.set(a.name,{...a});
  }
  if(conflicting.size)out.conflictFields.alliances=[...conflicting];
  out.alliances=[...map.values()];
  return assessResult(out);
}
export function assessResult(value) {
  const out={...value,types:[...new Set(value.types||[])],alliances:(value.alliances||[]).map(a=>({...a})),conflictFields:{...value.conflictFields},missing:[],conflicts:[]};
  if(value.conflicts?.length&&!value.conflictFields)out.conflicts=[...value.conflicts];
  for(const [key,label]of [['mode','模拟方式'],['difficulty','难度'],['level','等级'],['boss','Boss'],['types','特训类别']])if(out.conflictFields[key])out.conflicts.push(label+'信息冲突，请手动确认。');
  for(const name of out.conflictFields.alliances||[])out.conflicts.push(name+'状态不同，请手动确认。');
  if(!out.boss)out.missing.push('Boss');
  const expected=out.mode==='独立模拟'?2:out.mode==='同盟模拟'?3:0;
  if(!expected)out.missing.push('模式未指定：已识别 '+out.types.length+' 类特训，未核对总数（可补选模式）');
  else if(out.types.length<expected)out.missing.push('特训敌人（'+out.types.length+'/'+expected+'）');
  else if(out.types.length>expected)out.conflicts.push(out.mode+'应为 '+expected+' 类特训，当前勾选 '+out.types.length+' 类，请修正。');
  for(const [label,names]of [['核心盟约',CORE],['附加盟约',ADDON]]){
    const missing=names.filter(n=>!out.alliances.some(a=>a.name===n&&['active','inactive'].includes(a.state)));
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
  const lines=['卫戍协议·规程 · 本局识别结果','', '模拟方式：'+(r.mode||'未指定（可选）'),'难度：'+(r.difficulty||'未指定（可选）'),'Boss：'+(r.boss||'未识别'),'特训敌人：'+(r.types.join('、')||'未识别')+(!r.mode?'（模式未指定，数量未核对）':''),''];
  if(r.manualFields?.length)lines.push('手动修正：'+r.manualFields.join('、'),'');
  for(const [title,names]of [['核心盟约',CORE],['附加盟约',ADDON]]) {
    lines.push(title);
    for(const[state,label]of [['active','点亮'],['inactive','置灰'],['uncertain','待确认']]){
      const found=r.alliances.filter(a=>names.includes(a.name)&&a.state===state).map(a=>a.name);
      if(found.length)lines.push('  '+label+'：'+found.join('、'));
    }
    const unseen=names.filter(n=>!r.alliances.some(a=>a.name===n));if(unseen.length)lines.push('  未识别：'+unseen.join('、'));lines.push('');
  }
  if(r.conflicts.length)lines.push('⚠ 图片信息冲突',...r.conflicts.map(s=>'  '+s),'冲突项目不会覆盖原设置；可展开「修正／补全」确认，其他确认内容仍可套用。','');
  if(r.missing.length)lines.push('以下信息尚未识别或待确认（不一定是截图缺失）',...r.missing.map(s=>'  待确认：'+s),'可先套用已识别内容，或展开「修正／补全」对照原图填写。',count<2?'也可补一张同局截图，拍清对应位置。':'已达到两张上限；如需补图，请先移除一张。','两张截图应来自同一局、同一次盟约选择。','');
  else if(!r.conflicts.length)lines.push('本次基础字段已齐全，请对照原图核对。','');
  lines.push('套用只更新确认字段；未识别的项目沿用原设置并标记待核对。标记对象的 BAN 状态按盟约推断，尚未直接识别禁用干员头像名单，请对照游戏核对。');
  return lines.join('\n');
}
