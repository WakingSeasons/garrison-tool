const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context={window:{}};
for(const file of ['data.js','alliances.js','strategy-data.js','equipment-data.js','research-data.js','research-query.js','filters.js','enemy-data.js','workspace.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const model=context.window.GARRISON_WORKSPACE,data=context.window.GARRISON_DATA;
const names=[...data.coreAlliances,...data.addonAlliances],copy=x=>JSON.parse(JSON.stringify(x));
function sample(){return{mode:'独立模拟',difficulty:'规程等级20',level:20,boss:'假想敌：铳',types:['飞行','复苏'],alliances:names.map(name=>({name,state:['炎','奥术'].includes(name)?'inactive':'active'})),conflicts:[],conflictFields:{},complete:true};}

test('模式和难度未知仍可套用确认字段，不假定同盟三类',()=>{
  const s=model.create(),r=sample();r.mode=null;r.difficulty=null;r.level=null;r.complete=false;
  assert.equal(model.applyRecognition(s,r).ok,true);assert.deepEqual(copy(s.bannedAlliances),['炎','奥术']);
  assert.equal(s.sessionContext.mode,null);assert.equal(s.sessionContext.difficulty,null);assert.equal(s.sessionContext.typesComplete,false);assert.deepEqual(copy(s.sessionContext.types),['飞行','复苏']);
});
test('部分盟约只更新确认项，旧值明确待核对且未知干员不误隐藏',()=>{
  const s=model.create();s.bannedAlliances=['炎','奥术'];const r=sample();r.alliances=r.alliances.filter(a=>a.name!=='炎');r.complete=false;
  assert.equal(model.applyRecognition(s,r).ok,true);assert.ok(s.bannedAlliances.includes('炎'));assert.ok(s.unconfirmedAlliances.includes('炎'));
  assert.equal(model.operatorStatus({tier:1,alliances:['炎']},s),'unknown');assert.equal(model.operatorStatus({tier:1,alliances:['奥术']},s),'banned');
  assert.equal(model.operatorStatus({tier:1,alliances:['炎','聚合']},s),'available');
});
test('Boss与类别独立更新，未识别值沿用并标记，刷新不丢标记',()=>{
  const s=model.create();model.applyRecognition(s,sample());const r=sample();r.boss=null;r.types=['持续'];r.complete=false;
  assert.equal(model.applyRecognition(s,r).ok,true);assert.equal(s.sessionContext.boss,'假想敌：铳');assert.equal(s.sessionContext.retainedBoss,true);assert.deepEqual(copy(s.sessionContext.types),['持续']);assert.equal(s.sessionContext.typesComplete,false);
  const restored=model.restore(JSON.stringify(s));assert.deepEqual(copy(restored.sessionContext),copy(s.sessionContext));
});
test('冲突只隔离相应字段，不影响其他确认内容',()=>{
  const s=model.create(),r=sample();r.boss=null;r.alliances.find(a=>a.name==='炎').state='uncertain';r.conflicts=['Boss不同','炎状态不同'];r.conflictFields={boss:true,alliances:['炎']};
  assert.equal(model.applyRecognition(s,r).ok,true);assert.equal(s.sessionContext.boss,null);assert.deepEqual(copy(s.sessionContext.types),['飞行','复苏']);assert.ok(s.unconfirmedAlliances.includes('炎'));assert.ok(!s.bannedAlliances.includes('炎'));
});
test('无有效内容和非法字段不修改状态，complete标记不作为凭据',()=>{
  for(const raw of [{complete:true},{...sample(),boss:'不存在'},{...sample(),types:['不存在']},{alliances:[{name:'不存在',state:'inactive'}]}, {...sample(),alliances:[{name:'炎',state:'active'},{name:'炎',state:'inactive'}]}]){
    const s=model.create(),before=JSON.stringify(s);assert.equal(model.applyRecognition(s,raw).ok,false);assert.equal(JSON.stringify(s),before);
  }
});
test('已确认的完整结果清除旧待确认状态，保留阵容和两侧检索',()=>{
  const s=model.create();s.unconfirmedAlliances=['炎'];model.addMember(s,data.operators.find(o=>o.name==='黍').id);model.openCompare(s,'奥术');const before=JSON.stringify([s.members,s.panes,s.markedItems]);
  assert.equal(model.applyRecognition(s,sample()).ok,true);assert.deepEqual(copy(s.unconfirmedAlliances),[]);assert.equal(s.sessionContext.typesComplete,true);assert.equal(JSON.stringify([s.members,s.panes,s.markedItems]),before);
});
test('模式数量冲突只阻止类型覆盖，已知Boss和BAN仍可用',()=>{
  const s=model.create();model.applyRecognition(s,sample());const r=sample();r.types=['飞行','复苏','元素'];
  assert.equal(model.applyRecognition(s,r).ok,true);assert.deepEqual(copy(s.sessionContext.types),['飞行','复苏']);assert.equal(s.sessionContext.retainedTypes,true);
});
test('模式与难度可单独确认，缺失的旧元数据保留但不用于数量判断',()=>{
  const s=model.create();assert.equal(model.applyRecognition(s,{mode:'独立模拟',alliances:[],types:[],conflicts:[],conflictFields:{}}).ok,true);assert.equal(s.sessionContext.mode,'独立模拟');
  model.applyRecognition(s,sample());const r=sample();r.mode=null;r.difficulty=null;r.level=null;
  model.applyRecognition(s,r);assert.equal(s.sessionContext.mode,'独立模拟');assert.equal(s.sessionContext.retainedMode,true);assert.equal(s.sessionContext.retainedDifficulty,true);assert.equal(s.sessionContext.typesComplete,false);
});
