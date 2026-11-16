const model=window.GARRISON_WORKSPACE,data=window.GARRISON_DATA;
const $=id=>document.getElementById('capture-mark-'+id);
let items=[],currentResult=null,candidates=[],active=-1,opened=false;
const label=item=>item.kind==='alliance'?item.name:data.operators.find(o=>o.id===item.id)?.name||'未知干员';
const kind=item=>item.kind==='alliance'?'盟约':'干员';
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
function change(next){document.dispatchEvent(new CustomEvent('garrison:marks-change',{detail:next}));}
function buckets(){const out={available:[],banned:[],unknown:[]};for(const item of items)out[model.markedItemStatus(item,currentResult)].push(item);return out;}
export function markedResultText(){if(!currentResult||!items.length)return '';const groups=buckets(),lines=['标记对象'];for(const[state,title]of [['available','未被 BAN'],['banned','被 BAN'],['unknown','待确认']])if(groups[state].length)lines.push(title+'：'+groups[state].map(item=>label(item)+(item.kind==='alliance'?'（盟约）':'')).join('、'));return lines.join('\n');}
function renderResults(){
  const root=$('results');root.replaceChildren();root.hidden=!currentResult;
  if(!currentResult)return;
  root.append(element('h4','','标记对象 · 本次识别'));
  if(!items.length){root.append(element('p','capture-note','尚未标记对象，可在左侧输入干员或盟约名字添加。'));return;}
  const groups=buckets();
  for(const[state,title]of [['available','未被 BAN'],['banned','被 BAN'],['unknown','待确认']]){
    if(!groups[state].length)continue;
    const row=element('section','mark-status-group mark-status-'+state),heading=element('h5','',title+' · '+groups[state].length),list=element('div','mark-status-items');
    for(const item of groups[state]){const tag=element('span','mark-status-item',label(item));tag.dataset.markKey=model.markedItemKey(item);tag.append(element('small','',kind(item)));list.append(tag);}
    row.append(heading,list);root.append(row);
  }
  root.append(element('p','capture-note','按本次截图的盟约状态与 Wiki 现有规则推断；缺失或冲突保留为待确认，实际禁用名单以游戏为准。'));
}
function renderSelected(){
  $('selected').replaceChildren(...items.map(item=>{const chip=element('span','mark-chip');chip.append(element('small','',kind(item)),document.createTextNode(label(item)));const button=element('button','','×');button.type='button';button.setAttribute('aria-label','移除标记'+kind(item)+' '+label(item));button.onclick=()=>change(items.filter(m=>model.markedItemKey(m)!==model.markedItemKey(item)));chip.append(button);return chip;}));
  $('count').textContent=items.length+' 项';$('empty').hidden=Boolean(items.length);
}
function close(){opened=false;$('suggestions').hidden=true;$('search').setAttribute('aria-expanded','false');$('search').removeAttribute('aria-activedescendant');}
function add(item){change([...items,item]);$('search').value='';close();$('search').focus();}
function renderSuggestions(){
  const query=$('search').value.trim();if(!query){close();return;}
  candidates=model.searchMarkedItems(query,items);if(active>=candidates.length)active=candidates.length-1;
  const list=$('suggestions');list.replaceChildren();list.hidden=false;opened=true;$('search').setAttribute('aria-expanded','true');
  for(const[item,index]of candidates.map((item,index)=>[item,index])){const option=element('button','mark-option');option.type='button';option.id='capture-mark-option-'+index;option.setAttribute('role','option');option.setAttribute('aria-selected',String(index===active));option.append(element('span','',item.name),element('small','',kind(item)+' · '+item.detail));option.onclick=()=>add(item);list.append(option);}
  if(!candidates.length)list.append(element('p','capture-note','没有新的匹配项目，可能已经标记；也可尝试输入部分名字。'));
  if(active>=0&&candidates.length){$('search').setAttribute('aria-activedescendant','capture-mark-option-'+active);list.children[active]?.scrollIntoView({block:'nearest'});}else $('search').removeAttribute('aria-activedescendant');
}
export function updateMarkedResult(result){currentResult=result;renderResults();}
export function initMarkedItems(){
  document.addEventListener('garrison:marks-updated',e=>{items=model.normalizeMarkedItems(e.detail);renderSelected();renderResults();if(opened)renderSuggestions();});
  $('search').oninput=()=>{active=-1;renderSuggestions();};$('search').onfocus=()=>{if($('search').value.trim())renderSuggestions();};
  $('search').onkeydown=e=>{if(e.isComposing)return;if(e.key==='Escape'){close();return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!opened)renderSuggestions();if(candidates.length){active=e.key==='ArrowDown'?(active+1)%candidates.length:active<0?candidates.length-1:(active-1+candidates.length)%candidates.length;renderSuggestions();}}else if(e.key==='Enter'&&opened&&candidates.length){e.preventDefault();add(candidates[active>=0?active:0]);}};
  document.addEventListener('click',e=>{if(!$('editor').contains(e.target))close();});
  document.dispatchEvent(new Event('garrison:marks-request'));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>document.dispatchEvent(new Event('garrison:marks-request')),{once:true});
}
