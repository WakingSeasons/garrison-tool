import {CORE,ADDON,BOSSES,TYPES,assessResult} from './model.mjs?v=1.1.0';
const $=id=>document.getElementById('capture-'+id);
let current=null,changed=()=>{};
function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
function option(value,text){const el=node('option','',text);el.value=value;return el;}
function selectField(key,label,options){
  const wrap=node('label','capture-edit-field'),select=node('select');select.dataset.editField=key;select.setAttribute('aria-label','修正'+label);
  select.append(option('',key==='mode'?'模式未指定':key==='difficulty'?'难度未指定（可选）':'未识别／暂不填写'),...options.map(([v,t])=>option(v,t)));
  select.value=current.conflictFields[key]?'':current[key]||'';wrap.append(node('span','',label+(current.conflictFields[key]?' · 冲突待确认':'')),select);return wrap;
}
function render(){
  const fields=$('editor-fields');fields.replaceChildren();if(!current)return;
  const grid=node('div','capture-edit-grid');
  grid.append(selectField('mode','模拟方式',[['独立模拟','独立模拟 · 两类特训'],['同盟模拟','同盟模拟 · 三类特训']]),selectField('boss','Boss',BOSSES.map(n=>[n,n])));
  grid.append(selectField('difficulty','难度',[...Array.from({length:20},(_,i)=>['规程等级'+(i+1),'规程等级'+(i+1)]),...['标准模拟','险境模拟','绝境模拟','终极模拟','极速模拟'].map(n=>[n,n])]));
  fields.append(grid,node('p','capture-note','暂停页可不填难度。模式未知时不推定为同盟；补选模式仅核对特训数量。'));
  const types=node('fieldset','capture-edit-types');types.append(node('legend','','特训类别'+(current.conflictFields.types?' · 冲突待确认':'')));
  const choices=node('div','capture-type-choices');for(const name of TYPES){const label=node('label'),input=node('input');input.type='checkbox';input.dataset.editType=name;input.checked=current.types.includes(name);label.append(input,document.createTextNode(name));choices.append(label);}types.append(choices);
  const confirm=node('button','text-button','确认当前勾选的类别');confirm.type='button';confirm.dataset.confirmTypes='';confirm.hidden=!current.conflictFields.types;types.append(confirm);fields.append(types);
  const alliances=node('details','capture-edit-alliances');const summary=node('summary','','盟约状态 · '+current.alliances.filter(a=>['active','inactive'].includes(a.state)).length+'/26 已确认');alliances.append(summary);
  for(const [label,names]of [['核心盟约',CORE],['独立盟约',ADDON]]){
    const group=node('fieldset');group.append(node('legend','',label));const rows=node('div','capture-edit-grid');
    for(const name of names){const row=node('label','capture-edit-field'),select=node('select');select.dataset.editAlliance=name;select.setAttribute('aria-label','修正盟约 '+name);select.append(option('uncertain','待确认／未识别'),option('active','点亮 · 可用'),option('inactive','置灰 · 不可用'));select.value=current.conflictFields.alliances?.includes(name)?'uncertain':current.alliances.find(a=>a.name===name)?.state||'uncertain';row.append(node('span','',name+(current.conflictFields.alliances?.includes(name)?' · 冲突':'')),select);rows.append(row);}group.append(rows);alliances.append(group);
  }
  fields.append(alliances,node('p','capture-note','修改后会实时更新文字与标记结果；核对后点击「套用已识别内容」。'));
}
function commit(field){
  current.manualFields=[...new Set([...(current.manualFields||[]),field])];current=assessResult(current);changed(current);
}
export function setEditableResult(value){
  current=assessResult(JSON.parse(JSON.stringify(value)));$('editor').hidden=false;$('editor').open=false;render();return current;
}
export function clearEditor(){current=null;$('editor').hidden=true;$('editor').open=false;$('editor-fields').replaceChildren();}
export function initEditor(onChange){
  changed=onChange;
  $('editor-fields').addEventListener('change',event=>{
    if(!current)return;const input=event.target;
    if(input.dataset.editField){
      const key=input.dataset.editField;current[key]=input.value||null;delete current.conflictFields[key];
      if(key==='difficulty'){const level=input.value.match(/^规程等级(\d+)$/);current.level=level?Number(level[1]):null;delete current.conflictFields.level;}
      input.previousElementSibling.textContent=key==='mode'?'模拟方式':key==='boss'?'Boss':'难度';commit({mode:'模拟方式',boss:'Boss',difficulty:'难度'}[key]);
    }else if(input.dataset.editType){
      current.types=[...$('editor-fields').querySelectorAll('[data-edit-type]:checked')].map(el=>el.dataset.editType);
      if(!current.conflictFields.types){$('editor-fields').querySelector('[data-confirm-types]').hidden=true;$('editor-fields').querySelector('.capture-edit-types>legend').textContent='特训类别';}
      commit('特训类别');
    }else if(input.dataset.editAlliance){
      const name=input.dataset.editAlliance;current.alliances=current.alliances.filter(a=>a.name!==name);current.alliances.push({name,state:input.value});
      current.conflictFields.alliances=(current.conflictFields.alliances||[]).filter(n=>n!==name);input.previousElementSibling.textContent=name;
      commit('盟约：'+name);$('editor-fields').querySelector('.capture-edit-alliances>summary').textContent='盟约状态 · '+current.alliances.filter(a=>['active','inactive'].includes(a.state)).length+'/26 已确认';
    }
  });
  $('editor-fields').addEventListener('click',event=>{if(current&&event.target.closest('[data-confirm-types]')){delete current.conflictFields.types;event.target.closest('button').hidden=true;$('editor-fields').querySelector('.capture-edit-types>legend').textContent='特训类别';commit('特训类别');}});
}
