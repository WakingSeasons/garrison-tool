"use strict";

(() => {
  const catalog=window.GARRISON_ENEMIES;
  const page=document.querySelector('[data-section-panel="enemies"]');
  const results=document.getElementById('enemy-report-results');
  const count=document.getElementById('enemy-report-count');
  const state={category:'all',query:'',initialized:false,session:null};
  const normalize=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,'');
  const bossIds=[...new Set(Object.values(catalog.bosses))];
  const candidateCount=new Set(Object.values(catalog.groups).flatMap(group=>group.ids)).size;
  const categories=['current','all','boss',...Object.keys(catalog.groups)];
  function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
  function card(enemy,boss){
    const link=node('a','enemy-reference-card'+(boss?' enemy-reference-boss':''));link.href='https://prts.wiki/w/'+encodeURIComponent(enemy.name);link.target='_blank';link.rel='noopener noreferrer';link.title='在 PRTS 查看 '+enemy.name;link.setAttribute('aria-label',enemy.name+'，在 PRTS 查看');link.dataset.enemyId=enemy.id;link.dataset.strength=String(enemy.strength);
    const image=document.createElement('img');image.src=enemy.image;image.alt='';image.width=48;image.height=48;image.loading='lazy';image.decoding='async';image.addEventListener('error',()=>{image.hidden=true;link.prepend(node('span','enemy-reference-fallback','?'));},{once:true});
    link.append(image,node('span','enemy-reference-name',enemy.name),node('span','enemy-reference-arrow','↗'));return link;
  }
  function render(){
    state.initialized=true;const needle=normalize(state.query);const sections=[];let total=0;
    const add=(key,title,ids,boss=false)=>{
      const current=state.category==='current';
      if(current&&(!state.session||!boss&&!state.session.types.includes(key)))return;
      if(!current&&state.category!=='all'&&state.category!==key)return;
      const list=[...new Set(ids)].map(id=>catalog.enemies[id]).filter(e=>e&&(!current||!boss||e.id===catalog.bosses[state.session.boss])&&(normalize(e.name).includes(needle)||normalize(title+(boss?'boss领袖':'')).includes(needle)));
      if(!boss)list.sort((a,b)=>a.strength-b.strength||a.id.localeCompare(b.id));
      if(!list.length)return;total+=list.length;
      const group=node('section','catalog-group enemy-reference-group');group.dataset.enemyGroup=key;
      const heading=node('h3','',title);heading.append(node('small','',String(list.length)));group.append(heading);
      if(!boss)group.append(node('p','enemy-reference-order','较弱 → 较强'));
      const grid=node('div','enemy-reference-grid');for(const e of list)grid.append(card(e,boss));group.append(grid);sections.push(group);
    };
    add('boss','敌方领袖（Boss）',bossIds,true);
    for(const [name,group]of Object.entries(catalog.groups))add(name,'特训敌人 · '+name,group.ids);
    results.replaceChildren(...sections);if(!sections.length){const empty=node('div','relation-empty');empty.append(node('h3','','没有匹配的敌人'),node('p','','可以换个名称，或选择其他类别。'));results.append(empty);}
    const current=state.category==='current'&&state.session;
    count.textContent=current?'本局：'+state.session.boss+' · '+state.session.types.join(' / '):state.category==='all'&&!needle?bossIds.length+' 名领袖 · '+candidateCount+' 种特训敌人':'显示 '+total+' 项';
    for(const button of page.querySelectorAll('[data-enemy-category]')){const selected=button.dataset.enemyCategory===state.category;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));}
    results.scrollTop=0;
  }
  const filters=page.querySelector('.enemy-category-options');
  for(const category of categories){const button=node('button','filter-button',category==='current'?'本局':category==='all'?'全部':category==='boss'?'Boss':category);button.type='button';button.dataset.enemyCategory=category;button.hidden=category==='current';button.setAttribute('aria-pressed',String(category==='all'));if(category==='all')button.classList.add('selected');button.onclick=()=>{state.category=category;render();};filters.append(button);}
  window.GARRISON_ENEMY_PAGE={setSession(session){if(JSON.stringify(session)===JSON.stringify(state.session))return;state.session=session;state.category=session?'current':'all';page.querySelector('[data-enemy-category=current]').hidden=!session;state.initialized=false;},setQuery(query){if(state.initialized&&query===state.query)return;state.query=query;render();}};
})();
